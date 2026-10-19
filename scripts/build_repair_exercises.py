"""Public repair inputs only. Expected diagnoses/solutions live in test fixtures."""
from copy import deepcopy
from src.diagrams import empty_diagram, validate_diagram
from src.pipeline_models import empty_document, validate_document
from src.mock_models import example_recipe


def star_starter():
    value = empty_diagram("star_schema")
    definitions = [
        ("sales", "fact_sales", "fact", "Grain: one row per order. Loader emits one row per order line.",
         [("order_id", "bigint", True, False), ("line_no", "integer", True, False), ("product_key", "bigint", False, True), ("net_amount", "decimal(12,2)", False, False)]),
        ("product", "dim_product", "dimension", "Keep current category and brand; overwrite attributes during the daily load.",
         [("product_key", "bigint", True, False), ("sku", "text", False, False), ("category", "text", False, False)]),
        ("promotion", "dim_promotion", "dimension", "An order line may be associated with multiple promotions. Reports sum net_amount by promotion.",
         [("promotion_key", "bigint", True, False), ("campaign", "text", False, False)]),
    ]
    for index, (identity, name, role, annotation, fields) in enumerate(definitions):
        value["entities"].append({"id": identity, "name": name, "role": role, "annotation": annotation,
            "position": {"x": 80 + index * 370, "y": 100}, "fields": [
                {"id": name, "name": name, "data_type": dtype, "pk": pk, "fk": fk} for name, dtype, pk, fk in fields]})
    value["relationships"] = [
        {"id": "product-sales", "source": "product", "target": "sales", "label": "product sales", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False},
        {"id": "sales-promotions", "source": "sales", "target": "promotion", "label": "applied campaigns", "source_cardinality": "many", "target_cardinality": "many", "source_optional": False, "target_optional": True}]
    return validate_diagram(value)


def _native(identity, kind, x, y, width=230, height=110, **extra):
    return {"id": identity, "type": kind, "x": x, "y": y, "width": width, "height": height,
        "angle": 0, "strokeColor": "#315249", "backgroundColor": "#d0ebff" if kind == "rectangle" else "transparent",
        "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid", "roughness": 0, "opacity": 100,
        "groupIds": [], "frameId": None, "roundness": None, "seed": 1, "version": 1, "versionNonce": 1,
        "isDeleted": False, "boundElements": None, "updated": 1, "link": None, "locked": False, **extra}


def pipeline_starter():
    value = empty_document("Nightly orders ingestion")
    blocks = [("source", "Orders API", "source", {"access": "api"}),
              ("fetch", "Read nightly changes", "ingestion", {"scope": "incremental", "watermark": "Persist next cursor before fetching page", "schedule": "02:00 UTC"}),
              ("load", "Append to warehouse", "storage", {"write_mode": "append"}),
              ("report", "Publish daily orders", "destination", {})]
    for i, (identity, label, kind, settings) in enumerate(blocks):
        value["elements"].append(_native(identity, "rectangle", i * 310, 120,
            boundElements=[{"id": identity + "-label", "type": "text"}],
            customData={"pipeline": {"version": 1, "kind": kind, "settings": settings}}))
        value["elements"].append(_native(identity + "-label", "text", i * 310 + 12, 156, 206, 45,
            text=label, originalText=label, fontSize=18, fontFamily=2, textAlign="center", verticalAlign="middle",
            containerId=identity, autoResize=True, lineHeight=1.25))
        if i:
            value["elements"].append(_native("flow-" + str(i), "arrow", (i-1)*310+230, 175, 80, 0,
                points=[[0, 0], [80, 0]], lastCommittedPoint=None, startArrowhead=None, endArrowhead="arrow",
                startBinding={"elementId": blocks[i-1][0], "focus": 0, "gap": 1},
                endBinding={"elementId": identity, "focus": 0, "gap": 1},
                customData={"pipeline": {"version": 1, "kind": "data-flow", "settings": {}}}))
    value["notes"] = "Orchestrator: on any task failure retry the entire workflow up to three times. Publish after the append task completes."
    return validate_document(value)


def mock_starter():
    recipe = example_recipe("Customers / orders")
    # Stable IDs make builder output reproducible without storing any answer key.
    mapping = {}
    for table in recipe["tables"]:
        mapping[table["id"]] = table["name"]
        for field in table["fields"]:
            mapping[field["id"]] = table["name"] + "-" + field["name"]
    for table in recipe["tables"]:
        table["id"] = mapping[table["id"]]
        table["rows"] = 100 if table["name"] == "customers" else 1000
        for field in table["fields"]:
            field["id"] = mapping[field["id"]]
            if field.get("reference"):
                field["reference"] = None
                field["unresolved_fk"] = True
            if field["name"] == "status":
                field["generator"] = {"kind": "choice", "values": ["completed", "pending", "cancelled"], "weights": [10, 10, 80]}
            if field["name"] == "amount":
                field["generator"] = {"kind": "constant", "value": "49.99"}
    return {"recipe": recipe, "recipe_revision": 0, "generation": None}


def build(source):
    from scripts.build_constructor_exercises import new_challenge, slot
    bank = deepcopy(source)
    specifications = [
        ("REP-001", "Repair a retail star schema", 30, "diagram", "star", "Retail star schema", star_starter(),
         "Finance sees different retail totals when campaign filters are added, and historical category reports change after catalog refreshes. Review the supplied design against the reporting contract.",
         ["Report net sales at order-line grain and reconcile to source line totals.", "A line may have several promotions. Campaign reporting must state an allocation policy that prevents inflated totals.", "Historical reporting must retain product attributes as they were when the sale occurred."],
         ["Trace one source order with two lines through the proposed fact.", "Follow one line with two campaigns into grouped totals; explain an allocation policy.", "Describe how a category change affects old sales, key lookup and effective dates."],
         "A promotion is corrected after the accounting month closes. Explain reconciliation and restatement policy.", ["dimensional_modeling", "grain", "historical_data"]),
        ("REP-002", "Repair a nightly ingestion pipeline", 35, "pipeline", "pipeline", "Nightly ingestion pipeline", pipeline_starter(),
         "A nightly orders feed sometimes loses a page after a crash and sometimes duplicates warehouse rows after a retry. Analysts also report unexplained gaps between source and published totals.",
         ["Read a paginated API incrementally; crashes can occur before or after any network call or warehouse commit.", "Repeated delivery must not duplicate published orders; preserve a restartable boundary.", "Keep malformed records available for investigation, reconcile source/read/accepted/rejected/published counts, and gate publication."],
         ["Walk a crash through the fetch, durable write and cursor boundaries.", "Describe which units can be retried safely and how repeated rows are identified.", "Trace malformed and missing rows through reconciliation and the publication decision."],
         "The source backfills an older order after its original cursor has passed. Extend the recovery policy.", ["pipelines", "idempotency", "data_quality"]),
        ("REP-003", "Repair a customer/order test dataset", 25, "mock", "dataset", "Customer/order recipe", mock_starter(),
         "A customer/order fixture cannot yet generate successfully. Downstream tests rarely exercise normal completed orders or varied monetary values. Review the supplied recipe against the test contract.",
         ["Generate 100 customers and 1,000 orders with a fixed seed. Every order must reference an existing customer.", "Target completed/pending/cancelled status probabilities of 70/20/10; distinguish configured weights from observations.", "Order amounts must vary within 1.00–500.00 with two decimal places. Preserve single-column non-null keys."],
         ["Inspect references and unresolved mapping controls before generating.", "Check configured generators against the stated distribution and amount requirements.", "Generate the current recipe, inspect manifest and bounded samples, and propose full-dataset integrity and distribution checks."],
         "Add nullable delivery notes at 20% probability and describe how you would verify observed null rates.", ["synthetic_data", "referential_integrity", "reproducibility"]),
    ]
    for identity, title, minutes, tool, slot_id, label, starter, scenario, requirements, hints, complication, topics in specifications:
        if any(c["id"] == identity for c in bank["challenges"]):
            continue  # Local definitions, including intentional edits, belong to the author.
        extra = {"kind": "star_schema"} if tool == "diagram" else {}
        challenge = new_challenge(identity, title, minutes, "repair_review", scenario, requirements,
            ["Inspect the original supplied design and diagnose departures from the business contract.",
             "Save a substantive repair in the linked workspace.", "Explain your diagnosis, verification plan and tradeoffs; alternative defensible solutions are welcome."],
            ["Saved repaired design" + (" and successful current generation evidence" if tool == "mock" else ""),
             "Written diagnosis, repair decisions, verification reasoning and tradeoffs"], hints,
            [slot(slot_id, tool, label, starter=starter, requires_changes=True,
                  instructions="Inspect the original reference, save your repair, and write your diagnosis in the attempt answer. Presence checks detect unchanged submissions; rubric review assesses the repair.", **extra)], topics)
        challenge["follow_up_complications"] = [complication]
        bank["challenges"].append(challenge)
    bank["rubrics"].setdefault("repair_review", {"diagnosis": 25, "repair_quality": 40, "verification_reasoning": 25, "tradeoffs": 10})
    meta = bank["bank"]
    repairs = [c for c in bank["challenges"] if c["id"].startswith("REP-")]
    meta.update(version=meta.get("version", "0.6.0") if bank.get("capstones") else "0.6.0", challenge_count=len(bank["challenges"]))
    if not any(f["prefix"] == "REP" for f in meta["challenge_families"]):
        meta["challenge_families"].append({"prefix": "REP", "name": "Repair", "count": len(repairs)})
    meta["type_conventions"]["families"]["REP"] = "Repair"
    meta["type_conventions"]["types_in_family"]["REP"] = ["MODEL"]
    if not any(p["name"] == "Repair" for p in meta["learning_paths"]):
        meta["learning_paths"].append({"name": "Repair", "challenges": [c["id"] for c in repairs]})
    for challenge in repairs:
        meta["prerequisite_graph"].setdefault(challenge["id"], [])
        for topic in ["repair", *challenge["internal"]["topics"]]:
            refs = meta["topic_index"].setdefault(topic, [])
            if challenge["id"] not in refs:
                refs.append(challenge["id"])
    return bank
