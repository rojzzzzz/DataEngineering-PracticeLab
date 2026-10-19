"""Locally bundled CodeMirror Streamlit component."""
from pathlib import Path
import streamlit as st
from src.sql_models import ddl


def schema_payload(exercise):
    """Send only bounded visible data, never assessment fixtures or reference SQL."""
    return [{**table, "rowCount": len(exercise["visible_fixture"][table["name"]]),
             "samples": exercise["visible_fixture"][table["name"]][:10]}
            for table in exercise["tables"]]


@st.cache_resource
def _component():
    assets = Path(__file__).parent / "sql_assets"
    return st.components.v2.component("study_helper_sql", html='<div class="sql-root"></div>',
        js="/* bundled SQL editor */\n" + (assets / "editor.js").read_text(encoding="utf-8"),
        css="/* bundled SQL editor */\n" + (assets / "editor.css").read_text(encoding="utf-8")
        + "\n" + (assets.parent / "workspace_identity.css").read_text(encoding="utf-8"))


def sql_editor(attempt_id, exercise, exercise_hash, workspace, busy, active, detective=None, *, execution_only=False, saved_workspace=None, on_pending_change=None, recovery_scope=None):
    key = f"sql_{attempt_id}_{exercise_hash}"
    def pending_changed():
        on_pending_change(bool(getattr(st.session_state.get(key), "pending", False)))
    callbacks = {"on_pending_change": pending_changed} if on_pending_change else {}
    return _component()(key=key, data=[{
        "attemptId": attempt_id, "exerciseHash": exercise_hash, "drafts": workspace["drafts"],
        "savedDrafts": (saved_workspace or workspace)["drafts"], "active": active,
        "tables": schema_payload(exercise), "ddl": ddl(exercise),
        "tasks": exercise["tasks"], "schema": {t["name"]: [c["name"] for c in t["columns"]] for t in exercise["tables"]}, "busy": busy,
        "detective": detective is not None, "notebooks": list((detective or {}).get("notebooks", {})),
        "executionOnly": execution_only,
        "recoveryScope": recovery_scope,
        "notebookTitles": (detective or {}).get("notebook_titles", {}),
    }], default={"event": None, **({"pending": False} if on_pending_change else {})}, on_event_change=lambda: None, height="content", **callbacks).event
