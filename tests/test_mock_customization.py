from copy import deepcopy
import json
import re

import pytest

from src.mock_ai import customization_prompt, parse_recipe_draft
from src.mock_engine import iter_rows
from src.mock_models import new_recipe, export_recipe, import_recipe, recipe_issues
from src.mock_regex import compile_pattern


@pytest.mark.parametrize("pattern", [r"^[A-Z]{3}-\d{4}$", r"(cat|dog)-[1-9]\d?",
                                      r"[^0-9]{2,8}", r"\w+@example\.com",
                                      r"(?:red|green|blue)_[a-z]*", r"\s\D\W\S.",
                                      r"東京-(A|B){2,4}", r"[A-Z]{2,5}?"])
def test_regex_matches_and_is_repeatable(pattern):
    recipe = new_recipe()
    table = recipe["tables"][0]
    table["rows"] = 120
    table["fields"][1]["generator"] = {"kind": "regex", "pattern": pattern}
    assert not recipe_issues(recipe)
    values = list(iter_rows(recipe, table))
    assert all(re.fullmatch(pattern, row[1]) for row in values)
    assert values == list(iter_rows(recipe, table))
    assert values[:50] == list(iter_rows(recipe, table, 50))
    assert import_recipe(export_recipe(recipe)) == recipe
    recipe["seed"] += 1
    assert values != list(iter_rows(recipe, table))


@pytest.mark.parametrize("pattern", ["[", "", "a{4001}", "(?=a)a", r"(a)\1",
                                      "(?i)abc", "a^b", "(a$|b)", "(){4000}",
                                      "((a{200}){200}){200}", "[a-z]{201}"])
def test_unsupported_or_oversized_regex_rejected(pattern):
    with pytest.raises(ValueError):
        compile_pattern(pattern, 200)
    recipe = new_recipe()
    recipe["tables"][0]["fields"][1]["generator"] = {"kind": "regex", "pattern": pattern}
    assert recipe_issues(recipe)


def test_regex_nulls_and_type_validation():
    recipe = new_recipe()
    table = recipe["tables"][0]
    field = table["fields"][1]
    field.update(generator={"kind": "regex", "pattern": "SKU-[0-9]{4}"}, null_pct=100)
    assert all(row[1] is None for row in iter_rows(recipe, table, 10))
    field["type"] = "integer"
    assert recipe_issues(recipe)


def test_ai_recipe_parsing_and_prompt():
    recipe = new_recipe()
    before = deepcopy(recipe)
    prompt = customization_prompt(recipe, "80% active products with SKU codes")
    assert "80% active products" in prompt and '"regex"' in prompt
    assert recipe == before
    assert parse_recipe_draft("```json\n" + export_recipe(recipe) + "\n```") == recipe
    recipe["tables"][0]["fields"][1]["generator"] = {"kind": "regex", "pattern": "(?=x)x"}
    with pytest.raises(ValueError):
        parse_recipe_draft(json.dumps(recipe))
    with pytest.raises(ValueError):
        parse_recipe_draft('{"tables": []}')
    with pytest.raises(ValueError):
        parse_recipe_draft("not JSON")


def test_regex_all_exports(tmp_path):
    from src.mock_worker import run_job
    recipe = new_recipe()
    recipe["tables"][0]["rows"] = 12
    recipe["tables"][0]["fields"][1]["generator"] = {"kind": "regex", "pattern": "SKU-[0-9]{4}"}
    for fmt in ("csv", "json", "jsonl", "text", "parquet"):
        recipe["output"]["format"] = fmt
        directory = tmp_path / fmt
        directory.mkdir()
        run_job(directory, {"workspace_id": "w", "job_id": "j", "revision": 0, "recipe": recipe}, batch_size=3)
        status = json.loads((directory / "status.json").read_text())
        assert status["status"] == "complete", status
        assert status["completed_rows"] == 12
