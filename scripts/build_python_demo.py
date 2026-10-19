"""One v2 demonstration; preserve existing authored exercises."""
import json
from pathlib import Path

from scripts.build_python_pilot import pilot
from src.bank_manager import merge_banks


def demonstration():
    challenge = pilot()
    challenge.update(id="PY-002", title="Deduplicate strings while preserving order", difficulty=3)
    challenge["student"] = {
        "scenario": "A pipeline receives repeated string identifiers. Produce each identifier once, in first-occurrence order.",
        "requirements": ["Implement unique_strings(values: list[str]) -> list[str].", "Preserve first occurrence, case, and the input list."],
        "tasks": ["Handle empty and repeated strings correctly.", "Avoid repeatedly scanning the growing output list."],
        "constraints": ["Standard library only.", "Each measured call ≤ 150 ms; peak Python allocations ≤ 2 MiB."],
        "deliverables": ["A working function and a short explanation of its time and memory use."],
    }
    challenge["hints"] = ["Separate membership checking from output ordering.", "A set can track values already seen.", "Append only when a value is absent from the set; then add it to the set."]
    challenge["internal"] = {"topics": ["Python", "deduplication", "hash-based membership"]}
    challenge["review_exercise"] = "Explain why list membership becomes expensive as the number of unique values grows."
    challenge["python_playground"] = {
        "version": 2, "function": "unique_strings",
        "contract": "Return each string once in first-occurrence order; do not modify values.",
        "starter_code": "def unique_strings(values: list[str]) -> list[str]:\n    return []\n\nprint(unique_strings(['a', 'b', 'a']))\n",
        "examples": [{"args": [["a", "b", "a"]], "kwargs": {}, "expected": ["a", "b"]}],
        "cases": [
            {"args": [[]], "kwargs": {}, "expected": []},
            {"args": [["", "", "x"]], "kwargs": {}, "expected": ["", "x"]},
            {"args": [["a", "A", "a", "b", "A"]], "kwargs": {}, "expected": ["a", "A", "b"]},
        ],
        "reference_solution": "def unique_strings(values):\n    return list(dict.fromkeys(values))\n",
        "benchmark": {"size": 60000, "seed": 17,
            "generator_code": "def make_case(size, seed):\n    return {'args': [[f'item-{(i + seed) % 10000}' for i in range(size)]], 'kwargs': {}}\n"},
        "targets": {"time_ms": 150, "memory_bytes": 2097152},
        "explanation": "A set plus an output list gives average O(n) time with O(k) extra space for k unique strings. list(dict.fromkeys(values)) also preserves insertion order. Checking membership in the output list repeatedly can take O(n*k) time. Measure alternatives; concise code alone does not imply efficiency.",
    }
    return challenge


def add_demo(bank):
    challenge = demonstration()
    if any(c["id"] == challenge["id"] for c in bank["challenges"]):
        return bank
    return merge_banks(bank, {"bank": {}, "challenges": [challenge],
                              "rubrics": {"python_efficiency": bank["rubrics"]["python_efficiency"]}})


if __name__ == "__main__":
    path = Path(__file__).resolve().parents[1] / "data/challenges.json"
    path.write_text(json.dumps(add_demo(json.loads(path.read_text(encoding="utf-8"))), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
