"""Deleting a run removes only its owned work, as one transaction."""
import shutil
import sqlite3

import pytest

from capstone_examples import bank, build_to_queries
from src import capstone_store as store, database as db


@pytest.fixture(scope="module")
def seed(tmp_path_factory):
    path = tmp_path_factory.mktemp("delete-seed") / "progress.db"
    run, aid, snapshot, recipe = build_to_queries(path)
    return path, run["run_id"]


@pytest.fixture
def project(seed, tmp_path):
    source, rid = seed
    path = tmp_path / "progress.db"
    shutil.copyfile(source, path)
    return path, store.get_run(path, rid)


def test_deletion_removes_owned_attempts_and_datasets_and_preserves_other_work(project):
    path, run = project
    b = bank()
    other = store.create_run(path, b["capstones"][0], b)
    other_aid = store.start_stage(path, other["run_id"], "business")
    independent = db.save_attempt(path, {"challenge_id": "COF-001", "answer": "Keep independent work"})
    before = db.export_progress(path)
    assert any(d["run_id"] == run["run_id"] for d in before["capstone_datasets"])
    store.delete_run(path, run["run_id"], expected_revision=run["revision"])
    after = db.export_progress(path)
    assert [r["run_id"] for r in after["capstone_runs"]] == [other["run_id"]]
    assert after["capstone_datasets"] == [d for d in before["capstone_datasets"] if d["run_id"] != run["run_id"]]
    assert {a["attempt_id"] for a in after["attempts"]} == {other_aid, independent}
    assert after["attempts"] == [a for a in before["attempts"] if a.get("project_run_id") != run["run_id"]]
    for aid in run["stage_attempts"].values():
        assert db.get_attempt(path, aid) is None


def test_failed_or_stale_deletion_preserves_the_entire_run(project):
    path, run = project
    before = db.export_progress(path)
    with pytest.raises(ValueError, match="project changed"):
        store.delete_run(path, run["run_id"], expected_revision=run["revision"] - 1)
    assert db.export_progress(path) == before
    with db.connect(path) as con:
        con.execute("CREATE TRIGGER fail_delete BEFORE DELETE ON capstone_runs BEGIN SELECT RAISE(ABORT,'simulated failure'); END")
    with pytest.raises(sqlite3.Error, match="simulated failure"):
        store.delete_run(path, run["run_id"], expected_revision=run["revision"])
    assert db.export_progress(path) == before


def test_empty_run_can_be_deleted_but_missing_run_cannot(project):
    path, existing = project
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    store.delete_run(path, run["run_id"], expected_revision=run["revision"])
    with pytest.raises(ValueError, match="no longer exists"):
        store.delete_run(path, run["run_id"], expected_revision=run["revision"])
    assert store.get_run(path, existing["run_id"]) == existing
