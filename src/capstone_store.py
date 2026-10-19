"""Transactional project ownership, copied inputs, reconciliation and final context."""
from copy import deepcopy
from contextlib import contextmanager
from contextvars import ContextVar
import json
from uuid import uuid4

from src.capstone_models import (fingerprint, new_stage_workspace, require, validate_definition,
                                 validate_run, written_values)
from src.constructor_models import evidence_errors, new_workspace, stamp, summaries, payload_summary
from src.repair_content import substantive_fingerprint


_dataset_reads = ContextVar("capstone_dataset_reads", default=None)


@contextmanager
def dataset_reads(con):
    """Reuse immutable snapshots within one calculation, never across requests.

    Connection ownership isolates sessions/transactions. Bound retained records
    to eight snapshots, including older copies referenced by a run's history.
    """
    active = _dataset_reads.get()
    if active is not None and active[0] is con:
        yield
        return
    token = _dataset_reads.set((con, {}))
    try:
        yield
    finally:
        _dataset_reads.reset(token)


def init_schema(con):
    con.execute("CREATE TABLE IF NOT EXISTS capstone_runs (run_id TEXT PRIMARY KEY, payload TEXT NOT NULL)")
    con.execute("CREATE TABLE IF NOT EXISTS capstone_datasets (dataset_id TEXT PRIMARY KEY, run_id TEXT NOT NULL, payload TEXT NOT NULL)")
    con.execute("CREATE INDEX IF NOT EXISTS idx_capstone_datasets_run ON capstone_datasets(run_id)")


def load_run(con, run_id):
    row = con.execute("SELECT payload FROM capstone_runs WHERE run_id=?", (run_id,)).fetchone()
    require(row is not None, "project run no longer exists")
    return json.loads(row[0])


def get_run(path, run_id):
    from src.database import connect
    with connect(path) as con:
        return load_run(con, run_id)


def list_runs(path):
    from src.database import connect
    with connect(path) as con:
        return sorted([json.loads(r[0]) for r in con.execute("SELECT payload FROM capstone_runs")], key=lambda r: r["updated_at"], reverse=True)


def delete_run(path, run_id, *, expected_revision):
    """Atomically remove one run and its owned work after UI confirmation."""
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        run = load_run(con, run_id)
        require(run["revision"] == expected_revision, "project changed in another session; review it before deleting")
        con.execute("DELETE FROM capstone_datasets WHERE run_id=?", (run_id,))
        con.execute("DELETE FROM attempts WHERE project_run_id=?", (run_id,))
        con.execute("DELETE FROM capstone_runs WHERE run_id=?", (run_id,))


def save_run(con, run, expected=None):
    if expected is not None:
        require(load_run(con, run["run_id"])["revision"] == expected, "project changed in another session; reopen before retrying")
        run["revision"] = expected + 1
    run["updated_at"] = stamp()
    checked = validate_run(run)
    con.execute("INSERT INTO capstone_runs(run_id,payload) VALUES(?,?) ON CONFLICT(run_id) DO UPDATE SET payload=excluded.payload",
                (run["run_id"], json.dumps(checked, ensure_ascii=False)))
    return checked


def create_run(path, definition, bank):
    from src.database import connect
    definition = validate_definition(definition, bank["challenges"])
    by_id = {c["id"]: c for c in bank["challenges"]}
    created = stamp()
    run = {"version": 1, "run_id": str(uuid4()), "revision": 1, "definition": definition,
        "challenges": {s["id"]: deepcopy(by_id[s["challenge_id"]]) for s in definition["stages"]},
        "stage_rubrics": {s["id"]: deepcopy(bank["rubrics"][by_id[s["challenge_id"]]["rubric_ref"]]) for s in definition["stages"]},
        "rubric": deepcopy(bank["rubrics"][definition["rubric_ref"]]), "created_at": created, "updated_at": created,
        "stage_attempts": {}, "inputs": {}, "stage_datasets": {}, "completion": None, "evaluation": None,
        "completion_history": [], "evaluation_history": []}
    with connect(path) as con:
        save_run(con, run)
    return run


def stage_rubric(run, stage_id, bank=None):
    """New runs own all grading criteria; older shared-rubric runs already do."""
    if run.get("stage_rubrics") is not None:
        return deepcopy(run["stage_rubrics"][stage_id])
    reference = run["challenges"][stage_id]["rubric_ref"]
    if reference == run["definition"]["rubric_ref"]:
        return deepcopy(run["rubric"])
    require(bank and reference in bank.get("rubrics", {}), "this older stage's rubric is unavailable; restore its original bank before evaluating")
    return deepcopy(bank["rubrics"][reference])


def stage_owner(path, attempt_id):
    from src.database import connect
    with connect(path) as con:
        row = con.execute("SELECT project_run_id, project_stage_id FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        return (row[0], row[1]) if row and row[0] else None


def attempts_for(con, run):
    from src.database import _decode_attempt
    return {s: _decode_attempt(row) for s, aid in run["stage_attempts"].items()
            if (row := con.execute("SELECT * FROM attempts WHERE attempt_id=? AND project_run_id=? AND project_stage_id=?", (aid, run["run_id"], s)).fetchone()) is not None}


def dataset_record(con, run, dataset_id):
    if not dataset_id:
        return None
    active = _dataset_reads.get()
    cached = active[1] if active is not None and active[0] is con else None
    key = (run["run_id"], dataset_id)
    if cached is not None and key in cached:
        return cached[key]
    row = con.execute("SELECT payload FROM capstone_datasets WHERE dataset_id=? AND run_id=?", (dataset_id, run["run_id"])).fetchone()
    record = json.loads(row[0]) if row else None
    if record is not None and cached is not None:
        if len(cached) >= 8:
            cached.pop(next(iter(cached)))
        cached[key] = record
    return record


def dataset_summary(record):
    if not record:
        return None
    data = record["data"]
    return {"dataset_id": record["dataset_id"], "content_hash": data["content_hash"], "recipe_hash": data["recipe_hash"],
            "seed": data["seed"], "generator": data["generator"], "manifest": data["manifest"],
            "tables": [{"name": t["name"], "columns": t["columns"], "rows": len(t["rows"])} for t in data["tables"]]}


def dataset_identity(record):
    """Stable snapshot lineage survives a conflict import's local UUID remap."""
    return record.get("origin_dataset_id", record["dataset_id"]) if record else None


def execution_content(workspace):
    return {task: {k: e.get(k) for k in ("query_hash", "dataset_hash", "task_id", "status", "columns", "row_count", "truncated", "sample", "error")}
            for task, e in workspace.get("executions", {}).items()}


def _prompt_context(con, run, stage_id, attempt, attempts):
    """Public copied inputs and bounded execution evidence, never full datasets."""
    workspace = attempt.get("capstone_workspace") or {}
    dataset_id = workspace.get("dataset_id") or run["stage_datasets"].get(stage_id)
    record = dataset_record(con, run, dataset_id)
    drafts = (attempt.get("sql_workspace") or {}).get("drafts", {})
    executions = {}
    for task, evidence in workspace.get("executions", {}).items():
        executions[task] = {k: evidence.get(k) for k in (
            "task_id", "dataset_id", "dataset_hash", "query_hash", "status", "columns", "types",
            "row_count", "truncated", "sample_truncated", "sample", "error")}
        executions[task]["current"] = bool(record
            and evidence.get("run_id") == run["run_id"] and evidence.get("stage_id") == stage_id
            and evidence.get("task_id") == task and evidence.get("dataset_id") == dataset_id
            and evidence.get("dataset_hash") == record["data"]["content_hash"]
            and evidence.get("query_hash") == fingerprint(drafts.get(task, "")))
    inputs = {}
    for key, saved in run["inputs"].get(stage_id, {}).items():
        inputs[key] = {k: deepcopy(saved[k]) for k in ("source", "tool", "revision", "fingerprint", "payload", "reasoning", "acknowledgment") if k in saved}
        if saved["tool"] in ("diagram", "pipeline", "mock"):
            inputs[key]["payload"] = payload_summary(saved["tool"], saved["payload"])
        source = saved["source"]
        current = current_source(con, run, source["stage_id"], source["slot_id"], attempts)
        inputs[key]["source_changed"] = not current or current["fingerprint"] != saved["fingerprint"]
    return {"project": run["definition"]["title"], "run_id": run["run_id"],
            "stage": deepcopy(next(s for s in run["definition"]["stages"] if s["id"] == stage_id)),
            "copied_inputs": inputs, "dataset": dataset_summary(record), "execution_evidence": executions}


def stage_prompt_context(path, attempt_id):
    from src.database import connect, _decode_attempt
    with connect(path) as con, dataset_reads(con):
        row = con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        require(row is not None, "attempt no longer exists")
        attempt = _decode_attempt(row)
        run = load_run(con, attempt["project_run_id"])
        sid = attempt["project_stage_id"]
        require(run["stage_attempts"].get(sid) == attempt_id, "stage ownership mismatch")
        return _prompt_context(con, run, sid, attempt, attempts_for(con, run))


def stage_fingerprint(con, run, stage, attempt):
    ws = attempt.get("capstone_workspace") or new_stage_workspace()
    constructor = attempt.get("constructor_workspace") or {}
    artifacts = constructor.get("artifacts", {})
    content = {"answer": attempt.get("answer", ""), "artifacts": {key: substantive_fingerprint(a["tool"], a["payload"]) for key, a in artifacts.items()},
               "dataset_id": dataset_identity(dataset_record(con, run, ws.get("dataset_id"))), "drafts": (attempt.get("sql_workspace") or {}).get("drafts", {}),
               "executions": execution_content(ws), "derived_from": ws.get("derived_from")}
    for key, a in artifacts.items():
        if a["tool"] == "mock":
            p = a["payload"]
            content[key + "_generation"] = {"recipe_revision": p.get("recipe_revision", 0),
                "generation": {k: (p.get("generation") or {}).get(k) for k in ("recipe_hash", "recipe_revision", "status")},
                "pending_rules": p.get("pending_rules", False)}
    saved = dataset_record(con, run, run["stage_datasets"].get(stage["id"]))
    content["saved_dataset"] = {"id": dataset_identity(saved), "hash": saved["data"]["content_hash"]} if saved else None
    return fingerprint(content)


def current_source(con, run, source_stage, source_slot, attempts):
    stage = next(s for s in run["definition"]["stages"] if s["id"] == source_stage)
    output = next(s for s in stage["outputs"] if s["id"] == source_slot)
    attempt = attempts.get(source_stage)
    if not attempt:
        return None
    tool = output["tool"]
    revision = 0
    if tool in ("diagram", "pipeline", "mock"):
        artifact = (attempt.get("constructor_workspace") or {}).get("artifacts", {}).get(source_slot)
        if not artifact:
            return None
        payload, revision = deepcopy(artifact["payload"]), artifact["revision"]
        content = substantive_fingerprint(tool, payload)
    elif tool == "dataset":
        record = dataset_record(con, run, run["stage_datasets"].get(source_stage))
        if not record:
            return None
        payload = dataset_summary(record)
        recipe = next((a for a in (attempt.get("constructor_workspace") or {}).get("artifacts", {}).values() if a["tool"] == "mock"), None)
        revision = recipe["revision"] if recipe else 0
        content = {"dataset_id": dataset_identity(record), "dataset": payload["content_hash"], "current_recipe": substantive_fingerprint("mock", recipe["payload"]) if recipe else None}
    else:
        payload = {"drafts": (attempt.get("sql_workspace") or {}).get("drafts", {}),
                   "executions": execution_content(attempt.get("capstone_workspace") or {})}
        content = payload
    reasoning = attempt.get("answer", "")
    return {"source": {"run_id": run["run_id"], "stage_id": source_stage, "slot_id": source_slot},
            "tool": tool, "revision": revision, "fingerprint": fingerprint({"content": content, "reasoning": reasoning}),
            "payload": payload, "reasoning": reasoning, "captured_at": stamp()}


def own_errors(con, run, stage, attempt):
    if not attempt:
        return ["Start this stage when its prerequisites are ready."]
    errors = evidence_errors(attempt.get("constructor_workspace"), attempt.get("answer"))
    for label, value in written_values(attempt.get("answer"), stage["written_sections"]).items():
        if not value.strip():
            errors.append("Write: " + label + ".")
    ws = attempt.get("capstone_workspace") or new_stage_workspace()
    if any(s.get("mode") == "recipe" for s in stage["inputs"]) and not ws.get("derived_from"):
        errors.append("Use this model to create a recipe, then resolve its mappings.")
    if any(o["tool"] == "dataset" for o in stage["outputs"]):
        record = dataset_record(con, run, run["stage_datasets"].get(stage["id"]))
        recipe = next((a["payload"].get("recipe") for a in (attempt.get("constructor_workspace") or {}).get("artifacts", {}).values() if a["tool"] == "mock"), None)
        if not record or not recipe or record["data"]["recipe_hash"] != fingerprint(recipe):
            errors.append("Save a dataset for capstone SQL from successful current generation.")
    challenge = run["challenges"][stage["id"]]
    if challenge.get("dataset_sql"):
        data = dataset_record(con, run, ws.get("dataset_id"))
        if not data:
            errors.append("Select an available saved dataset from this run.")
        for task in challenge["dataset_sql"]["tasks"]:
            query = (attempt.get("sql_workspace") or {}).get("drafts", {}).get(task["id"], "")
            result = ws.get("executions", {}).get(task["id"], {})
            if (not data or result.get("status") != "success" or result.get("query_hash") != fingerprint(query)
                    or result.get("dataset_hash") != data["data"]["content_hash"] or result.get("dataset_id") != ws.get("dataset_id")
                    or result.get("run_id") != run["run_id"] or result.get("stage_id") != stage["id"]):
                errors.append(task["title"] + ": run the current query successfully against the selected dataset.")
    return errors


def stage_states(con, run, attempts=None):
    attempts = attempts if attempts is not None else attempts_for(con, run)
    states = {}
    by_stage = {s["id"]: s for s in run["definition"]["stages"]}
    def state(identity):
        if identity in states:
            return states[identity]
        stage, attempt = by_stage[identity], attempts.get(identity)
        parents = {p: state(p) for p in stage["prerequisites"]}
        notices = []
        for inp in stage["inputs"]:
            record = run["inputs"].get(identity, {}).get(inp["id"])
            if not record:
                continue
            source = current_source(con, run, inp["source_stage"], inp["source_slot"], attempts)
            current = source and source["fingerprint"]
            ack = record.get("acknowledgment") or {}
            if not current or (record["fingerprint"] != current and ack.get("fingerprint") != current):
                notices.append({"input_id": inp["id"], "source": source,
                    "message": "Source unavailable; restore it to reconcile." if source is None else "Source content changed. Update the reference or explain why you are keeping your current work."})
        errors = own_errors(con, run, stage, attempt)
        completed = bool(attempt and attempt["status"] in ("Completed", "Evaluated") and not errors
                         and (attempt.get("capstone_workspace") or {}).get("completed_fingerprint") == stage_fingerprint(con, run, stage, attempt))
        inherited = any(p["notices"] or p["inherited"] for p in parents.values())
        ready = all(p["current"] for p in parents.values()) and not notices and not inherited
        current = completed and ready
        label = ("Needs reconciliation" if notices else "Upstream reconciliation pending" if inherited else
                 "Complete" if current else "Completion outdated" if attempt and attempt["status"] in ("Completed", "Evaluated") else
                 "In progress" if attempt else "Ready to start" if ready else "Locked")
        states[identity] = {"status": label, "current": current, "can_start": ready, "errors": errors,
                            "notices": notices, "inherited": inherited, "attempt_id": (attempt or {}).get("attempt_id")}
        return states[identity]
    for identity in by_stage:
        state(identity)
    return states


def view(path, run_id, *, include_submission=True):
    from src.database import connect
    with connect(path) as con, dataset_reads(con):
        run = load_run(con, run_id)
        attempts = attempts_for(con, run)
        states = stage_states(con, run, attempts)
        signature = submission_fingerprint(con, run, attempts) if include_submission else None
        return run, attempts, states, signature


def start_stage(path, run_id, stage_id):
    from src.database import connect, _save_attempt
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        run = load_run(con, run_id)
        stage = next(s for s in run["definition"]["stages"] if s["id"] == stage_id)
        if stage_id in run["stage_attempts"]:
            return run["stage_attempts"][stage_id]
        attempts = attempts_for(con, run)
        require(stage_states(con, run, attempts)[stage_id]["can_start"], "complete current prerequisites and resolve dependencies before starting")
        challenge, created = run["challenges"][stage_id], stamp()
        references = {}
        ws = new_stage_workspace()
        for inp in stage["inputs"]:
            source = current_source(con, run, inp["source_stage"], inp["source_slot"], attempts)
            require(source is not None, "required source output is unavailable")
            references[inp["id"]] = {**source, "history": [], "acknowledgment": None}
            if inp.get("mode") == "dataset":
                ws["dataset_id"] = source["payload"]["dataset_id"]
        aid = _save_attempt(con, {"challenge_id": challenge["id"], "status": "In progress", "started_at": created,
            "updated_at": created, "constructor_workspace": new_workspace(challenge), "capstone_workspace": ws,
            "project_run_id": run_id, "project_stage_id": stage_id})
        run["stage_attempts"][stage_id] = aid
        run["inputs"][stage_id] = references
        save_run(con, run, run["revision"])
        return aid


def completion_errors(con, run, stage, attempt):
    with dataset_reads(con):
        return _completion_errors(con, run, stage, attempt)


def _completion_errors(con, run, stage, attempt):
    errors = own_errors(con, run, stage, attempt)
    states = stage_states(con, run)
    state = states[stage["id"]]
    if state["notices"] or state["inherited"]:
        errors.append("Resolve upstream reconciliation notices.")
    if any(not states[p]["current"] for p in stage["prerequisites"]):
        errors.append("Prerequisite stages need current completion evidence.")
    return errors


def validate_completion(con, attempt, changes):
    run = load_run(con, attempt["project_run_id"])
    stage = next(s for s in run["definition"]["stages"] if s["id"] == attempt["project_stage_id"])
    require(run["stage_attempts"].get(stage["id"]) == attempt["attempt_id"], "stage ownership changed")
    updated = {**attempt, **changes}
    errors = completion_errors(con, run, stage, updated)
    require(not errors, "; ".join(errors))
    ws = deepcopy(attempt.get("capstone_workspace") or new_stage_workspace())
    ws["completed_fingerprint"] = stage_fingerprint(con, run, stage, updated)
    con.execute("UPDATE attempts SET capstone_workspace=? WHERE attempt_id=?", (json.dumps(ws), attempt["attempt_id"]))


def errors_for_attempt(path, attempt):
    from src.database import connect
    with connect(path) as con:
        run = load_run(con, attempt["project_run_id"])
        stage = next(s for s in run["definition"]["stages"] if s["id"] == attempt["project_stage_id"])
        return completion_errors(con, run, stage, attempt)


def reconcile(path, run_id, stage_id, input_id, choice, explanation="", *, confirm_replace=False, expected_revision=None):
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        run = load_run(con, run_id)
        if expected_revision is not None:
            require(run["revision"] == expected_revision, "project changed; reopen before reconciling")
        stage = next(s for s in run["definition"]["stages"] if s["id"] == stage_id)
        inp = next(s for s in stage["inputs"] if s["id"] == input_id)
        record = run["inputs"][stage_id][input_id]
        source = current_source(con, run, inp["source_stage"], inp["source_slot"], attempts_for(con, run))
        require(source is not None, "source is unavailable; restore it first")
        require(choice in ("update", "keep"), "choose update or keep")
        if choice == "keep":
            require(isinstance(explanation, str) and explanation.strip(), "keeping current work requires an explanation")
            record.setdefault("acknowledgment_history", []).append(record.get("acknowledgment")) if record.get("acknowledgment") else None
            record["acknowledgment"] = {"fingerprint": source["fingerprint"], "explanation": explanation.strip(), "at": stamp()}
        else:
            if inp.get("mode") == "dataset":
                require(confirm_replace, "confirm dataset replacement; SQL drafts will be preserved")
                aid = run["stage_attempts"][stage_id]
                row = con.execute("SELECT capstone_workspace FROM attempts WHERE attempt_id=?", (aid,)).fetchone()
                ws = json.loads(row[0])
                ws["dataset_id"] = source["payload"]["dataset_id"]
                con.execute("UPDATE attempts SET capstone_workspace=? WHERE attempt_id=?", (json.dumps(ws), aid))
            history = [*record.get("history", []), {k: v for k, v in record.items() if k != "history"}]
            run["inputs"][stage_id][input_id] = {**source, "history": history, "acknowledgment": None}
        return save_run(con, run, run["revision"])


def derive_recipe(path, attempt_id, input_id, *, confirm_replace=False):
    from src.database import connect
    from src.mock_diagrams import diagram_recipe
    from src.constructor_models import make_artifact
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        from src.database import _decode_attempt
        attempt = _decode_attempt(con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone())
        run = load_run(con, attempt["project_run_id"])
        stage_id = attempt["project_stage_id"]
        stage = next(s for s in run["definition"]["stages"] if s["id"] == stage_id)
        inp = next(s for s in stage["inputs"] if s["id"] == input_id and s.get("mode") == "recipe")
        ref = run["inputs"][stage_id][inp["id"]]
        constructor = attempt["constructor_workspace"]
        slot = next(s for s in constructor["tasks"]["slots"] if s["tool"] == "mock")
        old = constructor["artifacts"].get(slot["id"])
        require(not old or confirm_replace, "confirm replacing the recipe; the prior snapshot is retained")
        if old:
            run.setdefault("replaced_recipes", []).append({"stage_id": stage_id, "artifact": deepcopy(old), "at": stamp()})
        recipe = diagram_recipe(ref["payload"])
        artifact = make_artifact(slot, {"recipe": recipe, "recipe_revision": (old or {}).get("payload", {}).get("recipe_revision", 0) + 1, "generation": None},
            {"source": "capstone-logical-copy", **ref["source"], "source_fingerprint": ref["fingerprint"]})
        if old:
            artifact.update(revision=old["revision"] + 1, created_at=old["created_at"])
        constructor["artifacts"][slot["id"]] = artifact
        ws = attempt["capstone_workspace"]
        ws["derived_from"] = ref["fingerprint"]
        con.execute("UPDATE attempts SET constructor_workspace=?,capstone_workspace=?,resume_target=?,activity_at=?,updated_at=? WHERE attempt_id=?",
            (json.dumps(constructor), json.dumps(ws), "artifact:" + slot["id"], stamp(), stamp(), attempt_id))
        save_run(con, run, run["revision"])
        return artifact


def submission_fingerprint(con, run, attempts=None):
    attempts = attempts if attempts is not None else attempts_for(con, run)
    def portable(value):
        if isinstance(value, list):
            return [portable(v) for v in value]
        if not isinstance(value, dict):
            return value
        return {key: dataset_identity(dataset_record(con, run, item)) if key == "dataset_id" else portable(item)
                for key, item in value.items() if key != "run_id"}
    return fingerprint({"definition": run["definition"], "briefs": run["challenges"], "rubric": run["rubric"],
        "stages": {s["id"]: stage_fingerprint(con, run, s, attempts[s["id"]]) for s in run["definition"]["stages"] if s["id"] in attempts},
        "inputs": portable(run["inputs"]), "datasets": {sid: dataset_identity(dataset_record(con, run, did)) for sid, did in run["stage_datasets"].items()}})


def complete_run(path, run_id):
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        run = load_run(con, run_id)
        attempts = attempts_for(con, run)
        require(all(s["current"] for s in stage_states(con, run, attempts).values()), "all stages need current completion and resolved dependencies")
        if run.get("completion"):
            run["completion_history"].append(run["completion"])
        final = run["definition"]["stages"][-1]["id"]
        run["completion"] = {"at": stamp(), "fingerprint": submission_fingerprint(con, run, attempts), "defense": attempts[final]["answer"]}
        return save_run(con, run, run["revision"])


def evaluate_run(path, run_id, scores, feedback, *, expected_fingerprint):
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        run = load_run(con, run_id)
        current = submission_fingerprint(con, run)
        require(all(s["current"] for s in stage_states(con, run).values()), "all stages must have current completion evidence")
        require(current == expected_fingerprint and (run.get("completion") or {}).get("fingerprint") == current,
                "final submission changed; complete and review the current project again")
        require(set(scores) == set(run["rubric"]) and all(type(v) in (int, float) and 0 <= v <= run["rubric"][k] for k, v in scores.items()), "scores must match the project rubric")
        if run.get("evaluation"):
            run["evaluation_history"].append(run["evaluation"])
        run["evaluation"] = {"at": stamp(), "fingerprint": current, "rubric_scores": scores, "score": sum(scores.values()), "feedback": feedback}
        return save_run(con, run, run["revision"])


def final_prompt(path, run_id):
    from src.database import connect
    from src.prompt_builder import public_context
    run, attempts, states, signature = view(path, run_id)
    with connect(path) as con, dataset_reads(con):
        stage_contexts = {s["id"]: _prompt_context(con, run, s["id"], attempts.get(s["id"], {}), attempts)
                          for s in run["definition"]["stages"]}
    context = {"project": run["definition"]["title"], "rubric": run["rubric"], "submission_fingerprint": signature,
        "stages": [{"stage": s["id"], "brief": run["challenges"][s["id"]]["student"], "reasoning": attempts.get(s["id"], {}).get("answer", ""),
            "deliverables": summaries(attempts.get(s["id"], {}).get("constructor_workspace")),
            "sql": (attempts.get(s["id"], {}).get("sql_workspace") or {}).get("drafts", {}),
            "challenge": public_context(run["challenges"][s["id"]]),
            "project_context": stage_contexts[s["id"]], "status": states[s["id"]]["status"]}
            for s in run["definition"]["stages"]],
        "dependencies": {stage: {key: {"source": r["source"], "revision": r["revision"], "fingerprint": r["fingerprint"], "acknowledgment": r.get("acknowledgment")}
                         for key, r in records.items()} for stage, records in run["inputs"].items()}}
    context["dependency_explanations"] = {stage: {key: [ack for snapshot in [r, *r.get("history", [])]
        for ack in [snapshot.get("acknowledgment"), *snapshot.get("acknowledgment_history", [])] if ack]
        for key, r in records.items()} for stage, records in run["inputs"].items()}
    return "Evaluate this complete project using the supplied 100-point rubric. Evidence presence and successful SELECT execution do not establish business correctness. Assess alternative defensible designs. Do not average stage scores. Return JSON with rubric_scores, total_score, feedback, weak_topics: [] and mistake_categories: [].\n" + json.dumps(context, ensure_ascii=False, indent=2)
