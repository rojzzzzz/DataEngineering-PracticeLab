"""Disposable DuckDB worker; invoked only through sql_runner's bounded IPC."""
from __future__ import annotations

from collections import Counter
from datetime import date, datetime
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import json
import os
import sys
import threading
import time

import duckdb

from src.sql_models import ddl, check_exercise

MAX_BYTES = 2_000_000
MAX_CHECK_ROWS = 10_000
FIXTURE_BATCH_ROWS = 500


class ResourceLimit(ValueError):
    pass


def _fixture_literal(value):
    """Quote a validated fixture scalar without invoking DuckDB's Python binder."""
    if value is None:
        return "NULL"
    if type(value) is bool:
        return "TRUE" if value else "FALSE"
    if type(value) in (int, float):
        return repr(value)
    return "'" + value.replace("'", "''") + "'"


def connection(exercise: dict, fixture: dict):
    con = duckdb.connect(":memory:", config={
        "threads": "2", "memory_limit": "256MB", "enable_external_access": "false",
        "autoinstall_known_extensions": "false", "autoload_known_extensions": "false",
        "python_enable_replacements": "false", "temp_directory": "",
        "max_temp_directory_size": "0B", "allow_community_extensions": "false",
    })
    try:
        con.execute("SET TimeZone='UTC'")
        con.execute(ddl(exercise))
        for table in exercise["tables"]:
            rows = fixture[table["name"]]
            if rows:
                target = f'INSERT INTO "{table["name"]}" VALUES '
                # NUL cannot be represented in a SQL string literal. Preserve
                # that uncommon case with the parameterized path.
                if any(isinstance(cell, str) and "\x00" in cell for row in rows for cell in row):
                    placeholders = ",".join("?" for _ in table["columns"])
                    con.executemany(target + f"({placeholders})", rows)
                else:
                    # Bound each statement while avoiding hundreds of parser/
                    # execution round trips for a permitted 10,000-row fixture.
                    for start in range(0, len(rows), FIXTURE_BATCH_ROWS):
                        batch = rows[start:start + FIXTURE_BATCH_ROWS]
                        values = ["(" + ",".join(_fixture_literal(cell) for cell in row) + ")" for row in batch]
                        con.execute(target + ",".join(values))
        con.execute("SET lock_configuration = true")
        return con
    except BaseException:
        con.close()
        raise


def select_only(con, sql: str) -> None:
    if not isinstance(sql, str) or not sql.strip() or len(sql) > 50_000:
        raise ValueError("Enter a SELECT query (maximum 50,000 characters).")
    statements = con.extract_statements(sql)
    if len(statements) != 1 or statements[0].type != duckdb.StatementType.SELECT:
        raise ValueError("Only one SELECT query is allowed, including WITH and WITH RECURSIVE.")


def query(exercise: dict, fixture: dict, sql: str, *, explain=False, checking=False) -> dict:
    # Hard watchdog covers setup, parsing, execution and fetching, not just execute().
    timer = threading.Timer(10, lambda: os._exit(124))
    timer.daemon = True
    timer.start()
    con = None
    try:
        con = connection(exercise, fixture)
        select_only(con, sql)
        started = time.perf_counter()
        cursor = con.execute(("EXPLAIN " if explain else "") + sql)
        columns = [item[0] for item in cursor.description]
        types = [str(item[1]) for item in cursor.description]
        limit = MAX_CHECK_ROWS if checking else 1000
        rows, byte_count, truncated = [], 0, False
        while True:
            batch = cursor.fetchmany(128)
            if not batch:
                break
            for row in batch:
                encoded = json.dumps(row, default=str, ensure_ascii=False)
                byte_count += len(encoded.encode())
                if len(rows) >= limit or byte_count > MAX_BYTES:
                    if checking:
                        raise ResourceLimit("Assessment output exceeds its bounded result limit")
                    truncated = True
                    break
                rows.append(list(row))
            if truncated:
                break
        return {"columns": columns, "types": types, "rows": rows, "truncated": truncated,
                "elapsed_ms": round((time.perf_counter() - started) * 1000, 2)}
    finally:
        if con is not None:
            con.close()
        timer.cancel()


def _cell(value, column):
    if value is None:
        return None
    kind = column["type"]
    if kind == "integer":
        if isinstance(value, bool) or not isinstance(value, (int, Decimal)) or value != int(value):
            raise ValueError("integer required")
        return int(value)
    if kind in ("decimal", "number"):
        if isinstance(value, bool) or not isinstance(value, (int, float, Decimal)):
            raise ValueError("numeric value required")
        if kind == "decimal" and isinstance(value, float):
            raise ValueError("money must use exact decimal arithmetic")
        number = Decimal(str(value))
        if not number.is_finite():
            raise ValueError("finite number required")
        rounded = number.quantize(Decimal(1).scaleb(-column["scale"]), rounding=ROUND_HALF_UP)
        if kind == "decimal" and rounded != number:
            raise ValueError("declared decimal scale required")
        return rounded
    if kind == "date":
        if not isinstance(value, date) or isinstance(value, datetime):
            raise ValueError("date required")
        return value.isoformat()
    if kind == "timestamp":
        if not isinstance(value, datetime):
            raise ValueError("timestamp required")
        return value.isoformat()
    if kind == "boolean":
        if type(value) is not bool:
            raise ValueError("boolean required")
        return value
    if not isinstance(value, str):
        raise ValueError("text required")
    return value


def compare(actual: dict, expected: dict, task: dict) -> str:
    if actual["columns"] != [c["name"] for c in task["columns"]]:
        return "output shape"
    try:
        def normalize(result):
            return [tuple(_cell(v, c) for v, c in zip(row, task["columns"])) for row in result["rows"]]
        observed, wanted = normalize(actual), normalize(expected)
    except (ValueError, TypeError, InvalidOperation):
        return "output shape"
    if Counter(observed) != Counter(wanted):
        return "incorrect rows"
    if task["ordered"] and observed != wanted:
        return "ordering"
    return "passed"


def _invariant_holds(exercise: dict, fixture: dict, results: dict, invariant: dict) -> bool:
    tasks = {task["id"]: task for task in exercise["tasks"]}
    if invariant["type"] in ("partition", "coverage"):
        source = invariant["source"]
        source_table = next(table for table in exercise["tables"] if table["name"] == source)
        source_index = next(i for i, column in enumerate(source_table["columns"]) if column["name"] == invariant["source_key"])
        wanted = Counter(row[source_index] for row in fixture[source])
        observed = []
        for output in invariant["outputs"]:
            result = results.get(output)
            if result is None:
                return False
            index = next(i for i, column in enumerate(tasks[output]["columns"]) if column["name"] == invariant["output_key"])
            observed.append(Counter(row[index] for row in result["rows"]))
        if invariant["type"] == "coverage":
            return all(counter == wanted for counter in observed)
        return sum(observed, Counter()) == wanted and all(not (set(a) & set(b)) for i, a in enumerate(observed) for b in observed[i + 1:])
    left, right = invariant["left"], invariant["right"]
    if left not in results or right not in results:
        return False
    def totals(task_id, group_name, value_name):
        columns = [column["name"] for column in tasks[task_id]["columns"]]
        group_index, value_index = columns.index(group_name), columns.index(value_name)
        totals_ = Counter()
        for row in results[task_id]["rows"]:
            totals_[row[group_index]] += Decimal(str(row[value_index]))
        return totals_
    return totals(left, invariant["group_left"], invariant["value_left"]) == totals(right, invariant["group_right"], invariant["value_right"])


def assess(exercise: dict, drafts: dict, *, validate_only=False) -> dict:
    outcomes = {task["id"]: "passed" for task in exercise["tasks"]}
    fixtures = [exercise["visible_fixture"], *exercise["assessment"]["fixtures"]]
    for fixture in fixtures:
        reference_results, actual_results = {}, {}
        for task in exercise["tasks"]:
            # Reference and student SQL ALWAYS use different connections. No reference
            # SQL, expected rows, or private descriptions are returned to the browser.
            expected = query(exercise, fixture, exercise["assessment"]["reference_queries"][task["id"]], checking=True)
            if compare(expected, expected, task) != "passed":
                raise ValueError("Reference query does not satisfy the declared output contract")
            reference_results[task["id"]] = expected
            if validate_only:
                continue
            try:
                actual = query(exercise, fixture, drafts.get(task["id"], ""), checking=True)
                actual_results[task["id"]] = actual
                outcome = compare(actual, expected, task)
            except (ResourceLimit, duckdb.OutOfMemoryException):
                outcome = "resource limit"
            except Exception:
                outcome = "execution failure"
            if outcomes[task["id"]] == "passed":
                outcomes[task["id"]] = outcome
        for invariant in exercise["assessment"].get("invariants", []):
            if not _invariant_holds(exercise, fixture, reference_results, invariant):
                raise ValueError("Reference query violates a declared reconciliation invariant")
            if not validate_only and not _invariant_holds(exercise, fixture, actual_results, invariant):
                affected = invariant.get("outputs", [invariant.get("left"), invariant.get("right")])
                for task_id in affected:
                    if outcomes[task_id] in ("passed", "incorrect rows"):
                        outcomes[task_id] = "reconciliation"
    return {"results": outcomes}


def profile(exercise: dict, table_name: str) -> dict:
    table = next((item for item in exercise["tables"] if item["name"] == table_name), None)
    if table is None:
        raise ValueError("Unknown source table")
    columns = table["columns"]
    parts = ["COUNT(*) AS row_count"]
    for index, column in enumerate(columns):
        field = '"' + column["name"] + '"'
        parts.extend([f"COUNT(*) FILTER(WHERE {field} IS NULL) AS n{index}",
                      f"COUNT(DISTINCT {field}) AS d{index}"])
        if column["type"] != "BOOLEAN":
            parts.extend([f"MIN({field}) AS lo{index}", f"MAX({field}) AS hi{index}"])
    sql = "SELECT " + ",".join(parts) + ' FROM "' + table_name + '"'
    result = query(exercise, exercise["visible_fixture"], sql, checking=True)
    values = dict(zip(result["columns"], result["rows"][0]))
    return {"table": table_name, "row_count": values["row_count"], "columns": [
        {"column": c["name"], "null_count": values[f"n{i}"], "distinct_count": values[f"d{i}"],
         "min": values.get(f"lo{i}"), "max": values.get(f"hi{i}")}
        for i, c in enumerate(columns)]}


def main():
    request = json.loads(sys.stdin.buffer.read(5_000_001))
    try:
        operation = request["operation"]
        if operation == "dataset_run":
            from src.capstone_datasets import validate_dataset
            dataset = validate_dataset(request["dataset"])
            schema = {"tables": [{"name": t["name"], "columns": t["columns"]} for t in dataset["tables"]]}
            fixture = {t["name"]: t["rows"] for t in dataset["tables"]}
            result = query(schema, fixture, request["sql"])
        else:
            # This worker exclusively owns the just-decoded request. Validate
            # all contents without copying fixtures it only reads.
            check_exercise(request["exercise"])
            exercise = request["exercise"]
        if operation in ("check", "validate"):
            result = assess(exercise, request.get("drafts", {}), validate_only=operation == "validate")
        elif operation in ("run", "explain"):
            result = query(exercise, exercise["visible_fixture"], request["sql"], explain=operation == "explain")
        elif operation == "profile":
            result = profile(exercise, request.get("table"))
        elif operation != "dataset_run":
            raise ValueError("Unknown SQL operation")
        result["ok"] = True
    except Exception as exc:
        private = request.get("operation") in ("check", "validate")
        result = {"ok": False, "error": "Assessment could not execute. Check the exercise configuration." if private else str(exc)[:2000]}
    # The parent decodes JSON as UTF-8; ASCII escaping avoids Windows console
    # code-page differences for non-ASCII fixture values and result cells.
    sys.stdout.buffer.write((json.dumps(result, default=str, ensure_ascii=True) + "\n").encode("ascii"))


if __name__ == "__main__":
    if "--ready" in sys.argv:
        sys.stdout.buffer.write(b"READY\n")
        sys.stdout.buffer.flush()
    main()
