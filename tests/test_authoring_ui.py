import json
from pathlib import Path
import threading

import pytest
import streamlit as st
from streamlit.testing.v1 import AppTest

from src import ai, bank_manager, config
from src.authoring import example_package

ROOT = Path(__file__).resolve().parents[1]


def widget(items, label):
    return next(w for w in items if w.label == label)


@pytest.fixture
def authoring_context(tmp_path, monkeypatch):
    bank = json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))
    source = tmp_path / "challenges.json"
    source.write_text(json.dumps(bank), encoding="utf-8")
    template = tmp_path / "bundled.json"
    template.write_text(json.dumps(bank), encoding="utf-8")
    for name, value in {"DB_PATH": tmp_path / "progress.db", "SOURCE_PATH": source,
            "CHALLENGES_PATH": source, "BUNDLED_CHALLENGES_PATH": template,
            "VALIDATION_REPORT_PATH": tmp_path / "report.json", "IMPORTS_DIR": tmp_path / "imports",
            "VERSIONS_DIR": tmp_path / "versions"}.items():
        monkeypatch.setattr(config, name, value)
        if hasattr(bank_manager, name):
            monkeypatch.setattr(bank_manager, name, value)
    st.cache_data.clear()
    app = AppTest.from_file(str(ROOT / "app.py"), default_timeout=25)
    return app, bank, source


@pytest.mark.parametrize("mode", ["Pipeline design", "Mock data", "SQL analysis", "Repair exercise", "Integrated case study", "Connected Capstone"])
def test_new_formats_can_be_prompted_reviewed_and_appended(authoring_context, mode):
    app, bank, source = authoring_context
    app.run()
    original = source.read_bytes()
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.selectbox, "Exercise format").set_value(mode).run()
    if mode != "Connected Capstone":
        widget(app.number_input, "Exercise count").set_value(1).run()
    widget(app.text_input, "Topic").set_value("Fictional logistics operations").run()
    assert not app.exception
    prompt = app.code[0].value
    assert "NAMING CONTRACT" in prompt and mode in prompt
    incoming = example_package(bank, mode)
    widget(app.radio, "Import method").set_value("Paste JSON").run()
    widget(app.text_area, "Paste the AI's JSON response").set_value(json.dumps(incoming)).run()
    assert not app.exception and not app.error, [e.value for e in app.error]
    assert widget(app.button, "Append exercises").disabled is False
    assert source.read_bytes() == original
    widget(app.button, "Append exercises").click().run()
    assert not app.exception
    saved = json.loads(source.read_text(encoding="utf-8"))
    added = 6 if mode == "Connected Capstone" else 1
    assert len(saved["challenges"]) == len(bank["challenges"]) + added
    assert saved["challenges"][:-added] == bank["challenges"]
    assert widget(app.radio, "Import method").value == "Upload JSON"
    if mode == "Connected Capstone":
        project = saved["capstones"][-1]
        assert project["id"] == "cap-001" and len(project["stages"]) == 6
        assert [s["challenge_id"] for s in project["stages"]] == [f"CAP-{i:03d}" for i in range(1, 7)]


def connect_simulated(app, monkeypatch, text, finish_reason="stop"):
    calls, done = [], threading.Event()
    class Provider:
        def generate(self, connection, credential, request):
            calls.append(request)
            done.set()
            return ai.AIResponse(text, "simulated", {}, finish_reason)
    monkeypatch.setattr(ai, "provider_for", lambda connection: Provider())
    session = ai.AISession()
    session.configure(ai.AIConnection("Chat Completions", "https://provider.example/v1", "simulated"))
    app.session_state["optional_ai"] = session
    return calls, done


@pytest.mark.parametrize("mode", ["Mock data", "Repair exercise", "Connected Capstone"])
def test_connected_ai_generates_new_formats_with_explicit_review(authoring_context, monkeypatch, mode):
    app, bank, source = authoring_context
    package = example_package(bank, mode)
    calls, done = connect_simulated(app, monkeypatch, json.dumps(package))
    app.run()
    original = source.read_bytes()
    widget(app.sidebar.radio, "Navigate").set_value("Optional AI").run()
    widget(app.button, "Create exercises").click().run()
    assert widget(app.sidebar.radio, "Navigate").value == "Challenge Bank"
    widget(app.selectbox, "Exercise format").set_value(mode).run()
    if mode != "Connected Capstone":
        widget(app.number_input, "Exercise count").set_value(1).run()
    assert app.button(key="ai_authoring_send").disabled
    widget(app.text_input, "Topic").set_value("Fictional logistics operations").run()
    assert not calls
    app.button(key="ai_authoring_send").click().run()
    assert done.wait(1)
    app.run()
    assert len(calls) == 1 and calls[0].operation == "authoring"
    assert f"Format: {mode}" in calls[0].prompt
    assert source.read_bytes() == original
    app.button(key="ai_authoring_review").click().run()
    assert not app.exception and not app.error, [e.value for e in app.error]
    assert source.read_bytes() == original
    widget(app.button, "Append exercises").click().run()
    assert not app.exception
    assert len(json.loads(source.read_text(encoding="utf-8"))["challenges"]) == len(bank["challenges"]) + len(package["challenges"])
    app.run()
    assert len(calls) == 1
    assert widget(app.radio, "Import method").value == "Upload JSON"


@pytest.mark.parametrize("finish_reason", ["stop", "length"])
def test_outdated_and_truncated_ai_drafts_cannot_be_reviewed(authoring_context, monkeypatch, finish_reason):
    app, bank, source = authoring_context
    calls, done = connect_simulated(app, monkeypatch, json.dumps(example_package(bank, "Written practice")), finish_reason)
    app.run()
    original = source.read_bytes()
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.text_input, "Topic").set_value("Logistics").run()
    app.button(key="ai_authoring_send").click().run()
    assert done.wait(1)
    app.run()
    if finish_reason == "stop":
        widget(app.selectbox, "Difficulty").set_value(4).run()
    assert app.button(key="ai_authoring_review").disabled
    assert len(calls) == 1 and source.read_bytes() == original


def test_missing_ai_exercises_cannot_bypass_requested_count(authoring_context, monkeypatch):
    app, bank, source = authoring_context
    _, done = connect_simulated(app, monkeypatch, json.dumps(example_package(bank, "Written practice")))
    app.run()
    original = source.read_bytes()
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.text_input, "Topic").set_value("Logistics").run()
    app.button(key="ai_authoring_send").click().run()
    assert done.wait(1)
    app.run()
    app.button(key="ai_authoring_review").click().run()
    assert any("Expected 3" in e.value for e in app.error)
    assert not any(w.label == "Append exercises" for w in app.button)
    assert source.read_bytes() == original


def test_repair_keeps_the_reviewed_contract_when_model_changes_its_manifest(authoring_context, monkeypatch):
    app, bank, _ = authoring_context
    package = example_package(bank, "Written practice")
    package["authoring"] = {"version": 1, "format": "Written practice", "family": "SCN", "count": 1, "type": "DESIGN"}
    _, done = connect_simulated(app, monkeypatch, json.dumps(package))
    app.run()
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.text_input, "Topic").set_value("Logistics").run()
    app.button(key="ai_authoring_send").click().run()
    assert done.wait(1)
    app.run()
    app.button(key="ai_authoring_review").click().run()
    assert any("does not match the reviewed request" in e.value for e in app.error)
    assert app.session_state["ai_repair_original"]["contract"]["count"] == 3
