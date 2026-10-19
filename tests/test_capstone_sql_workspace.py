"""Saved-dataset SQL recovery through the module's view and commands."""
from copy import deepcopy
import shutil
from types import SimpleNamespace

import pytest
from streamlit.testing.v1 import AppTest

from capstone_examples import build_to_queries
from src import capstone_sql, config, database as db
from src.capstone_sql import DatasetWorkspace, navigation_safe
from src.practice_navigation import PracticeNavigation


RESULT = {"ok": True, "columns": ["one"], "types": ["INTEGER"], "rows": [[1]],
          "elapsed_ms": 0, "truncated": False}


@pytest.fixture(scope="module")
def seed(tmp_path_factory):
    path = tmp_path_factory.mktemp("sql-seed") / "project.db"
    run, aid, snapshot, recipe = build_to_queries(path)
    return path, aid


@pytest.fixture
def workspace(seed, tmp_path):
    source, aid = seed
    path = tmp_path / "project.db"
    shutil.copyfile(source, path)
    jobs, state = [], {}
    class Job:
        result = None
        cancelled = False
        def __init__(self, *args, **kwargs):
            assert db.get_attempt(path, aid)["sql_workspace"]["drafts"]["monthly"] == kwargs["sql"]
            jobs.append(self)
        def cancel(self): self.cancelled = True
    coordinator = DatasetWorkspace(state, path, aid, start_job=Job)
    event = {"id": "run", "attemptId": aid, "exerciseHash": coordinator.editor_hash,
             "action": "run", "active": "monthly", "drafts": {"monthly": "SELECT 1"}}
    return SimpleNamespace(path=path, aid=aid, jobs=jobs, state=state, Job=Job,
                           coordinator=coordinator, event=event)


def fail(*args, **kwargs):
    raise OSError("disk full")


def test_failed_run_retry_only_saves_and_consumes_the_original_event(workspace, monkeypatch):
    w = workspace
    save = db.save_sql_workspace
    monkeypatch.setattr(db, "save_sql_workspace", fail)
    view = w.coordinator.apply(w.event)
    assert view.pending_draft and not view.busy and view.error == "disk full"
    assert view.editor_workspace["drafts"]["monthly"] == "SELECT 1"
    assert view.editor_workspace != view.saved_workspace and not w.jobs
    assert not view.can_leave and not navigation_safe(w.state)
    assert not PracticeNavigation(w.state, w.path, [], lambda: None).go("page", "Progress")
    # A full rerender uses the retained draft without caller-side merging.
    reopened = DatasetWorkspace(w.state, w.path, w.aid, start_job=w.Job)
    assert reopened.refresh().editor_workspace == view.editor_workspace
    monkeypatch.setattr(db, "save_sql_workspace", save)
    retried = reopened.retry()
    assert retried.rerun and retried.can_leave and not retried.error
    assert not retried.pending_draft and not w.jobs
    assert not reopened.apply(w.event).rerun and not w.jobs
    assert db.get_attempt(w.path, w.aid)["sql_workspace"]["drafts"]["monthly"] == "SELECT 1"


@pytest.mark.parametrize("cancelled", [False, True])
def test_finished_evidence_is_retained_and_retry_unblocks_navigation(workspace, monkeypatch, cancelled):
    w = workspace
    assert w.coordinator.apply(w.event).busy
    w.jobs[0].result = deepcopy(RESULT)
    save = capstone_sql.save_evidence
    monkeypatch.setattr(capstone_sql, "save_evidence", fail)
    view = (w.coordinator.apply({**w.event, "id": "cancel", "action": "cancel"})
            if cancelled else w.coordinator.refresh())
    assert view.busy and view.pending_result and not view.can_leave and view.error
    assert not PracticeNavigation(w.state, w.path, [], lambda: None).go("page", "Progress")
    monkeypatch.setattr(capstone_sql, "save_evidence", save)
    retried = w.coordinator.retry()
    assert retried.rerun and not retried.error and not retried.busy
    assert retried.can_leave and not retried.pending_result and len(w.jobs) == 1
    evidence = db.get_attempt(w.path, w.aid)["capstone_workspace"]["executions"]["monthly"]
    assert evidence["status"] == ("cancelled" if cancelled else "success")


def test_pending_browser_edits_block_navigation_until_acknowledged(workspace, monkeypatch):
    w = workspace
    w.coordinator.mark_pending(True)
    assert not w.coordinator.view().can_leave
    assert not PracticeNavigation(w.state, w.path, [], lambda: None).go("page", "Progress")
    save = db.save_sql_workspace
    monkeypatch.setattr(db, "save_sql_workspace", fail)
    w.coordinator.apply(w.event)
    w.coordinator.mark_pending(False)
    assert not w.coordinator.view().can_leave  # Browser acknowledgment cannot erase a failed save.
    monkeypatch.setattr(db, "save_sql_workspace", save)
    assert w.coordinator.retry().can_leave


def test_pending_edits_make_the_displayed_result_outdated(workspace, monkeypatch):
    w = workspace
    w.coordinator.apply(w.event)
    w.jobs[0].result = deepcopy(RESULT)
    assert not w.coordinator.refresh().result_outdated
    monkeypatch.setattr(db, "save_sql_workspace", fail)
    view = w.coordinator.apply({**w.event, "id": "edit", "action": "save", "drafts": {"monthly": "SELECT 2"}})
    assert view.result_outdated and view.pending_draft
    assert view.saved_workspace["drafts"]["monthly"] == "SELECT 1"
    assert view.editor_workspace["drafts"]["monthly"] == "SELECT 2"
    assert view.last_result["sql"] == "SELECT 1"


def test_late_results_do_not_attach_to_an_edited_query(workspace):
    w = workspace
    w.coordinator.apply(w.event)
    w.coordinator.apply({**w.event, "id": "edit", "action": "save", "drafts": {"monthly": "SELECT 2"}})
    w.jobs[0].result = deepcopy(RESULT)
    view = w.coordinator.refresh()
    assert "query changed" in view.error and not view.busy
    assert not view.pending_result and view.can_leave
    assert not db.get_attempt(w.path, w.aid)["capstone_workspace"]["executions"]


def test_old_editor_callbacks_and_commands_cannot_change_the_new_owner(workspace, tmp_path):
    w = workspace
    other = tmp_path / "other.db"
    shutil.copyfile(w.path, other)
    current = DatasetWorkspace(w.state, other, w.aid, start_job=w.Job)
    w.coordinator.mark_pending(True)
    assert current.view().can_leave
    current.mark_pending(True)
    w.coordinator.mark_pending(False)
    assert not current.view().can_leave
    with pytest.raises(ValueError, match="workspace changed"):
        w.coordinator.apply(w.event)
    assert not w.jobs


@pytest.mark.parametrize("changes", [{"id": ""}, {"id": None}, {"action": "check"}, {"attemptId": -1}, {"exerciseHash": "old"}])
def test_rejected_events_do_not_create_recovery_or_execution(workspace, changes):
    w = workspace
    view = w.coordinator.apply({**w.event, **changes})
    assert view.error and not view.pending_draft and not w.jobs
    assert view.can_leave and db.get_attempt(w.path, w.aid).get("sql_workspace") is None


def test_streamlit_renders_pending_drafts_and_uses_save_only_retry(workspace, monkeypatch):
    from src import capstone_sql_ui, sql_component
    w = workspace
    monkeypatch.setattr(config, "DB_PATH", w.path)
    monkeypatch.setattr(capstone_sql_ui, "DatasetWorkspace",
        lambda state, path, aid: DatasetWorkspace(state, path, aid, start_job=w.Job))
    sent, rendered = [], []
    def editor(*args, **kwargs):
        rendered.append((deepcopy(args[3]), deepcopy(kwargs["saved_workspace"])))
        if not sent:
            sent.append(True)
            return w.event
    monkeypatch.setattr(sql_component, "sql_editor", editor)
    save = db.save_sql_workspace
    monkeypatch.setattr(db, "save_sql_workspace", fail)
    page = AppTest.from_string(f'''
from src.config import DB_PATH
from src.database import get_attempt
from src.capstone_sql_ui import render_sql
render_sql(DB_PATH, get_attempt(DB_PATH, {w.aid}))
''', default_timeout=20).run()
    assert not page.exception and any("disk full" in e.value for e in page.error)
    page.run()
    assert rendered[-1][0]["drafts"]["monthly"] == "SELECT 1"
    assert rendered[-1][0] != rendered[-1][1]
    monkeypatch.setattr(db, "save_sql_workspace", save)
    next(b for b in page.button if b.label == "Retry saving SQL draft").click().run()
    assert not page.exception and not page.error and not w.jobs
    assert not any(b.label.startswith("Retry saving") for b in page.button)
    assert rendered[-1][0] == rendered[-1][1]
