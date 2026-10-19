from copy import deepcopy
from uuid import uuid4

import pytest
from capstone_examples import build_to_queries, complete_project, generate_save
from src import capstone_store as store, database as db, constructor_artifacts as artifacts
from src.capstone_datasets import validate_dataset
from src.capstone_sql import DatasetWorkspace, save_evidence
from src.constructor_models import fingerprint
from src.sql_runner import SQLJob
from src.statistics import overview


@pytest.fixture(scope="module")
def evaluated_project_backup(tmp_path_factory):
    from capstone_examples import run_queries, finish
    from src.submission import review_status
    path = tmp_path_factory.mktemp("evaluated-backup") / "project.db"
    run, aid, _, _ = build_to_queries(path)
    run_queries(path, aid)
    finish(path, run, "queries")
    db.save_attempt_details(path, {**db.get_attempt(path, aid), "status": "Evaluated",
        "score": 80, "rubric_scores": {}, "evaluated_at": artifacts.stamp()})
    assert review_status(db.get_attempt(path, aid)) == "Evaluation current"
    return db.export_progress(path), run["run_id"]


@pytest.mark.parametrize("stale", [False, True])
def test_conflict_restore_preserves_stage_evaluation_currency(tmp_path, evaluated_project_backup, stale):
    from src.submission import review_status
    backup, run_id = evaluated_project_backup
    incoming = deepcopy(backup)
    path = tmp_path / "restored.db"
    db.init_db(path)
    db.merge_progress(path, backup)
    original_run = store.get_run(path, run_id)
    original = db.get_attempt(path, original_run["stage_attempts"]["queries"])
    db.save_attempt_details(path, {**original, "personal_notes": "Local notes must survive the conflict"})
    imported = next(a for a in incoming["attempts"] if a.get("project_stage_id") == "queries")
    if stale:
        imported["sql_workspace"]["drafts"]["monthly"] = "SELECT 2 AS edited_after_evaluation"
    expected = review_status(imported)
    result = db.merge_progress(path, incoming)
    assert result["runs_conflicted"] == 1
    recovered = next(r for r in store.list_runs(path) if r["run_id"] != run_id)
    attempt = db.get_attempt(path, recovered["stage_attempts"]["queries"])
    assert attempt["capstone_workspace"]["dataset_id"] != original["capstone_workspace"]["dataset_id"]
    assert attempt["sql_workspace"] == imported["sql_workspace"]
    assert attempt["score"] == 80 and attempt["evaluated_at"] == imported["evaluated_at"]
    assert review_status(attempt) == expected
    assert db.get_attempt(path, original["attempt_id"])["personal_notes"] == "Local notes must survive the conflict"
    assert db.merge_progress(path, incoming)["runs_unchanged"] == 1


def test_complete_six_stage_project_full_typed_data_cleanup_currency_and_backup(tmp_path):
    path = tmp_path / "source.db"
    run, qid, snapshot, recipe = complete_project(path)
    states = store.view(path, run["run_id"])[2]
    assert all(s["current"] for s in states.values())
    assert len(db.list_attempts(path)) == 6
    assert overview(db.list_attempts(path))["completed"] == 0
    result = SQLJob(None, "run", dataset=snapshot["data"], sql="SELECT count(*), min(unit_price),sum(quantity*unit_price) FROM order_lines").wait()
    assert result["ok"] and result["rows"][0][0] == 240
    assert isinstance(result["rows"][0][1], str)  # exact DECIMAL wire representation
    dates = SQLJob(None, "run", dataset=snapshot["data"], sql="SELECT min(placed_at),max(placed_at) FROM orders").wait()
    assert dates["ok"] and dates["rows"][0][0].startswith("2026-")
    products = next(t for t in snapshot["data"]["tables"] if t["name"] == "products")
    assert products["columns"][0]["type"] == "VARCHAR" and len(products["rows"][0][0]) == 36
    orders = next(t for t in snapshot["data"]["tables"] if t["name"] == "orders")
    assert orders["columns"][-1]["type"] == "TIMESTAMPTZ" and orders["rows"][0][-1].endswith("Z")
    executions = db.get_attempt(path, qid)["capstone_workspace"]["executions"]
    assert executions["reconciliation"]["sample"][0][-1] == "0.00"
    assert executions["diagnostics"]["status"] == "success" and executions["diagnostics"]["sample"] == []
    prompt = store.final_prompt(path, run["run_id"])
    assert '"rows": [[' not in prompt and "dataURL" not in prompt
    # Local ID collisions do not alter durable stage references or completion.
    backup = db.export_progress(path)
    target = tmp_path / "target.db"
    db.init_db(target)
    db.save_attempt(target, {"challenge_id": "SCN-001", "answer": "Unrelated work"})
    restored = db.merge_progress(target, backup)
    assert restored["runs_added"] == 1
    imported = store.get_run(target, run["run_id"])
    assert imported["stage_attempts"]["business"] != run["stage_attempts"]["business"]
    assert store.view(target, run["run_id"])[3] == run["completion"]["fingerprint"]
    assert all(s["current"] for s in store.view(target, run["run_id"])[2].values())
    assert db.merge_progress(target, backup)["runs_unchanged"] == 1
    # Layout edits preserve completion and evaluation; substantive edits stale both.
    bid = run["stage_attempts"]["business"]
    a = db.get_attempt(path, bid)["constructor_workspace"]["artifacts"]["conceptual"]
    moved = deepcopy(a["payload"])
    moved["entities"][0]["position"]["x"] += 100
    a = artifacts.save_artifact(path, bid, "conceptual", moved, a["revision"])
    assert store.view(path, run["run_id"])[3] == run["evaluation"]["fingerprint"]
    moved["entities"][0]["name"] = "renamed_customers"
    artifacts.save_artifact(path, bid, "conceptual", moved, a["revision"])
    assert store.view(path, run["run_id"])[3] != run["evaluation"]["fingerprint"]
    assert store.get_run(path, run["run_id"])["evaluation"] == run["evaluation"]
    assert store.view(path, run["run_id"])[2]["operations"]["inherited"]
    with pytest.raises(ValueError):
        store.complete_run(path, run["run_id"])
    # Conflict imports retain independent complete histories, and repeated imports deduplicate.
    original = db.export_progress(target)
    conflict = db.merge_progress(path, original)
    assert conflict["runs_conflicted"] == 1 and len(store.list_runs(path)) == 2
    recovered = next(r for r in store.list_runs(path) if r["run_id"] != run["run_id"])
    recovered_view = store.view(path, recovered["run_id"])
    assert all(s["current"] for s in recovered_view[2].values())
    assert recovered_view[3] == recovered["completion"]["fingerprint"] == recovered["evaluation"]["fingerprint"]
    assert db.merge_progress(path, original)["runs_unchanged"] == 1
    assert store.get_run(path, run["run_id"])["stage_attempts"]["business"] == bid
    corrupt = deepcopy(backup)
    corrupt["settings"]["theme"] = "rollback"
    corrupt["capstone_datasets"][0]["data"]["tables"][-1]["rows"][0][-1] = 0.01
    before = db.export_progress(target)
    with pytest.raises(ValueError):
        db.merge_progress(target, corrupt)
    assert db.export_progress(target)["attempts"] == before["attempts"]
    assert db.export_progress(target)["settings"] == before["settings"]
    incomplete = deepcopy(backup)
    del incomplete["capstone_runs"][0]["inputs"]["operational"]
    with pytest.raises(ValueError, match="complete copied inputs"):
        db.merge_progress(target, incomplete)
    # SQL failures after restoration starts roll back settings, standalone rows and datasets too.
    import sqlite3
    blocked = tmp_path / "blocked.db"
    db.init_db(blocked)
    rollback_backup = deepcopy(backup)
    rollback_backup["settings"] = {"rollback_test": "must not persist"}
    with db.connect(blocked) as con:
        con.execute("CREATE TRIGGER fail_project BEFORE INSERT ON capstone_runs BEGIN SELECT RAISE(ABORT,'simulated write failure'); END")
    with pytest.raises(sqlite3.IntegrityError):
        db.merge_progress(blocked, rollback_backup)
    assert db.list_attempts(blocked) == [] and store.list_runs(blocked) == []
    assert db.export_progress(blocked)["capstone_datasets"] == []
    assert db.get_settings(blocked) == {}


def test_replacement_query_edits_late_results_cancellation_and_failed_save(tmp_path, monkeypatch):
    path = tmp_path / "project.db"
    run, aid, snapshot, recipe = build_to_queries(path)
    jobs = []
    class Job:
        result = None
        cancelled = False
        def __init__(self, *args, **kwargs): jobs.append(self)
        def cancel(self): self.cancelled = True
    state = {}
    coordinator = DatasetWorkspace(state, path, aid, start_job=Job)
    event = {"id": "first", "attemptId": aid, "exerciseHash": coordinator.editor_hash, "action": "run", "active": "monthly", "drafts": {"monthly": "SELECT 1"}}
    original_save = db.save_sql_workspace
    monkeypatch.setattr(db, "save_sql_workspace", lambda *args: (_ for _ in ()).throw(OSError("disk full")))
    view = coordinator.apply(event)
    assert view.error and view.pending_draft
    assert view.editor_workspace["drafts"]["monthly"] == "SELECT 1"
    assert not jobs
    monkeypatch.setattr(db, "save_sql_workspace", original_save)
    assert not coordinator.apply(event).error
    request = {"run_id": run["run_id"], "stage_id": "queries", "dataset_id": snapshot["dataset_id"],
        "dataset_hash": snapshot["data"]["content_hash"], "task_id": "monthly", "query_hash": fingerprint("SELECT 1")}
    job = jobs[-1]
    coordinator.apply({**event, "id": "edit", "action": "save", "drafts": {"monthly": "SELECT 2"}})
    with pytest.raises(ValueError, match="query changed"):
        save_evidence(path, aid, request, {"ok": True, "rows": [[1]], "columns": ["value"]})
    coordinator.apply({**event, "id": "cancel", "action": "cancel", "drafts": event["drafts"]})
    assert job.cancelled and db.get_attempt(path, aid)["capstone_workspace"]["executions"]["monthly"]["status"] == "cancelled"
    # Saving a new immutable dataset never replaces the SQL selection or drafts silently.
    replacement = generate_save(path, run["stage_attempts"].get("data") or store.get_run(path, run["run_id"])["stage_attempts"]["data"], recipe, replace=True)
    assert db.get_attempt(path, aid)["capstone_workspace"]["dataset_id"] == snapshot["dataset_id"]
    assert store.view(path, run["run_id"])[2]["queries"]["notices"]
    with pytest.raises(ValueError, match="confirm"):
        store.reconcile(path, run["run_id"], "queries", "operational-data", "update")
    store.reconcile(path, run["run_id"], "queries", "operational-data", "update", confirm_replace=True)
    assert db.get_attempt(path, aid)["sql_workspace"]["drafts"] == event["drafts"]
    assert db.get_attempt(path, aid)["capstone_workspace"]["dataset_id"] == replacement["dataset_id"]
    with pytest.raises(ValueError, match="dataset changed"):
        save_evidence(path, aid, request, {"ok": True})
    for changes in ({"run_id": str(uuid4())}, {"stage_id": "operations"}):
        with pytest.raises(ValueError, match="another stage/run"):
            save_evidence(path, aid, {**request, **changes}, {"ok": True})
    # Existing snapshots remain usable despite replacement and temporary worker cleanup.
    assert SQLJob(None, "run", dataset=snapshot["data"], sql="SELECT count(*) FROM order_lines").wait()["rows"] == [[240]]
    # Transfer failures retain the previous immutable snapshot and selection.
    original_run_save = store.save_run
    monkeypatch.setattr(store, "save_run", lambda *args: (_ for _ in ()).throw(OSError("simulated commit failure")))
    before_data = db.export_progress(path)["capstone_datasets"]
    with pytest.raises(OSError):
        generate_save(path, store.get_run(path, run["run_id"])["stage_attempts"]["data"], recipe, replace=True)
    assert db.export_progress(path)["capstone_datasets"] == before_data
    monkeypatch.setattr(store, "save_run", original_run_save)


def test_dataset_contract_limits_strict_types_and_select_only(tmp_path):
    run, aid, snapshot, recipe = build_to_queries(tmp_path / "project.db")
    base = snapshot["data"]
    changes = [
        lambda d: d["tables"][0].update(name="bad-name"),
        lambda d: d["tables"][-1]["columns"][-1].update(type="DOUBLE"),
        lambda d: d["tables"][-1]["rows"][0].__setitem__(-1, 12.5),
        lambda d: d["tables"][0].update(rows=d["tables"][0]["rows"]*501),
        lambda d: d["tables"][0].update(columns=d["tables"][0]["columns"]*41),
        lambda d: d.update(tables=d["tables"]*3),
        lambda d: d["tables"][-1]["rows"][0].__setitem__(-1, "7"*2_100_000),
    ]
    for change in changes:
        data = deepcopy(base)
        change(data)
        data["content_hash"] = fingerprint(data["tables"])
        with pytest.raises(ValueError): validate_dataset(data)
    for query in ("DELETE FROM order_lines", "CREATE TABLE copy AS SELECT * FROM orders", "SELECT * FROM read_csv('anything.csv')", "SELECT 1; SELECT 2"):
        assert not SQLJob(None, "run", dataset=base, sql=query).wait()["ok"]
    with pytest.raises(ValueError): SQLJob(None, "check", dataset=base)
    bounded = SQLJob(None, "run", dataset=base, sql="SELECT range FROM range(1500)").wait()
    assert bounded["ok"] and bounded["truncated"] and len(bounded["rows"]) == 1000
    cancelled = SQLJob(None, "run", dataset=base, sql="SELECT sum(a.range*b.range) FROM range(10000000) a CROSS JOIN range(10000000) b")
    cancelled.cancel()
    assert not cancelled.wait()["ok"]
    # Ordinary generation remains usable beyond the stricter capstone transfer limits.
    oversize = deepcopy(recipe)
    oversize["tables"][0]["rows"] = 10_001
    data_aid = store.get_run(tmp_path / "project.db", run["run_id"])["stage_attempts"]["data"]
    with pytest.raises(ValueError, match="10,000"):
        generate_save(tmp_path / "project.db", data_aid, oversize, replace=True)
    import threading
    from types import SimpleNamespace
    from src.capstone_datasets import save_from_job
    expired = SimpleNamespace(lock=threading.RLock(), closed=True, request={"mode": "generate"})
    with pytest.raises(ValueError, match="expired"):
        save_from_job(tmp_path / "project.db", data_aid, "recipe", expired)
