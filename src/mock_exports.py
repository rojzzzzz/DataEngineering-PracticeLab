"""UTF-8 serializers and typed DuckDB staging; no user SQL is executed."""
import csv
from datetime import date, datetime
from decimal import Decimal
import json
import re
from uuid import UUID
import zipfile


def text_value(value):
    if value is None:
        return None
    # Most generated cells are plain text or integers. Preserve subclass and
    # boolean handling below, while avoiding six type checks for each cell.
    if type(value) is str:
        return value
    if type(value) is int:
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat().replace("+00:00", "Z")
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


def json_value(value):
    return text_value(value) if isinstance(value, (date, Decimal, UUID)) else value


def filenames(tables, extension):
    used = {"recipe.json", "manifest.json", "samples.json", "dataset.zip", "preview.json", "status.json", "request.json", "worker.log", "stage.duckdb"}
    names = {}
    for table in tables:
        stem = re.sub(r"[^A-Za-z0-9_-]+", "_", table["name"]).strip("_")[:70] or "table"
        if stem.upper() in ("CON", "PRN", "AUX", "NUL", *[f"COM{i}" for i in range(1, 10)], *[f"LPT{i}" for i in range(1, 10)]):
            stem = "table_" + stem
        if re.fullmatch(r"stage_\d+", stem):
            stem = "table_" + stem
        candidate, n = f"{stem}.{extension}", 2
        while candidate.casefold() in used:
            candidate = f"{stem}_{n}.{extension}"
            n += 1
        used.add(candidate.casefold())
        names[table["id"]] = candidate
    return names


class RowWriter:
    def __init__(self, path, table, output):
        self.format, self.output = output["format"], output
        self.names = [f["name"] for f in table["fields"]]
        self.file = path.open("w", encoding="utf-8", newline="")
        self.first = True
        if self.format in ("csv", "text"):
            self.writer = csv.writer(self.file, delimiter="," if self.format == "csv" else output["delimiter"], lineterminator="\n")
            if output["header"]:
                self.writer.writerow(self.names)
        elif self.format == "json":
            self.file.write("[")

    def row(self, row):
        if self.format in ("csv", "text"):
            values = [text_value(v) for v in row]
            if self.output["null_marker"] in [v for v in values if v is not None]:
                raise ValueError("A literal value collides with the null marker. Choose a different null marker and generate again.")
            self.writer.writerow([self.output["null_marker"] if v is None else v for v in values])
        else:
            if self.format == "json" and not self.first:
                self.file.write(",\n")
            self.file.write(json.dumps(dict(zip(self.names, map(json_value, row))), ensure_ascii=False, allow_nan=False))
            if self.format == "jsonl":
                self.file.write("\n")
        self.first = False

    def close(self):
        if self.format == "json":
            self.file.write("]\n")
        self.file.close()


def sql_type(field):
    return {"integer": "BIGINT", "decimal": f"DECIMAL({field['precision']},{field['scale']})",
            "boolean": "BOOLEAN", "string": "VARCHAR", "date": "DATE", "timestamp": "TIMESTAMPTZ", "uuid": "UUID"}[field["type"]]


def quote_identifier(value):
    return '"' + value.replace('"', '""') + '"'


def literal(value):
    return "'" + value.replace("'", "''") + "'"


def stage_table(connection, table, path, marker, name):
    columns = "{" + ",".join(f"{literal('f' + str(i))}: {literal(sql_type(f))}" for i, f in enumerate(table["fields"])) + "}"
    connection.execute(f"CREATE TABLE {name} AS SELECT * FROM read_csv(?, header=false, auto_detect=false, columns={columns}, nullstr=?, delim=',', strict_mode=true)", [str(path), marker])


def validate_staged(connection, recipe, staged):
    counts = {}
    for table in recipe["tables"]:
        name = staged[table["id"]]
        columns = ",".join(f"count(*) - count(f{i})" for i in range(len(table["fields"])))
        record = connection.execute(f"SELECT count(*),{columns} FROM {name}").fetchone()
        if record[0] != table["rows"]:
            raise ValueError(f"{table['name']}: row count validation failed.")
        checks = {"primary_keys": {}, "relationships": {}}
        counts[table["id"]] = {"rows": record[0], "null_counts": {f["id"]: record[i + 1] for i, f in enumerate(table["fields"])}, "checks": checks}
        for i, field in enumerate(table["fields"]):
            if field["primary_key"]:
                distinct = connection.execute(f"SELECT count(distinct f{i}) FROM {name}").fetchone()[0]
                if record[i + 1] or distinct != record[0]:
                    raise ValueError(f"{table['name']}.{field['name']}: primary-key uniqueness validation failed.")
                checks["primary_keys"][field["id"]] = {"unique_values": distinct, "nulls": record[i + 1], "passed": True}
            ref = field.get("reference")
            if ref:
                parent = next(t for t in recipe["tables"] if t["id"] == ref["table_id"])
                j = next(j for j, f in enumerate(parent["fields"]) if f["id"] == ref["field_id"])
                missing = connection.execute(f"SELECT count(*) FROM {name} c WHERE c.f{i} IS NOT NULL AND NOT EXISTS (SELECT 1 FROM {staged[parent['id']]} p WHERE p.f{j}=c.f{i})").fetchone()[0]
                if missing:
                    raise ValueError("Foreign-key validation failed.")
                checks["relationships"][field["id"]] = {"checked_values": record[0] - record[i + 1], "missing_parents": missing,
                                                         "relation": ref["relation"], "passed": True}
                if ref["relation"] == "one-to-one":
                    unique = connection.execute(f"SELECT count(distinct f{i})=count(f{i}) FROM {name}").fetchone()[0]
                    if not unique:
                        raise ValueError("One-to-one uniqueness validation failed.")
    return counts


def parquet_export(connection, table, name, path):
    columns = ",".join(f"f{i} AS {quote_identifier(f['name'])}" for i, f in enumerate(table["fields"]))
    connection.execute(f"COPY (SELECT {columns} FROM {name} ORDER BY rowid) TO {literal(str(path))} (FORMAT PARQUET, COMPRESSION SNAPPY)")


def bundle(path, files, recipe, manifest, check):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED, compresslevel=1) as archive:
        for file in files:
            # Chunked copies let the worker enforce cancellation/storage limits.
            with file.open("rb") as source, archive.open(file.name, "w", force_zip64=True) as target:
                while chunk := source.read(1024**2):
                    target.write(chunk)
                    check()
        archive.writestr("recipe.json", json.dumps(recipe, ensure_ascii=False, indent=2))
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
