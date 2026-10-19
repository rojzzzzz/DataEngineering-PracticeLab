import json
from copy import deepcopy
from pathlib import Path

import pytest

from src.database import init_db, save_attempt, save_detective_workspace, get_attempt, export_progress, merge_progress
from src.detective_models import evidence_is_current, new_detective_workspace, reopen_evidence_in_notebook
from src.sql_models import fingerprint, public_exercise
from src.sql_runner import SQLJob


@pytest.fixture(scope="module")
def cases():
    bank = json.loads((Path(__file__).resolve().parents[1] / "data" / "challenges.json").read_text(encoding="utf-8"))
    return {c["id"]: c["sql_playground"] for c in bank["challenges"] if c.get("data_quality_detective")}


def test_all_cases_have_private_fixtures_and_pass_references(cases):
    assert set(cases) == {"INC-001", "INC-003", "CLN-001", "CLN-002", "CLN-003"}
    for exercise in cases.values():
        assert len(exercise["assessment"]["fixtures"]) >= 2
        assert SQLJob(exercise, "validate").wait()["ok"]
        assert "assessment" not in public_exercise(exercise)
        for table in exercise["tables"]:
            assert any(c["name"] in ("record_id", "line_id", "touch_id", "alias_id", "contract_id") for c in table["columns"])


def test_wrong_repairs_fail(cases):
    wrong = {
        "INC-001": {"revenue": "SELECT date_trunc('month',s.order_date)::DATE AS report_month,SUM(s.net_amount) AS revenue FROM sales_line s LEFT JOIN campaign_touch t USING(order_id) GROUP BY 1"},
        "INC-003": {"valid": "SELECT record_id,batch_id,TRY_CAST(customer_id_text AS BIGINT) AS customer_id,COALESCE(TRY_CAST(amount_text AS DECIMAL(12,2)),0) AS amount,segment_text AS segment FROM raw_event"},
        "CLN-001": {"normalized": "SELECT record_id,source_name,source_key,name_text AS normalized_name,email_text AS normalized_email,phone_text AS phone_digits,region_text AS region FROM raw_customer"},
        "CLN-002": {"clean": "SELECT record_id,shipment_ref,address_text AS street,address_text AS city,address_text AS postal_code,sku_text AS sku,TRY_CAST(ship_date_text AS DATE) AS ship_date FROM raw_shipment"},
        "CLN-003": {"report": "SELECT COUNT(*) AS order_count,CAST(COALESCE(SUM(o.ship_cost),0) AS DECIMAL(18,2)) AS known_shipping_total,0 AS unknown_count,0 AS pending_count,0 AS not_applicable_count,0 AS unmatched_customer_count FROM fact_orders o JOIN customers c USING(customer_id)"},
    }
    for cid, drafts in wrong.items():
        result = SQLJob(cases[cid], "check", drafts=drafts).wait()
        assert result["ok"]
        assert result["results"][next(iter(drafts))] != "passed"


def test_profile_is_bounded_and_public(cases):
    result = SQLJob(cases["INC-001"], "profile", table="sales_line").wait()
    assert result["ok"] and result["row_count"] == 4
    assert result["columns"][0]["column"] == "line_id"
    assert "reason_code" not in json.dumps(result)


def test_fixture_literals_preserve_untrusted_text(cases):
    exercise = deepcopy(cases["INC-001"])
    samples = ["x'; DROP TABLE sales_line; --", "back\\slash's", "niño\nsecond line"]
    for row, sample in zip(exercise["visible_fixture"]["campaign_touch"], samples):
        row[2] = sample
    result = SQLJob(exercise, "run", sql="SELECT campaign FROM campaign_touch ORDER BY touch_id").wait()
    assert result["ok"], result
    assert [row[0] for row in result["rows"][:3]] == samples


def test_evidence_status_and_reopen_preserve_drafts():
    workspace = new_detective_workspace()
    sql = "SELECT 1"
    workspace["notebooks"]["notebook_1"] = sql
    evidence = {"sql": sql, "tab": "notebook_1", "query_hash": fingerprint(sql), "fixture_hash": "case-v1"}
    assert evidence_is_current(evidence, workspace, {}, "case-v1")
    assert not evidence_is_current({**evidence, "query_hash": "wrong"}, workspace, {}, "case-v1")
    assert not evidence_is_current(evidence, workspace, {}, "case-v2")
    assert reopen_evidence_in_notebook(workspace, evidence) == "notebook_1"

    workspace["notebooks"]["notebook_1"] = "SELECT 2"
    assert not evidence_is_current(evidence, workspace, {}, "case-v1")
    assert reopen_evidence_in_notebook(workspace, evidence) == "notebook_2"
    assert workspace["notebooks"] == {"notebook_1": "SELECT 2", "notebook_2": sql}
    assert reopen_evidence_in_notebook(workspace, evidence) == "notebook_2"
    assert len(workspace["notebooks"]) == 2


def test_workspace_backup_roundtrip(tmp_path):
    source, target = tmp_path / "source.db", tmp_path / "target.db"
    init_db(source)
    init_db(target)
    aid = save_attempt(source, {"challenge_id": "INC-001", "status": "In progress", "started_at": "2026-01-01", "updated_at": "2026-01-01"})
    workspace = new_detective_workspace()
    workspace["notebooks"]["notebook_1"] = "SELECT * FROM sales_line"
    workspace["findings"].append({"title": "join", "category": "Grain or join", "tables": "sales_line,campaign_touch", "explanation": "fanout", "impact": "inflated revenue", "action": "preaggregate", "evidence": []})
    save_detective_workspace(source, aid, workspace)
    merge_progress(target, export_progress(source))
    assert get_attempt(target, 1)["detective_workspace"] == workspace
