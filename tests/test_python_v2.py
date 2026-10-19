import copy
import json
import os
import time

import pytest

from scripts.build_python_demo import demonstration
from scripts.build_python_pilot import pilot
from src.python_models import validate_exercise, equal_values, normalized_exercise, fingerprint, grade_metrics
from src.python_validation import save_validation, validation_record
from src.database import init_db, export_progress, merge_progress


def general_exercise():
    exercise = copy.deepcopy(demonstration()["python_playground"])
    exercise.update(function="summarize", starter_code="def summarize(values, factor, *, prefix):\n    pass\n",
                    reference_solution="def summarize(values, factor, *, prefix):\n    return {'label': prefix.upper(), 'values': [x * factor for x in values]}\n",
                    examples=[{"args": [[2, 3], 2], "kwargs": {"prefix": "hi"}, "expected": {"label": "HI", "values": [4, 6]}}],
                    cases=[{"args": [[], 3], "kwargs": {"prefix": "x"}, "expected": {"label": "X", "values": []}}])
    exercise.pop("benchmark")
    exercise.pop("targets")
    return exercise


def test_contract_and_legacy_adapter():
    exercise = general_exercise()
    validate_exercise(exercise)
    adapted = normalized_exercise(pilot()["python_playground"])
    validate_exercise(adapted)
    assert adapted["cases"][0]["args"] == [[]]
    assert equal_values({"b": [1, True], "a": None}, {"a": None, "b": [1, True]})
    assert not equal_values(1, True)
    assert not equal_values([1, 2], [2, 1])
    assert equal_values(0.1 + 0.2, 0.3, {"abs_tol": 1e-10})
    assert not equal_values(1, 1.0, {"abs_tol": 1})
    assert grade_metrics([150], 100, {"time_ms": 150}) == {"time_passed": True}
    assert grade_metrics([150.001], 100, {"time_ms": 150}) == {"time_passed": False}


@pytest.mark.parametrize("change", [
    {"function": "return"}, {"targets": {"time_ms": 20}},
    {"comparison": {"abs_tol": float("nan")}},
    {"cases": [{"args": [], "kwargs": {}, "expected": (1, 2)}]},
])
def test_invalid_contract(change):
    with pytest.raises(ValueError):
        validate_exercise({**general_exercise(), **change})


def test_validation_records_are_local_and_revision_bound(tmp_path):
    db, restored = tmp_path / "progress.db", tmp_path / "restored.db"
    init_db(db)
    init_db(restored)
    exercise = general_exercise()
    snapshot = {"operation": "validate_exercise", "state": "finished", "exercise_hash": fingerprint(exercise),
                "runner_hash": "a" * 64, "result": {"ok": True, "passed": True}}
    save_validation(db, exercise, snapshot)
    assert validation_record(db, exercise, "a" * 64)
    assert not validation_record(db, exercise, "b" * 64)
    assert not validation_record(db, {**exercise, "explanation": "changed"}, "a" * 64)
    merge_progress(restored, export_progress(db))
    assert not validation_record(restored, exercise, "a" * 64)
    with pytest.raises(ValueError):
        save_validation(db, exercise, {**snapshot, "operation": "check"})


@pytest.fixture(scope="module")
def controller():
    if os.environ.get("PYTHON_RUNNER_INTEGRATION") != "1":
        pytest.skip("Set PYTHON_RUNNER_INTEGRATION=1 for container tests.")
    from runner.controller import Controller
    instance = Controller()
    assert instance.health()["ready"]
    yield instance
    instance.close()


def execute(controller, exercise, source=None, operation="validate_exercise"):
    job = controller.submit({"exercise": exercise, "operation": operation, "attempt_id": 1,
                             "source": source or exercise["reference_solution"]})
    deadline = time.monotonic() + 70
    while time.monotonic() < deadline:
        snapshot = controller.snapshot(job["id"])
        if snapshot["state"] == "finished":
            return snapshot
        time.sleep(.05)
    pytest.fail("Job failed to finish")


def test_container_general_functions_and_feedback(controller):
    exercise = general_exercise()
    result = execute(controller, exercise)["result"]
    assert result["passed"] and result["cases_passed"] == 2, result
    assert result["time_status"] == result["memory_status"] == "not_requested"
    failed = execute(controller, exercise, "def summarize(*args, **kwargs): return True", "check")["result"]
    assert not failed["passed"] and failed["failure_actual"] == "True", failed
    mutation = "def summarize(values, factor, *, prefix):\n    values.append(1)\n    return {}"
    failed = execute(controller, exercise, mutation, "check")["result"]
    assert "modified" in failed["error"], failed
    exercise["cases"][0]["expected"] = False
    assert not execute(controller, exercise)["result"]["passed"]
    nested = general_exercise()
    nested.update(function="identity", reference_solution="def identity(values): return values",
                  examples=[{"args": [[{"n": [2]}]], "kwargs": {}, "expected": [{"n": [2]}]}],
                  cases=[{"args": [[]], "kwargs": {}, "expected": []}])
    failed = execute(controller, nested, "def identity(values):\n    values[0]['n'][0] = 3\n    return values", "check")["result"]
    assert "modified" in failed["error"], failed
    floating = general_exercise()
    case = {"args": [0.1, 0.2], "kwargs": {}, "expected": 0.3}
    floating.update(function="add", reference_solution="def add(a, b): return a + b",
                    examples=[case], cases=[case], comparison={"abs_tol": 1e-10})
    assert execute(controller, floating)["result"]["passed"]


def test_container_demo_targets_and_generator_errors(controller):
    exercise = demonstration()["python_playground"]
    result = execute(controller, exercise)["result"]
    assert result["passed"], result
    print("V2 benchmark:", json.dumps(result))
    nondeterministic = copy.deepcopy(exercise)
    nondeterministic["benchmark"]["generator_code"] = "import uuid\ndef make_case(size, seed):\n    return {'args': [[uuid.uuid4().hex]], 'kwargs': {}}"
    failed = execute(controller, nondeterministic)["result"]
    assert not failed["passed"] and "deterministic" in failed["error"], failed
    oversized = copy.deepcopy(exercise)
    oversized["benchmark"]["generator_code"] = "def make_case(size, seed):\n    return {'args': [['x' * 8000000]], 'kwargs': {}}"
    failed = execute(controller, oversized)["result"]
    assert not failed["passed"] and "7 MiB" in failed["error"], failed
    assert execute(controller, general_exercise())["result"]["passed"]


def test_validation_cancel_and_cleanup(controller):
    exercise = general_exercise()
    exercise["reference_solution"] = "while True: pass"
    job = controller.submit({"exercise": exercise, "operation": "validate_exercise"})
    time.sleep(.3)
    controller.cancel(job["id"])
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline and controller.snapshot(job["id"])["state"] != "finished":
        time.sleep(.05)
    assert controller.snapshot(job["id"])["result"]["category"] == "cancelled"
