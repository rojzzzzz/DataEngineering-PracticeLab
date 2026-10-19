"""Connected project navigation and read-only handoffs using existing Practice tools."""
import sqlite3
import streamlit as st

from src import capstone_store as store, database
from src.submission_ui import lazy_panel, render_preview
from src.constructor_models import summaries


def project_home(navigation, run_id=None, definition_id=None):
    if not navigation.go("mode", "Connected Capstone"):
        return False
    if run_id:
        st.session_state.capstone_run = run_id
        st.query_params["project"] = run_id
    else:
        st.session_state.pop("capstone_run", None)
        st.query_params.pop("project", None)
    if definition_id:
        st.session_state.capstone_definition = definition_id
    for key in ("stage", "attempt", "workspace"):
        st.query_params.pop(key, None)
    return True


def open_stage(path, run_id, stage_id, navigation):
    if not navigation._flush():
        return
    try:
        aid = store.start_stage(path, run_id, stage_id)
        if navigation.go("attempt", aid):
            st.session_state.capstone_run = run_id
            st.query_params["project"] = run_id
            st.query_params["stage"] = stage_id
    except (ValueError, OSError, sqlite3.Error) as exc:
        st.session_state.capstone_notice = str(exc)


def render_writing(drafts, attempt, run):
    stage = next(s for s in run["definition"]["stages"] if s["id"] == attempt["project_stage_id"])
    form = drafts.mount(attempt, sections=stage["written_sections"])
    for label, key in form.fields:
        st.text_area(label, key=key, height=110, on_change=form.changed,
                     placeholder="Explain your decisions, supporting observations and limitations…")
    return form


def reference_preview(record, key):
    tool, p = record["tool"], record["payload"]
    st.caption(f"Copied input · {record['source']['stage_id']} / {record['source']['slot_id']} · revision {record['revision']} · independent saved snapshot")
    if tool in ("diagram", "pipeline", "mock"):
        summary = summaries({"artifacts": {"reference": {"tool": tool, "payload": p, "revision": record["revision"]}}})[0]["evidence"]
        try:
            render_preview(tool, p, summary, key, {})
        except Exception:
            st.text(summary) if isinstance(summary, str) else st.json(summary, expanded=False)
    elif tool == "dataset":
        st.json(p, expanded=False)
    else:
        st.json(p, expanded=False)
    if record.get("reasoning"):
        st.markdown("**Copied source reasoning**")
        st.markdown(record["reasoning"])
    if record.get("acknowledgment"):
        st.markdown("**Why the existing work was kept**")
        st.write(record["acknowledgment"]["explanation"])


def render_references(path, attempt, navigation=None, *, readonly=False):
    if not attempt.get("project_run_id"):
        return
    run, attempts, states, _ = store.view(path, attempt["project_run_id"], include_submission=False)
    sid, aid = attempt["project_stage_id"], attempt["attempt_id"]
    stage = next(s for s in run["definition"]["stages"] if s["id"] == sid)
    state = states[sid]
    if state["inherited"]:
        st.warning("An upstream dependency needs reconciliation. Existing work remains available; resolve it before completing the chain.")
    for inp in stage["inputs"]:
        record = run["inputs"].get(sid, {}).get(inp["id"])
        if not record:
            continue
        notice = next((n for n in state["notices"] if n["input_id"] == inp["id"]), None)
        if notice:
            st.warning(inp["id"] + ": " + notice["message"])
        panel, opened = lazy_panel("Upstream reference · " + inp["id"], f"capref_{aid}_{inp['id']}")
        if opened:
            with panel:
                reference_preview(record, f"caprefview_{aid}_{inp['id']}_{record['fingerprint']}")
        if readonly:
            continue
        if notice and notice["source"]:
            key = f"reconcile_{aid}_{inp['id']}"
            explanation = st.text_area("Why keep the current work?", key=key + "_why", height=90)
            confirm = st.checkbox("Replace the selected SQL dataset; keep SQL drafts and retain the previous snapshot", key=key + "_replace") if inp.get("mode") == "dataset" else True
            left, right = st.columns(2)
            for col, label, choice in ((left, "Update from current source", "update"), (right, "Keep current work and explain why", "keep")):
                if col.button(label, key=key + choice, disabled=(choice == "update" and not confirm) or (choice == "keep" and not explanation.strip())):
                    if navigation._flush():
                        try:
                            store.reconcile(path, run["run_id"], sid, inp["id"], choice, explanation,
                                confirm_replace=confirm, expected_revision=run["revision"])
                            st.rerun()
                        except (ValueError, OSError, sqlite3.Error) as exc:
                            st.error(str(exc))
        if inp.get("mode") == "recipe":
            existing = bool((attempt.get("constructor_workspace") or {}).get("artifacts"))
            replace = st.checkbox("Replace the recipe with a new copy; retain the previous snapshot", key=f"recipe_replace_{aid}") if existing else False
            st.caption("Copies the logical model without solving its mappings. Resolve unsupported types/relationships in Mock Data Generator. Updating the reference alone preserves your recipe.")
            if st.button("Use this model to create a recipe", key=f"derive_recipe_{aid}", disabled=existing and not replace):
                if navigation._flush():
                    try:
                        store.derive_recipe(path, aid, inp["id"], confirm_replace=replace)
                        st.rerun()
                    except (ValueError, OSError, sqlite3.Error) as exc:
                        st.error(str(exc))


def render_stage_header(path, attempt, navigation):
    run = store.get_run(path, attempt["project_run_id"])
    st.caption(run["definition"]["title"])
    st.button("Back to project overview", key="capstone_back_" + str(attempt["attempt_id"]), on_click=project_home, args=(navigation, run["run_id"]))
    render_references(path, attempt, navigation)


def render_dataset_transfer(path, adapter, job):
    owner = store.stage_owner(path, adapter.attempt_id)
    if not owner:
        return
    run = store.get_run(path, owner[0])
    stage = next(s for s in run["definition"]["stages"] if s["id"] == owner[1])
    if not any(o["tool"] == "dataset" for o in stage["outputs"]):
        return
    st.markdown("**Persistent capstone dataset**")
    selected = run["stage_datasets"].get(owner[1])
    if selected:
        st.caption("Saved dataset " + selected + " remains available after worker cleanup or refresh.")
    status = job.status() if job else {}
    ready = bool(job and job.matches(adapter.identity, st.session_state.mock_revision) and status.get("status") == "complete" and job.request.get("mode") == "generate")
    confirm = st.checkbox("Replace the selected capstone dataset and retain its previous snapshot", key=adapter.key + "_replace_dataset") if selected else False
    if not ready:
        st.caption("Generate the current recipe, then explicitly save its full typed data. Expired temporary outputs require regeneration.")
    elif status.get("capstone_transfer_error"):
        st.warning(status["capstone_transfer_error"])
    if st.button("Save dataset for capstone SQL", key=adapter.key + "_save_dataset", disabled=not ready or bool(status.get("capstone_transfer_error")) or bool(selected and not confirm)):
        try:
            from src.capstone_datasets import save_from_job
            saved = save_from_job(path, adapter.attempt_id, adapter.slot_id, job, confirm_replace=confirm)
            st.session_state.capstone_notice = f"Saved complete dataset {saved['dataset_id']}: {sum(len(t['rows']) for t in saved['data']['tables']):,} rows."
            st.rerun()
        except (ValueError, OSError, sqlite3.Error) as exc:
            st.error(str(exc))


def render_stage_preview(challenge):
    st.markdown("**Stage brief**")
    for heading, field in (("Business contract", "scenario"), ("Requirements", "requirements"), ("Tasks", "tasks"), ("Written deliverables", "deliverables")):
        st.markdown("**" + heading + "**")
        value = challenge["student"][field]
        st.markdown(value if isinstance(value, str) else "\n".join("- " + s for s in value))


def render_final(path, run, attempts, states, signature, navigation):
    completion, evaluation = run.get("completion"), run.get("evaluation")
    if completion:
        st.caption("Project completion · " + ("Current" if completion["fingerprint"] == signature and all(s["current"] for s in states.values()) else "Outdated · previous completion retained"))
    if evaluation:
        st.caption("Final evaluation · " + ("Current" if evaluation["fingerprint"] == signature else "Outdated · previous feedback retained"))
        st.write(evaluation.get("feedback", ""))
    panel, opened = lazy_panel("Final submission overview", "capstone_final_" + run["run_id"])
    if opened:
        with panel:
            st.caption("Whole-project evidence and reasoning. Successful runs and presence checks do not establish business correctness.")
            for stage in run["definition"]["stages"]:
                a = attempts.get(stage["id"])
                st.subheader(run["challenges"][stage["id"]]["title"])
                st.caption(states[stage["id"]]["status"])
                if not a:
                    continue
                st.markdown(a.get("answer") or "No saved reasoning.")
                ws = a.get("constructor_workspace") or {}
                for slot in ws.get("tasks", {}).get("slots", []):
                    artifact = ws["artifacts"].get(slot["id"])
                    if artifact:
                        summary = summaries({"artifacts": {slot["id"]: artifact}})[0]["evidence"]
                        try:
                            render_preview(slot["tool"], artifact["payload"], summary, f"final_{run['run_id']}_{stage['id']}_{slot['id']}_{artifact['revision']}", slot)
                        except Exception:
                            st.text(summary) if isinstance(summary, str) else st.json(summary, expanded=False)
                if a.get("capstone_workspace", {}).get("executions"):
                    from src.capstone_sql_ui import render_evidence
                    render_evidence(a)
            for sid, refs in run["inputs"].items():
                for identity, record in refs.items():
                    if record.get("acknowledgment"):
                        st.markdown(f"**{sid} / {identity} · dependency explanation**")
                        st.write(record["acknowledgment"]["explanation"])
    can_finish = all(s["current"] for s in states.values())
    if st.button("Complete connected capstone", type="primary", key="finish_" + run["run_id"], disabled=not can_finish):
        if navigation._flush():
            try:
                store.complete_run(path, run["run_id"])
                st.rerun()
            except (ValueError, OSError, sqlite3.Error) as exc:
                st.error(str(exc))
    if completion and completion["fingerprint"] == signature and can_finish:
        with st.expander("Optional final evaluation"):
            from src.ai_ui import render_evaluation_proposal
            prompt = store.final_prompt(path, run["run_id"])
            key = "cap_eval_" + run["run_id"]
            def apply(proposal, expected):
                if store.view(path, run["run_id"])[3] != expected:
                    st.session_state.capstone_notice = "Project changed; review the current final submission again."
                    return
                for category, value in proposal["rubric_scores"].items():
                    st.session_state[key + category] = float(value)
                st.session_state[key + "feedback"] = proposal["feedback"]
            render_evaluation_proposal(prompt, "capstone:" + run["run_id"], signature, run["rubric"], [], [], apply, save_label="Save final evaluation")
            scores = {category: st.number_input(category.replace("_", " ").title(), min_value=0., max_value=float(maximum),
                value=float(evaluation["rubric_scores"][category]) if evaluation else None, step=1., key=key + category)
                for category, maximum in run["rubric"].items()}
            feedback = st.text_area("Final project feedback", value=evaluation.get("feedback", "") if evaluation else "", key=key + "feedback")
            if st.button("Save final evaluation", key=key + "save", disabled=any(v is None for v in scores.values())):
                try:
                    store.evaluate_run(path, run["run_id"], scores, feedback, expected_fingerprint=signature)
                    st.rerun()
                except (ValueError, OSError, sqlite3.Error) as exc:
                    st.error(str(exc))


def toggle_stage_preview(stage_id):
    if st.session_state.get("capstone_preview_stage") == stage_id:
        st.session_state.pop("capstone_preview_stage", None)
    else:
        st.session_state.capstone_preview_stage = stage_id


def render_run_actions(path, run, navigation):
    with st.popover("Delete run"):
        st.markdown("**Delete this project run?**")
        st.write("This permanently removes this run’s stage attempts, models, SQL drafts, saved datasets and evaluations.")
        confirmed = st.checkbox("I understand this deletes the run and its saved work", key=f"capstone_delete_confirm_{run['run_id']}_{run['revision']}")
        if st.button("Delete this run", disabled=not confirmed, key="capstone_delete_" + run["run_id"]):
            if navigation._flush():
                try:
                    store.delete_run(path, run["run_id"], expected_revision=run["revision"])
                except (ValueError, OSError, sqlite3.Error) as exc:
                    st.error(str(exc))
                    return
                project_home(navigation)
                st.session_state.pop("capstone_preview_stage", None)
                st.session_state.capstone_notice = "Project run deleted."
                st.rerun()


def render_projects(path, bank, navigation, resume_callback):
    st.header("Connected Capstone")
    st.caption("One business system across six stages · about 4–6 hours. Stages 3 and 4 can proceed independently. The Capstone learning path remains a set of independent cases.")
    if notice := st.session_state.pop("capstone_notice", None):
        st.info(notice)
    definitions = {d["id"]: d for d in bank.get("capstones", [])}
    runs = store.list_runs(path)
    rid = st.session_state.get("capstone_run")
    existing = {r["run_id"]: r for r in runs}
    if rid not in existing:
        rid = None
        st.session_state.pop("capstone_run", None)
    if runs:
        choices = [None, *existing]
        selected = st.selectbox("Project run", choices, index=choices.index(rid),
            format_func=lambda key: "Preview a project / start a new run" if key is None else f"{existing[key]['definition']['title']} · {key[:8]} · {existing[key]['created_at'][:10]}", key="capstone_run_choice_" + (rid or "preview"))
        if selected != rid:
            project_home(navigation, selected)
            st.rerun()
        rid = selected
    if rid:
        run, attempts, states, signature = store.view(path, rid)
        definition, challenges = run["definition"], run["challenges"]
    else:
        if not definitions:
            st.info("No bundled project definitions are available. Existing saved runs remain accessible above.")
            return
        options = list(definitions)
        did = st.session_state.get("capstone_definition", options[0])
        selected = st.selectbox("Project", options, index=options.index(did) if did in options else 0, format_func=lambda key: definitions[key]["title"])
        definition = definitions[selected]
        by_id = {c["id"]: c for c in bank["challenges"]}
        challenges = {s["id"]: by_id[s["challenge_id"]] for s in definition["stages"]}
        run, attempts, states = None, {}, {}
    st.subheader(definition["title"])
    start, manage = st.columns([3, 1])
    if start.button("Start a new independent run", key="new_capstone_run"):
        if navigation._flush():
            try:
                created = store.create_run(path, definition, bank)
                project_home(navigation, created["run_id"])
                st.rerun()
            except (ValueError, OSError, sqlite3.Error) as exc:
                st.error(str(exc))
    if run:
        with manage:
            render_run_actions(path, run, navigation)
    if run and attempts:
        from src.attempt_resume import most_recent, destination
        pending = most_recent(list(attempts.values()), {c["id"]: c for c in challenges.values()})
        if pending is None:
            pending = next((a for sid, a in attempts.items() if not states[sid]["current"]), None)
        if pending:
            target, label = destination(pending, challenges[pending["project_stage_id"]])
            st.caption("Saved destination · " + label)
            st.button("Continue working", key="capstone_continue", on_click=resume_callback, args=(pending["attempt_id"],))
    for index, stage in enumerate(definition["stages"], 1):
        sid, challenge = stage["id"], challenges[stage["id"]]
        state = states.get(sid, {"status": "Preview", "errors": [], "notices": [], "inherited": False})
        with st.container(border=True):
            st.markdown(f"**{index}. {challenge['title']}** · {state['status']}")
            st.caption("Prerequisites: " + (", ".join(stage["prerequisites"]) or "None"))
            for notice in state["notices"]:
                st.warning(notice["message"])
            if state["inherited"]:
                st.caption("An unresolved dependency exists earlier in this chain.")
            if state["errors"] and sid in attempts:
                st.caption("Outstanding evidence: " + " ".join(state["errors"]))
            left, right = st.columns(2)
            previewing = st.session_state.get("capstone_preview_stage") == sid
            left.button("Hide preview" if previewing else "Preview stage", key="cap_preview_" + sid,
                on_click=toggle_stage_preview, args=(sid,))
            if run:
                right.button("Open stage" if sid in attempts else "Start stage", key="cap_stage_" + sid,
                    disabled=sid not in attempts and not state["can_start"], on_click=open_stage, args=(path, rid, sid, navigation))
            if previewing:
                render_stage_preview(challenge)
    if run:
        render_final(path, run, attempts, states, signature, navigation)
