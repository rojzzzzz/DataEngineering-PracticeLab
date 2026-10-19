"""Written draft recovery shared by rendering and navigation.

Widget keys, remounts and partial section cleanup are implementation details.
Callers mount a form, save its answer and flush before accepting navigation.
SQLite persistence is exercised directly with temporary databases in tests.
"""
from __future__ import annotations

import logging
from collections.abc import MutableMapping, Sequence
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from src import database
from src.capstone_models import written_values


@dataclass(frozen=True)
class DraftSave:
    attempt: dict[str, Any]
    failed: bool = False
    conflict: bool = False


@dataclass(frozen=True)
class DraftForm:
    """Widget bindings and current text; changed is a native widget callback."""
    key: str
    confidence_key: str
    fields: tuple[tuple[str, str], ...]
    _drafts: WrittenDrafts
    _attempt_id: int

    @property
    def answer(self) -> str:
        return self._drafts._text(self._attempt_id)

    def changed(self) -> None:
        self._drafts._collect(self._attempt_id)


class WrittenDrafts:
    _fields = ("answer", "confidence", "status", "started_at")

    def __init__(self, state: MutableMapping[str, Any], path: Path | str):
        self.state, self.path = state, path
        self._previous_attempt = state.get("rendered_written_attempt")

    def begin_render(self) -> WrittenDrafts:
        """Detach hidden widgets while remembering the last rendered attempt."""
        self._previous_attempt = self.state.pop("rendered_written_attempt", None)
        return self

    def mount(self, attempt: dict[str, Any], *, sections: Sequence[str] = (),
              written: bool = True) -> DraftForm:
        """Restore text before creating widgets, including failed-save drafts."""
        aid = attempt["attempt_id"]
        key = f"answer_{aid}"
        base = self._base(attempt)
        refreshed = False
        for field, widget_key in (("answer", key), ("confidence", f"confidence_{aid}"), ("status", f"status_{aid}")):
            if self.state.get(widget_key, base[field]) == base[field] and attempt.get(field) != base[field]:
                self.state[widget_key] = attempt.get(field)
                base[field] = attempt.get(field)
                refreshed = refreshed or field == "answer"
        if key not in self.state or (written and self._previous_attempt != aid):
            self.state[key] = self.state.get("pending_answers", {}).get(aid, attempt.get("answer", ""))
        self.state.setdefault(f"confidence_{aid}", attempt.get("confidence"))
        fields = tuple((label, f"capwrite_{aid}_{i}") for i, label in enumerate(sections))
        if fields:
            self.state.setdefault("capstone_written_sections", {})[aid] = tuple(sections)
            parsed = written_values(self.state[key], sections)
            remounted = refreshed or self.state.get("capwrite_owner") != aid or self._previous_attempt != aid
            for label, field_key in fields:
                if remounted or field_key not in self.state:
                    self.state[field_key] = parsed[label]
            self.state["capwrite_owner"] = aid
        # Lab notes need the same save-before-navigation protection as prose.
        self.state["rendered_written_attempt"] = aid
        return DraftForm(key, f"confidence_{aid}", fields, self, aid)

    def _base(self, attempt):
        return self.state.setdefault("written_bases", {}).setdefault(
            attempt["attempt_id"], {field: attempt.get(field) for field in self._fields})

    def _text(self, aid: int) -> str:
        return self.state.get(f"answer_{aid}", self.state.get("pending_answers", {}).get(aid, ""))

    def _collect(self, aid: int) -> str:
        answer = self._text(aid)
        labels = self.state.get("capstone_written_sections", {}).get(aid)
        if labels and self.state.get("capwrite_owner") == aid:
            fallback = written_values(answer, labels)
            values = [self.state.get(f"capwrite_{aid}_{i}", fallback[label]) for i, label in enumerate(labels)]
            answer = "\n\n".join(f"## {label}\n{value}" for label, value in zip(labels, values)) if any(v.strip() for v in values) else ""
            self.state[f"answer_{aid}"] = answer
        return answer

    def save(self, attempt: dict[str, Any], **changes: Any) -> DraftSave:
        """Save changed details; a failed write leaves text recoverable."""
        aid = attempt["attempt_id"]
        base = self._base(attempt)
        changes = {field: value for field, value in changes.items() if field in self._fields and value != base[field]}
        if not changes:
            self.state.get("pending_answers", {}).pop(aid, None)
            self.state.get("written_conflicts", {}).pop(aid, None)
            return DraftSave(attempt)
        updated = {**attempt, **changes}
        updated["updated_at"] = datetime.now(timezone.utc).isoformat(timespec="microseconds")
        try:
            database.save_attempt_details(self.path, updated, {field: base[field] for field in changes})
            # Session-state access can interrupt a Streamlit run. Record our
            # committed values before yielding to a newer widget event.
            base.update(changes)
        except database.AttemptConflict:
            self.state.setdefault("pending_answers", {})[aid] = updated.get("answer", "")
            self.state.setdefault("written_conflicts", {})[aid] = True
            return DraftSave(database.get_attempt(self.path, aid) or attempt, failed=True, conflict=True)
        except Exception:
            logging.exception("Could not save answer")
            self.state.setdefault("pending_answers", {})[aid] = updated.get("answer", "")
            return DraftSave(attempt, failed=True)
        self.state.get("pending_answers", {}).pop(aid, None)
        self.state.get("written_conflicts", {}).pop(aid, None)
        saved = database.get_attempt(self.path, aid)
        return DraftSave(saved)

    def resolve_conflict(self, aid: int, keep_draft: bool) -> None:
        """Rebase an explicit choice; a subsequent save still checks for races."""
        current = database.get_attempt(self.path, aid)
        if current is None:
            return
        base = self._base(current)
        widgets = {"answer": f"answer_{aid}", "confidence": f"confidence_{aid}", "status": f"status_{aid}"}
        for field, key in widgets.items():
            if not keep_draft or self.state.get(key, base[field]) == base[field]:
                self.state[key] = current.get(field)
        base.update({field: current.get(field) for field in self._fields})
        self.state.get("pending_answers", {}).pop(aid, None)
        self.state.get("written_conflicts", {}).pop(aid, None)
        self.state.pop("capwrite_owner", None)

    def flush(self) -> bool:
        """Persist the outgoing form; missing hidden widgets are not deletions."""
        aid = self.state.get("rendered_written_attempt")
        attempt = database.get_attempt(self.path, aid) if aid else None
        if attempt is None:
            return True
        labels = self.state.get("capstone_written_sections", {}).get(aid)
        # Widget callbacks have already assembled edits. If cleanup has started,
        # trust that aggregate rather than interpreting stale hidden values.
        if labels and all(f"capwrite_{aid}_{i}" in self.state for i in range(len(labels))):
            self._collect(aid)
        return not self.save(
            attempt,
            answer=self.state.get(f"answer_{aid}", self.state.get("pending_answers", {}).get(aid, attempt.get("answer", ""))),
            confidence=self.state.get(f"confidence_{aid}", attempt.get("confidence")),
        ).failed

    def accept_navigation(self, attempt: dict[str, Any] | None = None) -> None:
        """Invalidate hidden widgets only after navigation's flush succeeded."""
        self.state.pop("capwrite_owner", None)
        self.state.pop("rendered_written_attempt", None)
        self._previous_attempt = None
        if attempt is not None:
            self.state[f"answer_{attempt['attempt_id']}"] = attempt.get("answer", "")
            self.state[f"confidence_{attempt['attempt_id']}"] = attempt.get("confidence")
            self.state[f"status_{attempt['attempt_id']}"] = attempt.get("status")
            self.state.setdefault("written_bases", {})[attempt["attempt_id"]] = {
                field: attempt.get(field) for field in self._fields}
