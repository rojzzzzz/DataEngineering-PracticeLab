"""Release acceptance at persistence, bank, worker and Practice boundaries."""
from copy import deepcopy
import json
from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

from src import constructor_artifacts as artifacts, database, config
from src import constructor_store, pipeline_store
from src.diagrams import empty_diagram
from src.mock_models import example_recipe, new_field, validate_recipe
from src.mock_worker import run_job
from src.prompt_builder import evaluation_prompt
from src.sql_plan_parser import parse_plan
from scripts.build_constructor_exercises import build, plan_fixture

ROOT = Path(__file__).resolve().parents[1]


def bank():
    return json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))


def start(path, identity):
    database.init_db(path)
    challenge = next(c for c in bank()["challenges"] if c["id"] == identity)
    aid = database.save_attempt(path, {"challenge_id": identity, "status": "In progress", "started_at": artifacts.stamp(),
                                     "updated_at": artifacts.stamp(), "constructor_workspace": artifacts.new_workspace(challenge)})
    return aid, challenge


def entity(kind, name):
    value = empty_diagram(kind)
    value["entities"] = [{"id": "entity", "name": name, "position": {"x": 0, "y": 0}}]
    return value


def workspace(path, aid):
    return database.get_attempt(path, aid)["constructor_workspace"]


@pytest.mark.parametrize("action,setting,changed", [
    ("visualize", "statement", 2),
    ("visualize", "dialect", "mysql"),
    ("convert", "target", "mysql"),
    ("explain", "planFormat", "json"),
    ("format", "keywordCase", "lower"),
    ("format", "tabWidth", 4),
    ("format", "lineLength", 120),
])
def test_sql_evidence_tracks_settings_used_by_each_action(tmp_path, action, setting, changed):
    from src.constructor_models import sql_document, slot_statuses
    from src.sql_tools import visualize_sql
    path = tmp_path / "evidence.db"
    database.init_db(path)
    slot = {"id": "analysis", "tool": "sql", "label": "SQL analysis", "required": True,
            "required_inputs": ["sql"], "required_actions": [action]}
    aid = database.save_attempt(path, {"challenge_id": "TEST-001", "status": "In progress",
        "constructor_workspace": artifacts.new_workspace({"constructor_tasks": {"version": 1, "slots": [slot]}})})
    payload = sql_document()
    payload["sql"] = "SELECT 1 AS first_statement; SELECT 2 AS second_statement;"
    payload["plan"] = "Supplied execution plan"
    result = visualize_sql(payload["sql"], "postgres", 0) if action == "visualize" else {"sql": "SELECT 1;", "nodes": [{"id": "plan"}]}
    payload["results"][action] = {"revision": 0, "inputs": {"sql": payload["sql"], "plan": payload["plan"],
        "settings": deepcopy(payload["settings"])}, "result": result}
    saved = artifacts.save_artifact(path, aid, "analysis", payload, 0)
    assert slot_statuses(workspace(path, aid))[0]["evidence"] == "Ready"
    payload["settings"][setting] = changed
    payload["revision"] += 1
    artifacts.save_artifact(path, aid, "analysis", payload, saved["revision"])
    assert slot_statuses(workspace(path, aid))[0]["evidence"] == "Outdated"
    with pytest.raises(ValueError, match="Required deliverables"):
        database.save_attempt_details(path, {**database.get_attempt(path, aid), "status": "Completed"})


def test_two_models_survive_restart_and_other_attempt_cannot_overwrite(tmp_path):
    path = tmp_path / "test.db"
    aid, _ = start(path, "CM-002")
    other, _ = start(path, "CM-002")
    artifacts.save_artifact(path, aid, "conceptual", entity("conceptual_erd", "Business"), 0)
    artifacts.save_artifact(path, aid, "logical", entity("logical_erd", "Tables"), 0)
    database.init_db(path)
    saved = workspace(path, aid)
    assert saved["artifacts"]["conceptual"]["payload"]["entities"][0]["name"] == "Business"
    assert saved["artifacts"]["logical"]["payload"]["entities"][0]["name"] == "Tables"
    assert workspace(path, other)["artifacts"] == {}
    with pytest.raises(ValueError, match="another session"):
        artifacts.save_artifact(path, aid, "logical", entity("logical_erd", "Stale overwrite"), 0)
    assert artifacts.evidence_errors(saved) == []


def test_required_evidence_blocks_status_but_optional_tools_do_not(tmp_path):
    path = tmp_path / "test.db"
    aid, _ = start(path, "CM-002")
    attempt = database.get_attempt(path, aid)
    with pytest.raises(ValueError, match="Required deliverables"):
        database.save_attempt_details(path, {**attempt, "status": "Completed"})
    artifacts.save_artifact(path, aid, "conceptual", empty_diagram("conceptual_erd"), 0)
    assert len(artifacts.evidence_errors(workspace(path, aid))) == 2
    optional, _ = start(path, "LM-001")
    assert artifacts.evidence_errors(workspace(path, optional)) == []
    database.save_attempt_details(path, {**database.get_attempt(path, optional), "status": "Completed"})


def test_copies_are_independent_and_backup_restores_pipeline_assets_atomically(tmp_path):
    path = tmp_path / "source.db"
    aid, _ = start(path, "CM-004")
    pipeline_store.init_store(path)
    from src.pipeline_models import empty_document
    document = empty_document("Copied pipeline")
    document["elements"] = [{"id": "image", "type": "image", "fileId": "asset", "x": 0, "y": 0, "width": 20, "height": 20}]
    document["files"] = {"asset": {"id": "asset", "mimeType": "image/png", "dataURL": "data:image/png;base64,aGVsbG8=", "created": 1}}
    source = pipeline_store.create_document(path, "Source", document)
    copied = pipeline_store.load_document(path, source)["document"]
    artifacts.save_artifact(path, aid, "pipeline", copied, 0, {"source": "constructor-copy", "document_id": source})
    pipeline_store.delete_document(path, source, 0)
    backup = database.export_progress(path)
    assert backup["version"] == 3
    target = tmp_path / "target.db"
    database.init_db(target)
    database.merge_progress(target, backup)
    restored = database.list_attempts(target)[0]["constructor_workspace"]["artifacts"]["pipeline"]["payload"]
    assert restored == copied
    invalid = deepcopy(backup)
    invalid["attempts"][0]["constructor_workspace"]["artifacts"]["pipeline"]["payload"]["files"] = {}
    invalid["settings"] = {"should_not_restore": True}
    with pytest.raises(ValueError):
        database.merge_progress(target, invalid)
    assert "should_not_restore" not in database.get_settings(target)
    assert "data:image" not in evaluation_prompt({}, "reasoning", {}, "", constructor_workspace=workspace(path, aid))


def test_legacy_diagram_upgrade_preserves_work_and_completed_history(tmp_path):
    path = tmp_path / "test.db"
    database.init_db(path)
    challenge = next(c for c in bank()["challenges"] if c["id"] == "CM-002")
    diagram = entity("conceptual_erd", "Saved legacy")
    aid = database.save_attempt(path, {"challenge_id": "CM-002", "status": "In progress", "answer": "Keep my answer", "diagram": diagram})
    artifacts.upgrade_attempt(path, aid, challenge)
    attempt = database.get_attempt(path, aid)
    assert attempt["answer"] == "Keep my answer"
    assert attempt["constructor_workspace"]["artifacts"]["conceptual"]["payload"]["entities"][0]["name"] == "Saved legacy"
    completed = database.save_attempt(path, {"challenge_id": "CM-002", "status": "Evaluated", "diagram": diagram, "score": 92})
    with pytest.raises(ValueError, match="unfinished"):
        artifacts.upgrade_attempt(path, completed, challenge)
    assert database.get_attempt(path, completed)["score"] == 92
    old = database.export_progress(path)
    old["version"] = 1
    for row in old["attempts"]:
        row.pop("constructor_workspace", None)
    target = tmp_path / "legacy.db"
    database.init_db(target)
    assert database.merge_progress(target, old)["added"] == 2
    assert database.list_attempts(target)[0]["diagram"]["entities"][0]["name"] == "Saved legacy"


def test_existing_completed_diagram_adapts_to_one_optional_slot(tmp_path):
    path = tmp_path / "test.db"
    database.init_db(path)
    aid = database.save_attempt(path, {"challenge_id": "CM-002", "status": "Evaluated", "score": 91,
                                       "evaluation_feedback": "Historical evaluation", "diagram": entity("conceptual_erd", "Historical model")})
    database.init_db(path)
    attempt = database.get_attempt(path, aid)
    ws = attempt["constructor_workspace"]
    assert ws["legacy"] and len(ws["artifacts"]) == 1
    assert not ws["tasks"]["slots"][0]["required"]
    assert artifacts.evidence_errors(ws) == []
    assert attempt["score"] == 91 and attempt["evaluation_feedback"] == "Historical evaluation"


def test_artifact_edits_make_evaluation_outdated_without_erasing_feedback(tmp_path):
    path = tmp_path / "test.db"
    aid, _ = start(path, "CM-001")
    saved = artifacts.save_artifact(path, aid, "conceptual", entity("conceptual_erd", "First"), 0)
    from src.ai import evaluation_revision
    database.save_attempt_details(path, {**database.get_attempt(path, aid), "status": "Evaluated", "evaluated_at": artifacts.stamp(), "evaluation_feedback": "Good reasoning", "score": 80})
    assert not artifacts.evaluation_outdated(workspace(path, aid))
    before = evaluation_revision({}, database.get_attempt(path, aid), {})
    artifacts.save_artifact(path, aid, "conceptual", entity("conceptual_erd", "Edited"), saved["revision"])
    assert before != evaluation_revision({}, database.get_attempt(path, aid), {})
    assert artifacts.evaluation_outdated(workspace(path, aid))
    assert database.get_attempt(path, aid)["evaluation_feedback"] == "Good reasoning"
    # Saving a stale prose snapshot never rolls back the editor document.
    database.save_attempt_details(path, {**database.get_attempt(path, aid), "answer": "New explanation"})
    assert workspace(path, aid)["artifacts"]["conceptual"]["payload"]["entities"][0]["name"] == "Edited"


def test_generation_evidence_is_bounded_reproducible_and_revision_bound(tmp_path):
    path = tmp_path / "test.db"
    aid, _ = start(path, "MOCK-001")
    recipe = example_recipe("Customers / orders")
    recipe["seed"] = 31415
    recipe["tables"][0]["rows"] = 10
    recipe["tables"][1]["rows"] = 30
    optional = new_field("notes")
    optional["null_pct"] = 25
    recipe["tables"][1]["fields"].append(optional)
    validate_recipe(recipe)
    manifests, samples = [], []
    for i in range(2):
        folder = tmp_path / f"generated-{i}"
        folder.mkdir()
        run_job(folder, {"workspace_id": "attempt:1:fixtures", "job_id": str(i), "revision": 2, "recipe": recipe})
        status = json.loads((folder / "status.json").read_text())
        assert status["status"] == "complete", status
        manifests.append(json.loads((folder / status["manifest"]).read_text()))
        samples.append(json.loads((folder / status["samples"]).read_text()))
    assert samples[0] == samples[1]
    assert manifests[0] == manifests[1]
    assert all(len(rows) == 10 for rows in samples[0].values())
    generation = {"status": "complete", "recipe_hash": artifacts.fingerprint(recipe), "recipe_revision": 2,
                  "manifest": manifests[0], "samples": samples[0]}
    saved = artifacts.save_artifact(path, aid, "fixtures", {"recipe": recipe, "recipe_revision": 2, "generation": generation}, 0)
    assert artifacts.evidence_errors(workspace(path, aid)) == []
    recipe["seed"] += 1
    artifacts.save_artifact(path, aid, "fixtures", {"recipe": recipe, "recipe_revision": 3, "generation": generation}, saved["revision"])
    assert artifacts.evidence_errors(workspace(path, aid))
    assert "dataset.zip" not in json.dumps(database.export_progress(path))
    with pytest.raises(ValueError, match="another session"):
        artifacts.save_artifact(path, aid, "fixtures", saved["payload"], saved["revision"])


def test_sql_drafts_roundtrip_with_inputs_and_analysis_evidence(tmp_path):
    path = tmp_path / "test.db"
    aid, challenge = start(path, "SQL-013")
    payload = deepcopy(challenge["constructor_tasks"]["slots"][0]["starter"])
    payload.update(reviewed_sql="SELECT 1", revision=2)
    assert artifacts.evidence_errors(workspace(path, aid))
    payload["results"] = {
        "convert": {"revision": 1, "inputs": {"sql": payload["sql"], "settings": payload["settings"]}, "result": {"sql": "SELECT 1"}},
        "visualize": {"revision": 2, "inputs": {"sql": "SELECT 1", "settings": {**payload["settings"], "dialect": "duckdb"}}, "result": {"nodes": [{"id": "one"}]}}}
    artifacts.save_artifact(path, aid, "migration", payload, 0)
    database.init_db(path)
    assert workspace(path, aid)["artifacts"]["migration"]["payload"] == payload
    assert artifacts.evidence_errors(workspace(path, aid)) == []
    saved = workspace(path, aid)["artifacts"]["migration"]
    payload["reviewed_sql"] = "SELECT 2"
    artifacts.save_artifact(path, aid, "migration", payload, saved["revision"])
    assert artifacts.evidence_errors(workspace(path, aid))


def test_completed_backup_can_replace_an_incomplete_matching_attempt(tmp_path):
    path = tmp_path / "source.db"
    aid, _ = start(path, "CM-001")
    target = tmp_path / "target.db"
    database.init_db(target)
    database.merge_progress(target, database.export_progress(path))
    artifacts.save_artifact(path, aid, "conceptual", entity("conceptual_erd", "Completed model"), 0)
    database.save_attempt_details(path, {**database.get_attempt(path, aid), "status": "Completed", "updated_at": artifacts.stamp()})
    assert database.merge_progress(target, database.export_progress(path))["updated"] == 1
    assert database.list_attempts(target)[0]["status"] == "Completed"


@pytest.mark.parametrize("generation", [[], {"manifest": {"tables": [None]}}, "invalid"])
def test_malformed_generation_evidence_is_a_validation_error(generation):
    with pytest.raises(ValueError):
        artifacts.validate_payload("mock", {"recipe": example_recipe("Customers / orders"), "generation": generation})


def test_focused_bank_is_idempotent_and_public_fixtures_validate():
    source = bank()
    generated, report = build(source)
    second, _ = build(generated)
    assert generated == second
    assert len(generated["challenges"]) == 72
    assert report["valid_challenges"] == 72
    for after in (True, False):
        plan = parse_plan(plan_fixture(after))
        assert plan["summary"]["Plan 1"]["Execution Time"] == (35 if after else 120)
    for challenge in generated["challenges"]:
        if challenge.get("constructor_tasks"):
            artifacts.validate_tasks(challenge["constructor_tasks"])


def widget(items, label):
    return next(w for w in items if w.label == label)


def test_preview_creates_nothing_and_linked_open_preserves_answer(tmp_path, monkeypatch):
    from src.erd_component import _component
    _component.clear()  # Each AppTest owns its component registry.
    path = tmp_path / "test.db"
    monkeypatch.setattr(config, "DB_PATH", path)
    app = AppTest.from_file(str(ROOT / "app.py"), default_timeout=25).run()
    app.session_state["active_challenge"] = "CM-002"
    app.session_state["direct_preview"] = "CM-002"
    app.run()
    assert database.list_attempts(path) == []
    widget(app.button, "Start challenge").click().run()
    assert not app.exception
    aid = app.session_state["active_attempt"]
    widget(app.text_area, "Your solution").input("Mapping explanation")
    app.button(key=f"artifact_{aid}_conceptual").click().run()
    assert not app.exception
    assert database.get_attempt(path, aid)["answer"] == "Mapping explanation"
    assert workspace(path, aid)["artifacts"] == {}  # Opening is not a saved edit.
    assert "logical" not in workspace(path, aid)["artifacts"]
