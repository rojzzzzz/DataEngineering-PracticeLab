import json
from copy import deepcopy

from capstone_examples import build_to_queries
from src import capstone_store as store, database as db
from src.capstone_sql import save_evidence
from src.constructor_models import fingerprint
from src.prompt_builder import student_prompt, evaluation_prompt


def test_saved_project_prompts_include_tasks_handoffs_schema_and_current_bounded_results(tmp_path):
    path = tmp_path / "project.db"
    run, aid, snapshot, _ = build_to_queries(path)
    challenge = run["challenges"]["queries"]
    attempt = db.get_attempt(path, aid)
    attempt["sql_workspace"] = {"version": 1, "drafts": {"monthly": "SELECT 1 AS count"}, "assessment": None}
    db.save_sql_workspace(path, aid, attempt["sql_workspace"])
    request = {"run_id": run["run_id"], "stage_id": "queries", "dataset_id": snapshot["dataset_id"],
               "dataset_hash": snapshot["data"]["content_hash"], "task_id": "monthly", "query_hash": fingerprint("SELECT 1 AS count")}
    save_evidence(path, aid, request, {"ok": True, "columns": ["count"], "types": ["INTEGER"],
                                    "rows": [[i] for i in range(60)], "truncated": False})
    context = store.stage_prompt_context(path, aid)
    assert context["dataset"]["dataset_id"] == snapshot["dataset_id"]
    assert all(isinstance(t["rows"], int) for t in context["dataset"]["tables"])
    assert context["copied_inputs"] and all(not v["source_changed"] for v in context["copied_inputs"].values())
    evidence = context["execution_evidence"]["monthly"]
    assert evidence["current"] and evidence["sample_truncated"] and not evidence["truncated"]
    assert len(evidence["sample"]) == 50 and evidence["row_count"] == 60
    for prompt in (student_prompt(challenge, "Coach", project_context=context),
                   evaluation_prompt(challenge, "Reasoning", {"correctness": 100}, "Evaluate",
                                     sql_workspace=attempt["sql_workspace"], project_context=context),
                   store.final_prompt(path, run["run_id"])):
        assert snapshot["dataset_id"] in prompt and "order_lines" in prompt
        assert challenge["dataset_sql"]["tasks"][0]["description"] in prompt
        assert "sample_truncated" in prompt
        assert "private_tests" not in prompt and "reference_query" not in prompt
        assert '"rows": [[' not in prompt
    # Saved output must not silently become evidence for an edited query.
    attempt = db.get_attempt(path, aid)
    attempt["sql_workspace"]["drafts"]["monthly"] = "SELECT 2 AS count"
    db.save_sql_workspace(path, aid, attempt["sql_workspace"])
    assert not store.stage_prompt_context(path, aid)["execution_evidence"]["monthly"]["current"]
    final = json.loads(store.final_prompt(path, run["run_id"]).split("\n", 1)[1])
    queries = next(s for s in final["stages"] if s["stage"] == "queries")
    assert not queries["project_context"]["execution_evidence"]["monthly"]["current"]
    # Ownership and snapshot identity matter even for an otherwise matching hash.
    attempt["sql_workspace"]["drafts"]["monthly"] = "SELECT 1 AS count"
    attempt["capstone_workspace"]["executions"]["monthly"]["dataset_hash"] = "0" * 64
    db.save_sql_workspace(path, aid, attempt["sql_workspace"])
    db._save_workspace(path, aid, "capstone_workspace", attempt["capstone_workspace"])
    assert not store.stage_prompt_context(path, aid)["execution_evidence"]["monthly"]["current"]


def test_project_history_resolution_requires_owned_snapshot():
    from src.attempt_resume import saved_challenge
    attempt = {"attempt_id": 9, "challenge_id": "COF-001", "project_run_id": "run", "project_stage_id": "business"}
    original = {"id": "COF-001", "title": "Original brief"}
    run = {"stage_attempts": {"business": 9}, "challenges": {"business": original}}
    assert saved_challenge(attempt, {}, {"run": run}) == original
    assert saved_challenge(attempt, {"COF-001": {"title": "Changed brief"}}, {"run": run}) == original
    wrong = deepcopy(run)
    wrong["stage_attempts"]["business"] = 10
    assert saved_challenge(attempt, {"COF-001": original}, {"run": wrong}) is None
    assert saved_challenge({"challenge_id": "missing"}, {}, {}) is None


def test_copied_pipeline_handoffs_exclude_image_bytes(tmp_path):
    from capstone_examples import bank, model, recipe, save_model, finish
    from src import constructor_artifacts as artifacts
    from src.pipeline_models import empty_document
    path = tmp_path / "pipeline.db"
    db.init_db(path)
    b = bank()
    definition = b["capstones"][0]
    business = next(c for c in b["challenges"] if c["id"] == definition["stages"][0]["challenge_id"])
    business["constructor_tasks"]["slots"].append({"id": "pipeline", "tool": "pipeline", "label": "Pipeline", "required": False})
    definition["stages"][0]["outputs"].append({"id": "pipeline", "tool": "pipeline"})
    definition["stages"][1]["inputs"].append({"id": "pipeline-input", "tool": "pipeline", "source_stage": "business", "source_slot": "pipeline", "mode": "reference"})
    run = store.create_run(path, definition, b)
    bid = save_model(path, run, "business", model("conceptual_erd", recipe()))
    pipeline = empty_document()
    pipeline["notes"] = "Public ingestion design"
    pipeline["files"] = {"image": {"id": "image", "mimeType": "image/png", "dataURL": "data:image/png;base64,AQID"}}
    artifacts.save_artifact(path, bid, "pipeline", pipeline, 0)
    finish(path, run, "business")
    aid = store.start_stage(path, run["run_id"], "operational")
    context = json.dumps(store.stage_prompt_context(path, aid))
    final = store.final_prompt(path, run["run_id"])
    for text in (context, final):
        assert "Public ingestion design" in text
        assert "dataURL" not in text and "base64,AQID" not in text
