"""Add the single Python pilot without replacing an existing authored challenge."""
import json
from pathlib import Path


def pilot():
    return {
        "id": "PY-001", "title": "Sum a large input without an intermediate list", "type": "PYTHON",
        "difficulty": 2, "estimated_minutes": 20, "rubric_ref": "python_efficiency",
        "artifacts_required": ["Python function", "Brief explanation of time and memory use"],
        "student": {
            "scenario": "A data pipeline receives one million integer amounts. Sum the nonnegative amounts while keeping additional memory small.",
            "requirements": ["Implement sum_nonnegative(values: list[int]) -> int.", "Return an integer total; ignore negative values and keep zero values.", "Do not modify the supplied list."],
            "tasks": ["Write and run a solution.", "Check correctness, execution time, and peak Python allocations.", "Explain why your approach meets the memory target."],
            "constraints": ["Each measured call must take at most 250 ms.", "Peak Python allocations during the call must not exceed 1 MiB; prepared inputs are excluded.", "Standard library only. No interactive input, network, or package installation."],
            "deliverables": ["A working function that passes all three checks.", "A short explanation of the tradeoff between loops, comprehensions, and generators."]
        },
        "hints": ["First make the function correct for empty inputs and mixed signs.", "Think about whether filtering must create a second list.", "sum() accepts an iterable. A generator expression can produce values one at a time."],
        "follow_up_complications": [],
        "internal": {"topics": ["Python", "iteration", "memory efficiency"]},
        "review_exercise": "Compare a loop, a list comprehension, and a generator using the same input.",
        "python_playground": {
            "version": 1, "function": "sum_nonnegative",
            "contract": "Return the integer sum of values >= 0 without modifying the input list.",
            "starter_code": "def sum_nonnegative(values: list[int]) -> int:\n    # Replace this with your solution.\n    return 0\n\n\nprint(sum_nonnegative([3, -2, 0, 5]))\n",
            "examples": [{"values": [3, -2, 0, 5], "expected": 8}, {"values": [], "expected": 0}],
            "cases": [
                {"values": [], "expected": 0}, {"values": [-7, -1, -2], "expected": 0},
                {"values": [0, 0, 0], "expected": 0}, {"values": [3, -2, 0, 5], "expected": 8},
                {"values": [4, 4, -4, 4], "expected": 12},
                {"values": [1000000000000, -1000000000000, 9], "expected": 1000000000009},
            ],
            "benchmark": {"kind": "cycling_integers", "size": 1000000, "modulus": 201, "offset": -100},
            "targets": {"time_ms": 250, "memory_bytes": 1048576},
            "explanation": "A direct solution is:\n\n```python\ndef sum_nonnegative(values: list[int]) -> int:\n    return sum(value for value in values if value >= 0)\n```\n\nThe generator supplies one value at a time. It visits all n inputs, so time is O(n), with O(1) additional space for bounded integers. A normal loop with an accumulator also meets this goal and is equally valid. A list comprehension inside sum() first materializes the matching values, using O(n) additional space. Shorter code is not automatically faster: compare the measurements and prefer clarity. Input storage is excluded from this exercise's allocation measurement."
        }
    }


def add_pilot(bank):
    if any(c["id"] == "PY-001" for c in bank["challenges"]):
        return bank
    bank["challenges"].append(pilot())
    bank.setdefault("rubrics", {})["python_efficiency"] = {"correctness": 40, "time_efficiency": 20, "memory_efficiency": 20, "clarity_and_reasoning": 20}
    metadata = bank.setdefault("bank", {})
    metadata["challenge_count"] = len(bank["challenges"])
    if "PYTHON" not in metadata.setdefault("type_enum", []):
        metadata["type_enum"].append("PYTHON")
    metadata.setdefault("challenge_families", []).append({"prefix": "PY", "name": "Python Practice", "intent": "Write clear Python with measured time and memory targets."})
    for topic in pilot()["internal"]["topics"]:
        metadata.setdefault("topic_index", {}).setdefault(topic, []).append("PY-001")
    return bank


if __name__ == "__main__":
    path = Path(__file__).resolve().parents[1] / "data" / "challenges.json"
    bank = add_pilot(json.loads(path.read_text(encoding="utf-8")))
    path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
