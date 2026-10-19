"""Transactional attempt artifact storage; document contracts live in constructor_models."""
import json

from src.constructor_models import (
    stamp, fingerprint, sql_document, validate_payload, validate_tasks, new_workspace,
    initial_payload, make_artifact, validate_workspace, revisions, evaluation_outdated,
    evidence_errors, summaries, sql_evidence_current,
    legacy_workspace,
)


def normalized_payload(tool, payload):
    if tool == "mock":
        return {"recipe_revision": 0, "generation": None, **{k: v for k, v in payload.items() if k not in ("ui_drafts", "pending_rules")}} | (
            {"pending_rules": True, "ui_drafts": payload.get("ui_drafts", {})} if payload.get("pending_rules") else {})
    return payload


def learner_content(tool, payload):
    p = normalized_payload(tool, payload)
    if tool == "sql":
        return {k: p.get(k) for k in ("sql", "plan", "reviewed_sql", "settings")}
    if tool == "mock":
        return {k: v for k, v in p.items() if k not in ("generation", "recipe_revision")}
    return p


def save_artifact(path, attempt_id, slot_id, payload, base_revision, provenance=None, *, track_activity=True):
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        row = con.execute("SELECT constructor_workspace FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        if row is None or not row[0]:
            raise ValueError("Attempt workspace no longer exists.")
        workspace = json.loads(row[0])
        slot = next((s for s in workspace["tasks"]["slots"] if s["id"] == slot_id), None)
        if slot is None:
            raise ValueError("Unknown deliverable slot.")
        current = workspace["artifacts"].get(slot_id)
        if type(base_revision) is not int or base_revision != (current["revision"] if current else 0):
            raise ValueError("This deliverable changed in another session. Download your draft and reopen before retrying.")
        artifact = make_artifact(slot, payload, provenance or (current or {}).get("provenance"))
        artifact["payload"] = normalized_payload(slot["tool"], artifact["payload"])
        if current and normalized_payload(slot["tool"], current["payload"]) == artifact["payload"] and current["provenance"] == artifact["provenance"]:
            return current
        if current:
            artifact.update(revision=current["revision"] + 1, created_at=current["created_at"])
        workspace["artifacts"][slot_id] = artifact
        con.execute("UPDATE attempts SET constructor_workspace=?, updated_at=? WHERE attempt_id=?",
                    (json.dumps(workspace, ensure_ascii=False), stamp(), attempt_id))
        if track_activity and (not current or learner_content(slot["tool"], current["payload"]) != learner_content(slot["tool"], artifact["payload"])):
            con.execute("UPDATE attempts SET resume_target=?, activity_at=? WHERE attempt_id=?",
                        ("artifact:" + slot_id, stamp(), attempt_id))
        return artifact


def upgrade_attempt(path, attempt_id, challenge):
    from src.database import connect
    with connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        row = con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        if row is None or row["challenge_id"] != challenge["id"] or row["status"] not in ("Not started", "In progress"):
            raise ValueError("Only unfinished attempts can adopt new requirements.")
        if row["constructor_workspace"] and not json.loads(row["constructor_workspace"]).get("legacy"):
            return
        legacy = json.loads(row["diagram"]) if row["diagram"] else None
        if row["constructor_workspace"]:
            previous = json.loads(row["constructor_workspace"])
            legacy = next((a["payload"] for a in previous["artifacts"].values() if a["tool"] == "diagram"), legacy)
        workspace = new_workspace(challenge, legacy)
        con.execute("UPDATE attempts SET constructor_workspace=?, updated_at=? WHERE attempt_id=?",
                    (json.dumps(workspace), stamp(), attempt_id))


