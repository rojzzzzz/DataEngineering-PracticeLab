"""Independent local Constructor documents and portable interchange."""
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from src.database import connect
from src.diagrams import empty_diagram, validate_diagram


def init_constructor(path):
    with connect(path) as con:
        con.execute("""CREATE TABLE IF NOT EXISTS constructor_diagrams (
            document_id TEXT PRIMARY KEY, name TEXT NOT NULL, diagram TEXT NOT NULL,
            created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")


def _name(name):
    if not isinstance(name, str) or not name.strip() or len(name.strip()) > 200:
        raise ValueError("Choose a diagram name between 1 and 200 characters.")
    return name.strip()


def list_diagrams(path, kinds=None):
    # Filter in SQLite without decoding/copying every entity and field. Only
    # the chosen document needs full validation when it is opened/imported.
    query = "SELECT document_id, name, created_at, updated_at FROM constructor_diagrams"
    parameters = ()
    if kinds is not None:
        parameters = tuple(kinds)
        if not parameters:
            return []
        query += " WHERE json_extract(diagram, '$.kind') IN (" + ",".join("?" for _ in parameters) + ")"
    query += " ORDER BY updated_at DESC, document_id"
    with connect(path) as con:
        return [dict(row) for row in con.execute(query, parameters)]


def load_diagram(path, document_id):
    with connect(path) as con:
        row = con.execute("SELECT * FROM constructor_diagrams WHERE document_id=?", (document_id,)).fetchone()
    if row is None:
        raise ValueError("This diagram no longer exists. Choose another diagram.")
    result = dict(row)
    result["diagram"] = validate_diagram(json.loads(result["diagram"]))
    return result


def create_diagram(path, name, kind="logical_erd", diagram=None):
    name = _name(name)
    value = validate_diagram(diagram, kind) if diagram is not None else empty_diagram(kind)
    document_id, stamp = str(uuid4()), datetime.now(timezone.utc).isoformat()
    with connect(path) as con:
        con.execute("INSERT INTO constructor_diagrams VALUES (?, ?, ?, ?, ?)",
                    (document_id, name, json.dumps(value), stamp, stamp))
    return document_id


def save_diagram(path, document_id, diagram):
    with connect(path) as con:
        row = con.execute("SELECT diagram FROM constructor_diagrams WHERE document_id=?",
                          (document_id,)).fetchone()
        if row is None:
            raise ValueError("This diagram no longer exists. Your draft has not been saved.")
        saved_json = row["diagram"]
        value = validate_diagram(diagram, json.loads(saved_json)["kind"])
        updated_json = json.dumps(value)
        if updated_json == saved_json:
            return
        changed = con.execute("UPDATE constructor_diagrams SET diagram=?, updated_at=? WHERE document_id=?",
                              (updated_json, datetime.now(timezone.utc).isoformat(), document_id))
        if changed.rowcount != 1:
            raise ValueError("This diagram no longer exists. Your draft has not been saved.")


def rename_diagram(path, document_id, name):
    name = _name(name)
    with connect(path) as con:
        row = con.execute("SELECT name FROM constructor_diagrams WHERE document_id=?",
                          (document_id,)).fetchone()
        if row is None:
            raise ValueError("This diagram no longer exists. Choose another diagram.")
        if row["name"] != name:
            con.execute("UPDATE constructor_diagrams SET name=?, updated_at=? WHERE document_id=?",
                        (name, datetime.now(timezone.utc).isoformat(), document_id))


def duplicate_diagram(path, document_id):
    doc = load_diagram(path, document_id)
    return create_diagram(path, doc["name"][:193] + " (copy)", doc["diagram"]["kind"], doc["diagram"])


def delete_diagram(path, document_id):
    with connect(path) as con:
        con.execute("DELETE FROM constructor_diagrams WHERE document_id=?", (document_id,))


def export_document(name, diagram):
    return json.dumps({"format": "constructor-diagram", "version": 1,
                       "name": _name(name), "diagram": validate_diagram(diagram)}, indent=2)


def import_document(path, payload, filename):
    value = json.loads(payload)
    if isinstance(value, dict) and value.get("format") == "constructor-diagram":
        if type(value.get("version")) is not int or value["version"] != 1:
            raise ValueError("Unsupported Constructor document version.")
        name, diagram = _name(value.get("name")), validate_diagram(value.get("diagram"))
    else:
        name, diagram = _name(Path(filename).stem), validate_diagram(value)
    return create_diagram(path, name, diagram["kind"], diagram)
