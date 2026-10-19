"""Transactional pipeline scenes and separately stored image assets."""
import json
from datetime import datetime, timezone
from uuid import uuid4

from src.database import connect
from src.pipeline_models import empty_document, name_value, validate_document, _validate_document


def init_store(path):
    with connect(path) as con:
        con.executescript("""
            CREATE TABLE IF NOT EXISTS pipeline_documents (
              document_id TEXT PRIMARY KEY, name TEXT NOT NULL, scene TEXT NOT NULL,
              revision INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS pipeline_assets (
              document_id TEXT NOT NULL, file_id TEXT NOT NULL, asset TEXT NOT NULL,
              PRIMARY KEY (document_id, file_id));
        """)


def list_documents(path):
    with connect(path) as con:
        return [dict(row) for row in con.execute("SELECT document_id, name, revision FROM pipeline_documents ORDER BY updated_at DESC, document_id")]


def _require_document(row):
    if row is None:
        raise ValueError("This project no longer exists. Your recovery draft is still available.")
    return row


def _load_files(con, document_id):
    return {r["file_id"]: json.loads(r["asset"]) for r in con.execute("SELECT file_id, asset FROM pipeline_assets WHERE document_id=?", (document_id,))}


def _load(con, document_id):
    row = _require_document(con.execute("SELECT * FROM pipeline_documents WHERE document_id=?", (document_id,)).fetchone())
    doc = json.loads(row["scene"])
    doc["name"] = row["name"]
    doc["files"] = _load_files(con, document_id)
    return {"documentId": document_id, "revision": row["revision"], "document": doc}


def load_document(path, document_id):
    with connect(path) as con:
        return _load(con, document_id)


def create_document(path, name, document=None):
    doc = validate_document({**(document or empty_document(name)), "name": name_value(name)})
    identity, stamp = str(uuid4()), datetime.now(timezone.utc).isoformat()
    files = doc.pop("files")
    with connect(path) as con:
        con.execute("INSERT INTO pipeline_documents VALUES (?, ?, ?, 0, ?, ?)", (identity, doc["name"], json.dumps(doc), stamp, stamp))
        con.executemany("INSERT INTO pipeline_assets VALUES (?, ?, ?)", [(identity, key, json.dumps(asset)) for key, asset in files.items()])
    return identity


def save_document(path, document_id, base_revision, document, new_files):
    if type(base_revision) is not int or not isinstance(new_files, dict):
        raise ValueError("Invalid save revision or image files.")
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        current = _require_document(con.execute("SELECT revision FROM pipeline_documents WHERE document_id=?", (document_id,)).fetchone())
        if current["revision"] != base_revision:
            raise ValueError("This project changed in another session. Download your draft or save it as a new project.")
        # Retain deleted-image assets for undo and complete portable backups.
        files = {**_load_files(con, document_id), **new_files}
        doc = _validate_document({**document, "files": files}, copy_result=False)
        doc.pop("files")
        revision = base_revision + 1
        con.execute("UPDATE pipeline_documents SET name=?, scene=?, revision=?, updated_at=? WHERE document_id=?",
                    (doc["name"], json.dumps(doc), revision, datetime.now(timezone.utc).isoformat(), document_id))
        con.executemany("INSERT OR REPLACE INTO pipeline_assets VALUES (?, ?, ?)", [(document_id, key, json.dumps(asset)) for key, asset in new_files.items()])
    return revision


def delete_document(path, document_id, base_revision):
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        current = _load(con, document_id)
        if current["revision"] != base_revision:
            raise ValueError("This project changed in another session. Reopen it before deleting.")
        con.execute("DELETE FROM pipeline_assets WHERE document_id=?", (document_id,))
        con.execute("DELETE FROM pipeline_documents WHERE document_id=?", (document_id,))
