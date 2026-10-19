"""Saved-work destinations. Reading/selecting a destination never writes progress."""
from datetime import datetime, timezone
import re

PRIMARY = {"sql_workspace": "SQL lab", "python_workspace": "Python lab",
           "detective_workspace": "investigation", "diagram": "diagram"}


def saved_challenge(attempt, challenges, runs):
    """Project attempts keep their original brief even when the bank changes."""
    if attempt.get("project_run_id"):
        run = runs.get(attempt["project_run_id"])
        stage = attempt.get("project_stage_id")
        if run and run["stage_attempts"].get(stage) == attempt["attempt_id"]:
            return run["challenges"].get(stage)
        return None
    return challenges.get(attempt["challenge_id"])


def validate_target(value):
    if value is not None and (not isinstance(value, str) or not (
            value in ("answer", *PRIMARY) or re.fullmatch(r"artifact:[a-z][a-z0-9_-]{0,63}", value))):
        raise ValueError("Invalid resume target.")
    return value


def time_key(value):
    if not value:
        return datetime.min.replace(tzinfo=timezone.utc)
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)


def destination(attempt, challenge):
    workspace = attempt.get("constructor_workspace") or {}
    slots = workspace.get("tasks", {}).get("slots", [])
    target = attempt.get("resume_target")
    if not target:
        saved = workspace.get("artifacts", {})
        # max preserves the declared order on equal timestamps.
        available = [s for s in slots if s["id"] in saved]
        if available:
            slot = max(available, key=lambda s: time_key(saved[s["id"]].get("updated_at")))
            target = "artifact:" + slot["id"]
        else:
            target = next((f for f, c in (("detective_workspace", "data_quality_detective"),
                          ("python_workspace", "python_playground"), ("sql_workspace", "dataset_sql"), ("sql_workspace", "sql_playground"))
                           if challenge.get(c)), "answer")
    if target.startswith("artifact:"):
        slot = next((s for s in slots if "artifact:" + s["id"] == target), None)
        return (target, slot["label"]) if slot else (None, "attempt overview")
    if target == "answer":
        return target, "written answer"
    field = {"sql_workspace": "sql_playground", "python_workspace": "python_playground",
             "detective_workspace": "data_quality_detective", "diagram": "diagram_kind"}.get(target)
    return (target, PRIMARY[target]) if field and (challenge.get(field) or target == "sql_workspace" and challenge.get("dataset_sql")) else (None, "attempt overview")


def most_recent(attempts, challenges):
    candidates = [a for a in attempts if a["challenge_id"] in challenges
                  and a.get("status") in ("Not started", "In progress")]
    worked = [a for a in candidates if a.get("activity_at") or not a.get("work_tracking_version")]
    if worked:
        candidates = worked
    return max(candidates, key=lambda a: (time_key(a.get("activity_at") or (a.get("started_at") if a.get("work_tracking_version") else a.get("updated_at"))),
                                        a["attempt_id"]), default=None)
