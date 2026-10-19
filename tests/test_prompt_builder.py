from src.prompt_builder import student_prompt, evaluation_prompt
from src.diagrams import empty_diagram

def challenge():
    return {"id":"X-1","title":"Example","difficulty":2,"estimated_minutes":12,"artifacts_required":["query_sql"],"student":{"scenario":"Do a task","requirements":["r"],"tasks":["t"],"constraints":[],"deliverables":["SQL"]},"internal":{"topics":["secret_topic"],"common_traps":["secret_trap"]}}

def test_student_prompt_excludes_hidden_metadata():
    p=student_prompt(challenge(),"Instructor template")
    assert "secret_topic" not in p and "secret_trap" not in p
    assert "Do not solve" in p and "SQL" in p

def test_evaluation_prompt_includes_answer_and_rubric():
    p=evaluation_prompt(challenge(),"My answer",{"correctness":100},"Evaluate",["Complication"])
    assert "My answer" in p and "Correctness: 100 points" in p and "Complication" in p
    assert "internally consistent" in p
    assert "STUDENT ER DIAGRAM" not in p


def test_diagram_in_evaluation_but_not_student_prompt():
    c=challenge(); c["diagram_kind"]="conceptual_erd"
    diagram=empty_diagram("conceptual_erd")
    diagram["entities"]=[{"id":"a","name":"Patient","role":"entity","annotation":"","position":{"x":0,"y":0},"fields":[]}]
    assert "Patient" not in student_prompt(c,"Coach")
    assert "Patient" in evaluation_prompt(c,"Reasoning",{"correctness":100},"Evaluate",diagram=diagram)


def test_dataset_sql_tasks_reach_student_and_evaluator():
    from capstone_examples import bank
    c = next(c for c in bank()["challenges"] if c.get("dataset_sql"))
    for prompt in (student_prompt(c, "Coach"), evaluation_prompt(c, "My SQL", {"correctness": 100}, "Evaluate")):
        for task in c["dataset_sql"]["tasks"]:
            assert task["description"] in prompt
        assert c["capstone"]["definition_id"] in prompt


def test_pipeline_starter_prompts_include_semantics_without_embedded_images():
    from src.constructor_models import new_workspace
    from src.pipeline_models import empty_document
    c = challenge()
    pipeline = empty_document()
    pipeline["notes"] = "Explain the ingestion boundary"
    pipeline["files"] = {"image": {"id": "image", "mimeType": "image/png", "dataURL": "data:image/png;base64,AQID"}}
    c["constructor_tasks"] = {"version": 1, "slots": [{"id": "pipeline", "label": "Pipeline", "tool": "pipeline", "required": True, "starter": pipeline}]}
    for prompt in (student_prompt(c, "Coach"), evaluation_prompt(c, "Answer", {"correctness": 100}, "Evaluate", constructor_workspace=new_workspace(c))):
        assert "Explain the ingestion boundary" in prompt
        assert "dataURL" not in prompt and "base64,AQID" not in prompt
