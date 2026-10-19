"""SQL UI integration. Private fixtures and reference SQL stay on the server."""
from __future__ import annotations

import csv
import io
import json
import streamlit as st

from src.sql_component import sql_editor
from src.sql_models import ddl, fingerprint
from src.sql_runner import SQLJob
from src.sql_workspace import SQLWorkspace, cancel_sql_jobs


def stop_sql_job():
    cancel_sql_jobs(st.session_state)


def schema_browser(exercise):
    with st.expander(f"Dataset reference · {len(exercise['tables'])} tables · schema, samples & DDL", expanded=False):
        st.caption("Explore the supplied practice data. The editor also keeps the schema beside your query.")
        tables = {table["name"]: table for table in exercise["tables"]}
        name = st.selectbox("Browse a table", list(tables), key="sql_schema_" + fingerprint(exercise)[:12])
        table = tables[name]
        rows = exercise["visible_fixture"][name]
        st.write(table["description"])
        st.caption(f"{len(rows):,} supplied rows · {len(table['columns'])} columns · DuckDB")
        structure, samples, definition = st.tabs(["Columns & keys", "Sample data", "Schema DDL"])
        with structure:
            st.dataframe([{"Column": c["name"], "Type": c["type"], "Nullable": "Yes" if c["nullable"] else "No", "Documented key": c.get("key", "") or "—"} for c in table["columns"]], hide_index=True, width="stretch")
        with samples:
            if rows:
                st.dataframe([dict(zip([c["name"] for c in table["columns"]], row)) for row in rows[:25]], hide_index=True, width="stretch")
                st.caption(f"Showing {min(25, len(rows))} of {len(rows)} rows.")
            else:
                st.info("This table has no rows in the visible fixture.")
        with definition:
            schema = ddl(exercise)
            st.code(schema, language="sql")
            st.download_button("Download schema DDL", schema, "exercise_schema.sql", "text/plain")


def render_workspace(database, attempt, exercise, detective=False):
    aid = attempt["attempt_id"]
    coordinator = SQLWorkspace(st.session_state, database, aid, exercise,
                               detective=detective, start_job=SQLJob)
    older = [p for owner, p in st.session_state.get("sql_pending_drafts", {}).items()
             if owner[:2] == coordinator.owner[:2] and owner != coordinator.owner]
    if older:
        st.warning("An unsaved SQL draft belongs to an earlier version of this exercise. Download it before ending this session; review it before copying it into the current tasks.")
        st.download_button("Download earlier SQL drafts", json.dumps([{
            **p["workspace"]["drafts"], **(p.get("investigation") or {}).get("notebooks", {})} for p in older], ensure_ascii=False, indent=2),
            file_name="earlier-sql-drafts.json", mime="application/json", key=f"sql_earlier_{aid}")

    @st.fragment(run_every=0.3 if coordinator.busy else None)
    def workspace_fragment():
        view = coordinator.refresh()
        if view.rerun:
            st.rerun(scope=view.rerun)
        if view.error:
            st.error(view.error)
            return
        event = sql_editor(aid, exercise, view.exercise_hash, view.editor_workspace,
                           view.busy, view.active, view.detective_workspace,
                           saved_workspace={"drafts": {**view.workspace["drafts"], **(view.detective_workspace or {}).get("notebooks", {})}},
                           on_pending_change=coordinator.mark_pending, recovery_scope=fingerprint(coordinator.owner))
        pending_before = view.pending_save
        if pending_before and st.button("Retry saving SQL draft", key=f"sql_save_retry_{aid}"):
            event = None
        if event or pending_before:
            view = coordinator.apply(event)
            if view.rerun:
                st.rerun(scope=view.rerun)
            if view.error:
                st.error(view.error)
        if view.pending_save:
            st.caption("Save failed · Your SQL draft remains in this session. Retry saving before leaving.")
            st.download_button("Download recoverable SQL drafts", json.dumps(view.editor_workspace["drafts"], ensure_ascii=False, indent=2),
                               file_name="sql-drafts.json", mime="application/json", key=f"sql_recovery_{aid}")
            if not pending_before:
                st.button("Retry saving SQL draft", key=f"sql_save_retry_{aid}")
        assessment = view.workspace.get("assessment")
        if assessment:
            st.markdown("**Correctness checks" + (" · Outdated**" if view.assessment_outdated else "**"))
            titles = {t["id"]: t["title"] for t in exercise["tasks"]}
            st.dataframe([{"Answer": titles.get(k, k), "Result": "Passed" if v == "passed" else "Failed", "Category": v} for k, v in assessment["results"].items()], hide_index=True, width="stretch")
            st.caption("Assessment-style feedback. Checks do not award rubric points for reasoning or production performance.")
        last = view.last_result
        if not last:
            st.caption("Results appear here after Run. Use the dataset explorer to insert a SELECT, or write your own query. Nothing executes while you type.")
            return
        result = last["result"]
        if not result.get("ok"):
            st.error(result["error"])
        elif last["operation"] in ("run", "explain"):
            revision = fingerprint(last["sql"])[:8]
            title = next((t["title"] for t in exercise["tasks"] if t["id"] == last["active"]), "Notebook" if detective else "Scratch")
            st.subheader("Execution plan" if last["operation"] == "explain" else "Query results")
            st.caption(f"{title} · revision {revision}")
            if view.result_outdated:
                st.warning("Outdated result — the query or exercise has changed. Run again to refresh.")
            cols = st.columns(3)
            cols[0].metric("Rows displayed", f"{len(result['rows']):,}")
            cols[1].metric("Execution time", f"{result['elapsed_ms']:.1f} ms", help="Query execution and result fetch time; excludes worker startup and fixture preparation.")
            cols[2].metric("Columns", len(result["columns"]))
            with st.expander("Executed SQL & result types"):
                st.code(last["sql"], language="sql")
                st.dataframe([{"Column": n, "Type": t} for n, t in zip(result["columns"], result["types"])], hide_index=True, width="stretch")
            if result["truncated"]:
                st.warning("Result truncated at 1,000 rows or 2 MB. Download contains only the displayed rows.")
            if last["operation"] == "explain":
                st.code("\n".join(str(cell) for row in result["rows"] for cell in row), language="text")
            else:
                # Positional columns preserve duplicate names in arbitrary scratch queries.
                import pandas as pd
                names = result["columns"]
                labels = names if len(set(names)) == len(names) else [f"{i+1}: {name}" for i, name in enumerate(names)]
                frame = pd.DataFrame(result["rows"], columns=labels)
                st.dataframe(frame, hide_index=True, width="stretch")
                if not result["rows"]:
                    st.info("Query completed successfully and returned no rows.")
            contents = io.StringIO()
            writer = csv.writer(contents)
            writer.writerow(result["columns"])
            writer.writerows(result["rows"])
            st.download_button("Download displayed result", contents.getvalue(), "query_result.csv", "text/csv")
    workspace_fragment()
