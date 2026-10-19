"""Temporary SQL workspace bridge. No persistence or exercise dependencies."""
import json
import atexit
import hashlib
from pathlib import Path
import subprocess
from uuid import uuid4
import streamlit as st

from src.disposable_workers import DisposableWorkers
from src.component_assets import static_asset_url

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(__file__).parent / "sql_tools_assets"
STATIC = ROOT / "static"
DIALECTS = json.loads((Path(__file__).parent / "sql_tools_dialects.json").read_text(encoding="utf-8"))
JS_LOADER = """/* inline SQL loader */
let modulePromise;
export default function renderComponent(args) {
  modulePromise ??= import(new URL(__ASSET_URL__, window.location.origin).href);
  let disposed = false;
  let cleanup;
  modulePromise.then(({ default: render }) => {
    if (!disposed) cleanup = render(args);
  }).catch(() => {
    modulePromise = undefined;
    const mount = args.parentElement.querySelector('.sql-tools-root');
    if (!disposed && mount) mount.textContent = 'SQL tools could not load. Refresh the page to retry.';
  });
  return () => {
    disposed = true;
    if (cleanup) cleanup();
  };
}
"""


_workers = DisposableWorkers("src.sql_tools_worker", preparation_timeout=5, idle_timeout=90)
atexit.register(_workers.close)


def prewarm_sql_tools():
    """Prepare the next SQL request without blocking the Constructor menu."""
    _workers.prewarm()


@st.cache_resource
def _component():
    version = hashlib.sha256((STATIC / "sql-tools-editor.js").read_bytes()).hexdigest()[:12]
    return st.components.v2.component("constructor_sql_tools", html='<div class="sql-tools-root"></div>',
        js=JS_LOADER.replace("__ASSET_URL__", json.dumps(static_asset_url("sql-tools-editor.js") + "?v=" + version)),
        css="/* bundled SQL tools */\n" + (ASSETS / "editor.css").read_text(encoding="utf-8")
        + "\n" + (ASSETS.parent / "workspace_identity.css").read_text(encoding="utf-8"))


def run_request(request, timeout=5):
    identity = {key: request.get(key) for key in ("workspaceId", "id", "revision", "action")}
    payload = json.dumps(request, ensure_ascii=False).encode("utf-8")
    if len(payload) > 3_000_000:
        return {**identity, "ok": False, "error": "Request is too large."}
    try:
        with _workers.worker() as process:
            try:
                output, _ = process.communicate(payload, timeout=timeout)
            except subprocess.TimeoutExpired:
                return {**identity, "ok": False, "error": "Operation exceeded five seconds. Try a smaller input."}
            if process.returncode != 0 or len(output) > 20_000_000:
                raise ValueError("The SQL analysis worker could not finish this input.")
            return {**identity, **json.loads(output)}
    except Exception as exc:
        return {**identity, "ok": False, "error": str(exc)[:1000]}


def close_sql_tools():
    for key in list(st.session_state):
        if key.startswith("sql_tools_"):
            del st.session_state[key]


@st.fragment
def render_sql_tools(_path, adapter=None):
    prewarm_sql_tools()
    workspace = adapter.identity if adapter else st.session_state.setdefault("sql_tools_workspace", str(uuid4()))
    key = adapter.mount_key if adapter else "sql_tools_editor_" + workspace
    response_key = key + "_response"
    ack_key = key + "_ack"

    def draft_changed():
        event = getattr(st.session_state.get(key), "draft", None)
        if not adapter or not isinstance(event, dict) or event.get("workspaceId") != workspace:
            return
        if (st.session_state.get(ack_key) or {}).get("id") == event.get("id"):
            return
        ok = adapter.save(event["payload"], event.get("baseRevision"))
        st.session_state[ack_key] = {"id": event["id"], "ok": ok, "revision": adapter.artifact["revision"], "error": adapter.error}
        if ok and event.get("returnToAttempt"):
            adapter.return_to_attempt()
            st.rerun()

    def request_changed():
        if not adapter and st.session_state.get("sql_tools_workspace") != workspace:
            return
        component_state = st.session_state.get(key)
        request = getattr(component_state, "request", None)
        if not isinstance(request, dict) or request.get("workspaceId") != workspace:
            return
        if request.get("id") == st.session_state.get("sql_tools_last_request"):
            return
        st.session_state.sql_tools_last_request = request.get("id")
        st.session_state[response_key] = run_request(request)

    _component()(key=key, data=[{"workspaceId": workspace,
        "dialects": DIALECTS,
        "attemptLinked": bool(adapter), "document": adapter.payload if adapter else None,
        "artifactRevision": adapter.artifact["revision"] if adapter else 0,
        "saveAck": st.session_state.get(ack_key),
        "response": st.session_state.get(response_key)}],
        default={"request": None, "draft": None, "busy": False}, on_request_change=request_changed,
        on_busy_change=adapter.busy_changed if adapter else (lambda: None),
        on_draft_change=draft_changed, height="content")
