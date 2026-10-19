"""Python editor, remote job polling, and independent assessment results."""
import streamlit as st

from src import python_runner
from src.python_component import python_editor
from src.python_models import normalized_exercise
from src.python_validation_ui import render_validation
from src.python_workspace import PythonWorkspace, cancel_python_job


def stop_python_job():
    cancel_python_job(st.session_state, python_runner)


@st.cache_data(ttl=5, show_spinner=False)
def runner_health():
    return python_runner.health()


def render_console(result, stale=False):
    """Keep execution metadata and copyable output together in one compact panel."""
    status = "Outdated" if stale else "Completed" if result.get("ok") else "Stopped"
    tone = "muted" if stale else "success" if result.get("ok") else "error"
    timing = (
        f'<span class="py-console-time" title="File execution time; container startup excluded">'
        f'{result["elapsed_ms"]:.2f} <span>ms</span></span>'
        if "elapsed_ms" in result else ""
    )
    with st.container(border=True, key="python_console"):
        st.html(f"""
            <style>
            .st-key-python_console {{
                background: #fff; border-radius: 14px;
                box-shadow: 0 3px 12px #172a3606;
            }}
            .st-key-python_console [data-testid="stVerticalBlock"] {{ gap: .45rem; }}
            .py-console-header {{
                display: flex; align-items: center; flex-wrap: wrap;
                gap: 10px; padding: 2px 0 10px;
                border-bottom: 1px solid #e5eeea;
                font-family: system-ui, sans-serif;
            }}
            .py-console-title {{ font-size: 14px; font-weight: 650; color: #172a36; }}
            .py-console-status {{ font-size: 11px; font-weight: 600; border-radius: 20px; padding: 4px 9px; }}
            .py-console-status.success {{ background: #e5f4ed; color: #17634b; }}
            .py-console-status.error {{ background: #fff0eb; color: #a03f29; }}
            .py-console-status.muted {{ background: #fff3d9; color: #805a13; }}
            .py-console-time {{
                margin-left: auto; font: 600 13px ui-monospace, monospace;
                color: #234f48; background: #f1f6f4; padding: 5px 9px; border-radius: 6px;
            }}
            .py-console-time span {{ font-weight: 400; color: #62766f; }}
            .py-console-stream {{
                font: 600 11px system-ui, sans-serif; letter-spacing: .06em;
                text-transform: uppercase; color: #62766f; padding-top: 6px;
            }}
            .st-key-python_console [data-testid="stCode"] {{ border: 1px solid #e5eeea; border-radius: 8px; }}
            .st-key-python_console [data-testid="stCode"] pre {{ max-height: 320px; overflow: auto; }}
            </style>
            <div class="py-console-header">
                <span class="py-console-title">Console</span>
                <span class="py-console-status {tone}">{status}</span>{timing}
            </div>
        """)
        if stale:
            st.caption("From an earlier draft · run again to refresh.")
        if not result.get("ok"):
            st.error(result.get("error", "Execution failed."))
        for stream, label in (("stdout", "Output"), ("stderr", "Diagnostics")):
            if result.get(stream):
                st.html(f'<div class="py-console-stream">{label}</div>')
                # Keep submitted text out of HTML and retain Streamlit's copy button.
                st.code(result[stream], language="text")
        if result.get("ok") and not result.get("stdout") and not result.get("stderr"):
            st.caption("Run completed without console output. Add print() and run again to display a value.")


def render_python(database, attempt, exercise):
    aid = attempt["attempt_id"]
    coordinator = PythonWorkspace(st.session_state, database, aid, exercise, runner=python_runner)
    older = [p["source"] for owner, p in st.session_state.get("python_pending_drafts", {}).items()
             if owner[:2] == coordinator.owner[:2] and owner != coordinator.owner]
    if older:
        st.warning("An unsaved Python draft belongs to an earlier version of this exercise. Download it before ending this session; review it before copying it into the current editor.")
        st.download_button("Download earlier Python drafts", "\n\n# Earlier draft\n".join(older),
                           file_name="earlier-python-drafts.py", mime="text/plain", key=f"python_earlier_{aid}")
    st.subheader("Python Practice")
    st.caption("CPython 3.14.2 · standard library · no interactive input · isolated execution")
    st.write(exercise["contract"])
    targets = exercise.get("targets", {})
    descriptions = []
    if "time_ms" in targets:
        descriptions.append(f"each measured call ≤ {targets['time_ms']:g} ms")
    if "memory_bytes" in targets:
        descriptions.append(f"peak Python allocations ≤ {targets['memory_bytes']/1048576:g} MiB")
    st.info("Targets: " + "; ".join(descriptions) + ". Prepared inputs are excluded." if targets else "Correctness exercise · no time or memory targets.")
    with st.expander("Examples"):
        for example in normalized_exercise(exercise)["examples"]:
            arguments = [repr(value) for value in example["args"]]
            arguments.extend(f"{name}={value!r}" for name, value in example["kwargs"].items())
            st.code(f"{exercise['function']}({', '.join(arguments)}) == {example['expected']!r}", language="python")
    validation_ready = render_validation(database, [exercise], f"practice_{aid}")

    @st.fragment(run_every=.5 if coordinator.busy else None)
    def workspace_fragment():
        health = runner_health()
        view = coordinator.view(health)
        if view.error:
            st.error(view.error)
            return
        if not health["ready"]:
            st.warning(health["error"])
            if st.button("Retry connection", key=f"python_retry_{aid}"):
                runner_health.clear()
                st.rerun()
        event = python_editor(aid, view.exercise_hash, view.workspace["source"], exercise["starter_code"],
                              view.busy, health["ready"], view.assessed_source, validation_ready, on_pending_change=coordinator.mark_pending)
        pending_before = view.pending_save
        if pending_before and st.button("Retry saving Python draft", key=f"python_save_retry_{aid}"):
            event = None  # Retry persistence without resending an execution request.
        view = coordinator.apply(event, health)
        if view.rerun:
            st.rerun()
        if view.error:
            st.error(view.error)
        if view.pending_save:
            st.caption("Save failed · Your Python draft remains in this session. Retry saving before leaving.")
            if not pending_before:
                # Expose the retry immediately on the first failed save. On the
                # next render it must be read before applying the retained event.
                st.button("Retry saving Python draft", key=f"python_save_retry_{aid}")
        if view.job_state:
            st.caption("Queued…" if view.job_state == "queued" else "Executing in an isolated container…")
        assessment = view.workspace.get("assessment")
        if assessment:
            outdated = view.assessment_outdated
            st.markdown("**Assessment" + (" · Outdated — check again**" if outdated else "**"))
            result = assessment["result"]
            for column, (label, key) in zip(st.columns(3), (("Correctness", "correctness"), ("Time target", "time_passed"), ("Memory target", "memory_passed"))):
                with column.container(border=True):
                    value = result.get(key)
                    st.markdown(f"**{label}**")
                    status = result.get("time_status" if key == "time_passed" else "memory_status" if key == "memory_passed" else "", "unavailable")
                    st.write("✓ Passed" if value is True else "✕ Failed" if value is False else "— Not requested" if status == "not_requested" else "— Unavailable")
                    if key == "correctness":
                        st.caption(f"{result['cases_passed']} / {result['cases_total']} cases passed · inputs preserved" if "cases_total" in result else "Return value and input preservation")
                    elif key == "time_passed" and "time_ms" in targets:
                        st.caption(f"Maximum {result['max_ms']:.2f} / {targets['time_ms']:g} ms" if "max_ms" in result else f"Target ≤ {targets['time_ms']:g} ms")
                    elif key == "memory_passed" and "memory_bytes" in targets:
                        st.caption(f"Peak {result['peak_bytes']/1024:.2f} / {targets['memory_bytes']/1024:g} KiB" if "peak_bytes" in result else f"Target ≤ {targets['memory_bytes']/1024:g} KiB")
            if result.get("passed") and not outdated:
                st.success("All three checks passed." if len(targets) == 2 else "All required checks passed.")
            if result.get("error"):
                st.error(result["error"])
            if "failure_input" in result:
                for field, label in (("failure_input", "Failing input"), ("failure_expected", "Expected"), ("failure_actual", "Actual")):
                    st.caption(label)
                    st.code(result.get(field, ""), language="text")
            if "median_ms" in result:
                st.caption(f"Median call: {result['median_ms']:.2f} ms")
            if targets:
                st.caption("Five calls after one warm-up; startup and input preparation excluded. Memory is measured separately, not total RAM. Host load can affect timings; targets stay fixed.")
            with st.expander("Measurement details"):
                st.json(result)
        last = view.last_result
        if last:
            result = last["result"]
            render_console(result, view.result_outdated)
    workspace_fragment()
    with st.expander("Solution explanation · reveal when ready"):
        if st.checkbox("Reveal explanation", key=f"python_explanation_{aid}"):
            st.markdown(exercise["explanation"])
