"""Portable LLM authoring prompts and bounded, non-mutating import previews."""
from copy import deepcopy
import json
import re
from src.authoring_catalog import (MODES, FAMILIES, exercise_format,
                                  family_for, allocate_ids, available_name, remap_package)
IMPORT_LIMIT = 8 * 1024 * 1024


RULES = {
    "Written practice": "Use written-answer fields only. Do not add execution metadata or Constructor slots; choose a tool-specific or integrated format when saved tool deliverables are required.",
    "Diagram": "Include diagram_kind exactly as in the example. Describe entities, relationships and constraints clearly; the learner builds the diagram, so do not supply a solved diagram.",
    "SQL Practice": """Include sql_playground version 1 with dialect duckdb (DuckDB 1.5.5).
SQL answer task IDs must be unique and must not use scratch or notebook_N (for any integer N); those names belong to built-in editor tabs.
Use 1–20 tables, each with description and 1–40 named columns. Types: INTEGER, BIGINT, DOUBLE, BOOLEAN, VARCHAR, DATE, TIMESTAMP, DECIMAL(p,s); nullable must be boolean.
Use 1–8 tasks with unique IDs (never scratch), title, description, ordered boolean, and output columns. Output types: integer, decimal, number, string, date, timestamp, boolean; decimal/number require scale 0–8.
visible_fixture and each of 2–5 private assessment.fixtures map every table name to row arrays of the exact column width. Include duplicates, nulls where permitted and edge cases. Use small deterministic datasets.
assessment.reference_queries must contain exactly one DuckDB SELECT/WITH query per task ID. Alias output columns to match the contract; use ORDER BY when ordered is true. No external files, network, extensions or writes.
Keep reference queries and private fixtures inside assessment. Student fields must explain semantics, rounding and ordering without revealing solutions. Optional invariants must follow the example's supported schema; omit them if not needed.""",
    "Data-quality Detective": """Follow every SQL Practice rule below, and also include data_quality_detective version 1.
Provide nonempty symptom, business_context, business_rules and supplied_evidence strings plus 1–20 unique finding_categories.
Build a coherent investigation with dirty visible data, diagnostic clues and explicit repair-output tasks. Repairs are SELECT queries, not UPDATE/DELETE. Private fixtures must expose plausible wrong repairs. Keep student clues separate from reference answers.""",
    "Python Practice": """Use python_playground version 2. Define one standard-library function. Include function, contract, starter_code, examples, cases, reference_solution and explanation.
Each example/case has args (positional array), kwargs (named object), and expected. Use only null, booleans, finite numbers, strings, nested lists and string-keyed dictionaries, at most 20 levels deep. No tuple/set/custom-object returns or expected exceptions. Inputs must remain unchanged, including nested values.
Provide 1–30 examples and 1–30 private cases, each <=32 KiB. The complete metadata must fit in 128 KiB. Test edge cases and plausible wrong approaches. expected must have the exact return type; bool is not int. Dict key order does not matter; list order does.
For float tolerance optionally specify comparison: {"abs_tol": 0.000001, "rel_tol": 0.000001}; defaults are exact, tolerances finite in 0–1 and only apply to floats.
reference_solution must define the same function and pass every example/case without modifying inputs. It is executed only in a sandbox during import validation, never in the app. Do not put the solution in starter_code or student fields.
For correctness-only exercises omit benchmark and targets. For performance exercises add benchmark with generator_code defining make_case(size, seed), integer size 1–1000000 and integer seed 0–4294967295. Return exactly {"args": [...], "kwargs": {...}} with deterministic inputs <=7 MiB for a fixed size/seed. Reference output must fit in 1 MiB. Add targets with time_ms (positive <=5000) and/or memory_bytes (positive <=134217728). At least one target is required; avoid unrealistic limits.
Targets are proposed, not certified by an LLM: the app verifies reference correctness, determinism and targets in CPython 3.14.2 before import. Timing uses the maximum of five calls after warm-up; memory is measured separately, excluding prepared inputs. Preserve function semantics between small cases and benchmarks.
No input(), third-party packages, network or external files. Explain efficiency and readable alternatives in the separately revealed explanation.""",
}

RULES.update({
    "Pipeline design": """Use constructor_tasks with a required pipeline slot. Specify source access, cadence, volume, schema evolution, data and control flows, idempotency, retries, durable recovery boundaries, quality gates and privacy. Require a native Pipeline Designer document plus written tradeoffs; a diagram is not executable orchestration. Do not fabricate execution evidence. Do not add diagram_kind or SQL/Python execution metadata.""",
    "Mock data": """Use constructor_tasks with a required mock slot; optionally include a logical diagram slot for an explicit model-to-recipe workflow. Specify fictional tables, grain, named columns, types, PK/FK rules, row counts, fixed seed, distributions, null behavior and output format. Require generation of the current recipe and an explanation of representativeness and limitations. Use <=20 tables, <=100 fields/table, <=1,000,000 total rows and <=10,000,000 cells. Integer sequence and UUID primary keys only; foreign keys reference compatible parent keys in an acyclic graph. Exact decimals use string bounds/values, dates use ISO and timestamps UTC. Independent generators cannot guarantee cross-field correlations, chronological ordering or redundant relationship consistency. Do not demand unsupported guarantees; require documented limitations. No real personal data or pre-completed generation evidence.""",
    "SQL analysis": """Use constructor_tasks with a required sql slot. This is a SQL utilities workspace, not an executable SQL Practice exercise. Choose explicit required_inputs (sql, plan, reviewed_sql) and required_actions (format, convert, visualize, explain). Include realistic public input SQL and, for EXPLAIN tasks, a synthetic supported native plan in starter. Name source/target dialects; ask for semantic risks, reviewed SQL and an independent verification plan. Do not include results or a completed reviewed_sql in starters, claim database execution, or add sql_playground.""",
    "Repair exercise": """Use constructor_tasks with at least one required slot of the selected repair tool and requires_changes:true. Include a complete valid native starter containing a plausible substantive defect. For diagram/pipeline/mock/sql, use the native shape in the example, including required fields. Keep starters structurally valid and public; the defect is a design/business flaw, not broken JSON. Require diagnosis, a substantive repair, current tool evidence, verification reasoning and tradeoffs. Do not include solved alternatives, expected diagnoses, private solution fixtures, results or generation evidence in the public package. Do not add primary execution metadata.""",
    "Integrated case study": """Use constructor_tasks with multiple required deliverables across diagram, pipeline, mock and/or SQL utilities. Specify one coherent business scope and explicit handoffs between tools, with keys, grain, mapping, data quality and recovery constraints that agree across deliverables. These are attachments within one attempt, not a connected project definition. Do not add capstones or fabricate tool execution/correctness evidence.""",
    "Connected Capstone": """Return capstones plus ALL six challenge briefs for EACH requested project. Follow the complete example's version-1 six-stage graph: business -> operational -> data and analytical -> queries -> operations. Each stage needs its own challenge ID and matching capstone {definition_id,stage_id,label}; every definition references only its own six stages. Preserve stable lowercase stage/slot IDs, acyclic prerequisites, tool-compatible outputs/inputs, written_sections and source_stage/source_slot references. Allocate unique lowercase project definition IDs, using the supplied project IDs.
Outputs must match required Constructor slots. A dataset output needs a mock recipe slot; recipe handoffs need a logical/star diagram source and a mock destination. The data stage must explicitly save the complete generated typed dataset (<=10 tables, <=40 columns/table, <=10,000 total rows and <=2 MiB schema/rows). This is separate from temporary samples.
The queries stage uses dataset_sql version 1 with 1–8 unique lowercase task IDs, titles and descriptions, and a dataset input with mode:dataset. Do not use scratch or notebook_N as task IDs; those names are reserved for editor tabs. It runs against the learner's saved operational dataset: do not invent fixed table names that the learner never agreed to. Require inspection of the saved schema, explicit source-to-target mapping, reconciliation and diagnostics. Do not add sql_playground, private fixed fixtures or reference queries to dataset_sql. Successful execution is evidence, not automatic correctness grading. Downstream analytical and pipeline artifacts are designs, not materialized/executed systems.
Adapt business scope, reporting period, currency, status semantics, grain and KPI definitions consistently across every stage. Use supported acyclic single-column integer/UUID keys and independently generated data; explicitly state unsupported correlations. Include project-level description, estimated_minutes and rubric_ref. Never output run IDs, stage attempts, workspaces, datasets, copied snapshots or completion/evaluation state.""",
})

QUALITY_RULES = """Design a specific, solvable exercise with a clear learning objective and a fictional business context. Each requested exercise must test a different decision or failure mode; do not merely rename the example or repeat installed titles. Use a concise, descriptive title naming the task and domain, without IDs, random tokens, dates or difficulty labels.
Calibrate difficulty: 1 = one skill with guided inputs; 2 = two related skills and one edge case; 3 = an independent multi-step problem; 4 = competing constraints and misleading but plausible approaches; 5 = interacting failure modes, tradeoffs and a defensible verification strategy. Difficulty must come from reasoning, not missing requirements or excessive data volume.
State input grain, key relationships, units, allowed values, null/duplicate rules, time zones and boundaries, rounding and ordering/tie rules wherever relevant. Give all information needed to answer without guessing. Distinguish required outputs from optional extensions and use realistic completion times. Require concrete deliverables and acceptance criteria for each task.
Use small deterministic SQL/Python fixtures that distinguish plausible wrong answers from correct ones; verify every expected result against the reference implementation. Include empty/boundary/duplicate/null cases when the contract permits them. Avoid accidental ambiguity, invalid types, hidden contradictory requirements, real credentials and personal data. Student content and starters must not reveal solutions; progressive hints should guide rather than immediately solve.
Before returning, check consistency between the business brief, tasks, schema, fixtures, expected results and rubric. Return only the JSON artifact, not your working notes."""

REPAIR_RULES = """For repair exercises, use public symptoms and business requirements, never a diagnosis or answer key in starters or student fields. Keep expected defects and repaired examples in restricted authoring/test fixtures, outside the public challenge bank. A Constructor slot may declare requires_changes: true only with a valid native starter. Completion then requires a substantive edit, written diagnosis and normal current evidence; these are presence checks, not repair grading. Ignore layout/IDs/generated evidence when reasoning about substantive edits. Accept alternative defensible solutions through a 100-point rubric: diagnosis 25, repair_quality 40, verification_reasoning 25, tradeoffs 10. Supply three progressive hints and one complication."""


def example_package(bank, mode, performance=True, *, family=None, diagram_kind="conceptual_erd", repair_tool="diagram", mock_from_model=False, naming_bank=None):
    if mode not in MODES:
        raise ValueError("Choose a supported exercise format.")
    prefix = family_for(mode, family, diagram_kind)
    naming_bank = bank if naming_bank is None else naming_bank
    if mode == "Connected Capstone":
        definition = next(iter(bank.get("capstones", [])), None)
        if definition is None:
            raise ValueError("No connected project example is available in the bundled bank.")
        ids = [s["challenge_id"] for s in definition["stages"]]
        sample = {c["id"]: c for c in bank["challenges"]}
        package = {"bank": {"challenge_count": len(ids)}, "capstones": [deepcopy(definition)],
                   "challenges": [deepcopy(sample[cid]) for cid in ids]}
        refs = {c["rubric_ref"] for c in package["challenges"]} | {definition["rubric_ref"]}
        package["rubrics"] = {ref: deepcopy(bank["rubrics"][ref]) for ref in sorted(refs)}
    else:
        samples = [c for c in bank["challenges"] if exercise_format(c) == mode]
        if mode == "Written practice":
            # Prefer the actual subject family, not just the first written example.
            samples.sort(key=lambda c: not c["id"].startswith(prefix + "-"))
        if mode == "Diagram":
            samples = [c for c in samples if c.get("diagram_kind") == diagram_kind]
        if mode == "Mock data" and mock_from_model:
            samples = [c for c in samples if any(s["tool"] == "diagram" and s.get("kind") == "logical_erd"
                                               for s in c["constructor_tasks"]["slots"])]
        if mode == "Repair exercise":
            if repair_tool not in ("diagram", "pipeline", "mock", "sql"):
                raise ValueError("Choose a supported repair tool.")
            samples = [c for c in samples if any(s["tool"] == repair_tool for s in c["constructor_tasks"]["slots"])]
            if not samples and repair_tool == "sql":
                # Reuse a supported native SQL input rather than inventing a format.
                samples = [c for c in bank["challenges"] if exercise_format(c) == "SQL analysis"
                           and any(s.get("starter") for s in c["constructor_tasks"]["slots"])]
        sample = next(iter(samples), None)
        if sample is None:
            raise ValueError(f"No {mode} example is available in the bundled bank.")
        if mode == "Python Practice":
            sample = next((c for c in samples if c.get("python_playground", {}).get("version") == 2), sample)
        challenge = deepcopy(sample)
        rubric = deepcopy(bank["rubrics"][challenge["rubric_ref"]])
        if mode == "Repair exercise" and repair_tool == "sql":
            for slot in challenge["constructor_tasks"]["slots"]:
                if slot.get("starter"):
                    slot["required"] = slot["requires_changes"] = True
            rubric = {"diagnosis": 25, "repair_quality": 40, "verification_reasoning": 25, "tradeoffs": 10}
        if mode == "Python Practice" and not performance:
            challenge["python_playground"].pop("benchmark", None)
            challenge["python_playground"].pop("targets", None)
            challenge["student"]["constraints"] = ["Standard library only. Preserve input values."]
            rubric = {"correctness": 70, "clarity_and_reasoning": 30}
        challenge["type"] = ("PIPELINE" if mode == "Pipeline design" else FAMILIES[prefix][1][0])
        package = {"bank": {"challenge_count": 1}, "rubrics": {challenge["rubric_ref"]: rubric}, "challenges": [challenge]}
    allocated = allocate_ids(naming_bank, prefix, len(package["challenges"]))
    identities = dict(zip((c["id"] for c in package["challenges"]), allocated))
    project_names = {d["id"]: available_name("cap-" + allocated[0].split("-", 1)[1], {x["id"] for x in naming_bank.get("capstones", [])}) for d in package.get("capstones", [])}
    occupied = set(naming_bank.get("rubrics", {}))
    rubric_names = {name: available_name(f"practice_{allocated[0].lower().replace('-', '_')}_{index}", occupied)
                    for index, name in enumerate(package["rubrics"], 1)}
    return remap_package(package, identities, project_names, rubric_names)


def authoring_prompt(bank, mode, topic="[TOPIC]", count=3, difficulty=3, language="English", preferences="", *, performance=True, audience="", contract="", edge_cases="", goals="", family=None, diagram_kind="conceptual_erd", repair_tool="diagram", mock_from_model=False, exercise_type=None, examples=None):
    if type(count) is not int or not 1 <= count <= 10 or type(difficulty) is not int or not 1 <= difficulty <= 5:
        raise ValueError("Choose 1–10 exercises/projects and difficulty 1–5.")
    prefix = family_for(mode, family, diagram_kind)
    exercise_type = exercise_type or ("PIPELINE" if mode == "Pipeline design" else FAMILIES[prefix][1][0])
    if exercise_type not in FAMILIES[prefix][1]:
        raise ValueError("The deliverable type does not match the selected exercise family.")
    example = example_package(bank if examples is None else examples, mode, performance, family=prefix,
                              diagram_kind=diagram_kind, repair_tool=repair_tool, mock_from_model=mock_from_model, naming_bank=bank)
    for challenge in example["challenges"]:
        if mode != "Connected Capstone":
            challenge["type"] = exercise_type
    identities = allocate_ids(bank, prefix, count * (6 if mode == "Connected Capstone" else 1))
    manifest = {"version": 1, "format": mode, "family": prefix, "count": count}
    if mode != "Connected Capstone":
        manifest["type"] = exercise_type
    if mode == "Diagram":
        manifest["diagram_kind"] = diagram_kind
    if mode == "Repair exercise":
        manifest["repair_tool"] = repair_tool
    if mode == "Mock data":
        manifest["mock_from_model"] = mock_from_model
    rules = RULES[mode]
    if mode == "Repair exercise":
        rules += "\n" + REPAIR_RULES + f"\nRepair tool: {repair_tool}."
    if mode == "Data-quality Detective":
        rules += "\n" + RULES["SQL Practice"]
    if mode == "Mock data":
        rules += ("\nRequire both a logical_erd diagram slot and a mock slot; explicitly copy the saved logical model into the recipe and resolve mappings." if mock_from_model
                  else "\nRequire the mock recipe and generation workflow; no model-to-recipe step is required.")
    python_inputs = f"""Function contract (Python): {contract or 'Design one precise JSON-compatible function contract for the topic.'}
Python grading: {'performance targets' if performance else 'correctness only; omit benchmark and targets'}
Performance goals (if enabled): {goals or 'Choose realistic, locally verifiable targets; explain their purpose.'}
""" if mode == "Python Practice" else ""
    occupied = {d["id"] for d in bank.get("capstones", [])}
    projects = [available_name("cap-" + cid.split("-", 1)[1], occupied) for cid in identities[::6]] if mode == "Connected Capstone" else []
    project_contract = f"Project count: {count}; total stage briefs: {len(identities)}. Project definition IDs, in order: {json.dumps(projects)}.\n" if projects else ""
    existing_titles = [c["title"] for c in bank.get("challenges", []) if c.get("id", "").startswith(prefix + "-")][-40:]
    return f"""Create an importable Practice Lab exercise package. Return ONLY one valid JSON object, without Markdown fences or commentary.
AUTHORING MATERIAL: the structural example includes internal guidance and private checks for exercise creation. It is not a student's evaluation context.

INPUTS (supply the topic before generating)
Format: {mode}
{python_inputs}Topic: {topic or '[TOPIC]'}
Exercise count: {count}
{project_contract}Audience: {audience or 'Independent data-engineering learners at the selected difficulty.'}
Required edge cases: {edge_cases or 'Choose cases appropriate to the stated input contract.'}
Difficulty: {difficulty} (integer 1–5)
Language: {language or 'English'}
Additional requirements: {preferences or 'None.'}

NAMING CONTRACT (assigned by the application; never invent random batch tokens)
Family: {prefix} — {FAMILIES[prefix][0]}. The family prefix describes the subject; type describes the dominant deliverable.
Use EXACTLY these challenge IDs in this order: {json.dumps(identities)}.
Use type {exercise_type}, except Connected Capstone dataset-SQL stages use SQL and other stages use MODEL.
Use supplied project definition IDs where applicable. Stage IDs and Constructor slot IDs stay stable lowercase identifiers scoped to each exercise/project.
Every rubric_ref must use a supplied rubric. Use names beginning practice_{identities[0].lower().replace('-', '_')}_; never overwrite installed rubrics.
Preserve all references to these IDs in capstones, learning_paths, topic_index and prerequisite_graph. Never output random batch names or unresolved placeholders.
Include this exact top-level authoring object: {json.dumps(manifest)}.
The IDs are a proposal for the current bank, not a reservation: import review reassigns them if another import used the sequence first. Existing installed IDs are never renamed.
Existing family titles to avoid copying: {json.dumps(existing_titles, ensure_ascii=False)}.

PACKAGE CONTRACT
Return challenges, rubrics and bank.challenge_count. Each challenge needs id, title, type, difficulty, estimated_minutes (positive), rubric_ref, and student.
student contains scenario (text), requirements, tasks, constraints and deliverables (arrays of strings). Preserve these field types exactly.
Optional constructor_tasks: {{"version":1,"slots":[{{"id":"logical","tool":"diagram","label":"Logical model","required":true,"kind":"logical_erd","instructions":"Build the model"}}]}}.
Declare 1–12 unique stable lowercase slot IDs, tool diagram/pipeline/sql/mock, label and boolean required. Allow repeated tools. Diagram kind is conceptual_erd/logical_erd/star_schema. Keep existing one-primary-workspace rules for diagram_kind, sql_playground and python_playground; Constructor attachments are supplementary.
SQL slots may declare required_inputs (sql, plan, reviewed_sql) and required_actions (format, convert, visualize, explain). Use public problem inputs only in optional native-format starter payloads; never include reference solutions, analysis results or completed generation evidence. Mock slots require generation for the current recipe. Pipeline templates remain explicit learner choices. Checks establish evidence presence, not design correctness; do not claim PostgreSQL/pipeline execution or automated design grading.
Include three progressive hints, artifacts_required, follow_up_complications and review_exercise. Keep answers and grading guidance in internal and private assessment fields, never student fields or starter code.
Every referenced rubric must be supplied, with nonnegative finite numeric weights totaling 100. Use criteria that match the requested outputs, not vague effort or completion points.
Produce exactly the requested count. Keep the example's structure, replacing its content with coherent exercises for the inputs. Preserve execution metadata field names and types. Do not include unrelated exercise metadata or workspace/session state.
The package is appended to an existing bank. Do not reproduce its old exercises. Optional learning paths, topic indexes and prerequisites may reference only IDs generated in this response.

FORMAT RULES
{rules}

EXERCISE QUALITY
{QUALITY_RULES}

COMPLETE STRUCTURAL EXAMPLE (one exercise, not a request to copy its content)
For Connected Capstone this is one complete six-stage project. For multiple requests, produce the full requested count using the assigned IDs above. Adapt the content; the example is not an additional exercise and does not change the count.
{json.dumps(example, ensure_ascii=False, indent=2)}

SELF-CHECK
Verify JSON syntax, field types, requested exercise/project and stage counts, the exact assigned IDs, descriptive titles, the authoring object, rubric totals, valid references, progressive hints and all expected answers. Ensure fixtures and descriptions agree. Return the completed JSON only.
"""


def parse_package(payload):
    """Accept plain JSON or one outer Markdown fence; never extract arbitrary prose."""
    raw = payload.encode("utf-8") if isinstance(payload, str) else payload
    if len(raw) > IMPORT_LIMIT:
        raise ValueError("Exercise packages must be no larger than 8 MiB.")
    text = raw.decode("utf-8-sig").strip()
    fence = re.fullmatch(r"```(?:json)?\s*\n(.*?)\n```", text, flags=re.DOTALL | re.IGNORECASE)
    if fence:
        text = fence.group(1)
    package = json.loads(text)
    if not isinstance(package, dict) or not isinstance(package.get("challenges"), list) or not package["challenges"]:
        raise ValueError("Expected an object with a nonempty challenges array.")
    return package


def repair_prompt(problem, original="[PASTE_THE_JSON_YOU_GENERATED]", contract=None):
    if contract is None:
        try:
            package = parse_package(original)
            mode = package.get("authoring", {}).get("format") or exercise_format(package["challenges"][0])
        except (ValueError, TypeError, AttributeError):
            package, mode = {}, "Written practice"
        contract = ("Use the original authoring request from this conversation. Preserve its topic, count and naming contract. "
                    "Each challenge requires id, title, type, difficulty 1–5, positive estimated_minutes, rubric_ref and "
                    "student with scenario text and requirements/tasks/constraints/deliverables string arrays. "
                    "Supply every referenced 100-point rubric.\n" + RULES.get(mode, RULES["Written practice"]) + "\n" + QUALITY_RULES +
                    "\nPreserve this authoring envelope when supplied: " + json.dumps(package.get("authoring")))
        if mode == "Data-quality Detective":
            contract += "\n" + RULES["SQL Practice"]
        if mode == "Repair exercise":
            contract += "\n" + REPAIR_RULES
    return f"""Repair the exercise package below for Practice Lab. Return only corrected JSON.
AUTHORING MATERIAL: the original package may contain private checks and reference solutions needed to repair the exercise. Do not evaluate a student's attempt.
Preserve the intended exercises and valid fields; fix the reported issue and check the entire package. Do not invent new runtime capabilities. Keep exercise IDs unique against my existing bank and rubric weights totaling 100.

VALIDATION FEEDBACK
{problem}

ORIGINAL PACKAGE
{original}

FORMAT CONTRACT
{contract}
"""
