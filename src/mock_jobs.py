"""Session-isolated disposable workers, heartbeat expiry, and bounded artifacts."""
import atexit
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import weakref
from uuid import uuid4

from src.mock_models import MAX_ARTIFACT, MAX_SECONDS, MAX_STORAGE, directory_bytes, validate_recipe

ROOT = Path(__file__).resolve().parents[1]
HEARTBEAT_SECONDS = 90


class Job:
    def __init__(self, workspace_id, revision, recipe, mode="generate", table_id=None):
        recipe = validate_recipe(recipe)
        self.workspace_id, self.revision, self.id = workspace_id, revision, str(uuid4())
        self.directory = Path(tempfile.mkdtemp(prefix="practice-mock-")).resolve()
        self.started, self.heartbeat_at = time.monotonic(), time.monotonic()
        self.closed, self.terminal = False, None
        self.lock = threading.RLock()
        self.identity = {"workspace_id": workspace_id, "job_id": self.id, "revision": revision}
        self.request = {**self.identity, "recipe": recipe, "mode": mode, "table_id": table_id}
        self.directory.chmod(0o700)
        (self.directory / "owner").write_text(self.id)
        (self.directory / "request.json").write_text(json.dumps(self.request), encoding="utf-8")
        (self.directory / "heartbeat").touch()
        try:
            with (self.directory / "worker.log").open("wb") as log:
                self.process = subprocess.Popen([sys.executable, "-m", "src.mock_worker", str(self.directory)], cwd=ROOT,
                    stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                    creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0)
        except Exception:
            self._remove()
            raise
        self.monitor = threading.Thread(target=self._watch, daemon=True)
        self.monitor.start()

    def heartbeat(self):
        with self.lock:
            if not self.closed:
                self.heartbeat_at = time.monotonic()
                (self.directory / "heartbeat").touch()

    def matches(self, workspace_id, revision):
        return not self.closed and self.workspace_id == workspace_id and self.revision == revision

    def _status(self):
        if self.terminal:
            return dict(self.terminal)
        try:
            result = json.loads((self.directory / "status.json").read_text(encoding="utf-8"))
            if any(result.get(k) != v for k, v in self.identity.items()):
                return {**self.identity, "status": "failed", "error": "Worker identity mismatch. Generate again."}
            return result
        except (OSError, ValueError):
            return {**self.identity, "status": "running", "stage": "Starting worker", "completed_rows": 0, "elapsed_seconds": round(time.monotonic() - self.started, 2)}

    def status(self):
        with self.lock:
            if self.closed:
                return {**self.identity, "status": "expired", "error": "Workspace closed or session expired. Generate again."}
            return self._status()

    def _stop(self):
        if self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=2)

    def _remove(self):
        # Only delete the exact private directory this Job created and owns.
        root = Path(tempfile.gettempdir()).resolve()
        if self.directory.parent == root and self.directory.name.startswith("practice-mock-") and (self.directory / "owner").read_text() == self.id:
            def release_locked_file(operation, filename, error_info):
                error = error_info[1]
                # Windows can briefly retain an exited worker's redirected log
                # handle. Retry that exact owned path, never permission errors
                # or an unbounded background cleanup loop.
                target = Path(filename).resolve()
                if not target.is_relative_to(self.directory) or operation not in (os.unlink, os.rmdir):
                    raise error
                for delay in (.01, .02, .04, .08, .16, .32, .32):
                    if not isinstance(error, PermissionError) or getattr(error, "winerror", None) not in (32, 33):
                        raise error
                    time.sleep(delay)
                    try:
                        operation(filename)
                        return
                    except FileNotFoundError:
                        return
                    except PermissionError as exc:
                        error = exc
                raise error
            shutil.rmtree(self.directory, onerror=release_locked_file)

    def _failure(self, status, message):
        self._stop()
        self.terminal = {**self.identity, "status": status, "error": message,
                         "completed_rows": self._status().get("completed_rows", 0), "elapsed_seconds": round(time.monotonic() - self.started, 2)}
        # Preserve only tiny diagnostic/control files until the session closes.
        for child in self.directory.iterdir():
            if child.name not in ("owner", "heartbeat", "worker.log"):
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink(missing_ok=True)

    def cancel(self):
        with self.lock:
            if not self.closed:
                (self.directory / "cancel").touch()
                self._failure("cancelled", "Generation cancelled. Partial files were removed.")

    def close(self):
        with self.lock:
            if not self.closed:
                self._stop()
                self._remove()
                self.closed = True

    def artifact(self, filename, workspace_id, revision):
        with self.lock:
            status = self._status()
            if not self.matches(workspace_id, revision) or status["status"] != "complete":
                raise ValueError("Results are outdated or incomplete. Generate the current recipe again.")
            allowed = [status.get("artifact"), status.get("manifest"), status.get("samples"), status.get("preview"), status.get("dataset"), *status.get("files", [])]
            if filename not in allowed or Path(filename).name != filename:
                raise ValueError("Download is not part of this job.")
            path = self.directory / filename
            if path.stat().st_size > MAX_ARTIFACT:
                raise ValueError("Download exceeds 100 MiB.")
            return path

    def _watch(self):
        while True:
            time.sleep(.25)
            with self.lock:
                if self.closed:
                    return
                try:
                    if time.monotonic() - self.heartbeat_at > HEARTBEAT_SECONDS:
                        self.close()
                        return
                    status = self._status()
                    if self.terminal:
                        continue
                    if status["status"] in ("failed", "cancelled"):
                        self._failure(status["status"], status.get("error", "Worker failed. Generate again."))
                    elif status["status"] != "complete":
                        if time.monotonic() - self.started > MAX_SECONDS:
                            self._failure("failed", "Five-minute limit reached. Reduce rows or expensive Faker fields.")
                        elif directory_bytes(self.directory) > MAX_STORAGE:
                            self._failure("failed", "512 MiB temporary-storage limit reached. Reduce rows or text length.")
                        elif self.process.poll() is not None:
                            # The worker may have published completion after our
                            # initial status read but before poll() saw its exit.
                            final = self._status()
                            if final["status"] != "complete":
                                self._failure("failed", final.get("error", "Generation worker exited unexpectedly. Reduce the request and try again."))
                except OSError:
                    if not self.closed:
                        self._failure("failed", "Temporary storage became unavailable. Generate again.")


# The watchdog keeps each live job alive; expired session records then disappear.
_jobs = weakref.WeakValueDictionary()
_lock = threading.RLock()


def start(workspace_id, revision, recipe, mode="generate", table_id=None):
    with _lock:
        previous = _jobs.get(workspace_id)
        if previous and previous.status()["status"] == "running":
            raise ValueError("A job is already running. Cancel it before starting another.")
        if previous:
            previous.close()
        job = Job(workspace_id, revision, recipe, mode, table_id)
        _jobs[workspace_id] = job
        return job


def get(workspace_id):
    with _lock:
        return _jobs.get(workspace_id)


def close(workspace_id):
    with _lock:
        job = _jobs.pop(workspace_id, None)
        if job:
            job.close()


def _shutdown():
    for workspace_id in list(_jobs):
        close(workspace_id)


atexit.register(_shutdown)
