"""Immutable bounded typed datasets transferred from private generation staging."""
from copy import deepcopy
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
import json
import re
from uuid import uuid4

from src.capstone_models import HASH, require, uuid_value, json_copy
from src.constructor_models import fingerprint, stamp
from src.sql_models import IDENTIFIER

MAX_BYTES = 2 * 1024**2
MAX_ROWS = 10_000
DECIMAL_TYPE = re.compile(r"DECIMAL\(([1-9]|[12][0-9]|3[0-8]),([0-9]|[12][0-9]|3[0-8])\)\Z")
TYPES = {"BIGINT", "BOOLEAN", "VARCHAR", "DATE", "TIMESTAMPTZ"}


def sql_type(field):
    kind = field["type"]
    require(kind in ("integer", "decimal", "boolean", "string", "date", "timestamp", "uuid"), "unsupported generated type")
    return {"integer": "BIGINT", "decimal": f"DECIMAL({field['precision']},{field['scale']})", "boolean": "BOOLEAN",
            "string": "VARCHAR", "date": "DATE", "timestamp": "TIMESTAMPTZ", "uuid": "VARCHAR"}[kind]


def encode_cell(value):
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    if isinstance(value, date):
        return value.isoformat()
    if value is None or type(value) in (int, bool, str):
        return value
    # DuckDB returns native UUID values; schema maps them explicitly to VARCHAR.
    from uuid import UUID
    if isinstance(value, UUID):
        return str(value)
    raise ValueError("Connected capstone: unsupported typed cell; regenerate using supported fields")


def validate_cell(value, column):
    if value is None:
        require(column["nullable"], "null in a required dataset column")
        return
    kind = column["type"]
    match = DECIMAL_TYPE.fullmatch(kind)
    if kind == "BIGINT":
        require(type(value) is int and -(2**63) <= value < 2**63, "dataset integer is outside signed 64-bit range")
    elif kind == "BOOLEAN":
        require(type(value) is bool, "dataset boolean must be a boolean")
    elif kind == "VARCHAR":
        require(isinstance(value, str), "dataset text/UUID must remain text")
    elif match:
        require(isinstance(value, str), "dataset decimals must be decimal strings, not floats")
        precision, scale = map(int, match.groups())
        require(scale <= precision, "decimal scale exceeds precision")
        try:
            number = Decimal(value)
            require(number.is_finite() and number.copy_abs() < Decimal(10) ** (precision-scale), "decimal exceeds precision")
            require(format(number, f".{scale}f") == value, "decimal strings must retain exact declared scale")
        except InvalidOperation as exc:
            raise ValueError("Connected capstone: invalid decimal") from exc
    elif kind == "DATE":
        require(isinstance(value, str), "dataset dates must be ISO strings")
        try:
            require(date.fromisoformat(value).isoformat() == value, "date must use canonical ISO form")
        except ValueError as exc:
            raise ValueError("Connected capstone: invalid ISO date") from exc
    else:
        require(isinstance(value, str) and value.endswith("Z"), "timestamps must be canonical UTC ISO strings")
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            require(parsed.astimezone(timezone.utc).isoformat().replace("+00:00", "Z") == value, "timestamp is not canonical UTC")
        except ValueError as exc:
            raise ValueError("Connected capstone: invalid timestamp") from exc


def validate_dataset(value):
    value = json_copy(value, 6 * 1024**2)
    require(isinstance(value, dict) and value.get("format") == "capstone-dataset" and type(value.get("version")) is int and value["version"] == 1, "unsupported dataset contract")
    tables = value.get("tables")
    require(isinstance(tables, list) and 1 <= len(tables) <= 10, "dataset limit is 10 tables; reduce generation size")
    require(len(json.dumps(tables, ensure_ascii=False, allow_nan=False).encode()) <= MAX_BYTES, "dataset schema/rows exceed 2 MiB; reduce rows or field lengths and regenerate")
    names, total = set(), 0
    for table in tables:
        require(isinstance(table, dict) and isinstance(table.get("name"), str) and IDENTIFIER.fullmatch(table["name"]), "table names must be SQL identifiers (letters/digits/underscore, at most 63 characters); no names are renamed")
        require(table["name"].casefold() not in names, "duplicate dataset table name")
        names.add(table["name"].casefold())
        columns, rows = table.get("columns"), table.get("rows")
        require(isinstance(columns, list) and 1 <= len(columns) <= 40, "dataset limit is 40 columns per table; reduce the recipe")
        require(isinstance(rows, list), "dataset rows must be complete typed arrays")
        total += len(rows)
        require(total <= MAX_ROWS, "dataset limit is 10,000 total rows; reduce generation size")
        fields = set()
        for column in columns:
            require(isinstance(column, dict) and isinstance(column.get("name"), str) and IDENTIFIER.fullmatch(column["name"]), "column names must be supported SQL identifiers; no silent renaming")
            require(column["name"].casefold() not in fields, "duplicate dataset column name")
            fields.add(column["name"].casefold())
            kind = column.get("type")
            require(isinstance(kind, str) and (kind in TYPES or DECIMAL_TYPE.fullmatch(kind)), "unsupported dataset SQL type")
            require(type(column.get("nullable")) is bool and type(column.get("primary_key")) is bool, "dataset column needs null/key metadata")
            if DECIMAL_TYPE.fullmatch(kind):
                p, s = map(int, DECIMAL_TYPE.fullmatch(kind).groups())
                require(s <= p, "decimal scale exceeds precision")
        for row in rows:
            require(isinstance(row, list) and len(row) == len(columns), "dataset row width does not match schema")
            for cell, column in zip(row, columns):
                validate_cell(cell, column)
        keys = [i for i, c in enumerate(columns) if c["primary_key"]]
        require(len(keys) == 1, "generated capstone tables require a single-column primary key")
        values = [r[keys[0]] for r in rows]
        require(None not in values and len(set(values)) == len(values), "dataset primary key is null or duplicated")
    by_name = {t["name"]: t for t in tables}
    edges = {name: set() for name in by_name}
    for table in tables:
        for index, column in enumerate(table["columns"]):
            ref = column.get("reference")
            if ref is not None:
                require(isinstance(ref, dict) and ref.get("table") in by_name and ref.get("relation") in ("many-to-one", "one-to-one"), "invalid dataset relationship")
                parent = by_name[ref["table"]]
                targets = [(i, c) for i, c in enumerate(parent["columns"]) if c["name"] == ref.get("column") and c["primary_key"]]
                require(len(targets) == 1 and targets[0][1]["type"] == column["type"], "foreign-key target/type mismatch")
                domain = {r[targets[0][0]] for r in parent["rows"]}
                observed = [r[index] for r in table["rows"] if r[index] is not None]
                require(all(v in domain for v in observed), "dataset contains a missing parent relationship")
                require(ref["relation"] != "one-to-one" or len(set(observed)) == len(observed), "one-to-one relationship contains repeated parents")
                edges[table["name"]].add(parent["name"])
    visiting, visited = set(), set()
    def visit(name):
        require(name not in visiting, "dataset foreign-key graph must be acyclic")
        if name in visited:
            return
        visiting.add(name)
        for parent in edges[name]:
            visit(parent)
        visiting.remove(name)
        visited.add(name)
    for name in edges:
        visit(name)
    require(type(value.get("seed")) is int and 0 <= value["seed"] < 2**63, "invalid dataset seed")
    require(isinstance(value.get("recipe_hash"), str) and HASH.fullmatch(value["recipe_hash"]), "dataset needs recipe hash")
    require(isinstance(value.get("generator"), dict) and all(isinstance(value["generator"].get(k), str) for k in ("engine_version", "faker_version", "duckdb_version", "python_version")), "generator versions must be recorded")
    manifest = value.get("manifest")
    require(isinstance(manifest, dict) and manifest.get("format") == "constructor-mock-manifest" and manifest.get("seed") == value["seed"], "dataset generation manifest is required")
    require(isinstance(manifest.get("tables"), list) and len(manifest["tables"]) == len(tables), "manifest table counts do not match")
    counts = {t.get("name"): t.get("rows") for t in manifest["tables"]}
    require(counts == {t["name"]: len(t["rows"]) for t in tables}, "manifest row counts do not match complete saved data")
    require(value.get("content_hash") == fingerprint(tables), "dataset content hash mismatch")
    return value


def from_staging(connection, recipe, staged, manifest):
    require(len(recipe["tables"]) <= 10 and all(len(t["fields"]) <= 40 for t in recipe["tables"]), "Capstone transfer supports 10 tables and 40 columns/table. Reduce the recipe and regenerate.")
    require(sum(t["rows"] for t in recipe["tables"]) <= MAX_ROWS, "Capstone transfer supports 10,000 total rows. Reduce row counts and regenerate.")
    by_id = {t["id"]: t for t in recipe["tables"]}
    tables, size = [], 0
    for table in recipe["tables"]:
        columns = []
        for field in table["fields"]:
            ref = field.get("reference")
            reference = None
            if ref:
                parent = by_id[ref["table_id"]]
                target = next(f for f in parent["fields"] if f["id"] == ref["field_id"])
                reference = {"table": parent["name"], "column": target["name"], "relation": ref["relation"]}
            columns.append({"name": field["name"], "type": sql_type(field), "nullable": not field["primary_key"] and field["null_pct"] > 0,
                            "primary_key": field["primary_key"], "reference": reference})
        saved = {"name": table["name"], "columns": columns, "rows": []}
        size += len(json.dumps(saved, ensure_ascii=False).encode())
        # staged names are internal t0/t1, never user-supplied identifiers.
        internal = staged[table["id"]]
        require(re.fullmatch(r"t[0-9]+", internal), "invalid private staging identity")
        cursor = connection.execute(f"SELECT * FROM {internal} ORDER BY rowid")
        while batch := cursor.fetchmany(100):
            for row in batch:
                encoded = [encode_cell(v) for v in row]
                size += len(json.dumps(encoded, ensure_ascii=False).encode()) + 2
                require(size <= MAX_BYTES, "Capstone schema/rows exceed 2 MiB. Reduce rows or field lengths and regenerate; no rows were truncated.")
                saved["rows"].append(encoded)
        tables.append(saved)
    result = {"format": "capstone-dataset", "version": 1, "tables": tables, "content_hash": fingerprint(tables),
        "recipe_hash": fingerprint(recipe), "seed": recipe["seed"], "manifest": deepcopy(manifest),
        "generator": {k: manifest[k] for k in ("engine_version", "faker_version", "duckdb_version", "python_version")}}
    return validate_dataset(result)


def validate_record(record):
    record = json_copy(record, 7 * 1024**2)
    require(isinstance(record, dict) and type(record.get("version")) is int and record["version"] == 1, "invalid dataset snapshot")
    uuid_value(record.get("dataset_id"))
    uuid_value(record.get("run_id"))
    if record.get("origin_dataset_id") is not None:
        uuid_value(record["origin_dataset_id"])
    require(isinstance(record.get("stage_id"), str), "dataset snapshot needs source stage")
    require(isinstance(record.get("slot_id"), str) and type(record.get("artifact_revision")) is int and record["artifact_revision"] >= 1, "dataset needs its saved source recipe revision")
    record["data"] = validate_dataset(record.get("data"))
    return record


def save_from_job(path, attempt_id, slot_id, job, *, confirm_replace=False):
    """Read the private typed transfer file under the job lock, then commit once."""
    from src.database import connect, _decode_attempt
    from src.capstone_store import load_run, save_run
    with job.lock:
        require(not job.closed and job.request.get("mode") == "generate", "generation output expired; regenerate before saving a dataset")
        status = job.status()
        require(status.get("status") == "complete", "successful current generation is required")
        require(status.get("dataset"), status.get("capstone_transfer_error", "Typed generation output is unavailable. Regenerate before saving a dataset."))
        data = validate_dataset(json.loads(job.artifact(status["dataset"], job.workspace_id, job.revision).read_text(encoding="utf-8")))
        with connect(path) as con:
            con.execute("BEGIN IMMEDIATE")
            row = con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
            require(row is not None, "attempt no longer exists")
            attempt = _decode_attempt(row)
            run = load_run(con, attempt["project_run_id"])
            stage_id = attempt["project_stage_id"]
            require(run["stage_attempts"].get(stage_id) == attempt_id and job.workspace_id == f"attempt:{attempt_id}:artifact:{slot_id}", "generation belongs to another stage or run")
            artifact = attempt["constructor_workspace"]["artifacts"].get(slot_id)
            require(artifact and artifact["tool"] == "mock", "save the current recipe before transferring")
            p = artifact["payload"]
            evidence = p.get("generation") or {}
            require(not p.get("pending_rules") and job.matches(job.workspace_id, p.get("recipe_revision", 0))
                and fingerprint(p["recipe"]) == data["recipe_hash"] == fingerprint(job.request["recipe"])
                and evidence.get("recipe_hash") == data["recipe_hash"] and evidence.get("job_id") == job.id,
                "generation is outdated; generate the current saved recipe again")
            old = run["stage_datasets"].get(stage_id)
            require(not old or confirm_replace, "confirm replacing the selected dataset; the previous snapshot is retained")
            snapshot = {"version": 1, "dataset_id": str(uuid4()), "run_id": run["run_id"], "stage_id": stage_id,
                        "slot_id": slot_id, "artifact_revision": artifact["revision"], "created_at": stamp(), "data": data}
            validate_record(snapshot)
            con.execute("INSERT INTO capstone_datasets VALUES(?,?,?)", (snapshot["dataset_id"], run["run_id"], json.dumps(snapshot, ensure_ascii=False)))
            run["stage_datasets"][stage_id] = snapshot["dataset_id"]
            save_run(con, run, run["revision"])
            return snapshot
