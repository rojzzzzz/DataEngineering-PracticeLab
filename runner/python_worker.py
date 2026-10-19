"""Container-only harness. Never import or execute submitted code on the host."""
from __future__ import annotations

import json
import os
from pathlib import Path
import signal
import statistics
import subprocess
import sys
import threading
import time
import traceback
import tracemalloc

sys.path.insert(0, "/opt")
from python_models import normalized_exercise, json_value, equal_values, validate_call

OUTPUT_LIMIT = 64 * 1024
RESULT_PATH = Path("/tmp/result.json")


def load_function(source, name, filename):
    import linecache
    linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)
    namespace = {"__name__": "__main__", "__file__": filename}
    exec(compile(source, filename, "exec"), namespace)
    fn = namespace.get(name)
    if not callable(fn):
        raise ValueError(f"Define the required function: {name}.")
    return fn


def input_snapshot(value):
    # JSON's C encoder is much faster than deepcopy + Python equality on large
    # fixtures. Check container types too: JSON alone would coerce tuples to lists.
    scalar_types = (str, int, float, bool, type(None))
    def containers(item):
        if type(item) is dict:
            if any(type(k) is not str for k in item):
                raise ValueError("Input dictionary keys changed type.")
            children = item.values()
        elif type(item) is list:
            children = item
        else:
            raise ValueError("Input contains an unsupported type.")
        for child in children:
            if type(child) not in scalar_types:
                containers(child)
    containers(value)
    return json.dumps(value, sort_keys=True, allow_nan=False, separators=(",", ":"))


def checked_call(fn, case, comparison, memory=False):
    original = input_snapshot({"args": case["args"], "kwargs": case["kwargs"]})
    if memory:
        tracemalloc.start(1)
        tracemalloc.reset_peak()
    start = time.perf_counter_ns()
    try:
        actual = fn(*case["args"], **case["kwargs"])
    finally:
        elapsed = (time.perf_counter_ns() - start) / 1e6
        peak = tracemalloc.get_traced_memory()[1] if memory else None
        if memory:
            tracemalloc.stop()
    error = None
    try:
        json_value(actual)
        if len(json.dumps(actual, allow_nan=False).encode()) > 1024 * 1024:
            raise ValueError("Return value exceeds 1 MiB.")
    except ValueError as exc:
        error = str(exc)
    if not error and not equal_values(actual, case["expected"], comparison):
        error = "Incorrect return value or return type."
    try:
        if input_snapshot({"args": case["args"], "kwargs": case["kwargs"]}) != original:
            error = "The function modified its input."
    except (ValueError, TypeError):
        error = "The function modified its input."
    if error:
        return {"ok": False, "correctness": False, "error": error,
                "failure_input": original[:2000], "failure_expected": repr(case["expected"])[:2000],
                "failure_actual": repr(actual)[:2000]}
    return {"ok": True, "elapsed_ms": elapsed, "peak_bytes": peak}


def prepare(exercise):
    """Only this child loads author code; the measured child starts clean."""
    benchmark = exercise["benchmark"]
    def generate():
        fn = load_function(benchmark["generator_code"], "make_case", "generator.py")
        case = fn(benchmark["size"], benchmark["seed"])
        validate_call(case)
        if set(case) != {"args", "kwargs"}:
            raise ValueError("make_case must return only args and kwargs.")
        if len(json.dumps(case, allow_nan=False).encode()) > 7 * 1024 * 1024:
            raise ValueError("Generated input exceeds 7 MiB.")
        return case
    case = generate()
    if input_snapshot(case) != input_snapshot(generate()):
        raise ValueError("Benchmark generator is not deterministic for its size and seed.")
    original = input_snapshot(case)
    reference = load_function(exercise["reference_solution"], exercise["function"], "reference.py")
    expected = reference(*case["args"], **case["kwargs"])
    json_value(expected)
    if len(json.dumps(expected, allow_nan=False).encode()) > 1024 * 1024:
        raise ValueError("Reference result exceeds 1 MiB.")
    if input_snapshot(case) != original:
        raise ValueError("Reference solution modified its input.")
    Path("/tmp/prepared.json").write_text(json.dumps({**case, "expected": expected}, allow_nan=False), encoding="utf-8")
    return {"ok": True}


def evaluate(request):
    phase = request["phase"]
    exercise = normalized_exercise(request["exercise"])
    if phase == "prepare":
        return prepare(exercise)
    if phase == "run":
        namespace = {"__name__": "__main__", "__file__": "solution.py"}
        import linecache
        linecache.cache["solution.py"] = (len(request["source"]), None, request["source"].splitlines(True), "solution.py")
        compiled = compile(request["source"], "solution.py", "exec")
        start = time.perf_counter_ns()
        exec(compiled, namespace)
        return {"ok": True, "elapsed_ms": (time.perf_counter_ns() - start) / 1e6}
    fn = load_function(request["source"], exercise["function"], "solution.py")
    comparison = exercise.get("comparison")
    cases = exercise["examples"] + exercise["cases"]
    if phase == "correctness":
        for index, case in enumerate(cases):
            try:
                result = checked_call(fn, case, comparison)
            except BaseException as exc:
                traceback.print_exc(limit=12)
                result = {"ok": False, "correctness": False, "error": f"{type(exc).__name__}: {exc}"[:2000],
                          "failure_input": repr({k: case[k] for k in ("args", "kwargs")})[:2000],
                          "failure_expected": repr(case["expected"])[:2000], "failure_actual": type(exc).__name__}
            if not result["ok"]:
                return {**result, "cases_passed": index, "cases_total": len(cases)}
    result = {"ok": True, "correctness": True, "cases_passed": len(cases), "cases_total": len(cases)}
    if phase == "correctness" or exercise.get("benchmark") is None:
        return result
    def measured(memory=False):
        case = json.loads(Path("/tmp/prepared.json").read_text(encoding="utf-8"))
        return checked_call(fn, case, comparison, memory)
    if phase == "memory":
        measured_result = measured(True)
        return {**result, "peak_bytes": measured_result["peak_bytes"]} if measured_result["ok"] else measured_result
    warmup = measured()
    if not warmup["ok"]:
        return warmup
    samples = []
    for _ in range(5):
        call = measured()
        if not call["ok"]:
            return call
        samples.append(call["elapsed_ms"])
    return {**result, "samples_ms": samples, "median_ms": statistics.median(samples), "max_ms": max(samples)}


def child():
    request = json.load(sys.stdin)
    # No interactive input: EOF instead of waiting for another request.
    sys.stdin = open(os.devnull)
    try:
        result = evaluate(request)
    except BaseException as exc:
        traceback.print_exc(limit=12)
        result = {"ok": False, "correctness": False, "error": f"{type(exc).__name__}: {exc}"[:2000]}
    result["python_version"] = sys.version.split()[0]
    RESULT_PATH.write_text(json.dumps(result, allow_nan=False), encoding="utf-8")


def run_child(payload):
    RESULT_PATH.unlink(missing_ok=True)
    process = subprocess.Popen([sys.executable, "-I", "-u", __file__, "--child"],
                               stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               start_new_session=True)
    outputs = {"stdout": bytearray(), "stderr": bytearray()}
    lock = threading.Lock()
    exceeded = threading.Event()

    def drain(name, pipe):
        while chunk := pipe.read1(4096):
            with lock:
                remaining = OUTPUT_LIMIT - sum(len(v) for v in outputs.values())
                outputs[name].extend(chunk[:remaining])
                if len(chunk) > remaining:
                    exceeded.set()
                    try:
                        os.killpg(process.pid, signal.SIGKILL)
                    except ProcessLookupError:
                        pass
    threads = [threading.Thread(target=drain, args=(name, getattr(process, name)), daemon=True) for name in outputs]
    for thread in threads:
        thread.start()
    process.stdin.write(payload)
    process.stdin.close()
    process.wait()
    # Kill descendants even when the solution exited without joining them.
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    for thread in threads:
        thread.join(1)
    if exceeded.is_set():
        result = {"ok": False, "error": "Output exceeded 64 KiB.", "category": "output_limit"}
    elif process.returncode or not RESULT_PATH.exists():
        result = {"ok": False, "error": "Python process stopped without a result.", "category": "process_error"}
    elif RESULT_PATH.stat().st_size > 32 * 1024:
        result = {"ok": False, "error": "Invalid worker result.", "category": "process_error"}
    else:
        result = json.loads(RESULT_PATH.read_text(encoding="utf-8"))
    result.update({name: value.decode("utf-8", errors="replace") for name, value in outputs.items()})
    return result


def supervise():
    payload = sys.stdin.buffer.read(512 * 1024 + 1)
    if len(payload) > 512 * 1024:
        raise ValueError("Request too large")
    request = json.loads(payload)
    exercise = normalized_exercise(request["exercise"])
    phases = []
    if request["phase"] == "timing":
        phases.append("correctness")
    if request["phase"] != "run" and exercise.get("benchmark"):
        phases.append("prepare")
    if request["phase"] != "timing" or exercise.get("benchmark"):
        phases.append(request["phase"])
    output = {"stdout": "", "stderr": ""}
    for phase in phases:
        result = run_child(json.dumps({**request, "phase": phase}).encode())
        for stream in output:
            output[stream] += result.pop(stream, "")
        if sum(len(value.encode()) for value in output.values()) > OUTPUT_LIMIT:
            result = {"ok": False, "error": "Output exceeded 64 KiB.", "category": "output_limit"}
            output = {"stdout": "", "stderr": ""}
            break
        if not result["ok"]:
            break
    print(json.dumps({**result, **output}, allow_nan=False))


if __name__ == "__main__":
    child() if "--child" in sys.argv else supervise()
