import copy
import json
import os
from pathlib import Path
import threading
import time
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest

from scripts.build_python_pilot import pilot
from src.python_models import (fingerprint, grade_metrics, is_current, new_workspace,
                               public_exercise, validate_exercise, validate_workspace)
from src.database import (init_db, save_attempt, save_attempt_details, save_python_workspace,
                          get_attempt, export_progress, merge_progress, list_attempts)

EXERCISE = pilot()["python_playground"]
GENERATOR = "def sum_nonnegative(values):\n    return sum(x for x in values if x >= 0)\n"


def test_pilot_contract_and_privacy():
    validate_exercise(EXERCISE)
    assert "cases" not in public_exercise(EXERCISE)
    assert "explanation" not in public_exercise(EXERCISE)
    from src.prompt_builder import student_prompt, evaluation_prompt
    prompt = student_prompt(pilot(), "")
    assert "SUBMITTED" not in prompt
    assert EXERCISE["explanation"] not in prompt
    assert '"cases"' not in prompt
    workspace = {**new_workspace(EXERCISE), "source": GENERATOR}
    assert GENERATOR in evaluation_prompt(pilot(), "", {}, "", python_workspace=workspace)


@pytest.mark.parametrize("field,value", [("starter_code", "x" * 102401), ("targets", {"time_ms": float("nan"), "memory_bytes": 1}), ("benchmark", {}), ("cases", []), ("function", "x.y")], ids=["oversized-source", "invalid-targets", "invalid-fixture", "empty-cases", "invalid-function"])
def test_invalid_exercise(field, value):
    with pytest.raises(ValueError):
        validate_exercise({**EXERCISE, field: value})


def test_exact_target_boundaries():
    targets = {"time_ms": 250, "memory_bytes": 1048576}
    assert grade_metrics([249, 250], 1048576, targets) == {"time_passed": True, "memory_passed": True}
    assert grade_metrics([250.00001], 1048577, targets) == {"time_passed": False, "memory_passed": False}


def assessment(source=GENERATOR):
    return {"source_hash": fingerprint(source), "exercise_hash": fingerprint(EXERCISE),
            "runner_hash": "a" * 64, "result": {"ok": True, "passed": True}}


def test_revisions_include_source_exercise_and_runner():
    result = assessment()
    assert is_current(result, GENERATOR, EXERCISE, "a" * 64)
    assert not is_current(result, GENERATOR + "\n", EXERCISE, "a" * 64)
    assert not is_current(result, GENERATOR, {**EXERCISE, "version": 2}, "a" * 64)
    assert not is_current(result, GENERATOR, EXERCISE, "b" * 64)


def test_workspace_roundtrip_and_independent_saves(tmp_path):
    db = tmp_path / "progress.db"
    init_db(db)
    aid = save_attempt(db, {"challenge_id": "PY-001", "status": "In progress", "started_at": "2026-10-01T00:00:00+00:00"})
    old = get_attempt(db, aid)
    workspace = {"version": 1, "source": GENERATOR, "assessment": assessment()}
    save_python_workspace(db, aid, workspace)
    save_attempt_details(db, {**old, "answer": "My explanation"})
    assert get_attempt(db, aid)["python_workspace"] == workspace
    assert list_attempts(db, include_diagrams=False)[0]["python_workspace"] is None
    backup = export_progress(db)
    other = tmp_path / "restored.db"
    init_db(other)
    merge_progress(other, backup)
    assert list_attempts(other)[0]["python_workspace"] == workspace
    # A newer legacy backup does not erase an existing independently saved draft.
    legacy = copy.deepcopy(backup)
    del legacy["attempts"][0]["python_workspace"]
    legacy["attempts"][0]["updated_at"] = "2030-01-01T00:00:00+00:00"
    merge_progress(other, legacy)
    assert list_attempts(other)[0]["python_workspace"] == workspace
    invalid = copy.deepcopy(backup)
    invalid["attempts"][0]["python_workspace"]["source"] = 12
    with pytest.raises(ValueError):
        merge_progress(other, invalid)


def test_workspace_rejects_console_persistence():
    result = assessment()
    result["result"]["stdout"] = "should remain session-only"
    with pytest.raises(ValueError):
        validate_workspace({"version": 1, "source": GENERATOR, "assessment": result})


def test_pilot_sync_preserves_existing_work():
    from src.bank_manager import sync_bundled_python
    bank = json.loads((Path(__file__).resolve().parents[1] / "data/challenges.json").read_text(encoding="utf-8"))
    previous = copy.deepcopy(bank)
    previous["challenges"] = [c for c in previous["challenges"] if c["id"] != "PY-001"]
    previous["prompt_templates"]["student"] = "My custom prompt"
    upgraded = sync_bundled_python(previous, bank)
    assert upgraded["prompt_templates"]["student"] == "My custom prompt"
    assert sum(c["id"] == "PY-001" for c in upgraded["challenges"]) == 1
    next(c for c in upgraded["challenges"] if c["id"] == "PY-001")["title"] = "Custom title"
    assert sync_bundled_python(upgraded, bank) == upgraded
    assert previous["challenges"] == [c for c in bank["challenges"] if c["id"] != "PY-001"]


def test_http_auth_and_bounded_requests():
    from runner.controller import make_handler
    class FakeController:
        def health(self):
            return {"ready": True}
    server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(FakeController(), "t" * 48))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{server.server_port}"
    try:
        with pytest.raises(HTTPError) as error:
            urlopen(url + "/health")
        assert error.value.code == 401
        headers = {"Authorization": "Bearer " + "t" * 48}
        assert json.load(urlopen(Request(url + "/health", headers=headers))) == {"ready": True}
        with pytest.raises(HTTPError) as error:
            urlopen(Request(url + "/jobs", data=b"x", headers={**headers, "Content-Length": "600000"}))
        assert error.value.code == 400
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


@pytest.fixture(scope="module")
def controller():
    if os.environ.get("PYTHON_RUNNER_INTEGRATION") != "1":
        pytest.skip("Set PYTHON_RUNNER_INTEGRATION=1 to test the prebuilt Docker image.")
    from runner.controller import Controller
    controller = Controller()
    assert controller.health()["ready"]
    yield controller
    controller.close()


def run(controller, source, operation="check"):
    job = controller.submit({"attempt_id": 1, "operation": operation, "source": source, "exercise": EXERCISE})
    deadline = time.monotonic() + 40
    while time.monotonic() < deadline:
        result = controller.snapshot(job["id"])
        if result["state"] == "finished":
            return result["result"]
        time.sleep(.05)
    pytest.fail("Controller job did not finish")


def test_container_generator_and_list_measurements(controller):
    generator = run(controller, GENERATOR)
    assert generator.get("passed"), generator
    assert generator["python_version"] == "3.14.2"
    assert len(generator["samples_ms"]) == 5
    listed = run(controller, "def sum_nonnegative(values):\n    return sum([x for x in values if x >= 0])")
    assert listed["correctness"] and not listed["memory_passed"], listed
    assert listed["peak_bytes"] > 1048576
    print("\nCONTAINER BENCHMARK", json.dumps({"generator": generator, "list": listed}))


@pytest.mark.parametrize("source,message", [
    ("def sum_nonnegative(values): return 0", "Incorrect"),
    ("def sum_nonnegative(values): return True", "Incorrect"),
    ("def sum_nonnegative(values):\n    result = sum(x for x in values if x >= 0)\n    values.clear()\n    return result", "modified"),
    ("def broken(:", "SyntaxError"),
    ("raise RuntimeError('oops')", "RuntimeError"),
])
def test_container_correctness_failures(controller, source, message):
    result = run(controller, source)
    assert not result["ok"] and message in result["error"], result


def test_container_time_target(controller):
    result = run(controller, "import time\ndef sum_nonnegative(values):\n    time.sleep(.3)\n    return sum(x for x in values if x >= 0)")
    assert result["correctness"] and not result["time_passed"] and result["memory_passed"], result


def test_container_containment_and_fresh_run(controller):
    source = """import os, socket
assert os.getuid() != 0
assert not os.path.exists('/app/database')
assert not os.path.exists('/var/run/docker.sock')
try:
    open('/forbidden', 'w')
except OSError:
    print('read-only')
else:
    raise AssertionError('writable root')
try:
    socket.create_connection(('1.1.1.1', 80), timeout=.2)
except OSError:
    print('offline')
else:
    raise AssertionError('network available')
open('/tmp/previous-run', 'w').write('test')
"""
    result = run(controller, source, "run")
    assert result["ok"] and "offline" in result["stdout"], result
    assert run(controller, "import os; assert not os.path.exists('/tmp/previous-run')", "run")["ok"]


@pytest.mark.parametrize("source", ["while True: print('x' * 10000)", "import os\nwhile True: os.write(1, b'x' * 10000)"])
def test_container_output_limit(controller, source):
    result = run(controller, source, "run")
    assert result.get("category") == "output_limit", result
    assert len(result["stdout"].encode()) <= 65536


def test_container_oom_and_recovery(controller):
    result = run(controller, "x = bytearray(512 * 1024 * 1024)", "run")
    assert not result["ok"] and result.get("category") == "memory_limit", result
    assert run(controller, "print(42)", "run")["stdout"].strip() == "42"


def test_container_timeout_and_cancel(controller):
    assert run(controller, "while True: pass", "run").get("category") == "timeout"
    job = controller.submit({"attempt_id": 1, "operation": "run", "source": "while True: pass", "exercise": EXERCISE})
    time.sleep(.3)
    controller.cancel(job["id"])
    deadline = time.monotonic() + 8
    while controller.snapshot(job["id"])["state"] != "finished" and time.monotonic() < deadline:
        time.sleep(.05)
    assert controller.snapshot(job["id"])["result"]["category"] == "cancelled"
    from runner.controller import docker, LABEL
    assert not docker(["ps", "-aq", "--filter", f"label={LABEL}"])


def test_native_http_client_and_orphan_recovery(controller, tmp_path, monkeypatch):
    from runner.controller import make_handler, docker, LABEL, IMAGE
    from src import python_runner
    token = tmp_path / "token"
    token.write_text("t" * 48)
    server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(controller, token.read_text()))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    monkeypatch.setenv("PYTHON_RUNNER_TOKEN_FILE", str(token))
    monkeypatch.setenv("PYTHON_RUNNER_URL", f"http://127.0.0.1:{server.server_port}")
    try:
        assert python_runner.health()["ready"]
        job = python_runner.submit(1, "print('HTTP works')", EXERCISE, "run")
        deadline = time.monotonic() + 20
        while time.monotonic() < deadline:
            snapshot = python_runner.poll(job["id"])
            if snapshot["state"] == "finished":
                break
            time.sleep(.1)
        assert snapshot["result"]["stdout"].strip() == "HTTP works"
        orphan = docker(["create", "--label", LABEL, IMAGE])
        controller.recover()
        assert orphan not in docker(["ps", "-aq"])
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
