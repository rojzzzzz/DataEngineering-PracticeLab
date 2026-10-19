from copy import deepcopy
from pathlib import Path
import pytest
from streamlit.testing.v1 import AppTest

from src import config, constructor_store
from src.mock_models import new_recipe, new_field
from src.mock_ui import commit


def widget(items, label):
    return next(item for item in items if item.label == label)


@pytest.fixture
def mock_app(tmp_path, monkeypatch):
    monkeypatch.setattr(config, "DB_PATH", tmp_path / "test.db")
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=30).run()
    widget(app.radio, "Navigate").set_value("Constructor Mode").run()
    assert widget(app.button, "Open Mock Data Generator")
    widget(app.button, "Open Mock Data Generator").click().run()
    assert not app.exception
    yield app
    from src import mock_jobs
    if "mock_workspace" in app.session_state:
        mock_jobs.close(app.session_state["mock_workspace"])


def test_temporary_workspace_sections_examples_and_cleanup(mock_app):
    app = mock_app
    first = app.session_state["mock_workspace"]
    recipe = deepcopy(app.session_state["mock_recipe"])
    assert widget(app.button, "Preview 50 rows")
    assert widget(app.button, "Generate data")
    assert not any(item.label == "Workspace section" for item in app.radio)
    assert app.session_state["mock_recipe"] == recipe
    widget(app.selectbox, "Example dataset").set_value("Customers / orders")
    widget(app.button, "Load example").click().run()
    assert not app.exception
    assert len(app.session_state["mock_recipe"]["tables"]) == 2
    widget(app.button, "Back to tools").click().run()
    assert "mock_workspace" not in app.session_state
    widget(app.button, "Open Mock Data Generator").click().run()
    assert app.session_state["mock_workspace"] != first
    widget(app.radio, "Navigate").set_value("Progress").run()
    assert "mock_recipe" not in app.session_state


def test_external_ai_recipe_review_works_without_connection(mock_app):
    import json
    app = mock_app
    original = deepcopy(app.session_state["mock_recipe"])
    widget(app.text_area, "Describe your dataset").set_value("A small product catalog").run()
    assert any(d.label == "Download customization prompt" for d in app.get("download_button"))
    proposal = deepcopy(original)
    proposal["seed"] = 719
    widget(app.text_area, "Paste proposed recipe JSON").set_value(json.dumps(proposal)).run()
    widget(app.button, "Review pasted recipe").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"] == original
    # Editing the request invalidates the reviewed proposal until another review.
    widget(app.text_area, "Describe your dataset").set_value("A different catalog").run()
    assert not any(b.label == "Apply AI recipe" and not b.disabled for b in app.button)
    widget(app.button, "Review pasted recipe").click().run()
    widget(app.button, "Apply AI recipe").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"] == proposal


def test_builder_seed_rename_counts_fields_and_fk_settings(mock_app):
    app = mock_app
    widget(app.text_input, "Random seed").set_value("99").run()
    assert not app.exception

    assert app.session_state["mock_recipe"]["seed"] == 99
    widget(app.text_input, "Table name").set_value("new name").run()
    widget(app.number_input, "Rows in this table").set_value(100).run()
    assert not app.exception
    assert app.session_state["mock_recipe"]["tables"][0]["name"] == "new name"
    assert app.session_state["mock_recipe"]["tables"][0]["rows"] == 100
    widget(app.button, "Add column").click().run()
    assert not app.exception
    assert len(app.session_state["mock_recipe"]["tables"][0]["fields"]) == 3
    widget(app.selectbox, "Example dataset").set_value("Customers / orders")
    widget(app.button, "Load example").click().run()
    recipe = app.session_state["mock_recipe"]
    child = recipe["tables"][1]
    widget(app.selectbox, "Table").set_value(child["id"]).run()
    widget(app.selectbox, "Column to configure").set_value(child["fields"][1]["id"]).run()
    assert not app.exception
    assert widget(app.selectbox, "Parent primary key")
    widget(app.button, "Save column rules").click().run()
    assert not app.exception


def test_large_column_lists_keep_all_fields_when_paging_and_searching(mock_app):
    app = mock_app
    recipe = deepcopy(app.session_state["mock_recipe"])
    table = recipe["tables"][0]
    table["fields"] = [new_field(f"field_{i}", "integer", i == 0) for i in range(45)]
    app.session_state["mock_recipe"] = recipe
    app.session_state["mock_revision"] += 1
    app.run()
    assert not app.exception
    assert len([item for item in app.text_input if item.label == "Column name"]) == 20
    widget(app.number_input, "Column page").set_value(3).run()
    assert not app.exception
    names = [item.value for item in app.text_input if item.label == "Column name"]
    assert names == [f"field_{i}" for i in range(40, 45)]
    widget(app.text_input, "Find columns").set_value("field_44").run()
    assert widget(app.number_input, "Column page").value == 1
    assert len([item for item in app.text_input if item.label == "Column name"]) == 1
    widget(app.text_input, "Column name").set_value("renamed_last_field").run()
    assert not app.exception
    fields = app.session_state["mock_recipe"]["tables"][0]["fields"]
    assert len(fields) == 45 and fields[-1]["name"] == "renamed_last_field"
    assert fields[0]["name"] == "field_0"
    widget(app.text_input, "Find columns").set_value("").run()
    widget(app.button, "Add column").click().run()
    assert not app.exception
    assert widget(app.number_input, "Column page").value == 3
    assert len(app.session_state["mock_recipe"]["tables"][0]["fields"]) == 46
    assert "column_46" in [item.value for item in app.text_input if item.label == "Column name"]


def test_referenced_field_removal_blocked(mock_app):
    app = mock_app
    widget(app.selectbox, "Example dataset").set_value("Customers / orders")
    widget(app.button, "Load example").click().run()
    assert widget(app.button, "Remove table").disabled
    widget(app.checkbox, "Remove this column from the recipe").check().run()
    assert widget(app.button, "Remove column").disabled
    assert any("Referenced by" in warning.value for warning in app.warning)


def test_edits_invalidate_jobs_and_revisions(monkeypatch):
    from src import mock_ui
    recipe = new_recipe()
    class State(dict):
        __getattr__ = dict.__getitem__
        __setattr__ = dict.__setitem__
    state = State(mock_workspace="w", mock_revision=0, mock_recipe=recipe, mock_preview={"rows": []})
    monkeypatch.setattr(mock_ui.st, "session_state", state)
    closed = []
    monkeypatch.setattr(mock_ui.jobs, "close", closed.append)
    monkeypatch.setattr(mock_ui.st, "rerun", lambda: None)
    changed = deepcopy(recipe)
    changed["seed"] = 99
    commit(changed)
    assert closed == ["w"]
    assert state["mock_revision"] == 1
    assert "mock_preview" not in state


def test_diagram_copy_mapping_can_be_confirmed(mock_app):
    from src.diagrams import empty_diagram
    d = empty_diagram("logical_erd")
    d["entities"] = [{"id": "a", "name": "customers", "position": {"x": 0, "y": 0}, "fields": [{"id": "i", "name": "id", "data_type": "BIGINT", "pk": True}]},
                     {"id": "b", "name": "orders", "position": {"x": 300, "y": 0}, "fields": [{"id": "i", "name": "id", "data_type": "BIGINT", "pk": True}, {"id": "fk", "name": "customer_id", "data_type": "BIGINT", "fk": True}]}]
    d["relationships"] = [{"id": "r", "source": "a", "target": "b", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False}]
    constructor_store.init_constructor(config.DB_PATH)
    identity = constructor_store.create_diagram(config.DB_PATH, "Fixture", diagram=d)
    app = mock_app.run()
    widget(app.button, "Import a diagram copy").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"]["pending_mappings"]
    widget(app.button, "Confirm column mapping").click().run()
    assert not app.exception
    assert not app.session_state["mock_recipe"]["pending_mappings"]
    assert constructor_store.load_diagram(config.DB_PATH, identity)["diagram"]["entities"][1]["fields"][1]["fk"]



def test_inline_columns_types_formats_and_validation(mock_app):
    app = mock_app
    columns = lambda: [w for w in app.text_input if w.label == "Column name"]
    columns()[1].set_value("email_address").run()
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["name"] == "email_address"
    [w for w in app.selectbox if w.label == "Data to generate"][1].set_value("faker:email").run()
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["generator"]["provider"] == "email"
    [w for w in app.selectbox if w.label == "Data type"][1].set_value("decimal").run()
    field = app.session_state["mock_recipe"]["tables"][0]["fields"][1]
    assert field["type"] == "decimal" and field["generator"]["kind"] == "number"
    for fmt in ("json", "jsonl", "parquet", "text", "csv"):
        widget(app.selectbox, "File format").set_value(fmt).run()
        assert app.session_state["mock_recipe"]["output"]["format"] == fmt
        assert not app.exception
    columns()[1].set_value("id").run()
    assert widget(app.button, "Generate data").disabled
    columns()[1].set_value("amount").run()
    assert not widget(app.button, "Generate data").disabled
    widget(app.text_input, "Random seed").set_value("invalid").run()
    assert widget(app.button, "Generate data").disabled


def test_generate_download_and_edit_invalidates_file(mock_app):
    import time
    from src import mock_jobs
    app = mock_app
    widget(app.number_input, "Rows in this table").set_value(12).run()
    widget(app.selectbox, "File format").set_value("json").run()
    widget(app.button, "Generate data").click().run()
    job = mock_jobs.get(app.session_state["mock_workspace"])
    deadline = time.monotonic() + 25
    while job.status()["status"] == "running" and time.monotonic() < deadline:
        time.sleep(.1)
    assert job.status()["status"] == "complete", job.status()
    app.run()
    assert not app.exception
    assert any("Download sample.json" == w.label for w in app.get("download_button"))
    widget(app.number_input, "Rows in this table").set_value(15).run()
    assert not any("Download sample.json" == w.label for w in app.get("download_button"))


def test_regex_controls_and_validation(mock_app):
    app = mock_app
    field = app.session_state["mock_recipe"]["tables"][0]["fields"][1]
    [w for w in app.selectbox if w.label == "Data to generate"][1].set_value("regex").run()
    assert widget(app.selectbox, "Column to configure").value == field["id"]
    widget(app.selectbox, "Column to configure").set_value(field["id"]).run()
    widget(app.text_input, "RegEx pattern").set_value("INV-[0-9]{6}")
    widget(app.button, "Save column rules").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["generator"]["pattern"] == "INV-[0-9]{6}"
    widget(app.text_input, "RegEx pattern").set_value("[")
    widget(app.button, "Save column rules").click().run()
    assert not app.exception
    assert widget(app.button, "Generate data").disabled
    assert any("Invalid RegEx" in w.value for w in app.warning)


def test_saved_recipe_recovers_applied_and_unapplied_rules(mock_app):
    app = mock_app
    name_field = app.session_state["mock_recipe"]["tables"][0]["fields"][1]["id"]
    widget(app.text_input, "Recipe name").set_value("Customer data")
    widget(app.button, "Rename recipe").click().run()
    widget(app.selectbox, "Column to configure").set_value(name_field).run()
    widget(app.number_input, "Maximum text length").set_value(50).run()
    assert widget(app.button, "Generate data").disabled
    assert widget(app.button, "Preview 50 rows").disabled
    assert any("Unapplied column rules: name" in w.value for w in app.warning)
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["max_length"] == 200
    widget(app.button, "Back to tools").click().run()
    widget(app.button, "Open Mock Data Generator").click().run()
    assert widget(app.selectbox, "Saved recipe").options == ["Customer data"]
    widget(app.selectbox, "Column to configure").set_value(name_field).run()
    assert widget(app.number_input, "Maximum text length").value == 50
    assert widget(app.button, "Generate data").disabled
    widget(app.button, "Save column rules").click().run()
    assert not app.exception
    assert not widget(app.button, "Generate data").disabled
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["max_length"] == 50
    widget(app.button, "Duplicate recipe").click().run()
    assert len(widget(app.selectbox, "Saved recipe").options) == 2
    assert widget(app.text_input, "Recipe name").value == "Customer data (copy)"


def test_pending_rules_across_columns_can_be_discarded(mock_app):
    app = mock_app
    fields = app.session_state["mock_recipe"]["tables"][0]["fields"]
    widget(app.text_input, "Start").set_value("50").run()
    widget(app.selectbox, "Column to configure").set_value(fields[1]["id"]).run()
    assert widget(app.button, "Generate data").disabled
    widget(app.number_input, "Maximum text length").set_value(100).run()
    widget(app.button, "Save column rules").click().run()
    assert widget(app.button, "Generate data").disabled
    widget(app.selectbox, "Column to configure").set_value(fields[0]["id"]).run()
    assert widget(app.text_input, "Start").value == "50"
    widget(app.button, "Discard unapplied column rules").click().run()
    assert widget(app.text_input, "Start").value == "1"
    assert not widget(app.button, "Generate data").disabled


def test_friendly_choices_validate_weights_and_apply(mock_app):
    app = mock_app
    [w for w in app.selectbox if w.label == "Data to generate"][1].set_value("choice").run()
    field = app.session_state["mock_recipe"]["tables"][0]["fields"][1]
    key = f"mock_rule_{field['id']}_choice_editor"
    app.session_state[key] = {"edited_rows": {0: {"Value": "completed", "Weight": 0}}, "added_rows": [], "deleted_rows": []}
    app.run()
    assert widget(app.button, "Save column rules").disabled
    assert widget(app.button, "Generate data").disabled
    assert any("total more than zero" in e.value for e in app.error)
    app.session_state[key] = {"edited_rows": {0: {"Value": "completed", "Weight": 70}},
                              "added_rows": [{"Value": "pending", "Weight": 30}], "deleted_rows": []}
    app.run()
    assert any("70.0%" in c.value for c in app.caption)
    widget(app.button, "Save column rules").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][1]["generator"] == {
        "kind": "choice", "values": ["completed", "pending"], "weights": [70., 30.]}
    assert not widget(app.button, "Generate data").disabled


def test_dependent_column_ui_selects_same_row_sources(mock_app):
    app = mock_app
    widget(app.button, "Add column").click().run()
    fields = app.session_state["mock_recipe"]["tables"][0]["fields"]
    [w for w in app.selectbox if w.label == "Data type"][-1].set_value("decimal").run()
    widget(app.selectbox, "Value rule").set_value("multiply").run()
    assert widget(app.button, "Generate data").disabled
    widget(app.selectbox, "First source column").set_value(fields[0]["id"]).run()
    widget(app.selectbox, "Second source column").set_value(fields[0]["id"]).run()
    widget(app.button, "Save column rules").click().run()
    assert not app.exception
    assert not widget(app.button, "Generate data").disabled
    assert app.session_state["mock_recipe"]["tables"][0]["fields"][-1]["generator"]["kind"] == "multiply"


def test_conflicted_recipe_preserves_unfinished_work_and_requires_recovery(mock_app):
    from src import mock_store
    app = mock_app
    identity = app.session_state["mock_saved_id"]
    path = app.session_state["mock_store_path"]
    saved = mock_store.load(path, identity)
    external = deepcopy(saved["payload"])
    external["recipe"]["seed"] = 99
    mock_store.save(path, identity, external, saved["revision"])
    field_id = saved["payload"]["recipe"]["tables"][0]["fields"][1]["id"]
    widget(app.selectbox, "Column to configure").set_value(field_id).run()
    # The conflict is detected at the end of that run. The next render presents recovery.
    app.run()
    assert widget(app.button, "New recipe").disabled
    assert widget(app.selectbox, "Saved recipe").disabled
    assert any(w.label == "Download draft recovery JSON" for w in app.get("download_button"))
    assert not any(w.label == "Generate data" for w in app.button)
    widget(app.button, "Back to tools").click().run()
    widget(app.button, "Open Mock Data Generator").click().run()
    assert any("newer version" in e.value for e in app.error)
    assert app.session_state["mock_recipe"]["seed"] == 42
    widget(app.button, "Save draft as a new recipe").click().run()
    assert not app.exception
    assert app.session_state["mock_saved_id"] != identity
    assert app.session_state["mock_recipe"]["seed"] == 42
    assert mock_store.load(path, identity)["payload"]["recipe"]["seed"] == 99


def test_invalid_seed_draft_survives_reopen_and_can_be_repaired(mock_app):
    app = mock_app
    widget(app.text_input, "Random seed").set_value("1234").run()
    widget(app.text_input, "Random seed").set_value("unfinished").run()
    widget(app.button, "Back to tools").click().run()
    widget(app.button, "Open Mock Data Generator").click().run()
    assert widget(app.text_input, "Random seed").value == "unfinished"
    assert widget(app.button, "Generate data").disabled
    widget(app.text_input, "Random seed").set_value("1235").run()
    assert app.session_state["mock_recipe"]["seed"] == 1235
    assert not widget(app.button, "Generate data").disabled


def test_conflict_recovery_keeps_invalid_seed_after_hidden_widget_cleanup(mock_app):
    from src import mock_store
    app = mock_app
    widget(app.text_input, "Random seed").set_value("unfinished seed").run()
    identity = app.session_state["mock_saved_id"]
    path = app.session_state["mock_store_path"]
    doc = mock_store.load(path, identity)
    changed = deepcopy(doc["payload"])
    changed["recipe"]["seed"] = 888
    mock_store.save(path, identity, changed, doc["revision"])
    for _ in range(4):
        app.run()
    widget(app.button, "Back to tools").click().run()
    widget(app.button, "Open Mock Data Generator").click().run()
    app.run()
    widget(app.button, "Save draft as a new recipe").click().run()
    assert not app.exception
    assert widget(app.text_input, "Random seed").value == "unfinished seed"
    assert widget(app.button, "Generate data").disabled


def test_ai_recipe_review_apply_and_navigation(mock_app):
    from src.ai import AIConnection, AIRequest, AIResponse, AISession, revision
    from src.mock_models import export_recipe
    app = mock_app
    assert any(w.label == "Describe your dataset" for w in app.text_area)
    session = AISession()
    session.configure(AIConnection("Chat Completions", "https://example.com/v1", "test"))
    app.session_state["optional_ai"] = session
    app.run()
    widget(app.text_area, "Describe your dataset").set_value("Create product codes").run()
    recipe = deepcopy(app.session_state["mock_recipe"])
    proposed = deepcopy(recipe)
    proposed["tables"][0]["fields"][1].update(name="sku", generator={"kind": "regex", "pattern": "PRD-[0-9]{4}"})
    document_id = "mock:" + app.session_state["mock_workspace"]
    document_revision = revision({"recipe": recipe, "instructions": "Create product codes"})
    session.request = AIRequest("mock_customization", "prompt", document_id, document_revision)
    session.response = AIResponse(export_recipe(proposed), "test", {}, "stop")
    session.state = "completed"
    app.run()
    assert not app.exception
    assert session.state == "completed"
    assert app.session_state["mock_recipe"] == recipe
    widget(app.button, "Apply AI recipe").click().run()
    assert not app.exception
    assert app.session_state["mock_recipe"] == proposed
    assert session.state == "outdated"
    widget(app.button, "Back to tools").click().run()
    assert session.state == "cancelled"
    session.close()


def test_ai_recipe_cannot_apply_after_instruction_change(mock_app):
    from src.ai import AIConnection, AIRequest, AIResponse, AISession, revision
    from src.mock_models import export_recipe
    app = mock_app
    session = AISession()
    session.configure(AIConnection("Chat Completions", "https://example.com/v1", "test"))
    app.session_state["optional_ai"] = session
    app.run()
    widget(app.text_area, "Describe your dataset").set_value("Products").run()
    recipe = deepcopy(app.session_state["mock_recipe"])
    session.request = AIRequest("mock_customization", "prompt", "mock:" + app.session_state["mock_workspace"],
                                revision({"recipe": recipe, "instructions": "Products"}))
    session.response = AIResponse(export_recipe(recipe), "test", {}, "stop")
    session.state = "completed"
    widget(app.text_area, "Describe your dataset").set_value("Invoices").run()
    assert session.state == "outdated"
    assert not any(w.label == "Apply AI recipe" for w in app.button)
    assert app.session_state["mock_recipe"] == recipe
    session.close()
