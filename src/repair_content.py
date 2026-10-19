"""Tool-aware unchanged-submission checks; these never assess repair quality."""
import json
from src.constructor_models import fingerprint


def _ordered(items):
    return sorted(items, key=lambda item: json.dumps(item, sort_keys=True))


def _topology(nodes, edges):
    """ID-independent directed neighborhoods distinguish identically labeled nodes."""
    labels = {key: fingerprint(value) for key, value in nodes.items()}
    for _ in range(min(len(nodes), 6)):
        adjacent = {key: [] for key in nodes}
        for source, relation, target in edges:
            if source in nodes and target in nodes:
                adjacent[source].append(("out", relation, labels[target]))
                adjacent[target].append(("in", relation, labels[source]))
        labels = {key: fingerprint([nodes[key], sorted(adjacent[key])]) for key in nodes}
    return sorted(labels.values())


def substantive_fingerprint(tool, payload):
    if tool == "diagram":
        nodes = {e["id"]: {k: e.get(k, "") for k in ("name", "role", "annotation")} |
                 {"fields": _ordered([{k: f.get(k, False if k in ("pk", "fk") else "")
                                        for k in ("name", "data_type", "pk", "fk")} for f in e.get("fields", [])])}
                 for e in payload["entities"]}
        edges = [{**{k: v for k, v in r.items() if k in ("label", "source_cardinality", "target_cardinality", "source_optional", "target_optional")},
                  "source": nodes[r["source"]], "target": nodes[r["target"]]} for r in payload["relationships"]]
        content = {"kind": payload["kind"], "entities": _ordered(list(nodes.values())), "relationships": _ordered(edges)}
    elif tool == "pipeline":
        elements = [e for e in payload["elements"] if not e.get("isDeleted") and e.get("type") != "selection"]
        nodes = {e["id"]: {"type": e["type"], "text": e.get("originalText", e.get("text", "")),
                          "engineering": (e.get("customData") or {}).get("pipeline", {})} for e in elements}
        links = [(e["id"], key, (e.get(key) or {}).get("elementId")) for e in elements
                 for key in ("startBinding", "endBinding") if e.get(key)]
        links.extend((e["id"], "container", e["containerId"]) for e in elements if e.get("containerId"))
        content = {"notes": payload.get("notes", ""), "elements": _ordered(list(nodes.values())), "topology": _topology(nodes, links)}
    elif tool == "mock":
        recipe = payload["recipe"]
        tables = {t["id"]: t["name"] for t in recipe["tables"]}
        fields = {(t["id"], f["id"]): f["name"] for t in recipe["tables"] for f in t["fields"]}
        content = {k: recipe.get(k) for k in ("seed", "locale", "output")}
        normalized = []
        for table in recipe["tables"]:
            normalized_fields = []
            for field in table["fields"]:
                value = {k: field.get(k) for k in ("name", "type", "primary_key", "null_pct", "max_length", "precision", "scale", "generator", "unresolved_fk")}
                ref = field.get("reference")
                value["reference"] = ({"table": tables.get(ref.get("table_id")),
                    "field": fields.get((ref.get("table_id"), ref.get("field_id"))), "relation": ref.get("relation")} if ref else None)
                normalized_fields.append(value)
            normalized.append({"name": table["name"], "rows": table["rows"], "fields": _ordered(normalized_fields)})
        content["tables"] = _ordered(normalized)
        content["pending_mappings"] = _ordered([{k: tables.get(v, v) if k in ("source", "target") else v
             for k, v in m.items() if k != "id"} for m in recipe.get("pending_mappings", [])])
    else:
        content = {k: payload.get(k) for k in ("sql", "plan", "reviewed_sql", "settings")}
    return fingerprint(content)
