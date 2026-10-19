"""Whole-submission currency, shared with optional evaluator requests."""
from src.constructor_models import fingerprint


def evaluation_topics(bank, challenge, attempt):
    """Legacy banks and run snapshots may predate the optional topic index."""
    return sorted(set(bank.get("bank", {}).get("topic_index", {}))
                  | set(challenge.get("internal", {}).get("topics", []))
                  | set(attempt.get("weak_topics", [])))


def submission_content(attempt):
    context = {k: attempt.get(k) for k in (
        "answer", "diagram", "sql_workspace", "python_workspace", "detective_workspace", "complications_used")}
    if attempt.get("capstone_workspace"):
        context["capstone_workspace"] = {k: v for k, v in attempt["capstone_workspace"].items() if k != "completed_fingerprint"}
    workspace = attempt.get("constructor_workspace")
    if workspace:
        context["constructor_workspace"] = {"version": workspace["version"], "tasks": workspace["tasks"],
            "artifacts": {identity: {k: a.get(k) for k in ("version", "tool", "revision", "created_at", "updated_at")}
                          for identity, a in workspace["artifacts"].items()}}
    return context


def submission_revision(attempt):
    return fingerprint(submission_content(attempt))


def evaluation_context(challenge, rubric):
    return fingerprint({"challenge": challenge, "rubric": rubric})


def review_status(attempt, challenge=None, rubric=None):
    if not attempt.get("evaluated_at"):
        return "Not evaluated"
    current = attempt.get("evaluation_submission") == submission_revision(attempt)
    if challenge is not None:
        current = current and attempt.get("evaluation_context") == evaluation_context(challenge, rubric or {})
    return "Evaluation current" if current else "Evaluation outdated"
