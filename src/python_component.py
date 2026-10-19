"""Locally bundled Python CodeMirror component."""
from pathlib import Path
import streamlit as st


@st.cache_resource
def _component():
    assets = Path(__file__).parent / "python_assets"
    return st.components.v2.component("study_helper_python", html='<div class="python-root"></div>',
        js=(assets / "editor.js").read_text(encoding="utf-8"),
        css=(assets / "editor.css").read_text(encoding="utf-8")
        + "\n" + (assets.parent / "workspace_identity.css").read_text(encoding="utf-8"))


def python_editor(attempt_id, exercise_hash, source, starter, busy, ready, assessed_source, check_ready=True, *, on_pending_change=None):
    key = f"python_{attempt_id}"
    def pending_changed():
        on_pending_change(bool(getattr(st.session_state.get(key), "pending", False)))
    callbacks = {"on_pending_change": pending_changed} if on_pending_change else {}
    return _component()(key=key, data=[{
        "attemptId": attempt_id, "exerciseHash": exercise_hash, "source": source,
        "checkReady": check_ready, "starter": starter, "busy": busy, "ready": ready, "assessedSource": assessed_source,
    }], default={"event": None, "pending": False}, on_event_change=lambda: None, height="content", **callbacks).event
