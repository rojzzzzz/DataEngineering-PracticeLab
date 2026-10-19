from __future__ import annotations
import json
from copy import deepcopy
from typing import Any
from src.diagrams import diagram_summary
from src.detective_models import evidence_is_current
from src.python_models import public_exercise as public_python, is_current as python_current
from src.sql_models import ddl, public_exercise, answer_hash, fingerprint

# Internal guidance is opt-in and deliberately narrower than the stored object.
INTERNAL_GUIDANCE_FIELDS = ("topics", "domains", "prerequisites", "assessment_focus", "evaluation_focus", "common_traps")
DETECTIVE_PUBLIC_FIELDS = ("version", "symptom", "business_context", "business_rules", "supplied_evidence", "finding_categories")
PYTHON_PUBLIC_CHECKS = ("ok", "correctness", "time_passed", "memory_passed", "passed", "max_ms", "median_ms", "peak_bytes", "total_ms", "elapsed_ms", "cases_passed", "cases_total", "samples_ms", "python_version", "protocol", "time_status", "memory_status")


def public_constructor_tasks(tasks):
    from src.constructor_models import payload_summary
    context = deepcopy(tasks)
    for slot in context.get("slots", []):
        if slot["tool"] == "pipeline" and "starter" in slot:
            slot["starter"] = payload_summary("pipeline", slot["starter"])
    return context


def public_context(challenge, include_internal=False):
    context = {k: challenge[k] for k in ("id", "title", "type", "difficulty", "estimated_minutes", "rubric_ref", "artifacts_required") if k in challenge}
    context["student"] = {k: challenge.get("student", {})[k] for k in ("scenario", "requirements", "tasks", "constraints", "deliverables", "create_table_block") if k in challenge.get("student", {})}
    if include_internal:
        context["internal_guidance"] = {k: challenge.get("internal", {})[k] for k in INTERNAL_GUIDANCE_FIELDS if k in challenge.get("internal", {})}
    if challenge.get("sql_playground"):
        context["sql_playground"] = public_sql_context(challenge["sql_playground"])
    if challenge.get("python_playground"):
        context["python_playground"] = public_python_context(challenge["python_playground"])
    if challenge.get("data_quality_detective"):
        context["data_quality_detective"] = {k: challenge["data_quality_detective"][k] for k in DETECTIVE_PUBLIC_FIELDS if k in challenge["data_quality_detective"]}
    if challenge.get("constructor_tasks"):
        context["constructor_tasks"] = public_constructor_tasks(challenge["constructor_tasks"])
    if challenge.get("capstone"):
        context["capstone"] = {k: challenge["capstone"][k] for k in ("definition_id", "stage_id") if k in challenge["capstone"]}
    if challenge.get("dataset_sql"):
        context["dataset_sql"] = {"tasks": [{k: task[k] for k in ("id", "title", "description") if k in task}
                                           for task in challenge["dataset_sql"]["tasks"]]}
    return context


def public_sql_context(exercise):
    context = public_exercise(exercise)
    context["tables"] = [{**{k: table[k] for k in ("name", "description") if k in table},
        "columns": [{k: column[k] for k in ("name", "type", "nullable", "key") if k in column} for column in table["columns"]]} for table in context["tables"]]
    context["tasks"] = [{**{k: task[k] for k in ("id", "title", "description", "ordered") if k in task},
        "columns": [{k: column[k] for k in ("name", "type", "scale") if k in column} for column in task["columns"]]} for task in context["tasks"]]
    return context


def public_python_context(exercise):
    context = public_python(exercise)
    fields = ("args", "kwargs", "expected") if exercise.get("version") == 2 else ("values", "expected")
    context["examples"] = [{k: example[k] for k in fields if k in example} for example in context.get("examples", [])]
    if "targets" in context:
        context["targets"] = {k: context["targets"][k] for k in ("time_ms", "memory_bytes") if k in context["targets"]}
    return context

def _list(items: Any) -> str:
    return "\n".join(f"- {x}" for x in (items or [])) or "- None specified"

def student_prompt(challenge: dict[str, Any], template: str, *, project_context: dict | None = None) -> str:
    s = challenge.get("student", {})
    context = public_context(challenge)
    schema = s.get("create_table_block", "")
    sql_context = ""
    if challenge.get("sql_playground"):
        sql_context = "\nSQL WORKSPACE (DuckDB)\n" + json.dumps(public_sql_context(challenge["sql_playground"]), ensure_ascii=False, indent=2)
    if challenge.get("python_playground"):
        sql_context += "\nPYTHON WORKSPACE\n" + json.dumps(public_python_context(challenge["python_playground"]), ensure_ascii=False, indent=2)
    if challenge.get("data_quality_detective"):
        sql_context += "\nCASE BRIEF\n" + json.dumps(context["data_quality_detective"], ensure_ascii=False, indent=2)
    if challenge.get("constructor_tasks"):
        sql_context += "\nTOOLS AND DELIVERABLES\n" + json.dumps(context["constructor_tasks"], ensure_ascii=False, indent=2)
    for field in ("capstone", "dataset_sql"):
        if field in context:
            sql_context += "\n" + field.upper() + "\n" + json.dumps(context[field], ensure_ascii=False, indent=2)
    if project_context:
        sql_context += "\nSAVED PROJECT CONTEXT\n" + json.dumps(project_context, ensure_ascii=False, indent=2)
    return f"""{template.strip()}

CHALLENGE {challenge.get('id','')}: {challenge.get('title','')}
Difficulty: {challenge.get('difficulty','')} / 5 | Estimated time: {challenge.get('estimated_minutes','')} minutes

SCENARIO
{s.get('scenario','')}

REQUIREMENTS\n{_list(s.get('requirements'))}
TASKS\n{_list(s.get('tasks'))}
CONSTRAINTS\n{_list(s.get('constraints'))}
EXPECTED DELIVERABLES\n{_list(s.get('deliverables'))}
REQUIRED ARTIFACTS\n{_list(challenge.get('artifacts_required'))}
\nSUPPLIED SCHEMA\n{schema}{sql_context}

Do not solve this challenge. Do not reveal or infer hidden topics. Do not suggest technologies, schemas, facts, dimensions, or keys unless I explicitly request a hint. Let me complete every task, and wait until I explicitly request evaluation."""

def evaluation_prompt(challenge: dict[str, Any], answer: str, rubric: dict[str, int], template: str, used_complications: list[str] | None = None, mistake_categories: list[str] | None = None, diagram: dict[str,Any] | None = None, sql_workspace: dict | None = None, detective_workspace: dict | None = None, python_workspace: dict | None = None, *, include_internal: bool = False, topic_options: list[str] | None = None, constructor_workspace: dict | None = None, project_context: dict | None = None) -> str:
    cats = "\n".join(f"- {name.replace('_',' ').title()}: {points} points" for name,points in rubric.items())
    s=challenge.get("student",{})
    source_context=public_context(challenge, include_internal)
    if constructor_workspace:
        source_context["constructor_tasks"] = public_constructor_tasks(constructor_workspace["tasks"])
    elif challenge.get("constructor_tasks"):
        source_context.pop("constructor_tasks", None)
        source_context["legacy_attempt"] = "This attempt predates linked deliverables; do not require new Constructor evidence."
    diagram_block=f"\n\nSTUDENT ER DIAGRAM\n{diagram_summary(diagram)}" if challenge.get("diagram_kind") or diagram else ""
    sql_block = ""
    if project_context:
        sql_block += "\n\nSAVED PROJECT CONTEXT\n" + json.dumps(project_context, ensure_ascii=False, indent=2)
        sql_block += "\nOnly current execution evidence applies to submitted SQL. Successful execution does not establish business correctness. Samples can be smaller than the returned results; neither represents a full dataset count."
    if challenge.get("dataset_sql"):
        drafts = (sql_workspace or {}).get("drafts", {})
        sql_block += "\n\nSUBMITTED DATASET SQL\n" + "\n\n".join(
            f"{task['title']}:\n{drafts.get(task['id'], '')}" for task in challenge["dataset_sql"]["tasks"])
    if constructor_workspace:
        from src.constructor_artifacts import summaries, revisions
        sql_block += "\n\nCONSTRUCTOR DELIVERABLES\n" + json.dumps({"revisions": revisions(constructor_workspace), "artifacts": summaries(constructor_workspace)}, ensure_ascii=False, indent=2)
        sql_block += "\nPresence checks do not establish design correctness. SQL conversion/visualization is not execution verification. Planner cost is not milliseconds or monetary cost. Samples show only bounded observations; use manifests for full counts."
    if challenge.get("sql_playground"):
        exercise = challenge["sql_playground"]
        drafts = (sql_workspace or {}).get("drafts", {})
        sql_block += "\n\nSUBMITTED SQL\n" + "\n\n".join(f"{task['title']}:\n{drafts.get(task['id'], '')}" for task in exercise["tasks"])
        assessment = (sql_workspace or {}).get("assessment")
        current = assessment and assessment["exercise_hash"] == fingerprint(exercise) and assessment["query_hash"] == answer_hash(exercise, drafts)
        checks = {task["id"]: assessment.get("results", {}).get(task["id"], "Not checked") for task in exercise["tasks"]} if current else None
        sql_block += "\nCorrectness checks: " + (json.dumps(checks) if current else "Not checked or outdated")
        sql_block += "\nChecks assess result correctness only, not production performance or reasoning."
    if challenge.get("python_playground"):
        exercise = challenge["python_playground"]
        workspace = python_workspace or {}
        sql_block += "\n\nSUBMITTED PYTHON\n" + workspace.get("source", "")
        assessment = workspace.get("assessment")
        checks = {k: assessment.get("result", {})[k] for k in PYTHON_PUBLIC_CHECKS if k in assessment.get("result", {})} if python_current(assessment, workspace.get("source", ""), exercise) else None
        sql_block += "\nPython assessment: " + (json.dumps(checks) if checks is not None else "Not checked or outdated")
        sql_block += "\nMeasurements apply to the recorded runner version and host; allocation metrics exclude prepared inputs. Review Pythonic style and reasoning separately."
    if challenge.get("data_quality_detective"):
        notes = detective_workspace or {}
        public_hash = fingerprint({"exercise": public_exercise(challenge["sql_playground"]), "case": challenge["data_quality_detective"]})
        findings = []
        for finding in notes.get("findings", []):
            selected = {k: finding[k] for k in ("title", "category", "tables", "explanation", "impact", "action") if k in finding}
            selected["evidence"] = [{"sql": evidence["sql"], "current": evidence_is_current(evidence, notes, (sql_workspace or {}).get("drafts", {}), public_hash)} for evidence in finding.get("evidence", [])]
            findings.append(selected)
        sql_block += "\n\nSUBMITTED INVESTIGATION\n" + json.dumps({
            "findings": findings, "root_cause": notes.get("root_cause", ""),
            "prevention": notes.get("prevention", "")}, ensure_ascii=False, indent=2)
    return f"""{template.strip()}

Evaluate challenge {challenge.get('id')}: {challenge.get('title')} (difficulty {challenge.get('difficulty')}/5).
Expected artifacts: {_list(challenge.get('artifacts_required'))}
Expected deliverables: {_list(s.get('deliverables'))}
Original challenge and evaluation context:
{json.dumps(source_context, ensure_ascii=False, indent=2)}
Rubric (score each category, respecting its maximum):
{cats}
Total must be out of 100. Include: correct elements, important omissions, technical mistakes, improvement recommendations, mistake categories (choose from: {', '.join(mistake_categories or [])}), weak topics, a suggested focused review exercise, whether the answer is internally consistent, and whether alternative solutions are defensible. Do not penalize a valid alternative design.
Local checks are recorded facts, not model judgments. Do not invent or replace local results.
Return only a JSON object with these exact keys:
{{"rubric_scores": {{"CATEGORY_FROM_RUBRIC": 0}}, "total_score": 0, "weak_topics": [], "mistake_categories": [], "feedback": "Explain strengths, omissions, mistakes, alternatives, consistency and a focused review exercise here."}}
Use every rubric key exactly as stored: {json.dumps(rubric, ensure_ascii=False)}. Scores must be finite, within each category maximum; total_score must equal their sum. Use only these weak topics: {json.dumps(topic_options or [], ensure_ascii=False)}. Use only these mistake categories: {json.dumps(mistake_categories or [], ensure_ascii=False)}.

Optional complications the student chose to include: {_list(used_complications)}

STUDENT ANSWER
{answer}{diagram_block}{sql_block}"""
