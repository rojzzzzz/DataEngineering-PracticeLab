"""Existing SQL editor adapted to saved dataset execution, without grading controls."""
import streamlit as st
from src import database
from src.capstone_sql import DatasetWorkspace
from src.constructor_models import fingerprint


def render_evidence(attempt):
    workspace = attempt.get("capstone_workspace") or {}
    executions = workspace.get("executions", {})
    if not executions:
        st.caption("No saved execution evidence yet. Run each task against the saved dataset.")
        return
    st.markdown("**Saved SQL execution evidence**")
    for task, result in executions.items():
        query = (attempt.get("sql_workspace") or {}).get("drafts", {}).get(task, "")
        current = result["query_hash"] == fingerprint(query) and result["dataset_id"] == workspace.get("dataset_id")
        st.caption(f"{task} · {result['status'].title()} · {'Current' if current else 'Outdated'} · {result['row_count']} rows displayed by the worker")
        with st.expander("Saved result · " + task):
            if not current:
                st.caption("The SQL below is the current draft; this saved output belongs to an earlier query or dataset.")
            st.code(query[:4000], language="sql")
            if result.get("error"):
                st.error(result["error"])
            if result["sample"]:
                import pandas as pd
                labels = [f"{i+1}: {c}" for i, c in enumerate(result["columns"])]
                st.dataframe(pd.DataFrame(result["sample"], columns=labels), hide_index=True, width="stretch")
            else:
                st.caption("Empty output sample. Interpret it; successful execution does not prove correctness.")
            if result["truncated"] or result.get("sample_truncated"):
                st.caption("Bounded evidence only. The worker result or saved sample was truncated.")
    st.caption("Execution status is separate from business correctness. SQL drafts and selected dataset hashes determine currency.")


def render_last(view):
    last = view.last_result
    if not last:
        return
    request, result = last["request"], last["result"]
    st.subheader("Query results · " + request["task_id"])
    if view.result_outdated:
        st.warning("Outdated result. The query changed; run it again.")
    if not result.get("ok"):
        st.error(result.get("error", "Execution failed."))
        return
    st.caption(f"{len(result['rows']):,} rows displayed · {result['elapsed_ms']:.1f} ms execution/fetch · {len(result['columns'])} columns")
    if result.get("truncated"):
        st.warning("Output truncated at 1,000 rows or 2 MB. Display and download contain bounded rows only.")
    with st.expander("Executed SQL and result types"):
        st.code(last["sql"], language="sql")
        st.json(dict(zip(result["columns"], result["types"])))
    import pandas as pd
    labels = [f"{i+1}: {name}" for i, name in enumerate(result["columns"])]
    st.dataframe(pd.DataFrame(result["rows"], columns=labels), hide_index=True, width="stretch")
    if not result["rows"]:
        st.info("Query ran successfully and returned no rows. Interpret this result against the business requirements.")
    import csv
    import io
    content = io.StringIO()
    writer = csv.writer(content)
    writer.writerow(result["columns"])
    writer.writerows(result["rows"])
    st.download_button("Download displayed result", content.getvalue(), "capstone_query.csv", "text/csv")


def render_sql(path, attempt):
    try:
        coordinator = DatasetWorkspace(st.session_state, path, attempt["attempt_id"])
    except (ValueError, OSError) as exc:
        st.error(str(exc))
        return
    st.caption(f"Saved dataset {coordinator.snapshot['dataset_id']} · {sum(len(t['rows']) for t in coordinator.snapshot['data']['tables']):,} complete rows · DuckDB SELECT only")
    from src.sql_ui import schema_browser
    schema_browser(coordinator.exercise)

    @st.fragment(run_every=.3 if coordinator.busy else None)
    def editor():
        from src.sql_component import sql_editor
        try:
            view = coordinator.refresh()
            if view.rerun:
                st.rerun(scope="app")
            event = sql_editor(attempt["attempt_id"], coordinator.exercise, coordinator.editor_hash, view.editor_workspace,
                view.busy, view.active, execution_only=True, saved_workspace=view.saved_workspace,
                on_pending_change=coordinator.mark_pending)
            if event:
                view = coordinator.apply(event)
                if view.rerun:
                    st.rerun(scope="app")
        except Exception as exc:
            st.error("Could not save or execute: " + str(exc))
            return
        if view.error:
            st.error("Could not save or execute: " + view.error)
        for pending, label, message in (
            (view.pending_result, "Retry saving execution evidence", "The finished SQL result is retained. Its evidence save will retry; save it before leaving this stage."),
            (view.pending_draft, "Retry saving SQL draft", "Your SQL draft is retained. Save it before leaving this stage."),
        ):
            if pending:
                st.caption(message)
                if st.button(label, key=f"cap_sql_retry_{attempt['attempt_id']}_{label}"):
                    retried = coordinator.retry()
                    if retried.rerun:
                        st.rerun(scope="app")
                    if retried.error:
                        st.error(retried.error)
        render_last(view)
        render_evidence(database.get_attempt(path, attempt["attempt_id"]))
    editor()
