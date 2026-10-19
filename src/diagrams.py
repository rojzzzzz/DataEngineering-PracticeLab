"""Versioned, student-authored ERD data and its evaluation summary."""

from __future__ import annotations

from copy import deepcopy
import re
from typing import Any

KINDS = {"conceptual_erd", "logical_erd", "star_schema"}
CARDINALITIES = {"one", "many"}


def empty_diagram(kind: str) -> dict[str, Any]:
    if not isinstance(kind, str) or kind not in KINDS:
        raise ValueError("Unsupported diagram kind")
    return {"version": 1, "kind": kind, "entities": [], "relationships": []}


def validate_diagram(value: Any, kind: str | None = None) -> dict[str, Any]:
    if (
        not isinstance(value, dict)
        or type(value.get("version")) is not int
        or value.get("version") != 1
        or not isinstance(value.get("kind"), str)
        or value["kind"] not in KINDS
    ):
        raise ValueError("Invalid or unsupported ERD format")
    if kind and value["kind"] != kind:
        raise ValueError("Diagram kind does not match challenge")
    # Fill optional defaults on a copy so every consumer sees the same schema.
    value = deepcopy(value)
    entities, relationships = value.get("entities"), value.get("relationships")
    if not isinstance(entities, list) or not isinstance(relationships, list):
        raise ValueError("Diagram entities and relationships must be lists")
    if len(entities) > 100 or len(relationships) > 300:
        raise ValueError("Diagram is too large")
    entity_ids: set[str] = set()
    for entity in entities:
        if (
            not isinstance(entity, dict)
            or not _id(entity.get("id"))
            or not _label(entity.get("name"))
        ):
            raise ValueError("Every entity needs an ID and name")
        if entity["id"] in entity_ids:
            raise ValueError("Duplicate entity ID")
        entity_ids.add(entity["id"])
        position = entity.get("position")
        if not isinstance(position, dict) or not all(
            isinstance(position.get(axis), (int, float))
            and not isinstance(position.get(axis), bool)
            and abs(position[axis]) < 100000
            for axis in ("x", "y")
        ):
            raise ValueError("Invalid entity position")
        if (
            not isinstance(entity.get("annotation", ""), str)
            or len(entity.get("annotation", "")) > 1000
        ):
            raise ValueError("Invalid entity annotation")
        if not isinstance(entity.get("role", "entity"), str) or entity.get(
            "role", "entity"
        ) not in {"entity", "table", "fact", "dimension"}:
            raise ValueError("Invalid entity role")
        fields = entity.get("fields", [])
        if not isinstance(fields, list) or len(fields) > 100:
            raise ValueError("Invalid entity fields")
        entity.setdefault("role", "entity")
        entity.setdefault("annotation", "")
        entity.setdefault("fields", [])
        field_ids: set[str] = set()
        for field in fields:
            if (
                not isinstance(field, dict)
                or not _id(field.get("id"))
                or not _label(field.get("name"))
                or not isinstance(field.get("data_type", ""), str)
                or len(field.get("data_type", "")) > 100
                or not isinstance(field.get("pk", False), bool)
                or not isinstance(field.get("fk", False), bool)
            ):
                raise ValueError("Invalid field")
            if field["id"] in field_ids:
                raise ValueError("Duplicate field ID")
            field_ids.add(field["id"])
            field.setdefault("data_type", "")
            field.setdefault("pk", False)
            field.setdefault("fk", False)
    relation_ids: set[str] = set()
    for relation in relationships:
        if (
            not isinstance(relation, dict)
            or not _id(relation.get("id"))
            or relation["id"] in relation_ids
        ):
            raise ValueError("Invalid relationship ID")
        relation_ids.add(relation["id"])
        if (
            not isinstance(relation.get("source"), str)
            or not isinstance(relation.get("target"), str)
            or relation["source"] not in entity_ids
            or relation["target"] not in entity_ids
            or relation["source"] == relation["target"]
        ):
            raise ValueError("Relationship endpoint is missing")
        if (
            not isinstance(relation.get("label", ""), str)
            or len(relation.get("label", "")) > 200
        ):
            raise ValueError("Invalid relationship label")
        relation.setdefault("label", "")
        for end in ("source", "target"):
            if (
                not isinstance(relation.get(f"{end}_cardinality"), str)
                or relation.get(f"{end}_cardinality") not in CARDINALITIES
                or not isinstance(relation.get(f"{end}_optional"), bool)
            ):
                raise ValueError("Invalid relationship cardinality or optionality")
            handle = relation.get(f"{end}_handle")
            allowed = ("right", "bottom") if end == "source" else ("left", "top")
            if handle is not None and handle not in allowed:
                raise ValueError("Invalid relationship handle")
    if "strokes" in value:
        strokes = value["strokes"]
        if not isinstance(strokes, list) or len(strokes) > 200:
            raise ValueError("Invalid drawing strokes (maximum 200)")
        stroke_ids: set[str] = set()
        for stroke in strokes:
            if (
                not isinstance(stroke, dict)
                or not _id(stroke.get("id"))
                or stroke["id"] in stroke_ids | entity_ids | relation_ids
                or not isinstance(stroke.get("color"), str)
                or not re.fullmatch(r"#[0-9a-fA-F]{6}", stroke["color"])
                or type(stroke.get("width")) not in (int, float)
                or not 1 <= stroke["width"] <= 12
            ):
                raise ValueError("Invalid drawing stroke")
            stroke_ids.add(stroke["id"])
            points = stroke.get("points")
            if not isinstance(points, list) or not 2 <= len(points) <= 2000:
                raise ValueError("Invalid drawing points")
            for point in [stroke.get("position"), *points]:
                if not isinstance(point, dict) or not all(
                    type(point.get(axis)) in (int, float)
                    and abs(point[axis]) < 100000
                    for axis in ("x", "y")
                ):
                    raise ValueError("Invalid drawing position or point")
    return value


def diagram_summary(value: dict[str, Any] | None) -> str:
    if not value:
        return "No ERD submitted."
    diagram = validate_diagram(value)
    if not diagram["entities"]:
        return (f"ERD has no structured entities; {len(diagram['strokes'])} freehand drawing strokes."
                if diagram.get("strokes") else "ERD is empty.")
    lines = [f"Diagram kind: {diagram['kind']}", "Entities:"]
    names = {e["id"]: e["name"] for e in diagram["entities"]}
    for entity in diagram["entities"]:
        role = entity.get("role", "entity")
        lines.append(
            f"- {entity['name']} [{role}]"
            + (f" — {entity['annotation']}" if entity.get("annotation") else "")
        )
        for field in entity.get("fields", []):
            flags = ", ".join(
                x
                for x, enabled in (("PK", field.get("pk")), ("FK", field.get("fk")))
                if enabled
            )
            lines.append(
                f"  - {field['name']}"
                + (f" {field['data_type']}" if field.get("data_type") else "")
                + (f" ({flags})" if flags else "")
            )
    lines.append("Relationships:")
    if not diagram["relationships"]:
        lines.append("- None")
    for relation in diagram["relationships"]:
        lines.append(
            f"- {names[relation['source']]} ({_endpoint_text(relation, 'source')}) -- "
            f"{names[relation['target']]} ({_endpoint_text(relation, 'target')})"
            + (f": {relation['label']}" if relation.get("label") else "")
        )
    if diagram.get("strokes"):
        lines.append(f"Freehand annotations: {len(diagram['strokes'])} drawing strokes (see diagram image).")
    return "\n".join(lines)


def _endpoint_text(relation: dict[str, Any], end: str) -> str:
    minimum = "0" if relation[f"{end}_optional"] else "1"
    maximum = "*" if relation[f"{end}_cardinality"] == "many" else "1"
    return f"{minimum}..{maximum}"


def _id(value: Any) -> bool:
    return isinstance(value, str) and 0 < len(value) <= 100


def _label(value: Any) -> bool:
    return isinstance(value, str) and len(value) <= 200
