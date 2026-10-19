import csv
from copy import deepcopy
from datetime import date, datetime, timezone
from decimal import Decimal
import json
from pathlib import Path
import time
import zipfile

import duckdb
import pytest

from src import mock_jobs
from src.mock_models import (dependents, duplicate_table, example_recipe, export_recipe, import_recipe,
                             new_field, new_recipe, new_table, recipe_issues, typed_value, validate_recipe)
from src.mock_engine import iter_rows
from src.mock_exports import filenames, json_value, text_value
from src.mock_worker import run_job
from src.mock_diagrams import diagram_recipe


@pytest.mark.parametrize("case,expected", [
    ("weighted", "95b1f40b2fa75df43c41ac06c59c5a289b976dfceac6f7c3249071e51ca7ac4c"),
    ("fractional", "8b4292093673919d7261aa2faea28e980825e49eb9376a48f43f1b7f3666c206"),
    ("uuid", "392e8fd4091a20627e0f021478c73ad9949f77842f9458db3c98201c0d35850e"),
])
def test_generation_keeps_preoptimization_seeded_output(case, expected):
    """Golden rows captured from the original engine, including parent domains."""
    import hashlib
    recipe = new_recipe()
    parent = recipe["tables"][0]
    parent.update(id="parent", name="parent", rows=250)
    parent["fields"] = [new_field("id", "integer", True)]
    if case == "uuid":
        parent["rows"] = 25
        parent["fields"][0].update(type="uuid", generator={"kind": "uuid"})
        child = new_table("child")
        child.update(id="child", rows=250)
        child["fields"] = [new_field("id", "uuid", True), new_field("parent_id", "uuid")]
        child["fields"][1].update(generator={"kind": "foreign_key"}, reference={
            "table_id": "parent", "field_id": "parent-0", "relation": "many-to-one"})
        recipe["tables"].append(child)
    else:
        choice = new_field("category", "integer")
        choice["generator"] = {"kind": "choice", "values": list(range(200)), "weights": list(range(1, 201))}
        if case == "fractional":
            choice["generator"]["weights"] = [0 if i % 3 == 0 else i / 10 for i in range(200)]
            choice["null_pct"] = 20
        parent["fields"].append(choice)
    for table in recipe["tables"]:
        for i, field in enumerate(table["fields"]):
            field["id"] = f"{table['id']}-{i}"
    recipe["seed"] = 123456
    validate_recipe(recipe)
    rows = [[list(map(json_value, row)) for row in iter_rows(recipe, table)] for table in recipe["tables"]]
    digest = hashlib.sha256(json.dumps(rows, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    assert digest == expected


@pytest.mark.parametrize("value, expected", [
    (None, None), ("naïve, café\n東京", "naïve, café\n東京"), (42, "42"),
    (-2**63, str(-2**63)), (True, "true"), (False, "false"),
    (Decimal("12.3400"), "12.3400"), (date(2026, 10, 9), "2026-10-09"),
    (datetime(2026, 10, 9, tzinfo=timezone.utc), "2026-10-09T00:00:00Z"),
])
def test_scalar_export_encoding(value, expected):
    assert text_value(value) == expected


def rich_recipe():
    r = example_recipe("Customers / orders")
    r["tables"][0]["rows"], r["tables"][1]["rows"] = 15, 30
    parent = r["tables"][0]
    parent["fields"][0].update(type="uuid", generator={"kind": "uuid"})
    child = r["tables"][1]
    child["fields"][1]["type"] = "uuid"
    text = new_field("notes", "string")
    text["generator"] = {"kind": "choice", "values": ['naïve, café | \"quote\"\nnext', "", "東京"], "weights": [1, 1, 1]}
    missing = new_field("missing", "integer")
    missing["null_pct"] = 100
    child["fields"] += [text, missing, new_field("date", "date"), new_field("active", "boolean")]
    return r


def generate(tmp_path, recipe, fmt="csv", batch=7):
    r = deepcopy(recipe)
    r["output"]["format"] = fmt
    directory = tmp_path / f"{fmt}-{batch}"
    directory.mkdir()
    run_job(directory, {"workspace_id": "workspace", "job_id": "job", "revision": 0, "recipe": r}, batch_size=batch)
    status = json.loads((directory / "status.json").read_text())
    assert status["status"] == "complete", status
    return directory, status, r


@pytest.mark.parametrize("fmt", ["csv", "text", "json", "jsonl", "parquet"])
def test_exports_independent_readback(tmp_path, fmt):
    directory, status, recipe = generate(tmp_path, rich_recipe(), fmt)
    manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["faker_version"] == "40.39.0"
    with zipfile.ZipFile(directory / status["artifact"]) as archive:
        assert set(archive.namelist()) == {*status["files"], "manifest.json", "recipe.json"}
        assert json.loads(archive.read("recipe.json")) == recipe
    for table, filename in zip(recipe["tables"], status["files"]):
        path = directory / filename
        expected = list(iter_rows(recipe, table))
        if fmt in ("csv", "text"):
            with path.open(encoding="utf-8", newline="") as handle:
                rows = list(csv.DictReader(handle, delimiter="," if fmt == "csv" else "\t"))
            assert len(rows) == table["rows"]
            from src.mock_exports import text_value
            assert list(rows[0]) == [f["name"] for f in table["fields"]]
            assert rows == [dict(zip([f["name"] for f in table["fields"]], [recipe["output"]["null_marker"] if v is None else text_value(v) for v in row])) for row in expected]
        elif fmt in ("json", "jsonl"):
            text = path.read_text(encoding="utf-8")
            rows = json.loads(text) if fmt == "json" else [json.loads(line) for line in text.splitlines()]
            assert rows == [dict(zip([f["name"] for f in table["fields"]], map(json_value, row))) for row in expected]
        else:
            with duckdb.connect() as con:
                con.execute("SET TimeZone='UTC'")
                rows = con.execute("SELECT * FROM read_parquet(?)", [str(path)]).fetchall()
                schema = con.execute("DESCRIBE SELECT * FROM read_parquet(?)", [str(path)]).fetchall()
                assert [s[0] for s in schema] == [f["name"] for f in table["fields"]]
                # Parquet UUID logical values are strings; timestamps and decimals retain types.
                assert [tuple(map(json_value, row)) for row in rows] == [tuple(map(json_value, row)) for row in expected]
                for i, field in enumerate(table["fields"]):
                    if field["type"] == "decimal":
                        assert isinstance(rows[0][i], Decimal)
                        assert schema[i][1] == "DECIMAL(12,2)"
                    elif field["type"] == "timestamp":
                        assert rows[0][i].tzinfo is not None
        counts = next(t for t in manifest["tables"] if t["id"] == table["id"])
        assert counts["rows"] == table["rows"]
        assert counts["null_counts"] == {f["id"]: sum(row[i] is None for row in expected) for i, f in enumerate(table["fields"])}


def test_preview_full_batch_agreement_and_complete_parent_domain(tmp_path):
    recipe = rich_recipe()
    recipe["tables"][0]["rows"], recipe["tables"][1]["rows"] = 500, 200
    child = recipe["tables"][1]
    first = list(iter_rows(recipe, child, 50))
    assert first == list(iter_rows(recipe, child))[:50]
    assert any(v[1] not in {row[0] for row in iter_rows(recipe, recipe["tables"][0], 50)} for v in first)
    a, _, _ = generate(tmp_path, recipe, "jsonl", 1)
    b, _, _ = generate(tmp_path, recipe, "jsonl", 37)
    assert (a / "orders.jsonl").read_bytes() == (b / "orders.jsonl").read_bytes()
    preview = tmp_path / "preview"
    preview.mkdir()
    run_job(preview, {"workspace_id": "w", "job_id": "p", "revision": 0, "recipe": recipe, "mode": "preview", "table_id": child["id"]})
    rows = json.loads((preview / "preview.json").read_text(encoding="utf-8"))["rows"]
    assert rows == [json.loads(line) for line in (a / "orders.jsonl").read_text(encoding="utf-8").splitlines()[:50]]


def test_keys_nulls_bounds_and_one_to_one():
    recipe = rich_recipe()
    parent, child = recipe["tables"]
    parent["rows"], child["rows"] = 2000, 1500
    child["fields"][1]["reference"]["relation"] = "one-to-one"
    child["fields"][1]["null_pct"] = 10
    validate_recipe(recipe)
    keys = [row[0] for row in iter_rows(recipe, parent)]
    assert len(keys) == len(set(keys))
    rows = list(iter_rows(recipe, child))
    foreign_keys = [row[1] for row in rows if row[1] is not None]
    assert len(foreign_keys) == len(set(foreign_keys))
    assert set(foreign_keys) <= set(keys)
    assert all(Decimal("0") <= row[2] <= Decimal("1000") for row in rows)
    assert all(row[-3] is None for row in rows)
    assert all(date(2025, 1, 1) <= row[-2] <= date(2026, 12, 31) for row in rows)
    assert all(row[4].utcoffset().total_seconds() == 0 for row in rows)
    assert 930 < sum(row[3] == "completed" for row in rows) < 1170


@pytest.mark.parametrize("mutation,match", [
    (lambda r: r.update(seed=True), "Seed"),
    (lambda r: r.update(expression="import os"), "unsupported"),
    (lambda r: r["tables"][0].update(rows=1_000_001), "rows"),
    (lambda r: r["tables"][0]["fields"][0].update(null_pct=1), "Primary keys"),
    (lambda r: r["tables"][0]["fields"][0]["generator"].update(step=0), "step"),
    (lambda r: r["tables"][0]["fields"][1].update(type="blob"), "Unknown type"),
    (lambda r: r["tables"][0]["fields"][1]["generator"].update(provider="file_path"), "allowlisted"),
    (lambda r: r["tables"][0]["fields"][0]["generator"].update(start=2**63), "64-bit"),
    (lambda r: r["tables"][0]["fields"][1].update(null_pct=float("nan")), "probability"),
    (lambda r: r["tables"][0]["fields"][1].update(primary_key=True), "composite"),
])
def test_invalid_recipes(mutation, match):
    r = new_recipe()
    mutation(r)
    with pytest.raises(ValueError, match=match):
        validate_recipe(r)


def test_impossible_references_cycles_and_row_cell_limits():
    r = example_recipe("Customers / orders")
    r["tables"][1]["fields"][1]["reference"]["relation"] = "one-to-one"
    assert any("One-to-one" in e for e in recipe_issues(r))
    r["tables"][1]["fields"][1]["reference"]["relation"] = "many-to-one"
    r["tables"][0]["fields"][1].update(type="integer", generator={"kind": "foreign_key"}, reference={"table_id": r["tables"][1]["id"], "field_id": r["tables"][1]["fields"][0]["id"], "relation": "many-to-one"})
    assert any("Cyclic" in e for e in recipe_issues(r))
    r = new_recipe()
    r["tables"][0]["rows"] = 1_000_000
    r["tables"][0]["fields"] += [new_field(f"x{i}", "integer") for i in range(9)]
    assert any("cells" in e for e in recipe_issues(r))
    r = example_recipe("Customers / orders")
    for t in r["tables"]:
        t["rows"] = 600_000
    assert any("total rows" in e for e in recipe_issues(r))


def test_recipe_roundtrip_stable_references_and_duplication():
    r = rich_recipe()
    assert import_recipe(export_recipe(r)) == r
    parent, child = r["tables"]
    refs = deepcopy(child["fields"][1]["reference"])
    parent["name"], parent["fields"][0]["name"] = "renamed", "renamed_id"
    validate_recipe(r)
    assert child["fields"][1]["reference"] == refs
    assert dependents(r, parent["id"], parent["fields"][0]["id"]) == ["orders.customer_id"]
    duplicate_table(r, parent["id"])
    validate_recipe(r)
    assert r["tables"][-1]["id"] != parent["id"]
    assert not ({f["id"] for f in r["tables"][-1]["fields"]} & {f["id"] for f in parent["fields"]})
    with pytest.raises(ValueError):
        import_recipe(b'{"version":1}')
    with pytest.raises(ValueError):
        import_recipe(b"x" * (2 * 1024**2 + 1))
    malformed = new_recipe()
    malformed["tables"][0]["fields"] = [None]
    assert recipe_issues(malformed)


def test_precision_temporal_constants_and_safe_filenames():
    f = new_field("value", "decimal")
    f.update(precision=38, scale=0)
    assert typed_value(f, "9" * 38) == Decimal("9" * 38)
    f.update(precision=5, scale=2)
    for invalid in ("1000.00", "1.001", "NaN", 1.2):
        with pytest.raises(ValueError):
            typed_value(f, invalid)
    f = new_field("time", "timestamp")
    for invalid in ("2025-01-01T00:00:00", "2025-01-01T00:00:00+03:00"):
        with pytest.raises(ValueError):
            typed_value(f, invalid)
    tables = [new_table("../a"), new_table("..\\a"), new_table("CON"), new_table("manifest")]
    names = filenames(tables, "json")
    assert len(set(names.values())) == 4
    assert all(Path(v).name == v and not v.startswith(".") for v in names.values())


def test_null_marker_collision_and_no_headers(tmp_path):
    r = new_recipe()
    r["tables"][0]["rows"] = 5
    r["tables"][0]["fields"][1]["generator"] = {"kind": "constant", "value": "\\N"}
    directory = tmp_path / "collision"
    directory.mkdir()
    run_job(directory, {"workspace_id": "w", "job_id": "j", "revision": 0, "recipe": r})
    status = json.loads((directory / "status.json").read_text())
    assert status["status"] == "failed" and "null marker" in status["error"]
    assert not (directory / "dataset.zip").exists()
    r["output"].update(header=False, delimiter="|")
    r["tables"][0]["fields"][1]["generator"]["value"] = "a|b"
    directory, status, _ = generate(tmp_path, r, "text")
    with (directory / status["files"][0]).open(newline="", encoding="utf-8") as handle:
        rows = list(csv.reader(handle, delimiter="|"))
    assert rows == [[str(i), "a|b"] for i in range(1, 6)]


def test_reserved_bundle_names_and_export_size_cleanup(tmp_path, monkeypatch):
    r = new_recipe()
    r["tables"][0]["name"] = "manifest"
    r["tables"][0]["rows"] = 3
    directory, status, _ = generate(tmp_path, r, "json")
    assert status["files"] == ["manifest_2.json"]
    with zipfile.ZipFile(directory / "dataset.zip") as archive:
        assert len(json.loads(archive.read("manifest_2.json"))) == 3
        assert json.loads(archive.read("manifest.json"))["format"] == "constructor-mock-manifest"
    from src import mock_worker
    monkeypatch.setattr(mock_worker, "MAX_ARTIFACT", 5)
    directory = tmp_path / "too-large"
    directory.mkdir()
    run_job(directory, {"workspace_id": "w", "job_id": "j", "revision": 0, "recipe": r})
    status = json.loads((directory / "status.json").read_text())
    assert status["status"] == "failed" and "100 MiB" in status["error"]
    assert {p.name for p in directory.iterdir()} == {"status.json"}


@pytest.mark.parametrize("provider", ["name", "email", "company", "address", "text"])
def test_faker_allowlist_seed_and_length(provider):
    r = new_recipe()
    field = r["tables"][0]["fields"][1]
    field.update(max_length=12, generator={"kind": "faker", "provider": provider})
    validate_recipe(r)
    a, b = list(iter_rows(r, r["tables"][0], 25)), list(iter_rows(r, r["tables"][0], 25))
    assert a == b
    assert all(isinstance(row[1], str) and len(row[1]) <= 12 for row in a)


def sample_diagram():
    return {"version": 1, "kind": "logical_erd", "entities": [
        {"id": "a", "name": "customers", "position": {"x": 0, "y": 0}, "fields": [{"id": "i", "name": "id", "data_type": "bigint", "pk": True}]},
        {"id": "b", "name": "orders", "position": {"x": 300, "y": 0}, "fields": [{"id": "i", "name": "id", "data_type": "bigint", "pk": True}, {"id": "fk", "name": "customer_id", "data_type": "bigint", "fk": True}, {"id": "x", "name": "custom", "data_type": "GEOGRAPHY"}]}],
        "relationships": [{"id": "r", "source": "a", "target": "b", "source_cardinality": "one", "target_cardinality": "many", "source_optional": False, "target_optional": False}]}


def test_diagram_copy_keeps_unresolved_keys_types_and_relationships():
    d = sample_diagram()
    original = deepcopy(d)
    r = diagram_recipe(d)
    assert d == original
    issues = recipe_issues(r)
    assert any("confirm foreign-key" in e for e in issues)
    assert any("GEOGRAPHY" in e for e in issues)
    assert any("FK flag" in e for e in issues)
    d["kind"] = "conceptual_erd"
    with pytest.raises(ValueError, match="Conceptual"):
        diagram_recipe(d)


def wait_job(job, timeout=20):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        job.heartbeat()
        result = job.status()
        if result["status"] != "running":
            return result
        time.sleep(.05)
    pytest.fail("Job did not finish within test timeout")


def test_jobs_complete_isolated_stale_and_cleanup():
    r = new_recipe()
    r["tables"][0]["rows"] = 10
    job = mock_jobs.start("session-a", 3, r)
    other = mock_jobs.start("session-b", 3, r, "preview", r["tables"][0]["id"])
    try:
        status = wait_job(job)
        assert status["status"] == "complete", (status, job.process.returncode, (job.directory / "worker.log").read_text())
        assert wait_job(other)["status"] == "complete"
        assert job.directory != other.directory
        assert job.artifact(status["artifact"], "session-a", 3).is_file()
        for workspace, revision in (("session-b", 3), ("session-a", 4)):
            with pytest.raises(ValueError, match="outdated"):
                job.artifact(status["artifact"], workspace, revision)
        with pytest.raises(ValueError):
            job.artifact("../request.json", "session-a", 3)
    finally:
        mock_jobs.close("session-a")
        mock_jobs.close("session-b")
    assert not job.directory.exists() and not other.directory.exists()


def test_cancel_one_active_job_and_crash():
    r = new_recipe()
    r["tables"][0]["rows"] = 1_000_000
    job = mock_jobs.start("cancel", 1, r)
    try:
        with pytest.raises(ValueError, match="already running"):
            mock_jobs.start("cancel", 1, r)
        job.cancel()
        assert job.status()["status"] == "cancelled"
        assert {p.name for p in job.directory.iterdir()} <= {"owner", "heartbeat", "worker.log"}
    finally:
        mock_jobs.close("cancel")
    job = mock_jobs.start("crash", 1, r)
    try:
        job.process.kill()
        status = wait_job(job)
        assert status["status"] == "failed" and "exited unexpectedly" in status["error"]
    finally:
        mock_jobs.close("crash")


def test_runtime_storage_and_heartbeat_limits(monkeypatch):
    r = new_recipe()
    r["tables"][0]["rows"] = 1_000_000
    monkeypatch.setattr(mock_jobs, "MAX_SECONDS", .01)
    job = mock_jobs.start("timeout", 1, r)
    try:
        assert "Five-minute" in wait_job(job)["error"]
    finally:
        mock_jobs.close("timeout")
    monkeypatch.setattr(mock_jobs, "MAX_SECONDS", 300)
    monkeypatch.setattr(mock_jobs, "MAX_STORAGE", 1)
    job = mock_jobs.start("storage", 1, r)
    try:
        assert "storage" in wait_job(job)["error"]
    finally:
        mock_jobs.close("storage")
    monkeypatch.setattr(mock_jobs, "MAX_STORAGE", 512 * 1024**2)
    monkeypatch.setattr(mock_jobs, "HEARTBEAT_SECONDS", .01)
    job = mock_jobs.start("expired", 1, r)
    time.sleep(.7)
    assert job.closed and not job.directory.exists()
    mock_jobs.close("expired")


def test_close_retries_only_transient_owned_file_locks(tmp_path, monkeypatch):
    import os
    import threading
    from types import SimpleNamespace
    private = tmp_path / "practice-mock-owned"
    private.mkdir()
    (private / "owner").write_text("owner")
    (private / "worker.log").write_text("finished")
    neighbor = tmp_path / "unrelated.txt"
    neighbor.write_text("keep")
    job = mock_jobs.Job.__new__(mock_jobs.Job)
    job.directory, job.id = private, "owner"
    job.lock, job.closed = threading.RLock(), False
    job.process = SimpleNamespace(poll=lambda: 0)
    monkeypatch.setattr(mock_jobs.tempfile, "gettempdir", lambda: str(tmp_path))
    unlink = os.unlink
    attempts, delays = [], []
    def locked(filename, *args, **kwargs):
        if str(filename).endswith("worker.log"):
            attempts.append(filename)
            if len(attempts) <= 2:
                error = PermissionError("worker handle still closing")
                error.winerror = 32
                raise error
        return unlink(filename, *args, **kwargs)
    monkeypatch.setattr(os, "unlink", locked)
    monkeypatch.setattr(mock_jobs.time, "sleep", delays.append)
    job.close()
    job.close()
    assert job.closed and not private.exists()
    assert len(attempts) == 3 and len(delays) == 2
    assert neighbor.read_text() == "keep"


def test_remove_does_not_hide_permanent_permissions_or_delete_foreign_owners(tmp_path, monkeypatch):
    private = tmp_path / "practice-mock-owned"
    private.mkdir()
    (private / "owner").write_text("someone-else")
    job = mock_jobs.Job.__new__(mock_jobs.Job)
    job.directory, job.id = private, "owner"
    monkeypatch.setattr(mock_jobs.tempfile, "gettempdir", lambda: str(tmp_path))
    calls = []
    def denied(directory, *, onerror):
        calls.append(directory)
        error = PermissionError("permission denied")
        error.winerror = 5
        onerror(None, str(directory / "owner"), (PermissionError, error, None))
    monkeypatch.setattr(mock_jobs.shutil, "rmtree", denied)
    job._remove()
    assert not calls and private.exists()
    (private / "owner").write_text(job.id)
    with pytest.raises(PermissionError, match="permission denied"):
        job._remove()
    assert calls == [private] and private.exists()
