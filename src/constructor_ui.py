"""Constructor shell and the first independently saved tool."""
from dataclasses import dataclass
from html import escape
from pathlib import Path
from typing import Callable
import re
import streamlit as st

KINDS = {"Logical ERD": "logical_erd", "Conceptual ERD": "conceptual_erd", "Star Schema": "star_schema"}


def persist_draft(path, document_id, diagram):
    from src import constructor_store as store

    drafts = st.session_state.setdefault("constructor_drafts", {})
    errors = st.session_state.setdefault("constructor_errors", {})
    drafts[document_id] = diagram
    try:
        store.save_diagram(path, document_id, diagram)
        drafts.pop(document_id, None)
        errors.pop(document_id, None)
    except Exception as exc:
        errors[document_id] = str(exc)


def render_diagram_maker(path):
    from src import constructor_store as store
    from src.erd_component import constructor_editor

    store.init_constructor(path)
    drafts = st.session_state.setdefault("constructor_drafts", {})
    errors = st.session_state.setdefault("constructor_errors", {})
    documents = store.list_diagrams(path)
    ids = [doc["document_id"] for doc in documents]
    active = st.session_state.get("constructor_active")
    if active not in ids:
        active = ids[0] if ids else None
        st.session_state.constructor_active = active
    blocked = bool(drafts)
    names = {doc["document_id"]: doc["name"] for doc in documents}

    def select_document():
        st.session_state.constructor_active = st.session_state.constructor_picker

    if ids:
        st.session_state.constructor_picker = active
        st.sidebar.selectbox("Saved diagrams", ids, format_func=lambda value: names[value],
                             key="constructor_picker", on_change=select_document, disabled=blocked)
    with st.sidebar.container(key="constructor_new_diagram"):
        if st.button("New diagram", disabled=blocked, use_container_width=True):
            st.session_state.constructor_new = True
    if not ids or st.session_state.get("constructor_new"):
        with st.form("constructor_new_form"):
            st.subheader("New diagram")
            name = st.text_input("Diagram name", max_chars=200)
            kind = st.selectbox("Diagram type", list(KINDS))
            st.caption("Logical ERD: tables and keys · Conceptual ERD: business entities · Star Schema: facts and dimensions")
            create = st.form_submit_button("Create diagram", disabled=blocked)
        if create:
            try:
                st.session_state.constructor_active = store.create_diagram(path, name, KINDS[kind])
                st.session_state.constructor_new = False
                st.rerun()
            except (ValueError, OSError) as exc:
                st.error(str(exc))
        if ids and st.button("Cancel new diagram"):
            st.session_state.constructor_new = False
            st.rerun()
    with st.sidebar.container(key="constructor_import_diagram"):
        with st.expander("Import diagram"):
            uploaded = st.file_uploader("Diagram JSON", type=["json"], key="constructor_import", disabled=blocked)
            if st.button("Import as new diagram", disabled=blocked or uploaded is None):
                try:
                    st.session_state.constructor_active = store.import_document(path, uploaded.getvalue(), uploaded.name)
                    st.session_state.constructor_new = False
                    st.rerun()
                except (ValueError, TypeError, UnicodeError) as exc:
                    st.error(f"Could not import diagram: {exc}")
    if active is None:
        st.info("Create a named diagram or import a JSON file to start building.")
        return
    document = store.load_diagram(path, active)
    diagram = drafts.get(active, document["diagram"])
    if active in errors:
        st.error(f"Save failed: {errors[active]}. Your draft remains in this session. Retry before switching diagrams.")
        if st.button("Retry save"):
            persist_draft(path, active, diagram)
            st.rerun()
    with st.container(key="constructor_document"):
        right, left, middle = st.columns([3, 1, 1], vertical_alignment="center")
        right.subheader(document["name"])
    with left.popover("Manage diagram"):
        with st.form(f"rename_{active}"):
            name = st.text_input("Name", document["name"], max_chars=200)
            if st.form_submit_button("Rename", disabled=blocked):
                try:
                    store.rename_diagram(path, active, name)
                    st.rerun()
                except ValueError as exc:
                    st.error(str(exc))
        if st.button("Duplicate diagram", disabled=blocked):
            st.session_state.constructor_active = store.duplicate_diagram(path, active)
            st.rerun()
        confirm = st.checkbox("Confirm permanent deletion", key=f"delete_confirm_{active}", disabled=blocked)
        if st.button("Delete diagram", disabled=blocked or not confirm):
            store.delete_diagram(path, active)
            st.session_state.constructor_active = None
            st.rerun()
    try:
        exported = store.export_document(document["name"], diagram)
    except ValueError:
        exported = None  # Incomplete typing remains editable until it validates.
    filename = re.sub(r"[^\w.-]+", "_", document["name"]).strip("._") or "diagram"
    middle.download_button("Download JSON", exported or "", disabled=exported is None,
                           file_name=f"{filename}.json", mime="application/json")
    kind_label = next((label for label, value in KINDS.items() if value == diagram["kind"]), "Diagram")
    right.caption("Save failed" if active in errors else kind_label)

    dialects = {"PostgreSQL": "postgres", "MySQL": "mysql", "SQL Server": "tsql",
                "SQLite": "sqlite", "DuckDB": "duckdb", "BigQuery": "bigquery",
                "Snowflake": "snowflake", "Spark": "spark"}

    def submit_sql():
        # Record the explicit action before component autosaves can interrupt
        # rendering. The editor merges these tables into its latest local draft.
        from uuid import uuid4
        from src.diagram_sql import parse_create_tables
        st.session_state.pop(f"constructor_sql_result_{active}", None)
        try:
            source = st.session_state[f"constructor_sql_text_{active}"]
            dialect = st.session_state[f"constructor_sql_dialect_{active}"]
            st.session_state[f"constructor_sql_command_{active}"] = {
                "id": uuid4().hex, "tables": parse_create_tables(source, dialects[dialect])}
        except ValueError as exc:
            st.session_state[f"constructor_sql_result_{active}"] = {"error": str(exc)}

    with st.expander("Add tables from SQL"):
        with st.form(f"constructor_sql_form_{active}"):
            st.selectbox("SQL dialect", list(dialects), key=f"constructor_sql_dialect_{active}")
            st.text_area("CREATE TABLE SQL", height=180, max_chars=200_000,
                               placeholder="CREATE TABLE customers (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(200)\n);",
                               key=f"constructor_sql_text_{active}")
            st.caption("Add one or more table definitions with columns, types and PK/FK markers. IF NOT EXISTS skips existing names; IF EXISTS is accepted as the same shortcut.")
            st.form_submit_button("Add tables to diagram",
                                  disabled=blocked or bool(st.session_state.get(f"constructor_sql_command_{active}")),
                                  on_click=submit_sql)
        result = st.session_state.get(f"constructor_sql_result_{active}")
        if result:
            (st.error if result.get("error") else st.success)(result.get("error") or result["message"])

    def changed():
        value = st.session_state[f"constructor_editor_{active}"].diagram
        if value is not None:
            persist_draft(path, active, value)

    def sql_imported():
        result = st.session_state[f"constructor_editor_{active}"].sql_import_result
        command = st.session_state.get(f"constructor_sql_command_{active}")
        if command and result and result.get("id") == command["id"]:
            st.session_state[f"constructor_sql_result_{active}"] = result
            st.session_state.pop(f"constructor_sql_command_{active}", None)

    constructor_editor(active, diagram, document["name"], document["diagram"], errors.get(active), changed,
                       st.session_state.get(f"constructor_sql_command_{active}"), sql_imported)


def render_sql_tools(path):
    from src.sql_tools_component import render_sql_tools as render

    render(path)


def render_mock_data(path):
    from src.mock_ui import render_mock_data as render

    render(path)


def render_pipeline(path):
    from src.pipeline_component import render_pipeline as render

    render(path)


def close_sql_tools_workspace():
    from src.sql_tools_component import close_sql_tools

    close_sql_tools()


def close_mock_workspace():
    from src.mock_ui import close_mock_data

    close_mock_data()


@dataclass(frozen=True)
class Tool:
    id: str
    label: str
    description: str
    render: Callable
    cleanup: Callable | None = None


TOOLS = (
    Tool("diagram-maker", "Diagram Maker", "Design conceptual ERDs, logical ERDs, and star schemas.", render_diagram_maker),
    Tool("sql-playground", "SQL Playground & Formatter", "Format and convert SQL, visualize queries, and inspect PostgreSQL EXPLAIN plans.", render_sql_tools, close_sql_tools_workspace),
    Tool("mock-data", "Mock Data Generator", "Define related tables, preview realistic values, and download reproducible datasets.", render_mock_data, close_mock_workspace),
    Tool("pipeline-designer", "Pipeline Designer", "Sketch data pipelines, describe engineering decisions, and export a build specification.", render_pipeline),
)


def close_constructor_tool():
    selected = next((tool for tool in TOOLS if tool.id == st.session_state.get("constructor_tool")), None)
    if selected and selected.cleanup:
        selected.cleanup()
    # Also recover orphaned workspace state after an interrupted navigation.
    if any(key.startswith("sql_tools_") for key in st.session_state):
        close_sql_tools_workspace()
    if "mock_workspace" in st.session_state:
        close_mock_workspace()
    st.session_state.pop("constructor_tool", None)


def constructor_navigation(page):
    previous = st.session_state.get("constructor_previous_page")
    if previous != page:
        close_constructor_tool()
    st.session_state.constructor_previous_page = page


def render_constructor(path):
    st.markdown("<style>" + (Path(__file__).parent / "constructor.css").read_text(encoding="utf-8") + "</style>", unsafe_allow_html=True)
    selected = st.session_state.get("constructor_tool")
    tool = next((item for item in TOOLS if item.id == selected), None)
    if selected and tool is None:
        close_constructor_tool()
        st.rerun()
    st.markdown(
        "<div class='constructor-context'><span>Practice Lab / Constructor Mode</span>"
        f"<span class='constructor-context-detail'>{escape(tool.label) if tool else 'Main'}</span></div>",
        unsafe_allow_html=True,
    )
    st.title(tool.label if tool else "Constructor Mode")
    st.caption(tool.description if tool else "Build models, inspect SQL, generate datasets, and design pipelines. Choose a tool to open its workspace.")
    if not selected:
        st.caption("Standalone diagrams and pipeline projects save locally. Export their JSON separately to back them up; practice-progress backups do not include them.")
        from src.sql_tools_component import prewarm_sql_tools

        prewarm_sql_tools()
        tool_details = {
            "diagram-maker": ("Data modeling", "Conceptual ERD / Logical ERD / Star schema", "Saved diagrams · JSON export"),
            "sql-playground": ("SQL utilities", "Format / Convert / Visualize / EXPLAIN", "Temporary workspace · SQL export"),
            "mock-data": ("Data generation", "Related tables / Preview / Reproducible datasets", "Saved recipes · Dataset and recipe export"),
            "pipeline-designer": ("Pipeline design", "Canvas / Engineering decisions / Build specification", "Saved projects · Specification export"),
        }
        with st.container(key="constructor_launcher"):
            st.markdown("<h2 class='constructor-section'>Workspace tools</h2>",unsafe_allow_html=True)
            columns = st.columns(2, gap="medium")
            for index, tool in enumerate(TOOLS):
                category, capabilities, persistence = tool_details[tool.id]
                with columns[index % 2].container(border=True, key=f"constructor_tool_{tool.id}"):
                    st.markdown(f"<p class='constructor-category'>{escape(category)}</p>",unsafe_allow_html=True)
                    st.subheader(tool.label)
                    st.markdown(f"<p class='constructor-tool-copy'>{escape(tool.description)}</p>",unsafe_allow_html=True)
                    st.markdown(f"<p class='constructor-capabilities'>{escape(capabilities)}</p>",unsafe_allow_html=True)
                    st.button(f"Open {tool.label}", key=f"open_{tool.id}", use_container_width=True, on_click=open_constructor_tool, args=(tool.id,))
                    st.caption(persistence)
        return
    with st.sidebar.container(key="constructor_back_to_tools"):
        if st.button("Back to tools", disabled=bool(st.session_state.get("constructor_drafts"))):
            close_constructor_tool()
            st.rerun()
    with st.container(key="constructor_workspace"):
        tool.render(path)


def open_constructor_tool(tool_id):
    st.session_state.constructor_tool = tool_id
