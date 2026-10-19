import pytest
from src.bank_manager import merge_banks

def challenge(cid):
    return {"id":cid,"title":cid,"type":"MODEL","difficulty":2,"estimated_minutes":15,"rubric_ref":"model","student":{"scenario":"Scenario","requirements":[],"tasks":[],"constraints":[],"deliverables":[]}}

def test_add_mode_merges_challenges_rubrics_paths_and_topics():
    current={"bank":{"challenge_count":1,"challenge_families":[{"prefix":"A","count":1}],"learning_paths":[{"name":"Core","challenges":["A-1"]}],"topic_index":{"grain":["A-1"]}},"rubrics":{"model":{"correctness":100}},"challenges":[challenge("A-1")]}
    incoming={"bank":{"challenge_families":[{"prefix":"B","count":1}],"learning_paths":[{"name":"Core","challenges":["B-1"]}],"topic_index":{"grain":["B-1"]}},"rubrics":{"model":{"correctness":100},"sql":{"correctness":100}},"challenges":[challenge("B-1")]}
    merged=merge_banks(current,incoming)
    assert [c["id"] for c in merged["challenges"]]==["A-1","B-1"]
    assert "sql" in merged["rubrics"]
    assert merged["bank"]["learning_paths"][0]["challenges"]==["A-1","B-1"]
    assert merged["bank"]["topic_index"]["grain"]==["A-1","B-1"]

def test_add_mode_rejects_id_and_rubric_conflicts():
    current={"bank":{},"rubrics":{"model":{"correctness":100}},"challenges":[challenge("A-1")]}
    with pytest.raises(ValueError,match="Challenge ID conflicts"):
        merge_banks(current,{"bank":{},"rubrics":{},"challenges":[challenge("A-1")]})
    with pytest.raises(ValueError,match="Rubric 'model' differs"):
        merge_banks(current,{"bank":{},"rubrics":{"model":{"correctness":90}},"challenges":[challenge("B-1")]})


def test_merge_owns_nested_data_from_both_inputs():
    from copy import deepcopy

    current = {
        "bank": {"learning_paths": [{"name": "Core", "challenges": ["A-1"]}]},
        "rubrics": {"model": {"correctness": 100}},
        "challenges": [challenge("A-1")],
    }
    incoming = {
        "bank": {
            "challenge_families": [{"prefix": "B", "intent": "Practice"}],
            "learning_paths": [{"name": "New", "challenges": ["B-1"]}],
            "glossary": {"grain": {"description": "One row"}},
        },
        "rubrics": {"new": {"correctness": 100}},
        "prompt_templates": {"student": {"parts": ["Scenario"]}},
        "challenges": [challenge("B-1")],
    }
    original_current, original_incoming = deepcopy(current), deepcopy(incoming)
    merged = merge_banks(current, incoming)
    merged["challenges"][0]["student"]["tasks"].append("Local edit")
    merged["challenges"][1]["student"]["tasks"].append("Imported edit")
    merged["rubrics"]["new"]["correctness"] = 80
    merged["bank"]["challenge_families"][0]["intent"] = "Changed"
    merged["bank"]["learning_paths"][1]["challenges"].append("B-2")
    merged["bank"]["glossary"]["grain"]["description"] = "Changed"
    merged["prompt_templates"]["student"]["parts"].append("Task")
    assert current == original_current
    assert incoming == original_incoming

    incoming["challenges"][0]["title"] = "Changed after import"
    assert merged["challenges"][1]["title"] == "B-1"


def test_append_keeps_references_to_existing_challenges():
    from src.bank_manager import prepare_append
    current = {'bank': {}, 'rubrics': {'model': {'correctness': 100}},
               'challenges': [challenge('A-1')]}
    incoming = {'bank': {
        'learning_paths': [{'name': 'Core', 'challenges': ['A-1', 'B-1']}],
        'topic_index': {'topic': ['A-1', 'B-1']},
        'prerequisite_graph': {'B-1': ['A-1']}},
        'challenges': [challenge('B-1')]}
    merged, report = prepare_append(current, incoming)
    assert report['valid_challenges'] == 2
    assert merged['bank']['learning_paths'][0]['challenges'] == ['A-1', 'B-1']
    assert merged['bank']['topic_index']['topic'] == ['A-1', 'B-1']
    assert merged['bank']['prerequisite_graph']['B-1'] == ['A-1']
    assert incoming['bank']['prerequisite_graph']['B-1'] == ['A-1']


def test_sync_bundled_sql_repairs_stale_volume_and_preserves_custom_questions():
    import json
    from pathlib import Path
    from src.bank_manager import sync_bundled_sql
    bundled=json.loads((Path(__file__).resolve().parents[1]/"data"/"challenges.json").read_text(encoding="utf-8"))
    sql=[c for c in bundled["challenges"] if c.get("sql_playground")]
    stale={"bank":{"challenge_count":1,"challenge_families":[],"learning_paths":[],"topic_index":{},"prerequisite_graph":{}},
           "rubrics":{},"challenges":[challenge("CUSTOM-1"),{"id":"SQL-001","title":"Old SQL","type":"SQL"}]}
    repaired=sync_bundled_sql(stale,bundled)
    assert len([c for c in repaired["challenges"] if c.get("sql_playground")]) == len(sql)
    assert next(c for c in repaired["challenges"] if c["id"]=="SQL-001")["title"] == next(c for c in sql if c["id"]=="SQL-001")["title"]
    assert any(c["id"]=="CUSTOM-1" for c in repaired["challenges"])
    assert repaired["bank"]["challenge_count"] == len(repaired["challenges"])


def test_detective_upgrade_preserves_modified_case_for_import_review():
    import json
    from pathlib import Path
    from src.bank_manager import sync_bundled_sql
    bundled = json.loads((Path(__file__).resolve().parents[1] / "data" / "challenges.json").read_text(encoding="utf-8"))
    modified = {"id": "CLN-001", "title": "Locally revised customer case", "student": {"scenario": "custom"}}
    active = {"bank": {"challenge_families": [], "learning_paths": [], "topic_index": {}, "prerequisite_graph": {}}, "rubrics": {}, "challenges": [modified]}
    upgraded = sync_bundled_sql(active, bundled)
    assert upgraded["challenges"][0] == modified
    assert "CLN-001" in upgraded["bank"]["bundled_upgrade_conflicts"]
