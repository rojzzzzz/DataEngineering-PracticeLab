"""Apply the focused Constructor release after the existing bank generators.

Only the twelve named exercises and three additions are changed. SQL execution,
Detective and Python assessment metadata are left intact.
"""
from copy import deepcopy
import json
from pathlib import Path

from src.constructor_artifacts import sql_document
from src.json_validator import validate_bank

EXISTING = ("CM-001", "CM-002", "CM-003", "CM-004", "DM-002", "NORM-003", "ARCH-002", "ARCH-004", "INC-004", "LM-001", "BIZ-001", "BIZ-002")


def slot(identity, tool, label, required=True, **extra):
    return {"id": identity, "tool": tool, "label": label, "required": required, **extra}


def diagram(identity, label, kind):
    return slot(identity, "diagram", label, kind=kind, instructions="Save this model in its own workspace; explain modeling decisions in your written answer.")


def plan_fixture(after=False):
    # Fictional, one execution/loop. Root timing includes its child scan.
    scan = {"Node Type": "Index Scan" if after else "Seq Scan", "Relation Name": "orders", "Alias": "o",
            "Startup Cost": 0.4 if after else 0, "Total Cost": 2500 if after else 10000,
            "Plan Rows": 10000, "Plan Width": 8, "Actual Startup Time": .1 if after else .2,
            "Actual Total Time": 28 if after else 110, "Actual Rows": 10000, "Actual Loops": 1}
    if after:
        scan.update({"Index Name": "orders_created_at_idx", "Index Cond": "(created_at >= '2026-09-01'::date AND created_at < '2026-10-01'::date)"})
    else:
        scan.update({"Filter": "(date_trunc('month', created_at) = '2026-09-01'::timestamp)", "Rows Removed by Filter": 90000})
    return json.dumps([{"Plan": {"Node Type": "Aggregate", "Strategy": "Plain", "Startup Cost": 2525 if after else 10025,
                       "Total Cost": 2525.01 if after else 10025.01, "Plan Rows": 1, "Plan Width": 8,
                       "Actual Startup Time": 30 if after else 115, "Actual Total Time": 30.01 if after else 115.01,
                       "Actual Rows": 1, "Actual Loops": 1, "Plans": [scan]},
                       "Planning Time": .5 if after else .4, "Execution Time": 35 if after else 120}], indent=2)


def new_challenge(identity, title, minutes, rubric, scenario, requirements, tasks, deliverables, hints, slots, topics):
    return {"id": identity, "title": title, "type": "SQL" if identity.startswith("SQL") else "MODEL",
            "difficulty": 3, "estimated_minutes": minutes, "rubric_ref": rubric,
            "artifacts_required": ["prose", "constructor_evidence"],
            "student": {"scenario": scenario, "requirements": requirements, "tasks": tasks,
                        "constraints": ["Use fictional inputs only. Explain limitations; tool output alone is not verification."],
                        "deliverables": deliverables},
            "internal": {"domains": ["data_engineering"], "topics": topics,
                         "assessment_focus": "Assess reproducibility, explicit assumptions and defensible reasoning; local checks establish presence only."},
            "hints": hints, "follow_up_complications": ["Explain how changing the source contract would affect reproducibility."],
            "review_exercise": "Identify one assumption and describe evidence that could disprove it.",
            "constructor_tasks": {"version": 1, "slots": slots}}


def build(source):
    bank = deepcopy(source)
    by_id = {c["id"]: c for c in bank["challenges"]}
    for identity in EXISTING:
        c = by_id[identity]
        if not c.get("constructor_tasks"):
            from src.constructor_artifacts import fingerprint
            c["constructor_baseline_hash"] = fingerprint(c)
    specifications = {
        "CM-001": [diagram("conceptual", "Conceptual model", "conceptual_erd")],
        "CM-002": [diagram("conceptual", "Conceptual model", "conceptual_erd"), diagram("logical", "Logical model", "logical_erd")],
        "CM-003": [diagram("star", "Sales star schema", "star_schema")],
        "DM-002": [diagram("logical", "Attribution logical model", "logical_erd")],
        "NORM-003": [diagram("logical", "Normalized lending schema", "logical_erd")],
        "CM-004": [slot("pipeline", "pipeline", "Data-platform pipeline", instructions="Show sources, layers, marts, labeled flows, quality checks and privacy controls.")],
        "ARCH-002": [slot("pipeline", "pipeline", "Streaming pipeline", instructions="Include streaming, replay/recovery, latency targets and monitoring.")],
        "ARCH-004": [slot("pipeline", "pipeline", "CDC pipeline", instructions="Show per-source capture, merges/deletes, recovery, reconciliation and monitoring.")],
        "LM-001": [slot("ddl-review", "sql", "DDL formatting and inspection", False, instructions="Paste authored PostgreSQL DDL, format and inspect it. DDL remains required in the written answer; these utilities are optional.")],
    }
    for identity in ("BIZ-001", "BIZ-002"):
        specifications[identity] = [diagram("conceptual", "Conceptual model", "conceptual_erd"),
                                    diagram("logical", "Logical model", "logical_erd"), diagram("star", "Analytical star schema", "star_schema"),
                                    slot("sql-review", "sql", "Optional SQL review", False, instructions="Format or inspect authored DDL and analytical SQL. Include required SQL scripts in the written answer.")]
    incident_slots = []
    for after, name in ((False, "before"), (True, "after")):
        starter = sql_document()
        starter.update(sql=("SELECT sum(amount) FROM orders o WHERE created_at >= DATE '2026-09-01' AND created_at < DATE '2026-10-01';" if after else
                            "SELECT sum(amount) FROM orders o WHERE date_trunc('month', created_at) = TIMESTAMP '2026-09-01';"),
                       plan=plan_fixture(after), panel="Explain Plan")
        incident_slots.append(slot(name, "sql", f"Synthetic {name} plan and query", starter=starter,
                              required_inputs=["sql", "plan", "reviewed_sql"], required_actions=["explain", "visualize"],
                              instructions="Inspect this fictional plan and visualize the supplied SQL. Save your annotated/reviewed SQL and explain your diagnosis in the answer."))
    specifications["INC-004"] = incident_slots
    for identity, slots in specifications.items():
        c = by_id[identity]
        c["constructor_tasks"] = {"version": 1, "slots": slots}
        instruction = "Use Tools and deliverables for each separate model or pipeline; save required evidence before completing. Explain cross-artifact decisions in your answer."
        if instruction not in c["student"]["requirements"]:
            c["student"]["requirements"].append(instruction)
        c["estimated_minutes"] = max(c["estimated_minutes"], {"CM-002": 50, "CM-004": 45, "ARCH-002": 50, "ARCH-004": 50, "BIZ-001": 90, "BIZ-002": 100}.get(identity, c["estimated_minutes"]))
    incident = by_id["INC-004"]
    incident["title"] = "Investigate a Synthetic PostgreSQL Plan Regression"
    incident["estimated_minutes"] = 45
    incident["student"] = {
        "scenario": "Fictional training fixture: compare two PostgreSQL query variants over 100,000 orders, of which 10,000 fall in September 2026. Each row has non-null amount and created_at TIMESTAMP WITHOUT TIME ZONE; timestamps are interpreted as UTC. An index exists on created_at in both variants. Both compute the same monthly sum under this stated contract. Before uses date_trunc on the column; after uses a half-open range. The plans are synthetic observations, not results executed by this app.",
        "requirements": ["Inspect both synthetic plans and visualize each supplied query in its linked workspace.",
                         "Distinguish planner cost (arbitrary estimate units), measured execution time (120 ms before, 35 ms after) and monetary charges.",
                         "The fictional instance costs $0.40 per hour regardless of query count. No billing change is implied by these plans.",
                         "Compare the scan, rows removed, row estimates and timing; explain why measurements do not establish causality by themselves."],
        "tasks": ["Record evidence from each plan and query visualization.", "Calculate the observed time difference and percentage change.",
                  "Review both queries and propose a controlled PostgreSQL benchmark including output equivalence, caches, concurrency and repetitions.",
                  "Explain null/time-zone/boundary assumptions and propose monitoring that separates latency from spend."],
        "constraints": ["Synthetic fixture: no PostgreSQL execution is available.", "Planner node costs are cumulative estimates; do not add parent and child costs or equate them with dollars or milliseconds.",
                        "Conversion and visualization prove neither correctness nor performance."],
        "deliverables": ["Both saved SQL-tool artifacts with original SQL, supplied plans, plan inspection, visualization and final reviewed SQL", "Written diagnosis, measured comparison, semantic assumptions and verification plan"]}
    incident["hints"] = ["Identify which expressions can use the timestamp index under the supplied type contract.",
                           "Root execution timing includes child work. Compare 120 ms with 35 ms without adding node times.",
                           "The observed reduction is a fixture measurement. A controlled benchmark and separate billing data are needed for broader claims."]
    incident["internal"]["assessment_focus"] = "Separate planner estimates, synthetic timing and billing; reason from scan/predicate evidence and explicitly limit conclusions."
    by_id["LM-001"]["student"]["requirements"].append("Optional SQL utilities can format/inspect your PostgreSQL DDL; optionally copy CREATE TABLE definitions into Diagram Maker. Submit DDL even if you skip these tools.") if not any("Optional SQL utilities" in s for s in by_id["LM-001"]["student"]["requirements"]) else None
    bank["rubrics"].update({
        "mock_reproducibility": {"recipe_and_keys": 25, "generation_evidence": 25, "reproducibility": 20, "distribution_reasoning": 20, "clarity": 10},
        "mock_model_copy": {"logical_model": 25, "mapping_resolution": 25, "generation_evidence": 25, "integrity_reasoning": 15, "clarity": 10},
        "dialect_review": {"semantic_risks": 35, "reviewed_sql": 25, "conversion_and_visualization_evidence": 20, "verification_plan": 15, "clarity": 5},
        "constructor_plan_review": {"plan_evidence": 25, "measurement_interpretation": 25, "semantic_review": 20, "verification_and_monitoring": 20, "clarity": 10},
        "constructor_model_mapping": {"conceptual_model": 25, "logical_model": 25, "mapping_and_consistency": 30, "justification": 15, "clarity": 5},
    })
    incident["rubric_ref"] = "constructor_plan_review"
    by_id["CM-002"]["rubric_ref"] = "constructor_model_mapping"
    original = sql_document()
    original.update(sql="SELECT date_trunc('month', ordered_at)::date AS month, count(*) FILTER (WHERE status = 'paid') AS paid_orders, sum(amount::numeric(12,2)) AS revenue FROM orders WHERE ordered_at >= TIMESTAMP '2026-01-01 00:00:00' GROUP BY 1 ORDER BY 1;",
                    panel="Convert")
    additions = [
        new_challenge("MOCK-001", "Reproducible Customer and Order Fixtures", 40, "mock_reproducibility",
                      "Build fictional customer/order fixtures for a test harness. There are 100 customers and 1,000 orders. Each order belongs to one customer; optional customer contact and order notes may be absent.",
                      ["Use single-column integer keys and a fixed seed of 31415.", "Use weighted order statuses: completed 70, pending 20, cancelled 10.",
                       "Set an optional string field to 25% null probability. Keep primary and foreign keys non-null.", "Generate successfully; distinguish target probabilities from observed frequencies."],
                      ["Build the related tables and configure generators.", "Generate twice with the same recipe and describe reproducibility boundaries.", "Explain referential integrity and compare observed status/null distributions with configured probabilities."],
                      ["Saved recipe", "Successful generation manifest and bounded samples", "Reasoning about key integrity, reproducibility and observed distributions"],
                      ["Use sequential parent keys and an explicit foreign-key generator.", "Weights describe probabilities, not guaranteed exact counts.", "The manifest contains actual full-dataset null counts; bounded samples cannot prove the full status distribution."],
                      [slot("fixtures", "mock", "Customer/order generation", instructions="Save the recipe and generate successfully with the current revision. Dataset ZIPs remain downloadable outputs.")],
                      ["synthetic_data", "referential_integrity", "reproducibility"]),
        new_challenge("MOCK-002", "Logical Model to Synthetic Dataset", 50, "mock_model_copy",
                      "A fictional workshop records customers and their service orders. One customer can have many orders; each order has exactly one customer. Design a small logical model, then derive test data from a copy.",
                      ["Use an acyclic schema with single-column integer or UUID keys; no composite keys.", "Include a nullable optional field and choose a fixed seed.", "Copy the saved logical model into the attempt's recipe, explicitly resolve types, key mappings and generators."],
                      ["Build and save the logical model.", "Open the recipe and explicitly copy the model from this attempt.", "Resolve unsupported mappings, generate data and explain which modeling decisions the recipe can represent."],
                      ["Saved logical model", "Saved recipe with successful generation manifest and bounded samples", "Mapping, reproducibility and integrity reasoning"],
                      ["Give each relationship one parent key and one child field.", "The copy may leave unknown types or entity-level relationships unresolved.", "Resolve each mapping explicitly; editing the original model does not update the recipe automatically."],
                      [diagram("logical", "Workshop logical model", "logical_erd"), slot("dataset", "mock", "Model-derived generation", instructions="Explicitly copy your logical model using Examples, recipes & Diagram Maker, resolve mappings, then generate.")],
                      ["logical_model", "synthetic_data", "referential_integrity"]),
        new_challenge("SQL-013", "Review a PostgreSQL to DuckDB Dialect Migration", 40, "dialect_review",
                      "Migrate the supplied fictional PostgreSQL reporting query to DuckDB using conversion and manual review. orders has ordered_at TIMESTAMP WITHOUT TIME ZONE interpreted as UTC, status TEXT, and nullable amount NUMERIC(12,2). No execution service is supplied for this exercise.",
                      ["Retain the original PostgreSQL SQL and conversion result.", "Save final reviewed DuckDB SQL and a query visualization.", "Discuss timestamp/time-zone behavior, numeric casts/overflow/rounding, FILTER and null/empty-group semantics."],
                      ["Convert the original SQL from PostgreSQL to DuckDB.", "Review and edit final SQL, recording changes in the answer.", "Visualize the reviewed query and explain semantic risks and an execution-based verification plan without claiming it ran."],
                      ["Original SQL, conversion result, final reviewed SQL and visualization in the linked workspace", "Written semantic review and proposed test cases"],
                      ["A successful conversion only means the converter produced output.", "Review month boundaries, null amounts and decimal overflow explicitly.", "Propose independent equivalence checks using edge-case fixtures on both engines; visualization is structural evidence."],
                      [slot("migration", "sql", "Dialect migration review", starter=original, required_inputs=["sql", "reviewed_sql"], required_actions=["convert", "visualize"], instructions="Convert the supplied original, preserve the result, enter final reviewed SQL, then visualize it. Analysis captures its own inputs.")],
                      ["sql_dialects", "semantic_review", "query_plan"]),
    ]
    for challenge in additions:
        if challenge["id"] in by_id:
            bank["challenges"][bank["challenges"].index(by_id[challenge["id"]])] = challenge
        else:
            bank["challenges"].append(challenge)
    meta = bank["bank"]
    meta["version"] = "0.5.0"
    meta["challenge_count"] = len(bank["challenges"])
    if not any(f["prefix"] == "MOCK" for f in meta["challenge_families"]):
        meta["challenge_families"].append({"prefix": "MOCK", "name": "Synthetic data and reproducibility", "count": 2})
    meta["type_conventions"]["families"]["MOCK"] = "Synthetic data and reproducibility"
    meta["type_conventions"]["types_in_family"]["MOCK"] = ["MODEL"]
    for c in additions:
        for topic in c["internal"]["topics"]:
            refs = meta["topic_index"].setdefault(topic, [])
            if c["id"] not in refs:
                refs.append(c["id"])
    path = {"name": "Constructor evidence and reproducibility", "challenges": ["CM-002", "CM-004", "MOCK-001", "MOCK-002", "SQL-013", "INC-004"]}
    meta["learning_paths"] = [p for p in meta["learning_paths"] if p["name"] != path["name"]] + [path]
    meta["prerequisite_graph"].update({"MOCK-001": [], "MOCK-002": ["CM-002", "MOCK-001"], "SQL-013": []})
    from scripts.build_repair_exercises import build as build_repairs
    from scripts.build_capstone import build as build_capstone
    return validate_bank(build_capstone(build_repairs(bank)))


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    bank, report = build(json.loads((root / "data/challenges.json").read_text(encoding="utf-8")))
    (root / "data/challenges.json").write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "data/validation_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
