"""Restricted test-only repair guidance and defensible example solutions.

Never import this module from student UI, public builders or prompt code.
"""
from copy import deepcopy
from scripts.build_repair_exercises import _native

EXPECTED_DEFECTS = {
    "REP-001": ["Contradictory order/order-line grain", "Unallocated many-to-many campaigns multiply revenue", "Overwritten product attributes erase history"],
    "REP-002": ["Cursor committed before durable ingestion", "Workflow-wide retries duplicate appends", "No quarantine/reconciliation publication controls"],
    "REP-003": ["Unmapped customer FK", "Wrong status weights", "Constant rather than varied order amount"],
}


def repaired(identity, starter):
    p = deepcopy(starter)
    if identity == "REP-001":
        sales, product, promotion = p["entities"]
        sales["annotation"] = "One row per order line, unique (order_id, line_no). Net amount reconciles to source lines."
        product["annotation"] = "SCD2: surrogate product_key per version, unique sku/effective_from. Lookup sale time in [effective_from,effective_to); retain prior versions."
        for name in ("effective_from", "effective_to"):
            product["fields"].append({"id": name, "name": name, "data_type": "timestamp", "pk": False, "fk": False})
        bridge = {"id": "allocation", "name": "promotion_allocation", "role": "fact", "position": {"x": 400, "y": 500},
            "annotation": "One row per line/campaign. Weights per line sum to 1, including an unattributed campaign when needed; allocated_amount=line net_amount*weight. Reconcile grouped allocated amounts to line totals.",
            "fields": [{"id": n, "name": n, "data_type": t, "pk": pk, "fk": fk} for n, t, pk, fk in (
                ("order_id", "bigint", True, True), ("line_no", "integer", True, True),
                ("promotion_key", "bigint", True, True), ("weight", "decimal(8,6)", False, False), ("allocated_amount", "decimal(12,2)", False, False))]}
        p["entities"].append(bridge)
        p["relationships"] = [p["relationships"][0],
            {"id": "line-allocations", "source": "sales", "target": "allocation", "label": "line allocation", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False},
            {"id": "campaign-allocations", "source": "promotion", "target": "allocation", "label": "campaign allocation", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False}]
    elif identity == "REP-002":
        fetch = next(e for e in p["elements"] if e["id"] == "fetch")
        fetch["customData"]["pipeline"]["settings"]["watermark"] = "Advance durable cursor after accepted/rejected records commit with page receipt; replay the last uncommitted page."
        next(e for e in p["elements"] if e["id"] == "load")["customData"]["pipeline"]["settings"]["write_mode"] = "Idempotent merge by order_id/source_version with durable page receipt"
        for identity, kind in (("quarantine", "storage"), ("reconcile", "quality")):
            p["elements"].append(_native(identity, "rectangle", 500, 400 if kind == "storage" else 600,
                customData={"pipeline": {"version": 1, "kind": kind, "settings": {"policy": "Retain raw payload/error/source cursor" if kind == "storage" else "read=accepted+rejected; reconcile published rows and amounts; block publication on mismatch"}}}))
        p["notes"] = "Retry individual page fetch/write transactions with bounded backoff. Route rejected rows to durable quarantine. Reconcile source/read/accepted/rejected/merged totals before publishing a committed batch pointer. Test crashes before/after commit and cursor update and repeat the same page; verify no gaps or duplicates."
    else:
        customers, orders = p["recipe"]["tables"]
        for field in orders["fields"]:
            if field["name"] == "customer_id":
                field.pop("unresolved_fk", None)
                field["reference"] = {"table_id": customers["id"], "field_id": customers["fields"][0]["id"], "relation": "many-to-one"}
            elif field["name"] == "status":
                field["generator"]["weights"] = [70, 20, 10]
            elif field["name"] == "amount":
                field["generator"] = {"kind": "number", "min": "1.00", "max": "500.00"}
        p["recipe_revision"] = 1
    return p
