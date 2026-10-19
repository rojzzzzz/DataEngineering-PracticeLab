from __future__ import annotations
import json
import math
import sqlite3
from contextlib import contextmanager
from collections.abc import Iterator
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from src.diagrams import validate_diagram
from src.sql_models import validate_workspace
from src.detective_models import validate_detective_workspace
from src.python_models import validate_workspace as validate_python_workspace
from src.constructor_models import validate_workspace as validate_constructor_workspace
from src.capstone_models import validate_stage_workspace


@contextmanager
def connect(path: Path | str) -> Iterator[sqlite3.Connection]:
    """Commit or roll back the operation, and always release the connection."""
    database_path = Path(path)
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def init_db(path: Path | str) -> None:
    with connect(path) as con:
        con.executescript(
            """CREATE TABLE IF NOT EXISTS attempts (
            attempt_id INTEGER PRIMARY KEY AUTOINCREMENT, challenge_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Not started', started_at TEXT, updated_at TEXT NOT NULL, completed_at TEXT, evaluated_at TEXT, answer TEXT NOT NULL DEFAULT '', diagram TEXT, score REAL, confidence INTEGER, minutes_taken REAL, hints_used TEXT NOT NULL DEFAULT '[]', complications_used TEXT NOT NULL DEFAULT '[]', weak_topics TEXT NOT NULL DEFAULT '[]', mistake_categories TEXT NOT NULL DEFAULT '[]', rubric_scores TEXT NOT NULL DEFAULT '{}', evaluation_feedback TEXT NOT NULL DEFAULT '', personal_notes TEXT NOT NULL DEFAULT '');
            CREATE INDEX IF NOT EXISTS idx_attempts_challenge ON attempts(challenge_id);
            CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);"""
        )
        columns = {
            row["name"] for row in con.execute("PRAGMA table_info(attempts)").fetchall()
        }
        if "rubric_scores" not in columns:
            con.execute(
                "ALTER TABLE attempts ADD COLUMN rubric_scores TEXT NOT NULL DEFAULT '{}' "
            )
        if "diagram" not in columns:
            con.execute("ALTER TABLE attempts ADD COLUMN diagram TEXT")
        if "sql_workspace" not in columns:
            con.execute("ALTER TABLE attempts ADD COLUMN sql_workspace TEXT")
        if "python_workspace" not in columns:
            con.execute("ALTER TABLE attempts ADD COLUMN python_workspace TEXT")
        if "detective_workspace" not in columns:
            con.execute("ALTER TABLE attempts ADD COLUMN detective_workspace TEXT")
        if "constructor_workspace" not in columns:
            con.execute("ALTER TABLE attempts ADD COLUMN constructor_workspace TEXT")
        for field in ("project_run_id", "project_stage_id", "capstone_workspace"):
            if field not in columns:
                con.execute(f"ALTER TABLE attempts ADD COLUMN {field} TEXT")
        from src.capstone_store import init_schema
        init_schema(con)
        for field in ("resume_target", "activity_at", "evaluation_submission", "work_tracking_version", "evaluation_context"):
            if field not in columns:
                con.execute(f"ALTER TABLE attempts ADD COLUMN {field} {'INTEGER' if field == 'work_tracking_version' else 'TEXT'}")
        if "activity_at" not in columns:
            con.execute("UPDATE attempts SET activity_at=updated_at")
        from src.constructor_models import legacy_workspace
        for row in con.execute("SELECT attempt_id, diagram FROM attempts WHERE diagram IS NOT NULL AND constructor_workspace IS NULL").fetchall():
            try:
                workspace = legacy_workspace(validate_diagram(json.loads(row["diagram"])))
            except (ValueError, TypeError):
                continue  # Preserve unreadable historical data for manual recovery.
            con.execute("UPDATE attempts SET constructor_workspace=? WHERE attempt_id=?", (json.dumps(workspace), row["attempt_id"]))


# Independently saved editor state. Keep validation and field selection in sync.
WORKSPACE_VALIDATORS = {
    "diagram": validate_diagram,
    "sql_workspace": validate_workspace,
    "detective_workspace": validate_detective_workspace,
    "python_workspace": validate_python_workspace,
    "constructor_workspace": validate_constructor_workspace,
    "capstone_workspace": validate_stage_workspace,
}


ATTEMPT_FIELDS = (
    "challenge_id",
    "status",
    "started_at",
    "updated_at",
    "completed_at",
    "evaluated_at",
    "answer",
    "diagram",
    "sql_workspace",
    "detective_workspace",
    "python_workspace",
    "constructor_workspace",
    "score",
    "confidence",
    "minutes_taken",
    "hints_used",
    "complications_used",
    "weak_topics",
    "mistake_categories",
    "rubric_scores",
    "evaluation_feedback",
    "personal_notes",
    "resume_target",
    "activity_at",
    "evaluation_submission",
    "work_tracking_version",
    "evaluation_context",
    "project_run_id",
    "project_stage_id",
    "capstone_workspace",
)
JSON_DEFAULTS = {
    "hints_used": [],
    "complications_used": [],
    "weak_topics": [],
    "mistake_categories": [],
    "rubric_scores": {},
    "diagram": None,
    "sql_workspace": None,
    "detective_workspace": None,
    "python_workspace": None,
    "constructor_workspace": None,
    "capstone_workspace": None,
}
TEXT_DEFAULTS = {
    "status": "Not started",
    "updated_at": "",
    "answer": "",
    "evaluation_feedback": "",
    "personal_notes": "",
}


def _save_attempt(connection: sqlite3.Connection, data: dict[str, Any], *, track_activity=True) -> int:
    # False is reserved for already-validated backup restoration. Preserve its
    # historical lifecycle/bindings; importing is not a new completion or review.
    data = dict(data)
    from src.attempt_resume import validate_target
    validate_target(data.get("resume_target"))
    if not data.get("attempt_id") and track_activity:
        data.setdefault("work_tracking_version", 1)
    previous = None
    if data.get("attempt_id"):
        previous = connection.execute("SELECT answer, resume_target, activity_at, evaluation_submission, status, evaluated_at, completed_at, project_run_id FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone()
        if track_activity and previous and "answer" in data and data["answer"] != previous["answer"]:
            data.update(resume_target="answer", activity_at=datetime.now(timezone.utc).isoformat(timespec="microseconds"))
        if (track_activity and previous and previous["project_run_id"] and data.get("status") in ("Completed", "Evaluated")
                and (data.get("status") != previous["status"] or data.get("evaluated_at") != previous["evaluated_at"]
                     or "completed_at" in data and data["completed_at"] != previous["completed_at"])):
            from src.capstone_store import validate_completion
            saved = _decode_attempt(connection.execute("SELECT * FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone())
            validate_completion(connection, saved, data)
    elif track_activity and data.get("constructor_workspace") and data.get("status") in ("Completed", "Evaluated"):
        from src.constructor_models import evidence_errors
        workspace = data["constructor_workspace"]
        if isinstance(workspace, str):
            workspace = json.loads(workspace)
        if any(s.get("requires_changes") for s in workspace["tasks"]["slots"]):
            problems = evidence_errors(workspace, data.get("answer"))
            if problems:
                raise ValueError("Required deliverables are incomplete: " + "; ".join(problems))
    if track_activity and data.get("attempt_id") and data.get("status") in ("Completed", "Evaluated"):
        current = connection.execute("SELECT status, evaluated_at, constructor_workspace IS NOT NULL AS linked FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone()
        if current and current["linked"]:
            evaluating = data.get("status") == "Evaluated" and data.get("evaluated_at") != current["evaluated_at"]
            finishing = data.get("status") in ("Completed", "Evaluated") and data.get("status") != current["status"]
            if finishing or evaluating:
                from src.constructor_artifacts import evidence_errors, revisions
                workspace = data.get("constructor_workspace")
                if not workspace:
                    workspace = connection.execute("SELECT constructor_workspace FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone()[0]
                if isinstance(workspace, str):
                    workspace = json.loads(workspace)
                problems = evidence_errors(workspace, data.get("answer", previous["answer"] if previous else ""))
                if problems:
                    raise ValueError("Required deliverables are incomplete: " + "; ".join(problems))
            if evaluating and track_activity:
                workspace["evaluation_revisions"] = revisions(workspace)
                connection.execute("UPDATE attempts SET constructor_workspace=? WHERE attempt_id=?", (json.dumps(workspace), data["attempt_id"]))
        if track_activity and current and data.get("status") == "Evaluated" and data.get("evaluated_at") != current["evaluated_at"]:
            from src.submission import submission_revision
            saved = _decode_attempt(connection.execute("SELECT * FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone())
            data["evaluation_submission"] = submission_revision({**saved, **data})
    # Prose/status saves must not overwrite independently saved editor state.
    fields = [
        field
        for field in ATTEMPT_FIELDS
        if (field not in WORKSPACE_VALIDATORS or field in data or not data.get("attempt_id"))
        and (field not in ("resume_target", "activity_at", "evaluation_submission", "work_tracking_version", "project_run_id", "project_stage_id") or field in data or not data.get("attempt_id"))
    ]
    payload = {field: data.get(field) for field in fields}
    for field, default in TEXT_DEFAULTS.items():
        if payload[field] is None:
            payload[field] = default
    for field, default in JSON_DEFAULTS.items():
        if field not in payload:
            continue
        value = payload[field]
        if field in WORKSPACE_VALIDATORS:
            if value is not None:
                value = json.loads(value) if isinstance(value, str) else value
                validate = WORKSPACE_VALIDATORS[field]
                payload[field] = json.dumps(validate(value), ensure_ascii=False)
        elif not isinstance(value, str):
            payload[field] = json.dumps(default if value is None else value)
    values = [payload[field] for field in fields]
    if data.get("attempt_id"):
        assignments = ", ".join(f"{field} = ?" for field in fields)
        result = connection.execute(
            f"UPDATE attempts SET {assignments} WHERE attempt_id = ?",
            values + [data["attempt_id"]],
        )
        if result.rowcount != 1:
            raise ValueError("Attempt not found")
        return int(data["attempt_id"])
    columns = ", ".join(fields)
    placeholders = ", ".join("?" for _ in fields)
    result = connection.execute(
        f"INSERT INTO attempts ({columns}) VALUES ({placeholders})", values
    )
    return int(result.lastrowid)


def save_attempt(path: Path | str, data: dict[str, Any]) -> int:
    with connect(path) as connection:
        return _save_attempt(connection, data)


class AttemptConflict(ValueError):
    """The fields being edited changed after this editor loaded them."""


def save_attempt_details(path: Path | str, data: dict[str, Any], expected: dict[str, Any] | None = None) -> int:
    """Save prose/status without overwriting independently saved editor state."""
    def details(values):
        return {key: value for key, value in values.items() if key not in WORKSPACE_VALIDATORS
                and key not in ("resume_target", "activity_at", "evaluation_submission", "work_tracking_version", "project_run_id", "project_stage_id")}
    if expected is None:
        return save_attempt(path, details(data))
    if not expected or set(expected) - {"answer", "confidence", "status", "started_at"}:
        raise ValueError("Invalid draft changes")
    with connect(path) as connection:
        connection.execute("BEGIN IMMEDIATE")
        row = connection.execute("SELECT * FROM attempts WHERE attempt_id=?", (data["attempt_id"],)).fetchone()
        if row is None:
            raise ValueError("Attempt not found")
        current = _decode_attempt(row)
        if any(current[field] != original and current[field] != data[field] for field, original in expected.items()):
            raise AttemptConflict("This attempt changed in another tab. Choose which version to keep.")
        changes = {field: data[field] for field in expected}
        if all(current[field] == value for field, value in changes.items()):
            return data["attempt_id"]
        return _save_attempt(connection, details({**current, **changes, "updated_at": data["updated_at"]}))


def _decode_attempt(row: sqlite3.Row) -> dict[str, Any]:
    item = dict(row)
    for field, default in JSON_DEFAULTS.items():
        try:
            item[field] = json.loads(item[field]) if item[field] else deepcopy(default)
        except json.JSONDecodeError:
            item[field] = deepcopy(default)
    return item


def list_attempts(
    path: Path | str, challenge_id: str | None = None, *, include_diagrams: bool = True,
    include_content: bool = True,
) -> list[dict[str, Any]]:
    # Navigation/statistics need metadata, not every saved answer and note.
    # Keep the default full-record contract for exports and other callers.
    excluded = set()
    if not include_diagrams:
        excluded.update(WORKSPACE_VALIDATORS)
    if not include_content:
        excluded.update(("answer", "evaluation_feedback", "personal_notes"))
    columns = "*" if not excluded else ", ".join([
        "attempt_id",
        *(f"NULL AS {field}" if field in excluded else field
          for field in ATTEMPT_FIELDS),
    ])
    query = f"SELECT {columns} FROM attempts"
    parameters = ()
    if challenge_id is not None:
        query += " WHERE challenge_id = ?"
        parameters = (challenge_id,)
    query += " ORDER BY updated_at DESC, attempt_id DESC"
    with connect(path) as connection:
        return [_decode_attempt(row) for row in connection.execute(query, parameters)]


def get_attempt(path: Path | str, attempt_id: int) -> dict[str, Any] | None:
    with connect(path) as connection:
        row = connection.execute(
            "SELECT * FROM attempts WHERE attempt_id = ?", (attempt_id,)
        ).fetchone()
    return _decode_attempt(row) if row is not None else None


def _save_workspace(path: Path | str, attempt_id: int, field: str, value: dict) -> None:
    # Index the fixed registry before interpolating the column into SQL.
    validate = WORKSPACE_VALIDATORS[field]
    serialized = json.dumps(validate(value), ensure_ascii=False)
    with connect(path) as connection:
        old = connection.execute(f"SELECT {field} FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        def authored(v):
            return {k: item for k, item in (v or {}).items() if k not in ("assessment", "updated_at")}
        changed = old is not None and authored(json.loads(old[0]) if old[0] else None) != authored(json.loads(serialized))
        saved_at = datetime.now(timezone.utc).isoformat(timespec="microseconds")
        result = connection.execute(
            f"UPDATE attempts SET {field}=?, updated_at=? WHERE attempt_id=?",
            (serialized, datetime.now(timezone.utc).isoformat(timespec="microseconds"), attempt_id),
        )
        if result.rowcount != 1:
            raise ValueError("Attempt not found")
        if changed:
            connection.execute("UPDATE attempts SET resume_target=?, activity_at=? WHERE attempt_id=?", (field, saved_at, attempt_id))


def save_diagram(path: Path | str, attempt_id: int, diagram: dict) -> None:
    _save_workspace(path, attempt_id, "diagram", diagram)


def _save_settings(connection: sqlite3.Connection, settings: dict[str, Any]) -> None:
    connection.executemany(
        "INSERT INTO settings(key,value) VALUES(?,?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value "
        "WHERE settings.value != excluded.value",
        [(str(key), json.dumps(value)) for key, value in settings.items()],
    )


def save_sql_workspace(path: Path | str, attempt_id: int, workspace: dict) -> None:
    _save_workspace(path, attempt_id, "sql_workspace", workspace)


def save_detective_workspace(path: Path | str, attempt_id: int, workspace: dict) -> None:
    _save_workspace(path, attempt_id, "detective_workspace", workspace)


def save_python_workspace(path: Path | str, attempt_id: int, workspace: dict) -> None:
    _save_workspace(path, attempt_id, "python_workspace", workspace)


def save_settings(path: Path | str, settings: dict[str, Any]) -> None:
    with connect(path) as connection:
        _save_settings(connection, settings)


def save_setting(path: Path | str, key: str, value: Any) -> None:
    save_settings(path, {key: value})


def get_settings(path: Path | str) -> dict[str, Any]:
    with connect(path) as con:
        rows = con.execute("SELECT key,value FROM settings").fetchall()
    return {r["key"]: json.loads(r["value"]) for r in rows}


def export_progress(path: Path | str) -> dict[str, Any]:
    from src.capstone_backup import export_tables
    with connect(path) as con:
        con.execute("BEGIN")
        return {"format": "data-engineering-practice-lab-progress", "version": 3,
            "exported_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "attempts": [_decode_attempt(row) for row in con.execute("SELECT * FROM attempts ORDER BY updated_at DESC, attempt_id DESC")],
            "settings": {row["key"]: json.loads(row["value"]) for row in con.execute("SELECT key,value FROM settings")}, **export_tables(con)}


def _timestamp(value: str | None) -> datetime:
    if not value:
        return datetime.min.replace(tzinfo=timezone.utc)
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)


def _validate_backup_attempt(row: dict[str, Any]) -> None:
    for field in ("answer", "evaluation_feedback", "personal_notes"):
        if field in row and not isinstance(row[field], str):
            raise ValueError(f"Invalid {field} in backup attempt.")
    from src.attempt_resume import validate_target
    validate_target(row.get("resume_target"))
    if row.get("work_tracking_version") is not None and (type(row["work_tracking_version"]) is not int or row["work_tracking_version"] != 1):
        raise ValueError("Unsupported saved-work tracking version.")
    if row.get("evaluation_submission") is not None and (not isinstance(row["evaluation_submission"], str) or len(row["evaluation_submission"]) != 64):
        raise ValueError("Invalid evaluation submission in backup.")
    if row.get("evaluation_context") is not None and (not isinstance(row["evaluation_context"], str) or len(row["evaluation_context"]) != 64):
        raise ValueError("Invalid evaluation context in backup.")
    for field in ("started_at", "updated_at", "completed_at", "evaluated_at", "activity_at"):
        value = row.get(field)
        if value is not None and not isinstance(value, str):
            raise ValueError(f"Invalid {field} in backup attempt.")
        try:
            _timestamp(value)
        except (ValueError, OverflowError) as exc:
            raise ValueError(f"Invalid {field} in backup attempt.") from exc
    for field, minimum, maximum in (("score", 0, 100), ("confidence", 1, 5), ("minutes_taken", 0, float("inf"))):
        value = row.get(field)
        if value is not None and (
            type(value) not in (int, float) or not math.isfinite(value)
            or not minimum <= value <= maximum
            or (field == "confidence" and value != int(value))
        ):
            raise ValueError(f"Invalid {field} in backup attempt.")
    for field in ("hints_used", "complications_used", "weak_topics", "mistake_categories"):
        values = row.get(field, [])
        if not isinstance(values, list):
            raise ValueError(f"Invalid {field} in backup attempt.")
        if field in ("hints_used", "complications_used"):
            valid = all(type(value) is int and value == index for index, value in enumerate(values, 1))
        else:
            valid = all(isinstance(value, str) for value in values)
        if not valid:
            raise ValueError(f"Invalid {field} in backup attempt.")
    scores = row.get("rubric_scores", {})
    if not isinstance(scores, dict) or any(
        type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= 100
        for value in scores.values()
    ) or sum(scores.values()) > 100:
        raise ValueError("Invalid rubric scores in backup attempt.")


def merge_progress(path: Path | str, backup: dict[str, Any]) -> dict[str, int]:
    if (
        not isinstance(backup, dict)
        or backup.get("format") != "data-engineering-practice-lab-progress"
        or type(backup.get("version")) is not int or backup.get("version") not in (1, 2, 3)
    ):
        raise ValueError("This file is not a supported Practice Lab progress backup.")
    rows = backup.get("attempts", [])
    settings = backup.get("settings", {})
    if not isinstance(rows, list) or not isinstance(settings, dict):
        raise ValueError(
            "The backup must contain an attempts list and a settings object."
        )
    allowed_status = {"Not started", "In progress", "Completed", "Evaluated"}
    for row in rows:
        if (
            not isinstance(row, dict)
            or not isinstance(row.get("challenge_id"), str)
            or not row["challenge_id"]
        ):
            raise ValueError("Every backup attempt must include a challenge_id.")
        if not isinstance(row.get("status"), str) or row["status"] not in allowed_status:
            raise ValueError(
                f"Unsupported attempt status for {row.get('challenge_id')}."
            )
        _validate_backup_attempt(row)
        for field, validate in WORKSPACE_VALIDATORS.items():
            if row.get(field) is not None:
                validate(row[field])
        if row.get("project_run_id"):
            from src.capstone_models import uuid_value, ID
            uuid_value(row["project_run_id"])
            if backup["version"] != 3 or not isinstance(row.get("project_stage_id"), str) or not ID.fullmatch(row["project_stage_id"]):
                raise ValueError("Project stages require version-3 run metadata.")
        elif row.get("project_stage_id") or row.get("capstone_workspace"):
            raise ValueError("Orphan capstone stage workspace in backup.")
    from src.capstone_backup import validate_bundle, restore
    if backup["version"] != 3 and (backup.get("capstone_runs") or backup.get("capstone_datasets")):
        raise ValueError("Project histories and datasets require a version-3 backup.")
    bundle = validate_bundle(backup, rows) if backup["version"] == 3 else ([], [], {})
    with connect(path) as connection:
        existing = [
            _decode_attempt(row) for row in connection.execute("SELECT * FROM attempts")
        ]
        by_identity = {
            (a.get("challenge_id"), _timestamp(a.get("started_at"))): a
            for a in existing
            if a.get("started_at")
        }
        result = {"added": 0, "updated": 0, "unchanged": 0}
        for row in rows:
            if row.get("project_run_id"):
                continue
            identity = (row["challenge_id"], _timestamp(row.get("started_at")))
            current = by_identity.get(identity) if row.get("started_at") else None
            imported = {
                key: value for key, value in row.items() if key in ATTEMPT_FIELDS
            }
            if "activity_at" not in row and "resume_target" not in row:
                imported["activity_at"] = row.get("updated_at")
            if not imported.get("constructor_workspace") and imported.get("diagram"):
                from src.constructor_models import legacy_workspace
                imported["constructor_workspace"] = legacy_workspace(imported["diagram"])
            if current:
                if _timestamp(row.get("updated_at")) <= _timestamp(current.get("updated_at")):
                    result["unchanged"] += 1
                    continue
                imported["attempt_id"] = current["attempt_id"]
                _save_attempt(connection, imported, track_activity=False)
                current.update(imported)
                result["updated"] += 1
            else:
                new_id = _save_attempt(connection, imported, track_activity=False)
                imported["attempt_id"] = new_id
                result["added"] += 1
            if row.get("started_at"):
                by_identity[identity] = imported
        _save_settings(connection, settings)
        restore(connection, bundle, result)
    return result
