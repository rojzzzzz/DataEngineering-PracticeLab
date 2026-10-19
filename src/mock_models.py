"""Versioned mock-data recipes. All references use stable IDs, never names."""
from __future__ import annotations

from copy import deepcopy
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
import json
import math
import re
from uuid import uuid4, UUID

VERSION = 1
ENGINE_VERSION = "1.1.0"
FAKER_VERSION = "40.39.0"
MAX_ROWS = 1_000_000
MAX_CELLS = 10_000_000
MAX_TABLES = 20
MAX_FIELDS = 100
MAX_ARTIFACT = 100 * 1024**2
MAX_STORAGE = 512 * 1024**2
MAX_SECONDS = 300
MAX_RECIPE = 2 * 1024**2
TYPES = ("integer", "decimal", "boolean", "string", "date", "timestamp", "uuid")
FAKER_PROVIDERS = ("name", "email", "company", "address", "text")
GENERATORS = {
    "integer": ("sequence", "number", "constant", "choice", "foreign_key", "multiply"),
    "decimal": ("number", "constant", "choice", "multiply"),
    "boolean": ("boolean", "constant", "choice"),
    "string": ("faker", "constant", "choice", "regex"),
    "date": ("date", "constant", "choice", "date_after"),
    "timestamp": ("timestamp", "constant", "choice", "date_after"),
    "uuid": ("uuid", "constant", "choice", "foreign_key"),
}


def uid():
    return str(uuid4())


def directory_bytes(directory):
    total = 0
    for path in directory.rglob("*"):
        try:
            if path.is_file():
                total += path.stat().st_size
        except FileNotFoundError:
            # Atomic status replacement and staging cleanup may race inspection.
            continue
    return total


def default_generator(kind):
    return deepcopy({
        "integer": {"kind": "number", "min": 0, "max": 1000},
        "decimal": {"kind": "number", "min": "0.00", "max": "1000.00"},
        "boolean": {"kind": "boolean", "probability": .5},
        "string": {"kind": "faker", "provider": "name"},
        "date": {"kind": "date", "min": "2025-01-01", "max": "2026-12-31"},
        "timestamp": {"kind": "timestamp", "min": "2025-01-01T00:00:00Z", "max": "2026-12-31T23:59:59Z"},
        "uuid": {"kind": "uuid"},
    }.get(kind, {"kind": "constant", "value": ""}))


def new_field(name="field", kind="string", pk=False):
    return {"id": uid(), "name": name, "type": kind, "primary_key": pk,
            "null_pct": 0, "max_length": 200, "precision": 12, "scale": 2,
            "generator": {"kind": "sequence", "start": 1, "step": 1} if pk and kind == "integer" else default_generator(kind),
            "reference": None}


def new_table(name="table"):
    return {"id": uid(), "name": name, "rows": 1000,
            "fields": [new_field("id", "integer", True), new_field("name")]}


def new_recipe():
    return {"format": "constructor-mock-data", "version": VERSION,
            "engine_version": ENGINE_VERSION, "faker_version": FAKER_VERSION,
            "seed": 42, "locale": "en_US", "tables": [new_table("sample")],
            "pending_mappings": [], "output": {"format": "csv", "delimiter": "\t", "header": True, "null_marker": "\\N"}}


def example_recipe(name):
    value = new_recipe()
    if name == "Simple table":
        return value
    if name == "Application events":
        table = value["tables"][0]
        table["name"] = "events"
        table["fields"] = [new_field("event_id", "uuid", True), new_field("occurred_at", "timestamp"), new_field("event_type")]
        table["fields"][-1]["generator"] = {"kind": "choice", "values": ["page_view", "signup", "purchase"], "weights": [70, 20, 10]}
        return value
    parent, child = new_table("customers" if name == "Customers / orders" else "products"), new_table("orders" if name == "Customers / orders" else "sales")
    parent["rows"], child["rows"] = 1000, 5000
    parent["fields"][1]["name"] = "name"
    parent["fields"][1]["generator"]["provider"] = "name" if name == "Customers / orders" else "company"
    fk = new_field("customer_id" if name == "Customers / orders" else "product_id", "integer")
    fk.update(generator={"kind": "foreign_key"}, reference={"table_id": parent["id"], "field_id": parent["fields"][0]["id"], "relation": "many-to-one"})
    amount, status = new_field("amount", "decimal"), new_field("status")
    status["generator"] = {"kind": "choice", "values": ["completed", "pending", "cancelled"], "weights": [70, 20, 10]}
    child["fields"] = [child["fields"][0], fk, amount, status, new_field("created_at", "timestamp")]
    value["tables"] = [parent, child]
    return value


def typed_value(field, value):
    """Reject coercions that silently lose precision or change type."""
    kind = field["type"]
    if kind == "integer":
        if type(value) is not int or not -(2**63) <= value < 2**63:
            raise ValueError("Use a signed 64-bit integer.")
        return value
    if kind == "decimal":
        if isinstance(value, (bool, float)):
            raise ValueError("Write exact decimals as strings, such as \"12.50\".")
        try:
            result = Decimal(value)
            if not result.is_finite() or result.copy_abs() >= Decimal(10) ** (field["precision"] - field["scale"]):
                raise ValueError("Decimal exceeds its precision.")
            quantum = Decimal(1).scaleb(-field["scale"])
            # Decimal's default context has only 28 digits; supported precision is 38.
            from decimal import localcontext
            with localcontext() as context:
                context.prec = 50
                if result != result.quantize(quantum):
                    raise ValueError("Decimal has more fractional digits than its scale.")
                return result.quantize(quantum)
        except (InvalidOperation, TypeError):
            raise ValueError("Use a finite decimal string.") from None
    if kind == "boolean":
        if type(value) is not bool:
            raise ValueError("Use true or false.")
        return value
    if kind == "string":
        if not isinstance(value, str) or len(value) > field["max_length"]:
            raise ValueError("Text exceeds its configured maximum length.")
        return value
    if not isinstance(value, str):
        raise ValueError("Use an ISO date, UTC timestamp, or UUID string.")
    try:
        if kind == "date":
            return date.fromisoformat(value)
        if kind == "timestamp":
            result = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if result.tzinfo is None or result.utcoffset().total_seconds() != 0:
                raise ValueError("Timestamp must include UTC (Z or +00:00).")
            return result.astimezone(timezone.utc)
        if kind == "uuid":
            return UUID(value)
    except (ValueError, OverflowError):
        raise ValueError(f"Use a valid {kind}; timestamps must explicitly use UTC.") from None
    raise ValueError("Resolve this unknown storage type first.")


def _number(value):
    return type(value) in (int, float) and math.isfinite(value)


def _exact_keys(value, allowed, label):
    unknown = set(value) - set(allowed)
    if unknown:
        raise ValueError(f"{label}: unsupported settings {', '.join(sorted(unknown))}. Remove unsupported constraints or expressions.")


def recipe_issues(value):
    """Return actionable errors, including unresolved diagram mappings."""
    issues = []
    try:
        if not isinstance(value, dict):
            raise ValueError("Recipe must be a JSON object.")
        _exact_keys(value, ("format", "version", "engine_version", "faker_version", "seed", "locale", "tables", "output", "pending_mappings"), "Recipe")
        if value.get("format") != "constructor-mock-data" or type(value.get("version")) is not int or value["version"] != VERSION:
            raise ValueError("Unsupported recipe format or version.")
        if value.get("engine_version") not in ("1.0.0", ENGINE_VERSION) or value.get("faker_version") != FAKER_VERSION:
            raise ValueError("Recipe generator versions differ. Use the matching engine/Faker version or explicitly update the recipe versions before importing.")
        if type(value.get("seed")) is not int or not 0 <= value["seed"] < 2**63:
            raise ValueError("Seed must be an integer from 0 to 9223372036854775807.")
        if value.get("locale") != "en_US":
            raise ValueError("This release supports English (en_US) Faker values.")
        tables = value.get("tables")
        if not isinstance(tables, list) or not 1 <= len(tables) <= MAX_TABLES:
            raise ValueError("Use between 1 and 20 tables.")
        output = value.get("output")
        if not isinstance(output, dict):
            raise ValueError("Output settings must be an object.")
        _exact_keys(output, ("format", "delimiter", "header", "null_marker"), "Output")
        if output.get("format") not in ("csv", "json", "jsonl", "parquet", "text") or type(output.get("header")) is not bool:
            raise ValueError("Choose CSV, JSON, JSONL, Parquet, or TEXT and a boolean header setting.")
        delimiter = output.get("delimiter")
        if not isinstance(delimiter, str) or len(delimiter) != 1 or delimiter in '\r\n\0"' or len(delimiter.encode("utf-8")) > 4:
            raise ValueError("TEXT delimiter must be a single character other than newline, NUL, or a quote.")
        marker = output.get("null_marker")
        if not isinstance(marker, str) or not 1 <= len(marker) <= 40 or any(c in marker for c in ("\r", "\n", "\0")):
            raise ValueError("Choose a nonempty null marker of up to 40 characters, without newlines or NUL.")
        pending = value.get("pending_mappings", [])
        if not isinstance(pending, list) or len(pending) > 300 or any(not isinstance(p, dict) for p in pending):
            raise ValueError("Invalid unresolved diagram mappings.")
        for mapping in pending:
            issues.append(f"Diagram relationship {mapping.get('label', mapping.get('id', '?'))}: confirm foreign-key fields in Schema before generating.")
        ids, names, field_ids, row_total, cell_total = set(), set(), set(), 0, 0
        for table in tables:
            if not isinstance(table, dict):
                raise ValueError("Each table must be an object.")
            _exact_keys(table, ("id", "name", "rows", "fields"), "Table")
            _identity(table, ids, names, "Table")
            rows = table.get("rows")
            if type(rows) is not int or not 1 <= rows <= MAX_ROWS:
                raise ValueError(f"{table['name']}: use 1–1,000,000 rows.")
            fields = table.get("fields")
            if not isinstance(fields, list) or not 1 <= len(fields) <= MAX_FIELDS:
                raise ValueError(f"{table['name']}: use 1–100 fields.")
            row_total += rows
            cell_total += rows * len(fields)
            field_names = set()
            pk_count = 0
            for field in fields:
                label = f"{table['name']}.{field.get('name', '?')}" if isinstance(field, dict) else table["name"]
                try:
                    if not isinstance(field, dict):
                        raise ValueError("Each field must be an object.")
                    _exact_keys(field, ("id", "name", "type", "primary_key", "null_pct", "max_length", "precision", "scale", "generator", "reference", "source_type", "unresolved_fk"), label)
                    _identity(field, field_ids, field_names, "Field")
                    if field.get("type") not in TYPES:
                        raise ValueError(f"Unknown type {field.get('source_type', field.get('type'))!r}. Choose a supported storage type.")
                    if type(field.get("primary_key")) is not bool:
                        raise ValueError("Primary key must be a boolean.")
                    pk_count += field["primary_key"]
                    if not _number(field.get("null_pct")) or not 0 <= field["null_pct"] <= 100:
                        raise ValueError("Missing-value probability must be between 0% and 100%.")
                    for key, low, high in (("max_length", 1, 4000), ("precision", 1, 38), ("scale", 0, 38)):
                        if type(field.get(key)) is not int or not low <= field[key] <= high:
                            raise ValueError(f"{key} must be between {low} and {high}.")
                    if field["scale"] > field["precision"]:
                        raise ValueError("Decimal scale cannot exceed precision.")
                    if field.get("unresolved_fk"):
                        issues.append(f"{label}: Diagram FK flag needs a confirmed parent field mapping.")
                    _validate_generator(field, rows)
                except (ValueError, KeyError, TypeError, OverflowError) as exc:
                    issues.append(f"{label}: {exc}")
            if pk_count > 1:
                issues.append(f"{table['name']}: composite primary keys are unsupported. Choose one primary-key field.")
            try:
                ordered_fields(table)
                for field in fields:
                    validate_dependencies(value, table, field)
            except (ValueError, KeyError, TypeError, OverflowError) as exc:
                issues.append(f"{table['name']}: {exc}")
        if row_total > MAX_ROWS:
            issues.append("One million total rows exceeded. Reduce the row counts across your tables.")
        if cell_total > MAX_CELLS:
            issues.append("Ten million generated cells exceeded. Reduce rows or remove fields.")
        for table in tables:
            for field in table["fields"]:
                ref = field.get("reference")
                if ref is None:
                    continue
                try:
                    if not isinstance(ref, dict):
                        raise ValueError("Foreign-key reference must be an object.")
                    _exact_keys(ref, ("table_id", "field_id", "relation"), "Reference")
                    parent = next((t for t in tables if t["id"] == ref.get("table_id")), None)
                    pk = next((f for f in parent["fields"] if f["id"] == ref.get("field_id")), None) if parent else None
                    if not pk or not pk["primary_key"]:
                        raise ValueError("Reference must target an existing single-column primary key.")
                    if field["type"] != pk["type"] or field["generator"]["kind"] != "foreign_key":
                        raise ValueError("Use the parent's storage type and the foreign_key generator.")
                    if ref.get("relation") not in ("many-to-one", "one-to-one"):
                        raise ValueError("Choose many-to-one or one-to-one; use a junction table for many-to-many.")
                    if ref["relation"] == "one-to-one" and table["rows"] > parent["rows"]:
                        raise ValueError("One-to-one needs at least as many parent rows as child rows. Reduce child rows or add parent rows.")
                except (ValueError, KeyError, TypeError) as exc:
                    issues.append(f"{table['name']}.{field['name']}: {exc}")
        try:
            ordered_tables(value)
        except ValueError as exc:
            issues.append(str(exc))
    except (ValueError, KeyError, TypeError, OverflowError, AttributeError) as exc:
        issues.append(str(exc))
    return list(dict.fromkeys(issues))


def _identity(item, ids, names, label):
    identity, name = item.get("id"), item.get("name")
    if not isinstance(identity, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", identity) or identity in ids:
        raise ValueError(f"{label} IDs must be unique stable identifiers (1–80 letters, digits, underscores, or hyphens).")
    if not isinstance(name, str) or not name.strip() or len(name) > 100 or any(ord(c) < 32 for c in name) or name.casefold() in names:
        raise ValueError(f"{label} names must be unique, nonempty, at most 100 characters, and contain no control characters.")
    ids.add(identity)
    names.add(name.casefold())


def _validate_generator(field, rows):
    gen = field.get("generator")
    if not isinstance(gen, dict) or gen.get("kind") not in GENERATORS[field["type"]]:
        raise ValueError("Choose a generator compatible with this storage type.")
    kind = gen["kind"]
    keys = {"sequence": ("kind", "start", "step"), "uuid": ("kind",), "number": ("kind", "min", "max"), "date": ("kind", "min", "max"), "timestamp": ("kind", "min", "max"), "constant": ("kind", "value"), "boolean": ("kind", "probability"), "choice": ("kind", "values", "weights"), "faker": ("kind", "provider"), "foreign_key": ("kind",)}
    keys["regex"] = ("kind", "pattern")
    keys["multiply"] = ("kind", "left_field_id", "right_field_id")
    keys["date_after"] = ("kind", "source_field_id", "min_days", "max_days")
    _exact_keys(gen, keys[kind], "Generator")
    if kind == "regex":
        from src.mock_regex import compile_pattern
        compile_pattern(gen.get("pattern"), field["max_length"])
    if kind == "date_after":
        if (type(gen.get("min_days")) is not int or type(gen.get("max_days")) is not int
                or not 0 <= gen["min_days"] <= gen["max_days"] <= 36500):
            raise ValueError("Date offsets need whole days from 0 to 36500, with minimum ≤ maximum.")
    if field["primary_key"] and (kind not in ("sequence", "uuid") or field["null_pct"] != 0 or field.get("reference")):
        raise ValueError("Primary keys need sequence or UUID, zero missing values, and no foreign-key reference.")
    if kind == "sequence":
        typed_value(field, gen.get("start"))
        if type(gen.get("step")) is not int or gen["step"] == 0:
            raise ValueError("Sequence step must be a nonzero integer.")
        typed_value(field, gen["start"] + gen["step"] * (rows - 1))
    if kind in ("number", "date", "timestamp"):
        low, high = typed_value(field, gen.get("min")), typed_value(field, gen.get("max"))
        if low > high:
            raise ValueError("Minimum cannot exceed maximum.")
    if kind == "constant":
        typed_value(field, gen.get("value"))
    if kind == "boolean" and (not _number(gen.get("probability")) or not 0 <= gen["probability"] <= 1):
        raise ValueError("True probability must be between 0 and 1.")
    if kind == "choice":
        values, weights = gen.get("values"), gen.get("weights")
        if not isinstance(values, list) or not isinstance(weights, list) or not 1 <= len(values) <= 1000 or len(values) != len(weights):
            raise ValueError("Supply 1–1000 choices and one weight for each choice.")
        if any(not _number(w) or w < 0 for w in weights) or not math.isfinite(sum(weights)) or sum(weights) <= 0:
            raise ValueError("Weights must be finite, nonnegative, and sum to more than zero.")
        for choice in values:
            typed_value(field, choice)
    if kind == "faker" and gen.get("provider") not in FAKER_PROVIDERS:
        raise ValueError("Choose an allowlisted Faker provider: name, email, company, address, text.")
    if kind == "foreign_key" and not field.get("reference"):
        raise ValueError("Choose a parent primary-key field for this foreign key.")
    if kind != "foreign_key" and field.get("reference") is not None:
        raise ValueError("A reference needs the foreign_key generator.")


def ordered_tables(recipe):
    remaining = list(recipe["tables"])
    done, result = set(), []
    while remaining:
        ready = [t for t in remaining if all(not f.get("reference") or f["reference"].get("table_id") in done for f in t["fields"])]
        if not ready:
            raise ValueError("Cyclic or missing table references. Remove the cycle or choose an existing parent table.")
        for table in ready:
            remaining.remove(table)
            result.append(table)
            done.add(table["id"])
    return result


def source_fields(field):
    gen = field.get("generator", {})
    if gen.get("kind") == "multiply":
        return [gen.get("left_field_id"), gen.get("right_field_id")]
    if gen.get("kind") == "date_after":
        return [gen.get("source_field_id")]
    return []


def ordered_fields(table):
    """Resolve same-row dependencies without changing the declared column order."""
    remaining, result, done = list(table["fields"]), [], set()
    while remaining:
        ready = [f for f in remaining if all(identity in done for identity in source_fields(f))]
        if not ready:
            raise ValueError("Column rules contain a cycle or a missing source column. Choose existing sources without a cycle.")
        for field in ready:
            remaining.remove(field)
            result.append(field)
            done.add(field["id"])
    return result


def validate_dependencies(recipe, table, field):
    sources = source_fields(field)
    if not sources:
        return
    if recipe["engine_version"] == "1.0.0":
        raise ValueError("Dependent column rules require engine_version 1.1.0.")
    fields = {f["id"]: f for f in table["fields"]}
    gen = field["generator"]
    for identity in sources:
        if not isinstance(identity, str) or identity not in fields or identity == field["id"]:
            raise ValueError(f"{field['name']}: choose a different source column in this table.")
        source = fields[identity]
        if gen["kind"] == "multiply":
            allowed = ("integer",) if field["type"] == "integer" else ("integer", "decimal")
            if source["type"] not in allowed:
                raise ValueError(f"{field['name']}: multiplication needs numeric source columns; integer results need integer sources.")
        elif source["type"] != field["type"]:
            raise ValueError(f"{field['name']}: date offsets need a source of the same date or timestamp type.")
    # Prove that even the extremes fit before starting a job.
    try:
        field_bounds(recipe, table, field)
    except OverflowError:
        raise ValueError(f"{field['name']}: result exceeds the supported date range. Reduce source bounds or day offsets.") from None
    except ValueError as exc:
        raise ValueError(f"{field['name']}: {exc}") from None


def field_bounds(recipe, table, field):
    gen, kind = field["generator"], field["generator"]["kind"]
    if kind in ("number", "date", "timestamp"):
        return tuple(typed_value(field, gen[k]) for k in ("min", "max"))
    if kind == "sequence":
        values = [gen["start"], gen["start"] + gen["step"] * (table["rows"] - 1)]
    elif kind == "constant":
        values = [typed_value(field, gen["value"])]
    elif kind == "choice":
        values = [typed_value(field, v) for v in gen["values"]]
    elif kind == "foreign_key":
        ref = field["reference"]
        parent = next((t for t in recipe["tables"] if t["id"] == ref["table_id"]), None)
        source = next((f for f in parent["fields"] if f["id"] == ref["field_id"]), None) if parent else None
        if source is None:
            raise ValueError("Choose an existing parent primary key for this source.")
        if not source["primary_key"] or source["generator"]["kind"] != "sequence":
            raise ValueError("Numeric related-column sources need a sequence primary key.")
        return field_bounds(recipe, parent, source)
    elif kind in ("multiply", "date_after"):
        # Memoization is local to this traversal; shared sources never expand exponentially.
        bounds, needed = {}, dependency_closure(table, field)
        for current in ordered_fields(table):
            if current["id"] == field["id"]:
                break
            if current["id"] in needed:
                bounds[current["id"]] = field_bounds_from_sources(recipe, table, current, bounds)
        return field_bounds_from_sources(recipe, table, field, bounds)
    else:
        raise ValueError(f"{field['name']}: this source does not support a numeric or date dependency.")
    return min(values), max(values)


def dependency_closure(table, field):
    fields = {f["id"]: f for f in table["fields"]}
    pending, result = source_fields(field), set()
    while pending:
        identity = pending.pop()
        if identity not in result:
            result.add(identity)
            pending.extend(source_fields(fields[identity]))
    return result


def field_bounds_from_sources(recipe, table, field, bounds):
    from datetime import timedelta
    from decimal import localcontext, ROUND_HALF_UP
    gen = field["generator"]
    if not source_fields(field):
        return field_bounds(recipe, table, field)
    if gen["kind"] == "date_after":
        low, high = bounds[gen["source_field_id"]]
        return low + timedelta(days=gen["min_days"]), high + timedelta(days=gen["max_days"])
    with localcontext() as context:
        context.prec = 120
        values = [a * b for a in bounds[gen["left_field_id"]] for b in bounds[gen["right_field_id"]]]
        if field["type"] == "decimal":
            quantum = Decimal(1).scaleb(-field["scale"])
            values = [str(Decimal(v).quantize(quantum, rounding=ROUND_HALF_UP)) for v in values]
        values = [typed_value(field, v) for v in values]
        return min(values), max(values)


def validate_recipe(value):
    issues = recipe_issues(value)
    if issues:
        raise ValueError("\n".join(issues))
    return deepcopy(value)


def import_recipe(payload):
    if len(payload) > MAX_RECIPE:
        raise ValueError("Recipe exceeds 2 MiB. Reduce table/field settings.")
    try:
        return validate_recipe(json.loads(payload))
    except (UnicodeError, json.JSONDecodeError, RecursionError):
        raise ValueError("Choose a valid UTF-8 recipe JSON file.") from None


def export_recipe(recipe):
    # Incomplete recipes can be downloaded for recovery, but cannot be imported
    # over the current workspace until their validation issues are resolved.
    return json.dumps(recipe, ensure_ascii=False, indent=2)


def duplicate_table(recipe, table_id):
    table = deepcopy(next(t for t in recipe["tables"] if t["id"] == table_id))
    table["id"] = uid()
    existing = {t["name"].casefold() for t in recipe["tables"]}
    base = table["name"][:85] + " copy"
    table["name"] = base
    n = 2
    while table["name"].casefold() in existing:
        table["name"] = f"{base} {n}"
        n += 1
    remap = {field["id"]: uid() for field in table["fields"]}
    for field in table["fields"]:
        field["id"] = remap[field["id"]]
        for key in ("left_field_id", "right_field_id", "source_field_id"):
            if key in field["generator"]:
                field["generator"][key] = remap.get(field["generator"][key], field["generator"][key])
    recipe["tables"].append(table)
    return table["id"]


def dependents(recipe, table_id, field_id=None):
    return [f"{t['name']}.{f['name']}" for t in recipe["tables"] for f in t["fields"]
            if (f.get("reference") and f["reference"]["table_id"] == table_id
                and (field_id is None or f["reference"]["field_id"] == field_id))
            or (field_id is not None and t["id"] == table_id and field_id in source_fields(f))]
