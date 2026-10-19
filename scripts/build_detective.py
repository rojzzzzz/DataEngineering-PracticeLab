"""Author the five bundled, fixed-date Detective investigations."""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

from src.sql_models import validate_exercise, ddl
from src.sql_runner import validate_reference_queries


def table(name, description, *fields):
    columns = []
    for field in fields:
        name_, kind, nullable, key = (field.split("|", 3) + [""] * 4)[:4]
        columns.append({"name": name_, "type": kind, "nullable": nullable == "?", "key": key})
    return {"name": name, "description": description, "columns": columns}


def task(id_, title, description, columns, sql, ordered=False):
    output = []
    for spec in columns.split(","):
        bits = spec.split(":")
        column = {"name": bits[0], "type": bits[1]}
        if len(bits) == 3:
            column["scale"] = int(bits[2])
        output.append(column)
    return {"id": id_, "title": title, "description": description, "columns": output, "ordered": ordered}, sql


def case(tables, visible, clean, edge, tasks, symptom, context, rules, evidence, invariants=None):
    spec = {"version": 1, "dialect": "duckdb", "tables": tables, "visible_fixture": visible,
            "tasks": [t for t, _ in tasks], "assessment": {"reference_queries": {t["id"]: q for t, q in tasks}, "fixtures": [clean, edge], "invariants": invariants or []}}
    validate_exercise(spec)
    validate_reference_queries(json.dumps(spec, sort_keys=True))
    meta = {"version": 1, "symptom": symptom, "business_context": context, "business_rules": rules,
            "supplied_evidence": evidence, "finding_categories": ["Grain or join", "Schema contract", "Parsing", "Identity", "Missing values", "Lineage and alerting", "Other"]}
    return spec, meta


def build():
    result = {}
    sales = table("sales_line", "Immutable order lines; line_id is the practice record identifier. Reporting month is fixed from order_date.",
                  "line_id|BIGINT|!|Practice record ID", "order_id|BIGINT|!|Business order", "order_date|DATE|!|", "net_amount|DECIMAL(12,2)|!|")
    touch = table("campaign_touch", "Repeated touches of the same campaign are possible; touch_id identifies each source record.",
                  "touch_id|BIGINT|!|Practice record ID", "order_id|BIGINT|!|", "campaign|VARCHAR|!|")
    visible = {"sales_line": [[1,10,"2026-01-04","10.00"],[2,10,"2026-01-04","10.00"],[3,11,"2026-01-05","7.00"],[4,12,"2026-02-01","0.00"]],
               "campaign_touch": [[101,10,"A"],[102,10,"A"],[103,10,"B"],[104,12,"C"]]}
    clean = {"sales_line": [[5,13,"2026-03-01","12.00"]], "campaign_touch": [[105,13,"D"]]}
    edge = {"sales_line": [[6,20,"2026-04-01","0.01"],[7,20,"2026-04-01","0.01"],[8,21,"2026-04-02","1.00"]],
            "campaign_touch": [[106,20,"Z"],[107,20,"A"],[108,20,"Z"]]}
    eligible = "WITH line_totals AS (SELECT order_id, date_trunc('month',order_date)::DATE AS report_month, SUM(net_amount) AS amount FROM sales_line GROUP BY 1,2), eligible AS (SELECT DISTINCT order_id,campaign FROM campaign_touch)"
    allocation = eligible + """, shares AS (SELECT l.report_month,l.order_id,COALESCE(e.campaign,'unattributed') AS campaign,l.amount,
       COUNT(*) OVER(PARTITION BY l.order_id,l.report_month) AS n,
       ROW_NUMBER() OVER(PARTITION BY l.order_id,l.report_month ORDER BY e.campaign NULLS LAST) AS rn
       FROM line_totals l LEFT JOIN eligible e USING(order_id)), cents AS (
       SELECT report_month,campaign, CASE WHEN rn=1 THEN CAST(ROUND(amount*100,0) AS BIGINT) - CAST(FLOOR(amount*100/n) AS BIGINT)*(n-1)
       ELSE CAST(FLOOR(amount*100/n) AS BIGINT) END AS cents FROM shares)
       SELECT report_month,campaign,CAST(SUM(cents)/100.0 AS DECIMAL(18,2)) AS allocated_revenue FROM cents GROUP BY 1,2"""
    result["INC-001"] = case([sales,touch], visible,clean,edge,[
        task("revenue", "Correct revenue by month", "One row per reporting month. Sum each immutable sales line once; duplicate amounts are legitimate. Two decimal places.", "report_month:date,revenue:decimal:2", "SELECT date_trunc('month',order_date)::DATE AS report_month,CAST(SUM(net_amount) AS DECIMAL(18,2)) AS revenue FROM sales_line GROUP BY 1"),
        task("allocation", "Campaign allocation", "One row per month/campaign. Distinct campaigns per order share order revenue equally. No campaign uses 'unattributed'. Round to cents by flooring equal shares and assign remaining cents to the alphabetically first campaign. Sum must reconcile to revenue.", "report_month:date,campaign:string,allocated_revenue:decimal:2", allocation)],
        "Published revenue doubled after a campaign touchpoint join.", "Sales is one row per line. The dashboard joined touchpoints before summing money.",
        "Report at month grain. Campaign attribution is separate and uses distinct eligible campaigns per order; no campaigns means unattributed. Repeated touchpoints never increase revenue.",
        "Faulty report: SELECT date_trunc('month',s.order_date), SUM(s.net_amount) FROM sales_line s LEFT JOIN campaign_touch t USING(order_id) GROUP BY 1. Trace sales_line → join → dashboard; campaign_touch is a one-to-many branch.",
        [{"type": "sum_match", "left": "revenue", "right": "allocation", "group_left": "report_month", "group_right": "report_month", "value_left": "revenue", "value_right": "allocated_revenue"}])

    contract = table("source_contract", "Previous/current contract snapshots. Added optional fields are compatible; changed required-field types are not.",
                     "contract_id|BIGINT|!|Practice record ID", "version|VARCHAR|!|", "field_name|VARCHAR|!|", "declared_type|VARCHAR|!|", "required|BOOLEAN|!|")
    batch = table("raw_event", "Raw current batches. amount_text may be malformed after a producer type change.",
                  "record_id|BIGINT|!|Practice record ID", "batch_id|VARCHAR|!|", "customer_id_text|VARCHAR|?|", "amount_text|VARCHAR|?|", "segment_text|VARCHAR|?|", "campaign_tag|VARCHAR|?|")
    visible = {"source_contract": [[1,"previous","customer_id","INTEGER",True],[2,"previous","amount","DECIMAL(12,2)",True],[3,"previous","segment","VARCHAR",True],[4,"current","customer_id","VARCHAR",True],[5,"current","amount","VARCHAR",True],[6,"current","segment","VARCHAR",True],[7,"current","campaign_tag","VARCHAR",False]],
               "raw_event": [[1,"B1","12","10.50","retail","fall"],[2,"B1","x7","9.00","retail",None],[3,"B2","13","bad","business",None],[4,"B2","14","0.00","",None]]}
    clean = deepcopy(visible); clean["raw_event"] = [[5,"B3","20","2.00","retail",None]]
    edge = deepcopy(visible); edge["raw_event"] = [[6,"B4",None,"3.00","retail",None],[7,"B4","21",None,"retail",None],[8,"B4","22","1.234","business",None],[9,"B4","23","4.00","business",None]]
    parsed = "WITH p AS (SELECT record_id,batch_id,TRY_CAST(customer_id_text AS BIGINT) AS customer_id,TRY_CAST(amount_text AS DECIMAL(12,2)) AS amount,TRIM(segment_text) AS segment, CASE WHEN customer_id_text IS NULL OR NOT regexp_full_match(customer_id_text,'[0-9]+') OR TRY_CAST(customer_id_text AS BIGINT) IS NULL THEN 'BAD_CUSTOMER_ID' WHEN amount_text IS NULL OR NOT regexp_full_match(amount_text,'[0-9]+(\\.[0-9]{1,2})?') OR TRY_CAST(amount_text AS DECIMAL(12,2)) IS NULL THEN 'BAD_AMOUNT' WHEN segment_text IS NULL OR TRIM(segment_text)='' THEN 'MISSING_SEGMENT' END AS reason_code FROM raw_event)"
    result["INC-003"] = case([contract,batch],visible,clean,edge,[
        task("valid", "Typed valid events", "One row per valid source record, typed without silent zero defaults. Added optional campaign_tag is compatible and does not affect validity.", "record_id:integer,batch_id:string,customer_id:integer,amount:decimal:2,segment:string", parsed+" SELECT record_id,batch_id,customer_id,amount,segment FROM p WHERE reason_code IS NULL"),
        task("quarantine", "Quarantine", "One row per rejected source record. Reason precedence: bad customer ID, bad amount, missing segment. Clean and quarantine cover every raw_event exactly once.", "record_id:integer,reason_code:string", parsed+" SELECT record_id,reason_code FROM p WHERE reason_code IS NOT NULL")],
        "Nightly load succeeded, while downstream revenue and segment reports became wrong without an alert.",
        "Producer changed required customer_id and amount types and added optional campaign_tag. raw_event → typed staging → revenue and segment reports.",
        "Required customer_id is unsigned integer text; amount is nonnegative decimal text with at most two fractional digits; segment is nonblank. Quarantine malformed records. An optional added field is compatible; required type drift requires an alert and review.",
        "Previous/current source_contract snapshots, raw_event batches, and faulty transformation: COALESCE(TRY_CAST(amount_text AS DECIMAL(12,2)),0) AS amount. Dependencies: raw_event → typed staging → revenue_report, segment_report.",
        [{"type": "partition", "source": "raw_event", "source_key": "record_id", "outputs": ["valid", "quarantine"], "output_key": "record_id"}])

    customer = table("raw_customer", "Three source feeds. Do not invent identity when matching keys disagree.",
                     "record_id|BIGINT|!|Practice record ID", "source_name|VARCHAR|!|", "source_key|VARCHAR|!|", "name_text|VARCHAR|!|", "email_text|VARCHAR|?|", "phone_text|VARCHAR|?|", "region_text|VARCHAR|?|")
    aliases = table("region_alias", "Documented aliases; match case insensitively after trim.", "alias_id|BIGINT|!|Practice record ID", "alias|VARCHAR|!|", "canonical_region|VARCHAR|!|")
    visible = {"raw_customer": [[1,"crm","C1"," Ada Lee ","ADA@example.com","555-0101","N"],[2,"web","W4","ada lee","ada@example.com","5550101","north"],[3,"support","S8","Bo Kay","bo@exampl.com",None,"S"],[4,"web","W5","Bo Kay",None,None,"south"],[5,"crm","C2","Cy Xu",None,"555 0199","N"]],
               "region_alias": [[1,"N","North"],[2,"north","North"],[3,"S","South"],[4,"south","South"]]}
    clean = {"raw_customer": [[6,"crm","C3","Di Fox","di@example.org",None,"S"]], "region_alias": deepcopy(visible["region_alias"])}
    edge = {"raw_customer": [[7,"crm","C4","A B","a@example.org",None,"N"],[8,"web","W6","A B","a@example.org",None,"N"],[9,"support","S9","A B","different@example.org",None,"N"],[10,"web","W7","E F",None,"555-0000","S"]], "region_alias": deepcopy(visible["region_alias"])}
    normalized = "WITH n AS (SELECT r.record_id,r.source_name,r.source_key,lower(regexp_replace(trim(r.name_text),' +',' ','g')) AS normalized_name,lower(trim(r.email_text)) AS normalized_email,regexp_replace(r.phone_text,'[^0-9]','','g') AS phone_digits,a.canonical_region AS region FROM raw_customer r LEFT JOIN region_alias a ON lower(trim(r.region_text))=lower(trim(a.alias)))"
    result["CLN-001"] = case([customer,aliases],visible,clean,edge,[
        task("normalized", "Normalized source records", "Every source record once. Lowercase and collapse name spaces, lowercase email only, strip phone punctuation without inferring a country, map documented region aliases. Preserve malformed domains as supplied.", "record_id:integer,source_name:string,source_key:string,normalized_name:string,normalized_email:string,phone_digits:string,region:string", normalized+" SELECT * FROM n"),
        task("review", "Duplicate and review decisions", "Match only on a shared nonblank normalized email. Group ID is the smallest record_id in an email group; unmatched records use their own ID. A repeated name without shared email is review, not an automatic merge. Source priority: crm, web, support. Preferred record is the highest-priority record in each exact-email group.", "record_id:integer,group_id:integer,decision:string,preferred_record_id:integer", normalized+""", grouped AS (SELECT *, MIN(record_id) OVER(PARTITION BY normalized_email) AS email_group, COUNT(*) OVER(PARTITION BY normalized_email) AS email_count FROM n), ranked AS (SELECT *, FIRST_VALUE(record_id) OVER(PARTITION BY normalized_email ORDER BY CASE source_name WHEN 'crm' THEN 1 WHEN 'web' THEN 2 ELSE 3 END,record_id) AS preferred FROM grouped) SELECT r.record_id,CASE WHEN r.normalized_email IS NOT NULL AND r.normalized_email<>'' THEN r.email_group ELSE r.record_id END AS group_id,CASE WHEN r.normalized_email IS NOT NULL AND r.normalized_email<>'' AND r.email_count>1 THEN 'duplicate' WHEN EXISTS(SELECT 1 FROM n x WHERE x.record_id<>r.record_id AND x.normalized_name=r.normalized_name) THEN 'review' ELSE 'unique' END AS decision,CASE WHEN r.normalized_email IS NOT NULL AND r.normalized_email<>'' THEN r.preferred ELSE r.record_id END AS preferred_record_id FROM ranked r""")],
        "Three feeds contain inconsistent customer text and possible duplicate identities.", "CRM has priority over web, then support for exact-match groups.",
        "Normalize only documented text transformations. Exact nonblank email is the sole automatic match key. Shared names without matching email require review. Never guess a corrected email domain or phone country.",
        "raw_customer source rows and region_alias mapping. Keep record_id through every normalization and decision.",
        [{"type": "coverage", "source": "raw_customer", "source_key": "record_id", "outputs": ["normalized", "review"], "output_key": "record_id"}])

    shipment = table("raw_shipment", "Address grammar: STREET | CITY | POSTAL. Accepted dates: YYYY-MM-DD or YYYY/MM/DD only.",
                     "record_id|BIGINT|!|Practice record ID", "shipment_ref|VARCHAR|!|", "address_text|VARCHAR|?|", "sku_text|VARCHAR|?|", "ship_date_text|VARCHAR|?|")
    visible = {"raw_shipment": [[1,"A","12 Oak | Reno | 89501","SKU-123","2026-01-03"],[2,"B","bad address","SKU-124","2026-01-04"],[3,"C","8 Elm | Boise | 83701","BAD","2026-01-04"],[4,"D","5 Pine | Reno | 89502","SKU-125","01/02/2026"],[5,"E","9 Main | Reno | 89503","SKU-126","2026/02/30"]]}
    clean = {"raw_shipment": [[6,"F","1 West | Boise | 83702","SKU-001","2026/02/28"]]}
    edge = {"raw_shipment": [[7,"G",None,"bad","bad"],[8,"H","1 A | B | 12345","SKU-002",None],[9,"I","1 A | B | 12345","SKU-003","2024-02-29"]]}
    parse = "WITH p AS (SELECT record_id,shipment_ref,address_text,sku_text,ship_date_text,string_split(address_text,'|') AS parts,CASE WHEN regexp_full_match(ship_date_text,'[0-9]{4}-[0-9]{2}-[0-9]{2}') THEN TRY_CAST(ship_date_text AS DATE) WHEN regexp_full_match(ship_date_text,'[0-9]{4}/[0-9]{2}/[0-9]{2}') THEN TRY_STRPTIME(ship_date_text,'%Y/%m/%d')::DATE END AS ship_date FROM raw_shipment), q AS (SELECT *,CASE WHEN address_text IS NULL OR len(parts)<>3 OR trim(parts[1])='' OR trim(parts[2])='' OR NOT regexp_full_match(trim(parts[3]),'[0-9]{5}') THEN 'BAD_ADDRESS' WHEN sku_text IS NULL OR NOT regexp_full_match(sku_text,'SKU-[0-9]{3}') THEN 'BAD_SKU' WHEN ship_date IS NULL THEN 'BAD_DATE' END AS reason_code FROM p)"
    result["CLN-002"] = case([shipment],visible,clean,edge,[
        task("clean", "Clean shipments", "One row per valid source record. Trim address parts; five-digit postal code; SKU-[0-9]{3}; dates YYYY-MM-DD or YYYY/MM/DD only. Preserve record_id and shipment_ref.", "record_id:integer,shipment_ref:string,street:string,city:string,postal_code:string,sku:string,ship_date:date", parse+" SELECT record_id,shipment_ref,trim(parts[1]) AS street,trim(parts[2]) AS city,trim(parts[3]) AS postal_code,sku_text AS sku,ship_date FROM q WHERE reason_code IS NULL"),
        task("quarantine", "Quarantined shipments", "Every invalid row once. Reason precedence: BAD_ADDRESS, BAD_SKU, BAD_DATE. Ambiguous slash dates are invalid.", "record_id:integer,shipment_ref:string,reason_code:string", parse+" SELECT record_id,shipment_ref,reason_code FROM q WHERE reason_code IS NOT NULL")],
        "Legacy free-text fields create malformed shipments and silent row loss.", "A fixed import batch must be split into clean and quarantine outputs.",
        "Address is STREET | CITY | exactly five postal digits. SKU is uppercase SKU- plus three digits. Dates accept only unambiguous YYYY-MM-DD or YYYY/MM/DD. The first defect by address, SKU, date precedence is the reason code.",
        "raw_shipment is immutable. Every record_id must appear in exactly one output.",
        [{"type": "partition", "source": "raw_shipment", "source_key": "record_id", "outputs": ["clean", "quarantine"], "output_key": "record_id"}])

    orders = table("fact_orders", "Explicit lifecycle and availability states define missing-value meaning.",
                   "record_id|BIGINT|!|Practice record ID", "order_id|BIGINT|!|Business order", "customer_id|BIGINT|?|", "lifecycle|VARCHAR|!|open, shipped, cancelled", "shipping_state|VARCHAR|!|known, unknown, pending, not_applicable", "ship_cost|DECIMAL(12,2)|?|", "discount_state|VARCHAR|!|known, unknown, pending, not_applicable", "discount_pct|DECIMAL(5,4)|?|")
    customers = table("customers", "Known customers; missing references remain unmatched.", "record_id|BIGINT|!|Practice record ID", "customer_id|BIGINT|!|Business key", "customer_name|VARCHAR|!|")
    visible = {"fact_orders": [[1,1,1,"shipped","known","10.00","known","0.0000"],[2,2,2,"open","pending",None,"pending",None],[3,3,None,"cancelled","not_applicable",None,"not_applicable",None],[4,4,99,"shipped","unknown",None,"unknown",None],[5,5,1,"shipped","known","0.00","known","0.1000"]], "customers": [[1,1,"Ada"],[2,2,"Bo"]]}
    clean = {"fact_orders": [[6,6,1,"shipped","known","2.50","known","0.0000"]], "customers": [[1,1,"Ada"]]}
    edge = {"fact_orders": [[7,7,3,"open","pending",None,"known","0.0000"],[8,8,None,"shipped","unknown",None,"pending",None],[9,9,4,"cancelled","not_applicable",None,"not_applicable",None]], "customers": [[3,3,"Cy"],[4,4,"Dee"]]}
    classified = "SELECT o.record_id,o.order_id,o.lifecycle,o.shipping_state AS shipping_meaning,CASE WHEN o.shipping_state='known' THEN o.ship_cost END AS known_ship_cost,o.discount_state AS discount_meaning,CASE WHEN o.discount_state='known' THEN o.discount_pct END AS known_discount_pct,c.customer_id IS NULL AS unmatched_customer FROM fact_orders o LEFT JOIN customers c ON o.customer_id=c.customer_id"
    result["CLN-003"] = case([orders,customers],visible,clean,edge,[
        task("classified", "Classified orders", "Every order once with its explicit shipping and discount states. Known zero is a legitimate zero; other states retain NULL. LEFT JOIN keeps unmatched references.", "record_id:integer,order_id:integer,lifecycle:string,shipping_meaning:string,known_ship_cost:decimal:2,discount_meaning:string,known_discount_pct:decimal:4,unmatched_customer:boolean", classified),
        task("report", "Corrected aggregate", "One row: every order counted once; only known shipping costs summed, with zero for an empty sum; count unknown, pending, not applicable and unmatched separately.", "order_count:integer,known_shipping_total:decimal:2,unknown_count:integer,pending_count:integer,not_applicable_count:integer,unmatched_customer_count:integer", "SELECT COUNT(*) AS order_count,CAST(COALESCE(SUM(o.ship_cost) FILTER(WHERE o.shipping_state='known'),0) AS DECIMAL(18,2)) AS known_shipping_total,COUNT(*) FILTER(WHERE o.shipping_state='unknown') AS unknown_count,COUNT(*) FILTER(WHERE o.shipping_state='pending') AS pending_count,COUNT(*) FILTER(WHERE o.shipping_state='not_applicable') AS not_applicable_count,COUNT(*) FILTER(WHERE c.customer_id IS NULL) AS unmatched_customer_count FROM fact_orders o LEFT JOIN customers c ON o.customer_id=c.customer_id")],
        "A report treats every missing value as zero and drops unmatched customer references.", "Order lifecycle and availability status arrive independently; late values may still be pending.",
        "Use explicit status fields to distinguish unknown, pending and not applicable. A known zero is meaningful. Keep unmatched customers and all orders in the reporting denominator.",
        "fact_orders → customer lookup → aggregate. The faulty inner join and COALESCE(ship_cost,0) erase meaning.",
        [{"type": "coverage", "source": "fact_orders", "source_key": "record_id", "outputs": ["classified"], "output_key": "record_id"}])
    return result


def main():
    path = Path(__file__).resolve().parents[1] / "data" / "challenges.json"
    bank = json.loads(path.read_text(encoding="utf-8"))
    cases = build()
    for challenge in bank["challenges"]:
        if challenge["id"] not in cases:
            continue
        spec, metadata = cases[challenge["id"]]
        challenge["sql_playground"] = spec
        challenge["data_quality_detective"] = metadata
        challenge["student"]["create_table_block"] = ddl(spec)
        challenge["student"]["scenario"] = metadata["symptom"] + " " + metadata["business_context"]
        challenge["student"]["requirements"] = [metadata["business_rules"], "Investigate and attach executed evidence to findings.", "Produce every required repair output."]
        challenge["student"]["tasks"] = [t["description"] for t in spec["tasks"]]
        challenge["student"]["constraints"] = ["DuckDB SELECT-only queries over immutable source tables.", "Checks assess outputs; reasoning is assessed separately."]
        challenge["student"]["deliverables"] = [t["title"] for t in spec["tasks"]] + ["Findings, root cause, business impact, prevention"]
    path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
