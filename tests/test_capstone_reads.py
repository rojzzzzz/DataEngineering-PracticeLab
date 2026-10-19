"""Dataset read reuse must preserve request freshness and database ownership."""
from copy import deepcopy
import json
from uuid import uuid4

import pytest
from capstone_examples import build_to_queries, complete_project
from src import capstone_store as store, database as db


def test_reference_state_skips_only_final_submission_hash(tmp_path, monkeypatch):
    path = tmp_path / "project.db"
    run, _, _, _ = build_to_queries(path)
    # Notices contain render-time source capture timestamps; compare the two
    # read paths at the same instant rather than requiring consecutive clocks
    # to happen to return the same timestamp.
    monkeypatch.setattr(store, "stamp", lambda: "2026-10-18T00:00:00+00:00")
    expected = store.view(path, run["run_id"])
    def unexpected_hash(*args):
        raise AssertionError("The reference card does not consume the final submission hash")
    monkeypatch.setattr(store, "submission_fingerprint", unexpected_hash)
    actual = store.view(path, run["run_id"], include_submission=False)
    assert actual[:3] == expected[:3] and actual[3] is None
    with pytest.raises(AssertionError):
        store.view(path, run["run_id"])


def test_dataset_reuse_is_bounded_connection_owned_and_reset_after_failure(tmp_path):
    path = tmp_path / "project.db"
    run, aid, snapshot, recipe = build_to_queries(path)
    foreign = tmp_path / "other.db"
    db.init_db(foreign)
    foreign_copy = deepcopy(snapshot)
    foreign_copy["created_at"] = "2026-10-17T00:00:00+00:00"
    with db.connect(foreign) as con:
        con.execute("INSERT INTO capstone_datasets VALUES(?,?,?)", (snapshot["dataset_id"], run["run_id"], json.dumps(foreign_copy)))
    with db.connect(path) as con, store.dataset_reads(con):
        first = store.dataset_record(con, run, snapshot["dataset_id"])
        assert first == snapshot
        with db.connect(foreign) as other:
            # Same durable identities in a different database must never reuse
            # the original connection's decoded record, even in a nested scope.
            assert store.dataset_record(other, run, snapshot["dataset_id"])["created_at"] == foreign_copy["created_at"]
            with store.dataset_reads(other):
                assert store.dataset_record(other, run, snapshot["dataset_id"])["created_at"] == foreign_copy["created_at"]
        assert store.dataset_record(con, run, snapshot["dataset_id"]) == snapshot
        # Another run cannot access the record through a matching dataset UUID.
        assert store.dataset_record(con, {"run_id": str(uuid4())}, snapshot["dataset_id"]) is None
        for _ in range(10):
            copied = {**snapshot, "dataset_id": str(uuid4())}
            con.execute("INSERT INTO capstone_datasets VALUES(?,?,?)", (copied["dataset_id"], run["run_id"], json.dumps(copied)))
            assert store.dataset_record(con, run, copied["dataset_id"]) == copied
        assert len(store._dataset_reads.get()[1]) <= 8
    assert store._dataset_reads.get() is None
    with db.connect(path) as con:
        with pytest.raises(OSError):
            with store.dataset_reads(con):
                assert store.dataset_record(con, run, snapshot["dataset_id"]) == snapshot
                raise OSError("simulated calculation failure")
        assert store._dataset_reads.get() is None
        con.execute("DELETE FROM capstone_datasets WHERE dataset_id=?", (snapshot["dataset_id"],))
        with store.dataset_reads(con):
            assert store.dataset_record(con, run, snapshot["dataset_id"]) is None
    # A later calculation observes missing data and invalidates completion.
    states = store.view(path, run["run_id"])[2]
    assert not states["data"]["current"]
    assert any("dataset" in message.lower() for message in states["data"]["errors"])


def test_progress_rechecks_completion_after_saved_source_changes(tmp_path, monkeypatch):
    from pathlib import Path
    from streamlit.testing.v1 import AppTest
    from src import config, constructor_artifacts as artifacts
    path = tmp_path / "project.db"
    run, aid, snapshot, recipe = complete_project(path)
    monkeypatch.setattr(config, "DB_PATH", path)
    page = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=30).run()
    next(w for w in page.sidebar.radio if w.label == "Navigate").set_value("Progress").run()
    assert not page.exception
    assert next(m for m in page.metric if m.label == "Connected capstones completed").value == "1 / 1 runs"
    bid = run["stage_attempts"]["business"]
    artifact = db.get_attempt(path, bid)["constructor_workspace"]["artifacts"]["conceptual"]
    payload = deepcopy(artifact["payload"])
    payload["entities"][0]["position"]["x"] += 100
    artifact = artifacts.save_artifact(path, bid, "conceptual", payload, artifact["revision"])
    page.run()
    assert next(m for m in page.metric if m.label == "Connected capstones completed").value == "1 / 1 runs"
    payload["entities"][0]["name"] = "Changed business concept"
    artifacts.save_artifact(path, bid, "conceptual", payload, artifact["revision"])
    page.run()
    assert not page.exception
    assert next(m for m in page.metric if m.label == "Connected capstones completed").value == "0 / 1 runs"
    assert store.get_run(path, run["run_id"])["evaluation"] == run["evaluation"]
