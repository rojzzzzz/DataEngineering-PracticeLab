"""The locally bundled Streamlit v2 ERD component."""

from pathlib import Path
import streamlit as st

from src.diagrams import empty_diagram, validate_diagram

ASSETS = Path(__file__).parent / "erd_assets"


def diagram_preview(diagram, key):
    # This transport deliberately exposes no state or event callbacks.
    return _component()(key=key, data=[{"readOnly": True, "diagram": diagram,
                         "documentId": key, "kind": diagram["kind"]}], height="content")


@st.cache_resource
def _component():
    # Register the diagram workspace transport, including attempt return requests.
    return st.components.v2.component(
        "study_helper_erd",
        html='<div class="erd-root"></div>',
        js="/* bundled editor */\n"
        + (ASSETS / "editor.js").read_text(encoding="utf-8"),
        css="/* bundled editor */\n"
        + (ASSETS / "editor.css").read_text(encoding="utf-8")
        + "\n" + (ASSETS.parent / "workspace_identity.css").read_text(encoding="utf-8"),
    )


def erd_editor(attempt_id: int, kind: str, diagram: dict | None):
    value = (
        validate_diagram(diagram, kind) if diagram is not None else empty_diagram(kind)
    )
    result = _component()(
        key=f"erd_{attempt_id}",
        data=[{"documentId": f"attempt:{attempt_id}", "layout": "embedded", "kind": kind, "diagram": value}],
        default={"diagram": value},
        on_diagram_change=lambda: None,
        height="content",
    )
    return result.diagram


def constructor_editor(document_id, diagram, name, saved_diagram, save_error, on_change,
                       sql_import=None, on_sql_import=None):
    key = f"constructor_editor_{document_id}"
    return _component()(
        key=key,
        data=[{"documentId": f"constructor:{document_id}", "layout": "workspace",
              "kind": diagram["kind"], "diagram": diagram, "documentName": name,
              "savedDiagram": saved_diagram, "saveError": save_error, "sqlImport": sql_import}],
        default={"diagram": diagram}, on_diagram_change=on_change,
        on_sql_import_result_change=on_sql_import or (lambda: None), height="content",
    ).diagram


def workspace_editor(identity, key, diagram, name, saved_diagram, save_error, on_change, on_return, sql_import=None, on_busy=None):
    return _component()(
        key=key, data=[{"documentId": identity, "layout": "workspace", "kind": diagram["kind"],
                       "diagram": diagram, "documentName": name, "savedDiagram": saved_diagram,
                       "saveError": save_error, "attemptLinked": True, "sqlImport": sql_import}],
        default={"diagram": diagram, "return_request": None, "busy": False}, on_diagram_change=on_change,
        on_busy_change=on_busy or (lambda: None),
        on_return_request_change=on_return, on_sql_import_result_change=lambda: None, height="content")
