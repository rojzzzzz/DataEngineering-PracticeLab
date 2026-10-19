from pathlib import Path
from streamlit.testing.v1 import AppTest

from capstone_examples import bank, model, recipe, save_model
from src import config, database as db, capstone_store as store
from src.practice_navigation import PracticeNavigation

ROOT = Path(__file__).resolve().parents[1]


def widget(widgets, label):
    return next(w for w in widgets if w.label == label)


def app(path, monkeypatch):
    monkeypatch.setattr(config, "DB_PATH", path)
    db.init_db(path)
    return AppTest.from_file(str(ROOT / "app.py"), default_timeout=25).run()


def test_project_previews_lazy_stage_creation_structured_writing_and_refresh(tmp_path, monkeypatch):
    path = tmp_path / "progress.db"
    page = app(path, monkeypatch)
    session = next(e for e in page.expander if e.label.startswith("Session:"))
    assert any(b.label == "Open connected capstone" for b in session.button)
    widget(page.button, "Open connected capstone").click().run()
    assert not page.exception
    assert db.list_attempts(path) == [] and store.list_runs(path) == []
    [b for b in page.button if b.label == "Preview stage"][-1].click().run()
    assert not page.exception and db.list_attempts(path) == []
    assert any(m.value == "**Stage brief**" for m in page.markdown)
    assert sum(b.label == "Hide preview" for b in page.button) == 1
    widget(page.button, "Hide preview").click().run()
    assert not any(m.value == "**Stage brief**" for m in page.markdown)
    widget(page.button, "Start a new independent run").click().run()
    assert not page.exception
    run = store.list_runs(path)[0]
    assert db.list_attempts(path) == []
    starts = [b for b in page.button if b.label == "Start stage"]
    assert not starts[0].disabled and all(b.disabled for b in starts[1:])
    starts[0].click().run()
    assert not page.exception
    assert len(db.list_attempts(path)) == 1
    aid = db.list_attempts(path)[0]["attempt_id"]
    widget(page.text_area, "Business processes").set_value("Subscription ordering and fulfillment.").run()
    widget(page.button, "Back to project overview").click().run()
    assert not page.exception
    assert "Subscription ordering" in db.get_attempt(path, aid)["answer"]
    for _ in range(2):
        next(b for b in page.button if b.label == "Open stage").click().run()
        assert not page.exception
        assert widget(page.text_area, "Business processes").value == "Subscription ordering and fulfillment."
        widget(page.button, "Back to project overview").click().run()
        assert "Subscription ordering" in db.get_attempt(path, aid)["answer"]
    # A new browser session restores project context without minting attempts.
    fresh = AppTest.from_file(str(ROOT / "app.py"), default_timeout=25)
    fresh.query_params["project"] = run["run_id"]
    fresh.query_params["stage"] = "business"
    fresh.run()
    assert not fresh.exception
    assert widget(fresh.text_area, "Business processes").value == "Subscription ordering and fulfillment."
    assert len(db.list_attempts(path)) == 1
    widget(fresh.button, "Back to project overview").click().run()
    assert not fresh.exception
    assert fresh.session_state["mode"] == "Connected Capstone"


def test_bank_preview_routes_project_without_creating_an_attempt(tmp_path):
    path = tmp_path / "project.db"
    db.init_db(path)
    b = bank()
    state = {}
    nav = PracticeNavigation(state, path, b["challenges"], lambda: None)
    assert nav.go("preview", "COF-005")
    assert state["mode"] == "Connected Capstone" and not state.get("active_attempt")
    assert db.list_attempts(path) == []


def test_progress_reopens_saved_stage_after_bank_removes_project(tmp_path, monkeypatch):
    import json
    path = tmp_path / "history.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    aid = store.start_stage(path, run["run_id"], "business")
    b["capstones"] = []
    b["challenges"] = [c for c in b["challenges"] if not c.get("capstone")]
    bank_path = tmp_path / "bank.json"
    bank_path.write_text(json.dumps(b), encoding="utf-8")
    monkeypatch.setattr(config, "CHALLENGES_PATH", bank_path)
    monkeypatch.setattr(config, "BUNDLED_CHALLENGES_PATH", bank_path)
    for name in ("SOURCE_PATH", "VALIDATION_REPORT_PATH", "IMPORTS_DIR", "VERSIONS_DIR"):
        monkeypatch.setattr(config, name, tmp_path / name.lower())
    page = app(path, monkeypatch)
    widget(page.radio, "Navigate").set_value("Progress").run()
    assert not page.exception
    assert run["challenges"]["business"]["title"] in widget(page.selectbox, "Practice history").options[0]
    assert not widget(page.button, "Open attempt").disabled
    widget(page.button, "Open attempt").click().run()
    assert not page.exception
    assert page.session_state["active_attempt"] == aid
    assert widget(page.text_area, "Business processes")


def test_stage_evaluation_uses_saved_brief_and_rechecks_upstream_context(tmp_path, monkeypatch):
    import json
    from copy import deepcopy
    from src import constructor_artifacts as artifacts
    path = tmp_path / "evaluation.db"
    db.init_db(path)
    b, r = bank(), recipe()
    run = store.create_run(path, b["capstones"][0], b)
    bid = save_model(path, run, "business", model("conceptual_erd", r))
    aid = save_model(path, run, "operational", model("logical_erd", r))
    challenge = run["challenges"]["operational"]
    # The saved run remains the authority after the installed brief changes.
    next(c for c in b["challenges"] if c["id"] == challenge["id"])["title"] = "A changed bank brief"
    bank_path = tmp_path / "bank.json"
    bank_path.write_text(json.dumps(b), encoding="utf-8")
    for name in ("CHALLENGES_PATH", "BUNDLED_CHALLENGES_PATH", "SOURCE_PATH"):
        monkeypatch.setattr(config, name, bank_path)
    for name in ("VALIDATION_REPORT_PATH", "IMPORTS_DIR", "VERSIONS_DIR"):
        monkeypatch.setattr(config, name, tmp_path / name.lower())
    page = app(path, monkeypatch)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "operational"
    page.run()
    scores = {k: v / 2 for k, v in b["rubrics"][challenge["rubric_ref"]].items()}
    proposal = {"rubric_scores": scores, "total_score": sum(scores.values()), "weak_topics": [], "mistake_categories": [], "feedback": "Reviewed snapshot"}
    widget(page.text_area, "Paste an external JSON evaluation").set_value(json.dumps(proposal)).run()
    widget(page.button, "Review external evaluation").click().run()
    widget(page.button, "Apply suggestion to editable form").click().run()
    assert not page.exception
    assert not any("outdated" in e.value.lower() for e in page.error)
    assert widget(page.text_area, "Evaluator feedback").value == "Reviewed snapshot"
    assert db.get_attempt(path, aid)["score"] is None
    source = db.get_attempt(path, bid)["constructor_workspace"]["artifacts"]["conceptual"]
    payload = deepcopy(source["payload"])
    payload["entities"][0]["name"] = "Changed upstream business concept"
    artifacts.save_artifact(path, bid, "conceptual", payload, source["revision"])
    # No browser refresh: the apply callback must re-read the current source.
    widget(page.button, "Apply suggestion to editable form").click().run()
    assert not page.exception
    assert "outdated" in page.session_state["ai_apply_error"].lower()
    assert not any(b.label == "Apply suggestion to editable form" for b in page.button)
    assert db.get_attempt(path, aid)["score"] is None


def test_written_save_failure_blocks_leaving_and_clear_survives_reopen(tmp_path, monkeypatch):
    path = tmp_path / "writing.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    aid = store.start_stage(path, run["run_id"], "business")
    labels = run["definition"]["stages"][0]["written_sections"]
    page = app(path, monkeypatch)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "business"
    page.run()
    widget(page.text_area, labels[0]).set_value("Saved first section").run()
    widget(page.text_area, labels[1]).set_value("Saved second section").run()
    saved = db.get_attempt(path, aid)["answer"]
    save = db.save_attempt_details
    def fail(*args, **kwargs):
        raise OSError("disk full")
    monkeypatch.setattr(db, "save_attempt_details", fail)
    widget(page.text_area, labels[0]).set_value("Recover this pending section").run()
    widget(page.button, "Back to project overview").click().run()
    assert not page.exception
    assert widget(page.text_area, labels[0]).value == "Recover this pending section"
    assert db.get_attempt(path, aid)["answer"] == saved
    monkeypatch.setattr(db, "save_attempt_details", save)
    widget(page.button, "Retry saving answer").click().run()
    widget(page.text_area, labels[1]).set_value("").run()
    widget(page.button, "Back to project overview").click().run()
    widget(page.button, "Open stage").click().run()
    assert not page.exception
    assert widget(page.text_area, labels[0]).value == "Recover this pending section"
    assert widget(page.text_area, labels[1]).value == ""
    assert "Saved second section" not in db.get_attempt(path, aid)["answer"]


def test_stage_snapshot_brief_survives_bank_edit_and_constructor_refresh(tmp_path, monkeypatch):
    path = tmp_path / "project.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    aid = save_model(path, run, "business", model("conceptual_erd", recipe()))
    stage = store.start_stage(path, run["run_id"], "operational")
    page = app(path, monkeypatch)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "operational"
    page.query_params["attempt"] = str(stage)
    page.query_params["workspace"] = "logical"
    page.run()
    assert not page.exception
    assert any(t.value == run["challenges"]["operational"]["title"] for t in page.title)
    assert db.get_attempt(path, stage)["constructor_workspace"]["artifacts"] == {}


def test_run_deletion_requires_confirmation_and_clears_the_selected_route(tmp_path, monkeypatch):
    path = tmp_path / "delete.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    aid = store.start_stage(path, run["run_id"], "business")
    other = store.create_run(path, b["capstones"][0], b)
    page = app(path, monkeypatch)
    widget(page.button, "Open connected capstone").click().run()
    widget(page.selectbox, "Project run").select(run["run_id"]).run()
    assert not page.exception and widget(page.button, "Delete this run").disabled
    assert db.get_attempt(path, aid) is not None
    widget(page.checkbox, "I understand this deletes the run and its saved work").check().run()
    assert not widget(page.button, "Delete this run").disabled
    widget(page.button, "Delete this run").click().run()
    assert not page.exception
    assert not page.query_params.get("project")
    assert not page.session_state.get("active_attempt")
    assert db.get_attempt(path, aid) is None
    assert [r["run_id"] for r in store.list_runs(path)] == [other["run_id"]]
    assert any("Project run deleted" in n.value for n in page.info)


def test_stage_context_shows_project_title_without_internal_identifiers(tmp_path, monkeypatch):
    path = tmp_path / "context.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    store.start_stage(path, run["run_id"], "business")
    page = app(path, monkeypatch)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "business"
    page.run()
    assert not page.exception
    assert any(c.value == run["definition"]["title"] for c in page.caption)
    assert not any(" · Run " in c.value or "Connected Capstone /" in c.value for c in page.caption)


def test_deleted_run_link_returns_to_the_project_chooser(tmp_path, monkeypatch):
    path = tmp_path / "deleted-link.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    other = store.create_run(path, b["capstones"][0], b)
    store.delete_run(path, run["run_id"], expected_revision=run["revision"])
    page = app(path, monkeypatch)
    page.query_params.update(project=run["run_id"], stage="business", attempt="9999", workspace="conceptual")
    page.run()
    assert not page.exception
    assert page.session_state["mode"] == "Connected Capstone"
    assert len(widget(page.selectbox, "Project run").options) == 2
    assert not any(key in page.query_params for key in ("project", "stage", "attempt", "workspace"))
    assert [r["run_id"] for r in store.list_runs(path)] == [other["run_id"]]
