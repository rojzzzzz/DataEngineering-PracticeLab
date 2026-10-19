"""Lazy, locally hosted Pipeline Designer and its revision-aware save bridge."""
import hashlib
import json
from pathlib import Path
import streamlit as st

from src import pipeline_store as store
from src.component_assets import static_asset_url
from src.pipeline_models import validate_document

STATIC = Path(__file__).resolve().parents[1] / "static" / "pipeline"


def pipeline_preview(document, key):
    return _component()(key=key, data=[{"preview": document, "cacheKey": key}], height="content")


@st.cache_resource
def _component():
    version = hashlib.sha256((STATIC / "editor.js").read_bytes()).hexdigest()[:12]
    js = """
    let pending;
    export default function render(args) {
      const base = new URL(__ASSET_URL__, window.location.origin);
      window.EXCALIDRAW_ASSET_PATH = base.href;
      pending ??= import(base.href + 'editor.js?v=VERSION');
      let disposed = false, cleanup;
      pending.then(module => { if (!disposed) cleanup = module.default(args); }).catch(error => {
        pending = undefined;
        if (!disposed) args.parentElement.querySelector('.pipeline-root').textContent = 'Pipeline Designer could not load. Refresh to retry. ' + error.message;
      });
      return () => { disposed = true; cleanup?.(); };
    }
    """.replace("VERSION", version).replace("__ASSET_URL__", json.dumps(static_asset_url("pipeline/")))
    return st.components.v2.component("constructor_pipeline", html='<div class="pipeline-root"></div>',
        js="/* Pipeline Designer loader */\n" + js,
        css="/* Pipeline Designer styles */\n" + (STATIC / "editor.css").read_text(encoding="utf-8")
        + "\n" + (Path(__file__).parent / "workspace_identity.css").read_text(encoding="utf-8"), isolate_styles=False)


@st.fragment
def render_pipeline(path, adapter=None):
    if adapter is None:
        store.init_store(path)
    key = adapter.mount_key if adapter else "pipeline_editor"
    response_key, handled_key = key + "_response", key + "_handled"

    def handle():
        event = st.session_state[key].event
        if not isinstance(event, dict) or event.get("requestId") == st.session_state.get(handled_key):
            return
        st.session_state[handled_key] = event.get("requestId")
        response = {"requestId": event.get("requestId"), "action": event.get("action"),
                    "documentId": event.get("documentId"), "clientRevision": event.get("clientRevision")}
        try:
            action = event.get("action")
            if adapter:
                if event.get("documentId") != adapter.identity:
                    raise ValueError("Deliverable identity mismatch.")
                if action in ("save", "return", "create", "import"):
                    files = {**adapter.artifact["payload"]["files"], **event.get("newFiles", {}), **event["document"].get("files", {})}
                    document = {**event["document"], "files": files}
                    if not adapter.save(document, event["baseRevision"]):
                        raise ValueError(adapter.error)
                    response.update(revision=adapter.artifact["revision"])
                    if action != "save":
                        response.update(documentId=adapter.identity, document=adapter.artifact["payload"])
                    if action == "return":
                        adapter.return_to_attempt()
                elif action == "open":
                    response.update(documentId=adapter.identity, revision=adapter.artifact["revision"], document=adapter.payload)
                else:
                    raise ValueError("Use Copy projects to manage independent copies.")
            elif action == "save":
                revision = store.save_document(path, event["documentId"], event["baseRevision"], event["document"], event.get("newFiles", {}))
                response.update(revision=revision)
            elif action in ("create", "import", "duplicate"):
                document = event.get("document")
                if document is not None:
                    document = validate_document(document)
                identity = store.create_document(path, event.get("name", "Untitled pipeline"), document)
                response.update(store.load_document(path, identity))
            elif action == "open":
                response.update(store.load_document(path, event["documentId"]))
            elif action == "delete":
                store.delete_document(path, event["documentId"], event["baseRevision"])
            else:
                raise ValueError("Unknown Pipeline Designer action.")
            response["ok"] = True
        except (ValueError, TypeError, KeyError, OSError, RuntimeError) as exc:
            response.update(ok=False, error=str(exc))
        except Exception as exc:
            response.update(ok=False, error=f"Could not save this project: {exc}")
        st.session_state[response_key] = response
        if adapter and st.session_state.get("artifact_returned"):
            st.rerun()

    # The frontend owns document switching, so it can wait for pending save acknowledgments.
    _component()(key=key, data=[{"documents": [] if adapter else store.list_documents(path),
        "attemptLinked": bool(adapter), "workspaceId": adapter.identity if adapter else None,
        "response": st.session_state.get(response_key), "storageKey": hashlib.sha256(str(Path(path).resolve()).encode()).hexdigest()[:16]}],
        default={"event": None, "busy": False}, on_event_change=handle,
        on_busy_change=adapter.busy_changed if adapter else (lambda: None), height="content")
