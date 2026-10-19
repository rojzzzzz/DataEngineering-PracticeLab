from copy import deepcopy
import pytest
from src import database as db, constructor_artifacts as store
from src.attempt_resume import destination, most_recent
from src.practice_navigation import PracticeNavigation
from src.submission import review_status, submission_revision, evaluation_context


def setup(path):
    db.init_db(path)
    challenge = {"id": "TEST-001", "constructor_tasks": {"version": 1, "slots": [
        {"id": "one", "tool": "diagram", "label": "Logical model", "kind": "logical_erd", "required": True},
        {"id": "two", "tool": "pipeline", "label": "Pipeline", "required": False}]}}
    aid = db.save_attempt(path, {"challenge_id": challenge["id"], "status": "In progress",
        "started_at": store.stamp(), "updated_at": store.stamp(), "constructor_workspace": store.new_workspace(challenge)})
    return aid, challenge


def test_only_successful_changed_work_updates_resume_and_backup(tmp_path):
    path = tmp_path / "source.db"
    aid, challenge = setup(path)
    workspace = db.get_attempt(path, aid)["constructor_workspace"]
    payload = store.initial_payload(workspace["tasks"]["slots"][0])
    starter = store.save_artifact(path, aid, "one", payload, 0, track_activity=False)
    assert db.get_attempt(path, aid)["activity_at"] is None
    payload["entities"].append({"id": "e", "name": "Orders", "position": {"x": 0, "y": 0}})
    saved = store.save_artifact(path, aid, "one", payload, starter["revision"])
    attempt = db.get_attempt(path, aid)
    assert attempt["resume_target"] == "artifact:one"
    with pytest.raises(ValueError):
        store.save_artifact(path, aid, "two", {}, 0)
    assert db.get_attempt(path, aid)["activity_at"] == attempt["activity_at"]
    db.save_attempt_details(path, {**attempt, "confidence": 4})
    assert db.get_attempt(path, aid)["activity_at"] == attempt["activity_at"]
    store.save_artifact(path, aid, "one", saved["payload"], saved["revision"])
    assert db.get_attempt(path, aid)["activity_at"] == attempt["activity_at"]
    db.save_attempt_details(path, {**attempt, "answer": "Written diagnosis"})
    attempt = db.get_attempt(path, aid)
    assert attempt["resume_target"] == "answer"
    assert submission_revision(attempt) == submission_revision({**attempt, "resume_target": "artifact:two", "activity_at": store.stamp()})
    target = tmp_path / "restored.db"
    db.init_db(target)
    db.merge_progress(target, db.export_progress(path))
    restored = db.list_attempts(target)[0]
    assert (restored["resume_target"], restored["activity_at"]) == (attempt["resume_target"], attempt["activity_at"])


def test_legacy_fallback_ties_stale_targets_unknown_and_completed(tmp_path):
    path = tmp_path / "source.db"
    aid, challenge = setup(path)
    attempt = db.get_attempt(path, aid)
    ws = attempt["constructor_workspace"]
    for slot in ws["tasks"]["slots"]:
        a = store.make_artifact(slot, store.initial_payload(slot))
        a["updated_at"] = "2026-01-01T00:00:00Z"
        ws["artifacts"][slot["id"]] = a
    assert destination({**attempt, "resume_target": None}, challenge)[0] == "artifact:one"
    assert destination({**attempt, "resume_target": "artifact:gone"}, challenge) == (None, "attempt overview")
    assert most_recent([attempt, {**attempt, "status": "Completed", "attempt_id": 2},
                        {**attempt, "challenge_id": "gone", "attempt_id": 3}], {challenge["id"]: challenge}) == attempt


def test_failed_answer_flush_retains_destination(tmp_path, monkeypatch):
    path = tmp_path / "source.db"
    aid, challenge = setup(path)
    state = {"rendered_written_attempt": aid, f"answer_{aid}": "new draft"}
    nav = PracticeNavigation(state, path, [challenge], lambda: None)
    monkeypatch.setattr(db, "save_attempt_details", lambda *args: (_ for _ in ()).throw(OSError("disk full")))
    assert not nav.go("attempt", aid)
    assert db.get_attempt(path, aid)["resume_target"] is None
    assert state["pending_answers"][aid] == "new draft"


def test_answer_changes_invalidate_whole_submission_evaluation(tmp_path):
    path = tmp_path / "source.db"
    aid, _ = setup(path)
    attempt = db.get_attempt(path, aid)
    slot = attempt["constructor_workspace"]["tasks"]["slots"][0]
    p = store.initial_payload(slot)
    p["entities"] = [{"id": "e", "name": "Orders", "position": {"x": 0, "y": 0}}]
    store.save_artifact(path, aid, "one", p, 0)
    attempt = db.get_attempt(path, aid)
    db.save_attempt_details(path, {**attempt, "status": "Evaluated", "evaluated_at": store.stamp(), "score": 85})
    attempt = db.get_attempt(path, aid)
    assert review_status(attempt) == "Evaluation current"
    contextual = {**attempt, "evaluation_context": evaluation_context({"id": "TEST-001"}, {"quality": 100})}
    assert review_status(contextual, {"id": "TEST-001"}, {"quality": 100}) == "Evaluation current"
    assert review_status(contextual, {"id": "TEST-001", "title": "Changed brief"}, {"quality": 100}) == "Evaluation outdated"
    assert review_status(contextual, {"id": "TEST-001"}, {"quality": 50}) == "Evaluation outdated"
    db.save_attempt_details(path, {**attempt, "answer": "New reasoning"})
    assert review_status(db.get_attempt(path, aid)) == "Evaluation outdated"


def test_untouched_attempt_and_status_changes_do_not_displace_saved_work(tmp_path):
    path = tmp_path / "source.db"
    aid, challenge = setup(path)
    a = db.get_attempt(path, aid)
    db.save_attempt_details(path, {**a, "answer": "Saved work"})
    other, _ = setup(path)
    b = db.get_attempt(path, other)
    db.save_attempt_details(path, {**b, "status": "Not started", "updated_at": "2099-01-01T00:00:00Z"})
    assert most_recent(db.list_attempts(path), {challenge["id"]: challenge})["attempt_id"] == aid


def test_backup_merge_preserves_outdated_evaluation_binding(tmp_path):
    local = tmp_path / "local.db"
    aid, _ = setup(local)
    remote = tmp_path / "remote.db"
    db.init_db(remote)
    db.merge_progress(remote, db.export_progress(local))
    a = db.get_attempt(remote, aid)
    slot = a["constructor_workspace"]["tasks"]["slots"][0]
    p = store.initial_payload(slot)
    p["entities"] = [{"id": "e", "name": "Orders", "position": {"x": 0, "y": 0}}]
    store.save_artifact(remote, aid, "one", p, 0)
    db.save_attempt_details(remote, {**db.get_attempt(remote, aid), "status": "Evaluated", "evaluated_at": store.stamp(), "updated_at": store.stamp()})
    db.save_attempt_details(remote, {**db.get_attempt(remote, aid), "answer": "Later edits", "updated_at": store.stamp()})
    assert review_status(db.get_attempt(remote, aid)) == "Evaluation outdated"
    db.merge_progress(local, db.export_progress(remote))
    assert review_status(db.get_attempt(local, aid)) == "Evaluation outdated"
