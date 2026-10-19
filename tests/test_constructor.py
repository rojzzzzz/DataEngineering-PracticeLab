import json
from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

from src import config, constructor_store as store
from src.database import init_db, list_attempts, export_progress
from src.diagrams import empty_diagram


def test_documents_are_independent_and_roundtrip(tmp_path):
    path = tmp_path / "test.db"
    init_db(path)
    before = export_progress(path)
    store.init_constructor(path)
    store.init_constructor(path)
    first = store.create_diagram(path, "Warehouse")
    doc = store.load_diagram(path, first)
    store.save_diagram(path, first, doc["diagram"])
    assert store.load_diagram(path, first)["updated_at"] == doc["updated_at"]
    value = doc["diagram"]
    value["entities"] = [{"id": "a", "name": "Orders", "position": {"x": 0, "y": 0}}]
    value["strokes"] = [{"id": "ink", "position": {"x": 5, "y": 10},
                         "points": [{"x": 3, "y": 3}, {"x": 40, "y": 60}],
                         "color": "#126e63", "width": 3}]
    store.save_diagram(path, first, value)
    saved = store.load_diagram(path, first)
    assert saved["diagram"]["entities"][0]["name"] == "Orders"
    copy = store.duplicate_diagram(path, first)
    store.rename_diagram(path, copy, "Warehouse copy")
    assert store.load_diagram(path, copy)["diagram"] == saved["diagram"]
    store.delete_diagram(path, first)
    payload = store.export_document(saved["name"], saved["diagram"])
    imported = store.import_document(path, payload, "backup.json")
    assert store.load_diagram(path, imported)["diagram"] == saved["diagram"]
    raw = store.import_document(path, json.dumps(empty_diagram("conceptual_erd")), "Raw.json")
    assert store.load_diagram(path, raw)["name"] == "Raw"
    assert len(store.list_diagrams(path)) == 3
    assert list_attempts(path) == []
    after = export_progress(path)
    # Backup generation times can differ; document data must never enter progress.
    assert after.keys() == before.keys()
    assert "Warehouse" not in json.dumps(after)


def test_invalid_import_and_kind_changes_are_atomic(tmp_path):
    path = tmp_path / "test.db"
    store.init_constructor(path)
    doc = store.create_diagram(path, "One")
    for value in ({}, [], {"format": "constructor-diagram", "version": 2},
                  {"format": "constructor-diagram", "version": 1, "name": "", "diagram": empty_diagram("logical_erd")}):
        with pytest.raises(ValueError):
            store.import_document(path, json.dumps(value), "file.json")
    with pytest.raises(ValueError):
        store.save_diagram(path, doc, empty_diagram("star_schema"))
    assert len(store.list_diagrams(path)) == 1


def widget(items, label):
    return next(item for item in items if item.label == label)


def test_diagram_picker_filters_kinds_and_reads_fresh_metadata(tmp_path):
    path = tmp_path / "test.db"
    store.init_constructor(path)
    logical = store.create_diagram(path, "Logical", "logical_erd")
    star = store.create_diagram(path, "Star", "star_schema")
    store.create_diagram(path, "Conceptual", "conceptual_erd")
    eligible = store.list_diagrams(path, kinds=("logical_erd", "star_schema"))
    assert {item["document_id"] for item in eligible} == {logical, star}
    assert all("diagram" not in item for item in eligible)
    store.rename_diagram(path, logical, "Renamed")
    assert next(item for item in store.list_diagrams(path, kinds=("logical_erd",))
                if item["document_id"] == logical)["name"] == "Renamed"
    store.delete_diagram(path, star)
    assert len(store.list_diagrams(path, kinds=("logical_erd", "star_schema"))) == 1
    assert store.list_diagrams(path, kinds=()) == []
    assert store.list_diagrams(path, kinds=("logical_erd') OR 1=1 --",)) == []


def test_mock_picker_defers_document_load_until_import(tmp_path, monkeypatch):
    from src import mock_ui
    path = tmp_path / "test.db"
    store.init_constructor(path)
    identity = store.create_diagram(path, "Import me", "logical_erd")
    loaded, imported = [], []
    original_load = store.load_diagram

    def tracked_load(path, selected):
        loaded.append(selected)
        return original_load(path, selected)

    monkeypatch.setattr(store, "load_diagram", tracked_load)
    monkeypatch.setattr(mock_ui, "replace_recipe", imported.append)
    # Keep callbacks in-process so the test exercises actual Streamlit rendering.
    app = AppTest.from_string(
        "from pathlib import Path\nfrom src.mock_models import new_recipe\n"
        "from src.mock_ui import _imports\n"
        f"_imports(new_recipe(), Path({str(path)!r}))\n"
    ).run()
    assert not app.exception
    assert loaded == []
    widget(app.button, "Import a diagram copy").click().run()
    assert not app.exception
    assert loaded == [identity]
    assert len(imported) == 1


def constructor_app(tmp_path, monkeypatch, tool="Diagram Maker"):
    from src.erd_component import _component
    _component.clear()  # AppTest creates a fresh component registry per app.
    monkeypatch.setattr(config, "DB_PATH", tmp_path / "test.db")
    # Constructor must be available without a working challenge bank.
    monkeypatch.setattr(config, "CHALLENGES_PATH", tmp_path / "missing.json")
    monkeypatch.setattr(config, "BUNDLED_CHALLENGES_PATH", tmp_path / "missing.json")
    monkeypatch.setattr(config, "SOURCE_PATH", tmp_path / "missing.json")
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=30).run()
    widget(app.radio, "Navigate").set_value("Constructor Mode").run()
    if tool:
        widget(app.button, f"Open {tool}").click().run()
    return app


def test_constructor_navigation_creation_and_reopen(tmp_path, monkeypatch):
    app = constructor_app(tmp_path, monkeypatch)
    assert not app.exception
    assert widget(app.radio, "Navigate").options == ["Practice", "Progress", "Challenge Bank", "Constructor Mode", "Optional AI"]
    assert widget(app.button, "Back to tools")
    assert not any(item.label == "Challenge family" for item in app.selectbox)
    widget(app.text_input, "Diagram name").set_value("My model")
    widget(app.button, "Create diagram").click().run()
    assert not app.exception
    first = app.session_state["constructor_active"]
    widget(app.button, "Duplicate diagram").click().run()
    assert not app.exception
    second = app.session_state["constructor_active"]
    assert first != second
    widget(app.selectbox, "Saved diagrams").set_value(first).run()
    assert app.session_state["constructor_active"] == first
    widget(app.radio, "Navigate").set_value("Practice").run()
    widget(app.radio, "Navigate").set_value("Constructor Mode").run()
    widget(app.button, "Open Diagram Maker").click().run()
    assert not app.exception
    assert app.session_state["constructor_active"] == first


def test_diagram_sql_form_parses_without_mutating_saved_diagram(tmp_path, monkeypatch):
    app = constructor_app(tmp_path, monkeypatch)
    widget(app.text_input, "Diagram name").set_value("SQL model")
    widget(app.button, "Create diagram").click().run()
    active = app.session_state["constructor_active"]
    original = store.load_diagram(config.DB_PATH, active)["diagram"]
    widget(app.text_area, "CREATE TABLE SQL").set_value("CREATE TABLE IF EXISTS customers (id INTEGER PRIMARY KEY, name VARCHAR(100));")
    widget(app.button, "Add tables to diagram").click().run()
    assert not app.exception
    command = app.session_state[f"constructor_sql_command_{active}"]
    assert command["tables"][0]["entity"]["name"] == "customers"
    assert command["tables"][0]["entity"]["fields"][0]["pk"]
    assert command["tables"][0]["ifNotExists"]
    # The browser merges into its latest local draft, then saves through the
    # existing diagram callback. Server rendering must not overwrite local edits.
    assert store.load_diagram(config.DB_PATH, active)["diagram"] == original
    assert widget(app.button, "Add tables to diagram").disabled
    # AppTest does not execute the component JavaScript; release the pending
    # command here. The browser harness verifies its actual acknowledgement.
    app.session_state[f"constructor_sql_command_{active}"] = None
    app.run()
    widget(app.text_area, "CREATE TABLE SQL").set_value("DROP TABLE customers")
    widget(app.button, "Add tables to diagram").click().run()
    assert not app.exception and any("Only CREATE TABLE" in error.value for error in app.error)
    assert store.load_diagram(config.DB_PATH, active)["diagram"] == original


def test_tool_menu_and_temporary_sql_lifecycle(tmp_path, monkeypatch):
    from src.sql_tools_component import _component
    _component.clear()
    app = constructor_app(tmp_path, monkeypatch, tool=None)
    assert not app.exception
    assert widget(app.button, "Open Diagram Maker")
    assert widget(app.button, "Open SQL Playground & Formatter")
    assert not any(item.label == "Saved diagrams" for item in app.selectbox)
    widget(app.button, "Open SQL Playground & Formatter").click().run()
    assert not app.exception
    first = app.session_state["sql_tools_workspace"]
    app.session_state["sql_tools_response"] = {"sql": "temporary"}
    widget(app.button, "Back to tools").click().run()
    assert "sql_tools_workspace" not in app.session_state
    assert "sql_tools_response" not in app.session_state
    widget(app.button, "Open SQL Playground & Formatter").click().run()
    assert app.session_state["sql_tools_workspace"] != first
    widget(app.radio, "Navigate").set_value("Progress").run()
    assert "sql_tools_workspace" not in app.session_state
    widget(app.radio, "Navigate").set_value("Constructor Mode").run()
    assert not app.exception
    assert widget(app.button, "Open SQL Playground & Formatter")


def test_removed_tool_selection_returns_to_menu(tmp_path, monkeypatch):
    app = constructor_app(tmp_path, monkeypatch, tool=None)
    app.session_state["constructor_tool"] = "removed-tool"
    app.run()
    assert not app.exception
    assert widget(app.button, "Open Diagram Maker")


def test_failed_draft_blocks_switch_and_retry_recovers(tmp_path, monkeypatch):
    app = constructor_app(tmp_path, monkeypatch)
    widget(app.text_input, "Diagram name").set_value("Draft")
    widget(app.button, "Create diagram").click().run()
    active = app.session_state["constructor_active"]
    draft = empty_diagram("logical_erd")
    draft["entities"] = [{"id": "a", "name": "Unsaved", "position": {"x": 0, "y": 0}}]
    app.session_state["constructor_drafts"] = {active: draft}
    app.session_state["constructor_errors"] = {active: "Database unavailable"}
    app.run()
    assert widget(app.selectbox, "Saved diagrams").disabled
    assert widget(app.button, "New diagram").disabled
    widget(app.button, "Retry save").click().run()
    assert not app.exception
    assert not app.session_state["constructor_drafts"]
    assert store.load_diagram(config.DB_PATH, active)["diagram"]["entities"][0]["name"] == "Unsaved"


def test_save_callback_retains_failed_draft_and_recovers(tmp_path, monkeypatch):
    from src import constructor_ui as ui
    path = tmp_path / "test.db"
    store.init_constructor(path)
    active = store.create_diagram(path, "Draft")
    state = {}
    monkeypatch.setattr(ui.st, "session_state", state)
    draft = empty_diagram("logical_erd")
    draft["entities"] = [{"id": "a", "name": "x" * 201, "position": {"x": 0, "y": 0}}]
    ui.persist_draft(path, active, draft)
    assert state["constructor_drafts"][active] == draft
    assert active in state["constructor_errors"]
    assert not store.load_diagram(path, active)["diagram"]["entities"]
    draft["entities"][0]["name"] = "Orders"
    ui.persist_draft(path, active, draft)
    assert not state["constructor_drafts"]
    assert not state["constructor_errors"]


def test_incomplete_draft_stays_editable(tmp_path, monkeypatch):
    app = constructor_app(tmp_path, monkeypatch)
    widget(app.text_input, "Diagram name").set_value("Incomplete")
    widget(app.button, "Create diagram").click().run()
    active = app.session_state["constructor_active"]
    draft = empty_diagram("logical_erd")
    draft["entities"] = [{"id": "a", "name": "x" * 201, "position": {"x": 0, "y": 0}}]
    app.session_state["constructor_drafts"] = {active: draft}
    app.session_state["constructor_errors"] = {active: "Every entity needs an ID and name"}
    app.run()
    assert not app.exception
    assert app.error
