"""Token-authenticated local controller. Only this service accesses Docker."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
import hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import threading
import time
import uuid

from src.python_models import PROTOCOL, fingerprint, grade_metrics, validate_exercise, validate_source, validate_workspace, normalized_exercise

LABEL = "io.study-helper.python-runner=pilot-v1"
IMAGE = "study-helper-python:3.14.2-v2"
ROOT = Path(__file__).resolve().parents[1]


def docker(args, timeout=10):
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
    result = subprocess.run(["docker", *args], capture_output=True, timeout=max(.1, timeout), creationflags=flags)
    if result.returncode:
        raise RuntimeError("Docker operation failed. Check the engine and prebuilt Python image.")
    return result.stdout.decode("utf-8").strip()


class Controller:
    def __init__(self):
        self.jobs = {}
        self.lock = threading.RLock()
        self.executor = ThreadPoolExecutor(max_workers=1)
        self.image_id = None

    def health(self):
        try:
            self.image_id = docker(["image", "inspect", IMAGE, "--format", "{{.Id}}"], timeout=5)
            return {"ready": True, "runner_hash": fingerprint({"image": self.image_id, "protocol": PROTOCOL}),
                    "image_id": self.image_id, "protocol": PROTOCOL, "python_version": "3.14.2"}
        except (OSError, RuntimeError, subprocess.TimeoutExpired):
            return {"ready": False, "error": "Python runner unavailable. Start Docker and run scripts/setup_python_runner.py."}

    def recover(self):
        ids = docker(["ps", "-aq", "--filter", f"label={LABEL}"]).split()
        if ids:
            docker(["rm", "-f", *ids])

    def submit(self, request):
        if not isinstance(request, dict) or request.get("operation") not in ("run", "check", "validate_exercise"):
            raise ValueError("Unknown Python operation.")
        validate_exercise(request.get("exercise"))
        if request["operation"] == "validate_exercise":
            request = {**request, "source": normalized_exercise(request["exercise"])["reference_solution"], "attempt_id": None}
        validate_source(request.get("source"))
        if request["operation"] != "validate_exercise" and (type(request.get("attempt_id")) is not int or request["attempt_id"] < 1):
            raise ValueError("An attempt is required.")
        health = self.health()
        if not health["ready"]:
            raise RuntimeError(health["error"])
        with self.lock:
            now = time.monotonic()
            for key, value in list(self.jobs.items()):
                if value["state"] == "finished" and now - value["updated"] > 600:
                    del self.jobs[key]
            if sum(j["state"] != "finished" for j in self.jobs.values()) >= 8:
                raise ValueError("Runner queue is full. Try again shortly.")
            while len(self.jobs) >= 32:
                finished = next((key for key, j in self.jobs.items() if j["state"] == "finished"), None)
                if finished is None:
                    break
                del self.jobs[finished]
            job_id = uuid.uuid4().hex
            job = {"id": job_id, "state": "queued", "cancel": threading.Event(), "updated": now,
                   "attempt_id": request["attempt_id"], "source_hash": fingerprint(request["source"]),
                   "exercise_hash": fingerprint(request["exercise"]), "runner_hash": health["runner_hash"],
                   "operation": request["operation"],
                   "result": None}
            self.jobs[job_id] = job
            self.executor.submit(self.work, job, request, health["image_id"])
            return self.snapshot(job_id)

    def snapshot(self, job_id):
        with self.lock:
            job = self.jobs[job_id]
            return {k: v for k, v in job.items() if k not in ("cancel", "updated")}

    def cancel(self, job_id):
        with self.lock:
            self.jobs[job_id]["cancel"].set()
        return self.snapshot(job_id)

    def phase(self, job, request, phase, image_id, deadline):
        name = "study-python-" + job["id"] + "-" + phase
        process = None
        try:
            if job["cancel"].is_set():
                return {"ok": False, "category": "cancelled", "error": "Cancelled."}
            docker(["create", "--name", name, "--label", LABEL, "--interactive", "--network", "none",
                    "--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m,mode=1777",
                    "--user", "65534:65534", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
                    "--memory", "256m", "--memory-swap", "256m", "--cpus", "1", "--pids-limit", "32",
                    "--ulimit", "nofile=64:64", "--log-driver", "none", image_id], timeout=deadline-time.monotonic())
            flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
            process = subprocess.Popen(["docker", "start", "-ai", name], stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, creationflags=flags)
            data = json.dumps({"source": request["source"], "exercise": request["exercise"], "phase": phase}).encode()
            buffers = [bytearray(), bytearray()]
            overflow = threading.Event()

            def read(pipe, buffer):
                while chunk := pipe.read1(4096):
                    remaining = 512 * 1024 - len(buffer)
                    buffer.extend(chunk[:remaining])
                    if len(chunk) > remaining:
                        overflow.set()

            def write():
                try:
                    process.stdin.write(data)
                    process.stdin.close()
                except (OSError, ValueError):
                    pass

            readers = [threading.Thread(target=read, args=(pipe, buf), daemon=True)
                       for pipe, buf in zip((process.stdout, process.stderr), buffers)]
            for reader in readers:
                reader.start()
            threading.Thread(target=write, daemon=True).start()
            while process.poll() is None:
                if job["cancel"].wait(.05):
                    return {"ok": False, "error": "Cancelled.", "category": "cancelled"}
                if time.monotonic() >= deadline:
                    return {"ok": False, "error": "Execution exceeded its time limit.", "category": "timeout"}
                if overflow.is_set():
                    return {"ok": False, "error": "Worker output limit exceeded.", "category": "output_limit"}
            for reader in readers:
                reader.join(1)
            state = json.loads(docker(["inspect", name, "--format", "{{json .State}}"], timeout=3))
            if state.get("OOMKilled"):
                return {"ok": False, "error": "Container exceeded 256 MiB of memory.", "category": "memory_limit"}
            if overflow.is_set() or process.returncode or state.get("ExitCode"):
                return {"ok": False, "error": "Python worker stopped unexpectedly.", "category": "process_error"}
            result = json.loads(buffers[0])
            if not isinstance(result, dict) or type(result.get("ok")) is not bool:
                raise ValueError("Invalid result")
            if any(not isinstance(result.get(key, ""), str) for key in ("stdout", "stderr")):
                raise ValueError("Invalid output streams")
            summary = {k: v for k, v in result.items() if k not in ("stdout", "stderr")}
            validate_workspace({"version": 1, "source": "", "assessment": {
                "source_hash": "0" * 64, "exercise_hash": "0" * 64, "runner_hash": "0" * 64, "result": summary}})
            return result
        finally:
            # Removing the container kills the whole process tree, not just the CLI.
            try:
                docker(["rm", "-f", name], timeout=5)
            except (OSError, RuntimeError, subprocess.TimeoutExpired):
                pass  # startup recovery also removes containers carrying our ownership label
            if process is not None:
                if process.poll() is None:
                    process.kill()
                process.wait(timeout=3)

    def work(self, job, request, image_id):
        with self.lock:
            job["state"] = "running"
        started = time.monotonic()
        deadline = started + {"run": 10, "check": 30, "validate_exercise": 60}[request["operation"]]
        try:
            result = self.phase(job, request, "run" if request["operation"] == "run" else "timing", image_id, deadline)
            targets = request["exercise"].get("targets", {})
            if request["operation"] != "run" and result.get("ok") and targets:
                memory = self.phase(job, request, "memory", image_id, deadline)
                if memory.get("ok"):
                    result["peak_bytes"] = memory["peak_bytes"]
                    result.update(grade_metrics(result["samples_ms"], result["peak_bytes"], targets))
                else:
                    result = {**memory, "samples_ms": result["samples_ms"], "max_ms": result["max_ms"], "median_ms": result["median_ms"]}
            if request["operation"] != "run":
                for kind, key in (("time", "time_ms"), ("memory", "memory_bytes")):
                    passed = result.get(kind + "_passed")
                    result[kind + "_status"] = "not_requested" if key not in targets else "passed" if passed is True else "failed" if passed is False else "unavailable"
                result["passed"] = bool(result.get("ok") and result.get("correctness") and all(result[k + "_status"] in ("passed", "not_requested") for k in ("time", "memory")))
            if job["cancel"].is_set():
                result = {"ok": False, "category": "cancelled", "error": "Cancelled."}
        except subprocess.TimeoutExpired:
            result = {"ok": False, "category": "timeout", "error": "Execution exceeded its time limit."}
        except (OSError, RuntimeError, ValueError, KeyError, TypeError):
            result = {"ok": False, "category": "runner_error", "error": "Python runner failed. Check Docker and try again."}
        result.update(protocol=PROTOCOL, image_id=image_id, total_ms=(time.monotonic()-started)*1000)
        with self.lock:
            job.update(state="finished", result=result, updated=time.monotonic())

    def close(self):
        with self.lock:
            for job in self.jobs.values():
                job["cancel"].set()
        self.executor.shutdown(wait=True)


def make_handler(controller, token):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def handle_request(self):
            if not hmac.compare_digest(self.headers.get("Authorization", ""), "Bearer " + token):
                return self.respond(401, {"error": "Unauthorized"})
            try:
                path = self.path.strip("/")
                if self.command == "GET" and path == "health":
                    return self.respond(200, controller.health())
                if self.command == "POST" and path == "jobs":
                    size = int(self.headers.get("Content-Length", "0"))
                    if not 0 < size <= 512 * 1024:
                        raise ValueError("Invalid request size.")
                    self.connection.settimeout(5)
                    return self.respond(202, controller.submit(json.loads(self.rfile.read(size))))
                if re.fullmatch(r"jobs/[a-f0-9]{32}", path):
                    job_id = path.split("/")[1]
                    if self.command == "GET":
                        return self.respond(200, controller.snapshot(job_id))
                    if self.command == "DELETE":
                        return self.respond(200, controller.cancel(job_id))
                self.respond(404, {"error": "Not found"})
            except KeyError:
                self.respond(404, {"error": "Job expired or controller restarted. Run again."})
            except (ValueError, TypeError):
                self.respond(400, {"error": "Invalid Python request."})
            except RuntimeError as exc:
                self.respond(503, {"error": str(exc)})

        def respond(self, status, value):
            data = json.dumps(value, allow_nan=False).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        do_GET = do_POST = do_DELETE = handle_request
    return Handler


def main():
    token_path = Path(os.environ.get("PYTHON_RUNNER_TOKEN_FILE", ROOT / ".python-runner" / "token"))
    token = os.environ.get("PYTHON_RUNNER_TOKEN") or token_path.read_text().strip()
    if len(token) < 32:
        raise ValueError("Runner token must contain at least 32 characters.")
    controller = Controller()
    # Bind before recovery so a second controller cannot clean up a live one's jobs.
    server = ThreadingHTTPServer((os.environ.get("PYTHON_RUNNER_HOST", "127.0.0.1"), 8766), make_handler(controller, token))
    def terminate(signum, frame):
        raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, terminate)
    try:
        controller.recover()
        print("Python runner listening on port 8766", flush=True)
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        controller.close()


if __name__ == "__main__":
    main()
