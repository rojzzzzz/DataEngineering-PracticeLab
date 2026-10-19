"""Bounded Python exercise/workspace contracts; no execution in the app process."""
from __future__ import annotations

import hashlib
import json
import math
import re
import keyword
from copy import deepcopy

SOURCE_LIMIT = 100 * 1024
OUTPUT_LIMIT = 64 * 1024
PROTOCOL = "python-practice-v2"


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def validate_source(source):
    if not isinstance(source, str) or len(source.encode("utf-8")) > SOURCE_LIMIT:
        raise ValueError("Python source must be text no larger than 100 KiB.")
    return source


def validate_exercise(exercise):
    if isinstance(exercise, dict) and type(exercise.get("version")) is int and exercise["version"] == 2:
        return validate_v2(exercise)
    if not isinstance(exercise, dict) or type(exercise.get("version")) is not int or exercise.get("version") != 1:
        raise ValueError("Unsupported Python exercise version.")
    validate_source(exercise.get("starter_code"))
    if not isinstance(exercise.get("function"), str) or not re.fullmatch(r"[A-Za-z_]\w{0,63}", exercise["function"], flags=re.ASCII):
        raise ValueError("Python exercise needs a valid function name.")
    if not isinstance(exercise.get("contract"), str) or len(exercise["contract"]) > 4000:
        raise ValueError("Python exercise needs a function contract.")
    for field in ("examples", "cases"):
        cases = exercise.get(field)
        if not isinstance(cases, list) or not 1 <= len(cases) <= 30:
            raise ValueError(f"Python {field} must contain 1–30 cases.")
        for case in cases:
            if not isinstance(case, dict) or not isinstance(case.get("values"), list) or len(case["values"]) > 1000:
                raise ValueError("Python cases need bounded integer inputs.")
            if any(type(n) is not int or abs(n) > 10**12 for n in case["values"]) or type(case.get("expected")) is not int:
                raise ValueError("Python cases need integer values and expected totals.")
            if case["expected"] != sum(n for n in case["values"] if n >= 0):
                raise ValueError(f"Python {field}: expected must equal the sum of nonnegative values; other problem types are not supported in v1.")
    fixture = exercise.get("benchmark", {})
    if fixture != {"kind": "cycling_integers", "size": 1_000_000, "modulus": 201, "offset": -100}:
        raise ValueError("Only the pilot's deterministic benchmark is supported in v1.")
    targets = exercise.get("targets", {})
    if not isinstance(targets, dict):
        raise ValueError("Python targets must be an object.")
    for name, maximum in (("time_ms", 5000), ("memory_bytes", 128 * 1024 * 1024)):
        value = targets.get(name)
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 < value <= maximum:
            raise ValueError(f"Invalid Python target: {name}.")
    if not isinstance(exercise.get("explanation"), str) or len(exercise["explanation"]) > 10000:
        raise ValueError("Python exercise needs a bounded explanation.")
    if len(json.dumps(exercise, allow_nan=False).encode()) > 128 * 1024:
        raise ValueError("Python exercise metadata is too large.")
    return exercise


def public_exercise(exercise):
    return {k: exercise[k] for k in ("version", "starter_code", "function", "contract", "examples", "targets") if k in exercise}


def new_workspace(exercise):
    return {"version": 1, "source": exercise["starter_code"], "assessment": None}


def validate_workspace(workspace):
    if not isinstance(workspace, dict) or type(workspace.get("version")) is not int or workspace.get("version") != 1:
        raise ValueError("Unsupported Python workspace version.")
    validate_source(workspace.get("source"))
    assessment = workspace.get("assessment")
    if assessment is not None:
        if not isinstance(assessment, dict) or len(json.dumps(assessment, allow_nan=False).encode()) > 32 * 1024:
            raise ValueError("Invalid Python assessment summary.")
        for key in ("source_hash", "exercise_hash", "runner_hash"):
            if not isinstance(assessment.get(key), str) or not re.fullmatch("[a-f0-9]{64}", assessment[key]):
                raise ValueError("Invalid Python assessment revision.")
        result = assessment.get("result")
        if not isinstance(result, dict) or any(key in result for key in ("stdout", "stderr", "source")):
            raise ValueError("Python assessment must contain summary data only.")
        booleans = {"ok", "correctness", "time_passed", "memory_passed", "passed"}
        numbers = {"max_ms", "median_ms", "peak_bytes", "total_ms", "elapsed_ms", "cases_passed", "cases_total"}
        strings = {"error", "category", "python_version", "protocol", "image_id", "failure_input", "failure_expected", "failure_actual", "time_status", "memory_status"}
        if not set(result) <= booleans | numbers | strings | {"samples_ms"} or type(result.get("ok")) is not bool:
            raise ValueError("Invalid Python result fields.")
        for key, value in result.items():
            if key in booleans and type(value) is not bool:
                raise ValueError("Invalid Python check result.")
            if key in numbers and (type(value) not in (int, float) or not math.isfinite(value) or value < 0):
                raise ValueError("Invalid Python measurement.")
            if key in strings and (not isinstance(value, str) or len(value) > 4000):
                raise ValueError("Invalid Python result text.")
            if key == "samples_ms" and (not isinstance(value, list) or len(value) != 5 or any(type(n) not in (int, float) or not math.isfinite(n) or n < 0 for n in value)):
                raise ValueError("Invalid Python timing samples.")
    return {"version": 1, "source": workspace["source"], "assessment": assessment}


def is_current(assessment, source, exercise, runner_hash=None):
    return bool(assessment and assessment["source_hash"] == fingerprint(source)
                and assessment["exercise_hash"] == fingerprint(exercise)
                and (runner_hash is None or assessment["runner_hash"] == runner_hash))


def grade_metrics(times, peak, targets):
    result = {}
    if "time_ms" in targets:
        result["time_passed"] = max(times) <= targets["time_ms"]
    if "memory_bytes" in targets:
        result["memory_passed"] = peak <= targets["memory_bytes"]
    return result


def json_value(value, depth=0):
    """Validate the deliberately small supported value domain, without coercion."""
    if depth > 20:
        raise ValueError("Python values may nest at most 20 levels.")
    if value is None or type(value) in (bool, str):
        return
    if type(value) is int and abs(value) <= 10**100:
        return
    if type(value) is float and math.isfinite(value):
        return
    if type(value) is list:
        for item in value:
            json_value(item, depth + 1)
        return
    if type(value) is dict and all(type(k) is str for k in value):
        for item in value.values():
            json_value(item, depth + 1)
        return
    raise ValueError("Use only finite JSON-compatible values (no tuples, sets or custom objects).")


def equal_values(actual, expected, comparison=None):
    if type(actual) is not type(expected):
        return False
    if type(actual) is dict:
        return actual.keys() == expected.keys() and all(equal_values(actual[k], expected[k], comparison) for k in expected)
    if type(actual) is list:
        return len(actual) == len(expected) and all(equal_values(a, b, comparison) for a, b in zip(actual, expected))
    if type(actual) is float and comparison:
        return math.isclose(actual, expected, rel_tol=comparison.get("rel_tol", 0), abs_tol=comparison.get("abs_tol", 0))
    return actual == expected


def validate_call(case):
    if not isinstance(case, dict) or type(case.get("args")) is not list or type(case.get("kwargs")) is not dict:
        raise ValueError("Each case needs args (array) and kwargs (object).")
    if len(case["args"]) > 20 or len(case["kwargs"]) > 20 or any(type(k) is not str or not k.isidentifier() or keyword.iskeyword(k) for k in case["kwargs"]):
        raise ValueError("Invalid or excessive function arguments.")
    json_value(case)


def validate_v2(exercise):
    validate_source(exercise.get("starter_code"))
    validate_source(exercise.get("reference_solution"))
    name = exercise.get("function")
    if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z_]\w{0,63}", name, flags=re.ASCII) or keyword.iskeyword(name):
        raise ValueError("Python exercise needs a valid function name.")
    for field, limit in (("contract", 4000), ("explanation", 10000)):
        if not isinstance(exercise.get(field), str) or not exercise[field].strip() or len(exercise[field]) > limit:
            raise ValueError(f"Python exercise needs bounded {field} text.")
    for field in ("examples", "cases"):
        cases = exercise.get(field)
        if not isinstance(cases, list) or not 1 <= len(cases) <= 30:
            raise ValueError(f"Python {field} must contain 1–30 cases.")
        for case in cases:
            validate_call(case)
            if "expected" not in case or len(json.dumps(case, allow_nan=False).encode()) > 32 * 1024:
                raise ValueError("Cases need expected and must fit in 32 KiB.")
    comparison = exercise.get("comparison", {})
    if not isinstance(comparison, dict) or not set(comparison) <= {"abs_tol", "rel_tol"}:
        raise ValueError("Comparison supports only abs_tol and rel_tol.")
    for value in comparison.values():
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= 1:
            raise ValueError("Comparison tolerances must be finite and between 0 and 1.")
    targets = exercise.get("targets", {})
    if not isinstance(targets, dict) or not set(targets) <= {"time_ms", "memory_bytes"}:
        raise ValueError("Unsupported Python target.")
    for key, value in targets.items():
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 < value <= (5000 if key == "time_ms" else 128 * 1024 * 1024):
            raise ValueError(f"Invalid Python target: {key}.")
    benchmark = exercise.get("benchmark")
    if bool(targets) != (benchmark is not None):
        raise ValueError("A benchmark requires at least one target, and targets require a benchmark.")
    if benchmark is not None:
        if not isinstance(benchmark, dict):
            raise ValueError("Benchmark must be an object.")
        validate_source(benchmark.get("generator_code"))
        if type(benchmark.get("size")) is not int or not 1 <= benchmark["size"] <= 1_000_000:
            raise ValueError("Benchmark size must be 1–1,000,000.")
        if type(benchmark.get("seed")) is not int or not 0 <= benchmark["seed"] <= 2**32 - 1:
            raise ValueError("Benchmark needs an integer seed in 0–2^32-1.")
    if len(json.dumps(exercise, allow_nan=False).encode()) > 128 * 1024:
        raise ValueError("Python exercise metadata is too large.")
    return exercise


def normalized_exercise(exercise):
    """Adapt v1 in memory; hashes and stored banks retain the original content."""
    if exercise["version"] == 2:
        return deepcopy(exercise)
    value = deepcopy(exercise)
    value["version"] = 2
    for field in ("examples", "cases"):
        value[field] = [{"args": [case["values"]], "kwargs": {}, "expected": case["expected"]} for case in exercise[field]]
    value["reference_solution"] = f"def {exercise['function']}(values):\n    return sum(x for x in values if x >= 0)\n"
    value["benchmark"] = {"size": 1_000_000, "seed": 0,
        "generator_code": "def make_case(size, seed):\n    return {'args': [[(i % 201) - 100 for i in range(size)]], 'kwargs': {}}\n"}
    return value
