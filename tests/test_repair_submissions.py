from copy import deepcopy
import json
from pathlib import Path
import pytest
from scripts.build_repair_exercises import build
from src import database as db, constructor_artifacts as a
from src.constructor_models import slot_statuses, evidence_errors
from src.repair_content import substantive_fingerprint
from src.mock_worker import run_job
from src.prompt_builder import student_prompt, evaluation_prompt
from src.bank_manager import sync_bundled_constructor
from repair_examples import repaired, EXPECTED_DEFECTS

ROOT = Path(__file__).resolve().parents[1]


def bank():
    return json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("identity", ["REP-001", "REP-002", "REP-003"])
def test_public_starters_snapshotted_and_solvable_with_current_tools(tmp_path, identity):
    c = next(c for c in bank()["challenges"] if c["id"] == identity)
    ws = a.new_workspace(c)
    slot = ws["tasks"]["slots"][0]
    path = tmp_path / "progress.db"
    db.init_db(path)
    aid = db.save_attempt(path, {"challenge_id": identity, "status": "In progress", "constructor_workspace": ws})
    starter = a.initial_payload(slot)
    a.validate_payload(slot["tool"], starter, slot.get("kind"))
    saved = a.save_artifact(path, aid, slot["id"], starter, 0, track_activity=False)
    ws = db.get_attempt(path, aid)["constructor_workspace"]
    assert slot_statuses(ws)[0]["evidence"] != "Ready"
    with pytest.raises(ValueError, match="Required deliverables"):
        db.save_attempt_details(path, {**db.get_attempt(path, aid), "status": "Completed", "answer": "Diagnosis"})
    payload = repaired(identity, starter)
    if slot["tool"] == "mock":
        folder = tmp_path / "generation"
        folder.mkdir()
        run_job(folder, {"workspace_id": f"attempt:{aid}:{slot['id']}", "job_id": "test", "revision": 1, "recipe": payload["recipe"]})
        status = json.loads((folder / "status.json").read_text())
        assert status["status"] == "complete", status
        payload["generation"] = {"status": "complete", "recipe_hash": a.fingerprint(payload["recipe"]), "recipe_revision": 1,
            "manifest": json.loads((folder / status["manifest"]).read_text()), "samples": json.loads((folder / status["samples"]).read_text())}
    saved = a.save_artifact(path, aid, slot["id"], payload, saved["revision"])
    attempt = db.get_attempt(path, aid)
    assert slot_statuses(attempt["constructor_workspace"])[0]["evidence"] == "Ready"
    assert evidence_errors(attempt["constructor_workspace"]) == ["Written diagnosis: explain the symptoms, your changes and verification reasoning."]
    with pytest.raises(ValueError, match="Written diagnosis"):
        db.save_attempt_details(path, {**attempt, "status": "Completed"})
    db.save_attempt_details(path, {**attempt, "status": "Completed", "answer": "My diagnosis, repair decisions and verification reasoning."})
    if slot["tool"] != "mock":
        # Historical completion survives subsequent edits and backup restoration.
        a.save_artifact(path, aid, slot["id"], starter, saved["revision"])
        target = tmp_path / "restored.db"
        db.init_db(target)
        db.merge_progress(target, db.export_progress(path))
        restored = db.list_attempts(target)[0]
        assert restored["status"] == "Completed"
        assert evidence_errors(restored["constructor_workspace"], restored["answer"])
    if slot["tool"] == "mock":
        payload["recipe"]["seed"] += 1
        payload["recipe_revision"] += 1
        a.save_artifact(path, aid, slot["id"], payload, saved["revision"])
        attempt = db.get_attempt(path, aid)
        assert slot_statuses(attempt["constructor_workspace"])[0]["evidence"] == "Outdated"
        with pytest.raises(ValueError, match="Required deliverables"):
            db.save_attempt_details(path, {**attempt, "status": "Evaluated", "evaluated_at": a.stamp()})
    # The public bank contains no expected diagnoses or repaired examples.
    c["internal"]["expected_defects"] = EXPECTED_DEFECTS[identity]
    for prompt in (student_prompt(c, ""), evaluation_prompt(c, "diagnosis", {}, "", include_internal=True)):
        for private in EXPECTED_DEFECTS[identity]:
            assert private not in prompt
    c["constructor_tasks"]["slots"][0]["starter"] = {}
    assert ws["tasks"]["slots"][0]["starter"] == starter


@pytest.mark.parametrize("identity", ["REP-001", "REP-002", "REP-003"])
def test_layout_ids_timestamps_and_generated_evidence_are_not_repairs(identity):
    c = next(c for c in bank()["challenges"] if c["id"] == identity)
    slot = c["constructor_tasks"]["slots"][0]
    original = a.initial_payload(slot)
    p = deepcopy(original)
    if slot["tool"] == "diagram":
        for e in p["entities"]:
            old = e["id"]
            e["id"] += "-new"
            e["position"]["x"] += 100
            for f in e["fields"]:
                f["id"] += "-new"
            for r in p["relationships"]:
                for end in ("source", "target"):
                    if r[end] == old:
                        r[end] = e["id"]
        for r in p["relationships"]:
            r["id"] += "-new"
    elif slot["tool"] == "pipeline":
        mapping = {e["id"]: e["id"] + "-new" for e in p["elements"]}
        for e in p["elements"]:
            e.update(id=mapping[e["id"]], x=e["x"]+200, updated=9999, width=e["width"]+100)
            if e.get("originalText"):
                e["text"] = e["originalText"].replace(" ", "\n")
            if e.get("containerId"):
                e["containerId"] = mapping[e["containerId"]]
            for key in ("startBinding", "endBinding"):
                if e.get(key):
                    e[key]["elementId"] = mapping[e[key]["elementId"]]
            for bound in e.get("boundElements") or []:
                bound["id"] = mapping[bound["id"]]
        p["appState"] = {"zoom": {"value": .5}}
    else:
        for t in p["recipe"]["tables"]:
            t["id"] += "-new"
            for f in t["fields"]:
                f["id"] += "-new"
        p.update(generation={"status": "complete"}, recipe_revision=99, ui_drafts={"any": "draft"})
    fp = lambda payload: substantive_fingerprint(slot["tool"], payload)
    assert fp(p) == fp(original)
    assert fp(repaired(identity, original)) != fp(original)


def test_repair_builder_and_install_preserve_local_edits_and_metadata():
    source = bank()
    assert build(source) == source
    edited = deepcopy(source)
    c = next(c for c in edited["challenges"] if c["id"] == "REP-001")
    c["title"] = "My local repair title"
    assert build(edited) == edited
    installed = sync_bundled_constructor(edited, source)
    assert next(c for c in installed["challenges"] if c["id"] == "REP-001")["title"] == "My local repair title"
    older = deepcopy(source)
    older["challenges"] = [c for c in older["challenges"] if not c["id"].startswith("REP-")]
    installed = sync_bundled_constructor(older, source)
    assert len(installed["challenges"]) == 72
    assert sync_bundled_constructor(installed, source) == installed


def test_requires_changes_validation_and_optional_status_gate_parity():
    slot = {"id": "x", "tool": "diagram", "label": "Model", "kind": "logical_erd", "required": False, "requires_changes": True}
    with pytest.raises(ValueError, match="starter"):
        a.validate_tasks({"version": 1, "slots": [slot]})
    del slot["requires_changes"]
    ws = a.new_workspace({"constructor_tasks": {"version": 1, "slots": [slot]}})
    assert slot_statuses(ws)[0]["evidence"] == "Missing"
    assert evidence_errors(ws) == []


def test_pipeline_topology_distinguishes_identically_labeled_nodes():
    from scripts.build_repair_exercises import _native
    from src.pipeline_models import empty_document
    p = empty_document()
    p["elements"] = [_native(str(i), "rectangle", i*300, 0) for i in range(3)]
    for i in range(2):
        p["elements"].append(_native("edge" + str(i), "arrow", 0, 0, points=[[0, 0], [1, 1]],
            startBinding={"elementId": str(i)}, endBinding={"elementId": str(i+1)}))
    changed = deepcopy(p)
    changed["elements"][-1]["startBinding"]["elementId"] = "0"
    assert substantive_fingerprint("pipeline", p) != substantive_fingerprint("pipeline", changed)
