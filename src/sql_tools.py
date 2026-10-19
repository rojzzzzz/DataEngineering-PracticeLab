"""Pure, non-executing SQL utilities. Called in a disposable worker."""
from __future__ import annotations

import json
from pathlib import Path
import sqlglot
from sqlglot import exp
from sqlglot.errors import ErrorLevel, ParseError
from sqlglot.tokens import TokenType
from sqlglot.optimizer.normalize_identifiers import normalize_identifiers
from src.sql_tools_graph import Graph, MAX_PLAN, MAX_NODES

DIALECTS = json.loads((Path(__file__).parent / "sql_tools_dialects.json").read_text(encoding="utf-8"))
MAX_SQL = 200_000



def dialect(value):
    if value not in DIALECTS:
        raise ValueError("Choose a supported SQL dialect.")
    return DIALECTS[value]["parser"]


def parse_sql(source, source_dialect):
    if not isinstance(source, str) or not source.strip() or len(source) > MAX_SQL:
        raise ValueError("Enter SQL, up to 200,000 characters.")
    if "{{" in source or "{%" in source:
        raise ValueError("Template expressions are not supported. Paste the rendered SQL.")
    read = dialect(source_dialect)
    try:
        statements = [item for item in sqlglot.parse(source, read=read, error_level=ErrorLevel.RAISE) if item is not None]
    except ParseError as exc:
        detail = exc.errors[0] if exc.errors else {}
        line, col = detail.get("line", 1), detail.get("col", 1)
        offset = sum(len(part) for part in source.splitlines(keepends=True)[:line - 1]) + col - 1
        tokens = sqlglot.Dialect.get_or_raise(read).tokenize(source)
        index = 1 + sum(token.token_type == TokenType.SEMICOLON and token.start < offset for token in tokens)
        raise ValueError(f"Statement {index}, line {line}, column {col}: {detail.get('description', str(exc))}") from exc
    if not statements:
        raise ValueError("No SQL statements found.")
    for index, statement in enumerate(statements, 1):
        if isinstance(statement, exp.Command):
            raise ValueError(f"Statement {index}: this SQL command is not supported by the parser.")
    return statements


def convert_sql(source, source_dialect, target_dialect):
    statements = parse_sql(source, source_dialect)
    target = dialect(target_dialect)
    output = []
    for index, statement in enumerate(statements, 1):
        try:
            converted = statement.sql(dialect=target, pretty=True, unsupported_level=ErrorLevel.RAISE)
            checked = sqlglot.parse(converted, read=target, error_level=ErrorLevel.RAISE)
            if any(isinstance(item, exp.Command) for item in checked):
                raise ValueError("Target syntax was not fully parsed.")
            output.append(converted)
        except Exception as exc:
            raise ValueError(f"Statement {index}: {exc}") from exc
    return {"sql": ";\n\n".join(output) + ";", "diagnostics": [
        "Converted; not executed. Validate engine-specific functions, types, and results in your target database."]}


def visualize_sql(source, source_dialect, statement_index=0):
    statements = parse_sql(source, source_dialect)
    if type(statement_index) is not int or not 0 <= statement_index < len(statements):
        raise ValueError(f"Choose a statement from 1 to {len(statements)}.")
    graph = Graph()
    active_ctes = set()
    read = dialect(source_dialect)
    statements = [normalize_identifiers(statement, dialect=read) for statement in statements]

    def sql(node):
        text = node.sql(dialect=read, pretty=True)
        return text if len(text) <= 8000 else text[:8000] + "\n-- Display excerpt; full SQL is in the source editor."

    def build(node, inherited):
        if isinstance(node, exp.Subquery):
            child = build(node.this, inherited)
            wrapper = graph.node("Subquery" + (f": {node.alias}" if node.alias else ""), "subquery", sql=sql(node))
            graph.edge(child, wrapper)
            return wrapper
        if not isinstance(node, (exp.Select, exp.Union, exp.Intersect, exp.Except)):
            raise ValueError(f"Visualization does not yet support {type(node).__name__}. Use a SELECT query.")
        env = dict(inherited)
        with_clause = node.args.get("with_")
        if with_clause:
            recursive = bool(with_clause.args.get("recursive"))
            for cte in with_clause.expressions:
                name = cte.alias_or_name
                cte_id = graph.node(f"CTE: {name}", "cte", {"recursive": recursive}, sql(cte))
                if recursive:
                    env[name] = cte_id
                active_ctes.add(cte_id)
                value = build(cte.this, env)
                active_ctes.remove(cte_id)
                graph.edge(value, cte_id, "defines")
                env[name] = cte_id
        if isinstance(node, (exp.Union, exp.Intersect, exp.Except)):
            if node.args.get("by_name") or node.args.get("on"):
                raise ValueError("Visualization does not yet support set operations BY NAME or ON.")
            label = node.key.upper() + (" ALL" if node.args.get("distinct") is False else "")
            output = graph.node(label, "set", {"duplicates": "retained" if node.args.get("distinct") is False else "removed"}, sql(node))
            graph.edge(build(node.this, env), output, "left branch")
            graph.edge(build(node.expression, env), output, "right branch")
        else:
            # Reject clauses we cannot faithfully represent rather than silently dropping them.
            supported = {"with_", "expressions", "from_", "joins", "where", "group", "having", "qualify",
                         "order", "limit", "offset", "distinct", "hint", "windows", "kind"}
            extra = [key for key, value in node.args.items() if value and key not in supported]
            if extra:
                raise ValueError("Visualization does not yet support: " + ", ".join(extra))

            def relation(item):
                if isinstance(item, exp.Subquery):
                    return build(item, env)
                if not isinstance(item, exp.Table) or not isinstance(item.this, exp.Identifier) or item.args.get("pivots"):
                    raise ValueError(f"Visualization does not yet support {type(item).__name__} table sources (including table functions/pivots).")
                name = item.name
                ref = env.get(name) if not item.db and not item.catalog else None
                table = graph.node(sql(item), "cte-reference" if ref else "table", {"alias": item.alias, "name": name}, sql(item))
                if ref:
                    graph.edge(ref, table, "recursive reference" if ref in active_ctes else "CTE reference", ref in active_ctes)
                return table

            from_clause = node.args.get("from_")
            output = relation(from_clause.this) if from_clause else graph.node("Literal rows", "source")
            for join in node.args.get("joins") or []:
                right = relation(join.this)
                join_type = " ".join(str(join.args.get(k) or "") for k in ("method", "side", "kind")).strip() or "INNER"
                condition = join.args.get("on")
                using = join.args.get("using")
                label = sql(condition) if condition else "USING (" + ", ".join(sql(x) for x in using) + ")" if using else "No join predicate"
                joined = graph.node(join_type + " JOIN", "join", {"condition": label}, sql(join))
                graph.edge(output, joined, "left")
                graph.edge(right, joined, "right")
                output = joined
            for key, title in (("where", "Filter"), ("group", "Group / aggregate"), ("having", "Having"), ("windows", "Window definitions"), ("qualify", "Qualify")):
                value = node.args.get(key)
                if value:
                    text = "\n".join(sql(x) for x in value) if isinstance(value, list) else sql(value)
                    operation = graph.node(title, "operation", sql=text)
                    graph.edge(output, operation)
                    output = operation
            if not node.args.get("group") and any(aggregate.find_ancestor(exp.Select) is node for aggregate in node.find_all(exp.AggFunc)):
                operation = graph.node("Aggregate", "operation", sql=", ".join(sql(item) for item in node.expressions))
                graph.edge(output, operation)
                output = operation
            projection = graph.node("SELECT" + (" DISTINCT" if node.args.get("distinct") else ""), "select",
                                    {"columns": [sql(item) for item in node.expressions]}, sql(node))
            graph.edge(output, projection)
            # Expression subqueries are dependencies, not extra FROM inputs.
            handled = {id(sub) for item in ([from_clause] if from_clause else []) + [j.this for j in (node.args.get("joins") or [])] for sub in item.find_all(exp.Subquery)}
            for sub in node.find_all(exp.Subquery):
                ancestor = sub.parent
                while ancestor is not None and not isinstance(ancestor, (exp.Select, exp.Union, exp.Intersect, exp.Except)):
                    ancestor = ancestor.parent
                if ancestor is node and id(sub) not in handled:
                    graph.edge(build(sub, env), projection, "expression subquery")
            # EXISTS has a direct Select child rather than a Subquery wrapper.
            for exists in node.find_all(exp.Exists):
                if exists.find_ancestor(exp.Select) is node:
                    graph.edge(build(exists.this, env), projection, "EXISTS dependency")
            output = projection
        for key, title in (("order", "Sort"), ("limit", "Limit"), ("offset", "Offset")):
            if node.args.get(key):
                operation = graph.node(title, "operation", sql=sql(node.args[key]))
                graph.edge(output, operation)
                output = operation
        return output

    output = build(statements[statement_index], {})
    final = graph.node("Query output", "output")
    graph.edge(output, final)
    result = graph.result()
    result["statementCount"] = len(statements)
    result["diagnostics"].append("Logical SQL structure. This is not an execution plan or column-level lineage.")
    return result
