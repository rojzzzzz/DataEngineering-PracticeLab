"""Bounded deterministic row generation, independent of batching and output format."""
from datetime import timedelta
from decimal import Decimal, localcontext, ROUND_HALF_UP
import hashlib
from itertools import accumulate
import math
import random
from uuid import UUID

from src.mock_models import typed_value, ordered_fields


def stream_seed(recipe, table, field, purpose):
    payload = f"{recipe['seed']}:{table['id']}:{field['id']}:{purpose}".encode()
    return int.from_bytes(hashlib.sha256(payload).digest()[:16], "big")


def key_at(recipe, table, field, index, *, seed=None):
    gen = field["generator"]
    if gen["kind"] == "sequence":
        return gen["start"] + index * gen["step"]
    # A bijection of the 122 available UUID-v4 bits; unique for every row index.
    # Unlike per-row hashes, this gives a strict uniqueness guarantee.
    mask = (1 << 122) - 1
    if seed is None:
        seed = stream_seed(recipe, table, field, "uuid")
    n = (index * ((seed << 1) | 1) + (seed >> 5)) & mask
    low = n & ((1 << 62) - 1)
    mid = (n >> 62) & ((1 << 12) - 1)
    high = n >> 74
    return UUID(int=(high << 80) | (4 << 76) | (mid << 64) | (2 << 62) | low)


class ColumnGenerator:
    def __init__(self, recipe, table, field):
        self.recipe, self.table, self.field = recipe, table, field
        self.gen = field["generator"]
        self.rng = random.Random(stream_seed(recipe, table, field, "values"))
        self.null_rng = random.Random(stream_seed(recipe, table, field, "nulls"))
        kind = self.gen["kind"]
        # Key seeds belong to this recipe/column, not to individual rows. A
        # foreign-key column uses the parent's exact seed to preserve its domain.
        self.key_seed = stream_seed(recipe, table, field, "uuid") if kind == "uuid" else None
        if kind == "regex":
            from src.mock_regex import compile_pattern
            self.regex_rule = compile_pattern(self.gen["pattern"], field["max_length"])
        if kind == "faker":
            from faker import Faker
            self.fake = Faker(recipe["locale"])
            self.fake.seed_instance(stream_seed(recipe, table, field, "faker"))
        if kind in ("number", "date", "timestamp"):
            self.low, self.high = (typed_value(field, self.gen[k]) for k in ("min", "max"))
            if field["type"] == "decimal":
                with localcontext() as ctx:
                    ctx.prec = 50
                    self.low, self.high = int(self.low.scaleb(field["scale"])), int(self.high.scaleb(field["scale"]))
        if kind == "constant":
            self.constant = typed_value(field, self.gen["value"])
        if kind == "choice":
            self.choices = [typed_value(field, v) for v in self.gen["values"]]
            self.cumulative_weights = list(accumulate(self.gen["weights"]))
        if kind == "foreign_key":
            ref = field["reference"]
            self.parent = next(t for t in recipe["tables"] if t["id"] == ref["table_id"])
            self.pk = next(f for f in self.parent["fields"] if f["id"] == ref["field_id"])
            if self.pk["generator"]["kind"] == "uuid":
                self.key_seed = stream_seed(recipe, self.parent, self.pk, "uuid")
            n = self.parent["rows"]
            self.a, self.b = self.rng.randrange(1, n + 1), self.rng.randrange(n)
            while math.gcd(self.a, n) != 1:
                self.a = self.a % n + 1

    def value(self, index, row=None):
        kind, field = self.gen["kind"], self.field
        if kind in ("multiply", "date_after"):
            if kind == "multiply":
                left, right = row[self.gen["left_field_id"]], row[self.gen["right_field_id"]]
                if left is None or right is None:
                    result = None
                else:
                    with localcontext() as context:
                        context.prec = 120
                        result = left * right
                        if field["type"] == "decimal":
                            result = str(Decimal(result).quantize(Decimal(1).scaleb(-field["scale"]), rounding=ROUND_HALF_UP))
                        result = typed_value(field, result)
            else:
                source = row[self.gen["source_field_id"]]
                offset = self.rng.randint(self.gen["min_days"], self.gen["max_days"])
                result = None if source is None else source + timedelta(days=offset)
        elif kind in ("sequence", "uuid"):
            result = key_at(self.recipe, self.table, field, index, seed=self.key_seed)
        elif kind == "number":
            number = self.rng.randint(self.low, self.high)
            if field["type"] == "decimal":
                with localcontext() as ctx:
                    ctx.prec = 50
                    result = Decimal(number).scaleb(-field["scale"])
            else:
                result = number
        elif kind == "date":
            result = self.low + timedelta(days=self.rng.randint(0, (self.high - self.low).days))
        elif kind == "timestamp":
            delta = self.high - self.low
            micros = (delta.days * 86400 + delta.seconds) * 1_000_000 + delta.microseconds
            result = self.low + timedelta(microseconds=self.rng.randint(0, micros))
        elif kind == "boolean":
            result = self.rng.random() < self.gen["probability"]
        elif kind == "constant":
            result = self.constant
        elif kind == "choice":
            result = self.rng.choices(self.choices, cum_weights=self.cumulative_weights, k=1)[0]
        elif kind == "regex":
            from src.mock_regex import generate_pattern
            result = generate_pattern(self.regex_rule, self.rng)
        elif kind == "faker":
            provider = self.gen["provider"]
            result = (self.fake.text(max_nb_chars=200) if provider == "text" else getattr(self.fake, provider)())[:field["max_length"]]
        elif kind == "foreign_key":
            n = self.parent["rows"]
            parent_index = (self.a * index + self.b) % n if field["reference"]["relation"] == "one-to-one" else self.rng.randrange(n)
            result = key_at(self.recipe, self.parent, self.pk, parent_index, seed=self.key_seed)
        else:
            raise ValueError("Unsupported generator.")
        return None if self.null_rng.random() * 100 < field["null_pct"] else result


def iter_rows(recipe, table, count=None):
    columns = [ColumnGenerator(recipe, table, field) for field in ordered_fields(table)]
    for index in range(table["rows"] if count is None else min(count, table["rows"])):
        row = {}
        for column in columns:
            row[column.field["id"]] = column.value(index, row)
        yield tuple(row[field["id"]] for field in table["fields"])
