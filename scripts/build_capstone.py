"""Append the public coffee project; never replace existing cases or stage edits."""
from copy import deepcopy

SCOPE = ("Northstar Coffee is a fictional subscription roastery. Customers hold subscriptions for coffee products; orders contain product lines. "
         "Design for customers, subscriptions, products, orders and order lines using names of your choice. "
         "Report USD only, for orders placed from 2026-01-01 through 2026-03-31 (the upper SQL boundary is 2026-04-01). "
         "Order statuses are fulfilled, pending and cancelled. Only fulfilled orders contribute revenue; the reporting month is the order-placement month. "
         "Line revenue is quantity × the line's unit price: quantities are positive integers 1–5 and unit prices are positive exact decimals with two places. "
         "Exclude refunds, taxes, shipping charges and execution of historical slowly changing dimensions. "
         "Use single-column integer or UUID keys and an acyclic foreign-key graph. Generator values are independent unless supported by explicit foreign-key generators; "
         "do not assert unsupported correlations between fields, dates, prices or redundant relationships. Document assumptions and limitations.")


def build(source):
    from scripts.build_constructor_exercises import new_challenge, slot
    bank = deepcopy(source)
    definitions = bank.setdefault("capstones", [])
    specifications = [
        ("business", "COF-001", "Understand the coffee business", 35, [], "diagram", "conceptual", "conceptual_erd",
         ["Business processes", "Relationships and cardinalities", "Assumptions and scope", "KPI definitions"],
         ["Build a conceptual model of the subscription lifecycle, ordering and product sales.", "Define fulfilled revenue, product revenue ranking and reconciliation at business level."],
         ["Begin with business events rather than physical columns.", "Clarify which relationships can be optional, and why.", "Define reporting dates, cancellation behavior and each KPI's denominator or aggregation boundary."]),
        ("operational", "COF-002", "Design the operational coffee model", 55, ["business"], "diagram", "logical", "logical_erd",
         ["Conceptual-to-logical mapping", "Keys and integrity rules", "Generator compatibility and assumptions"],
         ["Create the logical model yourself from the conceptual reference, with named fields, types, keys and relationships.",
          "Cover every required business object, use supported single-column keys, and keep foreign keys acyclic.",
          "Avoid redundant links that imply guarantees the independent generators cannot honor; explain the chosen access paths."],
         ["Map each business object and event to a logical responsibility.", "Check parent-key types and the direction of every foreign key.", "Explain which integrity rules are representable by generators and which require production validation."]),
        ("data", "COF-003", "Build representative coffee data", 60, ["operational"], "mock", "recipe", None,
         ["Distributions and seed", "Integrity and representativeness", "Generator limitations and assumptions"],
         ["Explicitly use the saved logical model to create a recipe, resolve unsupported mappings, and configure generators.",
          "Include fulfilled, pending and cancelled orders, varied quantities and exact unit prices, and dates inside the reporting period.",
          "Generate successfully, then Save dataset for capstone SQL. Keep at most 10 tables, 40 columns/table, 10,000 total rows and 2 MiB of schema/rows. Never rely on preview samples as the dataset."],
         ["Start with small row counts and supported integer or UUID primary keys.", "Independent random values cannot enforce arbitrary cross-field business rules. Reconsider redundant links or document limitations.", "Inspect the manifest and examples, then explicitly save the complete typed dataset before temporary files expire."]),
        ("analytical", "COF-004", "Design the analytical coffee model", 45, ["operational"], "diagram", "star", "star_schema",
         ["Fact grain and measure behavior", "Source-to-target mapping", "Aggregation and design tradeoffs"],
         ["Design the star yourself, using the logical model as a read-only source reference.",
          "State fact grain, dimensional joins, additive/nonadditive behavior and the treatment of fulfilled and cancelled orders.",
          "Map operational quantities, line prices, order dates and product identity to the analytical calculation without multiplying revenue."],
         ["Write the grain in one sentence before choosing measures.", "Trace a two-line order and a product appearing in several orders.", "Show each source-to-target expression and explain how joins preserve line totals."]),
        ("queries", "COF-005", "Query and reconcile the coffee dataset", 55, ["data", "analytical"], "sql_execution", "queries", None,
         ["Monthly revenue interpretation", "Product ranking interpretation", "Reconciliation reasoning", "Diagnostic findings and limitations"],
         ["Run all four SQL tasks successfully against the selected saved operational dataset.",
          "Use SELECT/CTEs to express your proposed analytical mapping; no warehouse is materialized.",
          "Interpret outputs, empty results, unexpected duplication and reconciliation differences. Successful execution is not a correctness grade."],
         ["Inspect the saved schema and complete row counts, then trace joins at your declared grain.", "Apply the fulfilled-status and reporting-period contract consistently.", "Compute source and analytical totals independently, and diagnose lost or multiplied lines before claiming reconciliation."]),
        ("operations", "COF-006", "Design operations and defend the coffee solution", 50, ["queries"], "pipeline", "pipeline", None,
         ["Ingestion and transformation", "Quality, recovery and privacy", "Grain and cross-stage mappings", "Reconciliation and operational limitations"],
         ["Draw ingestion, transformation, quality checks, recovery boundaries and privacy controls for production.",
          "Review every saved stage and defend consistency of business KPIs, operational relationships, generated data, analytical grain and SQL mappings.",
          "Explain reconciliation, generator limitations and what would need independent production verification. The pipeline diagram is a design, not executable orchestration."],
         ["Separate data flow, control flow, quality gates and sensitive data boundaries.", "Walk through a partial failure, retry and recovery using durable identities.", "Use the final defense to connect grain, source-to-target expressions, reconciliation and the limits of synthetic data."]),
    ]
    stages = []
    for sid, cid, title, minutes, parents, tool, output_id, kind, sections, requirements, hints in specifications:
        slots = [] if tool == "sql_execution" else [slot(output_id, tool, title.replace("the coffee ", ""), **({"kind": kind} if kind else {}),
            instructions="Save this stage's authored deliverable; inspect copied upstream references and explain decisions in the written sections.")]
        c = new_challenge(cid, title, minutes, "coffee_capstone", SCOPE, requirements,
            ["Inspect the business contract and available upstream references.", "Save the required deliverables and complete each written section.", "Review evidence and mark this stage complete before dependent work."], sections, hints, slots,
            ["connected_capstone", "coffee_subscriptions", "data_engineering"])
        if not slots:
            c.pop("constructor_tasks")
        c["capstone"] = {"definition_id": "coffee-roastery", "stage_id": sid, "label": "Connected Capstone · Subscription Coffee Roastery"}
        c["follow_up_complications"] = ["Explain how a later change to business requirements would affect this stage and its dependents."]
        if sid == "queries":
            c["type"] = "SQL"
            c["dataset_sql"] = {"version": 1, "tasks": [
                {"id": "monthly", "title": "Monthly fulfilled revenue", "description": "Calculate USD line revenue by order-placement month for fulfilled orders in January–March 2026, using SELECT/CTEs for your analytical mapping."},
                {"id": "products", "title": "Product revenue ranking", "description": "Rank products by fulfilled line revenue within the same period. State tie handling and aggregation grain."},
                {"id": "reconciliation", "title": "Source and analytical reconciliation", "description": "Compare independently computed source-line totals with the proposed analytical calculation and expose any difference; explain agreement or disagreement."},
                {"id": "diagnostics", "title": "Relationship and duplication diagnostics", "description": "Diagnose missing relationships or unexpected join duplication at line grain. Interpret empty results rather than treating them as proof of correctness."}]}
        if not any(existing["id"] == cid for existing in bank["challenges"]):
            bank["challenges"].append(c)
        inputs = []
        if sid == "operational":
            inputs = [{"id": "business-model", "source_stage": "business", "source_slot": "conceptual", "tool": "diagram"}]
        elif sid in ("data", "analytical"):
            inputs = [{"id": "operational-model", "source_stage": "operational", "source_slot": "logical", "tool": "diagram", "mode": "recipe" if sid == "data" else "reference"}]
        elif sid == "queries":
            inputs = [{"id": "operational-data", "source_stage": "data", "source_slot": "dataset", "tool": "dataset", "mode": "dataset"},
                      {"id": "analytical-model", "source_stage": "analytical", "source_slot": "star", "tool": "diagram"}]
        elif sid == "operations":
            inputs = [{"id": "query-evidence", "source_stage": "queries", "source_slot": "queries", "tool": "sql_execution"}]
        outputs = [{"id": output_id, "tool": tool}]
        if sid == "data":
            outputs.append({"id": "dataset", "tool": "dataset"})
        stages.append({"id": sid, "challenge_id": cid, "prerequisites": parents, "inputs": inputs, "outputs": outputs, "written_sections": sections})
    definition = {"id": "coffee-roastery", "version": 1, "title": "Subscription Coffee Roastery", "estimated_minutes": 300,
                  "description": "One connected business system, from business concepts through data and SQL to operational defense.", "rubric_ref": "coffee_capstone", "stages": stages}
    if not any(d["id"] == definition["id"] for d in definitions):
        definitions.append(definition)
    bank["rubrics"].setdefault("coffee_capstone", {"business_model_coherence": 25, "data_design_reproducibility": 20,
        "sql_reconciliation_reasoning": 25, "operations_recovery": 20, "assumptions_defense": 10})
    meta = bank["bank"]
    meta.update(version="0.7.0", challenge_count=len(bank["challenges"]))
    if not any(f["prefix"] == "COF" for f in meta["challenge_families"]):
        meta["challenge_families"].append({"prefix": "COF", "name": "Connected coffee capstone stages", "count": 6})
    meta["type_conventions"]["families"]["COF"] = "Connected coffee capstone stages"
    meta["type_conventions"]["types_in_family"]["COF"] = ["MODEL", "SQL"]
    for stage in stages:
        meta["prerequisite_graph"].setdefault(stage["challenge_id"], [next(s["challenge_id"] for s in stages if s["id"] == p) for p in stage["prerequisites"]])
        for topic in ("connected_capstone", "coffee_subscriptions"):
            refs = meta["topic_index"].setdefault(topic, [])
            if stage["challenge_id"] not in refs:
                refs.append(stage["challenge_id"])
    return bank
