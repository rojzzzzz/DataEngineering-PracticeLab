import json
from pathlib import Path
import pytest
from src.sql_tools import DIALECTS, convert_sql, visualize_sql
from src.sql_plan_parser import parse_plan


def test_text_plan_structured_details_and_separate_summary():
    graph = parse_plan("""Sort  (cost=10.00..20.00 rows=10 width=8) (actual time=2.00..3.00 rows=120 loops=2)
  Sort Key: sales.amount
  Sort Method: external merge  Disk: 1024kB
  Buffers: shared hit=20 read=3, temp read=2 written=4
  ->  Seq Scan on sales  (cost=0.00..8.00 rows=10 width=8) (actual rows=120 loops=2)
        Filter: (amount > 100)
        Rows Removed by Filter: 5
        Workers Planned: 2
        Worker 0: actual time=0.01..0.02 rows=60 loops=1
          Buffers: shared hit=999
Planning:
  Buffers: shared hit=777
Planning Time: 0.42 ms
Execution Time: 6.00 ms""")
    root, scan = [n["properties"] for n in graph["nodes"]]
    assert root["Sort Space Type"] == "Disk"
    assert root["Sort Space Used"] == 1024
    assert root["Shared Hit Blocks"] == 20
    assert root["Temp Written Blocks"] == 4
    assert root["Actual Total Time"] == 3
    assert scan["Actual Rows"] == 120
    assert "Actual Total Time" not in scan
    assert scan["Filter"] == "(amount > 100)"
    assert scan["Rows Removed by Filter"] == 5
    assert "Shared Hit Blocks" not in scan
    assert any("999" in detail for detail in scan["Details"])
    assert graph["summary"]["Plan 1"] == {"Planning Time": 0.42, "Execution Time": 6}
    assert "Buffers: shared hit=777" in graph["summary"]["Details"]


def test_text_plan_hash_metrics_and_never_executed():
    graph = parse_plan("""Hash  (cost=1.00..2.00 rows=3 width=8)
  Buckets: 1024  Batches: 4  Memory Usage: 44kB
  ->  Seq Scan on sales  (cost=0.00..1.00 rows=3 width=8) (never executed)""")
    root, scan = [n["properties"] for n in graph["nodes"]]
    assert root["Hash Batches"] == 4
    assert root["Hash Buckets"] == 1024
    assert root["Peak Memory Usage"] == 44
    assert scan["Never Executed"] is True
    assert "Actual Rows" not in scan


@pytest.mark.parametrize("source", ['{"Plan":{"Node Type":"Result","Total Cost":1e309}}', 'Result (cost=0..1e309 rows=1 width=8)', 'Result\nExecution Time: 1e309 ms'])
def test_plan_rejects_overflow_metrics(source):
    with pytest.raises(ValueError):
        parse_plan(source)
from src.sql_tools_worker import handle
from src.sql_tools_component import run_request


@pytest.mark.parametrize("source", DIALECTS)
@pytest.mark.parametrize("target", DIALECTS)
def test_conversion_matrix(source, target):
    result = convert_sql("SELECT id, COUNT(*) AS total FROM orders WHERE amount > 10 GROUP BY id; SELECT 1 AS n", source, target)
    assert "COUNT" in result["sql"]
    assert result["sql"].count(";") == 2
    assert "not executed" in result["diagnostics"][0]


@pytest.mark.parametrize("source,target,query,expected", [
    ("postgres", "bigquery", 'SELECT "order" FROM "sales" LIMIT 5', '`order`'),
    ("bigquery", "postgres", 'SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)', 'INTERVAL'),
    ("snowflake", "tsql", 'SELECT * FROM sales LIMIT 5', 'TOP 5'),
    ("spark", "bigquery", 'SELECT ARRAY(1, 2)', '['),
])
def test_specific_conversions(source, target, query, expected):
    assert expected in convert_sql(query, source, target)["sql"]


def test_errors_do_not_produce_partial_output():
    with pytest.raises(Exception):
        convert_sql("SELECT (", "postgres", "bigquery")
    with pytest.raises(ValueError, match="Template"):
        convert_sql("SELECT * FROM {{ ref('orders') }}", "postgres", "spark")
    with pytest.raises(ValueError):
        convert_sql("SELECT 1", "unknown", "spark")
    # SQLGlot explicitly cannot preserve TABLESAMPLE in SQLite.
    with pytest.raises(ValueError, match="Statement 2"):
        convert_sql("SELECT 1; SELECT * FROM sales TABLESAMPLE BERNOULLI (10)", "postgres", "sqlite")


def test_cte_graph_scope_and_union_order():
    graph = visualize_sql("WITH A AS (SELECT id FROM one) SELECT * FROM a x LEFT JOIN two x2 ON x.id=x2.id UNION ALL SELECT * FROM (WITH a AS (SELECT id FROM three) SELECT * FROM a) q", "postgres")
    ctes = [node for node in graph["nodes"] if node["kind"] == "cte"]
    refs = [node for node in graph["nodes"] if node["kind"] == "cte-reference"]
    assert len(ctes) == 2 and len(refs) == 2
    targets = [edge["source"] for edge in graph["edges"] if edge["label"] == "CTE reference"]
    assert len(set(targets)) == 2
    assert any(n["label"] == "UNION ALL" for n in graph["nodes"])
    assert any(n["label"] == "LEFT JOIN" and n["properties"]["condition"] == "x.id = x2.id" for n in graph["nodes"])
    assert any(e["label"] == "left branch" for e in graph["edges"])


def test_recursive_graph_and_query_operations():
    graph = visualize_sql("WITH RECURSIVE n AS (SELECT 1 AS id UNION ALL SELECT id+1 FROM n WHERE id<5) SELECT id, count(*) FROM n GROUP BY id HAVING count(*)>0 ORDER BY id LIMIT 2", "postgres")
    assert any(e["back"] for e in graph["edges"])
    labels = {n["label"] for n in graph["nodes"]}
    assert {"Filter", "Group / aggregate", "Having", "Sort", "Limit"} <= labels
    assert "Aggregate" in {n["label"] for n in visualize_sql("SELECT COUNT(*) FROM x", "postgres")["nodes"]}
    assert len([n for n in visualize_sql("SELECT * FROM a JOIN b ON a.id=(SELECT MAX(id) FROM c)", "postgres")["nodes"] if n["kind"] == "subquery"]) == 1


def test_union_distinct_join_variants_and_statement_selection():
    graph = visualize_sql("SELECT 1; SELECT * FROM a CROSS JOIN b UNION SELECT * FROM c FULL JOIN d USING(id)", "postgres", 1)
    assert graph["statementCount"] == 2
    assert {"CROSS JOIN", "FULL JOIN", "UNION"} <= {n["label"] for n in graph["nodes"]}
    with pytest.raises(ValueError, match="statement"):
        visualize_sql("SELECT 1", "postgres", 2)
    with pytest.raises(ValueError, match="support"):
        visualize_sql("DELETE FROM orders", "postgres")
    with pytest.raises(ValueError, match="support"):
        visualize_sql("SELECT * FROM generate_series(1, 3)", "postgres")


def test_json_plan_metrics_and_unknown_properties():
    source = [{"Plan": {"Node Type":"Nested Loop", "Actual Total Time":2.5, "Plans":[
        {"Node Type":"Seq Scan", "Relation Name":"a", "Plan Rows":3, "Custom Field":{"a":1}},
        {"Node Type":"Index Scan", "Actual Loops":3, "Workers":[{"Worker Number":0,"Actual Rows":1}]}]}, "Execution Time":3.5}]
    graph = parse_plan(json.dumps(source))
    assert len(graph["nodes"]) == 3
    assert graph["summary"]["Plan 1"]["Execution Time"] == 3.5
    assert graph["nodes"][1]["properties"]["Custom Field"] == {"a":1}
    assert "Actual Total Time" not in graph["nodes"][1]["properties"]


def test_text_plan_nested_parallel_subplans():
    source = """QUERY PLAN
----------------
Gather  (cost=10.00..30.00 rows=10 width=8) (actual time=0.1..0.8 rows=10 loops=1)
  Workers Planned: 2
  ->  Parallel Seq Scan on sales  (cost=0.00..10.00 rows=5 width=8)
        Filter: (amount > 10)
        Worker 0: actual time=0.1..0.2 rows=3 loops=1
        SubPlan 1
          ->  Index Scan on lookup (cost=0.00..1.00 rows=1 width=4)
                Index Cond: (id = sales.id)
Planning Time: 0.1 ms
Execution Time: 1.0 ms
(10 rows)
"""
    graph = parse_plan(source)
    assert len(graph["nodes"]) == 4
    assert graph["nodes"][0]["properties"]["Actual Total Time"] == .8
    assert graph["nodes"][1]["properties"]["Plan Rows"] == 5
    assert "Execution Time: 1.0 ms" in graph["summary"]["Details"]
    assert parse_plan("Seq Scan on sales")["nodes"][0]["properties"] == {"Raw":"Seq Scan on sales"}


@pytest.mark.parametrize("value", ["EXPLAIN SELECT 1", "garbage", "[]", '{"Plan":{}}', "Seq Scan on a\n-> Index Scan on b", "Seq Scan on a\nLimit"])
def test_plan_errors(value):
    with pytest.raises((ValueError, json.JSONDecodeError)):
        parse_plan(value)


def test_limits_and_disposable_worker():
    with pytest.raises(ValueError):
        parse_plan('{"Plan":{"Node Type":"Result","Plan Rows":NaN}}')
    with pytest.raises(ValueError, match="200,000"):
        convert_sql(" " * 200001, "postgres", "spark")
    with pytest.raises(ValueError, match="2 MB"):
        parse_plan("x" * 2000001)
    node = {"Node Type":"Append", "Plans":[{"Node Type":"Result"} for _ in range(500)]}
    with pytest.raises(ValueError, match="500"):
        parse_plan(json.dumps({"Plan":node}))
    request = {"workspaceId":"w", "id":"a", "revision":1,"action":"convert", "sql":"SELECT 1", "dialect":"postgres", "target":"spark"}
    response = run_request(request)
    assert response["ok"] and response["workspaceId"] == "w" and response["revision"] == 1
    assert not run_request(request, timeout=.001)["ok"]
    assert not run_request({**request, "action":"run"})["ok"]


def test_prewarmed_tools_requests_remain_independent():
    from src.sql_tools_component import prewarm_sql_tools

    prewarm_sql_tools()
    request = {"workspaceId":"w", "id":"first", "revision":1, "action":"convert",
               "sql":"SELECT 1", "dialect":"postgres", "target":"bigquery"}
    first = run_request(request)
    second = run_request({**request, "id":"second", "revision":2, "sql":"SELECT 2"})
    assert first["ok"] and second["ok"]
    assert first["id"] == "first" and first["result"]["sql"] == "SELECT\n  1;"
    assert second["id"] == "second" and second["revision"] == 2
    assert second["result"]["sql"] == "SELECT\n  2;"


@pytest.mark.parametrize("tool_request,unneeded", [
    ({"action": "explain", "plan": '{"Plan":{"Node Type":"Result","Plan Rows":0}}'}, ["sqlglot", "sqlfmt"]),
    ({"action": "convert", "sql": "SELECT 1", "dialect": "postgres", "target": "bigquery"}, ["sqlfmt"]),
    ({"action": "format", "sql": "select 1"}, ["sqlglot"]),
])
def test_cold_worker_does_not_load_unrelated_engines(tool_request, unneeded):
    import subprocess
    import sys
    from pathlib import Path
    code = """import json, sys
from src.sql_tools_worker import handle
request = json.loads(sys.stdin.read())
result = handle(request)
print(json.dumps({"result":result,"modules":list(sys.modules)}))
"""
    output = subprocess.run([sys.executable, "-c", code], input=json.dumps(tool_request),
                            capture_output=True, text=True, timeout=5,
                            cwd=Path(__file__).resolve().parents[1], check=True)
    response = json.loads(output.stdout)
    assert response["result"]
    for name in unneeded:
        assert not any(module == name or module.startswith(name + ".") for module in response["modules"])


def test_closed_workspace_ignores_late_component_callback(monkeypatch):
    from src import sql_tools_component as component
    state = {}
    callbacks = []
    monkeypatch.setattr(component.st, "session_state", state)
    monkeypatch.setattr(component, "_component", lambda: lambda **args: callbacks.append(args["on_request_change"]))
    component.render_sql_tools.__wrapped__(None)
    component.close_sql_tools()
    callbacks[0]()
    assert state == {}
    component.render_sql_tools.__wrapped__(None)
    new_workspace = state["sql_tools_workspace"]
    callbacks[0]()
    assert state == {"sql_tools_workspace": new_workspace}


def test_conversion_parse_error_identifies_statement():
    with pytest.raises(ValueError, match="Statement 2, line 2"):
        convert_sql("SELECT ';' AS punctuation;\nSELECT FROM;", "postgres", "bigquery")
