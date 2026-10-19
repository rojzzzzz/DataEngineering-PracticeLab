"""One cancellable validation queue shared by bank imports and Python practice."""
import json
import streamlit as st

from src import python_runner
from src.authoring import repair_prompt
from src.python_models import fingerprint
from src.python_validation import validation_record, save_validation


def stop_validation():
    job = st.session_state.pop("python_validation_job", None)
    if job:
        try:
            python_runner.cancel(job["id"])
        except RuntimeError:
            pass


def render_validation(database, exercises, scope, repair_original=None):
    exercises = [e for e in exercises if e["version"] == 2]
    if not exercises:
        stop_validation()
        return True
    owner = fingerprint({"scope": scope, "exercises": exercises})
    if st.session_state.get("python_validation_owner") != owner:
        stop_validation()
        st.session_state.python_validation_owner = owner
        st.session_state.pop("python_validation_error", None)

    @st.fragment(run_every=.5 if st.session_state.get("python_validation_job") else None)
    def panel():
        health = python_runner.health()
        runner_hash = health.get("runner_hash")
        records = [validation_record(database, e, runner_hash) for e in exercises]
        job = st.session_state.get("python_validation_job")
        if job:
            if st.button("Cancel validation", key=scope + "_cancel_validation"):
                stop_validation()
                st.rerun()
            try:
                snapshot = python_runner.poll(job["id"])
                if snapshot["state"] == "finished":
                    st.session_state.pop("python_validation_job", None)
                    if snapshot["result"].get("passed") and snapshot["runner_hash"] == runner_hash:
                        save_validation(database, exercises[job["index"]], snapshot)
                        records[job["index"]] = snapshot["result"]
                        remaining = next((i for i, record in enumerate(records) if not record), None)
                        if remaining is not None:
                            submitted = python_runner.validate(exercises[remaining])
                            st.session_state.python_validation_job = {**submitted, "index": remaining, "scope": scope}
                    else:
                        st.session_state.python_validation_error = f"Exercise {job['index'] + 1} ({exercises[job['index']]['function']}): " + json.dumps(snapshot["result"], ensure_ascii=False)
                    st.rerun()
                st.info(f"Validating exercise {job['index'] + 1} of {len(exercises)} · {snapshot['state']}…")
            except (RuntimeError, ValueError) as exc:
                stop_validation()
                st.session_state.python_validation_error = str(exc)
                st.rerun()
        if not health["ready"]:
            st.warning(health["error"])
            if st.button("Retry validation connection", key=scope + "_retry_validation"):
                st.rerun()
        if all(records):
            st.success("Python exercises verified for this installation and runtime.")
            with st.expander("Reference validation measurements"):
                for exercise, record in zip(exercises, records):
                    st.write(exercise["function"])
                    st.json({"targets": exercise.get("targets", {}), "reference": record})
            return True
        if error := st.session_state.get("python_validation_error"):
            st.error(error[:4000])
            with st.expander("Repair the exercise with your AI"):
                if scope == "import" and repair_original is not None:
                    from src.authoring_ui import render_repair
                    render_repair(error,repair_original)
                else:
                    st.code(repair_prompt(error), language="text", height=220)
        st.caption("New or changed Python exercises need local reference validation. This also verifies any requested time and allocation targets.")
        if st.button("Validate Python exercises", disabled=not health["ready"] or job is not None, key=scope + "_validate"):
            index = next(i for i, record in enumerate(records) if not record)
            try:
                submitted = python_runner.validate(exercises[index])
                st.session_state.pop("python_validation_error", None)
                st.session_state.python_validation_job = {**submitted, "index": index, "scope": scope}
                st.rerun()
            except RuntimeError as exc:
                st.error(str(exc))
        return False

    return panel()
