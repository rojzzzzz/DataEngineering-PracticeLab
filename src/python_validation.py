"""Local runtime attestations. Deliberately excluded from progress backups."""
import json
import uuid

from src.database import connect
from src.python_models import fingerprint


def _installation(connection):
    connection.execute("CREATE TABLE IF NOT EXISTS python_installation (singleton INTEGER PRIMARY KEY CHECK(singleton=1), identity TEXT NOT NULL)")
    connection.execute("INSERT OR IGNORE INTO python_installation VALUES (1, ?)", (uuid.uuid4().hex,))
    connection.execute("""CREATE TABLE IF NOT EXISTS python_validations (
        installation TEXT NOT NULL, exercise_hash TEXT NOT NULL, runner_hash TEXT NOT NULL,
        result TEXT NOT NULL, PRIMARY KEY (installation, exercise_hash, runner_hash))""")
    return connection.execute("SELECT identity FROM python_installation WHERE singleton=1").fetchone()[0]


def validation_record(database, exercise, runner_hash):
    if not runner_hash:
        return None
    with connect(database) as connection:
        identity = _installation(connection)
        row = connection.execute("SELECT result FROM python_validations WHERE installation=? AND exercise_hash=? AND runner_hash=?",
                                 (identity, fingerprint(exercise), runner_hash)).fetchone()
    return json.loads(row[0]) if row else None


def save_validation(database, exercise, snapshot):
    if (snapshot.get("operation") != "validate_exercise" or snapshot.get("state") != "finished"
            or snapshot.get("exercise_hash") != fingerprint(exercise)
            or snapshot.get("result", {}).get("passed") is not True):
        raise ValueError("Only successful matching runtime validation can be saved.")
    summary = {k: v for k, v in snapshot["result"].items() if k not in ("stdout", "stderr")}
    with connect(database) as connection:
        identity = _installation(connection)
        connection.execute("INSERT OR REPLACE INTO python_validations VALUES (?, ?, ?, ?)",
                           (identity, fingerprint(exercise), snapshot["runner_hash"], json.dumps(summary, allow_nan=False)))
