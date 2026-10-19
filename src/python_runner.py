"""Small HTTP client; the Streamlit process never runs submitted Python."""
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def request(method, path, payload=None):
    token_path = Path(os.environ.get("PYTHON_RUNNER_TOKEN_FILE", Path(__file__).resolve().parents[1] / ".python-runner" / "token"))
    try:
        token = os.environ.get("PYTHON_RUNNER_TOKEN") or token_path.read_text().strip()
        url = os.environ.get("PYTHON_RUNNER_URL", "http://127.0.0.1:8766").rstrip("/") + path
        req = Request(url, data=json.dumps(payload).encode() if payload is not None else None,
                      headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"}, method=method)
        with urlopen(req, timeout=8) as response:
            return json.loads(response.read(1024 * 1024))
    except HTTPError as exc:
        message = f"Runner request failed (HTTP {exc.code})."
        try:
            detail = json.loads(exc.read(64 * 1024))
            if isinstance(detail, dict) and isinstance(detail.get("error"), str):
                message = detail["error"]
        except (OSError, ValueError):
            pass  # A proxy or unavailable server may return HTML instead of JSON.
        finally:
            exc.close()
        raise RuntimeError(message) from exc
    except (OSError, URLError, ValueError) as exc:
        raise RuntimeError("Python runner unavailable. Start Docker, run scripts/setup_python_runner.py, then start python -m runner.controller.") from exc


def health():
    try:
        return request("GET", "/health")
    except RuntimeError as exc:
        return {"ready": False, "error": str(exc)}


def submit(attempt_id, source, exercise, operation):
    return request("POST", "/jobs", {"attempt_id": attempt_id, "source": source, "exercise": exercise, "operation": operation})


def poll(job_id):
    return request("GET", "/jobs/" + job_id)


def cancel(job_id):
    return request("DELETE", "/jobs/" + job_id)


def validate(exercise):
    return request("POST", "/jobs", {"operation": "validate_exercise", "exercise": exercise})
