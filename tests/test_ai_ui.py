import json
from pathlib import Path
import time
import threading

import pytest
from streamlit.testing.v1 import AppTest

from src import ai, bank_manager, config
from src.ai import AIConnection, AIResponse
from src.authoring import example_package
from src.database import export_progress, get_attempt, init_db, merge_progress, save_attempt

ROOT = Path(__file__).resolve().parents[1]


def widget(items, label):
    return next(w for w in items if w.label == label)


@pytest.fixture
def context(tmp_path, monkeypatch):
    bundled = json.loads(config.BUNDLED_CHALLENGES_PATH.read_text(encoding="utf-8"))
    challenge = next(c for c in bundled["challenges"] if c["id"].startswith("SCN-"))
    bank = {**bundled, "challenges": [challenge]}
    bank.pop("capstones", None)  # This fixture deliberately keeps one standalone challenge.
    path = tmp_path / "challenges.json"
    path.write_text(json.dumps(bank), encoding="utf-8")
    report = tmp_path / "validation.json"
    report.write_text(json.dumps({"normalized_challenge_count": 1, "valid_challenges": 1, "issues": [], "issue_count": 0}))
    values = {"DB_PATH": tmp_path / "progress.db", "SOURCE_PATH": path, "CHALLENGES_PATH": path,
              "BUNDLED_CHALLENGES_PATH": path, "VALIDATION_REPORT_PATH": report,
              "IMPORTS_DIR": tmp_path / "imports", "VERSIONS_DIR": tmp_path / "versions"}
    for name, value in values.items():
        monkeypatch.setattr(config, name, value)
        if hasattr(bank_manager, name):
            monkeypatch.setattr(bank_manager, name, value)
    init_db(config.DB_PATH)
    calls = []
    class Provider:
        text = "OK"
        def generate(self, connection, credential, request):
            calls.append({"connection": connection, "credential": credential, "request": request})
            return AIResponse(self.text, "simulated", {"input_tokens": 2}, "stop")
    provider = Provider()
    monkeypatch.setattr(ai, "provider_for", lambda connection: provider)
    app = AppTest.from_file(str(ROOT / "app.py"), default_timeout=15)
    return app, bank, challenge, calls, provider


def connect(app):
    widget(app.sidebar.radio, "Navigate").set_value("Optional AI").run()
    widget(app.selectbox, "Connection preset").set_value("Ollama (local)").run()
    widget(app.text_input, "Model").set_value("manual-model")
    widget(app.text_input, "API key (optional)").set_value("secret-session-key")
    widget(app.button, "Enable / update connection").click().run()
    assert not app.exception
    assert widget(app.text_input, "API key (optional)").value == ""


def completed(app, challenge):
    aid = save_attempt(config.DB_PATH, {"challenge_id": challenge["id"], "status": "Completed", "answer": "Saved answer", "updated_at": "2026-10-13", "started_at": "2026-10-13"})
    app.session_state["active_attempt"] = aid
    app.session_state["active_challenge"] = challenge["id"]
    app.session_state["navigate"] = "Practice"
    app.run()
    assert not app.exception
    return aid


def proposal(bank, challenge):
    scores = {k: v / 2 for k, v in bank["rubrics"][challenge["rubric_ref"]].items()}
    return {"rubric_scores": scores, "total_score": sum(scores.values()), "weak_topics": [], "mistake_categories": [], "feedback": "Suggested feedback"}


def test_opt_in_configuration_is_network_free_and_clears_password(context):
    app, _, _, calls, _ = context
    app.run()
    connect(app)
    assert not calls
    widget(app.button, "Send test message").click().run()
    time.sleep(.03)
    app.run()
    assert len(calls) == 1 and calls[0]["request"].prompt == "Reply with OK."
    assert calls[0]["connection"].output_tokens == 16
    app.run()
    assert len(calls) == 1
    widget(app.sidebar.radio, "Navigate").set_value("Progress").run()
    widget(app.sidebar.radio, "Navigate").set_value("Optional AI").run()
    assert widget(app.text_input, "Model").value == "manual-model"
    widget(app.button, "Disconnect").click().run()
    session = app.session_state["optional_ai"]
    assert session.connection is None and session._credential == ""


def test_external_evaluation_only_explicit_save_updates_progress(context):
    app, bank, challenge, calls, _ = context
    aid = completed(app, challenge)
    result = proposal(bank, challenge)
    widget(app.text_area, "Paste an external JSON evaluation").set_value(json.dumps(result)).run()
    widget(app.button, "Review external evaluation").click().run()
    assert get_attempt(config.DB_PATH, aid)["score"] is None
    widget(app.button, "Apply suggestion to editable form").click().run()
    assert not app.exception
    assert widget(app.text_area, "Evaluator feedback").value == "Suggested feedback"
    assert get_attempt(config.DB_PATH, aid)["score"] is None
    widget(app.button, "Save evaluation").click().run()
    assert get_attempt(config.DB_PATH, aid)["score"] == result["total_score"]
    assert not calls


def test_external_suggestion_becomes_outdated_when_answer_changes(context):
    app, bank, challenge, _, _ = context
    aid = completed(app, challenge)
    widget(app.text_area, "Paste an external JSON evaluation").set_value(json.dumps(proposal(bank, challenge))).run()
    widget(app.button, "Review external evaluation").click().run()
    assert any(w.label == "Apply suggestion to editable form" for w in app.button)
    widget(app.text_area, "Your solution").set_value("Changed answer").run()
    assert not any(w.label == "Apply suggestion to editable form" for w in app.button)
    assert get_attempt(config.DB_PATH, aid)["score"] is None


def test_api_reviewed_prompt_is_exact_and_does_not_save_evaluation(context):
    app, bank, challenge, calls, provider = context
    app.run()
    connect(app)
    aid = completed(app, challenge)
    provider.text = json.dumps(proposal(bank, challenge))
    widget(app.text_area, "Review and edit prompt").set_value("A user-reviewed prompt\nUnicode: ñ").run()
    assert not calls
    widget(app.button, "Send reviewed prompt").click().run()
    time.sleep(.03)
    app.run()
    assert not app.exception
    assert len(calls) == 1 and calls[0]["request"].prompt == "A user-reviewed prompt\nUnicode: ñ"
    assert any(w.value == calls[0]["request"].prompt for w in app.code)
    assert get_attempt(config.DB_PATH, aid)["score"] is None
    widget(app.button, "Apply suggestion to editable form").click().run()
    assert get_attempt(config.DB_PATH, aid)["score"] is None
    app.run()
    assert len(calls) == 1


def test_navigation_discards_pending_evaluation_and_reruns_do_not_duplicate(context):
    app, bank, challenge, calls, provider = context
    app.run()
    connect(app)
    aid = completed(app, challenge)
    provider.text = json.dumps(proposal(bank, challenge))
    entered, release = threading.Event(), threading.Event()
    original_generate = provider.generate
    def delayed(connection, credential, request):
        entered.set()
        if not release.wait(3):
            return AIResponse(error="simulated timeout")
        return original_generate(connection, credential, request)
    provider.generate = delayed
    try:
        widget(app.button, "Send reviewed prompt").click().run()
        assert entered.wait(1)
        app.run()
        assert app.session_state["optional_ai"].busy
        widget(app.sidebar.radio, "Navigate").set_value("Progress").run()
        assert app.session_state["optional_ai"].state == "outdated"
    finally:
        release.set()
    deadline = time.monotonic() + 2
    while app.session_state["optional_ai"].busy and time.monotonic() < deadline:
        time.sleep(.01)
    widget(app.sidebar.radio, "Navigate").set_value("Practice").run()
    assert not app.exception and len(calls) == 1
    assert app.session_state["optional_ai"].response is None
    assert not any(w.label == "Apply suggestion to editable form" for w in app.button)
    assert get_attempt(config.DB_PATH, aid)["score"] is None


def test_generated_authoring_draft_requires_review_then_append(context):
    app, bank, _, calls, provider = context
    app.run()
    connect(app)
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.text_input, "Topic").set_value("Warehouse design")
    widget(app.number_input, "Exercise count").set_value(1).run()
    package = example_package(bank, "Written practice")
    provider.text = json.dumps(package)
    original = config.CHALLENGES_PATH.read_bytes()
    app.button(key="ai_authoring_send").click().run()
    time.sleep(.03)
    app.run()
    assert config.CHALLENGES_PATH.read_bytes() == original
    widget(app.button, "Validate and review").click().run()
    assert not app.exception
    assert widget(app.radio, "Import method").value == "AI draft"
    assert config.CHALLENGES_PATH.read_bytes() == original
    widget(app.button, "Append exercises").click().run()
    assert not app.exception
    assert len(json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))["challenges"]) == 2
    assert len(calls) == 1
    assert widget(app.radio, "Import method").value == "Upload JSON"
    app.run()
    assert len(json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))["challenges"]) == 2


def test_repair_preserves_original_and_never_automatically_sends(context):
    app, bank, _, calls, provider = context
    app.run()
    connect(app)
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.radio, "Import method").set_value("Paste JSON").run()
    widget(app.text_area, "Paste the AI's JSON response").set_value("original invalid JSON").run()
    assert not calls
    original = config.CHALLENGES_PATH.read_bytes()
    editors = [w for w in app.text_area if w.label == "Review and edit prompt"]
    assert len(editors) == 2 and "original invalid JSON" in editors[1].value
    package = example_package(bank, "Written practice")
    provider.text = json.dumps(package)
    app.button(key="ai_repair_send").click().run()
    time.sleep(.03)
    app.run()
    assert not app.exception and len(calls) == 1
    assert calls[0]["request"].operation == "repair"
    assert app.session_state["ai_repair_original"]["original"] == "original invalid JSON"
    assert widget(app.text_area, "Paste the AI's JSON response").value == "original invalid JSON"
    assert config.CHALLENGES_PATH.read_bytes() == original
    app.button(key="ai_repair_review").click().run()
    assert not app.exception
    assert config.CHALLENGES_PATH.read_bytes() == original
    assert widget(app.radio, "Import method").value == "AI draft"


def test_two_sessions_and_progress_backups_do_not_contain_credentials(context, tmp_path):
    app, _, challenge, calls, _ = context
    app.run()
    connect(app)
    aid = completed(app, challenge)
    second = AppTest.from_file(str(ROOT / "app.py"), default_timeout=15).run()
    widget(second.sidebar.radio, "Navigate").set_value("Optional AI").run()
    assert second.session_state["optional_ai"].connection is None
    backup = export_progress(config.DB_PATH)
    encoded = json.dumps(backup)
    assert "secret-session-key" not in encoded and "optional_ai" not in encoded
    restored = tmp_path / "restored.db"
    init_db(restored)
    merge_progress(restored, backup)
    assert get_attempt(restored, aid)["answer"] == "Saved answer"
    assert not calls


def test_invalid_repair_keeps_original_and_feedback_recoverable(context):
    app, _, _, calls, provider = context
    app.run()
    connect(app)
    widget(app.sidebar.radio, "Navigate").set_value("Challenge Bank").run()
    widget(app.text_input, "Topic").set_value("Warehouse design").run()
    # A is a generated draft. B is a repair that is also invalid.
    provider.text = "invalid generated draft A"
    app.button(key="ai_authoring_send").click().run()
    time.sleep(.03)
    app.run()
    app.button(key="ai_authoring_review").click().run()
    original = dict(app.session_state["ai_repair_original"])
    assert original["original"] == "invalid generated draft A"
    assert original["generation_prompt"] == calls[0]["request"].prompt
    provider.text = "invalid repair B"
    app.button(key="ai_repair_send").click().run()
    time.sleep(.03)
    app.run()
    app.button(key="ai_repair_review").click().run()
    assert not app.exception
    assert widget(app.text_area, "Review the AI exercise draft").value == "invalid repair B"
    assert app.session_state["ai_repair_original"] == original
    app.run()
    history = app.session_state["ai_repair_history"]
    assert len(history) == 2
    assert original in history.values()
    assert any(record["original"] == "invalid repair B" for record in history.values())
    selection = next(key for key, record in history.items() if record == original)
    widget(app.selectbox, "Preserved repair draft").set_value(selection).run()
    assert any(w.label == "Download preserved draft" for w in app.get("download_button"))
    assert any(w.label == "Download preserved validation feedback" for w in app.get("download_button"))
    widget(app.button, "Restore preserved draft for review").click().run()
    assert not app.exception
    assert widget(app.text_area, "Review the AI exercise draft").value == original["original"]
    assert app.session_state["ai_bank_generation_prompt"] == original["generation_prompt"]
    assert app.session_state["ai_repair_original"]["errors"] == original["errors"]
    assert len(app.session_state["ai_repair_history"]) == 2
    assert len(calls) == 2


def test_repeated_api_evaluations_keep_latest_and_external_proposals(context):
    from src.ai import AIRequest, evaluation_revision
    app, bank, challenge, calls, _ = context
    aid = completed(app, challenge)
    external = proposal(bank, challenge)
    external["feedback"] = "Retained external suggestion"
    widget(app.text_area, "Paste an external JSON evaluation").set_value(json.dumps(external)).run()
    widget(app.button, "Review external evaluation").click().run()
    session = app.session_state["optional_ai"]
    current_revision = evaluation_revision(challenge, get_attempt(config.DB_PATH, aid), bank["rubrics"][challenge["rubric_ref"]])
    # Also migrate old request-ID entries left by a previous app version.
    app.session_state["ai_evaluation_proposals"]["obsolete-api-request"] = {"text": "Old unused text", "revision": current_revision, "applicable": True}
    for i in range(4):
        suggested = proposal(bank, challenge)
        suggested["feedback"] = f"API suggestion {i}"
        session.request = AIRequest("evaluation", "prompt", f"attempt:{aid}", current_revision)
        session.response = AIResponse(json.dumps(suggested), "simulated", finish_reason="stop")
        session.state = "completed"
        app.run()
        assert not app.exception
    stored = app.session_state["ai_evaluation_proposals"]
    assert list(stored) == [f"ai_evaluation_{aid}"]
    assert json.loads(stored[f"ai_evaluation_{aid}"]["text"]) == external
    widget(app.radio, "Suggestion source").set_value("Connected API").run()
    widget(app.button, "Apply suggestion to editable form").click().run()
    assert widget(app.text_area, "Evaluator feedback").value == "API suggestion 3"
    assert get_attempt(config.DB_PATH, aid)["score"] is None
    assert not calls
