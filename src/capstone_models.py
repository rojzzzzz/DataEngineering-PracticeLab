"""Versioned project definitions and bounded run/stage persistence contracts."""
import json
import math
import re
from uuid import UUID
from src.constructor_models import fingerprint, validate_payload, validate_tasks

ID = re.compile(r"[a-z][a-z0-9_-]{0,63}\Z")
HASH = re.compile(r"[0-9a-f]{64}\Z")
TOOLS = {"diagram", "pipeline", "mock", "dataset", "sql_execution"}


def require(condition, message):
    if not condition:
        raise ValueError("Connected capstone: " + message)


def uuid_value(value):
    require(isinstance(value, str), "identity must be a UUID")
    try:
        require(str(UUID(value)) == value, "identity must be a canonical UUID")
    except (ValueError, AttributeError) as exc:
        raise ValueError("Connected capstone: invalid UUID") from exc
    return value


def json_copy(value, limit=128 * 1024**2):
    try:
        raw = json.dumps(value, ensure_ascii=False, allow_nan=False)
        require(len(raw.encode()) <= limit, "document exceeds its size limit")
        return json.loads(raw)
    except (TypeError, RecursionError) as exc:
        raise ValueError("Connected capstone: finite JSON required") from exc


def validate_definition(value, challenges, *, allow_legacy_task_ids=False):
    value = json_copy(value, 128 * 1024)
    require(isinstance(value, dict) and value.get("version") == 1 and type(value["version"]) is int, "unsupported definition version")
    require(isinstance(value.get("id"), str) and ID.fullmatch(value["id"]) and isinstance(value.get("title"), str) and value["title"].strip(), "definition needs a stable ID and title")
    stages = value.get("stages")
    require(isinstance(stages, list) and 1 <= len(stages) <= 12, "definition needs 1–12 stages")
    require(isinstance(challenges, list) and all(isinstance(c, dict) and isinstance(c.get("id"), str) for c in challenges), "invalid stage briefs")
    by_id = {c["id"]: c for c in challenges}
    stage_ids, challenge_ids = set(), set()
    for stage in stages:
        require(isinstance(stage, dict) and isinstance(stage.get("id"), str) and ID.fullmatch(stage["id"]) and stage["id"] not in stage_ids, "stage IDs must be unique")
        stage_ids.add(stage["id"])
        cid = stage.get("challenge_id")
        require(cid in by_id and cid not in challenge_ids, "stage challenge references must exist and be unique")
        challenge_ids.add(cid)
        challenge = by_id[cid]
        require(challenge.get("capstone", {}).get("definition_id") == value["id"] and challenge["capstone"].get("stage_id") == stage["id"], "challenge project label must match its stage")
        require(isinstance(stage.get("prerequisites"), list) and all(isinstance(s, str) for s in stage["prerequisites"]) and len(set(stage["prerequisites"])) == len(stage["prerequisites"]), "invalid prerequisites")
        require(isinstance(stage.get("inputs"), list) and isinstance(stage.get("outputs"), list), "stages declare input and output slots")
        require(isinstance(stage.get("written_sections"), list) and stage["written_sections"] and all(isinstance(s, str) and s.strip() and "\n" not in s for s in stage["written_sections"]), "written deliverables need section labels")
        require(len(set(stage["written_sections"])) == len(stage["written_sections"]), "written section labels must be unique")
        declared = {s["id"]: s for s in challenge.get("constructor_tasks", {}).get("slots", [])}
        if challenge.get("constructor_tasks"):
            validate_tasks(challenge["constructor_tasks"])
        for collection in (stage["inputs"], stage["outputs"]):
            require(all(isinstance(s, dict) and isinstance(s.get("id"), str) and ID.fullmatch(s["id"]) and s.get("tool") in TOOLS for s in collection), "unsupported handoff slot")
            require(len({s["id"] for s in collection}) == len(collection), "handoff slots must be unique")
        for output in stage["outputs"]:
            tool = output["tool"]
            require(tool in ("dataset", "sql_execution") or (output["id"] in declared and declared[output["id"]]["tool"] == tool), "output does not match a Constructor slot")
            if tool == "dataset":
                require(any(s["tool"] == "mock" for s in declared.values()), "dataset output needs a recipe")
            if tool == "sql_execution":
                require(isinstance(challenge.get("dataset_sql"), dict), "SQL execution output needs dataset tasks")
        tasks = challenge.get("dataset_sql", {}).get("tasks")
        if tasks is not None:
            from src.sql_models import reserved_task_id
            require(challenge["dataset_sql"].get("version") == 1 and not any(challenge.get(k) for k in ("sql_playground", "python_playground", "data_quality_detective")), "dataset SQL is a separate execution contract")
            require(isinstance(tasks, list) and 1 <= len(tasks) <= 8 and all(isinstance(t, dict) and isinstance(t.get("id"), str) and ID.fullmatch(t["id"]) and isinstance(t.get("title"), str) and isinstance(t.get("description"), str) for t in tasks), "invalid dataset SQL tasks")
            require(len({t["id"] for t in tasks}) == len(tasks), "SQL task IDs must be unique")
            if not allow_legacy_task_ids:
                require(all(not reserved_task_id(t["id"]) for t in tasks), "scratch and notebook_N task IDs are reserved for editor tabs")
    by_stage = {s["id"]: s for s in stages}
    visiting, visited = set(), set()
    def visit(identity):
        require(identity in by_stage and identity not in visiting, "dependencies must form an acyclic graph")
        if identity in visited:
            return
        visiting.add(identity)
        for parent in by_stage[identity]["prerequisites"]:
            visit(parent)
        visiting.remove(identity)
        visited.add(identity)
    for stage in stages:
        visit(stage["id"])
        for handoff in stage["inputs"]:
            source = by_stage.get(handoff.get("source_stage"))
            require(source is not None and source["id"] in stage["prerequisites"], "handoff must come from a declared prerequisite")
            output = next((s for s in source["outputs"] if s["id"] == handoff.get("source_slot")), None)
            require(output is not None and output["tool"] == handoff["tool"], "handoff tools are incompatible")
            require(handoff.get("mode", "reference") in ("reference", "recipe", "dataset"), "unsupported handoff mode")
            if handoff.get("mode") == "recipe":
                source_slots = by_id[source["challenge_id"]].get("constructor_tasks", {}).get("slots", [])
                require(handoff["tool"] == "diagram" and any(s["id"] == output["id"] and s.get("kind") in ("logical_erd", "star_schema") for s in source_slots)
                    and any(s["tool"] == "mock" for s in by_id[stage["challenge_id"]].get("constructor_tasks", {}).get("slots", [])), "recipe handoff needs a field-bearing model and mock workspace")
            if handoff.get("mode") == "dataset":
                require(handoff["tool"] == "dataset" and by_id[stage["challenge_id"]].get("dataset_sql"), "dataset handoff needs SQL tasks")
    return value


def new_stage_workspace():
    return {"version": 1, "dataset_id": None, "executions": {}, "completed_fingerprint": None, "derived_from": None}


def validate_stage_workspace(value):
    value = json_copy(value, 384 * 1024)
    require(isinstance(value, dict) and type(value.get("version")) is int and value["version"] == 1, "invalid stage workspace")
    if value.get("dataset_id") is not None:
        uuid_value(value["dataset_id"])
    require(isinstance(value.get("executions", {}), dict) and len(value.get("executions", {})) <= 8, "invalid execution evidence")
    for task, evidence in value.get("executions", {}).items():
        require(isinstance(task, str) and ID.fullmatch(task) and isinstance(evidence, dict), "invalid task evidence")
        for field in ("query_hash", "dataset_hash"):
            require(isinstance(evidence.get(field), str) and HASH.fullmatch(evidence[field]), "execution fingerprints are required")
        for field in ("run_id", "dataset_id"):
            uuid_value(evidence.get(field))
        require(isinstance(evidence.get("stage_id"), str) and ID.fullmatch(evidence["stage_id"]) and evidence.get("task_id") == task, "execution owner mismatch")
        require(evidence.get("status") in ("success", "failed", "cancelled"), "invalid execution status")
        require(isinstance(evidence.get("columns"), list) and len(evidence["columns"]) <= 256 and all(isinstance(c, str) for c in evidence["columns"]), "invalid result columns")
        require(type(evidence.get("row_count")) is int and evidence["row_count"] >= 0 and type(evidence.get("truncated")) is bool, "invalid result counts")
        require(isinstance(evidence.get("sample"), list) and len(evidence["sample"]) <= 50 and all(isinstance(row, list) and len(row) == len(evidence["columns"]) for row in evidence["sample"]), "invalid output sample")
        require(len(json.dumps(evidence, ensure_ascii=False).encode()) <= 48 * 1024, "result evidence exceeds 48 KiB")
    for field in ("completed_fingerprint", "derived_from"):
        require(value.get(field) is None or (isinstance(value[field], str) and HASH.fullmatch(value[field])), "invalid stage fingerprint")
    return value


def written_values(answer, sections):
    values = {label: "" for label in sections}
    current = None
    for line in (answer or "").splitlines():
        if line.startswith("## ") and line[3:].strip() in values:
            current = line[3:].strip()
        elif current in values:
            values[current] += line + "\n"
    return {label: text.strip() for label, text in values.items()}


def validate_run(run):
    run = json_copy(run)
    require(isinstance(run, dict) and run.get("version") == 1, "unsupported run version")
    uuid_value(run.get("run_id"))
    require(type(run.get("revision")) is int and run["revision"] >= 1, "invalid run revision")
    require(isinstance(run.get("challenges"), dict) and isinstance(run.get("rubric"), dict)
        and all(isinstance(k, str) and type(v) in (int, float) and math.isfinite(v) and 0 <= v <= 100 for k, v in run["rubric"].items())
        and sum(run["rubric"].values()) == 100, "run snapshots its briefs and rubric")
    definition = validate_definition(run.get("definition"), list(run["challenges"].values()), allow_legacy_task_ids=True)
    stage_ids = {s["id"] for s in definition["stages"]}
    require(set(run["challenges"]) == stage_ids, "run stage briefs do not match definition")
    if "stage_rubrics" in run:
        rubrics = run["stage_rubrics"]
        require(isinstance(rubrics, dict) and set(rubrics) == stage_ids, "stage rubric snapshots must match the project stages")
        for rubric in rubrics.values():
            require(isinstance(rubric, dict) and rubric and all(isinstance(k, str) and type(v) in (int, float)
                and math.isfinite(v) and 0 <= v <= 100 for k, v in rubric.items()) and sum(rubric.values()) == 100,
                "stage rubrics must contain finite category scores totaling 100")
    for stage in definition["stages"]:
        require(run["challenges"][stage["id"]]["id"] == stage["challenge_id"], "stage brief identity mismatch")
    mappings = run.get("stage_attempts")
    require(isinstance(mappings, dict) and not set(mappings) - stage_ids and all(type(v) is int and v > 0 for v in mappings.values()) and len(set(mappings.values())) == len(mappings), "invalid stage attempt mappings")
    require(isinstance(run.get("inputs"), dict) and not set(run["inputs"]) - stage_ids, "invalid run references")
    for stage in definition["stages"]:
        slots = {s["id"]: s for s in stage["inputs"]}
        records = run["inputs"].get(stage["id"], {})
        require(isinstance(records, dict) and not set(records) - set(slots), "unknown input reference")
        require((stage["id"] in mappings and set(records) == set(slots)) or (stage["id"] not in mappings and not records), "started stages require their complete copied inputs")
        for identity, record in records.items():
            require(isinstance(record, dict) and isinstance(record.get("history", []), list), "invalid reference history")
            for snapshot in [record, *record.get("history", [])]:
                require(isinstance(snapshot, dict), "invalid reference snapshot")
                source = snapshot.get("source", {})
                require(source == {"run_id": run["run_id"], "stage_id": slots[identity]["source_stage"], "slot_id": slots[identity]["source_slot"]}, "reference source identity mismatch")
                require(isinstance(snapshot.get("fingerprint"), str) and HASH.fullmatch(snapshot["fingerprint"]) and type(snapshot.get("revision")) is int and snapshot["revision"] >= 0, "invalid reference revision/fingerprint")
                tool = slots[identity]["tool"]
                require(snapshot.get("tool") == tool and isinstance(snapshot.get("reasoning", ""), str), "invalid reference content")
                if tool in ("diagram", "pipeline", "mock"):
                    validate_payload(tool, snapshot.get("payload"))
                elif tool == "dataset":
                    uuid_value(snapshot.get("payload", {}).get("dataset_id"))
                else:
                    require(isinstance(snapshot.get("payload"), dict), "execution reference must be structured")
                require(isinstance(snapshot.get("acknowledgment_history", []), list), "invalid acknowledgment history")
                for ack in [snapshot.get("acknowledgment"), *snapshot.get("acknowledgment_history", [])]:
                    if ack is not None:
                        require(isinstance(ack, dict) and isinstance(ack.get("fingerprint"), str) and HASH.fullmatch(ack["fingerprint"]) and isinstance(ack.get("explanation"), str) and ack["explanation"].strip(), "acknowledgment needs a source fingerprint and explanation")
    require(isinstance(run.get("stage_datasets"), dict) and not set(run["stage_datasets"]) - stage_ids, "invalid stage datasets")
    for identity in run["stage_datasets"].values():
        uuid_value(identity)
    require(isinstance(run.get("replaced_recipes", []), list), "invalid retained recipe history")
    for retained in run.get("replaced_recipes", []):
        require(isinstance(retained, dict) and retained.get("stage_id") in stage_ids and isinstance(retained.get("artifact"), dict), "invalid retained recipe")
        require(retained["artifact"].get("tool") == "mock", "retained recipe must use the mock tool")
        validate_payload("mock", retained["artifact"].get("payload"))
    for field in ("completion", "evaluation"):
        require(isinstance(run.get(field + "_history"), list), "final submission history is required")
        for record in [run.get(field), *run[field + "_history"]]:
            if record is None:
                continue
            require(isinstance(record, dict) and isinstance(record.get("fingerprint"), str) and HASH.fullmatch(record["fingerprint"]), "invalid final submission binding")
            if field == "completion":
                require(isinstance(record.get("defense"), str), "completion needs a written defense")
            else:
                scores = record.get("rubric_scores")
                require(isinstance(scores, dict) and set(scores) == set(run["rubric"]) and all(type(v) in (int, float) and math.isfinite(v) and 0 <= v <= run["rubric"][k] for k, v in scores.items())
                    and record.get("score") == sum(scores.values()) and isinstance(record.get("feedback"), str), "invalid final evaluation")
    return run
