import json
from pathlib import Path
from src.json_validator import validate_bank

def minimal():
    return {"bank":{"challenge_count":3,"challenge_families":[{"prefix":"A","count":3}],"learning_paths":[{"name":"p","challenges":["A-1","MISSING"]}],"prerequisite_graph":{"A-1":["MISSING"],"MISSING":[]},"topic_index":{"x":["A-1","MISSING"]}},"rubrics":{"r":{"a":100}},"prompt_templates":{"student":"s","hint":"h","evaluation":"e"},"challenges":[{"id":"A-1","title":"One","type":"SQL","difficulty":3,"estimated_minutes":10,"rubric_ref":"r","student":{"scenario":"s"},"hints":["1","2","3"]}]}

def test_actual_count_dangling_and_derived_count():
    normalized, report=validate_bank(minimal())
    assert len(normalized["challenges"])==1
    assert normalized["bank"]["challenge_count"]==1
    assert normalized["bank"]["learning_paths"][0]["challenges"]==["A-1"]
    assert "MISSING" not in normalized["bank"]["prerequisite_graph"]
    assert any(x["kind"]=="dangling_reference" for x in report["issues"])

def test_duplicate_id_and_rubric_errors_detected():
    d=minimal(); d["challenges"].append(dict(d["challenges"][0])); d["challenges"][0]["rubric_ref"]="missing"
    _, report=validate_bank(d)
    kinds={i["kind"] for i in report["issues"]}
    assert "duplicate_or_missing_id" in kinds and "unknown_rubric" in kinds

def test_rubric_total_validation():
    d=minimal(); d["rubrics"]["r"]={"a":90}
    _,report=validate_bank(d)
    assert any(i["kind"]=="rubric_total" for i in report["issues"])

def test_new_challenge_bank_includes_python_pilot():
    source=json.loads((Path(__file__).resolve().parents[1]/"data"/"challenges.json").read_text(encoding="utf-8"))
    normalized,report=validate_bank(source)
    count=len(source["challenges"])
    assert count >= 59
    assert {c["id"] for c in normalized["challenges"] if c.get("python_playground")} == {"PY-001", "PY-002"}
    assert len(normalized["challenges"])==count
    assert report["valid_challenges"]==count
    assert normalized["bank"]["challenge_count"]==count
    assert not report["duplicate_ids"]


def test_invalid_runtime_types_are_rejected():
    import pytest
    for field, value in [('estimated_minutes', 'fast'), ('id', []), ('rubric_ref', {}), ('hints', [1])]:
        source = minimal()
        source['challenges'][0][field] = value
        with pytest.raises(ValueError):
            validate_bank(source)


def test_boolean_difficulty_is_not_valid():
    source = minimal()
    source['challenges'][0]['difficulty'] = True
    _, report = validate_bank(source)
    assert any(issue['kind'] == 'invalid_difficulty' for issue in report['issues'])
    assert report['valid_challenges'] == 0


def test_malformed_reference_is_reported_instead_of_crashing():
    source = minimal()
    source['bank']['topic_index']['x'].append({})
    normalized, report = validate_bank(source)
    assert normalized['bank']['topic_index']['x'] == ['A-1']
    assert any(issue.get('reference') == {} for issue in report['issues'])
