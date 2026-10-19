"""Copy diagram structure; entity relationships require explicit field mappings."""
import re
from src.diagrams import validate_diagram
from src.mock_models import new_recipe, new_field, uid


def diagram_recipe(diagram):
    diagram = validate_diagram(diagram)
    if diagram["kind"] == "conceptual_erd":
        raise ValueError("Conceptual ERDs are not eligible. Define fields and types in a logical ERD or star schema first.")
    value = new_recipe()
    value["tables"] = []
    entity_ids = {e["id"]: uid() for e in diagram["entities"]}
    for entity in diagram["entities"]:
        table = {"id": entity_ids[entity["id"]], "name": entity["name"], "rows": 1000, "fields": []}
        for source in entity["fields"]:
            original = source["data_type"]
            raw = original.lower().strip()
            kind = "unknown"
            if re.fullmatch(r"(tinyint|smallint|integer|int|bigint|int[248]|serial|bigserial)", raw):
                kind = "integer"
            elif raw in ("boolean", "bool"):
                kind = "boolean"
            elif raw in ("date",):
                kind = "date"
            elif raw in ("timestamp", "timestamptz", "timestamp with time zone", "datetime"):
                kind = "timestamp"
            elif raw in ("uuid",):
                kind = "uuid"
            elif re.fullmatch(r"(varchar|char|text|string)(\(\d+\))?", raw):
                kind = "string"
            elif re.fullmatch(r"(decimal|numeric)(\(\d+\s*,\s*\d+\))?", raw):
                kind = "decimal"
            field = new_field(source["name"], kind, source["pk"])
            field["source_type"] = original
            if kind == "decimal" and (match := re.search(r"\((\d+)\s*,\s*(\d+)\)", raw)):
                field["precision"], field["scale"] = map(int, match.groups())
            if kind == "string" and (match := re.search(r"\((\d+)\)", raw)):
                field["max_length"] = int(match.group(1))
            if source["fk"]:
                field["unresolved_fk"] = True
                field["generator"] = {"kind": "foreign_key"}
            table["fields"].append(field)
        value["tables"].append(table)
    value["pending_mappings"] = [{"id": uid(), "source": entity_ids[r["source"]], "target": entity_ids[r["target"]],
                                  "label": r["label"] or r["id"], "source_cardinality": r["source_cardinality"], "target_cardinality": r["target_cardinality"]}
                                 for r in diagram["relationships"]]
    return value
