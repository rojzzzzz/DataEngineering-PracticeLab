"""Rebuild the nine bundled SQL exercises without replacing unrelated bank content."""
from copy import deepcopy
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from src.sql_models import ddl, validate_exercise


def table(name, description, *columns):
    parsed = []
    for specification in columns:
        parts = specification.split(" ", 2)
        parsed.append({"name": parts[0], "type": parts[1].rstrip("!"), "nullable": not parts[1].endswith("!"), "key": parts[2] if len(parts) == 3 else ""})
    return {"name": name, "description": description, "columns": parsed}


def task(id, title, description, columns, query, ordered=False):
    output = []
    for specification in columns.split(","):
        name, kind, *scale = specification.split(":")
        output.append({"name": name, "type": kind, **({"scale": int(scale[0])} if scale else {})})
    return {"id": id, "title": title, "description": description, "columns": output, "ordered": ordered}, query


def exercise(tables, visible, answers, edge):
    # Empty business tables are a real edge case; context/calendar tables remain.
    empty = {name: deepcopy(rows) if name in ("exercise_context", "DimDate", "DimTerm") else [] for name, rows in visible.items()}
    return {"version": 1, "dialect": "duckdb", "tables": tables, "visible_fixture": visible,
        "tasks": [t for t, _ in answers], "assessment": {
            "fixtures": [empty, edge], "reference_queries": {t["id"]: sql.strip() for t, sql in answers}}}


def build():
    result = {}
    tables = [
        table("exercise_context", "One reproducible business reporting date; derive boundaries from this row.", "as_of_date DATE!"),
        table("DimDate", "Calendar dates.", "DateKey INTEGER! Primary key", "FullDate DATE!"),
        table("DimProduct", "Product catalogue.", "ProductKey INTEGER! Primary key", "ProductName VARCHAR!"),
        table("DimStore", "Store to region mapping.", "StoreKey INTEGER! Primary key", "RegionName VARCHAR!"),
        table("FactSales", "Sales lines; NetRevenue already accounts for quantity and discounts.", "DateKey INTEGER! References DimDate", "ProductKey INTEGER! References DimProduct", "StoreKey INTEGER! References DimStore", "NetRevenue DECIMAL(14,2)!", "SaleStatus VARCHAR!")]
    visible = {"exercise_context": [["2026-05-15"]], "DimDate": [[1,"2026-01-01"],[2,"2026-03-31"],[3,"2026-04-01"],[4,"2025-12-31"]],
        "DimProduct": [[1,"Notebook"],[2,"Monitor"],[3,"Keyboard"],[4,"Mouse"],[5,"Dock"]], "DimStore": [[1,"North"],[2,"South"],[3,"North"]],
        "FactSales": [[1,1,1,"100.00","completed"],[2,1,3,"50.00","completed"],[1,2,1,"120.00","completed"],[1,3,1,"100.00","completed"],[2,4,1,"100.00","completed"],[2,5,1,"80.00","completed"],[1,1,2,"30.00","completed"],[3,5,1,"999.00","completed"],[4,5,1,"999.00","completed"],[2,5,1,"800.00","cancelled"],[1,5,1,"900.00","returned"]]}
    edge = deepcopy(visible); edge["exercise_context"] = [["2026-04-01"]]; edge["FactSales"] += [[2,5,2,"30.00","completed"],[2,2,2,"20.00","completed"],[2,3,2,"10.00","completed"],[2,4,2,"10.00","completed"]]
    result["SQL-001"] = exercise(tables, visible, [task("ranking", "Regional ranking", "Return the top three distinct revenue ranks per region, including ties. Only completed lines count. Derive the previous completed calendar quarter from exercise_context.as_of_date. Sort by region, rank, product.", "region:string,product:string,revenue:decimal:2,rank:integer", """
        WITH boundaries AS (SELECT date_trunc('quarter', as_of_date) AS finish FROM exercise_context),
        totals AS (SELECT s.RegionName AS region, p.ProductName AS product, SUM(f.NetRevenue) AS revenue
          FROM FactSales f JOIN DimDate d USING(DateKey) JOIN DimProduct p USING(ProductKey) JOIN DimStore s USING(StoreKey), boundaries b
          WHERE d.FullDate >= b.finish - INTERVAL '3 months' AND d.FullDate < b.finish AND f.SaleStatus = 'completed' GROUP BY 1,2),
        ranked AS (SELECT *, DENSE_RANK() OVER(PARTITION BY region ORDER BY revenue DESC) AS rank FROM totals)
        SELECT region, product, revenue, rank FROM ranked WHERE rank <= 3 ORDER BY region, rank, product
    """, True)], edge)

    tables = [table("DimDate", "Reporting month ends (one row per month).", "FullDate DATE!"), table("FactInventorySnapshot", "Lots are a complete snapshot for each observed product/warehouse day; missing days have no snapshot.", "SnapshotDate DATE!", "ProductKey INTEGER!", "WarehouseKey INTEGER!", "LotKey INTEGER!", "QuantityOnHand DECIMAL(14,3)!")]
    visible = {"DimDate": [["2026-01-31"],["2026-02-28"],["2026-03-31"]], "FactInventorySnapshot": [["2026-01-05",1,1,1,"10"],["2026-01-05",1,1,2,"20"],["2026-01-30",1,1,1,"5"],["2026-01-30",1,1,2,"10"],["2026-03-04",1,1,1,"7"],["2026-02-10",2,1,1,"40"],["2026-01-10",1,2,1,"9"]]}
    edge = deepcopy(visible); edge["FactInventorySnapshot"] += [["2026-02-28",1,1,1,"100"],["2026-03-31",2,1,1,"0"]]
    daily = "WITH daily AS (SELECT SnapshotDate, ProductKey, WarehouseKey, SUM(QuantityOnHand) AS balance FROM FactInventorySnapshot GROUP BY 1,2,3)"
    result["SQL-002"] = exercise(tables, visible, [
        task("month_end", "Month-end balance", "For every product/warehouse pair present anywhere in the source and every reporting month end, return the latest balance on or before that date. Carry prior balances forward; use NULL when no earlier snapshot exists.", "month_end:date,product:integer,warehouse:integer,balance:decimal:3", daily + """,
        pairs AS (SELECT DISTINCT ProductKey, WarehouseKey FROM daily), ranked AS (
          SELECT m.FullDate AS month_end, p.ProductKey AS product, p.WarehouseKey AS warehouse, d.balance,
          ROW_NUMBER() OVER(PARTITION BY m.FullDate,p.ProductKey,p.WarehouseKey ORDER BY d.SnapshotDate DESC NULLS LAST) AS rn
          FROM DimDate m CROSS JOIN pairs p LEFT JOIN daily d ON d.ProductKey=p.ProductKey AND d.WarehouseKey=p.WarehouseKey AND d.SnapshotDate<=m.FullDate)
        SELECT month_end, product, warehouse, balance FROM ranked WHERE rn=1"""),
        task("daily_average", "Average observed daily balance", "For the same month/pair grid, average observed daily totals within the month (sum lots first). Missing days are excluded, not zero-filled; months without observations return NULL. Round to three decimals.", "month_end:date,product:integer,warehouse:integer,average_balance:number:3", daily + """,
        pairs AS (SELECT DISTINCT ProductKey, WarehouseKey FROM daily)
        SELECT m.FullDate AS month_end,p.ProductKey AS product,p.WarehouseKey AS warehouse,ROUND(AVG(d.balance),3) AS average_balance
        FROM DimDate m CROSS JOIN pairs p LEFT JOIN daily d ON d.ProductKey=p.ProductKey AND d.WarehouseKey=p.WarehouseKey AND date_trunc('month',d.SnapshotDate)=date_trunc('month',m.FullDate) GROUP BY 1,2,3""")], edge)

    tables = [table("FactOrder", "Orders to resolve historically.", "OrderID BIGINT! Primary key", "OrderTimestamp TIMESTAMP!", "CustomerBusinessKey VARCHAR!", "Amount DECIMAL(14,2)!"), table("DimCustomer", "Historical versions; ValidTo is exclusive. Overlaps are intentional defects.", "CustomerKey BIGINT! Primary key", "CustomerBusinessKey VARCHAR!", "Segment VARCHAR!", "ValidFrom TIMESTAMP!", "ValidTo TIMESTAMP!")]
    visible = {"FactOrder": [[1,"2026-02-01 00:00:00","A","10"],[2,"2026-01-31 23:59:59","A","20"],[3,"2026-01-15","B","30"],[4,"2026-01-10","X","40"]], "DimCustomer": [[1,"A","retail","2026-01-01","2026-02-01"],[2,"A","business","2026-02-01","2027-01-01"],[3,"B","retail","2026-01-01","2026-03-01"],[4,"B","business","2026-01-10","2026-02-01"]]}
    edge = deepcopy(visible); edge["FactOrder"] += [[5,"2027-01-01","A","0"],[6,"2026-01-01","A","5"]]
    matches = "WITH matches AS (SELECT o.OrderID, COUNT(c.CustomerKey) AS match_count, MIN(c.CustomerKey) AS customer_key FROM FactOrder o LEFT JOIN DimCustomer c ON o.CustomerBusinessKey=c.CustomerBusinessKey AND o.OrderTimestamp>=c.ValidFrom AND o.OrderTimestamp<c.ValidTo GROUP BY o.OrderID)"
    result["SQL-003"] = exercise(tables, visible, [task("resolved", "Uniquely resolved orders", "Return only orders with exactly one matching historical version; do not guess when zero or several versions match.", "order_id:integer,customer_key:integer", matches + " SELECT OrderID AS order_id, customer_key FROM matches WHERE match_count=1"), task("diagnostics", "Resolution exceptions", "Return every order with zero or multiple matches and its match count.", "order_id:integer,match_count:integer", matches + " SELECT OrderID AS order_id,match_count FROM matches WHERE match_count<>1")], edge)

    tables = [table("DimTerm", "Irregular academic terms; TermSequence defines consecutive terms.", "TermKey INTEGER! Primary key", "TermSequence INTEGER!", "TermStartDate DATE!"), table("FactEnrollment", "Duplicate registrations may occur; withdrawn records do not count.", "StudentKey BIGINT!", "ProgramKey INTEGER!", "TermKey INTEGER!", "EnrollmentStatus VARCHAR!")]
    visible = {"DimTerm": [[10,1,"2025-01-10"],[20,2,"2025-04-03"],[30,3,"2025-09-20"],[40,4,"2026-01-15"],[50,5,"2026-05-01"]], "FactEnrollment": [[1,1,10,"enrolled"],[1,1,10,"enrolled"],[1,1,20,"enrolled"],[1,1,40,"enrolled"],[2,1,10,"enrolled"],[2,1,30,"enrolled"],[2,1,20,"withdrawn"],[3,1,20,"enrolled"],[3,1,30,"enrolled"],[4,2,10,"enrolled"],[4,2,20,"enrolled"]]}
    edge = deepcopy(visible); edge["FactEnrollment"] += [[5,1,10,"withdrawn"],[5,1,20,"enrolled"],[1,2,30,"enrolled"],[2,1,40,"enrolled"]]
    result["SQL-004"] = exercise(tables, visible, [task("cohorts", "Cohort retention", "Return first enrolled term sequence per student/program as the cohort. Rates are percentages at offsets +1,+2,+3, rounded to two decimals, with a fixed distinct-student denominator. Skipped-and-returned students count when present at the measured offset. Include only cohorts whose +3 term exists in DimTerm.", "cohort_sequence:integer,program:integer,cohort_size:integer,retention_1:number:2,retention_2:number:2,retention_3:number:2", """
    WITH activity AS (SELECT DISTINCT e.StudentKey,e.ProgramKey,t.TermSequence FROM FactEnrollment e JOIN DimTerm t USING(TermKey) WHERE EnrollmentStatus='enrolled'),
    cohort AS (SELECT StudentKey,ProgramKey,MIN(TermSequence) AS first_term FROM activity GROUP BY 1,2)
    SELECT c.first_term AS cohort_sequence,c.ProgramKey AS program,COUNT(DISTINCT c.StudentKey) AS cohort_size,
    ROUND(100.0*COUNT(DISTINCT CASE WHEN a.TermSequence=c.first_term+1 THEN c.StudentKey END)/COUNT(DISTINCT c.StudentKey),2) AS retention_1,
    ROUND(100.0*COUNT(DISTINCT CASE WHEN a.TermSequence=c.first_term+2 THEN c.StudentKey END)/COUNT(DISTINCT c.StudentKey),2) AS retention_2,
    ROUND(100.0*COUNT(DISTINCT CASE WHEN a.TermSequence=c.first_term+3 THEN c.StudentKey END)/COUNT(DISTINCT c.StudentKey),2) AS retention_3
    FROM cohort c LEFT JOIN activity a ON a.StudentKey=c.StudentKey AND a.ProgramKey=c.ProgramKey
    WHERE c.first_term+3 <= (SELECT MAX(TermSequence) FROM DimTerm) GROUP BY 1,2
    """)], edge)

    tables = [table("FactTransaction", "Transactions start from a zero opening balance; negative amounts include reversals.", "TransactionID BIGINT! Unique deterministic tie-break", "AccountKey BIGINT!", "TransactionTimestamp TIMESTAMP!", "Amount DECIMAL(14,2)!")]
    visible = {"FactTransaction": [[1,1,"2026-01-01 09:00:00","100"],[2,1,"2026-01-01 09:00:00","-20"],[3,1,"2026-01-02 10:00:00","10"],[4,1,"2026-01-02 11:00:00","-50"],[5,2,"2026-01-01 08:00:00","30"]]}
    edge = deepcopy(visible); edge["FactTransaction"] += [[6,1,"2026-01-01 09:00:00","5"],[7,2,"2026-01-04 10:00:00","-30"]]; edge["FactTransaction"].reverse()
    running = "WITH running AS (SELECT TransactionID,AccountKey,TransactionTimestamp,SUM(Amount) OVER(PARTITION BY AccountKey ORDER BY TransactionTimestamp,TransactionID ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS balance FROM FactTransaction)"
    result["SQL-005"] = exercise(tables, visible, [task("running", "Transaction balances", "Return each transaction's balance ordered by account, timestamp, then transaction ID. Use TransactionID to resolve equal timestamps.", "transaction_id:integer,account:integer,balance:decimal:2", running + " SELECT TransactionID AS transaction_id,AccountKey AS account,balance FROM running ORDER BY AccountKey,TransactionTimestamp,TransactionID", True), task("closing", "Daily closing balances", "Return the balance after the final transaction of each observed account/day. Do not sum intermediate balances or fill missing dates.", "account:integer,balance_date:date,closing_balance:decimal:2", running + " SELECT AccountKey AS account,CAST(TransactionTimestamp AS DATE) AS balance_date,balance AS closing_balance FROM running QUALIFY ROW_NUMBER() OVER(PARTITION BY AccountKey,CAST(TransactionTimestamp AS DATE) ORDER BY TransactionTimestamp DESC,TransactionID DESC)=1")], edge)

    tables = [table("FactLogin", "LoginDate is already the user's local calendar date. Repeated logins on a day are possible.", "UserKey BIGINT!", "LoginDate DATE!")]
    visible = {"FactLogin": [[1,"2026-01-01"],[1,"2026-01-01"],[1,"2026-01-02"],[1,"2026-01-05"],[1,"2026-01-06"],[2,"2026-02-28"],[2,"2026-03-01"],[2,"2026-03-02"],[3,"2026-01-10"]]}
    edge = deepcopy(visible); edge["FactLogin"] += [[1,"2026-01-07"],[2,"2026-03-01"],[4,"2024-02-28"],[4,"2024-02-29"],[4,"2024-03-01"]]
    result["SQL-006"] = exercise(tables, visible, [task("streaks", "Longest login streak", "Return each user's longest run of consecutive calendar dates, ignoring duplicate logins. A missing calendar day breaks a streak. Break equal-length streak ties by earliest start.", "user_id:integer,start_date:date,end_date:date,streak_days:integer", """
      WITH days AS (SELECT DISTINCT UserKey,LoginDate FROM FactLogin), numbered AS (
      SELECT *,LoginDate-CAST(ROW_NUMBER() OVER(PARTITION BY UserKey ORDER BY LoginDate) AS INTEGER) AS grp FROM days),
      streaks AS (SELECT UserKey,MIN(LoginDate) AS start_date,MAX(LoginDate) AS end_date,COUNT(*) AS streak_days FROM numbered GROUP BY UserKey,grp)
      SELECT UserKey AS user_id,start_date,end_date,streak_days FROM streaks
      QUALIFY ROW_NUMBER() OVER(PARTITION BY UserKey ORDER BY streak_days DESC,start_date)=1
    """)], edge)

    tables = [table("DimEmployee", "Each employee has at most one parent; disconnected cycles may exist as source defects.", "EmployeeKey BIGINT! Primary key", "ManagerKey BIGINT References DimEmployee", "EmployeeName VARCHAR!"), table("FactSales", "Individual sales; each employee's own sales count once in their ancestor's rollup.", "EmployeeKey BIGINT! References DimEmployee", "NetRevenue DECIMAL(14,2)!")]
    visible = {"DimEmployee": [[1,None,"Ada"],[2,1,"Bo"],[3,2,"Cy"],[4,None,"Dee"],[5,1,"Eli"]], "FactSales": [[1,"100"],[2,"20"],[2,"5"],[3,"7"],[4,"30"]]}
    edge = deepcopy(visible); edge["DimEmployee"] += [[6,7,"Faye"],[7,6,"Gus"],[8,7,"Hal"]]; edge["FactSales"] += [[6,"9"],[7,"11"],[8,"3"]]
    result["SQL-007"] = exercise(tables, visible, [task("hierarchy", "Rooted hierarchy rollup", "Return one row per employee reachable from a root (ManagerKey IS NULL). Exclude disconnected cycle components. Level starts at 0 and path is slash-separated employee IDs, e.g. 1/2/3. Include own sales plus every reachable descendant's sales exactly once. Employees without sales have decimal zero. Guard recursion against revisiting an employee.", "employee_id:integer,level:integer,path:string,revenue:decimal:2", """
      WITH RECURSIVE hierarchy AS (
        SELECT EmployeeKey,0 AS level,CAST(EmployeeKey AS VARCHAR) AS path,[EmployeeKey] AS visited FROM DimEmployee WHERE ManagerKey IS NULL
        UNION ALL SELECT e.EmployeeKey,h.level+1,h.path||'/'||CAST(e.EmployeeKey AS VARCHAR),list_append(h.visited,e.EmployeeKey)
        FROM hierarchy h JOIN DimEmployee e ON e.ManagerKey=h.EmployeeKey WHERE NOT list_contains(h.visited,e.EmployeeKey)),
      own AS (SELECT EmployeeKey,SUM(NetRevenue) AS revenue FROM FactSales GROUP BY 1)
      SELECT h.EmployeeKey AS employee_id,h.level,h.path,CAST(COALESCE(SUM(o.revenue),0) AS DECIMAL(18,2)) AS revenue
      FROM hierarchy h JOIN hierarchy d ON d.path=h.path OR starts_with(d.path,h.path||'/') LEFT JOIN own o ON o.EmployeeKey=d.EmployeeKey GROUP BY 1,2,3
    """)], edge)

    tables = [table("users", "Source age strings may be blank or invalid; valid age is an integer 0–120.", "id BIGINT! Primary key", "age_text VARCHAR"), table("payments", "Money uses decimal precision; blanks and invalid/overflowing values must be flagged.", "id BIGINT! Primary key", "amount_text VARCHAR"), table("flags", "Accepted true tokens: true,t,yes,y,1; false: false,f,no,n,0; trim and ignore case.", "id BIGINT! Primary key", "active_text VARCHAR")]
    visible = {"users": [[1,"31"],[2,"9"],[3," 40 "],[4,"bad"],[5,"-2"],[6,None]], "payments": [[1,"10.10"],[2,"0.20"],[3,"bad"],[4,None],[5,"1.005"],[6,"999999999999999999999"]], "flags": [[1,"YES"],[2," false "],[3,"0"],[4,"unknown"],[5,None],[6,"1"]]}
    edge = deepcopy(visible); edge["users"] += [[7,"30.9"],[8,"121"],[9,"+35"],[10,"30"]]; edge["payments"] += [[7,"-2.555"],[8," "]]; edge["flags"] += [[7,"N"],[8," t "]]
    parsed = "WITH parsed AS (SELECT id,TRY_CAST(NULLIF(TRIM(amount_text),'') AS DECIMAL(12,2)) AS amount FROM payments)"
    result["SQL-009"] = exercise(tables, visible, [
        task("ages", "A · Explicit age conversion", "Return id and integer age for valid ages strictly greater than 30. Accept only whole-number text (optional leading +, surrounding whitespace); age range 0–120. Explain why comparing raw age_text with 30 may error or apply unwanted conversion.", "id:integer,age:integer", "WITH parsed AS (SELECT id,CASE WHEN regexp_full_match(TRIM(age_text),'[+]?[0-9]+') THEN TRY_CAST(TRIM(age_text) AS INTEGER) END AS age FROM users) SELECT id,age FROM parsed WHERE age>30 AND age<=120"),
        task("money", "B · Decimal amounts", "Return every payment id with amount DECIMAL(12,2) and invalid boolean. Blank, NULL, unparseable or overflowing inputs have NULL amount and invalid=true. Round fractional cents half away from zero. Explain why FLOAT is inappropriate for exact money.", "id:integer,amount:decimal:2,invalid:boolean", parsed + " SELECT id,amount,amount IS NULL AS invalid FROM parsed"),
        task("booleans", "C · Explicit boolean mapping", "Return every flag id, active boolean, and invalid boolean. Use the tokens documented in the flags table; all other inputs including NULL are invalid and produce NULL active.", "id:integer,active:boolean,invalid:boolean", "WITH parsed AS (SELECT id,CASE WHEN lower(trim(active_text)) IN ('true','t','yes','y','1') THEN true WHEN lower(trim(active_text)) IN ('false','f','no','n','0') THEN false END AS active FROM flags) SELECT id,active,active IS NULL AS invalid FROM parsed"),
        task("total", "D · Auditable money total", "Return one row: sum valid DECIMAL(12,2) converted amounts (decimal zero if none) and count invalid rows. Never silently lose invalid-row counts. Explain why a direct CAST can abort on dirty data.", "total:decimal:2,invalid_count:integer", parsed + " SELECT CAST(COALESCE(SUM(amount),0) AS DECIMAL(18,2)) AS total,COUNT(*) FILTER(WHERE amount IS NULL) AS invalid_count FROM parsed")], edge)

    tables = [table("fact_orders", "Business statuses describe missing values. Unknown customer IDs remain unknown; join using LEFT JOIN.", "order_id BIGINT! Primary key", "customer_id BIGINT", "ship_cost DECIMAL(12,2)", "shipping_state VARCHAR! One of known, unknown, not_applicable, pending", "discount_pct DECIMAL(5,4)", "discount_state VARCHAR! One of known, unknown, not_applicable, pending"), table("customers", "Known customer records; some fact IDs have no dimension row.", "customer_id BIGINT! Primary key", "customer_name VARCHAR!")]
    visible = {"fact_orders": [[1,1,"10","known","0.1000","known"],[2,None,None,"pending",None,"not_applicable"],[3,2,None,"unknown",None,"unknown"],[4,99,None,"not_applicable","0.0000","known"],[5,1,"0","known",None,"pending"]], "customers": [[1,"Ada"],[2,"Bo"]]}
    edge = deepcopy(visible); edge["fact_orders"] += [[6,None,"5.50","known",None,"unknown"],[7,2,None,"pending",None,"pending"]]
    result["SQL-012"] = exercise(tables, visible, [task("report", "Auditable order totals", "Return one summary row with total order count, known shipping-cost sum (decimal zero if none), counts of unknown/not_applicable/pending shipping states, and unmatched-customer count (including NULL IDs). Count each fact once. Preserve all orders with a LEFT JOIN. Explain discount NULL meanings separately; do not infer business semantics from NULL alone.", "order_count:integer,known_shipping_total:decimal:2,unknown_count:integer,not_applicable_count:integer,pending_count:integer,unmatched_customer_count:integer", """
      SELECT COUNT(*) AS order_count,CAST(COALESCE(SUM(CASE WHEN o.shipping_state='known' THEN o.ship_cost END),0) AS DECIMAL(18,2)) AS known_shipping_total,
      COUNT(*) FILTER(WHERE o.shipping_state='unknown') AS unknown_count,
      COUNT(*) FILTER(WHERE o.shipping_state='not_applicable') AS not_applicable_count,
      COUNT(*) FILTER(WHERE o.shipping_state='pending') AS pending_count,
      COUNT(*) FILTER(WHERE c.customer_id IS NULL) AS unmatched_customer_count
      FROM fact_orders o LEFT JOIN customers c ON o.customer_id=c.customer_id
    """)], edge)
    return result


def main():
    path = Path(__file__).resolve().parents[1] / "data" / "challenges.json"
    bank = json.loads(path.read_text(encoding="utf-8"))
    exercises = build()
    for challenge in bank["challenges"]:
        if challenge["id"] not in exercises:
            continue
        spec = validate_exercise(exercises[challenge["id"]])
        challenge["sql_playground"] = spec
        student = challenge["student"]
        student["create_table_block"] = ddl(spec)
        student["requirements"] = [t["description"] for t in spec["tasks"]]
        student["tasks"] = [f"{t['title']}: produce the declared output columns." for t in spec["tasks"]] + ["Explain correctness, edge cases, and production-scale performance separately."]
        student["constraints"] = ["Executable dialect: DuckDB 1.5.5. One SELECT (including CTEs) per answer tab.", "The local dataset is intentionally small; runtime does not establish production-scale performance.", "Checks assess result correctness only. Output names, types, precision, and ordering are specified in the workspace."]
        scale = {"SQL-001":"800 million sales lines", "SQL-005":"500 million transactions", "SQL-006":"2 billion logins", "SQL-007":"80,000 employees"}.get(challenge["id"])
        if scale:
            student["constraints"].append(f"Production context for your written performance discussion: {scale}.")
        student["deliverables"] = [t["title"] + " SQL" for t in spec["tasks"]] + ["Written reasoning and performance notes"]
        if challenge["id"] == "SQL-009":
            student["scenario"] = "Investigate unsafe implicit or lossy conversions in age, money and boolean source fields. Some naive queries error on dirty data; others silently change meaning. Write four safe, auditable SELECT queries and explain each failure mode."
        if challenge["id"] == "SQL-002":
            challenge["hints"][2] = "Build daily totals, then join the month/pair grid to the latest earlier snapshot for month-end; average only observations within each month for the daily average."
            challenge["follow_up_complications"][0] = "Compare observed-day averages with calendar-day averages that carry balances forward."
        if challenge["id"] == "SQL-012":
            student["scenario"] = "Shipping and discount NULLs mean unknown, not applicable, or pending. Explicit business-state columns identify the meaning. Produce an auditable summary without dropping unmatched customers or treating every missing cost as zero."
    path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
