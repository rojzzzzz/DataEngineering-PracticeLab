"""Draft-safe practice transitions, independent of Streamlit rendering.

Callers supply current session state, a challenge bank, and the existing job
cancellation adapter. A rejected transition never cancels work or replaces the
outgoing attempt. SQLite persistence stays behind this module's interface.
"""
from __future__ import annotations

from collections.abc import Callable, Iterable, MutableMapping
from pathlib import Path
from typing import Any, Literal

from src import database
from src.written_drafts import WrittenDrafts
from src.capstone_sql import navigation_safe

Destination = Literal["page", "mode", "attempt", "preview", "exercise", "filters", "reset"]
FILTER_DEFAULTS = {
    "filter_family": "All families", "filter_type": "All types",
    "filter_difficulty": "Any", "filter_minutes": 180,
    "filter_path": "All paths", "filter_completed": False,
    "filter_attempted": True,
}


def restore_filter_settings(state: MutableMapping[str, Any], settings: dict[str, Any]) -> None:
    """Seed missing controls from saved preferences, tolerating older backups."""
    legacy = {"filter_minutes": "maximum_session_time", "filter_path": "last_learning_path",
              "filter_completed": "exclude_completed"}
    for key, default in FILTER_DEFAULTS.items():
        value = settings.get(legacy.get(key,key), settings.get(key, default))
        if key == "filter_minutes":
            valid = type(value) is int and 10 <= value <= 600
        elif key == "filter_difficulty":
            valid = value == "Any" or type(value) is int and 1 <= value <= 5
        else:
            valid = type(value) is type(default)
        state.setdefault(key, value if valid else default)


class PracticeNavigation:
    def __init__(self, state: MutableMapping[str, Any], path: Path | str,
                 challenges: Iterable[dict[str, Any]], cancel_jobs: Callable[[], None]):
        self.state = state
        self.path = path
        self.challenges = {c["id"]: c for c in challenges}
        self.cancel_jobs = cancel_jobs
        self.drafts = WrittenDrafts(state, path)

    def _flush(self) -> bool:
        aid = self.state.get("active_attempt")
        owner = (str(Path(self.path).resolve()), aid)
        for kind, owner_key in (("sql", "sql_owner_context"), ("python", "python_owner")):
            pending = self.state.get(kind + "_pending_drafts", {})
            dirty_owner = self.state.get(owner_key, ())
            if (dirty_owner[:2] == owner and (dirty_owner in pending or self.state.get(kind + "_dirty"))):
                self.state["navigate"] = "Practice"
                if self.state.get("active_challenge"):
                    self.state["sql_challenge_choice"] = self.state["active_challenge"]
                self.state["editor_navigation_error"] = "Save your " + ("SQL" if kind == "sql" else "Python") + " draft before leaving. Retry the failed save or copy your code."
                return False
        self.state.pop("editor_navigation_error", None)
        if (self.state.get("artifact_drafts") or any(self.state.get("artifact_busy", {}).values())
                or not navigation_safe(self.state)):
            self.state["navigate"] = "Practice"
            return False
        if not self.drafts.flush():
            # Navigation widgets have already updated their own values when
            # Streamlit invokes on_change. Keep the outgoing editor reachable.
            self.state["navigate"] = "Practice"
            if self.state.get("active_challenge"):
                self.state["sql_challenge_choice"] = self.state["active_challenge"]
            return False
        return True

    def _invalidate_evaluation(self) -> None:
        session = self.state.get("optional_ai")
        if session:
            request, _, _ = session.snapshot()
            if request and request.operation == "evaluation":
                session.invalidate()

    @staticmethod
    def _mode(challenge: dict[str, Any]) -> str:
        for field, mode in (("data_quality_detective", "Data-quality Detective"),
                            ("python_playground", "Python Practice"),
                            ("sql_playground", "SQL Practice")):
            if challenge.get(field):
                return mode
        return {"SCN": "Daily Scenario", "CASE": "Complete Case Study"}.get(
            challenge["id"].split("-", 1)[0], "Surprise Me")

    def go(self, destination: Destination, value: str | int | None = None) -> bool:
        """Save before changing destination; return False when it cannot open.

        page/mode take a label, attempt takes an ID, preview/exercise take a
        challenge ID; filters/reset take no value. Preview creates no attempt.
        Exercise stays in the current practice mode; preview selects its mode.
        """
        if destination not in ("page", "mode", "attempt", "preview", "exercise", "filters", "reset"):
            raise ValueError(f"Unknown navigation destination: {destination}")
        attempt = None
        challenge = None
        if destination == "attempt":
            attempt = database.get_attempt(self.path, value)
            challenge = self.challenges.get(attempt["challenge_id"]) if attempt else None
            if attempt and attempt.get("project_run_id"):
                from src.capstone_store import get_run
                run = get_run(self.path, attempt["project_run_id"])
                challenge = run["challenges"][attempt["project_stage_id"]]
                self.challenges[challenge["id"]] = challenge
            if challenge is None:
                return False
        elif destination in ("preview", "exercise"):
            challenge = self.challenges.get(value)
            if challenge is None:
                return False
        elif destination in ("page", "mode") and not isinstance(value, str):
            raise ValueError("Page and mode navigation require a label")
        if not self._flush():
            return False
        if attempt is not None:
            # Reopening the outgoing attempt must use the draft just flushed,
            # not the snapshot used above to validate the destination.
            attempt = database.get_attempt(self.path, attempt["attempt_id"])
            if attempt is None:
                return False
        self.drafts.accept_navigation(attempt)
        if destination in ("filters", "reset"):
            self._invalidate_evaluation()
        else:
            self.cancel_jobs()
        if self.state.pop("direct_preview", None):
            self.state.pop("active_challenge", None)
        if challenge and challenge.get("capstone") and attempt is None:
            self.state.update(navigate="Practice", mode="Connected Capstone",
                              capstone_definition=challenge["capstone"]["definition_id"],
                              capstone_preview_stage=challenge["capstone"]["stage_id"])
            self.state.pop("capstone_run", None)
            self.state.pop("active_attempt", None)
            self.state.pop("active_challenge", None)
            return True
        if destination == "page":
            self.state["navigate"] = value
            if self.state.get("attempt_constructor"):
                self.state.pop("attempt_constructor", None)
                from src.constructor_ui import close_constructor_tool
                close_constructor_tool()
        elif destination == "mode":
            self.state["mode"] = value
            self.state.pop("active_challenge", None)
            self.state.pop("active_attempt", None)
        elif destination in ("attempt", "preview", "exercise"):
            cid = challenge["id"]
            self.state["active_challenge"] = cid
            self.state["sql_challenge_choice"] = cid
            if destination != "exercise":
                self.state["navigate"] = "Practice"
                self.state["mode"] = self._mode(challenge)
            if attempt is not None:
                self.state["active_attempt"] = attempt["attempt_id"]
            else:
                self.state.pop("active_attempt", None)
                if destination == "preview":
                    self.state["direct_preview"] = cid
        elif destination == "reset":
            self.state.update(FILTER_DEFAULTS)
            self.state.update(catalog_search="", catalog_status="All statuses", catalog_page=1)
            self.state.pop("catalog_choice", None)
        return True
