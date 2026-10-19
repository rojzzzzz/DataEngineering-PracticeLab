"""Asynchronous, disposable workers with deadlines and explicit cancellation."""
from __future__ import annotations

import atexit
from functools import lru_cache
import json
import subprocess
import threading
import time

from src.sql_models import check_exercise
from src.disposable_workers import DisposableWorkers


_workers = DisposableWorkers("src.sql_worker")
atexit.register(_workers.close)


class SQLJob:
    def __init__(self, exercise: dict | None, operation: str, *, sql="", drafts=None, table=None, timeout=None, dataset=None):
        if dataset is not None:
            from src.capstone_datasets import validate_dataset
            dataset = validate_dataset(dataset)
            if exercise is not None or operation != "run":
                raise ValueError("Dataset SQL accepts Run only, without graded exercise metadata")
        else:
            check_exercise(exercise)
        self.operation = operation
        self.result = None
        self.cancelled = False
        self.started = time.monotonic()
        self._lock = threading.Lock()
        self._process = None
        self._timeout = timeout if timeout is not None else (30 if operation in ("check", "validate") else 12)
        request = ({"dataset": dataset, "operation": "dataset_run", "sql": sql} if dataset is not None else
                   {"exercise": exercise, "operation": operation, "sql": sql, "drafts": drafts or {}, "table": table})
        payload = json.dumps(request, ensure_ascii=False, allow_nan=False).encode()
        if len(payload) > 5_000_000:
            raise ValueError("SQL request exceeds 5 MB")
        self._thread = threading.Thread(target=self._work, args=(payload,), daemon=True)
        self._thread.start()

    def _work(self, payload):
        try:
            with _workers.worker() as process:
                with self._lock:
                    self._process = process
                    if self.cancelled:
                        process.kill()
                try:
                    output, _ = process.communicate(payload, timeout=self._timeout)
                    if process.returncode == 124:
                        result = {"ok": False, "error": "Query exceeded the ten-second limit.", "category": "resource limit"}
                    elif process.returncode != 0:
                        result = {"ok": False, "error": "SQL worker stopped unexpectedly. You can run another query."}
                    elif len(output) > 3_000_000:
                        result = {"ok": False, "error": "Result exceeded the output limit.", "category": "resource limit"}
                    else:
                        result = json.loads(output)
                except subprocess.TimeoutExpired:
                    result = {"ok": False, "error": "Operation exceeded its time limit.", "category": "resource limit"}
                if self.cancelled:
                    result = {"ok": False, "error": "Cancelled."}
        except Exception:
            result = {"ok": False, "error": "Could not start SQL worker. Check that DuckDB is installed."}
        self.result = result

    def cancel(self):
        with self._lock:
            self.cancelled = True
            if self._process is not None and self._process.poll() is None:
                self._process.kill()
        self._thread.join(timeout=2)

    def wait(self):
        self._thread.join(self._timeout + 3)
        if self.result is None:
            self.cancel()
            return {"ok": False, "error": "Worker did not finish.", "category": "resource limit"}
        return self.result


@lru_cache(maxsize=64)
def validate_reference_queries(serialized: str) -> None:
    result = SQLJob(json.loads(serialized), "validate").wait()
    if not result.get("ok"):
        raise ValueError("SQL playground reference validation failed: " + result["error"])
