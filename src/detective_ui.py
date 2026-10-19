"""Investigation navigation, bounded profiles, student findings and evidence."""
from __future__ import annotations

import streamlit as st

from src.database import get_attempt, save_detective_workspace
from src.detective_models import (
    evidence_is_current,
    new_detective_workspace,
    reopen_evidence_in_notebook,
    validate_detective_workspace,
)
from src.sql_models import fingerprint, public_exercise
from src.sql_runner import SQLJob
from src.sql_ui import render_workspace, schema_browser, stop_sql_job
from src.sql_workspace import SQLWorkspace


def render_detective(database, attempt, challenge):
    exercise = challenge["sql_playground"]
    meta = challenge["data_quality_detective"]
    aid = attempt["attempt_id"]
    # Establish ownership before a section starts profiling or reopens evidence.
    SQLWorkspace(st.session_state, database, aid, exercise, detective=True, start_job=SQLJob)
    workspace = validate_detective_workspace(attempt.get("detective_workspace") or new_detective_workspace())
    st.caption("Data-quality Detective · inspect sources, document findings, verify repairs")
    section = st.radio("Investigation sections", ["Case brief", "Investigate", "Findings", "Repair and submit"], horizontal=True, key=f"detective_section_{aid}")
    if section == "Case brief":
        st.subheader("Case brief")
        st.info(meta["symptom"], icon="🔎")
        with st.container(border=True):
            st.markdown("**Business context**")
            st.write(meta["business_context"])
            st.markdown("**Documented rules**")
            st.write(meta["business_rules"])
        with st.expander("Supplied evidence and lineage", expanded=True):
            st.code(meta["supplied_evidence"], language="sql" if "SELECT" in meta["supplied_evidence"] else "text")
        schema_browser(exercise)
    elif section in ("Investigate", "Repair and submit"):
        if section == "Investigate":
            st.subheader("Investigate")
            st.caption("Explore source rows in SQL studio. Profiles describe the data without identifying defects.")
            names = [t["name"] for t in exercise["tables"]]
            selected = st.selectbox("Profile source table", names, key=f"profile_table_{aid}")
            cache_key = (fingerprint({"tables": exercise["tables"], "visible_fixture": exercise["visible_fixture"]}), selected)
            cache = st.session_state.setdefault("detective_profiles", {})
            if st.button("Profile table", key=f"profile_{aid}", type="secondary"):
                stop_sql_job()
                if cache_key not in cache:
                    st.session_state.detective_profile_job = {"key": cache_key, "job": SQLJob(exercise, "profile", table=selected)}
                    st.rerun()
            profile_job = st.session_state.get("detective_profile_job")

            @st.fragment(run_every=0.3 if profile_job else None)
            def profile_panel():
                pending = st.session_state.get("detective_profile_job")
                if pending and pending["job"].result is not None:
                    st.session_state.pop("detective_profile_job", None)
                    result = pending["job"].result
                    if result.get("ok"):
                        cache[pending["key"]] = result
                    else:
                        st.session_state.detective_profile_error = (pending["key"], result.get("error", "Profile failed."))
                    st.rerun()
                if pending:
                    st.info("Profiling source table…")
                    if st.button("Cancel profile", key=f"profile_cancel_{aid}"):
                        stop_sql_job()
                        st.rerun()
                result = cache.get(cache_key)
                if result is None and st.session_state.get("detective_profile_error", (None,))[0] == cache_key:
                    st.error(st.session_state.detective_profile_error[1])
                if result is not None:
                    st.metric("Rows", result["row_count"])
                    st.dataframe([{**column, "min": str(column["min"]) if column["min"] is not None else None,
                                   "max": str(column["max"]) if column["max"] is not None else None}
                                  for column in result["columns"]], hide_index=True, width="stretch")
            profile_panel()
            with st.expander(f"Manage notebook tabs · {len(workspace['notebooks'])} of 12"):
                if st.button("Add notebook tab", key=f"notebook_add_{aid}"):
                    next_id = next((f"notebook_{i}" for i in range(1, 13) if f"notebook_{i}" not in workspace["notebooks"]), None)
                    if next_id:
                        workspace["notebooks"][next_id] = ""
                        workspace.setdefault("notebook_titles", {})[next_id] = "Notebook " + next_id.split("_")[-1]
                        save_detective_workspace(database, aid, workspace)
                        st.rerun()
                    else:
                        st.warning("This investigation has 12 notebook tabs.")
                selected_notebook = st.selectbox("Rename notebook", list(workspace["notebooks"]),
                    format_func=lambda item: workspace.get("notebook_titles", {}).get(item, item), key=f"notebook_rename_select_{aid}")
                new_title = st.text_input("Notebook title", workspace.get("notebook_titles", {}).get(selected_notebook, selected_notebook), key=f"notebook_title_{aid}_{selected_notebook}")
                if st.button("Save notebook name", key=f"notebook_title_save_{aid}"):
                    if not new_title.strip() or len(new_title) > 80:
                        st.error("Notebook names need 1–80 characters.")
                    else:
                        workspace.setdefault("notebook_titles", {})[selected_notebook] = new_title.strip()
                        save_detective_workspace(database, aid, workspace)
                        st.rerun()
        else:
            st.subheader("Repair and submit")
            st.caption("Write one SELECT per repair output. Check repair verifies results; your diagnosis is assessed separately.")
            with st.expander("Root cause and prevention notes", expanded=False):
                st.write("**Root cause:** " + (workspace.get("root_cause") or "Not yet written."))
                st.write("**Prevention:** " + (workspace.get("prevention") or "Not yet written."))
        render_workspace(database, get_attempt(database, aid), exercise, detective=True)
    else:
        _findings(database, aid, exercise, meta, workspace)


def _findings(database, aid, exercise, meta, workspace):
    public_hash = fingerprint({"exercise": public_exercise(exercise), "case": meta})
    findings = workspace["findings"]
    st.subheader("Findings and evidence")
    st.caption("Record the diagnosis in your own words. An attached query proves execution, not the interpretation.")
    if st.button("Add finding", key=f"finding_add_{aid}", disabled=len(findings) >= 30):
        findings.append({"title": "", "category": meta["finding_categories"][0], "tables": "", "explanation": "", "impact": "", "action": "", "evidence": []})
        save_detective_workspace(database, aid, workspace)
        st.rerun()
    if len(findings) >= 30:
        st.caption("This investigation has reached the 30-finding limit.")
    if findings:
        index = st.selectbox("Finding", range(len(findings)), format_func=lambda i: findings[i]["title"] or f"Finding {i+1}", key=f"finding_select_{aid}")
        finding = findings[index]
        prefix = f"finding_{aid}_{index}_"

        def save_finding():
            latest = validate_detective_workspace(get_attempt(database, aid).get("detective_workspace") or new_detective_workspace())
            latest["findings"][index].update({
                "title": st.session_state[prefix + "title"],
                "category": st.session_state[prefix + "category"],
                "tables": ",".join(st.session_state[prefix + "tables"]),
                "explanation": st.session_state[prefix + "explanation"],
                "impact": st.session_state[prefix + "impact"],
                "action": st.session_state[prefix + "action"],
            })
            save_detective_workspace(database, aid, latest)
        st.markdown("#### Finding details")
        st.text_input("Title", finding["title"], key=prefix + "title", on_change=save_finding)
        table_names = [t["name"] for t in exercise["tables"]]
        category_col, tables_col = st.columns(2)
        with category_col:
            st.selectbox("Category", meta["finding_categories"], index=meta["finding_categories"].index(finding["category"]) if finding["category"] in meta["finding_categories"] else 0, key=prefix + "category", on_change=save_finding)
        with tables_col:
            st.multiselect("Affected tables", table_names, default=[x for x in finding["tables"].split(",") if x in table_names], key=prefix + "tables", on_change=save_finding)
        st.text_area("Explanation", finding["explanation"], key=prefix + "explanation", on_change=save_finding)
        impact_col, action_col = st.columns(2)
        with impact_col:
            st.text_area("Business impact", finding["impact"], key=prefix + "impact", on_change=save_finding)
        with action_col:
            st.text_area("Proposed action", finding["action"], key=prefix + "action", on_change=save_finding)
        st.caption("Changes save when you leave a field.")
        st.divider()
        st.markdown("#### Executed evidence")
        last = st.session_state.get("sql_last_result")
        attachable = bool(last and last.get("operation") == "run" and last.get("result", {}).get("ok") and last.get("sql") and last.get("exercise_hash") == fingerprint(exercise))
        if st.button("Attach last executed query", disabled=not attachable or len(finding["evidence"]) >= 20, key=f"attach_{aid}_{index}"):
            snapshot = {"sql": last["sql"], "tab": last["active"], "query_hash": fingerprint(last["sql"]),
                        "fixture_hash": public_hash}
            finding["evidence"].append(snapshot)
            save_detective_workspace(database, aid, workspace)
            st.rerun()
        if len(finding["evidence"]) >= 20:
            st.caption("This finding has reached the 20-query evidence limit.")
        elif not attachable:
            st.caption("Run a query in Investigate, then return here to attach its executed SQL.")
        repair_drafts = (get_attempt(database, aid).get("sql_workspace") or {}).get("drafts", {})
        for i, evidence in enumerate(finding["evidence"]):
            current = evidence_is_current(evidence, workspace, repair_drafts, public_hash)
            label = f"Evidence {i+1} · {'Current' if current else 'Outdated'} · {evidence['tab']}"
            with st.expander(label, expanded=i == len(finding["evidence"]) - 1):
                st.code(evidence["sql"], language="sql")
                if st.button("Open in notebook", key=f"evidence_reopen_{aid}_{index}_{i}"):
                    target = reopen_evidence_in_notebook(workspace, evidence)
                    if target is None:
                        st.warning("All 12 notebook tabs are in use. Reuse a tab before opening this evidence.")
                    else:
                        save_detective_workspace(database, aid, workspace)
                        st.session_state[f"detective_section_{aid}"] = "Investigate"
                        st.session_state.sql_active = target
                        st.rerun()
    else:
        st.info("Add a finding to document what you discovered. You can attach a successful query afterward.")

    st.divider()
    st.markdown("#### Root cause and prevention")

    def save_reasoning():
        latest = validate_detective_workspace(get_attempt(database, aid).get("detective_workspace") or new_detective_workspace())
        latest["root_cause"] = st.session_state[f"reasoning_root_{aid}"]
        latest["prevention"] = st.session_state[f"reasoning_prevention_{aid}"]
        save_detective_workspace(database, aid, latest)
    st.text_area("Root-cause reasoning", workspace["root_cause"], key=f"reasoning_root_{aid}", on_change=save_reasoning)
    st.text_area("Prevention and alerting recommendations", workspace["prevention"], key=f"reasoning_prevention_{aid}", on_change=save_reasoning)
