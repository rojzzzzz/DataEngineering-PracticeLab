from copy import deepcopy
from datetime import date
from decimal import Decimal
import json
from pathlib import Path
import time

import pytest

from scripts.build_sql_exercises import build
from src.sql_models import answer_hash, check_exercise, fingerprint, new_workspace, public_exercise, validate_exercise, validate_workspace
from src.sql_runner import SQLJob, validate_reference_queries
from src.sql_worker import compare, query, ResourceLimit
from src.database import init_db, save_attempt, get_attempt, save_sql_workspace, save_attempt_details, export_progress, merge_progress
from src.prompt_builder import student_prompt, evaluation_prompt
from src.sql_component import schema_payload


def test_schema_explorer_payload_excludes_private_data(exercises):
    exercise = exercises["SQL-001"]
    payload = schema_payload(exercise)
    for item, table in zip(payload, exercise["tables"]):
        assert set(item) == set(table) | {"rowCount", "samples"}
        assert item["rowCount"] == len(exercise["visible_fixture"][table["name"]])
        assert item["samples"] == exercise["visible_fixture"][table["name"]][:10]
    assert "reference_queries" not in json.dumps(payload)


@pytest.fixture(scope="module")
def exercises():
    return build()


def test_validation_copy_and_borrowed_checks_keep_the_same_contract(exercises):
    original = deepcopy(exercises["SQL-001"])
    expected = deepcopy(original)
    checked = validate_exercise(original)
    table = checked["tables"][0]["name"]
    checked["visible_fixture"][table].clear()
    assert original == expected
    assert check_exercise(original) is None
    assert original == expected
    invalid = deepcopy(original)
    invalid["tasks"][0]["id"] = "scratch"
    for validate in (check_exercise, validate_exercise):
        with pytest.raises(ValueError, match="reserved"):
            validate(invalid)


def test_large_typed_fixture_preserves_batch_boundaries_and_all_rows():
    schema = {"tables": [{"name": "records", "columns": [
        {"name": "id", "type": "BIGINT", "nullable": False},
        {"name": "label", "type": "VARCHAR", "nullable": False},
        {"name": "amount", "type": "DECIMAL(12,2)", "nullable": True},
        {"name": "active", "type": "BOOLEAN", "nullable": False},
        {"name": "day", "type": "DATE", "nullable": False},
    ]}]}
    rows = [[i, f"東京 '{i}'\nnext", "12.30" if i % 2 else None, bool(i % 2), "2026-10-18"] for i in range(1001)]
    fixture = {"records": rows}
    totals = query(schema, fixture, "SELECT COUNT(*), COUNT(amount), SUM(amount) FROM records")
    assert totals["rows"] == [[1001, 500, Decimal("6150.00")]]
    result = query(schema, fixture, "SELECT * FROM records WHERE id IN (0,499,500,999,1000) ORDER BY id")
    assert result["rows"] == [[i, rows[i][1], Decimal("12.30") if i % 2 else None, bool(i % 2), date(2026, 10, 18)]
                              for i in (0, 499, 500, 999, 1000)]
    assert result["truncated"] is False


def test_fixture_nul_and_sql_looking_text_remain_literal_data():
    schema = {"tables": [{"name": "records", "columns": [{"name": "value", "type": "VARCHAR", "nullable": False}]}]}
    rows = [["first\x00last"], ["'); DROP TABLE records; --"], ["naïve 東京\nline"]]
    assert query(schema, {"records": rows}, "SELECT * FROM records ORDER BY rowid")["rows"] == rows


@pytest.mark.parametrize("cid", ["SQL-001","SQL-002","SQL-003","SQL-004","SQL-005","SQL-006","SQL-007","SQL-009","SQL-012"])
def test_bundled_reference_passes_all_fixtures(exercises, cid):
    exercise = exercises[cid]
    result = SQLJob(exercise, "check", drafts=exercise["assessment"]["reference_queries"]).wait()
    assert result["ok"], result
    assert set(result["results"].values()) == {"passed"}


WRONG_REPLACEMENTS = {
    "SQL-001": ("DENSE_RANK()", "ROW_NUMBER()"),
    "SQL-002": ("d.SnapshotDate<=m.FullDate", "date_trunc('month',d.SnapshotDate)=date_trunc('month',m.FullDate)"),
    "SQL-003": ("o.OrderTimestamp<c.ValidTo", "o.OrderTimestamp<=c.ValidTo"),
    "SQL-004": ("SELECT DISTINCT e.StudentKey", "SELECT e.StudentKey"),
    "SQL-005": ("ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", "ROWS BETWEEN 1 PRECEDING AND CURRENT ROW"),
    "SQL-006": ("SELECT DISTINCT UserKey,LoginDate", "SELECT UserKey,LoginDate"),
    "SQL-007": ("d.path=h.path OR starts_with(d.path,h.path||'/')", "d.path=h.path"),
    "SQL-009": ("age>30", "age>=30"),
    "SQL-012": ("LEFT JOIN customers", "INNER JOIN customers"),
}


@pytest.mark.parametrize("cid", list(WRONG_REPLACEMENTS))
def test_representative_wrong_answers_fail(exercises, cid):
    exercise = deepcopy(exercises[cid])
    drafts = dict(exercise["assessment"]["reference_queries"])
    task_id = exercise["tasks"][0]["id"]
    before, after = WRONG_REPLACEMENTS[cid]
    if cid == "SQL-004":
        # The reference distinct counts would neutralize duplicate input; use the
        # common incorrect denominator: registration count rather than cohort size.
        before, after = "COUNT(DISTINCT c.StudentKey) AS cohort_size", "COUNT(*) AS cohort_size"
    assert before in drafts[task_id]
    drafts[task_id] = drafts[task_id].replace(before, after)
    result = SQLJob(exercise, "check", drafts=drafts).wait()
    assert result["ok"], result
    assert result["results"][task_id] != "passed"
    assert set(result) == {"ok", "results"}  # No private inputs or expected outputs.


@pytest.mark.parametrize("sql", ["DELETE FROM FactLogin", "SELECT 1; SELECT 2", "ATTACH 'x.db'", "INSTALL httpfs", "SET enable_external_access=true", "COPY (SELECT 1) TO 'x.csv'", "SELECT * FROM read_csv('README.md')", "SELECT * FROM read_csv('https://example.com/test.csv')"])
def test_unsafe_or_multiple_statements_rejected(exercises, sql):
    with pytest.raises(Exception):
        query(exercises["SQL-006"], exercises["SQL-006"]["visible_fixture"], sql)


def test_cte_lag_lead_frame_and_explain(exercises):
    exercise = exercises["SQL-006"]
    sql = "WITH x AS (SELECT * FROM (VALUES (1),(2),(3)) t(n)) SELECT n,lag(n) OVER(ORDER BY n),lead(n) OVER(ORDER BY n),sum(n) OVER(ORDER BY n ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) FROM x"
    result = query(exercise, exercise["visible_fixture"], sql)
    assert result["rows"] == [[1,None,2,1],[2,1,3,3],[3,2,None,6]]
    assert "WINDOW" in str(query(exercise, exercise["visible_fixture"], sql, explain=True)["rows"])


def test_preview_truncation_and_assessment_limits(exercises):
    exercise = exercises["SQL-006"]
    result = query(exercise, exercise["visible_fixture"], "SELECT * FROM range(2000)")
    assert result["truncated"] and len(result["rows"]) == 1000
    result = query(exercise, exercise["visible_fixture"], "SELECT repeat('x',1000000) FROM range(3)")
    assert result["truncated"] and len(result["rows"]) == 1
    with pytest.raises(ResourceLimit):
        query(exercise, exercise["visible_fixture"], "SELECT * FROM range(10001)", checking=True)


def test_cancellation_timeout_and_recovery(exercises):
    exercise = exercises["SQL-006"]
    sql = "WITH RECURSIVE x(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM x) SELECT max(n) FROM x"
    job = SQLJob(exercise, "run", sql=sql)
    time.sleep(.2)
    job.cancel()
    assert job.wait()["error"] == "Cancelled."
    if job._process:
        assert job._process.poll() is not None
    timed = SQLJob(exercise, "run", sql=sql, timeout=.2)
    assert timed.wait()["category"] == "resource limit"
    assert SQLJob(exercise, "run", sql="SELECT 42").wait()["rows"] == [[42]]


def test_worker_failure_and_session_isolation(exercises):
    exercise = exercises["SQL-006"]
    one = SQLJob(exercise, "run", sql="SELECT 10")
    two = SQLJob(exercise, "run", sql="SELECT 20")
    assert one.wait()["rows"] == [[10]]
    assert two.wait()["rows"] == [[20]]
    broken = SQLJob(exercise, "run", sql="SELECT * FROM range(999999999)")
    for _ in range(100):
        if broken._process:
            break
        time.sleep(.01)
    broken._process.kill()
    assert not broken.wait()["ok"]


def test_comparator_duplicates_nulls_decimal_and_order():
    task = {"columns": [{"name":"money","type":"decimal","scale":2}],"ordered":False}
    def result(rows): return {"columns":["money"],"rows":[[r] for r in rows]}
    expected = result([Decimal("1.10"),None,Decimal("1.10")])
    assert compare(result([None,Decimal("1.100"),Decimal("1.10")]),expected,task) == "passed"
    assert compare(result([None,Decimal("1.10")]),expected,task) == "incorrect rows"
    assert compare(result([1.1,None,1.1]),expected,task) == "output shape"
    task["ordered"] = True
    assert compare(result([None,Decimal("1.10"),Decimal("1.10")]),expected,task) == "ordering"


def test_workspace_persistence_backup_and_stale_save(tmp_path, exercises):
    source, target = tmp_path/'one.db', tmp_path/'two.db'
    init_db(source); init_db(target)
    aid = save_attempt(source, {"challenge_id":"SQL-001","started_at":"2026-01-01","status":"In progress"})
    stale = get_attempt(source, aid)
    workspace = new_workspace(exercises["SQL-001"])
    workspace["drafts"]["ranking"] = "SELECT 1"
    save_sql_workspace(source, aid, workspace)
    stale["answer"] = "Reasoning"
    save_attempt_details(source, stale)
    assert get_attempt(source, aid)["sql_workspace"] == workspace
    merge_progress(target, export_progress(source))
    assert get_attempt(target, 1)["sql_workspace"] == workspace
    legacy = export_progress(source)
    legacy["attempts"][0].pop("sql_workspace")
    legacy["attempts"][0]["updated_at"] = "2099-01-01"
    merge_progress(target, legacy)
    assert get_attempt(target, 1)["sql_workspace"] == workspace


def test_private_content_excluded_and_checks_expire(exercises):
    exercise = exercises["SQL-006"]
    challenge = {"id":"SQL-006","title":"Streaks","student":{},"sql_playground":exercise}
    workspace = new_workspace(exercise)
    workspace["drafts"]["streaks"] = "SELECT 1"
    workspace["assessment"] = {"exercise_hash":fingerprint(exercise),"query_hash":answer_hash(exercise,workspace["drafts"]),"results":{"streaks":"incorrect rows"}}
    for text in [student_prompt(challenge,""),evaluation_prompt(challenge,"",{},"",sql_workspace=workspace),json.dumps(public_exercise(exercise))]:
        assert '"reference_queries"' not in text and '"fixtures"' not in text
        assert "QUALIFY ROW_NUMBER()" not in text
    assert "incorrect rows" in evaluation_prompt(challenge,"",{},"",sql_workspace=workspace)
    workspace["drafts"]["streaks"] = "SELECT 2"
    assert "Not checked or outdated" in evaluation_prompt(challenge,"",{},"",sql_workspace=workspace)


def test_invalid_import_reference_and_schema_rejected(exercises):
    exercise = deepcopy(exercises["SQL-006"])
    exercise["tables"][0]["columns"][0]["type"] = "INT); DROP TABLE x; --"
    with pytest.raises(ValueError): validate_exercise(exercise)
    exercise = deepcopy(exercises["SQL-006"])
    exercise["assessment"]["reference_queries"]["streaks"] = "DELETE FROM FactLogin"
    with pytest.raises(ValueError): validate_reference_queries(json.dumps(exercise))
    with pytest.raises(ValueError): validate_workspace({"version":1,"drafts":{"x":{}},"assessment":None})


def test_bundled_bank_matches_authoring_source(exercises):
    bank = json.loads((Path(__file__).resolve().parents[1]/'data/challenges.json').read_text(encoding='utf-8'))
    actual = {c['id']:c['sql_playground'] for c in bank['challenges'] if c.get('sql_playground') and not c.get('data_quality_detective')}
    assert actual == exercises
