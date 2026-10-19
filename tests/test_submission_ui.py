from copy import deepcopy
from pathlib import Path
import pytest
from streamlit.testing.v1 import AppTest
from src import config, database as db, constructor_artifacts as a
from test_constructor_attempts import start, entity

ROOT = Path(__file__).resolve().parents[1]


def test_preview_cache_keeps_a_complete_workspace_and_isolates_owners(monkeypatch):
    from src import submission_ui
    from src.pipeline_models import empty_document
    original = submission_ui.validate_payload
    validations = []
    def validate(*args):
        validations.append(args)
        return original(*args)
    monkeypatch.setattr(submission_ui, "validate_payload", validate)
    submission_ui.preview_data.clear()
    def preview(owner, slot, name="Saved design"):
        return submission_ui.preview_data(owner, 1, slot, 1, "saved", {
            "tool": "pipeline", "revision": 1, "payload": empty_document(name)
        }, {"tool": "pipeline"})
    try:
        # Twelve is the supported workspace slot limit; a full rerender must
        # not evict each previous slot before it can be reused.
        for slot in range(12):
            preview("first.db", str(slot))
        for slot in range(12):
            result = preview("first.db", str(slot))
            result[0]["name"] = "Caller edit"
        assert len(validations) == 12
        assert preview("first.db", "11")[0]["name"] == "Saved design"
        assert preview("second.db", "11", "Other owner")[0]["name"] == "Other owner"
        assert preview("first.db", "11")[0]["name"] == "Saved design"
    finally:
        submission_ui.preview_data.clear()


def app_for(path, monkeypatch, aid):
    from src.erd_component import _component
    from src.pipeline_component import _component as pipeline_component
    _component.clear()
    pipeline_component.clear()
    monkeypatch.setattr(config, "DB_PATH", path)
    app = AppTest.from_file(str(ROOT / "app.py"), default_timeout=30).run()
    app.session_state["active_attempt"] = aid
    app.session_state["active_challenge"] = db.get_attempt(path, aid)["challenge_id"]
    app.run()
    assert not app.exception
    return app


def test_overview_lazy_independent_read_only_and_failed_preview_summary(tmp_path, monkeypatch):
    path = tmp_path / "progress.db"
    aid, _ = start(path, "CM-002")
    for slot, kind in (("conceptual", "conceptual_erd"), ("logical", "logical_erd")):
        a.save_artifact(path, aid, slot, entity(kind, slot.title()), 0)
    app = app_for(path, monkeypatch, aid)
    from src import submission_ui
    calls = []
    original = submission_ui.render_preview
    def render(*args):
        calls.append(args[3])
        if "logical" in args[3]:
            raise RuntimeError("simulated preview failure")
        return original(*args)
    monkeypatch.setattr(submission_ui, "render_preview", render)
    before = deepcopy(db.get_attempt(path, aid))
    app.run()
    assert calls == []
    app.session_state[f"submission_overview_{aid}"] = True
    app.run()
    assert not app.exception
    assert len(calls) == 2
    assert any("Visual preview unavailable" in w.value for w in app.warning)
    assert len([b for b in app.button if b.label == "Open deliverable"]) == 2
    assert db.get_attempt(path, aid) == before


@pytest.mark.parametrize("identity", ["REP-001", "REP-002", "REP-003"])
def test_starter_opening_and_original_reference_do_not_save(tmp_path, monkeypatch, identity):
    path = tmp_path / "progress.db"
    aid, challenge = start(path, identity)
    app = app_for(path, monkeypatch, aid)
    slot = challenge["constructor_tasks"]["slots"][0]
    app.session_state["attempt_constructor"] = (aid, slot["id"])
    before = deepcopy(db.get_attempt(path, aid))
    app.run()
    assert not app.exception
    assert db.get_attempt(path, aid) == before
    # Adapter identity is the same one the app rendered; the session key is stable.
    import hashlib
    key = "attempt_constructor_" + hashlib.sha256((str(path.resolve()) + f"attempt:{aid}:artifact:{slot['id']}").encode()).hexdigest()[:24]
    app.session_state[key + "_original"] = True
    app.run()
    assert not app.exception
    assert db.get_attempt(path, aid) == before
    if identity == "REP-003":
        from src import mock_jobs
        mock_jobs.close(app.session_state["mock_workspace"])


@pytest.mark.parametrize("identity,slot_id,edit", [
    ("CM-004", "pipeline", lambda p: p.update(notes="Restart and reconciliation reasoning")),
    ("SQL-013", "migration", lambda p: p.update(reviewed_sql="SELECT 1")),
    ("MOCK-001", "fixtures", lambda p: p["recipe"].update(seed=55)),
])
def test_workspace_edits_resume_exact_slot(tmp_path, identity, slot_id, edit):
    path = tmp_path / "progress.db"
    aid, _ = start(path, identity)
    attempt = db.get_attempt(path, aid)
    slot = next(s for s in attempt["constructor_workspace"]["tasks"]["slots"] if s["id"] == slot_id)
    p = a.initial_payload(slot)
    edit(p)
    a.save_artifact(path, aid, slot_id, p, 0)
    db.init_db(path)
    saved = db.get_attempt(path, aid)
    assert saved["resume_target"] == "artifact:" + slot_id
    assert saved["activity_at"]


@pytest.mark.parametrize("identity", ["REP-001", "REP-003"])
def test_ui_blocks_missing_diagnosis_and_stale_generation(tmp_path, monkeypatch, identity):
    from repair_examples import repaired
    path = tmp_path / "progress.db"
    aid, challenge = start(path, identity)
    slot = challenge["constructor_tasks"]["slots"][0]
    p = repaired(identity, a.initial_payload(slot))
    if identity == "REP-003":
        p["generation"] = {"status": "complete", "recipe_hash": "0" * 64, "recipe_revision": 0,
            "manifest": {"format": "constructor-mock-manifest", "version": 1, "tables": []}, "samples": {}}
    a.save_artifact(path, aid, slot["id"], p, 0)
    app = app_for(path, monkeypatch, aid)
    complete = next(b for b in app.button if b.label == "Mark Complete")
    assert complete.disabled
    next(t for t in app.text_area if t.label == "Your solution").set_value("Diagnosis and verification reasoning").run()
    assert not app.exception
    complete = next(b for b in app.button if b.label == "Mark Complete")
    assert complete.disabled == (identity == "REP-003")


def test_legacy_streamlit_expander_loads_only_on_explicit_action(tmp_path, monkeypatch):
    import streamlit as st
    path = tmp_path / "progress.db"
    aid, _ = start(path, "CM-002")
    real_expander = st.expander
    def old_expander(label, **kwargs):
        assert "on_change" not in kwargs
        assert "key" not in kwargs
        return real_expander(label, **kwargs)
    monkeypatch.setattr(st, "expander", old_expander)
    app = app_for(path, monkeypatch, aid)
    assert not app.exception
    before = db.get_attempt(path, aid)
    next(c for c in app.checkbox if c.label == "Load saved previews").check().run()
    assert not app.exception
    assert len([b for b in app.button if b.label == "Open deliverable"]) == 2
    assert db.get_attempt(path, aid) == before
