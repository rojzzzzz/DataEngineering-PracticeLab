"""Lazy read-only submission inspection; never construct an editor adapter here."""
from pathlib import Path
import inspect
import streamlit as st
from src.constructor_models import slot_statuses, validate_payload, summaries, sql_evidence_current
from src.submission import review_status


def lazy_panel(label, key):
    if "on_change" in inspect.signature(st.expander).parameters:
        panel = st.expander(label, key=key, on_change="rerun")
        return panel, panel.open
    # Streamlit 1.51 has no tracked expander state. Keep its supported API and
    # defer expensive read-only content until this explicit action inside it.
    panel = st.expander(label)
    with panel:
        opened = st.checkbox("Load saved previews", key=key + "_load")
    return panel, opened


# A payload can contain 25 MiB of embedded images. Keep one workspace's twelve
# slots warm without retaining dozens of old image-bearing revisions globally.
@st.cache_data(max_entries=12, show_spinner=False)
def preview_data(owner, attempt_id, slot_id, revision, saved_at, _artifact, _slot):
    payload = validate_payload(_slot["tool"], _artifact["payload"], _slot.get("kind"))
    summary = summaries({"artifacts": {slot_id: {**_artifact, "payload": payload}}})[0]["evidence"]
    return payload, summary


def render_preview(tool, payload, summary, key, slot):
    if tool == "diagram":
        from src.erd_component import diagram_preview
        diagram_preview(payload, key)
        with st.expander("Saved model summary"):
            st.text(summary)
    elif tool == "pipeline":
        from src.pipeline_component import pipeline_preview
        pipeline_preview(payload, key)
        with st.expander("Saved pipeline summary"):
            st.json(summary, expanded=False)
    elif tool == "sql":
        settings = payload["settings"]
        st.caption(f"Source: {settings['dialect']} · Target: {settings['target']}")
        for field, label in (("sql", "Source SQL"), ("reviewed_sql", "Reviewed SQL"), ("plan", "Supplied plan")):
            if payload.get(field):
                st.markdown(f"**{label}**")
                st.code(payload[field][:4000], language="text" if field == "plan" else "sql")
                if len(payload[field]) > 4000:
                    st.caption("Excerpt · open the deliverable for the complete saved text.")
        for action, entry in payload.get("results", {}).items():
            current = sql_evidence_current(action, payload, slot)
            st.caption(f"{action.title()} evidence · {'Current' if current else 'Outdated'}")
            result = entry["result"]
            if result.get("sql"):
                st.code(result["sql"][:4000], language="sql")
            if result.get("nodes"):
                st.caption(f"{len(result['nodes'])} analysis nodes saved")
            with st.expander(action.title() + " saved analysis summary"):
                # Plan summaries retain measured timing/cost/warnings without
                # forcing a potentially large graph into a review card.
                details = {k: result[k] for k in ("summary", "warnings", "dialect", "tables", "columns", "edges") if k in result}
                if result.get("nodes"):
                    details["nodes"] = result["nodes"][:30]
                if result.get("plans"):
                    details["plans"] = result["plans"][:10]
                st.json(details or {"status": "Saved", "result_fields": list(result)}, expanded=False)
    else:
        recipe = payload["recipe"]
        generation = payload.get("generation") or {}
        st.caption(f"Seed {recipe['seed']} · {recipe['locale']} · Generation: {'Current' if summary['generation_current'] and not payload.get('pending_rules') else 'Outdated' if generation else 'Not generated'}")
        names = {t["id"]: t["name"] for t in recipe["tables"]}
        for table in recipe["tables"]:
            st.markdown(f"**{table['name']}** · {table['rows']:,} rows · {len(table['fields'])} columns")
            st.dataframe([{"Column": f["name"], "Type": f["type"], "Key": "PK" if f["primary_key"] else "FK" if f.get("reference") else "",
                           "Generator": f["generator"]["kind"], "References": names.get((f.get("reference") or {}).get("table_id"), "")}
                          for f in table["fields"]], hide_index=True, width="stretch", height=230 if len(table["fields"]) > 8 else "auto")
            with st.expander("Generation rules · " + table["name"]):
                st.json({f["name"]: {k: f.get(k) for k in ("type", "generator", "reference", "null_pct", "precision", "scale", "max_length")}
                         for f in table["fields"]}, expanded=False)
            samples = generation.get("samples", {}).get(table["id"])
            if samples:
                st.caption("Saved bounded sample · up to 10 rows; not proof of full-dataset correctness")
                st.dataframe(samples, hide_index=True, width="stretch")
        if recipe.get("pending_mappings"):
            st.caption(f"{len(recipe['pending_mappings'])} relationship mappings remaining")
        if generation:
            with st.expander("Saved generation manifest statistics"):
                st.json(generation["manifest"], expanded=False)


def render_overview(path, attempt, navigation, draft_answer=None, rubric=None):
    aid = attempt["attempt_id"]
    panel, opened = lazy_panel("Submission overview", f"submission_overview_{aid}")
    if not opened:
        return
    with panel:
        pending_answer = draft_answer is not None and draft_answer != attempt.get("answer", "")
        challenge = navigation.challenges.get(attempt["challenge_id"])
        status = review_status({**attempt, "answer": draft_answer} if pending_answer else attempt, challenge, rubric)
        st.markdown(f"**Review · {status}**")
        st.caption("Evaluation covers the whole submission. Evidence ready confirms presence and currency, not correctness.")
        st.markdown("**Saved reasoning**")
        st.caption("Unsaved changes · showing the last saved answer" if pending_answer else "Saved" if attempt.get("answer") else "No saved reasoning")
        st.markdown(attempt.get("answer") or "No saved reasoning yet.")
        if attempt.get("project_run_id"):
            from src.capstone_sql_ui import render_evidence
            if attempt.get("capstone_workspace", {}).get("dataset_id"):
                render_evidence(attempt)
        workspace = attempt.get("constructor_workspace")
        if not workspace:
            st.caption("This attempt has no linked deliverable requirements.")
            return
        pending = {v["slot_id"] for v in st.session_state.get("artifact_drafts", {}).values() if v["attempt_id"] == aid}
        statuses = slot_statuses(workspace, pending)
        for offset in range(0, len(statuses), 2):
            columns = st.columns(2)
            for col, state, slot in zip(columns, statuses[offset:offset+2], workspace["tasks"]["slots"][offset:offset+2]):
                with col, st.container(border=True):
                    st.markdown(f"**{state['label']}** · {'Required' if state['required'] else 'Optional'}")
                    st.caption(f"Save · {state['save']} | Evidence · {state['evidence']}")
                    st.caption(state["explanation"])
                    artifact = workspace["artifacts"].get(slot["id"])
                    if artifact:
                        st.caption(f"Saved content · revision {artifact['revision']}" + (" · a newer draft is pending" if slot["id"] in pending else ""))
                        key = f"preview_{aid}_{slot['id']}_{artifact['revision']}_{artifact['updated_at']}"
                        try:
                            payload, summary = preview_data(str(Path(path).resolve()), aid, slot["id"], artifact["revision"], artifact["updated_at"], artifact, slot)
                            render_preview(slot["tool"], payload, summary, key, slot)
                        except Exception:
                            st.warning("Visual preview unavailable. Open the deliverable to inspect the saved content.")
                            try:
                                fallback = summaries({"artifacts": {slot["id"]: artifact}})[0]["evidence"]
                                st.text(fallback) if isinstance(fallback, str) else st.json(fallback, expanded=False)
                            except (ValueError, KeyError, TypeError):
                                st.json({"tool": slot["tool"], "revision": artifact["revision"], "saved_at": artifact["updated_at"],
                                         "content_sections": list(artifact.get("payload", {}))})
                    from src.attempt_constructor import open_workspace
                    st.button("Open deliverable", key=f"overview_open_{aid}_{slot['id']}", on_click=open_workspace,
                              args=(path, attempt, slot["id"], navigation))


def render_original(adapter):
    if not adapter.slot.get("requires_changes"):
        return
    panel, opened = lazy_panel("Original supplied design", adapter.key + "_original")
    if opened:
        with panel:
            st.caption("Read-only reference · unchanged-submission checks do not establish successful repair.")
            p = validate_payload(adapter.slot["tool"], adapter.slot["starter"], adapter.slot.get("kind"))
            summary = summaries({"artifacts": {adapter.slot_id: {"tool": adapter.slot["tool"], "payload": p, "revision": 0}}})[0]["evidence"]
            try:
                render_preview(adapter.slot["tool"], p, summary, adapter.key + "_original_preview", adapter.slot)
            except Exception:
                st.json(summary, expanded=False)
