"""Python attempt coordination, independent of Streamlit rendering.

Editor events save before execution. Failed saves retain the draft and leave
the event retryable; completed checks publish only after assessment persistence.
"""
from __future__ import annotations

from collections.abc import MutableMapping
from copy import deepcopy
from dataclasses import dataclass, replace
from pathlib import Path
import sqlite3
from typing import Any

from src import database, python_runner
from src.python_models import fingerprint, is_current, new_workspace, validate_workspace
from src.python_validation import validation_record


def cancel_python_job(state: MutableMapping[str, Any], runner=python_runner) -> None:
    """Discard local execution ownership even if remote cancellation fails."""
    job = state.pop("python_job", None)
    state.pop("python_completed_result", None)
    if job:
        try:
            runner.cancel(job["id"])
        except RuntimeError:
            pass  # The controller's external deadline still bounds execution.


@dataclass(frozen=True)
class WorkspaceView:
    workspace: dict
    exercise_hash: str
    busy: bool
    assessed_source: str | None = None
    assessment_outdated: bool = False
    last_result: dict | None = None
    result_outdated: bool = False
    job_state: str | None = None
    pending_save: bool = False
    error: str | None = None
    rerun: bool = False


class PythonWorkspace:
    def __init__(self, state: MutableMapping[str, Any], path: Path | str,
                 attempt_id: int, exercise: dict, *, runner=python_runner):
        self.state, self.path = state, path
        self.attempt_id, self.exercise = attempt_id, deepcopy(exercise)
        self.runner = runner
        self.exercise_hash = fingerprint(self.exercise)
        self.owner = (str(Path(path).resolve()), attempt_id, self.exercise_hash)
        if state.get("python_owner") != self.owner:
            cancel_python_job(state, runner)
            state["python_owner"] = self.owner
            state.pop("python_dirty", None)
            for key in ("python_event_id", "python_last_result"):
                state.pop(key, None)

    @property
    def busy(self) -> bool:
        return self.state.get("python_owner") == self.owner and self.state.get("python_job") is not None

    def mark_pending(self, pending):
        if self.state.get("python_owner") == self.owner:
            self.state["python_dirty"] = bool(pending)

    def _load(self) -> dict:
        if self.state.get("python_owner") != self.owner:
            raise ValueError("Workspace changed. Reopen the exercise.")
        current = database.get_attempt(self.path, self.attempt_id)
        if current is None:
            cancel_python_job(self.state, self.runner)
            raise ValueError("Attempt no longer exists.")
        return validate_workspace(current.get("python_workspace") or new_workspace(self.exercise))

    def _view(self, workspace: dict, health: dict, **changes) -> WorkspaceView:
        owned = self.state.get("python_owner") == self.owner
        pending = self.state.get("python_pending_drafts", {}).get(self.owner) if owned else None
        workspace = deepcopy(workspace)
        if pending is not None:
            workspace["source"] = pending["source"]
        assessment = workspace.get("assessment")
        outdated = bool(assessment and not is_current(
            assessment, workspace["source"], self.exercise, health.get("runner_hash")))
        last = deepcopy(self.state.get("python_last_result")) if owned else None
        return WorkspaceView(
            workspace=workspace, exercise_hash=self.exercise_hash, busy=self.busy,
            assessed_source=("" if outdated else workspace["source"]) if assessment else None,
            assessment_outdated=outdated, last_result=last,
            result_outdated=bool(last and (last.get("outdated") or (
                "source_hash" in last and not is_current(
                    last, workspace["source"], self.exercise, health.get("runner_hash"))))),
            pending_save=pending is not None, **changes,
        )

    def view(self, health: dict) -> WorkspaceView:
        """Read drafts and freshness without polling or starting execution."""
        try:
            return self._view(self._load(), health)
        except (ValueError, TypeError, OSError, sqlite3.Error) as exc:
            return self._view(new_workspace(self.exercise), health, error=str(exc))

    def apply(self, event: dict | None, health: dict) -> WorkspaceView:
        """Save an incoming edit before polling, so late checks see that edit.

        With no event, retry a pending draft as a save only and poll owned work.
        A failed runner submission is consumed after saving: retrying a remote
        send requires a new explicit event, since acceptance may be ambiguous.
        """
        try:
            workspace = self._load()
            pending = self.state.get("python_pending_drafts", {}).get(self.owner)
            if event is not None:
                if not isinstance(event, dict) or not isinstance(event.get("id"), str) or not event["id"]:
                    raise ValueError("Invalid Python editor event.")
                if event.get("attemptId") != self.attempt_id or event.get("exerciseHash") != self.exercise_hash:
                    raise ValueError("Ignored an event from a previous exercise.")
                if event.get("id") == self.state.get("python_event_id"):
                    event = None
            action = event.get("action") if event else "save" if pending is not None else None
            if event and action not in ("save", "run", "check", "cancel"):
                raise ValueError("Unknown Python editor action.")
            if action is not None:
                updated = validate_workspace({**workspace, "source": event.get("source") if event else pending["source"]})
                # Retain source independently of the browser event across remounts.
                pending_id = event["id"] if event else pending["id"]
                self.state.setdefault("python_pending_drafts", {})[self.owner] = {
                    "source": updated["source"], "id": pending_id,
                }
                if updated != workspace:
                    database.save_python_workspace(self.path, self.attempt_id, updated)
                workspace = updated
                self.state["python_pending_drafts"].pop(self.owner, None)
                self.state.pop("python_dirty", None)
                self.state.pop("editor_navigation_error", None)
                # A save-only retry also consumes the original execution event,
                # which the browser may keep returning after the rerun.
                self.state["python_event_id"] = pending_id
                if action == "cancel":
                    cancel_python_job(self.state, self.runner)
                    self.state["python_last_result"] = {"result": {"ok": False, "error": "Cancelled."}}
                    return self._view(workspace, health, rerun=True)
                if action in ("run", "check") and not self.busy:
                    if not health.get("ready"):
                        raise ValueError(health.get("error", "Python runner unavailable."))
                    if (action == "check" and self.exercise["version"] == 2
                            and not validation_record(self.path, self.exercise, health.get("runner_hash"))):
                        raise ValueError("Validate this exercise for the current runtime before checking an answer.")
                    submitted = self.runner.submit(self.attempt_id, workspace["source"], self.exercise, action)
                    self.state["python_job"] = {**submitted, "operation": action}
                    return self._view(workspace, health, rerun=True)
            job = self.state.get("python_job")
            if job:
                try:
                    snapshot = self.state.get("python_completed_result") or self.runner.poll(job["id"])
                except RuntimeError as exc:
                    cancel_python_job(self.state, self.runner)
                    self.state["python_last_result"] = {"result": {"ok": False, "error": str(exc)}}
                    return self._view(workspace, health, rerun=True)
                if snapshot["state"] == "finished":
                    self.state["python_completed_result"] = deepcopy(snapshot)
                    matches = snapshot["attempt_id"] == self.attempt_id and is_current(
                        snapshot, workspace["source"], self.exercise, health.get("runner_hash"))
                    if matches and job["operation"] == "check" and snapshot["result"].get("category") != "cancelled":
                        summary = {k: v for k, v in snapshot["result"].items() if k not in ("stdout", "stderr", "source")}
                        assessed = validate_workspace({**workspace, "assessment": {
                            **{k: snapshot[k] for k in ("source_hash", "exercise_hash", "runner_hash")},
                            "result": summary,
                        }})
                        database.save_python_workspace(self.path, self.attempt_id, assessed)
                        workspace = assessed
                    self.state["python_last_result"] = {**deepcopy(snapshot), **({} if matches else {"outdated": True})}
                    self.state.pop("python_job", None)
                    self.state.pop("python_completed_result", None)
                    return self._view(workspace, health, rerun=True)
                return self._view(workspace, health, job_state=snapshot["state"], rerun=action == "save")
            return self._view(workspace, health, rerun=action == "save")
        except (ValueError, TypeError, OSError, RuntimeError, sqlite3.Error) as exc:
            view = self.view(health)
            return replace(view, error=str(exc))
