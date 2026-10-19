"""SQL draft, execution and assessment coordination without Streamlit.

The rendering adapter reads a view and applies editor events. This module owns
event replay, save-before-run ordering, execution ownership and freshness.
"""
from __future__ import annotations

from collections.abc import Callable, MutableMapping
from copy import deepcopy
from dataclasses import dataclass, replace
from pathlib import Path
import sqlite3
from typing import Any, Literal

from src import database
from src.detective_models import new_detective_workspace, validate_detective_workspace
from src.sql_models import answer_hash, fingerprint, new_workspace, validate_workspace


def cancel_sql_jobs(state: MutableMapping[str, Any]) -> None:
    """Cancel query and Detective profile work when leaving their workspace."""
    for key in ("sql_job", "detective_profile_job"):
        pending = state.pop(key, None)
        if pending is not None:
            (pending["job"] if isinstance(pending, dict) else pending).cancel()


@dataclass(frozen=True)
class WorkspaceView:
    workspace: dict
    detective_workspace: dict | None
    active: str
    busy: bool
    exercise_hash: str
    last_result: dict | None = None
    assessment_outdated: bool = False
    result_outdated: bool = False
    error: str | None = None
    rerun: Literal["app", "fragment"] | None = None
    pending_workspace: dict | None = None
    pending_investigation: dict | None = None

    @property
    def pending_save(self) -> bool:
        return self.pending_workspace is not None

    @property
    def editor_workspace(self) -> dict:
        workspace = self.pending_workspace or self.workspace
        investigation = self.pending_investigation or self.detective_workspace
        return {**workspace, "drafts": {
            **workspace["drafts"],
            **(investigation or {}).get("notebooks", {}),
        }}


class SQLWorkspace:
    def __init__(self, state: MutableMapping[str, Any], path: Path | str,
                 attempt_id: int, exercise: dict, *, detective: bool = False,
                 start_job: Callable[..., Any]):
        self.state, self.path = state, path
        self.attempt_id, self.exercise = attempt_id, exercise
        self.detective, self.start_job = detective, start_job
        self.exercise_hash = fingerprint(exercise)
        self.owner = (str(Path(path).resolve()), attempt_id, self.exercise_hash, detective)
        if state.get("sql_owner_context") != self.owner:
            cancel_sql_jobs(state)
            state["sql_owner"] = attempt_id  # Also used by Detective evidence.
            state["sql_owner_context"] = self.owner
            for key in ("sql_last_result", "sql_event_id", "sql_request"):
                state.pop(key, None)
            state.pop("sql_dirty", None)
            state["sql_active"] = "notebook_1" if detective else exercise["tasks"][0]["id"]

    @property
    def busy(self) -> bool:
        return self.state.get("sql_owner_context") == self.owner and self.state.get("sql_job") is not None

    def mark_pending(self, pending):
        if self.state.get("sql_owner_context") == self.owner:
            self.state["sql_dirty"] = bool(pending)

    def _view(self, workspace: dict, detective_workspace: dict | None, **changes) -> WorkspaceView:
        assessment = workspace.get("assessment")
        owned = self.state.get("sql_owner_context") == self.owner
        pending = self.state.get("sql_pending_drafts", {}).get(self.owner) if owned else None
        last = deepcopy(self.state.get("sql_last_result")) if owned else None
        authored = pending["workspace"] if pending else workspace
        drafts = {**authored["drafts"], **((pending.get("investigation") if pending else detective_workspace) or {}).get("notebooks", {})}
        return WorkspaceView(
            workspace=workspace, detective_workspace=detective_workspace,
            active=pending["event"]["active"] if pending else self.state["sql_active"] if owned else self.exercise["tasks"][0]["id"],
            busy=self.busy, exercise_hash=self.exercise_hash,
            pending_workspace=deepcopy(pending["workspace"]) if pending else None,
            pending_investigation=deepcopy(pending.get("investigation")) if pending else None,
            last_result=last,
            assessment_outdated=bool(assessment and (
                assessment["exercise_hash"] != self.exercise_hash
                or assessment["query_hash"] != answer_hash(self.exercise, authored["drafts"]))),
            result_outdated=bool(last and last.get("operation") in ("run", "explain") and (
                last["exercise_hash"] != self.exercise_hash
                or last["drafts"].get(last["active"]) != drafts.get(last["active"]))),
            **changes,
        )

    def refresh(self) -> WorkspaceView:
        """Read current drafts and consume a completed job for this owner only."""
        if self.state.get("sql_owner_context") != self.owner:
            return self._view(new_workspace(self.exercise), None, error="Workspace changed. Reopen the exercise.")
        current = database.get_attempt(self.path, self.attempt_id)
        if current is None:
            cancel_sql_jobs(self.state)
            return self._view(new_workspace(self.exercise), None, error="Attempt no longer exists.")
        workspace = validate_workspace(current.get("sql_workspace") or new_workspace(self.exercise))
        for key, text in new_workspace(self.exercise)["drafts"].items():
            workspace["drafts"].setdefault(key, text)
        investigation = validate_detective_workspace(
            current.get("detective_workspace") or new_detective_workspace()
        ) if self.detective else None
        job = self.state.get("sql_job")
        if job is None or job.result is None:
            return self._view(workspace, investigation)
        request = self.state.get("sql_request", {})
        if (request.get("attempt_id") != self.attempt_id
                or request.get("exercise_hash") != self.exercise_hash):
            cancel_sql_jobs(self.state)
            self.state.pop("sql_request", None)
            return self._view(workspace, investigation, rerun="app")
        result = deepcopy(job.result)
        if request["operation"] == "check" and result.get("ok"):
            assessed = {**workspace, "assessment": {
                "exercise_hash": request["exercise_hash"],
                "query_hash": request["query_hash"], "results": result["results"],
            }}
            try:
                database.save_sql_workspace(self.path, self.attempt_id, assessed)
            except (OSError, sqlite3.Error) as exc:
                return self._view(workspace, investigation, error=str(exc))
            workspace = assessed
        self.state["sql_last_result"] = {**request, "result": result}
        self.state.pop("sql_job", None)
        return self._view(workspace, investigation, rerun="app")

    def apply(self, event: dict | None) -> WorkspaceView:
        """Validate and persist an editor event before any execution starts.

        Events are consumed only after persistence succeeds, allowing failed
        saves to be retried. Every event must identify its attempt and exercise
        revision, including events retained by the browser across rerenders.
        """
        view = self.refresh()
        if view.error or view.rerun:
            return view
        pending = self.state.get("sql_pending_drafts", {}).get(self.owner)
        if not event and pending:
            event = {**pending["event"], "action": "save"}
        if not event:
            return view
        if event.get("id") == self.state.get("sql_event_id"):
            return view
        try:
            if (event.get("attemptId") != self.attempt_id
                    or event.get("exerciseHash") != self.exercise_hash):
                raise ValueError("Ignored an event from a previous exercise.")
            incoming = event.get("drafts") or {}
            if not isinstance(incoming, dict):
                raise ValueError("Invalid SQL drafts")
            notebook_ids = set((view.detective_workspace or {}).get("notebooks", {}))
            updated = validate_workspace({
                "version": 1, "drafts": {k: v for k, v in incoming.items() if k not in notebook_ids},
                "assessment": view.workspace.get("assessment"),
            })
            expected = {t["id"] for t in self.exercise["tasks"]} | (
                notebook_ids if self.detective else {"scratch"})
            if not expected.issubset(incoming):
                raise ValueError("Answer tabs are missing from the draft")
            active = event.get("active")
            if active not in expected:
                raise ValueError("Unknown answer tab")
            investigation = view.detective_workspace
            if investigation is not None:
                investigation = validate_detective_workspace({
                    **investigation, "notebooks": {k: incoming[k] for k in notebook_ids},
                })
            action = event.get("action")
            if action not in ("save", "run", "explain", "check", "cancel"):
                raise ValueError("Unknown SQL editor action")
            self.state.setdefault("sql_pending_drafts", {})[self.owner] = {
                "workspace": deepcopy(updated), "investigation": deepcopy(investigation), "event": deepcopy(event)}
            if updated != view.workspace:
                database.save_sql_workspace(self.path, self.attempt_id, updated)
            if investigation != view.detective_workspace:
                database.save_detective_workspace(self.path, self.attempt_id, investigation)
            self.state["sql_pending_drafts"].pop(self.owner, None)
            self.state.pop("sql_dirty", None)
            self.state.pop("editor_navigation_error", None)
            self.state["sql_active"] = active
            rerun = None
            if action == "cancel":
                cancel_sql_jobs(self.state)
                self.state["sql_last_result"] = {
                    "operation": "cancel", "result": {"ok": False, "error": "Cancelled."},
                }
                rerun = "app"
            elif action in ("run", "explain", "check") and not self.busy:
                cancel_sql_jobs(self.state)
                selection = event.get("selection", "")
                query = selection if isinstance(selection, str) and selection.strip() else incoming[active]
                request = {
                    "attempt_id": self.attempt_id, "operation": action, "active": active, "sql": query,
                    "drafts": dict(incoming), "query_hash": answer_hash(self.exercise, updated["drafts"]),
                    "exercise_hash": self.exercise_hash,
                }
                job = self.start_job(self.exercise, action, sql=query, drafts=updated["drafts"])
                self.state["sql_request"] = request
                self.state["sql_job"] = job
                rerun = "app"
            elif action == "save":
                rerun = "fragment"
            self.state["sql_event_id"] = event.get("id")
            return self._view(updated, investigation, rerun=rerun)
        except (ValueError, TypeError, OSError, RuntimeError, sqlite3.Error) as exc:
            # Keep the event retryable and return the latest persisted drafts.
            return replace(self.refresh(), error=str(exc))
