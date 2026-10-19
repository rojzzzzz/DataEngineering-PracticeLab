"""Attempt lifecycle guarantees through the same interface used by rendering."""
from copy import deepcopy
import sqlite3

import pytest

from scripts.build_python_demo import demonstration
from scripts.build_python_pilot import pilot
from src import database
from src.python_models import fingerprint
from src.python_validation import save_validation
from src.python_workspace import PythonWorkspace, cancel_python_job


HEALTH = {"ready": True, "runner_hash": "a" * 64}
SOURCE = "def sum_nonnegative(values):\n    return sum(values)\n"


class Runner:
    def __init__(self):
        self.submissions = []
        self.cancelled = []
        self.jobs = {}
        self.polls = 0
        self.submit_error = None
        self.poll_error = None
        self.cancel_error = None

    def submit(self, aid, source, exercise, action):
        self.submissions.append((aid, source, deepcopy(exercise), action))
        if self.submit_error:
            raise RuntimeError(self.submit_error)
        identity = f"job-{len(self.submissions)}"
        job = {"id": identity, "attempt_id": aid, "state": "running",
               "source_hash": fingerprint(source), "exercise_hash": fingerprint(exercise),
               "runner_hash": HEALTH["runner_hash"]}
        self.jobs[identity] = job
        return deepcopy(job)

    def poll(self, identity):
        self.polls += 1
        if self.poll_error:
            raise RuntimeError(self.poll_error)
        return deepcopy(self.jobs[identity])

    def cancel(self, identity):
        self.cancelled.append(identity)
        if self.cancel_error:
            raise RuntimeError(self.cancel_error)

    def finish(self, **changes):
        job = self.jobs[next(reversed(self.jobs))]
        job.update(state="finished", result={"ok": True, "passed": True,
                                             "stdout": "hello", "stderr": "", "source": SOURCE}, **changes)


@pytest.fixture
def attempt(tmp_path):
    path = tmp_path / "practice.db"
    database.init_db(path)
    aid = database.save_attempt(path, {"challenge_id": "PY-001", "answer": "Keep my reasoning"})
    exercise = pilot()["python_playground"]
    runner, state = Runner(), {}
    coordinator = PythonWorkspace(state, path, aid, exercise, runner=runner)
    return coordinator, runner, state, path, aid, exercise


def event(exercise, *, action="run", identity="event-1", aid=1, source=SOURCE):
    return {"id": identity, "attemptId": aid, "exerciseHash": fingerprint(exercise),
            "source": source, "action": action}


def test_latest_draft_is_saved_before_submit_and_replays_do_not_execute(attempt):
    coordinator, runner, state, path, aid, exercise = attempt
    original = runner.submit

    def submit(*args):
        # Observe persistence through a fresh caller before permitting execution.
        fresh = PythonWorkspace({}, path, aid, exercise, runner=Runner())
        assert fresh.view(HEALTH).workspace["source"] == SOURCE
        return original(*args)

    runner.submit = submit
    submitted = event(exercise)
    assert coordinator.apply(submitted, HEALTH).busy
    coordinator.apply(submitted, HEALTH)
    assert len(runner.submissions) == 1
    assert runner.submissions[0][1] == SOURCE


@pytest.mark.parametrize("error", [OSError("disk full"), sqlite3.OperationalError("locked")])
def test_failed_save_retains_source_and_replayed_event_can_run(attempt, monkeypatch, error):
    coordinator, runner, state, path, aid, exercise = attempt
    original = database.save_python_workspace

    def fail(*args):
        raise error

    monkeypatch.setattr(database, "save_python_workspace", fail)
    submitted = event(exercise)
    view = coordinator.apply(submitted, HEALTH)
    assert view.error and view.pending_save and not view.busy
    assert view.workspace["source"] == SOURCE
    assert not runner.submissions
    remounted = PythonWorkspace(state, path, aid, exercise, runner=runner)
    assert remounted.view(HEALTH).workspace["source"] == SOURCE
    monkeypatch.setattr(database, "save_python_workspace", original)
    view = remounted.apply(submitted, HEALTH)
    assert view.busy and not view.pending_save
    assert len(runner.submissions) == 1


def test_pending_draft_survives_switch_and_retry_never_resends_execution(attempt, monkeypatch):
    coordinator, runner, state, path, aid, exercise = attempt
    with monkeypatch.context() as patch:
        patch.setattr(database, "save_python_workspace", lambda *args: (_ for _ in ()).throw(OSError("full")))
        assert coordinator.apply(event(exercise), HEALTH).pending_save
    other = database.save_attempt(path, {"challenge_id": "PY-001"})
    PythonWorkspace(state, path, other, exercise, runner=runner)
    reopened = PythonWorkspace(state, path, aid, exercise, runner=runner)
    view = reopened.apply(None, HEALTH)
    assert not view.error and not view.pending_save
    assert view.workspace["source"] == SOURCE and not runner.submissions
    # The browser can retain the original Run event after save-only recovery.
    assert not reopened.apply(event(exercise), HEALTH).busy
    assert not runner.submissions
    fresh = PythonWorkspace({}, path, aid, exercise, runner=Runner())
    assert fresh.view(HEALTH).workspace["source"] == SOURCE


@pytest.mark.parametrize("change", [
    {"attemptId": 99}, {"exerciseHash": "old"}, {"action": "unknown"},
    {"source": None}, {"id": ""}, {"id": None}, {"action": None},
])
def test_invalid_events_never_save_or_execute(attempt, change):
    coordinator, runner, _, _, _, exercise = attempt
    original = coordinator.view(HEALTH).workspace
    view = coordinator.apply({**event(exercise), **change}, HEALTH)
    assert view.error and not view.pending_save
    assert view.workspace == original and not runner.submissions


@pytest.mark.parametrize("change", ["attempt", "exercise", "database"])
def test_owner_change_cancels_and_rejects_old_coordinator(attempt, tmp_path, change):
    coordinator, runner, state, path, aid, exercise = attempt
    coordinator.apply(event(exercise), HEALTH)
    if change == "attempt":
        aid = database.save_attempt(path, {"challenge_id": "PY-001"})
    elif change == "exercise":
        exercise = {**exercise, "contract": "Changed contract"}
    else:
        path = tmp_path / "other.db"
        database.init_db(path)
        aid = database.save_attempt(path, {"challenge_id": "PY-001"})
    current = PythonWorkspace(state, path, aid, exercise, runner=runner)
    assert runner.cancelled == ["job-1"]
    assert not current.busy and current.view(HEALTH).last_result is None
    assert coordinator.apply(event(attempt[-1]), HEALTH).error
    assert len(runner.submissions) == 1


@pytest.mark.parametrize("change", ["source", "runtime", "attempt", "exercise"])
def test_late_assessment_cannot_grade_changed_work(attempt, change):
    coordinator, runner, _, _, _, exercise = attempt
    coordinator.apply(event(exercise, action="check"), HEALTH)
    runner.finish()
    health = dict(HEALTH)
    incoming = None
    if change == "source":
        incoming = event(exercise, identity="edit", action="save", source=SOURCE + "# revised\n")
    elif change == "runtime":
        health["runner_hash"] = "b" * 64
    elif change == "attempt":
        runner.jobs["job-1"]["attempt_id"] = 99
    else:
        runner.jobs["job-1"]["exercise_hash"] = "b" * 64
    view = coordinator.apply(incoming, health)
    assert not view.busy and view.result_outdated
    assert view.workspace["assessment"] is None


def test_completed_check_save_failure_is_retryable_without_polling_again(attempt, monkeypatch):
    coordinator, runner, _, path, aid, exercise = attempt
    coordinator.apply(event(exercise, action="check"), HEALTH)
    runner.finish()
    with monkeypatch.context() as patch:
        patch.setattr(database, "save_python_workspace", lambda *args: (_ for _ in ()).throw(sqlite3.OperationalError("locked")))
        view = coordinator.apply(None, HEALTH)
        assert view.error and view.busy
        assert view.workspace["assessment"] is None and view.last_result is None
    runner.poll_error = "Snapshot has expired"
    view = coordinator.apply(None, HEALTH)
    assert not view.error and not view.busy
    assert view.workspace["assessment"]["result"] == {"ok": True, "passed": True}
    assert view.last_result["result"]["stdout"] == "hello"
    assert runner.polls == 1
    fresh = PythonWorkspace({}, path, aid, exercise, runner=Runner())
    assert fresh.view(HEALTH).workspace["assessment"] == view.workspace["assessment"]


def test_new_edit_invalidates_completed_check_waiting_for_save(attempt, monkeypatch):
    coordinator, runner, _, _, _, exercise = attempt
    coordinator.apply(event(exercise, action="check"), HEALTH)
    runner.finish()
    with monkeypatch.context() as patch:
        patch.setattr(database, "save_python_workspace", lambda *args: (_ for _ in ()).throw(OSError("full")))
        assert coordinator.apply(None, HEALTH).error
    view = coordinator.apply(event(exercise, action="save", identity="edit", source=SOURCE + "# new\n"), HEALTH)
    assert view.result_outdated and view.workspace["assessment"] is None


def test_assessment_freshness_follows_later_draft_and_runtime_changes(attempt):
    coordinator, runner, _, _, _, exercise = attempt
    coordinator.apply(event(exercise, action="check"), HEALTH)
    runner.finish()
    assert coordinator.apply(None, HEALTH).assessed_source == SOURCE
    assert coordinator.view({**HEALTH, "runner_hash": "b" * 64}).assessment_outdated
    view = coordinator.apply(event(exercise, action="save", identity="edit", source=SOURCE + "# new\n"), HEALTH)
    assert view.assessment_outdated and view.assessed_source == ""
    assert view.result_outdated


def test_v2_checks_require_validation_for_current_runtime(attempt):
    _, runner, state, path, aid, _ = attempt
    exercise = demonstration()["python_playground"]
    coordinator = PythonWorkspace(state, path, aid, exercise, runner=runner)
    submitted = event(exercise, action="check")
    assert "Validate this exercise" in coordinator.apply(submitted, HEALTH).error
    assert not runner.submissions
    save_validation(path, exercise, {"operation": "validate_exercise", "state": "finished",
                    "exercise_hash": fingerprint(exercise), "runner_hash": HEALTH["runner_hash"],
                    "result": {"ok": True, "passed": True}})
    assert coordinator.apply({**submitted, "id": "validated"}, HEALTH).busy
    coordinator.apply(event(exercise, action="cancel", identity="cancel"), HEALTH)
    view = coordinator.apply({**submitted, "id": "new-runtime"}, {**HEALTH, "runner_hash": "b" * 64})
    assert view.error and not view.busy and len(runner.submissions) == 1


def test_offline_runner_allows_saving_but_cannot_execute(attempt):
    coordinator, runner, _, _, _, exercise = attempt
    offline = {"ready": False, "error": "Runner offline"}
    view = coordinator.apply(event(exercise), offline)
    assert view.error == "Runner offline"
    assert view.workspace["source"] == SOURCE and not runner.submissions
    assert not coordinator.apply(event(exercise, identity="save", action="save"), offline).error


def test_submission_failure_requires_explicit_new_event(attempt):
    coordinator, runner, _, _, _, exercise = attempt
    runner.submit_error = "Response lost"
    submitted = event(exercise)
    assert coordinator.apply(submitted, HEALTH).error == "Response lost"
    runner.submit_error = None
    assert not coordinator.apply(submitted, HEALTH).busy
    assert len(runner.submissions) == 1
    assert coordinator.apply({**submitted, "id": "retry"}, HEALTH).busy


def test_poll_failure_and_cancel_failure_release_local_ownership(attempt):
    coordinator, runner, state, _, _, exercise = attempt
    coordinator.apply(event(exercise), HEALTH)
    runner.poll_error, runner.cancel_error = "Runner stopped", "Runner unreachable"
    view = coordinator.apply(None, HEALTH)
    assert not view.busy and view.last_result["result"]["error"] == "Runner stopped"
    runner.poll_error = None
    coordinator.apply(event(exercise, identity="again"), HEALTH)
    cancel_python_job(state, runner)
    assert not coordinator.busy and runner.cancelled == ["job-1", "job-2"]


def test_edits_while_busy_save_without_starting_another_job(attempt):
    coordinator, runner, _, _, _, exercise = attempt
    coordinator.apply(event(exercise), HEALTH)
    view = coordinator.apply(event(exercise, identity="edit", source=SOURCE + "# edited\n"), HEALTH)
    assert view.busy and view.workspace["source"].endswith("# edited\n")
    assert len(runner.submissions) == 1
    runner.finish()
    assert coordinator.apply(None, HEALTH).result_outdated


def test_deleted_attempt_cancels_instead_of_polling(attempt):
    coordinator, runner, _, path, aid, exercise = attempt
    coordinator.apply(event(exercise), HEALTH)
    with database.connect(path) as connection:
        connection.execute("DELETE FROM attempts WHERE attempt_id=?", (aid,))
    view = coordinator.apply(None, HEALTH)
    assert view.error == "Attempt no longer exists."
    assert runner.cancelled == ["job-1"] and runner.polls == 0
