"""Versioned Constructor slot contracts, document validation and evidence summaries.

The workspace is one transactional progress field. Pipeline files stay in their
native document; dataset archives never enter this field. Standalone stores are
only used through explicit copy actions.
"""
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
import re
from pathlib import Path

from src.diagrams import KINDS, empty_diagram, validate_diagram, diagram_summary
from src.pipeline_models import empty_document, validate_document
from src.mock_models import new_recipe, recipe_issues, validate_recipe

TOOLS = ("diagram", "pipeline", "sql", "mock")
DIALECTS = json.loads((Path(__file__).parent / "sql_tools_dialects.json").read_text(encoding="utf-8"))


def stamp():
    return datetime.now(timezone.utc).isoformat(timespec="microseconds")


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def _json(value, limit):
    try:
        raw = json.dumps(value, ensure_ascii=False, allow_nan=False)
    except (ValueError, TypeError, RecursionError) as exc:
        raise ValueError("Workspace must contain finite JSON values.") from exc
    if len(raw.encode()) > limit:
        raise ValueError("Constructor workspace exceeds its size limit.")
    return json.loads(raw)


def sql_document():
    return {"format": "constructor-sql-workspace", "version": 1, "sql": "", "plan": "",
            "settings": {"dialect": "postgres", "target": "duckdb", "keywordCase": "upper",
                         "tabWidth": 2, "lineLength": 88, "planFormat": "auto", "statement": 1},
            "panel": "Format", "revision": 0, "reviewed_sql": "", "results": {}}


def validate_payload(tool, value, kind=None):
    if tool == "diagram":
        return validate_diagram(value, kind)
    if tool == "pipeline":
        return validate_document(value)
    value = _json(value, 8 * 1024**2)
    if not isinstance(value, dict):
        raise ValueError("Artifact payload must be an object.")
    if tool == "mock":
        recipe = value.get("recipe")
        # Generation validation remains strict. Editing permits unfinished recipes.
        if (not isinstance(recipe, dict) or recipe.get("format") != "constructor-mock-data"
                or recipe.get("version") != 1 or not isinstance(recipe.get("tables"), list)
                or len(recipe["tables"]) > 20):
            raise ValueError("Unsupported mock recipe draft.")
        _json(recipe, 2 * 1024**2)
        if (type(value.get("recipe_revision", 0)) is not int or value.get("recipe_revision", 0) < 0
                or not isinstance(recipe.get("output"), dict) or not isinstance(recipe.get("pending_mappings"), list)):
            raise ValueError("Invalid mock draft settings.")
        for table in recipe["tables"]:
            if (not isinstance(table, dict) or not isinstance(table.get("id"), str) or not isinstance(table.get("name"), str)
                    or type(table.get("rows")) is not int or not 1 <= table["rows"] <= 1_000_000
                    or not isinstance(table.get("fields"), list) or len(table["fields"]) > 100):
                raise ValueError("Invalid mock draft table.")
            for field in table["fields"]:
                if (not isinstance(field, dict) or any(not isinstance(field.get(k), str) for k in ("id", "name", "type"))
                        or not isinstance(field.get("generator"), dict) or not isinstance(field["generator"].get("kind"), str)
                        or type(field.get("primary_key")) is not bool
                        or any(type(field.get(k)) not in (int, float) for k in ("null_pct", "precision", "scale", "max_length"))):
                    raise ValueError("Invalid mock draft field.")
        if not isinstance(value.get("ui_drafts", {}), dict):
            raise ValueError("Invalid unfinished mock inputs.")
        _json(value.get("ui_drafts", {}), 128 * 1024)
        evidence = value.get("generation")
        if evidence is not None:
            if not isinstance(evidence, dict):
                raise ValueError("Invalid generation evidence.")
            manifest, samples = evidence.get("manifest"), evidence.get("samples")
            if (evidence.get("status") != "complete" or not isinstance(evidence.get("recipe_hash"), str)
                    or type(evidence.get("recipe_revision")) is not int
                    or not isinstance(manifest, dict) or manifest.get("format") != "constructor-mock-manifest"
                    or manifest.get("version") != 1 or not isinstance(manifest.get("tables"), list)
                    or any(not isinstance(t, dict) for t in manifest.get("tables", []))
                    or not isinstance(samples, dict) or len(samples) > 20
                    or any(not isinstance(rows, list) or len(rows) > 10 for rows in samples.values())):
                raise ValueError("Invalid generation evidence.")
            _json(evidence, 2 * 1024**2)
            if evidence["recipe_hash"] == fingerprint(recipe):
                validate_recipe(recipe)
                expected = {t["id"]: t for t in recipe["tables"]}
                tables = manifest["tables"]
                if (manifest.get("seed") != recipe["seed"] or manifest.get("output") != recipe["output"]
                        or len(tables) != len(expected)
                        or {t.get("id") for t in tables} != set(expected)
                        or any(t.get("rows") != expected[t["id"]]["rows"] or t.get("fields") != expected[t["id"]]["fields"] for t in tables)
                        or set(samples) != set(expected)):
                    raise ValueError("Generation evidence does not match the recipe.")
        return value
    if tool != "sql" or value.get("format") != "constructor-sql-workspace" or value.get("version") != 1:
        raise ValueError("Unsupported SQL workspace.")
    for field, maximum in (("sql", 200_000), ("plan", 2_000_000), ("reviewed_sql", 200_000)):
        if not isinstance(value.get(field, ""), str) or len(value.get(field, "").encode()) > maximum:
            raise ValueError(f"Invalid SQL workspace {field}.")
    settings = value.get("settings", {})
    if not isinstance(settings, dict):
        raise ValueError("Invalid SQL workspace settings.")
    if (settings.get("dialect") not in DIALECTS or settings.get("target") not in DIALECTS
            or settings.get("keywordCase") not in ("preserve", "upper", "lower")
            or settings.get("tabWidth") not in (2, 4) or settings.get("lineLength", 88) not in (80, 88, 100, 120)
            or settings.get("planFormat") not in ("auto", "json", "text")
            or type(settings.get("statement")) is not int or settings["statement"] < 1
            or type(value.get("revision", 0)) is not int or value.get("revision", 0) < 0
            or value.get("panel", "Format") not in ("Format", "Convert", "Visualize SQL", "Explain Plan")
            or not isinstance(value.get("results", {}), dict)):
        raise ValueError("Invalid SQL workspace settings or evidence.")
    for action, entry in value.get("results", {}).items():
        if (action not in ("format", "convert", "visualize", "explain") or not isinstance(entry, dict)
                or type(entry.get("revision")) is not int or not isinstance(entry.get("result"), dict)
                or not isinstance(entry.get("inputs"), dict)):
            raise ValueError("Invalid SQL analysis evidence.")
    return value


def validate_tasks(value):
    value = _json(value, 8 * 1024**2)
    if (not isinstance(value, dict) or set(value) != {"version", "slots"}
            or type(value.get("version")) is not int or value["version"] != 1
            or not isinstance(value.get("slots"), list) or not 1 <= len(value["slots"]) <= 12):
        raise ValueError("constructor_tasks needs version 1 and 1–12 slots.")
    ids = set()
    for slot in value["slots"]:
        if not isinstance(slot, dict) or set(slot) - {"id", "tool", "label", "required", "kind", "instructions", "starter", "required_actions", "required_inputs", "requires_changes"}:
            raise ValueError("Unsupported Constructor slot fields.")
        identity = slot.get("id")
        if not isinstance(identity, str) or not re.fullmatch(r"[a-z][a-z0-9_-]{0,63}", identity) or identity in ids:
            raise ValueError("Constructor slots need unique stable IDs.")
        ids.add(identity)
        if (slot.get("tool") not in TOOLS or not isinstance(slot.get("label"), str) or not slot["label"].strip()
                or len(slot["label"]) > 200 or type(slot.get("required")) is not bool
                or not isinstance(slot.get("instructions", ""), str)):
            raise ValueError("Constructor slots need a tool, label and required flag.")
        if slot["tool"] == "diagram" and slot.get("kind") not in KINDS:
            raise ValueError("Diagram slots need a supported kind.")
        if slot["tool"] != "diagram" and "kind" in slot:
            raise ValueError("Only diagram slots declare kind.")
        if "requires_changes" in slot and (slot["requires_changes"] is not True or "starter" not in slot):
            raise ValueError("requires_changes must be true and needs a starter.")
        for field, allowed in (("required_actions", ("format", "convert", "visualize", "explain")),
                               ("required_inputs", ("sql", "plan", "reviewed_sql"))):
            if field in slot and (slot["tool"] != "sql" or not isinstance(slot[field], list)
                                  or any(item not in allowed for item in slot[field])):
                raise ValueError("Invalid SQL evidence requirements.")
        if "starter" in slot:
            # Only native public inputs are accepted; analysis/reference outputs are forbidden.
            starter = validate_payload(slot["tool"], slot["starter"], slot.get("kind"))
            if slot["tool"] == "sql" and (starter.get("results") or starter.get("reviewed_sql")):
                raise ValueError("SQL starters must contain only public inputs.")
            if slot["tool"] == "mock" and starter.get("generation"):
                raise ValueError("Mock starters cannot contain generation evidence.")
    return value


def new_workspace(challenge, legacy_diagram=None):
    tasks = challenge.get("constructor_tasks")
    if not tasks and challenge.get("diagram_kind"):
        tasks = {"version": 1, "slots": [{"id": "diagram", "tool": "diagram", "label": "ER diagram",
                  "required": True, "kind": challenge["diagram_kind"]}]}
    if not tasks:
        return None
    workspace = {"version": 1, "tasks": validate_tasks(tasks), "artifacts": {}, "evaluation_revisions": None}
    if legacy_diagram:
        slot = next((s for s in tasks["slots"] if s["tool"] == "diagram" and s.get("kind") == legacy_diagram["kind"]), None)
        if slot:
            workspace["artifacts"][slot["id"]] = make_artifact(slot, legacy_diagram, {"source": "legacy-attempt-diagram"})
    return workspace


def legacy_workspace(diagram):
    workspace = new_workspace({"diagram_kind": diagram["kind"]}, diagram)
    workspace["legacy"] = True
    workspace["tasks"]["slots"][0]["required"] = False
    return workspace


def initial_payload(slot):
    if "starter" in slot:
        return deepcopy(slot["starter"])
    return {"diagram": lambda: empty_diagram(slot["kind"]), "pipeline": lambda: empty_document(slot["label"]),
            "sql": sql_document, "mock": lambda: {"recipe": new_recipe(), "generation": None}}[slot["tool"]]()


def make_artifact(slot, payload, provenance=None):
    now = stamp()
    return {"version": 1, "slot_id": slot["id"], "tool": slot["tool"],
            "payload": validate_payload(slot["tool"], payload, slot.get("kind")), "revision": 1,
            "provenance": provenance or {"source": "authored"}, "created_at": now, "updated_at": now}


def validate_workspace(value):
    value = _json(value, 100 * 1024**2)
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("Unsupported Constructor attempt workspace.")
    tasks = validate_tasks(value.get("tasks"))
    slots = {s["id"]: s for s in tasks["slots"]}
    artifacts = value.get("artifacts")
    if not isinstance(artifacts, dict) or set(artifacts) - set(slots):
        raise ValueError("Artifact refers to an undeclared slot.")
    for identity, artifact in artifacts.items():
        slot = slots[identity]
        if (not isinstance(artifact, dict) or artifact.get("version") != 1
                or artifact.get("slot_id") != identity or artifact.get("tool") != slot["tool"]
                or type(artifact.get("revision")) is not int or artifact["revision"] < 1
                or not isinstance(artifact.get("provenance"), dict)):
            raise ValueError("Invalid Constructor artifact envelope.")
        for key in ("created_at", "updated_at"):
            datetime.fromisoformat(artifact[key])
        artifact["payload"] = validate_payload(slot["tool"], artifact["payload"], slot.get("kind"))
    versions = value.get("evaluation_revisions")
    if versions is not None and (not isinstance(versions, dict) or set(versions) - set(slots)
                                or any(type(v) is not int or v < 1 for v in versions.values())):
        raise ValueError("Invalid evaluation artifact revisions.")
    return value


def revisions(workspace):
    return {key: a["revision"] for key, a in (workspace or {}).get("artifacts", {}).items()}


def evaluation_outdated(workspace):
    return bool(workspace and workspace.get("evaluation_revisions") is not None
                and workspace["evaluation_revisions"] != revisions(workspace))


def sql_evidence_current(action, payload, slot):
    entry = payload.get("results", {}).get(action)
    if not entry:
        return False
    inputs, result = entry["inputs"], entry["result"]
    settings = inputs.get("settings", {})
    if not isinstance(settings, dict):
        return False
    if action == "explain":
        return (inputs.get("plan") == payload.get("plan")
                and settings.get("planFormat", "auto") == payload["settings"].get("planFormat", "auto")
                and bool(result.get("nodes")))
    if action == "visualize":
        authored = payload.get("reviewed_sql") or payload.get("sql")
        expected_dialect = payload["settings"]["target"] if payload.get("reviewed_sql") else payload["settings"]["dialect"]
        return (inputs.get("sql") == authored and settings.get("dialect") == expected_dialect
                and settings.get("statement", 1) == payload["settings"].get("statement", 1)
                and bool(result.get("nodes")))
    if action == "convert":
        original = payload.get("sql")
        return (inputs.get("sql") == original and settings.get("dialect") == payload["settings"]["dialect"]
                and settings.get("target") == payload["settings"]["target"] and bool(result.get("sql", "").strip()))
    return (inputs.get("sql") == payload.get("sql")
            and all(settings.get(key, default) == payload["settings"].get(key, default)
                    for key, default in (("keywordCase", "upper"), ("tabWidth", 2), ("lineLength", 88)))
            and bool(result.get("sql", "").strip()))


def slot_statuses(workspace, pending_slots=()):
    """Ordered independent save/evidence states, including optional deliverables."""
    if not workspace:
        return []
    statuses = []
    for slot in workspace["tasks"]["slots"]:
        artifact = workspace["artifacts"].get(slot["id"])
        problem = "Save this deliverable."
        evidence = "Missing"
        if artifact:
            evidence = "Incomplete"
            try:
                p = validate_payload(slot["tool"], artifact["payload"], slot.get("kind"))
                if slot["tool"] == "diagram":
                    valid = bool(p["entities"])
                    problem = "Add at least one entity."
                elif slot["tool"] == "pipeline":
                    valid = any(not e.get("isDeleted") and e.get("type") != "selection"
                                and (e.get("text", "").strip() or (e.get("width", 0) > 0 and e.get("height", 0) > 0)) for e in p["elements"])
                    problem = "Add meaningful canvas content."
                elif slot["tool"] == "sql":
                    valid = all(p.get(k, "").strip() for k in slot.get("required_inputs", ["sql", "reviewed_sql"]))
                    valid = valid and all(sql_evidence_current(action, p, slot) for action in slot.get("required_actions", []))
                    problem = "Save the declared inputs, authored output and requested analysis evidence."
                    if not valid and any(a in p.get("results", {}) and not sql_evidence_current(a, p, slot) for a in slot.get("required_actions", [])):
                        evidence, problem = "Outdated", "Rerun the requested analysis for the current inputs."
                else:
                    generation = p.get("generation") or {}
                    valid = (not recipe_issues(p["recipe"]) and generation.get("recipe_hash") == fingerprint(p["recipe"])
                             and not p.get("pending_rules") and generation.get("recipe_revision") == p.get("recipe_revision", 0) and generation.get("status") == "complete")
                    problem = "Generate successfully using the current recipe."
                    if generation and not valid:
                        evidence, problem = "Outdated", "Apply pending rules and regenerate using the current recipe."
                if valid and slot.get("requires_changes"):
                    from src.repair_content import substantive_fingerprint
                    valid = substantive_fingerprint(slot["tool"], p) != substantive_fingerprint(slot["tool"], validate_payload(slot["tool"], slot["starter"], slot.get("kind")))
                    problem = "Make a substantive change to the supplied design; layout and generated evidence do not count."
                if valid:
                    evidence, problem = "Ready", "Saved evidence meets presence checks; correctness is assessed through rubric review."
            except (ValueError, TypeError, KeyError) as exc:
                problem = str(exc)
        statuses.append({"slot_id": slot["id"], "label": slot["label"], "required": slot["required"],
                         "save": "Unsaved changes" if slot["id"] in pending_slots else "Saved" if artifact else "Not started",
                         "evidence": evidence, "explanation": problem})
    return statuses


def evidence_errors(workspace, answer=None):
    errors = [f"{s['label']}: {s['explanation']}" for s in slot_statuses(workspace)
              if s["required"] and s["evidence"] != "Ready"]
    if workspace and any(s.get("requires_changes") and s["required"] for s in workspace["tasks"]["slots"]) and not (answer or "").strip():
        errors.append("Written diagnosis: explain the symptoms, your changes and verification reasoning.")
    return errors


def payload_summary(tool, p):
    """Text evidence shared by attempts, public starters and copied handoffs."""
    if tool == "diagram":
        return diagram_summary(p)
    if tool == "pipeline":
        return {"notes": p.get("notes", ""), "elements": [
            {**{k: e[k] for k in ("id", "type", "text", "startBinding", "endBinding", "boundElements") if k in e},
             "pipeline": (e.get("customData") or {}).get("pipeline")}
            for e in p["elements"] if not e.get("isDeleted")]}
    if tool == "sql":
        return {k: p.get(k) for k in ("sql", "plan", "settings", "reviewed_sql", "results")}
    generation = p.get("generation")
    return {"recipe": p["recipe"], "generation": generation,
            "generation_current": bool(generation and generation.get("recipe_hash") == fingerprint(p["recipe"])
                                       and generation.get("recipe_revision") == p.get("recipe_revision", 0))}


def summaries(workspace):
    return [{"slot": identity, "tool": a["tool"], "revision": a["revision"], "evidence": payload_summary(a["tool"], a["payload"])}
            for identity, a in (workspace or {}).get("artifacts", {}).items()]
