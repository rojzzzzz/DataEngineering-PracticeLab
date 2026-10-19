"""Validate and normalize challenge-bank JSON without altering challenge bodies."""
from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path
from typing import Any
from src.diagrams import KINDS
from src.sql_models import check_exercise
from src.python_models import validate_exercise as validate_python_exercise
from src.detective_models import validate_detective_metadata

REQUIRED = ("id", "title", "type", "difficulty", "estimated_minutes", "rubric_ref", "student")
STUDENT_FIELDS = ("scenario", "requirements", "tasks", "constraints", "deliverables")


def validate_bank(source: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    if not isinstance(source, dict):
        raise ValueError("A challenge bank must be a JSON object")
    bank = json.loads(json.dumps(source))
    for field in ("bank", "rubrics", "prompt_templates"):
        if not isinstance(bank.get(field, {}), dict):
            raise ValueError(f"{field} must be an object")
    metadata = bank.get("bank", {})
    for field in ("challenge_families", "learning_paths"):
        values = metadata.get(field, [])
        if not isinstance(values, list) or any(not isinstance(value, dict) for value in values):
            raise ValueError(f"bank.{field} must be a list of objects")
    for path in metadata.get("learning_paths", []):
        if not isinstance(path.get("name"), str) or not isinstance(path.get("challenges", []), list):
            raise ValueError("Learning paths need a name and a challenges list")
    for field in ("topic_index", "prerequisite_graph"):
        if not isinstance(metadata.get(field, {}), dict):
            raise ValueError(f"bank.{field} must be an object")
        if any(not isinstance(values, list) for values in metadata.get(field, {}).values()):
            raise ValueError(f"bank.{field} values must be lists")
    if not isinstance(bank.get("mistake_categories", []), list) or any(not isinstance(v, str) for v in bank.get("mistake_categories", [])):
        raise ValueError("mistake_categories must be a list of strings")
    issues: list[dict[str, Any]] = []
    def issue(kind: str, message: str, **details: Any) -> None:
        issues.append({"kind": kind, "message": message, **details})

    challenges = bank.get("challenges")
    if not isinstance(challenges, list):
        raise ValueError("The top-level 'challenges' field must be an array")
    ids = [str(c.get("id", "")) for c in challenges if isinstance(c, dict)]
    id_counts = Counter(ids)
    id_set = set(ids)
    if bank.get("bank", {}).get("challenge_count") != len(challenges):
        old = bank.get("bank", {}).get("challenge_count")
        bank.setdefault("bank", {})["challenge_count"] = len(challenges)
        issue("derived_metadata_corrected", "bank.challenge_count corrected to actual array length", declared=old, actual=len(challenges))
    for cid, count in id_counts.items():
        if not cid or count > 1:
            issue("duplicate_or_missing_id", "Challenge IDs must be present and unique", challenge_id=cid, count=count)
    for i, c in enumerate(challenges):
        if not isinstance(c, dict):
            issue("invalid_challenge", "Challenge entry is not an object", index=i); continue
        try:
            if sum(c.get(field) is not None for field in ("sql_playground", "python_playground", "diagram_kind")) > 1:
                raise ValueError("Choose one primary format: SQL, Python or diagram.")
            if "sql_playground" in c:
                check_exercise(c["sql_playground"])
            if "data_quality_detective" in c:
                validate_detective_metadata(c["data_quality_detective"])
                if "sql_playground" not in c:
                    raise ValueError("Detective cases need SQL playground metadata")
            if c.get("python_playground") is not None:
                validate_python_exercise(c["python_playground"])
            if c.get("constructor_tasks") is not None:
                from src.constructor_artifacts import validate_tasks
                validate_tasks(c["constructor_tasks"])
        except ValueError as exc:
            raise ValueError(f"Challenge {c.get('id', i + 1)}: {exc}") from exc
        for field in ("id", "title", "type", "rubric_ref"):
            if not isinstance(c.get(field), str) or not c[field].strip():
                raise ValueError(f"Challenge {i + 1}: {field} must be a non-empty string")
        minutes = c.get("estimated_minutes")
        if type(minutes) not in (int, float) or not math.isfinite(minutes) or minutes <= 0:
            raise ValueError(f"Challenge {c['id']}: estimated_minutes must be positive and finite")
        for field in ("hints", "follow_up_complications", "artifacts_required"):
            values = c.get(field, [])
            if not isinstance(values, list) or any(not isinstance(v, str) for v in values):
                raise ValueError(f"Challenge {c['id']}: {field} must be a list of strings")
        internal = c.get("internal", {})
        if not isinstance(internal, dict) or not isinstance(internal.get("topics", []), list) or any(not isinstance(v, str) for v in internal.get("topics", [])):
            raise ValueError(f"Challenge {c['id']}: internal.topics must be a list of strings")
        for f in REQUIRED:
            if f not in c or c[f] in (None, ""):
                issue("missing_required_field", f"Missing required field: {f}", challenge_id=c.get("id"), field=f)
        if type(c.get("difficulty")) is not int or c["difficulty"] not in (1, 2, 3, 4, 5):
            issue("invalid_difficulty", "Difficulty must be an integer from 1 to 5", challenge_id=c.get("id"), value=c.get("difficulty"))
        if c.get("diagram_kind") is not None and (not isinstance(c["diagram_kind"],str) or c["diagram_kind"] not in KINDS):
            issue("invalid_diagram_kind", "Unsupported diagram kind", challenge_id=c.get("id"), value=c["diagram_kind"])
        if c.get("rubric_ref") not in bank.get("rubrics", {}):
            issue("unknown_rubric", "Challenge references an unknown rubric", challenge_id=c.get("id"), rubric_ref=c.get("rubric_ref"))
        if not isinstance(c.get("student"), dict):
            issue("missing_student_body", "Student-facing content must be an object", challenge_id=c.get("id"))
        else:
            for f in STUDENT_FIELDS:
                if f not in c["student"]:
                    issue("missing_student_field", f"Student field absent: {f}", challenge_id=c.get("id"), field=f)
                elif (f == "scenario" and not isinstance(c["student"][f], str)) or (f != "scenario" and (not isinstance(c["student"][f], list) or any(not isinstance(v, str) for v in c["student"][f]))):
                    raise ValueError(f"Challenge {c['id']}: invalid student.{f}")
        hints = c.get("hints", [])
        if hints and (not isinstance(hints, list) or len(hints) != 3):
            issue("hint_count", "Supplied hints should contain exactly three progressive levels", challenge_id=c.get("id"), actual=len(hints) if isinstance(hints,list) else None)
    for name, rubric in bank.get("rubrics", {}).items():
        if not isinstance(rubric, dict) or any(type(v) not in (int, float) or not math.isfinite(v) or v < 0 for v in rubric.values()):
            raise ValueError(f"Rubric {name}: categories must contain non-negative finite numbers")
        if not isinstance(rubric, dict) or sum(v for v in rubric.values() if isinstance(v, (int,float))) != 100:
            issue("rubric_total", "Rubric categories must total 100 points", rubric=name, total=sum(v for v in rubric.values() if isinstance(v,(int,float))) if isinstance(rubric,dict) else None)

    families = bank.get("bank", {}).get("challenge_families", [])
    actual_families = Counter(cid.split("-")[0] for cid in ids if cid)
    for fam in families:
        prefix, declared = fam.get("prefix"), fam.get("count")
        actual = actual_families.get(prefix, 0)
        if declared != actual:
            issue("family_count_mismatch", "Declared family count differs from actual challenge IDs", prefix=prefix, declared=declared, actual=actual)
            fam["count"] = actual
            issue("derived_metadata_corrected", "Declared family count recalculated from challenge IDs", prefix=prefix, previous=declared, actual=actual)

    for lp in bank.get("bank", {}).get("learning_paths", []):
        if isinstance(lp.get("challenges"), list):
            kept = [ref for ref in lp["challenges"] if isinstance(ref, str) and ref in id_set]
            for ref in lp["challenges"]:
                if not isinstance(ref, str) or ref not in id_set: issue("dangling_reference", "Removed reference to nonexistent challenge", location=f"learning_paths.{lp.get('name')}", reference=ref)
            lp["challenges"] = kept
    graph = bank.get("bank", {}).get("prerequisite_graph", {})
    if isinstance(graph, dict):
        for key, vals in list(graph.items()):
            if key not in id_set:
                issue("dangling_reference", "Removed prerequisite graph node for nonexistent challenge", location="prerequisite_graph", reference=key)
                del graph[key]
                continue
            if isinstance(vals, list):
                kept = [v for v in vals if isinstance(v, str) and v in id_set]
                for v in vals:
                    if not isinstance(v, str) or v not in id_set: issue("dangling_reference", "Removed reference to nonexistent challenge", location=f"prerequisite_graph.{key}", reference=v)
                graph[key] = kept
    topics = bank.get("bank", {}).get("topic_index", {})
    if isinstance(topics, dict):
        for topic, vals in list(topics.items()):
            if isinstance(vals, list):
                kept = [v for v in vals if isinstance(v, str) and v in id_set]
                for v in vals:
                    if not isinstance(v, str) or v not in id_set: issue("dangling_reference", "Removed reference to nonexistent challenge", location=f"topic_index.{topic}", reference=v)
                topics[topic] = kept
    templates = bank.get("prompt_templates", {})
    for name in ("student", "hint", "evaluation"):
        if not isinstance(templates.get(name), str) or not templates[name].strip():
            issue("prompt_template", "Missing or empty prompt template", template=name)
    invalid_diagrams = {finding.get("challenge_id") for finding in issues if finding["kind"] == "invalid_diagram_kind"}
    from src.capstone_models import validate_definition
    definitions = bank.get("capstones", [])
    if not isinstance(definitions, list) or any(not isinstance(d, dict) for d in definitions):
        raise ValueError("capstones must be a list of versioned definitions")
    if len({d.get("id") for d in definitions}) != len(definitions):
        raise ValueError("Capstone definition IDs must be unique")
    assigned = set()
    for definition in definitions:
        validate_definition(definition, challenges)
        if definition.get("rubric_ref") not in bank.get("rubrics", {}):
            raise ValueError("Capstone references an unknown rubric")
        assigned.update(s["challenge_id"] for s in definition["stages"])
    for challenge in challenges:
        if challenge.get("capstone") and challenge["id"] not in assigned:
            raise ValueError("Capstone stage has no matching project definition")
    valid_count=0
    for c in challenges:
        if not isinstance(c,dict): continue
        student=c.get("student")
        if (all(f in c and c[f] not in (None,"") for f in REQUIRED)
            and isinstance(c.get("id"),str) and id_counts[c["id"]]==1
            and type(c.get("difficulty")) is int and c["difficulty"] in (1,2,3,4,5)
            and c["id"] not in invalid_diagrams
            and c.get("rubric_ref") in bank.get("rubrics",{})
            and isinstance(student,dict) and all(f in student for f in STUDENT_FIELDS)):
            valid_count+=1
    report = {"json_syntax": "valid", "source_challenge_count": len(challenges), "declared_challenge_count": source.get("bank", {}).get("challenge_count"), "normalized_challenge_count": len(challenges), "actual_family_counts": dict(actual_families), "rubric_totals": {k: sum(v.values()) for k,v in bank.get("rubrics", {}).items() if isinstance(v,dict) and all(isinstance(n,(int,float)) for n in v.values())}, "duplicate_ids": [cid for cid,n in id_counts.items() if not cid or n > 1], "issues": issues, "issue_count": len(issues), "valid_challenges": valid_count}
    return bank, report


def validate_file(source_path: Path, output_path: Path, report_path: Path) -> dict[str, Any]:
    source = json.loads(source_path.read_text(encoding="utf-8"))
    normalized, report = validate_bank(source)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(normalized, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return report
