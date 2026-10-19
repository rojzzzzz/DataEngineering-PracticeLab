from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

from scripts.build_python_pilot import pilot
from src import config
from src.database import get_attempt, init_db, list_attempts, save_attempt
from src.python_models import fingerprint

EXERCISE = pilot()["python_playground"]


def test_console_preserves_literal_output_and_error_details():
    def console_app():
        from src.python_ui import render_console
        render_console({
            "ok": False, "elapsed_ms": 0.06,
            "stdout": "<script>alert('literal output')</script>",
            "stderr": "Traceback: example", "error": "Example failure",
        }, stale=True)

    app = AppTest.from_function(console_app).run()
    assert not app.exception
    assert app.code[0].value == "<script>alert('literal output')</script>"
    assert app.code[1].value == "Traceback: example"
    assert app.error[0].value == "Example failure"
    assert "earlier draft" in app.caption[0].value


def widget(widgets, label):
    return next(w for w in widgets if w.label == label)


@pytest.fixture
def ui(tmp_path, monkeypatch):
    import src.python_ui as python_ui
    db = tmp_path / "practice.db"
    init_db(db)
    monkeypatch.setattr(config, "DB_PATH", db)
    monkeypatch.setattr(python_ui, "runner_health", lambda: {"ready": True, "runner_hash": "a" * 64})
    monkeypatch.setattr(python_ui, "python_editor", lambda *args, **kwargs: None)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20)
    return db, app, python_ui


def test_python_route_preview_and_unavailable_runner(ui, monkeypatch):
    db, app, module = ui
    monkeypatch.setattr(module, "runner_health", lambda: {"ready": False, "error": "Runner unavailable; drafts remain editable."})
    app.run()
    widget(app.button, "Open Python practice").click().run()
    assert not app.exception
    assert len(widget(app.selectbox, "Python exercise").options) == 2
    assert list_attempts(db) == []
    widget(app.button, "Start challenge").click().run()
    assert not app.exception
    assert list_attempts(db)[0]["challenge_id"] == "PY-001"
    assert any("Runner unavailable" in w.value for w in app.warning)


def test_latest_source_submission_and_navigation_cancel(ui, monkeypatch):
    db, app, module = ui
    aid = save_attempt(db, {"challenge_id": "PY-001", "status": "In progress"})
    source = "print('latest unsaved code')"
    event = {"id": "event-1", "attemptId": aid, "exerciseHash": fingerprint(EXERCISE), "action": "run", "source": source}
    monkeypatch.setattr(module, "python_editor", lambda *args, **kwargs: event)
    submitted = []
    job = {"id": "job-1", "state": "running", "attempt_id": aid, "source_hash": fingerprint(source), "exercise_hash": fingerprint(EXERCISE), "runner_hash": "a" * 64}
    def submit(*args):
        submitted.append(args)
        return job
    monkeypatch.setattr(module.python_runner, "submit", submit)
    monkeypatch.setattr(module.python_runner, "poll", lambda job_id: job)
    cancelled = []
    monkeypatch.setattr(module.python_runner, "cancel", cancelled.append)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    assert submitted == [(aid, source, EXERCISE, "run")]
    assert get_attempt(db, aid)["python_workspace"]["source"] == source
    app.run()
    assert len(submitted) == 1
    widget(app.sidebar.radio, "Navigate").set_value("Progress").run()
    assert not app.exception
    assert cancelled == ["job-1"]


def test_late_assessment_does_not_overwrite_new_draft(ui, monkeypatch):
    db, app, module = ui
    aid = save_attempt(db, {"challenge_id": "PY-001", "status": "In progress"})
    source = "def sum_nonnegative(values): return 0"
    event = {"id": "first", "attemptId": aid, "exerciseHash": fingerprint(EXERCISE), "action": "check", "source": source}
    monkeypatch.setattr(module, "python_editor", lambda *args, **kwargs: event)
    job = {"id": "job-2", "state": "running", "attempt_id": aid, "source_hash": fingerprint(source), "exercise_hash": fingerprint(EXERCISE), "runner_hash": "a" * 64}
    monkeypatch.setattr(module.python_runner, "submit", lambda *args: dict(job))
    monkeypatch.setattr(module.python_runner, "poll", lambda job_id: dict(job))
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    event.update(id="second", action="save", source=source + "\n# new draft")
    job.update(state="finished", result={"ok": True, "correctness": True, "passed": True})
    app.run()
    assert not app.exception
    workspace = get_attempt(db, aid)["python_workspace"]
    assert workspace["source"] == event["source"]
    assert workspace["assessment"] is None
    assert app.session_state["python_last_result"]["outdated"]


def test_finished_assessment_saves_summary_without_console(ui, monkeypatch):
    db, app, module = ui
    aid = save_attempt(db, {"challenge_id": "PY-001", "status": "In progress"})
    source = "def sum_nonnegative(values): return sum(x for x in values if x >= 0)"
    event = {"id": "check", "attemptId": aid, "exerciseHash": fingerprint(EXERCISE), "action": "check", "source": source}
    monkeypatch.setattr(module, "python_editor", lambda *args, **kwargs: event)
    job = {"id": "job-3", "state": "finished", "attempt_id": aid, "source_hash": fingerprint(source), "exercise_hash": fingerprint(EXERCISE), "runner_hash": "a" * 64,
           "result": {"ok": True, "correctness": True, "time_passed": True, "memory_passed": True, "passed": True, "stdout": "console", "stderr": ""}}
    monkeypatch.setattr(module.python_runner, "submit", lambda *args: dict(job))
    monkeypatch.setattr(module.python_runner, "poll", lambda job_id: dict(job))
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    saved = get_attempt(db, aid)["python_workspace"]["assessment"]
    assert saved["result"]["passed"]
    assert "stdout" not in saved["result"]
    assert any("All three checks passed" in item.value for item in app.success)


def test_failed_run_save_exposes_retry_and_save_only_retry_does_not_execute(ui, monkeypatch):
    from src import database

    db, app, module = ui
    aid = save_attempt(db, {"challenge_id": "PY-001", "status": "In progress"})
    event = {"id": "failed-run", "attemptId": aid, "exerciseHash": fingerprint(EXERCISE),
             "action": "run", "source": "print('recover me')"}
    monkeypatch.setattr(module, "python_editor", lambda *args, **kwargs: event)
    submissions = []
    monkeypatch.setattr(module.python_runner, "submit", lambda *args: submissions.append(args))
    save = database.save_python_workspace

    def fail(*args):
        raise OSError("Disk full")

    monkeypatch.setattr(database, "save_python_workspace", fail)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception and any("Disk full" in error.value for error in app.error)
    retry = widget(app.button, "Retry saving Python draft")
    assert not retry.disabled and not submissions
    monkeypatch.setattr(database, "save_python_workspace", save)
    retry.click().run()
    app.run()  # The original Run event is still returned by the editor.
    assert not app.exception and not submissions
    assert get_attempt(db, aid)["python_workspace"]["source"] == event["source"]
