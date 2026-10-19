from copy import deepcopy
from datetime import timedelta
from decimal import Decimal
import json

import pytest

from src import mock_store
from src.mock_engine import iter_rows
from src.mock_models import (new_recipe, new_field, validate_recipe, recipe_issues,
                             duplicate_table, dependents, export_recipe, import_recipe)
from src.mock_worker import run_job


def derived_recipe():
    recipe = new_recipe()
    table = recipe["tables"][0]
    table["rows"] = 60
    quantity = new_field("quantity", "integer")
    quantity["generator"] = {"kind": "number", "min": 1, "max": 12}
    price = new_field("unit_price", "decimal")
    price["generator"] = {"kind": "constant", "value": "1.25"}
    total = new_field("line_total", "decimal")
    total["generator"] = {"kind": "multiply", "left_field_id": quantity["id"], "right_field_id": price["id"]}
    created = new_field("created", "date")
    shipped = new_field("shipped", "date")
    shipped["generator"] = {"kind": "date_after", "source_field_id": created["id"], "min_days": 1, "max_days": 5}
    # Dependencies can appear after their results in the export.
    table["fields"] = [total, shipped, quantity, price, created, table["fields"][0]]
    return recipe


def test_same_row_dependencies_preview_reordering_and_duplicates():
    recipe = validate_recipe(derived_recipe())
    table = recipe["tables"][0]
    rows = list(iter_rows(recipe, table))
    assert list(iter_rows(recipe, table, 50)) == rows[:50]
    for total, shipped, quantity, price, created, identity in rows:
        assert total == quantity * price
        assert timedelta(days=1) <= shipped - created <= timedelta(days=5)
    assert dependents(recipe, table["id"], table["fields"][2]["id"]) == ["sample.line_total"]
    table["fields"].reverse()
    assert list(iter_rows(recipe, table)) == [tuple(reversed(row)) for row in rows]
    identity = duplicate_table(recipe, table["id"])
    assert not recipe_issues(recipe)
    copied = next(t for t in recipe["tables"] if t["id"] == identity)
    assert copied["fields"][-1]["generator"]["left_field_id"] == copied["fields"][3]["id"]
    assert import_recipe(export_recipe(recipe)) == recipe


def test_nulls_propagate_and_decimal_rounding_is_explicit():
    recipe = derived_recipe()
    total, shipped, quantity, price, created, _ = recipe["tables"][0]["fields"]
    quantity["null_pct"] = 100
    created["null_pct"] = 100
    assert all(row[0] is None and row[1] is None for row in iter_rows(validate_recipe(recipe), recipe["tables"][0]))
    quantity["null_pct"] = 0
    quantity["generator"] = {"kind": "constant", "value": 1}
    price.update(scale=3, generator={"kind": "constant", "value": "1.255"})
    assert next(iter_rows(validate_recipe(recipe), recipe["tables"][0]))[0] == Decimal("1.26")


@pytest.mark.parametrize("case", ["cycle", "missing", "self", "type", "overflow", "date_overflow", "offset", "unknown", "old_version"])
def test_invalid_dependencies_are_rejected(case):
    recipe = derived_recipe()
    total, shipped, quantity, price, created, _ = recipe["tables"][0]["fields"]
    if case == "cycle":
        quantity["generator"] = {"kind": "multiply", "left_field_id": total["id"], "right_field_id": quantity["id"]}
    elif case == "missing":
        total["generator"]["left_field_id"] = "missing"
    elif case == "self":
        total["generator"]["left_field_id"] = total["id"]
    elif case == "type":
        total["generator"]["left_field_id"] = created["id"]
    elif case == "overflow":
        total["precision"] = 2
    elif case == "date_overflow":
        created["generator"] = {"kind": "constant", "value": "9999-12-31"}
    elif case == "offset":
        shipped["generator"]["min_days"] = -1
    elif case == "unknown":
        total["generator"]["expression"] = "quantity * unit_price"
    else:
        recipe["engine_version"] = "1.0.0"
    assert recipe_issues(recipe)


def test_legacy_independent_recipe_keeps_identical_streams():
    recipe = new_recipe()
    rows = list(iter_rows(recipe, recipe["tables"][0], 3))
    recipe["engine_version"] = "1.0.0"
    assert list(iter_rows(validate_recipe(recipe), recipe["tables"][0], 3)) == rows


def test_maximum_decimal_product_is_rejected_without_context_exception():
    recipe = derived_recipe()
    table = recipe["tables"][0]
    total, _, quantity, price, *_ = table["fields"]
    for field in (quantity, price):
        field.update(type="decimal", precision=38, scale=0,
                     generator={"kind": "constant", "value": "9" * 38})
    total.update(precision=38, scale=38)
    assert any("line_total" in issue and "precision" in issue for issue in recipe_issues(recipe))


def test_relationship_summary_records_checked_parent_values(tmp_path):
    from src.mock_models import example_recipe
    recipe = example_recipe("Customers / orders")
    parent, child = recipe["tables"]
    parent["rows"], child["rows"] = 5, 12
    run_job(tmp_path, {"workspace_id": "w", "job_id": "j", "revision": 0, "recipe": recipe})
    status = json.loads((tmp_path / "status.json").read_text())
    assert status["status"] == "complete", status
    manifest = json.loads((tmp_path / "manifest.json").read_text())
    check = manifest["tables"][1]["checks"]["relationships"][child["fields"][1]["id"]]
    assert check == {"checked_values": 12, "missing_parents": 0, "relation": "many-to-one", "passed": True}


@pytest.mark.parametrize("fmt", ["csv", "json", "jsonl", "parquet", "text"])
def test_dependent_rules_generate_validated_files(tmp_path, fmt):
    recipe = derived_recipe()
    recipe["output"]["format"] = fmt
    run_job(tmp_path, {"workspace_id": "w", "job_id": "j", "revision": 0, "recipe": recipe}, batch_size=7)
    status = json.loads((tmp_path / "status.json").read_text())
    assert status["status"] == "complete", status
    manifest = json.loads((tmp_path / "manifest.json").read_text())
    table = manifest["tables"][0]
    assert table["rows"] == 60
    assert table["checks"]["primary_keys"][recipe["tables"][0]["fields"][-1]["id"]] == {"unique_values": 60, "nulls": 0, "passed": True}


def test_named_recipe_drafts_survive_reload_and_conflicts(tmp_path):
    path = tmp_path / "saved.db"
    mock_store.init_store(path)
    doc = mock_store.create(path, "Orders", {"recipe": derived_recipe(), "ui_drafts": {"unfinished": "not a number"}})
    assert mock_store.list_recipes(path)[0]["name"] == "Orders"
    changed = deepcopy(doc["payload"])
    changed["recipe"]["seed"] = 7
    revision = mock_store.save(path, doc["id"], changed, 0, "Invoices")
    assert revision == 1
    with pytest.raises(mock_store.RecipeConflict):
        mock_store.save(path, doc["id"], doc["payload"], 0)
    assert mock_store.load(path, doc["id"])["payload"] == changed
    assert mock_store.save(path, doc["id"], changed, 1) == 1
    copied = mock_store.duplicate(path, doc["id"])
    assert copied["id"] != doc["id"]
    assert copied["name"] == "Invoices (copy)"
    assert copied["payload"] == changed
    mock_store.init_store(path)
    assert len(mock_store.list_recipes(path)) == 2
