"""One disposable process per generation/preview; owns its private DuckDB files."""
import csv
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import shutil
import sys
import time

from src.mock_models import (ENGINE_VERSION, FAKER_VERSION, MAX_ARTIFACT, MAX_SECONDS, MAX_STORAGE,
                             directory_bytes, ordered_tables, validate_recipe)
from src.mock_engine import iter_rows
from src.mock_exports import (RowWriter, bundle, filenames, json_value, parquet_export,
                              stage_table, text_value, validate_staged)


def atomic_json(path, value):
    temp = path.with_suffix(".writing")
    temp.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")
    # Windows can briefly refuse replacement while the UI/watchdog reads the
    # old status file. Retry sharing violations without publishing partial JSON.
    deadline = time.monotonic() + 2
    while True:
        try:
            os.replace(temp, path)
            return
        except PermissionError:
            if time.monotonic() >= deadline:
                raise
            time.sleep(.01)


def run_job(directory, request, batch_size=2000):
    started = time.monotonic()
    identity = {key: request[key] for key in ("workspace_id", "job_id", "revision")}
    rows_done, stage, table_name = 0, "Validating recipe", ""
    last_report = 0

    def report(status="running", **extra):
        atomic_json(directory / "status.json", {**identity, "status": status, "stage": stage, "table": table_name,
                    "completed_rows": rows_done, "elapsed_seconds": round(time.monotonic() - started, 2), **extra})

    def check():
        nonlocal last_report
        now = time.monotonic()
        if (directory / "cancel").exists():
            raise ValueError("Generation cancelled.")
        heartbeat = directory / "heartbeat"
        if now - started > MAX_SECONDS:
            raise ValueError("Five-minute limit reached. Reduce rows or expensive Faker fields.")
        if heartbeat.exists() and time.time() - heartbeat.stat().st_mtime > 90:
            raise ValueError("Session expired. Reopen the tool and generate again.")
        if directory_bytes(directory) > MAX_STORAGE:
            raise ValueError("512 MiB temporary-storage limit reached. Reduce rows or text length.")
        if now - last_report > .25:
            report()
            last_report = now

    connection = None
    try:
        recipe = validate_recipe(request["recipe"])
        if importlib.metadata.version("Faker") != FAKER_VERSION:
            raise ValueError(f"Install Faker=={FAKER_VERSION} from requirements.txt before generating.")
        report()
        if request.get("mode") == "preview":
            table = next(t for t in recipe["tables"] if t["id"] == request["table_id"])
            stage, table_name = "Previewing first 50 rows", table["name"]
            rows = []
            for row in iter_rows(recipe, table, 50):
                check()
                rows.append(dict(zip([f["name"] for f in table["fields"]], map(json_value, row))))
                rows_done += 1
            atomic_json(directory / "preview.json", {"rows": rows, "table_id": table["id"], "null_counts": {f["name"]: sum(r[f["name"]] is None for r in rows) for f in table["fields"]}})
            report("complete", preview="preview.json")
            return
        import duckdb
        connection = duckdb.connect(str(directory / "stage.duckdb"), config={"memory_limit": "128MB", "threads": "2", "enable_external_access": True})
        connection.execute("SET temp_directory = ?", [str(directory / "spill")])
        connection.execute("SET TimeZone='UTC'")
        extensions = {"csv": "csv", "text": "txt", "json": "json", "jsonl": "jsonl", "parquet": "parquet"}
        names = filenames(recipe["tables"], extensions[recipe["output"]["format"]])
        staged, files, samples = {}, [], {}
        marker = "__mock_null_" + request["job_id"]
        for index, table in enumerate(ordered_tables(recipe)):
            samples[table["id"]] = []
            sample_bytes = 0
            stage, table_name = "Generating rows", table["name"]
            stage_path, path = directory / f"stage_{index}.csv", directory / names[table["id"]]
            writer = None if recipe["output"]["format"] == "parquet" else RowWriter(path, table, recipe["output"])
            try:
                with stage_path.open("w", encoding="utf-8", newline="") as handle:
                    stage_writer = csv.writer(handle, lineterminator="\n")
                    for i, row in enumerate(iter_rows(recipe, table)):
                        if i < 10:
                            sample = dict(zip([f["name"] for f in table["fields"]], map(json_value, row)))
                            # Samples are evidence, not a second dataset. Bound long text and total bytes per table.
                            sample = {key: value[:80] + "…" if isinstance(value, str) and len(value) > 80 else value for key, value in sample.items()}
                            size = len(json.dumps(sample, ensure_ascii=False).encode())
                            if not samples[table["id"]] or sample_bytes + size <= 24_000:
                                samples[table["id"]].append(sample)
                                sample_bytes += size
                        values = [text_value(v) for v in row]
                        if marker in values:
                            raise ValueError("Value collides with internal staging marker. Change the constant value.")
                        stage_writer.writerow([marker if v is None else v for v in values])
                        if writer:
                            writer.row(row)
                        rows_done += 1
                        if (i + 1) % batch_size == 0:
                            handle.flush()
                            if writer:
                                writer.file.flush()
                            check()
                            if writer and path.stat().st_size > MAX_ARTIFACT:
                                raise ValueError("100 MiB download limit reached. Reduce rows, columns, or text length.")
            finally:
                if writer:
                    writer.close()
            stage = "Staging typed table"
            check()
            staged[table["id"]] = f"t{index}"
            stage_table(connection, table, stage_path, marker, f"t{index}")
            stage_path.unlink()
            if not writer:
                stage = "Writing Snappy Parquet"
                parquet_export(connection, table, f"t{index}", path)
            files.append(path)
            if sum(p.stat().st_size for p in files) > MAX_ARTIFACT:
                raise ValueError("100 MiB dataset limit reached. Reduce row counts or field lengths.")
            check()
        stage, table_name = "Validating counts, nulls and relationships", ""
        report()
        check()
        counts = validate_staged(connection, recipe, staged)
        stage = "Preparing download bundle"
        report()
        manifest = {"format": "constructor-mock-manifest", "version": 1, "engine_version": ENGINE_VERSION,
                    "faker_version": FAKER_VERSION, "duckdb_version": duckdb.__version__, "python_version": platform.python_version(),
                    "seed": recipe["seed"], "locale": recipe["locale"], "output": recipe["output"],
                    "decimal_json_encoding": "string", "temporal_encoding": "ISO dates / UTC timestamps",
                    "null_percentages": "probabilities; actual counts reported per field", "preview": "first 50 rows; foreign keys use full parent key domains",
                    "evidence_samples": "up to 10 first rows/table and 24 KB/table; text over 80 characters truncated with ellipsis",
                    "tables": [{"id": t["id"], "name": t["name"], "file": names[t["id"]], "fields": t["fields"], **counts[t["id"]]} for t in recipe["tables"]]}
        transfer = {}
        try:
            from src.capstone_datasets import from_staging
            dataset = from_staging(connection, recipe, staged, manifest)
            atomic_json(directory / "capstone-dataset.json", dataset)
            transfer["dataset"] = "capstone-dataset.json"
        except ValueError as exc:
            # Ordinary Mock generation remains available above capstone limits.
            transfer["capstone_transfer_error"] = str(exc)
        connection.close()
        connection = None
        (directory / "stage.duckdb").unlink()
        atomic_json(directory / "manifest.json", manifest)
        atomic_json(directory / "samples.json", samples)
        archive = directory / "dataset.zip"
        bundle(archive, files, recipe, manifest, check)
        if archive.stat().st_size > MAX_ARTIFACT:
            raise ValueError("100 MiB bundle limit reached. Reduce row counts or text length.")
        check()
        report("complete", artifact="dataset.zip", files=[p.name for p in files], manifest="manifest.json", samples="samples.json", **transfer)
    except Exception as exc:
        if connection:
            connection.close()
            connection = None
        for child in directory.iterdir():
            if child.name not in ("owner", "heartbeat", "request.json", "worker.log", "cancel", "status.json"):
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink(missing_ok=True)
        report("cancelled" if (directory / "cancel").exists() else "failed", error=str(exc))
    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    directory = Path(sys.argv[1]).resolve()
    run_job(directory, json.loads((directory / "request.json").read_text(encoding="utf-8")))
