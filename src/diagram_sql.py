"""Parse table definitions for Diagram Maker; never execute the supplied SQL."""
from uuid import uuid4


def parse_create_tables(source: str, dialect: str = "postgres") -> list[dict]:
    import sqlglot
    from sqlglot import exp
    from sqlglot.errors import ErrorLevel, ParseError, TokenError
    from sqlglot.tokens import TokenType

    if dialect not in {"postgres", "mysql", "tsql", "sqlite", "duckdb", "bigquery", "snowflake", "spark"}:
        raise ValueError("Choose a supported SQL dialect.")
    if not isinstance(source, str) or not source.strip() or len(source) > 200_000:
        raise ValueError("Paste CREATE TABLE SQL, up to 200,000 characters.")
    try:
        # Accept the requested IF EXISTS shorthand without rewriting strings,
        # quoted identifiers or comments that happen to contain those words.
        tokens = sqlglot.Dialect.get_or_raise(dialect).tokenize(source)
        offsets = [tokens[i + 3].start for i in range(len(tokens) - 3)
                   if tokens[i].token_type == TokenType.CREATE
                   and tokens[i + 1].token_type == TokenType.TABLE
                   and tokens[i + 2].text.upper() == "IF"
                   and tokens[i + 3].token_type == TokenType.EXISTS]
        for offset in reversed(offsets):
            source = source[:offset] + "NOT " + source[offset:]
        statements = [s for s in sqlglot.parse(source, read=dialect, error_level=ErrorLevel.RAISE) if s is not None]
    except (ParseError, TokenError) as exc:
        detail = (getattr(exc, "errors", None) or [{}])[0] or {}
        raise ValueError(f"Could not parse SQL at line {detail.get('line', 1)}, column {detail.get('col', 1)}. Check the table definition.") from exc
    if not statements or len(statements) > 100:
        raise ValueError("Import between 1 and 100 CREATE TABLE statements.")
    result = []
    for statement in statements:
        if (not isinstance(statement, exp.Create) or statement.args.get("kind") != "TABLE"
                or not isinstance(statement.this, exp.Schema)
                or not isinstance(statement.this.this, exp.Table)
                or statement.args.get("expression") is not None
                or statement.args.get("replace")):
            raise ValueError("Only CREATE TABLE definitions with explicit columns are supported.")
        schema = statement.this
        name = ".".join(part.name for part in schema.this.parts)
        if not name.strip() or len(name) > 200:
            raise ValueError("Table names must contain 1–200 characters.")
        columns = [c for c in schema.expressions if isinstance(c, exp.ColumnDef)]
        if not 1 <= len(columns) <= 100:
            raise ValueError(f"Table {name} must define between 1 and 100 columns.")
        fields = []
        for column in columns:
            data_type = column.args.get("kind")
            constraints = [c.args.get("kind") for c in column.args.get("constraints", [])]
            fields.append({"id": uuid4().hex, "name": column.name,
                           "data_type": data_type.sql(dialect=dialect) if data_type else "",
                           "pk": any(isinstance(c, exp.PrimaryKeyColumnConstraint) for c in constraints),
                           "fk": any(isinstance(c, exp.Reference) for c in constraints)})
        by_name = {f["name"].casefold(): f for f in fields}
        if len(by_name) != len(fields):
            raise ValueError(f"Table {name} has duplicate column names.")
        if any(not f["name"].strip() or len(f["name"]) > 200 or len(f["data_type"]) > 100 for f in fields):
            raise ValueError(f"Table {name} has a column name or type exceeding the diagram limits.")
        for constraint_type, flag in ((exp.PrimaryKey, "pk"), (exp.ForeignKey, "fk")):
            for constraint in schema.find_all(constraint_type):
                for identifier in constraint.expressions:
                    field = by_name.get(identifier.name.casefold())
                    if field is None:
                        raise ValueError(f"Table {name} references an undefined column: {identifier.name}.")
                    field[flag] = True
        result.append({"ifNotExists": bool(statement.args.get("exists")),
                       "entity": {"id": uuid4().hex, "name": name, "role": "table", "annotation": "",
                                  "position": {"x": 60, "y": 60}, "fields": fields}})
    return result
