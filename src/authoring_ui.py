"""Prompt-first exercise creation and import review components."""
import json

import streamlit as st

from src.authoring import MODES, authoring_prompt, exercise_format, repair_prompt, parse_package
from src.authoring_catalog import (FAMILIES, WRITTEN_FAMILIES, DIAGRAM_FAMILIES,
                                  family_for, allocate_ids, normalize_generated_package)
from src.bank_manager import prepare_append
from src import config
from src.ai import revision
from src.ai_ui import record_activity, render_authoring_draft


@st.cache_data(max_entries=4, show_spinner=False)
def prepare_package(current_bank, incoming):
    normalized, changes = normalize_generated_package(current_bank, incoming)
    candidate, report = prepare_append(current_bank, normalized)
    return candidate, report, normalized, changes


def render_authoring(current_bank=None):
    st.subheader("1 · Create with your preferred AI")
    st.caption("Choose a format and topic. Use the prompt with any LLM, or generate a draft with your connection in Optional AI. Review and append the result below.")
    with st.expander("Build an exercise prompt", expanded=True):
        mode = st.selectbox("Exercise format", MODES, on_change=record_activity)
        topic = st.text_input("Topic", placeholder="[TOPIC] — e.g. deduplicating customer records", on_change=record_activity)
        columns = st.columns(3)
        count = columns[0].number_input("Project count" if mode == "Connected Capstone" else "Exercise count", min_value=1, max_value=10, value=1 if mode == "Connected Capstone" else 3, on_change=record_activity)
        difficulty = columns[1].selectbox("Difficulty", [1, 2, 3, 4, 5], index=2, on_change=record_activity)
        language = columns[2].text_input("Language", value="English", on_change=record_activity)
        preferences = st.text_input("Additional requirements", placeholder="[ADDITIONAL_REQUIREMENTS] — audience, edge cases, context…", on_change=record_activity)
        options = {"audience": st.text_input("Audience", placeholder="e.g. junior data engineers", on_change=record_activity),
                   "edge_cases": st.text_input("Required edge cases", placeholder="Optional — nulls, duplicates, late arrivals…", on_change=record_activity)}
        if mode == "Written practice":
            family = st.selectbox("Exercise family", WRITTEN_FAMILIES, format_func=lambda p: f"{p} · {FAMILIES[p][0]}", on_change=record_activity)
            options["family"] = family
            options["exercise_type"] = st.selectbox("Dominant deliverable", FAMILIES[family][1], on_change=record_activity)
        if mode == "Diagram":
            options["diagram_kind"] = st.selectbox("Diagram kind", list(DIAGRAM_FAMILIES),
                format_func=lambda kind: {"conceptual_erd": "Conceptual model", "logical_erd": "Logical model", "star_schema": "Star schema"}[kind], on_change=record_activity)
        if mode == "Repair exercise":
            options["repair_tool"] = st.selectbox("Repair tool", ["diagram", "pipeline", "mock", "sql"],
                format_func=lambda tool: {"diagram": "Diagram Maker", "pipeline": "Pipeline Designer", "mock": "Mock Data Generator", "sql": "SQL utilities"}[tool], on_change=record_activity)
        if mode in ("SQL Practice", "SQL analysis"):
            focus = st.selectbox("SQL focus", ["Query design", "Data cleaning"], on_change=record_activity)
            options["exercise_type"] = "CLEAN" if focus == "Data cleaning" else "SQL"
        if mode == "Mock data":
            workflow = st.selectbox("Mock data workflow", ["Recipe and generation", "Logical model to recipe"], on_change=record_activity)
            options["mock_from_model"] = workflow == "Logical model to recipe"
        if mode == "Connected Capstone":
            st.caption("Each project contains six linked stages: business model, operational model, data generation, analytical model, dataset SQL, and operations. Larger drafts may need a higher output-token limit in Optional AI.")
        if mode == "Python Practice":
            grading = st.radio("Python grading", ["Correctness only", "Performance targets"], horizontal=True, on_change=record_activity)
            options.update({
                "performance": grading == "Performance targets",
                "contract": st.text_input("Function contract", placeholder="[FUNCTION_CONTRACT]", on_change=record_activity),
                "goals": st.text_input("Performance goals", placeholder="[PERFORMANCE_GOALS]", disabled=grading == "Correctness only", on_change=record_activity),
            })
            st.caption("Python v2 supports functions with JSON-compatible arguments and results. References and optional targets are verified locally before import.")
        try:
            bundled = json.loads(config.BUNDLED_CHALLENGES_PATH.read_text(encoding="utf-8"))
            bank = bundled if current_bank is None else current_bank
            prefix = family_for(mode, options.get("family"), options.get("diagram_kind", "conceptual_erd"))
            identities = allocate_ids(bank, prefix, int(count) * (6 if mode == "Connected Capstone" else 1))
            prompt = authoring_prompt(bank, mode, topic, int(count), difficulty, language, preferences, examples=bundled, **options)
        except (OSError, ValueError) as exc:
            st.error(f"Could not load the authoring example: {exc}")
            return
        st.caption(f"Assigned IDs: {', '.join(identities)}. IDs follow the installed bank's {prefix} sequence; import review updates them if needed. Existing exercises keep their IDs.")
        st.caption("The prompt includes a complete format example, quality criteria and naming rules; no companion files are needed.")
        st.caption("Creation material: the format example includes the private authoring fields needed to produce valid exercises.")
        contract = {"version": 1, "format": mode, "family": prefix, "count": int(count)}
        if mode != "Connected Capstone":
            contract["type"] = options.get("exercise_type") or ("PIPELINE" if mode == "Pipeline design" else FAMILIES[prefix][1][0])
        for field in ("diagram_kind", "repair_tool", "mock_from_model"):
            if field in options:
                contract[field] = options[field]
        st.session_state.authoring_request_contract = contract
        if not topic.strip():
            st.caption("Enter a topic before sending to connected AI. You can also download the prompt and fill in the topic yourself.")
        render_authoring_draft(prompt, "ai_authoring", "authoring", revision(prompt), authoring_contract=contract, ready=bool(topic.strip()))


def render_repair(problem, original="[PASTE_THE_JSON_YOU_GENERATED]"):
    with st.expander("Fix this with your AI", expanded=True):
        st.caption("Copy this repair prompt into the same AI conversation, fill the placeholders, then paste or upload its corrected JSON.")
        generation_prompt = st.session_state.get("ai_bank_generation_prompt") if st.session_state.get("challenge_import_method") == "AI draft" else None
        prompt=repair_prompt(problem, original, generation_prompt)
        try:
            contract = parse_package(original).get("authoring")
        except (ValueError, TypeError, UnicodeError):
            contract = None
        if st.session_state.get("challenge_import_method") == "AI draft":
            contract = st.session_state.get("ai_bank_contract")
        record={"original":original,"errors":problem,"contract":contract,"generation_prompt":generation_prompt}
        st.session_state.setdefault("ai_repair_original",record)
        history=st.session_state.setdefault("ai_repair_history",{})
        history.setdefault(revision(record),record)
        st.caption("This draft and its validation feedback are preserved in Repair history, independently of later repairs.")
        render_authoring_draft(prompt, "ai_repair", "repair", revision({"original":original,"errors":problem}), authoring_contract=contract, generation_prompt=generation_prompt)


def render_repair_history():
    history=st.session_state.get("ai_repair_history",{})
    if not history:
        return
    with st.expander("Repair history · recover original drafts"):
        labels={key:f"Draft {index} · {len(record['original'].encode('utf-8')):,} bytes" for index,(key,record) in enumerate(history.items(),1)}
        selected=st.selectbox("Preserved repair draft",list(history),format_func=labels.get,key="ai_repair_history_choice",on_change=record_activity)
        record=history[selected]
        st.caption("Each failed draft and its original validation feedback are kept in this session. Restoring opens a draft for review; it does not send or append it.")
        st.download_button("Download preserved draft",record["original"],file_name=f"repair-draft-{selected[:8]}.json",mime="application/json",key="ai_repair_history_download",on_click=record_activity)
        st.download_button("Download preserved validation feedback",record["errors"],file_name=f"repair-feedback-{selected[:8]}.txt",mime="text/plain",key="ai_repair_history_feedback",on_click=record_activity)
        if st.button("Restore preserved draft for review",key="ai_repair_history_restore"):
            record_activity()
            st.session_state.ai_bank_draft=record["original"]
            st.session_state.ai_bank_contract=record.get("contract")
            st.session_state.ai_bank_generation_prompt=record.get("generation_prompt")
            st.session_state.ai_bank_draft_pending=True
            st.rerun()


def render_package_preview(candidate, incoming):
    ids = {challenge["id"] for challenge in incoming["challenges"]}
    additions = [challenge for challenge in candidate["challenges"] if challenge["id"] in ids]
    st.dataframe([
        {"ID": c["id"], "Title": c["title"], "Format": exercise_format(c),
         "Difficulty": c["difficulty"], "Minutes": c["estimated_minutes"]}
        for c in additions
    ], hide_index=True, width="stretch")
    for definition in incoming.get("capstones", []):
        with st.expander("Project · " + definition["title"]):
            st.write(definition.get("description", ""))
            st.dataframe([{"Stage": s["id"], "Exercise": s["challenge_id"],
                           "Depends on": ", ".join(s["prerequisites"]) or "None",
                           "Outputs": ", ".join(o["tool"] for o in s["outputs"])}
                          for s in definition["stages"]], hide_index=True, width="stretch")
    selected = st.selectbox("Preview an added exercise", additions, format_func=lambda c: f"{c['id']} · {c['title']}")
    with st.expander("Student preview", expanded=False):
        st.markdown(selected["student"]["scenario"])
        for name in ("requirements", "tasks", "constraints", "deliverables"):
            st.markdown(f"**{name.title()}**")
            for item in selected["student"][name]:
                st.write(f"• {item}")
    formats = {exercise_format(c) for c in additions}
    if formats & {"SQL Practice", "Data-quality Detective"}:
        st.caption("SQL reference queries were checked against their fixtures during validation.")
    if "Python Practice" in formats:
        st.caption("Python metadata validated. Verify the reference solution and any performance targets below before appending.")
