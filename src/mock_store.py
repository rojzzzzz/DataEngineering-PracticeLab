"""Named recipe drafts, with optimistic saves; generated files remain temporary."""
from copy import deepcopy
from datetime import datetime, timezone
import json
from uuid import uuid4

from src.database import connect
from src.mock_models import MAX_RECIPE, new_recipe


class RecipeConflict(ValueError):
    pass


def init_store(path):
    with connect(path) as con:
        con.execute("""CREATE TABLE IF NOT EXISTS mock_recipes (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, payload TEXT NOT NULL,
            revision INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)""")


def _name(name):
    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 100 or any(ord(c) < 32 for c in name):
        raise ValueError("Choose a recipe name of 1–100 characters without control characters.")
    return name.strip()


def _encode(payload):
    # Incomplete rules are drafts, not executable recipes. Generation/import still
    # use strict recipe validation. Never persist job objects or generated files.
    if not isinstance(payload, dict) or not isinstance(payload.get("recipe"), dict):
        raise ValueError("A saved draft needs a recipe.")
    value = {"recipe": payload["recipe"], "ui_drafts": payload.get("ui_drafts", {})}
    encoded = json.dumps(value, ensure_ascii=False, allow_nan=False)
    if len(encoded.encode("utf-8")) > 2 * MAX_RECIPE:
        raise ValueError("Recipe draft exceeds 4 MiB. Reduce its settings.")
    return encoded


def list_recipes(path):
    with connect(path) as con:
        return [dict(row) for row in con.execute("SELECT id,name,revision,updated_at FROM mock_recipes ORDER BY updated_at DESC,id")]


def load(path, identity):
    with connect(path) as con:
        row = con.execute("SELECT * FROM mock_recipes WHERE id=?", (identity,)).fetchone()
    if row is None:
        raise ValueError("This recipe no longer exists. Choose another saved recipe.")
    result = dict(row)
    result["payload"] = json.loads(result["payload"])
    return result


def create(path, name="Untitled recipe", payload=None):
    identity = str(uuid4())
    with connect(path) as con:
        con.execute("INSERT INTO mock_recipes VALUES(?,?,?,?,?)", (identity, _name(name),
                    _encode(payload or {"recipe": new_recipe()}), 0, datetime.now(timezone.utc).isoformat()))
    return load(path, identity)


def save(path, identity, payload, expected_revision, name=None):
    encoded = _encode(payload)
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        row = con.execute("SELECT * FROM mock_recipes WHERE id=?", (identity,)).fetchone()
        if row is None:
            raise RecipeConflict("This recipe was removed. Save your draft as a new recipe or download the recovery JSON.")
        if row["revision"] != expected_revision:
            raise RecipeConflict("A newer version was saved in another tab. Save this draft as a copy or download recovery JSON before reloading the saved version.")
        name = _name(name) if name is not None else row["name"]
        if encoded == row["payload"] and name == row["name"]:
            return expected_revision
        con.execute("UPDATE mock_recipes SET name=?,payload=?,revision=revision+1,updated_at=? WHERE id=?",
                    (name, encoded, datetime.now(timezone.utc).isoformat(), identity))
    return expected_revision + 1


def duplicate(path, identity):
    doc = load(path, identity)
    return create(path, doc["name"][:93] + " (copy)", deepcopy(doc["payload"]))
