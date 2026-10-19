from copy import deepcopy
import json
from pathlib import Path
import pytest
from src import capstone_store as store, database as db, constructor_artifacts as artifacts
from src.capstone_models import validate_definition, written_values
from src.selector import eligible_challenges, select_challenge

ROOT = Path(__file__).resolve().parents[1]


def bank():
    return json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))


def create(path):
    db.init_db(path)
    b = bank()
    return store.create_run(path, b["capstones"][0], b)


def answer(run, stage):
    definition = next(s for s in run["definition"]["stages"] if s["id"] == stage)
    return "\n\n".join("## " + label + "\nTest-authored decisions and verification." for label in definition["written_sections"])


def diagram(kind, name="customers"):
    return {"version": 1, "kind": kind, "entities": [{"id": "e", "name": name, "position": {"x": 0, "y": 0},
        "role": "entity" if kind == "conceptual_erd" else "table", "annotation": "Declared model assumptions",
        "fields": [] if kind == "conceptual_erd" else [{"id": "pk", "name": "id", "data_type": "integer", "pk": True, "fk": False}]}], "relationships": []}


def finish_model(path, run, stage):
    aid = store.start_stage(path, run["run_id"], stage)
    a = db.get_attempt(path, aid)
    slot = a["constructor_workspace"]["tasks"]["slots"][0]
    artifacts.save_artifact(path, aid, slot["id"], diagram(slot["kind"]), 0)
    db.save_attempt_details(path, {**db.get_attempt(path, aid), "answer": answer(run, stage), "status": "Completed"})
    return aid


def test_definitions_runs_lazy_start_prerequisites_and_independent_runs(tmp_path):
    path = tmp_path / "projects.db"
    run = create(path)
    other = create(path)
    assert db.list_attempts(path) == []
    assert run["run_id"] != other["run_id"]
    with pytest.raises(ValueError, match="prerequisites"):
        store.start_stage(path, run["run_id"], "operational")
    business = finish_model(path, run, "business")
    assert store.start_stage(path, run["run_id"], "business") == business
    operational = store.start_stage(path, run["run_id"], "operational")
    db.init_db(path)
    reopened = store.get_run(path, run["run_id"])
    assert reopened["stage_attempts"] == {"business": business, "operational": operational}
    assert store.get_run(path, other["run_id"])["stage_attempts"] == {}
    assert db.get_attempt(path, business)["project_run_id"] == run["run_id"]
    refs = reopened["inputs"]["operational"]["business-model"]
    assert refs["source"]["run_id"] == run["run_id"] and refs["revision"] == 1


def test_definition_rejects_missing_cycles_and_incompatible_handoffs():
    b = bank()
    for mutate in (
        lambda d: d["stages"][0].update(prerequisites=["operations"]),
        lambda d: d["stages"][1].update(challenge_id="MISSING"),
        lambda d: d["stages"][1]["inputs"][0].update(tool="pipeline"),
        lambda d: d["stages"][1]["inputs"][0].update(source_slot="missing"),
    ):
        definition = deepcopy(b["capstones"][0])
        mutate(definition)
        with pytest.raises(ValueError):
            validate_definition(definition, b["challenges"])
    assert not any(c.get("capstone") for c in eligible_challenges(b["challenges"]))
    assert select_challenge([c for c in b["challenges"] if c.get("capstone")]) is None


def test_written_sections_preserve_learners_markdown_subheadings_on_reopen():
    text = "## Business processes\nOrdering\n## Implementation notes\nKeep this detail\n## KPI definitions\nUSD line revenue"
    restored = written_values(text, ["Business processes", "KPI definitions"])
    assert restored["Business processes"] == "Ordering\n## Implementation notes\nKeep this detail"
    assert restored["KPI definitions"] == "USD line revenue"


def test_cosmetic_edits_independent_copies_reconciliation_and_repeated_changes(tmp_path):
    path = tmp_path / "projects.db"
    run = create(path)
    business = finish_model(path, run, "business")
    operational = finish_model(path, run, "operational")
    store.start_stage(path, run["run_id"], "data")
    before = store.get_run(path, run["run_id"])["inputs"]["operational"]["business-model"]
    saved = db.get_attempt(path, business)["constructor_workspace"]["artifacts"]["conceptual"]
    moved = deepcopy(saved["payload"])
    moved["entities"][0]["position"]["x"] += 400
    saved = artifacts.save_artifact(path, business, "conceptual", moved, saved["revision"])
    assert not store.view(path, run["run_id"])[2]["operational"]["notices"]
    moved["entities"][0]["name"] = "new_business_concept"
    saved = artifacts.save_artifact(path, business, "conceptual", moved, saved["revision"])
    states = store.view(path, run["run_id"])[2]
    assert states["operational"]["status"] == "Needs reconciliation"
    assert states["data"]["inherited"]
    assert store.get_run(path, run["run_id"])["inputs"]["operational"]["business-model"] == before
    with pytest.raises(ValueError, match="explanation"):
        store.reconcile(path, run["run_id"], "operational", "business-model", "keep")
    store.reconcile(path, run["run_id"], "operational", "business-model", "keep", "The renamed concept is represented by the existing logical table.")
    assert not store.view(path, run["run_id"])[2]["operational"]["notices"]
    moved["entities"][0]["annotation"] = "Further business constraint"
    artifacts.save_artifact(path, business, "conceptual", moved, saved["revision"])
    assert store.view(path, run["run_id"])[2]["operational"]["notices"]
    own = deepcopy(db.get_attempt(path, operational)["constructor_workspace"])
    store.reconcile(path, run["run_id"], "operational", "business-model", "update")
    assert db.get_attempt(path, operational)["constructor_workspace"] == own
    ref = store.get_run(path, run["run_id"])["inputs"]["operational"]["business-model"]
    assert ref["payload"]["entities"][0]["annotation"] == "Further business constraint"
    assert ref["history"][0]["payload"] == before["payload"]


def test_recipe_copy_is_explicit_and_preserves_replaced_content(tmp_path):
    path = tmp_path / "projects.db"
    run = create(path)
    finish_model(path, run, "business")
    finish_model(path, run, "operational")
    aid = store.start_stage(path, run["run_id"], "data")
    assert db.get_attempt(path, aid)["constructor_workspace"]["artifacts"] == {}
    copied = store.derive_recipe(path, aid, "operational-model")
    assert copied["payload"]["recipe"]["tables"][0]["name"] == "customers"
    assert copied["provenance"]["source"] == "capstone-logical-copy"
    with pytest.raises(ValueError, match="confirm"):
        store.derive_recipe(path, aid, "operational-model")
    store.derive_recipe(path, aid, "operational-model", confirm_replace=True)
    assert store.get_run(path, run["run_id"])["replaced_recipes"][0]["artifact"] == copied


def test_missing_source_and_failed_stage_creation_preserve_owned_work(tmp_path, monkeypatch):
    import sqlite3
    path = tmp_path / "project.db"
    run = create(path)
    business = finish_model(path, run, "business")
    original_save = store.save_run
    def fail(*args):
        raise sqlite3.OperationalError("disk full")
    monkeypatch.setattr(store, "save_run", fail)
    with pytest.raises(sqlite3.OperationalError):
        store.start_stage(path, run["run_id"], "operational")
    assert len(db.list_attempts(path)) == 1
    assert store.get_run(path, run["run_id"])["stage_attempts"] == {"business": business}
    monkeypatch.setattr(store, "save_run", original_save)
    operational = finish_model(path, run, "operational")
    store.start_stage(path, run["run_id"], "data")
    saved = db.get_attempt(path, business)
    saved["constructor_workspace"]["artifacts"] = {}
    db.save_attempt(path, saved)
    states = store.view(path, run["run_id"])[2]
    assert states["operational"]["notices"][0]["source"] is None and states["data"]["inherited"]
    assert db.get_attempt(path, operational)["constructor_workspace"]["artifacts"]
    with pytest.raises(ValueError, match="unavailable"):
        store.reconcile(path, run["run_id"], "operational", "business-model", "keep", "Cannot acknowledge a missing source")
