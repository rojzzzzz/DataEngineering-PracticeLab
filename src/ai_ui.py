"""Explicit send/review controls using the same editable prompt as export."""
import json

import streamlit as st

from src.ai import AIConnection, AIRequest, AISession, PROTOCOLS, parse_evaluation, revision

PRESETS = {
    "Custom": None,
    "Chat Completions API": ("Chat Completions", "https://api.openai.com/v1", False),
    "Gemini compatible": ("Chat Completions", "https://generativelanguage.googleapis.com/v1beta/openai", False),
    "Ollama (local)": ("Chat Completions", "http://localhost:11434/v1", True),
    "Anthropic Messages API": ("Anthropic Messages", "https://api.anthropic.com/v1", False),
}


def ai_session():
    if "optional_ai" not in st.session_state:
        st.session_state.optional_ai = AISession()
    return st.session_state.optional_ai


def record_activity():
    """Called by human controls only; rendering and scheduled reruns are passive."""
    session = st.session_state.get("optional_ai")
    if session:
        session.touch()


def reconcile_page(page):
    previous_page = st.session_state.get("ai_last_page")
    st.session_state.ai_last_page = page
    session = st.session_state.get("optional_ai")
    if session:
        if previous_page is not None and previous_page != page:
            record_activity()
        request, _, _ = session.snapshot()
        expected = ("Practice" if request and request.operation == "evaluation" else
                    "Optional AI" if request and request.operation == "test" else
                    "Constructor Mode" if request and request.operation == "mock_customization" else "Challenge Bank")
        if request and request.operation == "mock_customization" and request.document_id.startswith("mock:attempt:"):
            expected = "Practice"
        if request and page != expected:
            session.invalidate()


def _preset():
    record_activity()
    preset = PRESETS[st.session_state.ai_preset]
    if preset:
        st.session_state.ai_protocol, st.session_state.ai_url, st.session_state.ai_local = preset


def _configure():
    try:
        connection = AIConnection(st.session_state.ai_protocol, st.session_state.ai_url.strip(),
            st.session_state.ai_model.strip(), int(st.session_state.ai_timeout), int(st.session_state.ai_tokens),
            st.session_state.ai_local, st.session_state.ai_token_parameter, int(st.session_state.ai_prompt_kib) * 1024)
        ai_session().configure(connection, st.session_state.ai_key)
        st.session_state.ai_config_notice = "Connection enabled for this session. Nothing has been sent."
        st.session_state.pop("ai_config_error", None)
    except ValueError as exc:
        st.session_state.ai_config_error = str(exc)
    finally:
        # The password widget is an input buffer, not a second credential store.
        st.session_state.ai_key = ""


def _disconnect():
    ai_session().close()
    st.session_state.ai_key = ""
    st.session_state.pop("ai_config_error", None)
    st.session_state.ai_config_notice = "Disconnected. Session credential references were removed."


def _open_authoring():
    record_activity()
    st.session_state.navigate = "Challenge Bank"


def render_configuration():
    session = ai_session()
    st.header("Optional AI")
    st.write("Connect your preferred provider for suggested evaluations, exercise drafts and custom mock-data recipes. Practice, local checks, manual evaluation and prompt downloads work without a connection.")
    if session.connection:
        st.success(f"Active · {session.connection.protocol} · {session.connection.model}")
        st.caption(session.connection.endpoint)
    else:
        st.info("AI connection is off.")
    defaults = {"ai_protocol": PROTOCOLS[0], "ai_url": "", "ai_model": "", "ai_local": False,
                "ai_timeout": 120, "ai_tokens": 4096, "ai_token_parameter": "max_tokens", "ai_prompt_kib": 1024}
    for key, value in defaults.items():
        st.session_state.setdefault(key, value)
        # Retain non-secret controls when navigating away from this page.
        st.session_state[key] = st.session_state[key]
    st.selectbox("Connection preset", list(PRESETS), key="ai_preset", on_change=_preset)
    st.caption("Presets fill connection fields only. Enter your own model; no model listing or network request occurs.")
    with st.form("optional_ai_configuration"):
        st.selectbox("Protocol", PROTOCOLS, key="ai_protocol")
        st.text_input("API base URL", key="ai_url", placeholder="https://your-provider.example/v1")
        st.text_input("Model", key="ai_model", placeholder="Enter an exact model name")
        st.text_input("API key (optional)", key="ai_key", type="password", help="Held only in this session's memory. Enter it again when updating the connection; an empty field selects no authentication.")
        st.checkbox("Allow HTTP for an explicit local server", key="ai_local")
        with st.expander("Request limits"):
            st.number_input("Maximum request time (seconds)", min_value=1, max_value=300, key="ai_timeout")
            st.number_input("Maximum output tokens", min_value=1, max_value=65536, key="ai_tokens")
            st.number_input("Maximum prompt size (KiB)", min_value=1, max_value=8192, key="ai_prompt_kib")
            st.selectbox("Chat Completions output parameter", ("max_tokens", "max_completion_tokens"), key="ai_token_parameter",
                         help="Choose the parameter your model accepts. Incompatibilities require a manual change and resend.")
        st.form_submit_button("Enable / update connection", on_click=_configure, type="primary")
    if error := st.session_state.get("ai_config_error"):
        st.error(error)
    elif notice := st.session_state.get("ai_config_notice"):
        st.caption(notice)
    st.button("Disconnect", on_click=_disconnect, disabled=session.connection is None)
    st.subheader("Generate exercises")
    st.write("Use your connection to draft any supported exercise format, including repairs and connected capstones. Challenge Bank provides the prompt, assigns names and validates the draft before you append it.")
    st.button("Create exercises", on_click=_open_authoring)
    st.divider()
    st.subheader("Test connection")
    prompt = "Reply with OK."
    st.code(prompt, language="text")
    st.caption("The test sends only this message, with an output limit of 16 tokens. It includes no student data.")
    if session.connection:
        st.caption(f"Destination: {session.connection.endpoint} · Model: {session.connection.model}")
    if st.button("Send test message", disabled=session.connection is None or session.busy):
        from dataclasses import replace
        from src.ai import provider_for
        connection = replace(session.connection, output_tokens=16)
        class TestProvider:
            def generate(self, unused, credential, request):
                return provider_for(connection).generate(connection, credential, request)
        session.start(AIRequest("test", prompt, "connection-test", revision(connection.__dict__)), TestProvider())
    render_request_status("connection-test")
    st.divider()
    st.caption("Remote requests use your chosen provider's data policy. Models can invent explanations and incorrect exercises; suggested scores are not certified grades. Usage is shown when reported; no monetary price is estimated.")
    st.caption("Docker: localhost inside the container refers to the container. To reach a server on your computer, use host.docker.internal, and make that server reachable from Docker. This release is intended for local installation, not a shared public service.")


def render_request_status(document_id):
    session = ai_session()
    request, _, _ = session.snapshot()
    polling = session.busy and request is not None and request.document_id == document_id
    @st.fragment(run_every=.5 if polling else None)
    def status():
        # Re-register without a timer when transport finishes, even when its
        # result was discarded and the visible state remains cancelled/outdated.
        if polling and not session.busy:
            st.rerun()
        request, response, state = session.snapshot()
        if request is None or request.document_id != document_id:
            return
        st.caption({"sending": "Sending…", "completed": "Completed", "cancelled": "Cancelled", "outdated": "Outdated", "error": "Error", "preparing": "Preparing"}[state])
        if session.busy and st.button("Cancel request", key="ai_cancel_" + document_id):
            record_activity()
            session.invalidate("cancelled")
            st.rerun()
        if state == "cancelled":
            st.info("The result cannot be applied. Cancellation may not stop provider processing or charges.")
        elif state == "outdated":
            st.warning("The document changed or you navigated away. This suggestion cannot be applied; send the current prompt manually again.")
        if response:
            if response.error:
                st.error(response.error)
            if response.text:
                st.code(response.text, language="text", height=220)
                st.download_button("Download AI response", response.text, file_name="ai-response.txt", key="ai_response_download_" + document_id, on_click=record_activity)
            st.caption(f"Reported model: {response.model or 'not reported'} · Finish: {response.finish_reason or 'not reported'}")
            if response.usage:
                st.json(response.usage)
            if not response.error and not response.applicable:
                st.warning("Response is truncated or did not finish normally. Keep the text as a draft; it cannot be applied.")
    status()


def render_prompt(prompt, scope, operation, document_id, document_revision, filename, *, context_revision=None, send_label="Send reviewed prompt", ready=True):
    """Never send on render. Download and payload use the exact same editor value."""
    session = ai_session()
    active_request, _, _ = session.snapshot()
    if active_request and active_request.operation == operation:
        session.reconcile(document_id, document_revision)
    editors = st.session_state.setdefault("ai_prompt_editors", {})
    entry = editors.setdefault(scope, {"source": prompt, "revision": document_revision, "context": context_revision, "text": prompt, "generation": 0})
    stale = entry["revision"] != document_revision or entry["context"] != context_revision or entry["source"] != prompt
    if stale and entry["text"] == entry["source"]:
        entry.update(source=prompt, revision=document_revision, context=context_revision, text=prompt, generation=entry["generation"] + 1)
        stale = False
    if stale:
        st.warning("The source context changed. Refresh the prompt before sending. Your edited prompt is kept for download.")
        if st.button("Refresh prompt from current document", key=scope + "_refresh"):
            record_activity()
            entry.update(source=prompt, revision=document_revision, context=context_revision, text=prompt, generation=entry["generation"] + 1)
            stale = False
    editor_key = f"{scope}_prompt_{entry['generation']}"
    if editor_key not in st.session_state:
        st.session_state[editor_key] = entry["text"]
    reviewed = st.text_area("Review and edit prompt", height=230, key=editor_key, on_change=record_activity)
    entry["text"] = reviewed
    with st.expander("Copy reviewed prompt"):
        st.code(reviewed, language="text", height=240)
    prompt_label = {"evaluation": "evaluation prompt", "authoring": "authoring prompt",
                    "mock_customization": "customization prompt"}.get(operation, "repair prompt")
    st.download_button("Download " + prompt_label, reviewed, file_name=filename, mime="text/plain", key=scope + "_download", on_click=record_activity)
    size = len(reviewed.encode())
    limit = session.connection.prompt_limit if session.connection else 1024 * 1024
    st.caption(f"Preparing · {size:,} bytes · No context is truncated automatically.")
    if size > limit:
        st.error(f"Prompt exceeds the configured limit of {limit:,} bytes. Reduce it before sending.")
    if session.connection:
        st.caption(f"Destination: {session.connection.endpoint} · Model: {session.connection.model}")
        st.caption("Sending transmits the full reviewed prompt shown above. Configuring a key never authorizes automatic sends.")
    else:
        st.caption("Connection is off. Use this prompt anywhere, or connect in Optional AI.")
    if st.button(send_label, key=scope + "_send", disabled=not ready or stale or session.connection is None or session.busy or size > limit or not reviewed.strip()):
        try:
            session.start(AIRequest(operation, reviewed, document_id, document_revision))
        except ValueError as exc:
            st.error(str(exc))
    render_request_status(document_id)
    return session.snapshot()


def render_evaluation_proposal(prompt, aid, document_revision, rubric, topics, mistakes, apply, *, context_revision=None, save_label="Save evaluation"):
    scope = f"ai_evaluation_{aid}"
    document_id = f"attempt:{aid}"
    request, response, state = render_prompt(prompt, scope, "evaluation", document_id, document_revision, f"attempt-{aid}-evaluation.txt", context_revision=context_revision)
    proposals = st.session_state.setdefault("ai_evaluation_proposals", {})
    # Only external proposals need independent session storage. API results
    # already belong to AISession; archiving every request ID retains text
    # that the UI cannot reopen. Remove obsolete API entries from live sessions.
    for key in tuple(proposals):
        if not key.startswith("ai_evaluation_"):
            del proposals[key]
    if request and request.document_id == document_id and response and response.text:
        api_proposal = {"text": response.text, "revision": request.document_revision, "applicable": state == "completed" and response.applicable}
    else:
        api_proposal = None
    st.markdown("**Suggested evaluation**")
    external = st.text_area("Paste an external JSON evaluation", key=scope + "_external", height=150, on_change=record_activity)
    if st.button("Review external evaluation", key=scope + "_review_external", disabled=not external.strip()):
        record_activity()
        proposals[scope] = {"text": external, "revision": document_revision, "applicable": True}
    proposal = proposals.get(scope) or api_proposal
    source = st.radio("Suggestion source", ["External", "Connected API"], key=scope + "_source", horizontal=True, on_change=record_activity) if proposals.get(scope) and api_proposal else None
    if source:
        proposal = proposals.get(scope) if source == "External" else api_proposal
    if not proposal:
        st.caption("Review a suggested evaluation here, or enter scores manually below.")
        return
    if proposal["revision"] != document_revision or not proposal["applicable"]:
        st.warning("This suggestion is outdated, cancelled or incomplete. Request or paste a new evaluation for the current submission.")
        return
    try:
        parsed = parse_evaluation(proposal["text"], rubric, topics, mistakes)
    except ValueError as exc:
        st.error(str(exc))
        st.code(proposal["text"], language="text", height=180)
        return
    st.json(parsed)
    st.caption(f"Applying fills editable fields only. Select {save_label} to record the evaluation.")
    def apply_reviewed_suggestion():
        record_activity()
        apply(parsed, document_revision)
    st.button("Apply suggestion to editable form", key=scope + "_apply", on_click=apply_reviewed_suggestion)


def render_authoring_draft(prompt, scope, operation, document_revision, *, authoring_contract=None, ready=True, generation_prompt=None):
    document_id = "authoring:" + scope
    request, response, state = render_prompt(prompt, scope, operation, document_id, document_revision, scope + "-prompt.md",
        send_label="Generate exercises with connected AI" if operation == "authoring" else "Send reviewed prompt", ready=ready)
    if request and request.document_id == document_id and response and response.text:
        st.caption("AI output is a draft. It has not been validated, executed or added to the bank.")
        current = state == "completed" and response.applicable and request.document_revision == document_revision
        if not current:
            st.warning("This draft is outdated or incomplete. Generate a complete draft for the current request before validation.")
        if st.button("Validate and review", key=scope + "_review", disabled=not current):
            record_activity()
            st.session_state.ai_bank_draft = response.text
            st.session_state.ai_bank_contract = authoring_contract
            st.session_state.ai_bank_generation_prompt = request.prompt if operation == "authoring" else generation_prompt
            st.session_state.ai_bank_draft_pending = True
            st.rerun()
