"""SQL coordination behavior through its public interface and temporary SQLite."""
from copy import deepcopy
from pathlib import Path
import json

import pytest

from src import database
from src.sql_models import fingerprint, new_workspace
from src.sql_workspace import SQLWorkspace, cancel_sql_jobs


@pytest.fixture
def workspace(tmp_path):
    exercise = next(c["sql_playground"] for c in json.loads(
        (Path(__file__).resolve().parents[1] / "data/challenges.json").read_text(encoding="utf-8")
    )["challenges"] if c["id"] == "SQL-001")
    path = tmp_path / "practice.db"
    database.init_db(path)
    aid = database.save_attempt(path, {"challenge_id": "SQL-001", "answer": "Keep my reasoning"})
    jobs = []

    class Job:
        result = None
        cancelled = False

        def __init__(self, exercise, operation, **kwargs):
            self.operation = operation
            self.request = deepcopy(kwargs)
            # A submitted job must see the current persisted drafts.
            assert database.get_attempt(path, aid)["sql_workspace"]["drafts"] == kwargs["drafts"]
            jobs.append(self)

        def cancel(self):
            self.cancelled = True

    state = {}
    coordinator = SQLWorkspace(state, path, aid, exercise, start_job=Job)
    return coordinator, state, jobs, path, aid, exercise, Job


def event(exercise, *, action="run", active="ranking", selection="", identity="event-1"):
    drafts = new_workspace(exercise)["drafts"]
    drafts["ranking"] = "SELECT 123"
    return {"id": identity, "attemptId": 1, "exerciseHash": fingerprint(exercise),
            "action": action, "active": active,
            "drafts": drafts, "selection": selection}


def test_run_saves_latest_drafts_before_starting_and_deduplicates_replays(workspace):
    coordinator, state, jobs, path, aid, exercise, Job = workspace
    submitted = event(exercise)
    view = coordinator.apply(submitted)
    assert view.error is None and view.busy
    assert jobs[0].request["sql"] == "SELECT 123"
    assert view.workspace["drafts"]["ranking"] == "SELECT 123"
    assert coordinator.apply(submitted).busy and len(jobs) == 1
    reopened = SQLWorkspace({}, path, aid, exercise, start_job=Job).refresh()
    assert reopened.workspace["drafts"]["ranking"] == "SELECT 123"


@pytest.mark.parametrize("action", ["run", "explain"])
def test_selection_runs_without_replacing_the_full_draft(workspace, action):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    view = coordinator.apply(event(exercise, action=action, selection="SELECT 1"))
    assert jobs[0].request["sql"] == "SELECT 1"
    assert view.workspace["drafts"]["ranking"] == "SELECT 123"


@pytest.mark.parametrize("change,error", [
    ({"drafts": {}}, "missing"),
    ({"active": "not_a_tab"}, "Unknown answer tab"),
    ({"drafts": []}, "missing"),
    ({"drafts": [1]}, "draft"),
    ({"attemptId": -1}, "previous exercise"),
    ({"exerciseHash": "old"}, "previous exercise"),
])
def test_invalid_events_never_save_or_start_work(workspace, change, error):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    before = coordinator.refresh().workspace
    view = coordinator.apply({**event(exercise), **change})
    assert error.lower() in view.error.lower()
    assert not jobs
    assert coordinator.refresh().workspace == before


def test_failed_save_is_retryable_and_cannot_start_execution(workspace, monkeypatch):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    save = database.save_sql_workspace

    def fail(*args):
        import sqlite3
        raise sqlite3.OperationalError("Disk full")

    monkeypatch.setattr(database, "save_sql_workspace", fail)
    submitted = event(exercise)
    assert "Disk full" in coordinator.apply(submitted).error
    assert not jobs
    monkeypatch.setattr(database, "save_sql_workspace", save)
    assert coordinator.apply(submitted).busy
    assert len(jobs) == 1


def test_assessment_keeps_its_provenance_when_the_answer_changes(workspace):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    coordinator.apply(event(exercise, action="check"))
    changed = event(exercise, action="save", identity="edit")
    changed["drafts"]["ranking"] = "SELECT 456"
    coordinator.apply(changed)
    jobs[0].result = {"ok": True, "results": {"ranking": "passed"}}
    view = coordinator.refresh()
    assert view.workspace["drafts"]["ranking"] == "SELECT 456"
    assert view.workspace["assessment"]["results"] == {"ranking": "passed"}
    assert view.assessment_outdated and not view.busy


def test_result_freshness_follows_the_executed_tab(workspace):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    coordinator.apply(event(exercise))
    jobs[0].result = {"ok": True, "rows": [[123]]}
    assert not coordinator.refresh().result_outdated
    changed = event(exercise, action="save", identity="edit")
    changed["drafts"]["ranking"] = "SELECT 456"
    view = coordinator.apply(changed)
    assert view.result_outdated
    assert view.last_result["sql"] == "SELECT 123"


@pytest.mark.parametrize("change", ["attempt", "exercise"])
def test_owner_change_cancels_old_work_and_rejects_old_coordinator(workspace, change):
    coordinator, state, jobs, path, aid, exercise, Job = workspace
    coordinator.apply(event(exercise))
    if change == "attempt":
        aid = database.save_attempt(path, {"challenge_id": "SQL-001"})
    else:
        exercise = {**exercise, "revision": "new"}
    new = SQLWorkspace(state, path, aid, exercise, start_job=Job)
    assert jobs[0].cancelled and not new.busy
    assert new.refresh().last_result is None
    jobs[0].result = {"ok": True, "rows": [[999]]}
    assert coordinator.refresh().error
    assert not new.refresh().last_result
    retained = new.apply(event(workspace[5]))
    assert "previous exercise" in retained.error
    assert len(jobs) == 1


@pytest.mark.parametrize("field", ["attemptId", "exerciseHash"])
def test_editor_event_must_identify_its_owner(workspace, field):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    submitted = event(exercise)
    submitted.pop(field)
    assert "previous exercise" in coordinator.apply(submitted).error
    assert not jobs


def test_completed_assessment_save_failure_can_be_retried(workspace, monkeypatch):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    coordinator.apply(event(exercise, action="check"))
    jobs[0].result = {"ok": True, "results": {"ranking": "passed"}}
    save = database.save_sql_workspace

    def fail(*args):
        raise OSError("Disk unavailable")

    monkeypatch.setattr(database, "save_sql_workspace", fail)
    view = coordinator.refresh()
    assert view.error and view.busy
    assert view.workspace["assessment"] is None
    monkeypatch.setattr(database, "save_sql_workspace", save)
    view = coordinator.refresh()
    assert not view.error and not view.busy
    assert view.workspace["assessment"]["results"] == {"ranking": "passed"}


def test_new_edits_while_running_are_saved_without_a_second_job(workspace):
    coordinator, _, jobs, _, _, exercise, _ = workspace
    coordinator.apply(event(exercise))
    changed = event(exercise, action="run", identity="edit-during-run")
    changed["drafts"]["ranking"] = "SELECT 456"
    view = coordinator.apply(changed)
    assert view.busy and len(jobs) == 1
    assert view.workspace["drafts"]["ranking"] == "SELECT 456"
    jobs[0].result = {"ok": True, "rows": [[123]]}
    assert coordinator.refresh().result_outdated


def test_cancel_removes_query_and_profile_without_late_results(workspace):
    coordinator, state, jobs, _, _, exercise, _ = workspace
    coordinator.apply(event(exercise))
    profile = type("Profile", (), {"cancel": lambda self: setattr(self, "cancelled", True)})()
    state["detective_profile_job"] = {"job": profile}
    cancel_sql_jobs(state)
    assert jobs[0].cancelled and profile.cancelled
    jobs[0].result = {"ok": True, "rows": [[999]]}
    assert coordinator.refresh().last_result is None


def test_detective_notebooks_and_repair_answers_remain_independent(workspace):
    _, state, jobs, path, aid, exercise, Job = workspace
    coordinator = SQLWorkspace(state, path, aid, exercise, detective=True, start_job=Job)
    submitted = event(exercise, active="notebook_1")
    submitted["drafts"]["notebook_1"] = "SELECT 'evidence'"
    view = coordinator.apply(submitted)
    assert jobs[0].request["sql"] == "SELECT 'evidence'"
    assert "notebook_1" not in jobs[0].request["drafts"]
    assert "notebook_1" not in view.workspace["drafts"]
    assert view.detective_workspace["notebooks"]["notebook_1"] == "SELECT 'evidence'"
    assert view.editor_workspace["drafts"]["notebook_1"] == "SELECT 'evidence'"
    assert database.get_attempt(path, aid)["answer"] == "Keep my reasoning"
