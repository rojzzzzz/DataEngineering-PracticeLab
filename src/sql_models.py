"""Versioned SQL exercises. This module never executes uploaded SQL."""
from __future__ import annotations

from copy import deepcopy
from functools import lru_cache
import hashlib
import json
import math
import re

IDENTIFIER = re.compile(r"[A-Za-z_][A-Za-z0-9_]{0,62}\Z")
TYPE = re.compile(r"(?:INTEGER|BIGINT|DOUBLE|BOOLEAN|VARCHAR|DATE|TIMESTAMP|DECIMAL\((?:[1-9]|[12][0-9]|3[0-8]),(?:[0-9]|[12][0-9]|3[0-8])\))\Z")
CATEGORIES = {"passed", "output shape", "incorrect rows", "ordering", "reconciliation", "execution failure", "resource limit"}


def fingerprint(value: object) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError("SQL playground: " + message)


def reserved_task_id(identity):
    return bool(re.fullmatch(r"scratch|notebook_[0-9]+", identity, flags=re.IGNORECASE))


def _names(items: list, field: str = "name") -> None:
    seen = set()
    for item in items:
        name = item.get(field) if isinstance(item, dict) else None
        _require(isinstance(name, str) and bool(IDENTIFIER.fullmatch(name)), f"invalid {field}")
        _require(name.lower() not in seen, f"duplicate {field}: {name}")
        seen.add(name.lower())


def validate_exercise(value: object) -> dict:
    """Validate and return independently mutable exercise data."""
    check_exercise(value)
    return deepcopy(value)


def check_exercise(value: object) -> None:
    """Run the same validation when the caller needs no defensive result copy."""
    _require(isinstance(value, dict), "metadata must be an object")
    # Cache only bounded JSON content; no live connections or mutable caller objects.
    serialized = json.dumps(value, allow_nan=False, sort_keys=True)
    _require(len(serialized.encode()) <= 4_000_000, "exercise exceeds 4 MB")
    _validate_serialized(serialized)


@lru_cache(maxsize=64)
def _validate_serialized(serialized: str) -> None:
    value = json.loads(serialized)
    _require(type(value.get("version")) is int and value["version"] == 1, "unsupported version")
    _require(value.get("dialect") == "duckdb", "dialect must be duckdb")
    tables, tasks = value.get("tables"), value.get("tasks")
    _require(isinstance(tables, list) and 1 <= len(tables) <= 20, "need 1–20 tables")
    _require(isinstance(tasks, list) and 1 <= len(tasks) <= 8, "need 1–8 answer tasks")
    _names(tables)
    _names(tasks, "id")
    _require(all(not reserved_task_id(task["id"]) for task in tasks), "scratch and notebook_N task IDs are reserved for editor tabs")
    for table in tables:
        _require(isinstance(table.get("description"), str), "table description is required")
        columns = table.get("columns")
        _require(isinstance(columns, list) and 1 <= len(columns) <= 40, "need 1–40 columns")
        _names(columns)
        for column in columns:
            _require(isinstance(column.get("type"), str) and bool(TYPE.fullmatch(column["type"])), "unsupported column type")
            if column["type"].startswith("DECIMAL"):
                precision, scale = map(int, re.findall(r"\d+", column["type"]))
                _require(scale <= precision, "decimal scale exceeds precision")
            _require(type(column.get("nullable")) is bool, "nullable must be boolean")
            _require(isinstance(column.get("key", ""), str), "key description must be text")
    for task in tasks:
        _require(isinstance(task.get("title"), str) and bool(task["title"].strip()), "task title required")
        _require(isinstance(task.get("description"), str), "task description required")
        _require(type(task.get("ordered")) is bool, "ordered must be boolean")
        columns = task.get("columns")
        _require(isinstance(columns, list) and 1 <= len(columns) <= 40, "task columns required")
        _names(columns)
        for column in columns:
            _require(column.get("type") in ("integer", "decimal", "number", "string", "date", "timestamp", "boolean"), "invalid result type")
            if column["type"] in ("decimal", "number"):
                _require(type(column.get("scale")) is int and 0 <= column["scale"] <= 8, "numeric output needs scale 0–8")
    assessment = value.get("assessment")
    _require(isinstance(assessment, dict), "assessment required")
    refs, fixtures = assessment.get("reference_queries"), assessment.get("fixtures")
    _require(isinstance(refs, dict) and set(refs) == {task["id"] for task in tasks}, "one reference query per task required")
    _require(all(isinstance(sql, str) and 0 < len(sql) <= 50_000 for sql in refs.values()), "invalid reference query")
    _require(isinstance(fixtures, list) and 2 <= len(fixtures) <= 5, "need 2–5 private fixtures")
    task_columns = {task["id"]: {column["name"] for column in task["columns"]} for task in tasks}
    table_columns = {table["name"]: {column["name"] for column in table["columns"]} for table in tables}
    invariants = assessment.get("invariants", [])
    _require(isinstance(invariants, list) and len(invariants) <= 12, "invalid reconciliation invariants")
    for invariant in invariants:
        _require(isinstance(invariant, dict) and invariant.get("type") in ("partition", "coverage", "sum_match"), "invalid reconciliation invariant")
        if invariant["type"] in ("partition", "coverage"):
            source, key, outputs, output_key = (invariant.get(k) for k in ("source", "source_key", "outputs", "output_key"))
            _require(source in table_columns and key in table_columns[source] and isinstance(outputs, list) and len(outputs) >= 1 and all(output in task_columns and output_key in task_columns[output] for output in outputs), "invalid coverage invariant")
        else:
            left, right = invariant.get("left"), invariant.get("right")
            _require(left in task_columns and right in task_columns and all(invariant.get(k) in task_columns[t] for k, t in (("group_left", left), ("group_right", right), ("value_left", left), ("value_right", right))), "invalid sum invariant")
    for fixture in [value.get("visible_fixture"), *fixtures]:
        _require(isinstance(fixture, dict) and set(fixture) == {t["name"] for t in tables}, "fixture tables must match schema")
        for table in tables:
            rows = fixture[table["name"]]
            _require(isinstance(rows, list) and len(rows) <= 10_000, "fixture row limit is 10000 per table")
            for row in rows:
                _require(isinstance(row, list) and len(row) == len(table["columns"]), "fixture row width mismatch")
                for cell, column in zip(row, table["columns"]):
                    _require(cell is None or type(cell) in (str, int, float, bool), "fixture cells must be scalar")
                    _require(cell is not None or column["nullable"], "null in required column")
                    _require(not isinstance(cell, str) or len(cell) <= 10_000, "fixture cell too large")
                    _require(not isinstance(cell, float) or math.isfinite(cell), "non-finite fixture value")


def public_exercise(exercise: dict) -> dict:
    return {key: deepcopy(exercise[key]) for key in ("version", "dialect", "tables", "visible_fixture", "tasks")}


def ddl(exercise: dict) -> str:
    return "\n\n".join(
        f'CREATE TABLE "{table["name"]}" (\n' + ",\n".join(
            f'  "{c["name"]}" {c["type"]}' + ("" if c["nullable"] else " NOT NULL")
            for c in table["columns"]
        ) + "\n);" for table in exercise["tables"]
    )


def new_workspace(exercise: dict) -> dict:
    return {"version": 1, "drafts": {**{task["id"]: "" for task in exercise["tasks"]}, "scratch": ""}, "assessment": None}


def validate_workspace(value: object) -> dict:
    _require(isinstance(value, dict) and type(value.get("version")) is int and value["version"] == 1, "invalid workspace")
    drafts = value.get("drafts")
    _require(isinstance(drafts, dict) and len(drafts) <= 20, "invalid drafts")
    _require(all(isinstance(k, str) and bool(IDENTIFIER.fullmatch(k)) and isinstance(v, str) and len(v) <= 50_000 for k, v in drafts.items()), "invalid SQL draft")
    assessment = value.get("assessment")
    if assessment is not None:
        _require(isinstance(assessment, dict), "invalid assessment")
        for key in ("exercise_hash", "query_hash"):
            _require(isinstance(assessment.get(key), str) and bool(re.fullmatch(r"[0-9a-f]{64}", assessment[key])), "invalid assessment fingerprint")
        results = assessment.get("results")
        _require(isinstance(results, dict) and len(results) <= 8, "invalid assessment results")
        _require(all(k in drafts and isinstance(v, str) and v in CATEGORIES for k, v in results.items()), "invalid assessment category")
        assessment = {k: assessment[k] for k in ("exercise_hash", "query_hash", "results")}
    return {"version": 1, "drafts": dict(drafts), "assessment": assessment}


def answer_hash(exercise: dict, drafts: dict) -> str:
    return fingerprint({task["id"]: drafts.get(task["id"], "") for task in exercise["tasks"]})
