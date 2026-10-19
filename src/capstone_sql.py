"""Saved-dataset SQL execution and recovery, independent of rendering.

The view includes pending edits, durable drafts, retry state and result currency.
Only this module interprets recovery flags or retries execution events as saves.
"""
from copy import deepcopy
from dataclasses import dataclass
import json
from pathlib import Path
from uuid import uuid4

from src.capstone_models import require, validate_stage_workspace
from src.constructor_models import fingerprint, stamp
from src import database
from src.sql_models import new_workspace, validate_workspace
from src.sql_runner import SQLJob


def dataset_for_attempt(path, attempt_id):
    from src.capstone_store import dataset_record, load_run
    with database.connect(path) as con:
        row = con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        require(row is not None, "attempt no longer exists")
        attempt = database._decode_attempt(row)
        require(attempt.get("project_run_id"), "dataset queries belong to a project stage")
        run = load_run(con, attempt["project_run_id"])
        require(run["stage_attempts"].get(attempt["project_stage_id"]) == attempt_id, "stage ownership mismatch")
        stage = run["challenges"][attempt["project_stage_id"]]
        require(stage.get("dataset_sql"), "this stage is not a dataset SQL workspace")
        snapshot = dataset_record(con, run, (attempt.get("capstone_workspace") or {}).get("dataset_id"))
        require(snapshot is not None, "selected saved dataset is unavailable")
        return attempt, run, stage, snapshot


def editor_exercise(challenge, data):
    """Display contract only; never passed to graded-exercise validation."""
    return {"tables": [{"name": t["name"], "description": "Saved operational dataset", "columns": [
                {**c, "key": "PK" if c["primary_key"] else "FK → " + c["reference"]["table"] + "." + c["reference"]["column"] if c.get("reference") else ""}
                for c in t["columns"]]} for t in data["tables"]],
            "visible_fixture": {t["name"]: t["rows"] for t in data["tables"]},
            "tasks": [{**t, "ordered": False, "columns": []} for t in challenge["dataset_sql"]["tasks"]]}


def evidence(request, result):
    rows, size, clipped_cells = [], 0, False
    for raw in result.get("rows", [])[:50]:
        row = [v[:400] + "…" if isinstance(v, str) and len(v) > 400 else v for v in raw]
        clipped_cells = clipped_cells or row != raw
        encoded = len(json.dumps(row, ensure_ascii=False, default=str).encode())
        if size + encoded > 24_000:
            break
        size += encoded
        rows.append(row)
    columns = result.get("columns", [])
    require(len(columns) <= 256 and len(json.dumps(columns).encode()) <= 8000, "execution output has too many columns for saved evidence")
    types = [str(t)[:200] for t in result.get("types", [])[:256]]
    if len(json.dumps(types, ensure_ascii=False).encode()) > 8000:
        types = []  # Optional type labels must not displace the bounded output evidence.
    return {k: request[k] for k in ("run_id", "stage_id", "dataset_id", "dataset_hash", "task_id", "query_hash")} | {
        "status": "cancelled" if result.get("error") == "Cancelled." else "success" if result.get("ok") else "failed",
        "columns": columns, "types": types, "row_count": len(result.get("rows", [])),
        "truncated": bool(result.get("truncated")), "sample_truncated": clipped_cells or len(rows) < len(result.get("rows", [])),
        "sample": rows, "error": str(result.get("error", ""))[:2000], "recorded_at": stamp()}


def save_evidence(path, attempt_id, request, result):
    from src.capstone_store import load_run, dataset_record
    with database.connect(path) as con:
        con.execute("BEGIN IMMEDIATE")
        row = con.execute("SELECT * FROM attempts WHERE attempt_id=?", (attempt_id,)).fetchone()
        require(row is not None, "attempt no longer exists")
        attempt = database._decode_attempt(row)
        require(attempt.get("project_run_id") == request["run_id"] and attempt.get("project_stage_id") == request["stage_id"], "execution belongs to another stage/run")
        run = load_run(con, request["run_id"])
        require(run["stage_attempts"].get(request["stage_id"]) == attempt_id, "execution ownership changed")
        ws = deepcopy(attempt["capstone_workspace"])
        require(ws.get("dataset_id") == request["dataset_id"], "dataset changed; late result discarded")
        dataset = dataset_record(con, run, ws["dataset_id"])
        require(dataset and dataset["data"]["content_hash"] == request["dataset_hash"], "dataset is unavailable or changed")
        tasks = {t["id"] for t in run["challenges"][request["stage_id"]]["dataset_sql"]["tasks"]}
        require(request["task_id"] in tasks, "unknown SQL task")
        draft = (attempt.get("sql_workspace") or {}).get("drafts", {}).get(request["task_id"], "")
        require(fingerprint(draft) == request["query_hash"], "query changed; late result discarded")
        ws["executions"][request["task_id"]] = evidence(request, result)
        validate_stage_workspace(ws)
        con.execute("UPDATE attempts SET capstone_workspace=?,updated_at=? WHERE attempt_id=?", (json.dumps(ws, default=str), stamp(), attempt_id))
        return ws["executions"][request["task_id"]]


def cancel(state):
    pending = state.pop("capstone_sql_job", None)
    if pending:
        pending["job"].cancel()
    state.pop("capstone_sql_result_pending", None)


def navigation_safe(state):
    """Unsaved browser edits, failed drafts and failed evidence block leaving."""
    return not (state.get("capstone_sql_pending") or state.get("capstone_sql_dirty")
                or state.get("capstone_sql_result_pending"))


@dataclass(frozen=True)
class WorkspaceView:
    saved_workspace: dict
    editor_workspace: dict
    active: str
    busy: bool
    last_result: dict | None
    result_outdated: bool
    pending_draft: bool
    pending_result: bool
    can_leave: bool
    error: str | None = None
    rerun: bool = False


class DatasetWorkspace:
    def __init__(self, state, path, attempt_id, *, start_job=SQLJob):
        self.state, self.path, self.attempt_id, self.start_job = state, path, attempt_id, start_job
        self.attempt, self.run, self.challenge, self.snapshot = dataset_for_attempt(path, attempt_id)
        self.owner = (str(Path(path).resolve()), self.run["run_id"], self.attempt["project_stage_id"], attempt_id,
                      self.snapshot["dataset_id"], self.snapshot["data"]["content_hash"])
        self.exercise = editor_exercise(self.challenge, self.snapshot["data"])
        self.editor_hash = fingerprint({"run": self.owner[1], "stage": self.owner[2], "dataset": self.owner[4], "hash": self.owner[5]})
        if state.get("capstone_sql_owner") != self.owner:
            cancel(state)
            state["capstone_sql_owner"] = self.owner
            state["capstone_sql_active"] = self.exercise["tasks"][0]["id"]
            state.pop("capstone_sql_event", None)
            state.pop("capstone_sql_error", None)

    @property
    def workspace(self):
        self._require_owner()
        latest = database.get_attempt(self.path, self.attempt_id)
        require(latest is not None, "attempt no longer exists")
        return validate_workspace(latest.get("sql_workspace") or new_workspace(self.exercise))

    @property
    def busy(self):
        return self.state.get("capstone_sql_owner") == self.owner and bool(self.state.get("capstone_sql_job"))

    def _require_owner(self):
        require(self.state.get("capstone_sql_owner") == self.owner, "workspace changed; reopen the saved dataset")

    def mark_pending(self, pending):
        """Ignore callbacks retained by an editor belonging to an old owner."""
        if self.state.get("capstone_sql_owner") == self.owner:
            self.state["capstone_sql_dirty"] = bool(pending)

    def view(self, *, rerun=False):
        saved = self.workspace
        pending = self.state.get("capstone_sql_pending")
        pending = pending if pending and pending["owner"] == self.owner else None
        editor = pending["workspace"] if pending else saved
        active = pending["event"]["active"] if pending else self.state["capstone_sql_active"]
        last = self.state.get("capstone_sql_last")
        last = last if last and last["owner"] == self.owner else None
        outdated = bool(last and fingerprint(editor["drafts"].get(last["request"]["task_id"], "")) != last["request"]["query_hash"])
        return WorkspaceView(saved_workspace=deepcopy(saved), editor_workspace=deepcopy(editor),
            active=active, busy=self.busy, last_result=deepcopy(last), result_outdated=outdated,
            pending_draft=bool(pending), pending_result=bool(self.state.get("capstone_sql_result_pending")),
            can_leave=navigation_safe(self.state), error=self.state.get("capstone_sql_error"), rerun=rerun)

    def _recover(self, operation):
        self._require_owner()
        try:
            changed = operation()
            if changed:
                self.state.pop("capstone_sql_error", None)
            return self.view(rerun=bool(changed))
        except Exception as exc:
            self.state["capstone_sql_error"] = str(exc)
            return self.view()

    def refresh(self):
        """Poll owned work, retaining finished evidence until its save succeeds."""
        return self._recover(self._poll)

    def apply(self, event):
        """Save before execution; report recovery without exposing state keys."""
        return self._recover(lambda: self._apply(event))

    def retry(self):
        """Retry retained drafts as saves only, then retry finished evidence."""
        def recover():
            pending = self.state.get("capstone_sql_pending")
            changed = False
            if pending and pending["owner"] == self.owner:
                changed = self._apply({**pending["event"], "action": "save"})
            return self._poll() or changed
        return self._recover(recover)

    def _apply(self, event):
        if event is None:
            return
        require(isinstance(event, dict) and isinstance(event.get("id"), str) and event["id"], "SQL events need an identity")
        if event["id"] == self.state.get("capstone_sql_event"):
            return
        require(event.get("attemptId") == self.attempt_id and event.get("exerciseHash") == self.editor_hash, "event belongs to another saved dataset")
        require(event.get("action") in ("save", "run", "cancel"), "dataset workspaces have no automatic correctness checks")
        valid_ids = {t["id"] for t in self.exercise["tasks"]} | {"scratch"}
        require(isinstance(event.get("drafts"), dict) and not set(event["drafts"]) - valid_ids and event.get("active") in valid_ids, "invalid SQL task draft")
        updated = validate_workspace({"version": 1, "drafts": event["drafts"], "assessment": None})
        self.state["capstone_sql_pending"] = {"owner": self.owner, "workspace": updated, "event": deepcopy(event)}
        if updated != self.workspace:
            database.save_sql_workspace(self.path, self.attempt_id, updated)
        self.state.pop("capstone_sql_pending", None)
        self.state["capstone_sql_event"] = event["id"]
        self.state["capstone_sql_active"] = event["active"]
        self.state.pop("capstone_sql_dirty", None)
        if event["action"] == "cancel":
            pending = self.state.get("capstone_sql_job")
            if pending:
                pending["job"].cancel()
                pending["result"] = {"ok": False, "error": "Cancelled."}
                self._poll()
        elif event["action"] == "run" and not self.busy:
            query = updated["drafts"].get(event["active"], "")
            request = {"run_id": self.run["run_id"], "stage_id": self.attempt["project_stage_id"], "dataset_id": self.snapshot["dataset_id"],
                       "dataset_hash": self.snapshot["data"]["content_hash"], "task_id": event["active"], "query_hash": fingerprint(query), "request_id": str(uuid4())}
            self.state["capstone_sql_job"] = {"owner": self.owner, "request": request,
                "sql": query,
                "job": self.start_job(None, "run", dataset=self.snapshot["data"], sql=query)}
        return True

    def _poll(self):
        pending = self.state.get("capstone_sql_job")
        result = pending.get("result", pending["job"].result) if pending else None
        if result is None:
            return False
        try:
            require(pending["owner"] == self.owner, "late result belongs to a different dataset")
            if pending["request"]["task_id"] != "scratch":
                save_evidence(self.path, self.attempt_id, pending["request"], result)
        except ValueError:
            # Obsolete responses deliberately do not attach to current work.
            self.state.pop("capstone_sql_job", None)
            self.state.pop("capstone_sql_result_pending", None)
            raise
        except Exception:
            self.state["capstone_sql_result_pending"] = True
            raise
        self.state.pop("capstone_sql_job", None)
        self.state.pop("capstone_sql_result_pending", None)
        self.state["capstone_sql_last"] = {"owner": self.owner, "request": pending["request"], "sql": pending["sql"], "result": result}
        return True
