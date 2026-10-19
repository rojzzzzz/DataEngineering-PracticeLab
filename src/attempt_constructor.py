"""Full Constructor editors mounted against one attempt/slot persistence adapter."""
import hashlib
import json
from pathlib import Path
import streamlit as st

from src import constructor_artifacts as artifacts
from src.database import get_attempt


class AttemptAdapter:
    def __init__(self, path, attempt_id, slot_id, attempt=None):
        self.path, self.attempt_id, self.slot_id = path, attempt_id, slot_id
        self.identity = f"attempt:{attempt_id}:artifact:{slot_id}"
        self.attempt = attempt if attempt is not None else get_attempt(path, attempt_id)
        if not self.attempt or self.attempt.get("attempt_id") != attempt_id or not self.attempt.get("constructor_workspace"):
            raise ValueError("This attempt has no linked workspace.")
        self.workspace = self.attempt["constructor_workspace"]
        self.slot = next(s for s in self.workspace["tasks"]["slots"] if s["id"] == slot_id)
        self.key = "attempt_constructor_" + hashlib.sha256((str(Path(path).resolve()) + self.identity).encode()).hexdigest()[:24]
        self.artifact = self.workspace["artifacts"].get(slot_id)
        if self.artifact is None:
            # A starter is an editor input, not learner work. Persist lazily on
            # the first real edit, so opening a tool changes no progress/currency.
            if self.key + "_initial" not in st.session_state:
                st.session_state[self.key + "_initial"] = {**artifacts.make_artifact(self.slot, artifacts.initial_payload(self.slot)), "revision": 0}
            self.artifact = st.session_state[self.key + "_initial"]
        self.mount_key = self.key + "_mount_" + str(st.session_state.get(self.key + "_generation", 0))

    def replaced(self):
        st.session_state[self.key + "_generation"] = st.session_state.get(self.key + "_generation", 0) + 1

    def busy_changed(self):
        value = getattr(st.session_state.get(self.mount_key), "busy", False)
        st.session_state.setdefault("artifact_busy", {})[self.key] = bool(value)

    @property
    def payload(self):
        return st.session_state.get("artifact_drafts", {}).get(self.key, {}).get("payload", self.artifact["payload"])

    @property
    def error(self):
        return st.session_state.get("artifact_errors", {}).get(self.key)

    def save(self, payload, base_revision=None, provenance=None):
        pending = st.session_state.setdefault("artifact_drafts", {})
        errors = st.session_state.setdefault("artifact_errors", {})
        base = (pending.get(self.key) or {}).get("base_revision", self.artifact["revision"]) if base_revision is None else base_revision
        pending[self.key] = {"payload": payload, "base_revision": base, "attempt_id": self.attempt_id, "slot_id": self.slot_id}
        try:
            normalized = artifacts.normalized_payload(self.slot["tool"], artifacts.validate_payload(self.slot["tool"], payload, self.slot.get("kind")))
            if base == 0 and not provenance and normalized == artifacts.normalized_payload(self.slot["tool"], self.artifact["payload"]):
                pending.pop(self.key, None)
                errors.pop(self.key, None)
                return True
            self.artifact = artifacts.save_artifact(self.path, self.attempt_id, self.slot_id, payload, base, provenance)
            pending.pop(self.key, None)
            errors.pop(self.key, None)
            return True
        except Exception as exc:
            errors[self.key] = str(exc)
            return False

    def return_to_attempt(self, payload=None):
        if payload is not None and not self.save(payload):
            return False
        if st.session_state.get("artifact_drafts"):
            return False
        st.session_state.pop("attempt_constructor", None)
        st.query_params.pop("workspace", None)
        st.query_params.pop("attempt", None)
        st.session_state.active_attempt = self.attempt_id
        st.session_state.active_challenge = self.attempt["challenge_id"]
        if self.attempt.get("project_run_id"):
            from src.capstone_store import get_run
            from src.practice_navigation import PracticeNavigation
            challenge = get_run(self.path, self.attempt["project_run_id"])["challenges"][self.attempt["project_stage_id"]]
            st.session_state.mode = PracticeNavigation._mode(challenge)
            st.query_params["project"] = self.attempt["project_run_id"]
            st.query_params["stage"] = self.attempt["project_stage_id"]
        st.session_state.artifact_returned = True
        st.session_state.get("artifact_busy", {}).pop(self.key, None)
        return True


def open_workspace(path, attempt, slot_id, navigation):
    if not navigation._flush():
        return
    from src.constructor_ui import close_constructor_tool
    close_constructor_tool()
    navigation.drafts.accept_navigation()
    st.session_state.active_attempt = attempt["attempt_id"]
    st.session_state.active_challenge = attempt["challenge_id"]
    if attempt.get("project_run_id"):
        st.query_params["project"] = attempt["project_run_id"]
        st.query_params["stage"] = attempt["project_stage_id"]
    st.session_state.attempt_constructor = (attempt["attempt_id"], slot_id)
    st.query_params["attempt"] = str(attempt["attempt_id"])
    st.query_params["workspace"] = slot_id


def render_deliverables(path, challenge, attempt, navigation):
    workspace = attempt.get("constructor_workspace")
    if not workspace or workspace.get("legacy"):
        if challenge.get("constructor_tasks") and attempt["status"] in ("Not started", "In progress"):
            st.info("This saved attempt uses its original requirements. You can adopt the new linked deliverables; your answer and existing diagram will be preserved.")
            if st.button("Upgrade this unfinished attempt", key=f"upgrade_{attempt['attempt_id']}"):
                if navigation._flush():
                    artifacts.upgrade_attempt(path, attempt["attempt_id"], challenge)
                    st.rerun()
        if not workspace:
            return
    st.subheader("Tools and deliverables")
    st.caption("Presence checks confirm saved evidence. Design quality is assessed through your explanation and rubric.")
    for slot in workspace["tasks"]["slots"]:
        artifact = workspace["artifacts"].get(slot["id"])
        left, right = st.columns([4, 1], vertical_alignment="center")
        left.markdown(f"**{slot['label']}** · {'Required' if slot['required'] else 'Optional'}")
        left.caption(slot.get("instructions", ""))
        left.caption(f"Saved · revision {artifact['revision']}" if artifact else "Not started")
        right.button("Resume" if artifact else "Open", key=f"artifact_{attempt['attempt_id']}_{slot['id']}",
                     on_click=open_workspace, args=(path, attempt, slot["id"], navigation))
    if artifacts.evaluation_outdated(workspace):
        st.warning("Saved evaluation is outdated because deliverables changed. Previous feedback is preserved.")


def _copies(adapter):
    tool, slot, path = adapter.slot["tool"], adapter.slot, adapter.path
    if tool not in ("diagram", "pipeline"):
        return
    with st.expander("Copy projects and exports"):
        st.caption("Copies belong to this attempt. Changes to the source cannot alter this deliverable.")
        from src import constructor_store, pipeline_store
        if tool == "diagram":
            constructor_store.init_constructor(path)
            documents = constructor_store.list_diagrams(path, kinds=(slot["kind"],))
        else:
            pipeline_store.init_store(path)
            documents = pipeline_store.list_documents(path)
        blocked = bool(adapter.error) or st.session_state.get("artifact_busy", {}).get(adapter.key, False)
        confirm = st.checkbox("Replace this deliverable with a copy", key=adapter.key + "_replace")
        if documents:
            selected = st.selectbox("Source project", [d["document_id"] for d in documents],
                                    format_func={d["document_id"]: d["name"] for d in documents}.get)
            if st.button("Copy selected project", disabled=not confirm or blocked):
                payload = (constructor_store.load_diagram(path, selected)["diagram"] if tool == "diagram"
                           else pipeline_store.load_document(path, selected)["document"])
                if adapter.save(payload, provenance={"source": "constructor-copy", "document_id": selected}):
                    adapter.replaced()
                    st.rerun()
        uploaded = st.file_uploader("Import exported project JSON", type=["json"], key=adapter.key + "_import")
        if st.button("Copy uploaded export", disabled=not confirm or uploaded is None or blocked):
            try:
                if uploaded.size > 25 * 1024**2:
                    raise ValueError("Export exceeds 25 MiB.")
                value = json.loads(uploaded.getvalue())
                payload = value.get("diagram", value) if tool == "diagram" else value
                if tool == "pipeline" and value.get("type") == "excalidraw":
                    from src.pipeline_models import import_document
                    payload = import_document(uploaded.getvalue(), uploaded.name)
                if adapter.save(payload, provenance={"source": "imported-export", "filename": uploaded.name}):
                    adapter.replaced()
                    st.rerun()
            except (ValueError, TypeError) as exc:
                st.error(str(exc))
        if st.button("Save a copy to Constructor", disabled=blocked):
            p = adapter.artifact["payload"]
            if tool == "diagram":
                constructor_store.create_diagram(path, slot["label"], slot["kind"], p)
            else:
                pipeline_store.create_document(path, p["name"], p)
            st.success("Independent copy saved to Constructor.")


def _diagram(adapter):
    from src.erd_component import workspace_editor
    def changed():
        value = getattr(st.session_state[adapter.mount_key], "diagram", None)
        if value is not None:
            adapter.save(value)
    def returned():
        value = getattr(st.session_state[adapter.mount_key], "return_request", None)
        if value:
            adapter.return_to_attempt(value["diagram"])
    command_key = adapter.key + "_sql"
    with st.expander("Add tables from SQL"):
        source = st.text_area("CREATE TABLE SQL", key=command_key + "_input")
        if st.button("Add tables to diagram", disabled=bool(adapter.error)):
            from uuid import uuid4
            from src.diagram_sql import parse_create_tables
            try:
                st.session_state[command_key] = {"id": uuid4().hex, "tables": parse_create_tables(source, "postgres")}
            except ValueError as exc:
                st.error(str(exc))
    workspace_editor(adapter.identity, adapter.mount_key, adapter.payload, adapter.slot["label"],
                     adapter.artifact["payload"], adapter.error, changed, returned, st.session_state.get(command_key), adapter.busy_changed)


def render_workspace(path, challenge, attempt_id, slot_id, attempt=None):
    try:
        adapter = AttemptAdapter(path, attempt_id, slot_id, attempt)
    except (ValueError, StopIteration) as exc:
        st.error(f"Could not open this deliverable: {exc}")
        if st.button("Return to Practice"):
            st.session_state.pop("attempt_constructor", None)
            st.query_params.clear()
            st.rerun()
        return
    st.caption(f"Practice / {challenge['id']} / Attempt {attempt_id}")
    st.title(challenge["title"])
    st.subheader(adapter.slot["label"])
    st.markdown(adapter.slot.get("instructions", ""))
    from src.submission_ui import render_original
    render_original(adapter)
    if adapter.attempt.get("project_run_id"):
        from src.capstone_ui import render_references
        render_references(path, adapter.attempt, readonly=True)
    with st.expander("Challenge brief and deliverables"):
        for key in ("scenario", "requirements", "tasks", "constraints", "deliverables"):
            value = challenge.get("student", {}).get(key, "")
            st.markdown(value if isinstance(value, str) else "\n".join(f"- {v}" for v in value))
        if "starter" in adapter.slot and adapter.slot["tool"] == "sql":
            st.caption("Supplied public inputs")
            st.code(adapter.slot["starter"].get("sql", ""), language="sql")
            if adapter.slot["starter"].get("plan"):
                st.code(adapter.slot["starter"]["plan"], language="json")
    if adapter.error:
        st.error(f"Save failed: {adapter.error}. Your draft is retained; retry or download it before leaving.")
        st.download_button("Download recoverable draft", json.dumps(adapter.payload), file_name="deliverable-draft.json")
        if st.button("Retry saving deliverable"):
            if adapter.save(adapter.payload):
                adapter.replaced()
            st.rerun()
    _copies(adapter)
    tool = adapter.slot["tool"]
    if tool == "diagram":
        _diagram(adapter)
    elif tool == "pipeline":
        from src.pipeline_component import render_pipeline
        render_pipeline(path, adapter)
    elif tool == "sql":
        from src.sql_tools_component import render_sql_tools
        render_sql_tools(path, adapter)
    else:
        from src.mock_ui import render_mock_data
        render_mock_data(path, adapter)
    if st.session_state.pop("artifact_returned", False):
        from src.constructor_ui import close_constructor_tool
        close_constructor_tool()
        st.rerun()
