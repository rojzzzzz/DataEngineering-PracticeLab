from streamlit.testing.v1 import AppTest

from scripts.build_python_demo import demonstration
from src import python_runner
from src.python_models import fingerprint


def test_validation_offline_cancel_failure_and_success(tmp_path, monkeypatch):
    def page():
        import streamlit as st
        from scripts.build_python_demo import demonstration
        from src.python_validation_ui import render_validation
        ready = render_validation(st.session_state.database, [demonstration()["python_playground"]], "import")
        st.button("Append", disabled=not ready)

    exercise = demonstration()["python_playground"]
    health = {"ready": False, "error": "Start Docker"}
    job = {"id": "test", "operation": "validate_exercise", "state": "running",
           "runner_hash": "a" * 64, "exercise_hash": fingerprint(exercise)}
    cancelled = []
    monkeypatch.setattr(python_runner, "health", lambda: dict(health))
    monkeypatch.setattr(python_runner, "validate", lambda exercise: dict(job))
    monkeypatch.setattr(python_runner, "poll", lambda job_id: dict(job))
    monkeypatch.setattr(python_runner, "cancel", cancelled.append)
    app = AppTest.from_function(page, default_timeout=15)
    app.session_state.database = str(tmp_path / "local.db")
    app.run()
    button = lambda label: next(w for w in app.button if w.label == label)
    assert button("Append").disabled and button("Validate Python exercises").disabled
    health.update(ready=True, runner_hash="a" * 64)
    button("Retry validation connection").click().run()
    button("Validate Python exercises").click().run()
    assert button("Append").disabled
    button("Cancel validation").click().run()
    assert cancelled == ["test"]
    job.update(state="finished", result={"ok": False, "passed": False, "error": "Incorrect reference"})
    button("Validate Python exercises").click().run()
    assert button("Append").disabled and app.error
    job["result"] = {"ok": True, "passed": True}
    button("Validate Python exercises").click().run()
    assert not app.exception
    assert not button("Append").disabled
