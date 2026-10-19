from __future__ import annotations
import json, logging
from html import escape
from datetime import datetime, timezone
from pathlib import Path
import streamlit as st
from src.config import BUNDLED_CHALLENGES_PATH, CHALLENGES_PATH, DB_PATH, SOURCE_PATH, VALIDATION_REPORT_PATH, IMPORTS_DIR, VERSIONS_DIR
from src.bank_installation import BankInstallation, BankPaths
from src.practice_navigation import FILTER_DEFAULTS, PracticeNavigation, restore_filter_settings
from src.written_drafts import WrittenDrafts

logging.basicConfig(level=logging.INFO)
st.set_page_config(page_title="Data Engineering Practice Lab", page_icon="🧪", layout="wide", initial_sidebar_state="auto")
# Keep the native header: it contains the only sidebar reopen control.
st.markdown("<style>" + (Path(__file__).parent / "src" / "styles.css").read_text(encoding="utf-8") + "</style>", unsafe_allow_html=True)


def notebook_section(number: str, title: str) -> None:
    st.markdown(
        f"<h2 class='notebook-section'><span class='section-number'>{escape(number)}</span> "
        f"<span>{escape(title)}</span></h2>", unsafe_allow_html=True,
    )

# Detach retained controls from Streamlit's hidden-widget cleanup, including
# Constructor Mode, which stops before the sidebar filters are rendered.
for retained_key in ("catalog_search", "catalog_status", "catalog_page", "catalog_choice",
                     "filter_family", "filter_type", "filter_difficulty", "filter_minutes",
                     "filter_path", "filter_completed", "filter_attempted",
                     "ai_protocol", "ai_url", "ai_model", "ai_local", "ai_timeout",
                     "ai_tokens", "ai_token_parameter", "ai_prompt_kib", "ai_preset"):
    if retained_key in st.session_state:
        st.session_state[retained_key] = st.session_state[retained_key]

def stop_practice_jobs():
    from src.capstone_sql import cancel
    cancel(st.session_state)
    ai_session=st.session_state.get("optional_ai")
    if ai_session:
        ai_request,_,_=ai_session.snapshot()
        if ai_request and ai_request.operation=="evaluation":
            ai_session.invalidate()
    if st.session_state.get("sql_job") or st.session_state.get("detective_profile_job"):
        from src.sql_ui import stop_sql_job
        stop_sql_job()
    if st.session_state.get("python_job"):
        from src.python_ui import stop_python_job
        stop_python_job()

def navigation():
    # Callbacks run before the script body. Use current session state and the
    # previous render's bank; settings/constructor pages need no bank to leave.
    return PracticeNavigation(st.session_state,DB_PATH,globals().get("challenges",()),stop_practice_jobs)


def open_navigation_attempt(aid):
    if not navigation().go("attempt",aid):
        return False
    current = get_attempt(DB_PATH, aid)
    if current.get("project_run_id"):
        st.query_params["project"] = current["project_run_id"]
        st.query_params["stage"] = current["project_stage_id"]
    else:
        st.query_params.pop("project", None)
        st.query_params.pop("stage", None)
    return True


def continue_saved_work(aid):
    nav = navigation()
    if not open_navigation_attempt(aid):
        return
    if current := get_attempt(DB_PATH, aid):
        if current.get("project_run_id"):
            from src.capstone_store import get_run
            challenge = get_run(DB_PATH, current["project_run_id"])["challenges"][current["project_stage_id"]]
            nav.challenges[challenge["id"]] = challenge
    from src.attempt_resume import destination
    current = get_attempt(DB_PATH, aid)
    target, _ = destination(current, nav.challenges[current["challenge_id"]])
    if target and target.startswith("artifact:"):
        from src.attempt_constructor import open_workspace
        open_workspace(DB_PATH, current, target.split(":", 1)[1], nav)


def clear_direct_preview():
    return navigation().go("filters")


def navigate_page():
    result = navigation().go("page",st.session_state.navigate)
    if result:
        st.query_params.pop("workspace", None)
        st.query_params.pop("attempt", None)
        st.query_params.pop("project", None)
        st.query_params.pop("stage", None)
    return result


def choose_practice_mode(mode):
    result = navigation().go("mode",mode)
    if result:
        for key in ("project", "stage", "attempt", "workspace"):
            st.query_params.pop(key, None)
    return result


def render_session_choices():
    active_mode=st.session_state.get("mode","Daily Scenario")
    actions=[
        ("Daily Scenario","A focused, realistic scenario.","Practice a scenario"),
        ("Complete Case Study","Work through an end-to-end case.","Open a case study"),
        ("Review Weak Area","Practice a topic that needs attention.","Review a topic"),
        ("Surprise Me","Get a fresh challenge at random.","Surprise me"),
        ("SQL Practice","Query real datasets and check your results.","Open SQL practice"),
        ("Data-quality Detective","Investigate data defects and verify repairs.","Open investigations"),
        ("Python Practice","Write and check Python, with optional performance targets.","Open Python practice"),
        ("Connected Capstone","Build one business system across six connected stages.","Open connected capstone"),
    ]
    expanded=not bool(st.session_state.get("active_attempt")) and active_mode!="Connected Capstone"
    with st.expander(f"Session: {active_mode}", expanded=expanded):
        st.caption("Pick a focused route, then adjust the filters in the sidebar.")
        with st.container(key="session_choices"):
            session_groups=st.columns(2,gap="large")
            for group,heading,indices in [(session_groups[0],"Scenarios & review",[0,1,7,2,3]),(session_groups[1],"Hands-on labs",range(4,7))]:
                with group:
                    st.markdown(f"<h2 class='session-group-title'>{heading}</h2>",unsafe_allow_html=True)
                    for i in indices:
                        name,copy,action_label=actions[i]
                        selected=name==active_mode
                        with st.container(key=f"session_{i}"):
                            details,action=st.columns([1.4,1],gap="small",vertical_alignment="center")
                            with details:
                                badge="<span class='session-selected'>Selected</span>" if selected else ""
                                st.markdown(f"<div class='session-details'><div class='session-title'>{escape(name)} {badge}</div><p class='session-copy'>{copy}</p></div>",unsafe_allow_html=True)
                            with action:
                                st.button(action_label,key=f"choose_{i}",type="primary" if selected else "secondary",use_container_width=True,on_click=choose_practice_mode,args=(name,))


def open_challenge_preview(cid):
    result = navigation().go("preview",cid)
    if result:
        for key in ("project", "stage", "attempt", "workspace"):
            st.query_params.pop(key, None)
    return result


def choose_another_challenge(ids, adaptive, weak_topic, preferred_difficulty):
    current_id=st.session_state.get("active_challenge")
    alternatives=[c for c in challenges if c["id"] in ids and c["id"] != current_id]
    selected=select_challenge(alternatives,attempts,adaptive=adaptive,weak_topics=[weak_topic] if weak_topic else None,preferred_difficulty=preferred_difficulty)
    if selected:
        navigation().go("exercise",selected["id"])


def reset_challenge_filters():
    return navigation().go("reset")


def reset_catalog_page():
    st.session_state.catalog_page=1
    st.session_state.pop("catalog_choice",None)


def now() -> str: return datetime.now(timezone.utc).isoformat(timespec="microseconds")


def start_challenge(cid: str) -> None:
    started_at=now()
    from src.constructor_artifacts import new_workspace
    challenge = next(c for c in challenges if c["id"] == cid)
    if challenge.get("capstone"):
        from src.capstone_ui import project_home
        project_home(navigation(), definition_id=challenge["capstone"]["definition_id"])
        return
    st.session_state.active_attempt=save_attempt(DB_PATH,{"challenge_id":cid,"status":"In progress","started_at":started_at,"updated_at":started_at,"constructor_workspace":new_workspace(challenge)})
    st.session_state.pop("direct_preview",None)

def parse_time(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed

def move_attempt_to_not_started(attempt: dict) -> None:
    if not navigation()._flush():
        st.session_state.status_notice = "Save pending changes before moving this attempt."
        return
    attempt=get_attempt(DB_PATH,attempt["attempt_id"])
    previous_status=attempt["status"]
    attempt.update(status="Not started",updated_at=now())
    try:
        save_attempt_details(DB_PATH,attempt,{"status":previous_status})
    except ValueError as exc:
        st.session_state.editor_navigation_error=str(exc)
        return
    st.session_state[f"status_{attempt['attempt_id']}"]="Not started"
    st.session_state.pop("active_attempt",None)

def mark_attempt_complete(attempt: dict, started_at: str) -> None:
    from src.constructor_artifacts import evidence_errors
    if not navigation()._flush():
        st.session_state.status_notice = "Save pending changes before completing this attempt."
        return
    current = get_attempt(DB_PATH, attempt["attempt_id"])
    if current.get("project_run_id"):
        from src.capstone_store import errors_for_attempt
        if errors := errors_for_attempt(DB_PATH, current):
            st.session_state.status_notice = " ".join(errors)
            return
    if evidence_errors(current.get("constructor_workspace"), current.get("answer", "")) or st.session_state.get("artifact_drafts"):
        st.session_state.status_notice = "Save all required deliverables before completing this attempt."
        return
    attempt = current
    finished=now()
    elapsed=max(0,(datetime.fromisoformat(finished)-parse_time(started_at)).total_seconds()/60)
    attempt.update(status="Completed",completed_at=finished,updated_at=finished,minutes_taken=elapsed)
    try:
        save_attempt_details(DB_PATH,attempt)
    except ValueError as exc:
        st.session_state.status_notice = str(exc)
        return
    st.session_state[f"status_{attempt['attempt_id']}"]="Completed"
    st.session_state.active_attempt=attempt["attempt_id"]
    st.session_state.status_notice="Challenge marked complete. You can now create an evaluation prompt below."

def resume_written_attempt(attempt: dict) -> None:
    if not navigation()._flush():
        st.session_state.status_notice = "Save pending changes before continuing this attempt."
        return
    attempt=get_attempt(DB_PATH,attempt["attempt_id"])
    previous_status=attempt["status"]
    attempt.update(status="In progress", updated_at=now())
    try:
        save_attempt_details(DB_PATH, attempt,{"status":previous_status})
    except ValueError as exc:
        st.session_state.editor_navigation_error=str(exc)
        return
    st.session_state[f"status_{attempt['attempt_id']}"]="In progress"
    st.session_state.active_attempt=attempt["attempt_id"]

def insert_answer_outline(answer_key: str, headings: list[str]) -> None:
    # Never replace a draft, including text committed with this button click.
    if not st.session_state.get(answer_key, "").strip():
        st.session_state[answer_key]="\n\n".join(f"## {heading}\n" for heading in headings)

def save_evaluation_result(attempt: dict, score: float, rubric_scores: dict, weak: list, mistakes: list, feedback: str, notes: str) -> None:
    if not navigation()._flush():
        st.session_state.status_notice = "Save pending changes before recording evaluation."
        return
    attempt = get_attempt(DB_PATH, attempt["attempt_id"])
    from src.submission import evaluation_context
    challenge = next(c for c in challenges if c["id"] == attempt["challenge_id"])
    attempt["evaluation_context"] = evaluation_context(challenge, attempt_rubric(attempt, challenge))
    attempt.update(status="Evaluated",score=score,rubric_scores=rubric_scores,evaluated_at=now(),updated_at=now(),weak_topics=weak,mistake_categories=mistakes,evaluation_feedback=feedback,personal_notes=notes)
    save_attempt_details(DB_PATH,attempt)
    st.session_state[f"status_{attempt['attempt_id']}"]="Evaluated"
    st.session_state.active_attempt=attempt["attempt_id"]
    st.session_state.status_notice="Evaluation saved to your local progress database."


def attempt_rubric(attempt, challenge):
    if attempt.get("project_run_id"):
        run = capstone_store.get_run(DB_PATH, attempt["project_run_id"])
        try:
            return capstone_store.stage_rubric(run, attempt["project_stage_id"], bank)
        except ValueError:
            return {}
    return bank.get("rubrics", {}).get(challenge.get("rubric_ref"), {})


def attempt_evaluation_revision(challenge, attempt, rubric, project_context=None):
    from src.ai import evaluation_revision, revision
    version = evaluation_revision(challenge, attempt, rubric)
    if attempt.get("project_run_id"):
        project_context = project_context or capstone_store.stage_prompt_context(DB_PATH, attempt["attempt_id"])
        version = revision({"attempt": version, "project": project_context})
    return version

def bank_installation():
    return BankInstallation(BankPaths(CHALLENGES_PATH,SOURCE_PATH,VALIDATION_REPORT_PATH,IMPORTS_DIR,VERSIONS_DIR))

def safe_init() -> None:
    try:
        identity = (str(Path(DB_PATH).resolve()), Path(DB_PATH).stat().st_ino) if Path(DB_PATH).exists() else None
        if identity is None or st.session_state.get("initialized_progress_database") != identity:
            init_db(DB_PATH)
            st.session_state.initialized_progress_database = (str(Path(DB_PATH).resolve()), Path(DB_PATH).stat().st_ino)
    except Exception as e:
        logging.exception("Database initialization failed")
        st.error(f"Could not initialize local progress database: {e}"); st.stop()

def challenge_family(cid: str) -> str: return cid.split("-")[0]

def render_validation_issues(report: dict) -> None:
    issues=report.get("issues",[])
    if not issues:
        st.success("Validation passed with no findings.")
        return
    st.dataframe([{"Kind":item.get("kind"),"Finding":item.get("message"),"Location":item.get("location",item.get("challenge_id",item.get("rubric",""))),"Details":json.dumps({key:value for key,value in item.items() if key not in ("kind","message")},ensure_ascii=False)} for item in issues],width="stretch",hide_index=True)
    with st.expander("Full validation report JSON"):
        st.json(report)

def render_challenge_catalog() -> None:
    with st.expander("Browse exercises",expanded=True):
        st.caption("Search the public exercise descriptions. Narrow the list with the sidebar challenge filters.")
        search=st.text_input("Search exercises",placeholder="Title, ID, or scenario",key="catalog_search",on_change=reset_catalog_page).strip().casefold()
        status=st.selectbox("Attempt status",["All statuses","Unattempted","Not started","In progress","Completed","Evaluated"],key="catalog_status",on_change=reset_catalog_page)
        st.button("Reset catalog filters",on_click=reset_challenge_filters)
        latest={}
        for attempt in attempts:
            latest.setdefault(attempt["challenge_id"],attempt.get("status","Not started"))
        matches=[c for c in pool if (not search or search in " ".join(str(value) for value in (c["id"],c["title"],c.get("student",{}).get("scenario",""))).casefold()) and (status=="All statuses" or latest.get(c["id"],"Unattempted")==status)]
        signature=(search,status,tuple(c["id"] for c in matches))
        result_changed=st.session_state.get("catalog_signature") != signature
        st.session_state.catalog_signature=signature
        st.caption(f"{len(matches)} exercise{' matches' if len(matches)==1 else 's match'}")
        if not matches:
            st.session_state.catalog_page=1
            st.session_state.pop("catalog_choice",None)
            st.info("No exercises match. Change your search, attempt status, or sidebar filters.")
            return
        page_count=(len(matches)+24)//25
        page_number=max(1,min(st.session_state.get("catalog_page",1),page_count))
        matching_ids=[c["id"] for c in matches]
        if result_changed and st.session_state.get("catalog_choice") in matching_ids:
            page_number=matching_ids.index(st.session_state.catalog_choice)//25+1
        st.session_state.catalog_page=page_number
        page_number=st.number_input("Catalog page",min_value=1,max_value=page_count,step=1,key="catalog_page")
        visible=matches[(page_number-1)*25:page_number*25]
        st.caption(f"Page {page_number} of {page_count} · up to 25 exercises per page")
        st.dataframe([{"Title":c["title"],"ID":c["id"],"Project":c.get("capstone", {}).get("label", ""),"Difficulty":c.get("difficulty"),"Minutes":c.get("estimated_minutes"),"Status":latest.get(c["id"],"Unattempted")} for c in visible],width="stretch",hide_index=True)
        labels={c["id"]:f"{c['title']} · {c['id']}" + (" · " + c["capstone"]["label"] if c.get("capstone") else "") for c in visible}
        if st.session_state.get("catalog_choice") not in labels:
            st.session_state.catalog_choice=visible[0]["id"]
        st.selectbox("Exercise to practice",list(labels),format_func=labels.get,key="catalog_choice")
        st.button("Practice selected exercise",type="primary",on_click=lambda:open_challenge_preview(st.session_state.catalog_choice))


def render_bank_manager(current_bank: dict, current_report: dict) -> None:
    from src.authoring import parse_package
    from src.python_validation_ui import render_validation
    from src.authoring_ui import render_authoring, render_repair, render_repair_history, render_package_preview, prepare_package
    st.header("Challenge Bank")
    render_challenge_catalog()
    st.caption("Create exercises with any LLM, review the result, then append them to your bank. Existing exercises and progress are preserved; imports and the previous bank are archived.")
    render_authoring(current_bank)
    render_repair_history()
    st.subheader("Current bank validation")
    summary=st.columns(3)
    summary[0].metric("Challenges",current_report.get("normalized_challenge_count",len(current_bank.get("challenges",[]))))
    summary[1].metric("Validation findings",current_report.get("issue_count",0))
    summary[2].metric("Usable challenges",current_report.get("valid_challenges",len(current_bank.get("challenges",[]))))
    with st.expander("Bank validation details",expanded=False):
        render_validation_issues(current_report)
    st.divider()
    st.subheader("2 · Bring back the generated exercises")
    if st.session_state.pop("challenge_bank_import_applied",False):
        st.session_state.challenge_import_method="Upload JSON"
        for key in ("ai_bank_draft","ai_bank_draft_edit","ai_bank_contract","ai_bank_generation_prompt"):
            st.session_state.pop(key,None)
    upload_key=f"challenge_bank_upload_{st.session_state.get('challenge_bank_upload_generation',0)}"
    if st.session_state.pop("ai_bank_draft_pending",False):
        st.session_state.challenge_import_method="AI draft"
        st.session_state.ai_bank_draft_edit=st.session_state.ai_bank_draft
    import_modes=["Upload JSON", "Paste JSON"] + (["AI draft"] if "ai_bank_draft" in st.session_state else [])
    input_mode = st.radio("Import method", import_modes, horizontal=True,key="challenge_import_method")
    if input_mode == "Upload JSON":
        uploaded=st.file_uploader("Upload a challenge bank JSON file",type=["json"],key=upload_key)
        if not uploaded: return
        payload=uploaded.getvalue()
        import_name=uploaded.name
    elif input_mode == "AI draft":
        draft=st.text_area("Review the AI exercise draft",height=220,key="ai_bank_draft_edit")
        payload=draft.encode("utf-8")
        import_name="ai-draft-exercises.json"
    else:
        pasted=st.text_area("Paste the AI's JSON response", height=220, key=upload_key + "_paste")
        if not pasted.strip(): return
        payload=pasted.encode("utf-8")
        import_name="pasted-exercises.json"
    try:
        incoming=parse_package(payload)
        if input_mode == "AI draft" and (contract := st.session_state.get("ai_bank_contract")):
            if incoming.get("authoring") not in (None, contract):
                raise ValueError("The AI draft's authoring contract does not match the reviewed request.")
            incoming["authoring"] = contract
        elif input_mode == "Paste JSON" and incoming.get("authoring") is None:
            if st.checkbox("Use the current prompt's format and naming rules", value=True,
                    help="Assign sequential family IDs and check the format/count selected above. Turn this off for a legacy package whose original IDs you want to preserve."):
                incoming["authoring"] = st.session_state.authoring_request_contract
        candidate,candidate_report,incoming,naming_changes=prepare_package(current_bank,incoming)
    except (UnicodeDecodeError,json.JSONDecodeError,ValueError,TypeError,AttributeError) as exc:
        st.error(f"Could not prepare this challenge bank: {exc}")
        render_repair(str(exc),payload.decode("utf-8",errors="replace"))
        return
    st.subheader("3 · Review and append")
    if naming_changes:
        st.info("The app assigned current exercise, project and rubric names. References were updated together; installed exercises were not renamed.")
        st.dataframe(naming_changes,hide_index=True,width="stretch")
    st.download_button("Download reviewed exercise package", json.dumps(incoming,ensure_ascii=False,indent=2),file_name="reviewed-exercises.json",mime="application/json")
    summary=st.columns(3)
    summary[0].metric("Exercises after append",candidate_report["normalized_challenge_count"])
    summary[1].metric("Usable challenges",candidate_report["valid_challenges"])
    summary[2].metric("Validation findings",candidate_report["issue_count"])
    render_validation_issues(candidate_report)
    if candidate_report.get("duplicate_ids") or candidate_report["valid_challenges"] != len(candidate["challenges"]) or any(issue["kind"] == "rubric_total" for issue in candidate_report["issues"]):
        st.error("Resolve invalid challenges and duplicate or missing IDs before applying this bank.")
        render_repair(json.dumps(candidate_report["issues"], ensure_ascii=False, indent=2),payload.decode("utf-8",errors="replace"))
        return
    render_package_preview(candidate, incoming)
    python_ready = render_validation(DB_PATH, [c["python_playground"] for c in incoming["challenges"] if c.get("python_playground")], "import", repair_original=payload.decode("utf-8",errors="replace"))
    st.download_button("Download validation report", json.dumps(candidate_report, ensure_ascii=False, indent=2), file_name="exercise-validation.json", mime="application/json")
    if candidate_report.get("issue_count",0):
        st.warning("This bank has validation findings. Review them above; findings will remain in the saved report.")
    if st.button("Append exercises",type="primary",key="append_challenge_questions", disabled=not python_ready):
        try:
            bank_installation().install(candidate,expected_bank=current_bank,import_payload=payload,import_name=import_name)
            st.session_state.challenge_bank_upload_generation=st.session_state.get("challenge_bank_upload_generation",0)+1
            st.session_state.challenge_bank_import_applied=True
            st.session_state.bank_manager_notice="Exercises appended to the challenge bank."
            st.rerun()
        except Exception as exc:
            logging.exception("Could not apply uploaded challenge bank")
            st.error(f"The challenge bank could not be applied: {exc}")

st.sidebar.markdown("<div class='brand-lockup'><div class='brand-mark' aria-hidden='true'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M4 5h16v14H4zM4 10h16M10 5v14'/></svg></div><div><div class='brand-name'>Practice Lab</div><div class='brand-note'>Data engineering</div></div></div>",unsafe_allow_html=True)
page=st.sidebar.radio("Navigate",["Practice","Progress","Challenge Bank","Constructor Mode","Optional AI"],key="navigate",on_change=navigate_page)
from src.ai_ui import reconcile_page, render_configuration
reconcile_page(page)
from src.constructor_ui import constructor_navigation
constructor_navigation(page)
validation_job = st.session_state.get("python_validation_job")
if validation_job and page != ("Challenge Bank" if validation_job["scope"] == "import" else "Practice"):
    from src.python_validation_ui import stop_validation
    stop_validation()
if page != "Practice":
    stop_practice_jobs()
if page == "Optional AI":
    render_configuration()
    st.stop()
if page == "Constructor Mode":
    from src.constructor_ui import render_constructor
    render_constructor(DB_PATH)
    st.stop()

from src.database import export_progress, get_attempt, get_settings, init_db, list_attempts, merge_progress, save_attempt, save_diagram, save_settings, save_attempt_details
from src.diagrams import validate_diagram
from src.prompt_builder import student_prompt, evaluation_prompt
from src.progression import unlock_next
from src.selector import eligible_challenges, select_challenge
from src.statistics import overview, weak_topic_summary

try:
    installed_bank=bank_installation().load(BUNDLED_CHALLENGES_PATH)
    bank=installed_bank.bank
    challenges=bank["challenges"]; safe_init()
    if bank.get("bank", {}).get("bundled_upgrade_conflicts"):
        st.warning("Bundled SQL updates preserved locally modified exercises for review: " + ", ".join(bank["bank"]["bundled_upgrade_conflicts"]))
    if bank.get("bank", {}).get("constructor_upgrade_conflicts"):
        st.warning("Constructor updates preserved modified challenges: " + ", ".join(bank["bank"]["constructor_upgrade_conflicts"]))
except Exception as exc:
    logging.exception("Application startup failed"); st.error(f"The challenge bank could not be loaded. Check data/challenges.json and the validation report. Details: {exc}"); st.stop()

attempts=list_attempts(DB_PATH,include_diagrams=False,include_content=False); stats=overview(attempts); paths=bank.get("bank",{}).get("learning_paths",[])
from src import capstone_store
# Restore a run's immutable brief before rendering a saved stage or its tool.
if page == "Practice" and st.query_params.get("project"):
    try:
        saved_run = capstone_store.get_run(DB_PATH, st.query_params["project"])
        sid = st.query_params.get("stage")
        if sid in saved_run["stage_attempts"]:
            st.session_state.active_attempt = saved_run["stage_attempts"][sid]
            st.session_state.active_challenge = saved_run["challenges"][sid]["id"]
            st.session_state.mode = PracticeNavigation._mode(saved_run["challenges"][sid])
        else:
            st.session_state.mode = "Connected Capstone"
        st.session_state.capstone_run = saved_run["run_id"]
    except (ValueError, KeyError):
        st.warning("That saved project is unavailable. Choose an existing run below.")
        for key in ("project", "stage", "attempt", "workspace"):
            st.query_params.pop(key, None)
        for key in ("capstone_run", "active_attempt", "active_challenge", "attempt_constructor"):
            st.session_state.pop(key, None)
        st.session_state.mode = "Connected Capstone"
active_saved = get_attempt(DB_PATH, st.session_state.get("active_attempt")) if st.session_state.get("active_attempt") else None
if page == "Practice" and (editor_error := st.session_state.get("editor_navigation_error")):
    st.warning(editor_error)
if active_saved and active_saved.get("project_run_id"):
    saved_run = capstone_store.get_run(DB_PATH, active_saved["project_run_id"])
    snapshot = saved_run["challenges"][active_saved["project_stage_id"]]
    challenges = [c for c in challenges if c["id"] != snapshot["id"]] + [snapshot]
challenge_by_id={c["id"]:c for c in challenges}
if st.session_state.pop("artifact_returned", False):
    from src.constructor_ui import close_constructor_tool
    close_constructor_tool()
if page == "Practice":
    route = st.session_state.get("attempt_constructor")
    if not route and st.query_params.get("workspace") and st.query_params.get("attempt", "").isdigit():
        route = (int(st.query_params["attempt"]), st.query_params["workspace"])
        st.session_state.attempt_constructor = route
    if route:
        linked_attempt = get_attempt(DB_PATH, route[0])
        linked_challenge = challenge_by_id.get((linked_attempt or {}).get("challenge_id"))
        if linked_challenge:
            from src.attempt_constructor import render_workspace
            render_workspace(DB_PATH, linked_challenge, *route, attempt=linked_attempt)
            st.stop()
page_hero={
    "Practice":("Build skill through practice.","Choose a focused session and work through realistic data engineering challenges."),
    "Progress":("See how your practice is adding up.","Review completed work, scores, consistency, and the topics to revisit."),
    "Challenge Bank":("Grow your challenge bank.","Append new exercises and review the quality of your current bank."),
}
title,description=page_hero[page]
st.markdown(f"<div class='page-hero'><p class='page-context'>Practice Lab / {escape(page)}</p><h1>{title}</h1><p class='subline'>{description}</p></div>",unsafe_allow_html=True)
st.sidebar.divider()
families=["All families"]+sorted({challenge_family(c["id"]) for c in challenges})
types=["All types"]+sorted({c.get("type","Other") for c in challenges})
path_names=["All paths"]+[p["name"] for p in paths]
restored_filters=st.session_state.pop("restored_filter_settings",None)
if restored_filters is not None:
    for filter_key in FILTER_DEFAULTS:
        st.session_state.pop(filter_key,None)
    st.session_state.pop("saved_filter_settings",None)
if "saved_filter_settings" not in st.session_state:
    restore_filter_settings(st.session_state,restored_filters if restored_filters is not None else get_settings(DB_PATH))
for filter_key, options in (("filter_family",families),("filter_type",types),("filter_path",path_names)):
    if st.session_state.get(filter_key,options[0]) not in options:
        st.session_state[filter_key]=options[0]
with st.sidebar.expander("Challenge filters",expanded=False):
    family=st.selectbox("Challenge family",families,key="filter_family",on_change=clear_direct_preview); ctype=st.selectbox("Challenge type",types,key="filter_type",on_change=clear_direct_preview)
    difficulty=st.selectbox("Difficulty",["Any",1,2,3,4,5],key="filter_difficulty",on_change=clear_direct_preview); max_minutes=st.number_input("Maximum time (minutes)",min_value=10,max_value=600,value=180,step=10,key="filter_minutes",on_change=clear_direct_preview)
    path=st.selectbox("Learning path",path_names,key="filter_path",on_change=clear_direct_preview); exclude_completed=st.checkbox("Exclude completed",value=False,key="filter_completed",on_change=clear_direct_preview); include_attempted=st.checkbox("Include attempted",value=True,key="filter_attempted",on_change=clear_direct_preview)
    st.button("Reset filters",on_click=reset_challenge_filters)
settings={**{key:st.session_state[key] for key in FILTER_DEFAULTS if key not in ("filter_minutes","filter_path","filter_completed")},"preferred_difficulty":difficulty if isinstance(difficulty,int) else 3,"maximum_session_time":max_minutes,"last_learning_path":path,"exclude_completed":exclude_completed}
if "saved_filter_settings" not in st.session_state:
    st.session_state.saved_filter_settings=settings.copy()
elif settings != st.session_state.saved_filter_settings:
    save_settings(DB_PATH,settings)
    st.session_state.saved_filter_settings=settings.copy()
filters={"family":family,"challenge_type":ctype,"difficulty":difficulty if isinstance(difficulty,int) else None,"max_minutes":max_minutes,"learning_path":path,"paths":paths}
pool=eligible_challenges(challenges,include_project_stages=page=="Challenge Bank",**filters)
completed_ids={a["challenge_id"] for a in attempts if a.get("status") in ("Completed","Evaluated")}
attempted_ids={a["challenge_id"] for a in attempts}
if exclude_completed: pool=[c for c in pool if c["id"] not in completed_ids]
if not include_attempted: pool=[c for c in pool if c["id"] not in attempted_ids]

if page=="Challenge Bank":
    if "bank_manager_notice" in st.session_state:
        st.success(st.session_state.pop("bank_manager_notice"))
    render_bank_manager(bank,installed_bank.report)
elif page=="Progress":
    from src.progress_charts import chart_spec
    project_runs = capstone_store.list_runs(DB_PATH)
    if project_runs:
        current_projects = 0
        for project in project_runs:
            if project.get("completion"):
                _, _, project_states, signature = capstone_store.view(DB_PATH, project["run_id"])
                current_projects += project["completion"]["fingerprint"] == signature and all(s["current"] for s in project_states.values())
        st.metric("Connected capstones completed", f"{current_projects} / {len(project_runs)} runs")
        st.caption("Projects count once per run. Stage attempts are excluded from independent challenge and average score totals.")
    if "backup_restore_notice" in st.session_state:
        st.success(st.session_state.pop("backup_restore_notice"))
    conf=[a["confidence"] for a in attempts if a.get("confidence") is not None]
    mins=[a["minutes_taken"] for a in attempts if a.get("minutes_taken") is not None]
    score=f"{stats['average_score']:g}" if stats["average_score"] is not None else "Not evaluated"
    confidence=f"{sum(conf)/len(conf):.1f} / 5" if conf else "Not recorded"
    summary_items=[
        (f"{stats['completed']} / {sum(not c.get('capstone') for c in challenges)}", "challenges completed", "Completed or evaluated independent challenges"),
        (str(stats["in_progress"]), "in progress", "Challenges with active work"),
        (score, "average score", f"{stats['score_count']} scored attempts"),
        (confidence, "average confidence", f"{len(conf)} rated attempts"),
    ]
    with st.container(key="progress_overview"):
        summary="".join(f"<div><strong class='{'unscored' if value in ('Not evaluated','Not recorded') else ''}'>{escape(value)}</strong><span>{escape(label)}</span><small>{escape(basis)}</small></div>" for value,label,basis in summary_items)
        st.markdown(f"<div class='practice-summary progress-summary' role='group' aria-label='Progress overview'>{summary}</div>",unsafe_allow_html=True)
    with st.container(key="progress_habits"):
        time_column,hint_column=st.columns(2,gap="large")
        time_column.metric("Average time",f"{sum(mins)/len(mins):.0f} min" if mins else "Not recorded",help=f"Based on {len(mins)} timed attempts")
        hint_column.metric("Hint views",sum(len(a.get("hints_used",[])) for a in attempts))
    st.markdown("<h2 class='progress-section'>Activity and topics</h2>",unsafe_allow_html=True)
    st.caption("See where you have practiced and which topics need another pass.")
    with st.container(key="progress_analysis"):
        t1,t2=st.columns(2,gap="large")
        with t1:
            st.subheader("Attempts over time")
            bydate={}
            for a in attempts:
                date=(a.get("updated_at") or "")[:10]
                if date: bydate[date]=bydate.get(date,0)+1
            if bydate: st.vega_lite_chart(chart_spec({"Attempts":dict(sorted(bydate.items()))},line=True))
            else: st.caption("Your activity will appear here after you start a challenge.")
            st.subheader("Completion by family")
            counts={}
            for c in challenges:
                fam=challenge_family(c["id"]); counts.setdefault(fam,[0,0]); counts[fam][1]+=1
                if c["id"] in completed_ids: counts[fam][0]+=1
            st.vega_lite_chart(chart_spec({"Completed":{k:v[0] for k,v in counts.items()},"Available":{k:v[1] for k,v in counts.items()}}))
        with t2:
            st.subheader("Topic performance")
            topic_rows=stats["weak_topics"]
            if topic_rows:
                scored=[r for r in topic_rows if r["average_score"] is not None]
                if scored: st.vega_lite_chart(chart_spec({"Average score":{r["topic"]:r["average_score"] for r in scored}}))
                st.dataframe(topic_rows,width="stretch",hide_index=True)
            else: st.caption("Record an evaluation to see the topics to revisit. Completed attempts without an evaluation do not have scores.")
            scores_by_topic={}
            for attempt in attempts:
                if attempt.get("score") is None: continue
                for topic, ids in bank.get("bank",{}).get("topic_index",{}).items():
                    if attempt.get("challenge_id") in ids:
                        scores_by_topic.setdefault(topic,[]).append(float(attempt["score"]))
            topic_means={topic:sum(vals)/len(vals) for topic,vals in scores_by_topic.items()}
            if topic_means:
                topic_counts={topic:len(scores_by_topic[topic]) for topic in topic_means}
                st.subheader("Topic strengths and review areas")
                st.caption("Each topic shows its supporting scored attempts; use caution with small samples.")
                strong=sorted(topic_means,key=topic_means.get,reverse=True)[:5]
                weak=sorted(topic_means,key=topic_means.get)[:5]
                st.dataframe([{"Group":"Strongest","Topic":t,"Average score":round(topic_means[t],1),"Attempts":topic_counts[t]} for t in strong]+[{"Group":"Needs review","Topic":t,"Average score":round(topic_means[t],1),"Attempts":topic_counts[t]} for t in weak],width="stretch",hide_index=True)
    st.markdown("<h2 class='progress-section'>Practice history</h2>",unsafe_allow_html=True)
    st.caption("Revisit a saved attempt or review your latest completed work.")
    st.subheader("Recent activity")
    from src.attempt_resume import saved_challenge
    runs_by_id = {r["run_id"]: r for r in project_runs}
    history_challenges = {a["attempt_id"]: saved_challenge(a, challenge_by_id, runs_by_id) for a in attempts}
    if attempts:
        st.dataframe([{"Challenge":(history_challenges[a["attempt_id"]] or {}).get("title","Unavailable challenge"),"ID":a["challenge_id"],"Attempt":a["attempt_id"],"Status":a["status"],"Score":a["score"],"Updated":a["updated_at"]} for a in attempts[:10]],width="stretch",hide_index=True)
    else:
        st.caption("Your attempts will appear here after you start a challenge.")
    if attempts:
        labels={a["attempt_id"]:f"{(history_challenges[a['attempt_id']] or {}).get('title','Unavailable challenge')} · {a['challenge_id']} · {a['status']} · {a['updated_at'][:10]} · Attempt {a['attempt_id']}" for a in attempts}
        with st.container(key="progress_reopen"):
            history_choice,history_action=st.columns([3,1],vertical_alignment="bottom")
            selected=history_choice.selectbox("Practice history",list(labels),format_func=labels.get,key="progress_attempt_choice")
        selected_attempt=next(a for a in attempts if a["attempt_id"]==selected)
        available=history_challenges[selected] is not None
        history_action.button("Open attempt",disabled=not available,on_click=lambda:open_navigation_attempt(st.session_state.progress_attempt_choice),use_container_width=True)
        if not available: st.caption("This challenge is unavailable in the current bank. Your saved attempt remains in progress backups.")
    recent_done=[a for a in attempts if a.get("status") in ("Completed","Evaluated")][:10]
    st.subheader("Recently completed challenges")
    if recent_done:
        st.dataframe([{"Challenge":a["challenge_id"],"Status":a["status"],"Score":a["score"],"Completed":a.get("completed_at")} for a in recent_done],width="stretch",hide_index=True)
    else:
        st.caption("No completed challenges yet. Finish an attempt in Practice to see it here.")
    if topic_rows:
        st.markdown("<h2 class='progress-section'>Next practice</h2>",unsafe_allow_html=True)
        recommended=select_challenge(pool,attempts,adaptive=True,weak_topics=[topic_rows[0]["topic"]])
        st.info(f"Recommended next challenge: {recommended['id']} · {recommended['title']}" if recommended else "No challenge matches the current filters. Adjust or reset the sidebar filters.")
        st.button("Practice recommended challenge",disabled=not recommended,on_click=open_challenge_preview,args=(recommended["id"] if recommended else None,))
    st.markdown("<h2 class='progress-section'>Keep your work</h2>",unsafe_allow_html=True)
    st.caption("Download a backup or merge progress from another session.")
    with st.expander("Back up or restore progress"):
        st.caption("Includes practice attempts, linked deliverables and connected capstones. Standalone diagrams, pipelines and mock recipes need their own JSON exports. The challenge bank is not included.")
        # Streamlit 1.52+ builds the complete backup on the download thread.
        # Bind the database now: this callback must not read another session's
        # state or a later application's DB_PATH. Older supported versions keep
        # the existing eager behavior without changing the download format.
        backup_factory=lambda path=Path(DB_PATH): json.dumps(export_progress(path),ensure_ascii=False,indent=2)
        deferred_download=tuple(int(part) for part in st.__version__.split(".")[:2]) >= (1,52)
        st.download_button("Download progress backup",backup_factory if deferred_download else backup_factory(),file_name=f"practice_lab_backup_{datetime.now().date().isoformat()}.json",mime="application/json")
        st.caption("Restoring merges attempts into your existing progress. Matching attempts are updated only when the backup is newer; unrelated local attempts remain.")
        uploaded_backup=st.file_uploader("Choose a Practice Lab backup",type=["json"],key="progress_backup")
        if uploaded_backup and st.button("Merge progress backup",key="merge_progress_backup"):
            try:
                backup_data=json.loads(uploaded_backup.getvalue().decode("utf-8"))
                merge_result=merge_progress(DB_PATH,backup_data)
                st.session_state.restored_filter_settings=get_settings(DB_PATH)
                st.session_state.backup_restore_notice=f"Backup merged: {merge_result['added']} added, {merge_result['updated']} updated, {merge_result['unchanged']} already current."
                st.rerun()
            except (UnicodeDecodeError,json.JSONDecodeError,ValueError) as exc:
                st.error(f"Could not restore this backup: {exc}")

else:
    if st.session_state.get("mode") == "Connected Capstone":
        render_session_choices()
        from src.capstone_ui import render_projects
        render_projects(DB_PATH, bank, navigation(), continue_saved_work)
        st.stop()
    if "status_notice" in st.session_state:
        st.success(st.session_state.pop("status_notice"))
    challenge_by_id={c["id"]:c for c in challenges}
    from src.attempt_resume import most_recent, destination
    pending = most_recent(attempts, challenge_by_id)
    if pending:
        pending = get_attempt(DB_PATH, pending["attempt_id"])
        target, label = destination(pending, challenge_by_id[pending["challenge_id"]])
        from src.constructor_models import slot_statuses
        required = [s for s in slot_statuses(pending.get("constructor_workspace")) if s["required"]]
        ready = sum(s["evidence"] == "Ready" for s in required)
        with st.container(key="resume_writing"):
            details, action = st.columns([3, 1], vertical_alignment="center")
            with details:
                st.markdown("<p class='resume-label'>Continue your work</p>", unsafe_allow_html=True)
                st.markdown(f"<p class='resume-title'>{escape(challenge_by_id[pending['challenge_id']]['title'])}</p>", unsafe_allow_html=True)
                saved = pending.get("activity_at") or pending.get("updated_at")
                st.caption(f"{label} · Last saved: {saved or 'No saved edits'} · {ready}/{len(required)} required deliverables ready")
            with action:
                action_label = label if label.split()[0].isupper() or label.startswith("Python") else label[:1].lower() + label[1:]
                st.button("Continue " + action_label, on_click=continue_saved_work, args=(pending["attempt_id"],), use_container_width=True)
                st.button("View attempt", on_click=open_navigation_attempt, args=(pending["attempt_id"],), use_container_width=True)
    with st.container(key="practice_overview"):
        score=f"{stats['average_score']:g}" if stats["average_score"] is not None else "Not evaluated"
        st.markdown(f"<div class='practice-summary' role='group' aria-label='Practice overview'><div><strong>{len(challenges)}</strong><span>challenges to explore</span></div><div><strong>{stats['completed']}</strong><span>completed</span></div><div><strong>{stats['in_progress']}</strong><span>in progress</span></div><div><strong class='{'unscored' if stats['average_score'] is None else ''}'>{score}</strong><span>average score · {stats['score_count']} scored attempts</span></div></div>",unsafe_allow_html=True)
    render_session_choices()
    mode=st.session_state.get("mode","Daily Scenario")
    candidate_pool=pool
    if mode=="Daily Scenario": candidate_pool=[c for c in pool if challenge_family(c["id"])=="SCN"]
    elif mode=="Complete Case Study": candidate_pool=[c for c in pool if challenge_family(c["id"])=="CASE"]
    elif mode=="SQL Practice":
        candidate_pool=[c for c in pool if c.get("sql_playground") and not c.get("data_quality_detective")]
    elif mode=="Python Practice":
        candidate_pool=[c for c in pool if c.get("python_playground")]
    elif mode=="Data-quality Detective":
        candidate_pool=[c for c in pool if c.get("data_quality_detective")]
    reopened_attempt=get_attempt(DB_PATH,st.session_state.active_attempt) if st.session_state.get("active_attempt") else None
    explicit_id=reopened_attempt["challenge_id"] if reopened_attempt else st.session_state.get("direct_preview")
    if mode in ("SQL Practice", "Data-quality Detective", "Python Practice"):
        chooser_pool=list(candidate_pool)
        if explicit_id in challenge_by_id and explicit_id not in {c["id"] for c in chooser_pool}:
            chooser_pool.insert(0,challenge_by_id[explicit_id])
        if chooser_pool:
            def select_sql_exercise():
                navigation().go("exercise",st.session_state.sql_challenge_choice)
            ids=[c["id"] for c in chooser_pool]
            labels={c["id"]:f"{c['id']} · {c['title']}" for c in chooser_pool}
            if explicit_id in ids:
                st.session_state.sql_challenge_choice=explicit_id
            chosen=st.selectbox("Investigation" if mode=="Data-quality Detective" else "Python exercise" if mode=="Python Practice" else "SQL exercise",ids,format_func=labels.get,key="sql_challenge_choice",on_change=select_sql_exercise)
            if not st.session_state.get("active_attempt"):
                st.session_state.active_challenge=chosen
    weak_rows=stats["weak_topics"]
    weak_topic=weak_rows[0]["topic"] if weak_rows else None
    if mode=="Review Weak Area" and weak_topic:
        weak_pool=[c for c in pool if weak_topic in c.get("internal",{}).get("topics",[])]
        repeated=next((row.get("attempts",0) for row in weak_rows if row["topic"]==weak_topic),0)>=2
        if weak_pool and repeated and difficulty=="Any":
            easier=[c for c in weak_pool if c.get("difficulty",3)<3]
            if easier: weak_pool=easier
        candidate_pool=weak_pool
        st.caption(f"Review topic: {weak_topic}.")
    elif mode=="Review Weak Area":
        st.caption("No review topics recorded yet. Start a challenge and record weak topics after evaluation to personalize this route.")
    match_summary=st.empty()
    active_filters=[]
    if family!="All families": active_filters.append(str(family))
    if ctype!="All types": active_filters.append(str(ctype))
    if difficulty!="Any": active_filters.append(f"Difficulty {difficulty}")
    if max_minutes!=180: active_filters.append(f"Up to {max_minutes} min")
    if path!="All paths": active_filters.append(str(path))
    if exclude_completed: active_filters.append("Uncompleted only")
    if not include_attempted: active_filters.append("Unattempted only")
    if active_filters:
        with st.container(key="active_filters"):
            summary,reset=st.columns([4,1],vertical_alignment="center")
            with summary:
                st.markdown("<div class='filter-summary'>"+"".join(f"<span>{escape(value)}</span>" for value in active_filters)+"</div>",unsafe_allow_html=True)
            with reset:
                st.button("Clear filters",key="clear_visible_filters",on_click=reset_challenge_filters,use_container_width=True)
    if not candidate_pool: st.warning(f"No challenges in {mode} match these filters. Adjust the sidebar filters or choose another session.")
    challenge_by_id={c["id"]:c for c in challenges}
    if reopened_attempt and reopened_attempt["challenge_id"] in challenge_by_id:
        st.session_state.active_challenge=reopened_attempt["challenge_id"]
    elif st.session_state.get("direct_preview") in challenge_by_id:
        st.session_state.active_challenge=st.session_state.direct_preview
    elif st.session_state.get("active_challenge") not in {c["id"] for c in candidate_pool}:
        selected_challenge=select_challenge(candidate_pool,attempts,preferred_difficulty=settings["preferred_difficulty"],adaptive=mode=="Review Weak Area",weak_topics=[weak_topic] if weak_topic else None,seed=None)
        st.session_state.active_challenge=selected_challenge["id"] if selected_challenge else None
        st.session_state.pop("active_attempt",None)
    active_id=st.session_state.get("active_challenge")
    written_mode=mode not in ("SQL Practice","Data-quality Detective","Python Practice")
    if written_mode:
        alternatives=[c["id"] for c in candidate_pool if c["id"] != active_id]
        with match_summary.container():
            matching,another=st.columns([3,1],vertical_alignment="center")
            with matching:
                st.caption(f"{len(candidate_pool)} matching challenge{'s' if len(candidate_pool) != 1 else ''} · {mode}")
            with another:
                st.button("Give me another",disabled=not alternatives,on_click=choose_another_challenge,args=([c["id"] for c in candidate_pool],mode=="Review Weak Area",weak_topic,settings["preferred_difficulty"]),use_container_width=True)
        if candidate_pool and not alternatives: st.caption("Only one challenge matches. Adjust or reset the filters for more choices.")
    else:
        match_summary.caption(f"{len(candidate_pool)} matching challenge{'s' if len(candidate_pool) != 1 else ''} · {mode}")
    if reopened_attempt and active_id not in {c["id"] for c in candidate_pool}:
        st.caption("Showing your saved attempt outside the current session filters.")
    elif st.session_state.get("direct_preview") and active_id not in {c["id"] for c in candidate_pool}:
        st.caption("Showing your selected exercise outside the current session filters. Change the filters or choose another session to return to matching exercises.")
    drafts=WrittenDrafts(st.session_state,DB_PATH).begin_render()
    with st.expander("Reopen a previous attempt",expanded=False):
        options=[a for a in attempts if a["challenge_id"] in challenge_by_id and a.get("status") in ("Not started","In progress","Completed","Evaluated")]
        if options:
            labels={f"{a['challenge_id']} · {a['status']} · {a['updated_at'][:10]} · Attempt {a['attempt_id']}":a for a in options}
            selected=st.selectbox("Saved attempts",list(labels),key="saved_attempt_choice")
            def reopen_selected_attempt():
                open_navigation_attempt(labels[st.session_state.saved_attempt_choice]["attempt_id"])
            st.button("Open saved attempt",on_click=reopen_selected_attempt)
        else: st.caption("No saved attempts yet. Choose an exercise and select Start challenge to begin.")
    if active_id in challenge_by_id:
        c=challenge_by_id[active_id]; saved=reopened_attempt
        if not c.get("python_playground"):
            if st.session_state.get("python_job"):
                from src.python_ui import stop_python_job
                stop_python_job()
            if st.session_state.get("python_validation_job"):
                from src.python_validation_ui import stop_validation
                stop_validation()
        if saved and saved.get("challenge_id") != c["id"]:
            saved=None
            st.session_state.pop("active_attempt",None)
        attempt_data=saved or next((a for a in attempts if a["challenge_id"]==c["id"] and a["status"] in ("Not started","In progress")),None)
        with st.container(key="challenge_heading"):
            heading,action=st.columns([3,1],vertical_alignment="center")
            with heading:
                st.subheader(c["title"])
                st.caption(f"{c['id']} · Difficulty {c.get('difficulty',1)} / 5 · {c.get('estimated_minutes','?')} min · {attempt_data['status'] if attempt_data else 'Preview'}")
            with action:
                if not attempt_data:
                    st.button("Start challenge",type="primary",key=f"start_{c['id']}",on_click=start_challenge,args=(c['id'],),use_container_width=True)
            if not attempt_data:
                st.caption("Read the brief, then start when you’re ready. Your progress begins when you start the challenge.")
        student=c.get("student",{})
        written_practice=not any(c.get(field) for field in ("sql_playground", "python_playground", "data_quality_detective"))
        def show_challenge_outline():
            for heading,key in [("Scenario","scenario"),("Requirements","requirements"),("Tasks","tasks"),("Constraints","constraints"),("Deliverables","deliverables")]:
                st.markdown(f"**{heading}**")
                value=student.get(key,[] if key!="scenario" else "")
                st.markdown(value if isinstance(value,str) else "\n".join(f"- {x}" for x in value) or "- None specified")
            st.markdown("**Required artifacts** · "+", ".join(c.get("artifacts_required",[])))
        notebook_section("01", "Brief")
        if (written_practice or c.get("data_quality_detective") or c.get("python_playground")) and attempt_data:
            with st.expander("Challenge outline · requirements and deliverables"):
                show_challenge_outline()
        else:
            brief,work,output=st.tabs(["Brief","Requirements & tasks","Deliverables"])
            with brief:
                st.markdown(student.get("scenario", ""))
                constraints=student.get("constraints",[])
                if constraints:
                    st.markdown("**Constraints**")
                    st.markdown(constraints if isinstance(constraints,str) else "\n".join(f"- {item}" for item in constraints))
            with work:
                for heading,key in [("Requirements","requirements"),("Tasks","tasks")]:
                    st.markdown(f"**{heading}**")
                    value=student.get(key,[])
                    st.markdown(value if isinstance(value,str) else "\n".join(f"- {item}" for item in value) or "- None specified")
            with output:
                value=student.get("deliverables",[])
                st.markdown(value if isinstance(value,str) else "\n".join(f"- {item}" for item in value) or "- None specified")
                st.markdown("**Required artifacts** · "+", ".join(c.get("artifacts_required",[])))
        if c.get("sql_playground") and not c.get("data_quality_detective"):
            from src.sql_ui import schema_browser
            schema_browser(c["sql_playground"])
        elif not c.get("sql_playground"):
            if st.session_state.get("sql_job") or st.session_state.get("detective_profile_job"):
                from src.sql_ui import stop_sql_job
                stop_sql_job()
        if not attempt_data:
            st.stop()
        attempt_data=get_attempt(DB_PATH,attempt_data["attempt_id"])
        aid=attempt_data["attempt_id"]
        started=(attempt_data or {}).get("started_at") or now()
        notebook_section("02", "Workspace")
        if attempt_data.get("project_run_id"):
            from src.capstone_ui import render_stage_header
            render_stage_header(DB_PATH, attempt_data, navigation())
        st.caption(f"Started: {started} · Elapsed: {max(0,int((datetime.now(timezone.utc)-parse_time(started)).total_seconds()//60))} min")
        from src.attempt_constructor import render_deliverables
        render_deliverables(DB_PATH, c, attempt_data, navigation())
        if c.get("diagram_kind") and not attempt_data.get("constructor_workspace"):
            st.markdown("**Your ER diagram**")
            st.caption("Build a diagram here. It saves to this attempt and will be included in your evaluation prompt.")
            try:
                from src.erd_component import erd_editor
                diagram_value=erd_editor(aid,c["diagram_kind"],attempt_data.get("diagram"))
                if diagram_value is not None and diagram_value != attempt_data.get("diagram"):
                    validate_diagram(diagram_value,c["diagram_kind"])
                    save_diagram(DB_PATH,aid,diagram_value)
                    attempt_data=get_attempt(DB_PATH,aid)
            except (ValueError,OSError) as exc:
                st.error(f"Could not save the ER diagram: {exc}")
        if c.get("dataset_sql"):
            from src.capstone_sql_ui import render_sql
            render_sql(DB_PATH, attempt_data)
            attempt_data=get_attempt(DB_PATH,aid)
        elif c.get("data_quality_detective"):
            from src.detective_ui import render_detective
            render_detective(DB_PATH,attempt_data,c)
            attempt_data=get_attempt(DB_PATH,aid)
        elif c.get("sql_playground"):
            from src.sql_ui import render_workspace
            render_workspace(DB_PATH,attempt_data,c["sql_playground"])
            attempt_data=get_attempt(DB_PATH,aid)
        if c.get("python_playground"):
            from src.python_ui import render_python
            render_python(DB_PATH,attempt_data,c["python_playground"])
            attempt_data=get_attempt(DB_PATH,aid)
        detective=c.get("data_quality_detective")
        python_exercise=bool(c.get("python_playground"))
        if not attempt_data.get("project_run_id"):
            draft_form=drafts.mount(attempt_data,written=written_practice)
            key=draft_form.key
        if written_practice and not attempt_data.get("project_run_id"):
            outline=student.get("deliverables") or student.get("tasks") or []
            if isinstance(outline,str): outline=[outline]
            if outline:
                with st.expander("Optional answer outline"):
                    st.caption("Use these headings as a starting point, or write freely. The outline contains no suggested answers.")
                    st.code("\n\n".join(f"## {heading}\n" for heading in outline),language="markdown")
                    has_draft=bool(st.session_state.get(key,attempt_data.get("answer","" )).strip())
                    st.button("Insert outline into empty answer",key=f"outline_{aid}",disabled=has_draft,on_click=insert_answer_outline,args=(key,outline))
                    if has_draft: st.caption("Your draft is kept intact. Copy any headings you want to add from the outline above.")
        if attempt_data.get("project_run_id"):
            from src.capstone_ui import render_writing
            draft_form=render_writing(drafts, attempt_data, capstone_store.get_run(DB_PATH, attempt_data["project_run_id"]))
            key=draft_form.key
            answer=draft_form.answer
        else:
            answer=st.text_area("Reasoning (optional)" if python_exercise else "Additional notes (optional)" if detective else "Your solution",height=140 if detective or python_exercise else 300,key=key,placeholder="Explain your approach and its time and memory use…" if python_exercise else "Record anything beyond the findings and repair plan…" if detective else "Work through the tasks and record your reasoning here…")
        st.caption("Written changes save when you leave a field. Wait for Saved before closing the page.")
        save_feedback=st.container(key=f"answer_feedback_{aid}").empty()
        answer_status_slot=st.empty()
        notebook_section("03", "Review")
        submission_slot = st.container()
        status_key=f"status_{aid}"
        if status_key not in st.session_state:
            initial_status=(attempt_data or {}).get("status","In progress")
            st.session_state[status_key]=initial_status if initial_status in ("Not started","In progress","Completed","Evaluated") else "In progress"
        if written_practice:
            status_value=attempt_data.get("status","In progress")
            st.caption(f"Attempt status: {status_value}")
        else:
            status_value=st.selectbox("Attempt status",["Not started","In progress","Completed","Evaluated"],key=status_key)
        from src.constructor_artifacts import evidence_errors
        artifact_problems = evidence_errors(attempt_data.get("constructor_workspace"), answer)
        if attempt_data.get("project_run_id"):
            artifact_problems = capstone_store.errors_for_attempt(DB_PATH, {**attempt_data, "answer": answer})
        if artifact_problems and status_value in ("Completed", "Evaluated") and attempt_data["status"] not in ("Completed", "Evaluated"):
            status_value = attempt_data["status"]
        if artifact_problems:
            st.info("Required deliverables remaining:\n" + "\n".join(f"- {error}" for error in artifact_problems))
        confidence=st.select_slider("Confidence",options=[None,1,2,3,4,5],value=attempt_data.get("confidence"),
            format_func=lambda value:"Not recorded" if value is None else str(value),key=draft_form.confidence_key)
        hints_used=(attempt_data or {}).get("hints_used",[]); complications_used=(attempt_data or {}).get("complications_used",[])
        latest={**attempt_data,"attempt_id":aid,"challenge_id":c["id"],"status":status_value,"started_at":attempt_data.get("started_at"),"updated_at":now(),"answer":answer,"confidence":confidence,"hints_used":hints_used,"complications_used":complications_used}
        draft_save=drafts.save(attempt_data,answer=answer,status=status_value,confidence=confidence,started_at=attempt_data.get("started_at"))
        attempt_data=draft_save.attempt
        save_error=draft_save.failed
        if not save_error:
            latest=attempt_data.copy()
        from src.submission_ui import render_overview
        project_context = capstone_store.stage_prompt_context(DB_PATH, aid) if attempt_data.get("project_run_id") else None
        with submission_slot:
            render_overview(DB_PATH, attempt_data, navigation(), answer, attempt_rubric(attempt_data,c))
        if st.session_state.get("optional_ai"):
            from src.ai import evaluation_revision
            ai_request,_,_=st.session_state.optional_ai.snapshot()
            if ai_request and ai_request.operation=="evaluation":
                st.session_state.optional_ai.reconcile(f"attempt:{aid}",attempt_evaluation_revision(c,attempt_data,attempt_rubric(attempt_data,c),project_context))
        saved_time=attempt_data.get("updated_at")
        message="Save failed · Your answer remains in this session. Retry saving or copy it before leaving." if save_error else "Saved" + (f" · {parse_time(saved_time).strftime('%d %b %Y, %H:%M UTC')}" if saved_time else "")
        save_feedback.caption(message)
        from src.answer_status import answer_status
        with answer_status_slot.container():
            answer_status(key,attempt_data.get("answer",""),message,save_error)
        if save_error:
            st.button("Retry saving answer",key=f"retry_answer_{aid}")
        if draft_save.conflict:
            st.warning("This attempt changed in another tab. Your draft is kept here. Review the saved answer and choose which version to keep.")
            with st.expander("Latest saved answer",expanded=True):
                st.text(attempt_data.get("answer",""))
            st.download_button("Download your draft",answer,file_name=f"{c['id']}_draft.txt",mime="text/plain",key=f"conflict_download_{aid}")
            st.button("Use saved answer",key=f"conflict_saved_{aid}",on_click=drafts.resolve_conflict,args=(aid,False))
            st.button("Save my draft instead",key=f"conflict_keep_{aid}",on_click=drafts.resolve_conflict,args=(aid,True))
        if written_practice and status_value in ("Not started","Completed","Evaluated"):
            st.button("Continue writing",key=f"resume_{aid}",disabled=save_error,on_click=resume_written_attempt,args=(latest,))
        if status_value != "Not started":
            st.button("Move to Not started",key=f"remove_status_{aid}",disabled=save_error,on_click=move_attempt_to_not_started,args=(latest,))
        elif status_value == "Not started":
            st.caption("This attempt is kept as a draft and is excluded from In progress and completed totals.")
        with st.expander("Optional hint (unlocks progressively)"):
            if len(hints_used)<len(c.get("hints",[])) and st.button(f"Reveal Hint {len(hints_used)+1}",disabled=save_error,key=f"hint_{c['id']}_{aid}"):
                _,hints_used=unlock_next(c.get("hints",[]),hints_used); latest["hints_used"]=hints_used; latest["updated_at"]=now(); save_attempt_details(DB_PATH,latest)
            for hint_index in hints_used:
                if 1 <= hint_index <= len(c.get("hints",[])):
                    st.info(f"Hint {hint_index}: {c['hints'][hint_index-1]}")
            if not c.get("hints"): st.caption("No hints supplied for this challenge.")
        with st.expander("Make it harder · optional stretch work"):
            next_ix=len(complications_used)
            if next_ix<len(c.get("follow_up_complications",[])) and st.button(f"Open complication {next_ix+1}",disabled=save_error,key=f"comp_{aid}"):
                _,complications_used=unlock_next(c.get("follow_up_complications",[]),complications_used); latest["complications_used"]=complications_used; latest["updated_at"]=now(); save_attempt_details(DB_PATH,latest)
            for complication_index in complications_used:
                if 1 <= complication_index <= len(c.get("follow_up_complications",[])):
                    st.info(f"Complication {complication_index}: {c['follow_up_complications'][complication_index-1]}")
            st.caption("Stretch work is optional and is not included in the base score unless you choose to include it in your answer.")
        p=student_prompt(c,bank.get("prompt_templates",{}).get("student",""),project_context=project_context)
        with st.expander("Generate student prompt"):
            st.code(p,language="text"); st.download_button("Download student prompt",p,file_name=f"{c['id']}_student_prompt.txt",mime="text/plain")
        if not written_practice or status_value not in ("Completed","Evaluated") or attempt_data.get("project_run_id"):
            st.button("Finish investigation" if c.get("data_quality_detective") else "Mark Complete",type="primary",key=f"complete_{aid}",disabled=bool(artifact_problems) or save_error,on_click=mark_attempt_complete,args=(latest,started))
        if status_value in ("Completed","Evaluated") and not artifact_problems:
            rubric=attempt_rubric(attempt_data,c)
            if not rubric:
                st.warning("The original grading rubric is unavailable. Restore the original challenge bank before evaluating this saved attempt.")
                st.stop()
            with st.expander("Evaluation prompt and result entry",expanded=True):
                from src.ai import evaluation_revision, revision
                from src.ai_ui import render_evaluation_proposal
                from src.submission import evaluation_topics
                topic_options=evaluation_topics(bank,c,attempt_data)
                mistake_options=list(dict.fromkeys(bank.get("mistake_categories",[])+attempt_data.get("mistake_categories",[])))
                include_internal=st.checkbox("Include internal guidance in this evaluation prompt",key=f"ai_internal_{aid}",help="Includes only topics, domains, prerequisites, evaluation focus and common traps. Private tests and reference solutions are always excluded.")
                ep=evaluation_prompt(c,answer,rubric,bank.get("prompt_templates",{}).get("evaluation",""),[c["follow_up_complications"][i-1] for i in complications_used if i<=len(c.get("follow_up_complications",[]))],mistake_options,attempt_data.get("diagram"),attempt_data.get("sql_workspace"),attempt_data.get("detective_workspace"),attempt_data.get("python_workspace"),include_internal=include_internal,topic_options=topic_options,constructor_workspace=attempt_data.get("constructor_workspace"),project_context=project_context)
                evaluation_version=attempt_evaluation_revision(c,attempt_data,rubric,project_context)
                def apply_ai_evaluation(proposal, expected_revision):
                    current_attempt=get_attempt(DB_PATH,aid)
                    try:
                        current_bank=json.loads(CHALLENGES_PATH.read_text(encoding="utf-8"))
                        if current_attempt and current_attempt.get("project_run_id"):
                            current_run=capstone_store.get_run(DB_PATH,current_attempt["project_run_id"])
                            current_challenge=current_run["challenges"][current_attempt["project_stage_id"]]
                        else:
                            current_challenge=next(item for item in current_bank["challenges"] if item["id"]==c["id"])
                        current_rubric=(capstone_store.stage_rubric(current_run,current_attempt["project_stage_id"],current_bank)
                            if current_attempt and current_attempt.get("project_run_id") else current_bank["rubrics"][current_challenge["rubric_ref"]])
                        current_version=attempt_evaluation_revision(current_challenge,current_attempt,current_rubric) if current_attempt else None
                    except (OSError,ValueError,KeyError,StopIteration):
                        st.session_state.ai_apply_error="Could not verify the current exercise. Review it again."
                        return
                    if (not current_attempt or current_version!=expected_revision
                            or st.session_state.get(key,current_attempt.get("answer","")) != current_attempt.get("answer","")
                            or current_attempt["status"] not in ("Completed","Evaluated")):
                        st.session_state.ai_apply_error="This suggestion is outdated. Review the current attempt again."
                        return
                    st.session_state[f"category_mode_{aid}"]=True
                    for category,value in proposal["rubric_scores"].items():
                        st.session_state[f"rubric_{aid}_{category}"]=float(value)
                    st.session_state[f"total_score_{aid}"]=float(proposal["total_score"])
                    st.session_state[f"eval_weak_{aid}"]=proposal["weak_topics"]
                    st.session_state[f"eval_mistakes_{aid}"]=proposal["mistake_categories"]
                    st.session_state[f"eval_feedback_{aid}"]=proposal["feedback"]
                    st.session_state.pop("ai_apply_error",None)
                render_evaluation_proposal(ep,aid,evaluation_version,rubric,topic_options,mistake_options,apply_ai_evaluation,context_revision=revision({"internal":include_internal,"prompt":ep}))
                if error:=st.session_state.get("ai_apply_error"):
                    st.error(error)
                st.markdown("**Record evaluator results**")
                saved_rubric_scores=(attempt_data or {}).get("rubric_scores",{})
                rubric_defaults={}
                incompatible_scores=bool(set(saved_rubric_scores)-set(rubric))
                # A changed rubric can also leave an invalid value in an open form.
                for category,maximum in rubric.items():
                    saved_value=saved_rubric_scores.get(category)
                    rubric_defaults[category]=float(saved_value) if type(saved_value) in (int,float) and 0<=saved_value<=maximum else None
                    if category in saved_rubric_scores and rubric_defaults[category] is None:
                        incompatible_scores=True
                    score_key=f"rubric_{aid}_{category}"
                    value=st.session_state.get(score_key)
                    if value is not None and not (type(value) in (int,float) and 0<=value<=maximum):
                        st.session_state[score_key]=None
                        incompatible_scores=True
                if incompatible_scores:
                    st.warning("The saved evaluation does not fit the current rubric. Re-enter incompatible scores. Your original scores remain saved until you save a new evaluation.")
                    with st.expander("Previously saved category scores"):
                        st.json(saved_rubric_scores)
                category_mode=st.checkbox("Enter a score for each rubric category",value=bool(saved_rubric_scores),key=f"category_mode_{aid}")
                rubric_scores={}
                if category_mode:
                    rubric_scores={category:st.number_input(category.replace("_"," ").title(),min_value=0.0,max_value=float(maximum),value=rubric_defaults[category],step=1.0,key=f"rubric_{aid}_{category}",placeholder="Enter evaluator score") for category,maximum in rubric.items()}
                    total=sum(rubric_scores.values()) if rubric_scores and all(value is not None for value in rubric_scores.values()) else None
                    st.metric("Rubric total",f"{total:.0f} / 100" if total is not None else "Awaiting category scores")
                else:
                    total=st.number_input("Total score / 100",0.0,100.0,float(attempt_data["score"]) if attempt_data.get("score") is not None else None,step=1.0,key=f"total_score_{aid}",placeholder="Enter evaluator score")
                topic_options=evaluation_topics(bank,c,attempt_data)
                mistake_options=list(dict.fromkeys(bank.get("mistake_categories",[])+attempt_data.get("mistake_categories",[])))
                weak=st.multiselect("Weak topics",topic_options,default=(attempt_data or {}).get("weak_topics",[]),key=f"eval_weak_{aid}")
                mistakes=st.multiselect("Mistake categories",mistake_options,default=(attempt_data or {}).get("mistake_categories",[]),key=f"eval_mistakes_{aid}")
                feedback=st.text_area("Evaluator feedback",value=(attempt_data or {}).get("evaluation_feedback", ""),key=f"eval_feedback_{aid}"); notes=st.text_area("Personal notes",value=(attempt_data or {}).get("personal_notes", ""),key=f"eval_notes_{aid}")
                st.button("Save evaluation",key=f"eval_{aid}",disabled=total is None or save_error,on_click=save_evaluation_result,args=(latest,total,rubric_scores,weak,mistakes,feedback,notes))
                if c.get("review_exercise"): st.info("Focused review exercise: "+c["review_exercise"])
