"""Public Detective metadata and independently persisted investigation notes."""
from __future__ import annotations

from copy import deepcopy
import re

from src.sql_models import IDENTIFIER, fingerprint

HEX = re.compile(r"[0-9a-f]{64}\Z")
FIELD_LIMIT = 20_000


def validate_detective_metadata(value: object) -> dict:
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("Detective metadata needs version 1")
    for name in ("symptom", "business_context", "business_rules", "supplied_evidence"):
        if not isinstance(value.get(name), str) or not value[name].strip() or len(value[name]) > FIELD_LIMIT:
            raise ValueError(f"Detective {name} must be nonempty text")
    categories = value.get("finding_categories")
    if not isinstance(categories, list) or not categories or len(categories) > 20 or any(not isinstance(x, str) or not x.strip() or len(x) > 80 for x in categories) or len(categories) != len(set(categories)):
        raise ValueError("Detective finding categories are invalid")
    return deepcopy(value)


def new_detective_workspace() -> dict:
    return {"version": 1, "notebooks": {"notebook_1": ""}, "notebook_titles": {"notebook_1": "Notebook 1"}, "findings": [], "root_cause": "", "prevention": ""}


def validate_detective_workspace(value: object) -> dict:
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("Invalid Detective workspace")
    notebooks = value.get("notebooks")
    if not isinstance(notebooks, dict) or not 1 <= len(notebooks) <= 12 or any(not isinstance(k, str) or not IDENTIFIER.fullmatch(k) or not isinstance(v, str) or len(v) > 50_000 for k, v in notebooks.items()):
        raise ValueError("Invalid Detective notebooks")
    titles = value.get("notebook_titles", {})
    if not isinstance(titles, dict) or any(k not in notebooks or not isinstance(v, str) or not v.strip() or len(v) > 80 for k, v in titles.items()):
        raise ValueError("Invalid Detective notebook titles")
    findings = value.get("findings")
    if not isinstance(findings, list) or len(findings) > 30:
        raise ValueError("Invalid Detective findings")
    for finding in findings:
        if not isinstance(finding, dict) or any(not isinstance(finding.get(k, ""), str) or len(finding.get(k, "")) > FIELD_LIMIT for k in ("title", "category", "tables", "explanation", "impact", "action")):
            raise ValueError("Invalid Detective finding")
        evidence = finding.get("evidence", [])
        if not isinstance(evidence, list) or len(evidence) > 20:
            raise ValueError("Invalid Detective evidence")
        for item in evidence:
            if not isinstance(item, dict) or not isinstance(item.get("sql"), str) or len(item["sql"]) > 50_000 or not isinstance(item.get("tab"), str) or any(not isinstance(item.get(k), str) or not HEX.fullmatch(item[k]) for k in ("query_hash", "fixture_hash")):
                raise ValueError("Invalid Detective evidence")
    for key in ("root_cause", "prevention"):
        if not isinstance(value.get(key, ""), str) or len(value.get(key, "")) > FIELD_LIMIT:
            raise ValueError(f"Invalid Detective {key}")
    return deepcopy(value)


def evidence_is_current(evidence: dict, workspace: dict, repair_drafts: dict, public_hash: str) -> bool:
    """An evidence label is current only for the executed SQL and case version."""
    tab = evidence["tab"]
    draft = workspace["notebooks"].get(tab, repair_drafts.get(tab))
    return (evidence["fixture_hash"] == public_hash
            and evidence["query_hash"] == fingerprint(evidence["sql"])
            and draft == evidence["sql"])


def reopen_evidence_in_notebook(workspace: dict, evidence: dict) -> str | None:
    """Select the original draft or copy evidence to a free tab without overwriting work."""
    tab = evidence["tab"]
    notebooks = workspace["notebooks"]
    if tab in notebooks and notebooks[tab] == evidence["sql"]:
        return tab
    matching = next((name for name, sql in notebooks.items() if sql == evidence["sql"]), None)
    if matching is not None:
        return matching
    for number in range(1, 13):
        tab = f"notebook_{number}"
        if tab not in notebooks:
            notebooks[tab] = evidence["sql"]
            workspace.setdefault("notebook_titles", {})[tab] = f"Evidence {number}"
            return tab
    return None
