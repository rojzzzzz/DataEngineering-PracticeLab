"""Observe the native answer field; persistence remains in the existing app flow."""
from pathlib import Path

import streamlit as st


def _component():
    return st.components.v2.component(
        "answer_save_status",
        html='<p class="answer-save-feedback" role="status" aria-live="polite"></p>',
        js=(Path(__file__).with_name("answer_status.js")).read_text(encoding="utf-8"),
        css='''[class*="st-key-answer_feedback_"] { display: none; }
        .answer-save-feedback { margin: 0; font-size: .875rem; line-height: 1.6;
            color: var(--st-text-color); opacity: .75; }''',
        isolate_styles=False,
    )


def answer_status(answer_key: str, saved_answer: str, message: str, error: bool):
    _component()(key=f"save_observer_{answer_key}", data={
        "answerKey": answer_key, "savedAnswer": saved_answer,
        "message": message, "error": error,
    }, height="content")
