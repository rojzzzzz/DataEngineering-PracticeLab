"""Version-3 project backup validation and atomic, conflict-preserving restoration."""
from copy import deepcopy
import json
from uuid import uuid4

from src.capstone_models import fingerprint, require, validate_run
from src.capstone_datasets import validate_record


def export_tables(con):
    return {"capstone_runs": [json.loads(row[0]) for row in con.execute("SELECT payload FROM capstone_runs ORDER BY run_id")],
            "capstone_datasets": [json.loads(row[0]) for row in con.execute("SELECT payload FROM capstone_datasets ORDER BY dataset_id")]}


def validate_bundle(backup, attempts):
    runs, datasets = backup.get("capstone_runs", []), backup.get("capstone_datasets", [])
    require(isinstance(runs, list) and isinstance(datasets, list), "backup projects/datasets must be lists")
    runs = [validate_run(r) for r in runs]
    datasets = [validate_record(d) for d in datasets]
    by_run = {r["run_id"]: r for r in runs}
    by_data = {d["dataset_id"]: d for d in datasets}
    require(len(by_run) == len(runs) and len(by_data) == len(datasets), "duplicate project or dataset identities")
    owned = [a for a in attempts if a.get("project_run_id")]
    by_attempt = {a.get("attempt_id"): a for a in owned}
    require(len(by_attempt) == len(owned) and all(type(i) is int and i > 0 for i in by_attempt), "project attempts need unique backup-local IDs")
    mapped = set()
    for run in runs:
        stages = {s["id"]: s for s in run["definition"]["stages"]}
        for sid, aid in run["stage_attempts"].items():
            a = by_attempt.get(aid)
            require(a and a.get("project_run_id") == run["run_id"] and a.get("project_stage_id") == sid and a.get("challenge_id") == stages[sid]["challenge_id"], "stage attempt mapping is inconsistent")
            require(aid not in mapped, "one attempt cannot belong to multiple stages")
            mapped.add(aid)
            require(a.get("capstone_workspace") is not None, "project attempt workspace is missing")
            expected_tasks = run["challenges"][sid].get("constructor_tasks")
            actual_workspace = a.get("constructor_workspace")
            require((actual_workspace or {}).get("tasks") == expected_tasks, "stage deliverable requirements differ from its snapshotted brief")
            sql_tasks = {t["id"] for t in run["challenges"][sid].get("dataset_sql", {}).get("tasks", [])}
            require(not set(a["capstone_workspace"].get("executions", {})) - sql_tasks, "execution evidence has no declared stage task")
            require(a.get("sql_workspace") is None or bool(sql_tasks) and a["sql_workspace"].get("assessment") is None
                and not set(a["sql_workspace"]["drafts"]) - (sql_tasks | {"scratch"}), "invalid project SQL workspace")
            selected = a["capstone_workspace"].get("dataset_id")
            require(selected is None or sql_tasks, "only SQL stages select datasets")
            require(selected is None or selected in by_data and by_data[selected]["run_id"] == run["run_id"], "selected SQL dataset is missing or belongs to another run")
            for result in a["capstone_workspace"].get("executions", {}).values():
                require(result["run_id"] == run["run_id"] and result["stage_id"] == sid
                    and result["dataset_id"] in by_data and by_data[result["dataset_id"]]["run_id"] == run["run_id"]
                    and result["dataset_hash"] == by_data[result["dataset_id"]]["data"]["content_hash"], "execution evidence points to a different run/dataset")
        for sid, identity in run["stage_datasets"].items():
            require(identity in by_data and by_data[identity]["run_id"] == run["run_id"] and by_data[identity]["stage_id"] == sid, "stage output dataset is missing or mismatched")
        for records in run["inputs"].values():
            for record in records.values():
                for snapshot in [record, *record.get("history", [])]:
                    if snapshot["tool"] == "dataset":
                        p = snapshot["payload"]
                        require(p["dataset_id"] in by_data and by_data[p["dataset_id"]]["run_id"] == run["run_id"]
                            and p.get("content_hash") == by_data[p["dataset_id"]]["data"]["content_hash"], "copied dataset reference is unavailable or corrupted")
    require(mapped == set(by_attempt), "backup contains an orphan project stage attempt")
    for dataset in datasets:
        require(dataset["run_id"] in by_run and dataset["stage_id"] in by_run[dataset["run_id"]]["challenges"], "dataset has no owning run/stage")
        challenge = by_run[dataset["run_id"]]["challenges"][dataset["stage_id"]]
        require(any(s["id"] == dataset.get("slot_id") and s["tool"] == "mock" for s in challenge.get("constructor_tasks", {}).get("slots", [])), "dataset has no source recipe slot")
    return runs, datasets, by_attempt


def portable_fingerprint(run, attempts, datasets):
    from src.database import ATTEMPT_FIELDS, JSON_DEFAULTS
    clean_run = {k: v for k, v in run.items() if k not in ("stage_attempts", "imported_from", "import_source_fingerprint", "import_content_fingerprint")}
    stage_records = {}
    for sid, aid in run["stage_attempts"].items():
        a = attempts.get(aid)
        stage_records[sid] = {k: a.get(k, deepcopy(JSON_DEFAULTS.get(k))) for k in ATTEMPT_FIELDS} if a else None
    return fingerprint({"run": clean_run, "attempts": stage_records,
                        "datasets": sorted([d for d in datasets if d["run_id"] == run["run_id"]], key=lambda d: d["dataset_id"])})


def remap(value, run_ids, dataset_ids):
    if isinstance(value, list):
        return [remap(v, run_ids, dataset_ids) for v in value]
    if not isinstance(value, dict):
        return value
    result = {}
    for key, item in value.items():
        if key in ("run_id", "project_run_id"):
            result[key] = run_ids.get(item, item)
        elif key == "dataset_id":
            result[key] = dataset_ids.get(item, item)
        elif key == "stage_datasets":
            result[key] = {s: dataset_ids.get(d, d) for s, d in item.items()}
        else:
            result[key] = remap(item, run_ids, dataset_ids)
    return result


def restore(con, bundle, result):
    from src.database import _decode_attempt, _save_attempt
    from src.submission import submission_revision
    runs, datasets, incoming_attempts = bundle
    if not runs:
        return
    result.update(runs_added=0, runs_unchanged=0, runs_conflicted=0)
    existing = export_tables(con)
    existing_runs = {r["run_id"]: r for r in existing["capstone_runs"]}
    existing_data = existing["capstone_datasets"]
    existing_attempts = {r["attempt_id"]: r for r in (_decode_attempt(row) for row in con.execute("SELECT * FROM attempts"))}
    for original in runs:
        source_hash = portable_fingerprint(original, incoming_attempts, datasets)
        current = existing_runs.get(original["run_id"])
        identical = current and portable_fingerprint(current, existing_attempts, existing_data) == source_hash
        recovered = next((r for r in existing_runs.values() if r.get("imported_from") == original["run_id"]
            and r.get("import_source_fingerprint") == source_hash
            and r.get("import_content_fingerprint") == portable_fingerprint(r, existing_attempts, existing_data)), None)
        if identical or recovered:
            result["runs_unchanged"] += 1
            result["unchanged"] += len(original["stage_attempts"])
            continue
        new_id = str(uuid4()) if current else original["run_id"]
        run_ids = {original["run_id"]: new_id}
        copied_data = [d for d in datasets if d["run_id"] == original["run_id"]]
        used_ids = {d["dataset_id"] for d in existing_data}
        dataset_ids = {d["dataset_id"]: str(uuid4()) if current or d["dataset_id"] in used_ids else d["dataset_id"] for d in copied_data}
        run = remap(deepcopy(original), run_ids, dataset_ids)
        imported_data = []
        for dataset in copied_data:
            saved = remap(dataset, run_ids, dataset_ids)
            if saved["dataset_id"] != dataset["dataset_id"]:
                saved["origin_dataset_id"] = dataset.get("origin_dataset_id", dataset["dataset_id"])
            con.execute("INSERT INTO capstone_datasets VALUES(?,?,?)", (saved["dataset_id"], new_id, json.dumps(saved, ensure_ascii=False)))
            imported_data.append(saved)
        imported_attempts = {}
        for sid, old_aid in original["stage_attempts"].items():
            source_attempt = incoming_attempts[old_aid]
            a = remap(deepcopy(source_attempt), run_ids, dataset_ids)
            # Restoring identities is not an edit or a new evaluation. Rebind
            # current reviews only; previously outdated reviews remain so.
            if source_attempt.get("evaluation_submission") == submission_revision(source_attempt):
                a["evaluation_submission"] = submission_revision(a)
            a.pop("attempt_id", None)
            aid = _save_attempt(con, a, track_activity=False)
            run["stage_attempts"][sid] = aid
            a["attempt_id"] = aid
            imported_attempts[aid] = a
            result["added"] += 1
        if current:
            run["imported_from"] = original["run_id"]
            run["import_source_fingerprint"] = source_hash
            run["import_content_fingerprint"] = portable_fingerprint(run, imported_attempts, imported_data)
            result["runs_conflicted"] += 1
        validate_run(run)
        con.execute("INSERT INTO capstone_runs VALUES(?,?)", (new_id, json.dumps(run, ensure_ascii=False)))
        existing_runs[new_id] = run
        existing_attempts.update(imported_attempts)
        existing_data.extend(imported_data)
        result["runs_added"] += 1
