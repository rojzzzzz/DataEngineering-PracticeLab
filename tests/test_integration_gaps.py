"""Cross-workflow failures exercised with isolated persistence and no providers."""
from copy import deepcopy
import json
from pathlib import Path

import pytest

from capstone_examples import bank
from src import database as db
from src.practice_navigation import PracticeNavigation


@pytest.mark.parametrize("kind", ["sql", "python"])
def test_failed_editor_save_survives_remount_and_blocks_navigation(tmp_path, monkeypatch, kind):
    b = bank()
    challenge = next(c for c in b["challenges"] if c["id"] == ("SQL-001" if kind == "sql" else "PY-001"))
    path = tmp_path / "practice.db"
    db.init_db(path)
    aid = db.save_attempt(path, {"challenge_id": challenge["id"], "status": "In progress"})
    state = {"navigate": "Practice", "active_attempt": aid, "active_challenge": challenge["id"]}
    cancellations = []
    nav = PracticeNavigation(state, path, b["challenges"], lambda: cancellations.append(True))
    def fail(*args):
        raise OSError("disk full")
    saver = getattr(db, "save_" + kind + "_workspace")
    if kind == "sql":
        from src.sql_models import new_workspace, fingerprint
        from src.sql_workspace import SQLWorkspace
        exercise = challenge["sql_playground"]
        editor = SQLWorkspace(state, path, aid, exercise, start_job=lambda *a, **kw: pytest.fail("unexpected execution"))
        drafts = new_workspace(exercise)["drafts"]
        task = exercise["tasks"][0]["id"]
        drafts[task] = "SELECT 'recover my SQL'"
        monkeypatch.setattr(db, "save_sql_workspace", fail)
        result = editor.apply({"id": "edit", "attemptId": aid, "exerciseHash": fingerprint(exercise), "action": "run", "active": task, "drafts": drafts})
        assert result.error
        remount = SQLWorkspace(state, path, aid, exercise, start_job=lambda *a, **kw: None).refresh()
        assert remount.editor_workspace["drafts"][task] == drafts[task]
    else:
        from src.python_models import fingerprint
        from src.python_workspace import PythonWorkspace
        exercise = challenge["python_playground"]
        editor = PythonWorkspace(state, path, aid, exercise)
        monkeypatch.setattr(db, "save_python_workspace", fail)
        result = editor.apply({"id": "edit", "attemptId": aid, "exerciseHash": fingerprint(exercise), "action": "save", "source": "print('recover Python')"}, {"ready": False})
        assert result.error and result.pending_save
    assert not nav.go("page", "Progress")
    assert state["navigate"] == "Practice" and state["active_attempt"] == aid
    assert not cancellations
    monkeypatch.setattr(db, "save_" + kind + "_workspace", saver)
    result = editor.apply(None) if kind == "sql" else editor.apply(None, {"ready": False})
    assert not result.error and not result.pending_save
    assert nav.go("page", "Progress") and cancellations == [True]


@pytest.mark.parametrize("kind", ["sql", "python"])
def test_pending_notifications_belong_to_current_editor_version(tmp_path, monkeypatch, kind):
    from types import SimpleNamespace
    b = bank()
    challenge = next(c for c in b["challenges"] if c["id"] == ("SQL-001" if kind == "sql" else "PY-001"))
    path = tmp_path / "ownership.db"
    db.init_db(path)
    aid = db.save_attempt(path, {"challenge_id": challenge["id"]})
    state = {"active_attempt": aid, "active_challenge": challenge["id"], "navigate": "Practice"}
    if kind == "sql":
        from src.sql_workspace import SQLWorkspace
        exercise = challenge["sql_playground"]
        create = lambda e: SQLWorkspace(state, path, aid, e, start_job=lambda *args: None)
        changed = deepcopy(exercise)
        changed["tables"][0]["description"] += " revised"
    else:
        from src.python_workspace import PythonWorkspace
        exercise = challenge["python_playground"]
        create = lambda e: PythonWorkspace(state, path, aid, e)
        changed = {**exercise, "contract": exercise["contract"] + " revised"}
    editor = create(exercise)
    nav = PracticeNavigation(state, path, b["challenges"], lambda: None)
    import importlib
    component = importlib.import_module("src." + kind + "_component")
    mounted = {}
    def mount(**kwargs):
        mounted.update(kwargs)
        return SimpleNamespace(event=None)
    monkeypatch.setattr(component, "_component", lambda: mount)
    monkeypatch.setattr(component.st, "session_state", state)
    if kind == "sql":
        from src.sql_models import new_workspace
        key = f"sql_{aid}_{editor.exercise_hash}"
        component.sql_editor(aid, exercise, editor.exercise_hash, new_workspace(exercise), False,
                             exercise["tasks"][0]["id"], on_pending_change=editor.mark_pending)
    else:
        key = f"python_{aid}"
        component.python_editor(aid, editor.exercise_hash, "", "", False, False, None, on_pending_change=editor.mark_pending)
    state[key] = SimpleNamespace(pending=True)
    mounted["on_pending_change"]()
    assert not nav.go("page", "Progress")
    # Earlier-version drafts remain recoverable without trapping the new editor.
    state[kind + "_pending_drafts"] = {editor.owner: {"id": "earlier"}}
    current = create(changed)
    mounted["on_pending_change"]()
    assert not state.get(kind + "_dirty")
    assert nav.go("page", "Progress")
    assert editor.owner in state[kind + "_pending_drafts"]


def test_bundled_upgrade_preserves_customized_sql_and_its_rubric():
    from src.bank_manager import sync_bundled_sql
    bundled = bank()
    active = deepcopy(bundled)
    question = next(c for c in active["challenges"] if c["id"] == "SQL-001")
    question["title"] = "My revised SQL exercise"
    question["student"]["scenario"] = "My own domain and assumptions"
    active["rubrics"][question["rubric_ref"]] = {"custom_correctness": 100}
    upgraded = sync_bundled_sql(active, bundled)
    assert next(c for c in upgraded["challenges"] if c["id"] == question["id"]) == question
    assert upgraded["rubrics"][question["rubric_ref"]] == {"custom_correctness": 100}
    assert question["id"] in upgraded["bank"]["bundled_upgrade_conflicts"]


def test_saved_stage_evaluation_keeps_original_rubric_when_bank_changes(tmp_path, monkeypatch):
    from streamlit.testing.v1 import AppTest
    from capstone_examples import model, recipe, save_model
    from src import config, capstone_store as store
    path = tmp_path / "project.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    save_model(path, run, "business", model("conceptual_erd", recipe()))
    original = b["rubrics"][run["challenges"]["business"]["rubric_ref"]]
    c = next(c for c in b["challenges"] if c["id"] == "SCN-001")
    replacement = {**b, "challenges": [c], "capstones": [], "rubrics": {c["rubric_ref"]: b["rubrics"][c["rubric_ref"]]}}
    bank_path = tmp_path / "bank.json"
    bank_path.write_text(json.dumps(replacement), encoding="utf-8")
    for name in ("CHALLENGES_PATH", "SOURCE_PATH", "BUNDLED_CHALLENGES_PATH"):
        monkeypatch.setattr(config, name, bank_path)
    for name in ("VALIDATION_REPORT_PATH", "IMPORTS_DIR", "VERSIONS_DIR"):
        monkeypatch.setattr(config, name, tmp_path / name.lower())
    monkeypatch.setattr(config, "DB_PATH", path)
    page = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=25)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "business"
    page.run()
    assert not page.exception
    next(w for w in page.checkbox if w.label == "Enter a score for each rubric category").check().run()
    assert not page.exception
    labels = {w.label for w in page.number_input}
    assert {k.replace("_", " ").title() for k in original} <= labels


@pytest.mark.parametrize("reserved", ["scratch", "notebook_1", "notebook_12"])
def test_import_rejects_task_names_that_collide_with_editor_tabs(reserved):
    from src.json_validator import validate_bank
    from src.authoring import example_package
    incoming = example_package(bank(), "Data-quality Detective")
    exercise = incoming["challenges"][0]["sql_playground"]
    task = exercise["tasks"][0]
    reference = exercise["assessment"]["reference_queries"][task["id"]]
    task["id"] = reserved
    exercise["tasks"] = [task]
    exercise["assessment"]["reference_queries"] = {reserved: reference}
    exercise["assessment"]["invariants"] = []
    with pytest.raises(ValueError, match="reserved"):
        validate_bank(incoming)


def test_saved_project_ai_response_stays_current_across_rerenders(tmp_path, monkeypatch):
    from streamlit.testing.v1 import AppTest
    from capstone_examples import model, recipe, save_model
    from src import config, capstone_store as store
    from src.ai import AIConnection, AIRequest, AIResponse, AISession
    path = tmp_path / "ai.db"
    db.init_db(path)
    b = bank()
    run = store.create_run(path, b["capstones"][0], b)
    aid = save_model(path, run, "business", model("conceptual_erd", recipe()))
    monkeypatch.setattr(config, "DB_PATH", path)
    page = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=25)
    page.query_params["project"] = run["run_id"]
    page.query_params["stage"] = "business"
    page.run()
    assert not page.exception
    session = AISession()
    session.configure(AIConnection("Chat Completions", "https://example.com/v1", "simulated"))
    page.session_state["optional_ai"] = session
    scope = "ai_evaluation_" + str(aid)
    version = page.session_state["ai_prompt_editors"][scope]["revision"]
    session.request = AIRequest("evaluation", "Reviewed project prompt", "attempt:" + str(aid), version)
    scores = {k: v / 2 for k, v in run["rubric"].items()}
    session.response = AIResponse(json.dumps({"rubric_scores": scores, "total_score": sum(scores.values()),
        "weak_topics": [], "mistake_categories": [], "feedback": "Current stage feedback"}), "simulated", {}, "stop")
    session.state = "completed"
    try:
        for _ in range(2):
            page.run()
            assert not page.exception and session.state == "completed"
            assert any(w.label == "Apply suggestion to editable form" for w in page.button)
        next(w for w in page.button if w.label == "Apply suggestion to editable form").click().run()
        assert not page.exception
        assert next(w for w in page.text_area if w.label == "Evaluator feedback").value == "Current stage feedback"
        assert db.get_attempt(path, aid)["score"] is None
    finally:
        session.close()


def test_older_bank_topic_tags_remain_selectable_without_topic_index(tmp_path, monkeypatch):
    from streamlit.testing.v1 import AppTest
    from src import config
    b = bank()
    c = next(c for c in b["challenges"] if c["id"] == "SCN-001")
    c["internal"]["topics"] = ["legacy_topic_without_index"]
    b["challenges"], b["capstones"], b["bank"]["topic_index"] = [c], [], {}
    bank_path = tmp_path / "bank.json"
    bank_path.write_text(json.dumps(b), encoding="utf-8")
    for name in ("CHALLENGES_PATH", "SOURCE_PATH", "BUNDLED_CHALLENGES_PATH"):
        monkeypatch.setattr(config, name, bank_path)
    for name in ("VALIDATION_REPORT_PATH", "IMPORTS_DIR", "VERSIONS_DIR"):
        monkeypatch.setattr(config, name, tmp_path / name.lower())
    path = tmp_path / "topics.db"
    monkeypatch.setattr(config, "DB_PATH", path)
    db.init_db(path)
    aid = db.save_attempt(path, {"challenge_id": c["id"], "status": "Completed", "answer": "Saved answer"})
    page = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=25)
    page.session_state["active_attempt"] = aid
    page.session_state["active_challenge"] = c["id"]
    page.run()
    assert not page.exception
    assert "legacy_topic_without_index" in next(w for w in page.multiselect if w.label == "Weak topics").options


def test_stage_rubric_snapshots_round_trip_and_legacy_runs_remain_readable(tmp_path):
    from src import capstone_store as store
    from src.capstone_models import validate_run
    path, target = tmp_path / "source.db", tmp_path / "target.db"
    db.init_db(path)
    db.init_db(target)
    b = bank()
    query = next(c for c in b["challenges"] if c.get("dataset_sql"))
    query["rubric_ref"] = "separate_query_rubric"
    b["rubrics"][query["rubric_ref"]] = {"query_correctness": 60, "verification": 40}
    run = store.create_run(path, b["capstones"][0], b)
    b["rubrics"][query["rubric_ref"]]["query_correctness"] = 0
    assert store.stage_rubric(run, "queries") == {"query_correctness": 60, "verification": 40}
    assert db.merge_progress(target, db.export_progress(path))["runs_added"] == 1
    assert store.stage_rubric(store.get_run(target, run["run_id"]), "queries") == store.stage_rubric(run, "queries")
    legacy = deepcopy(run)
    legacy.pop("stage_rubrics")
    assert validate_run(legacy) == legacy
    assert store.stage_rubric(legacy, "business") == run["rubric"]
    with pytest.raises(ValueError, match="rubric is unavailable"):
        store.stage_rubric(legacy, "queries")
    invalid = deepcopy(run)
    invalid["stage_rubrics"]["queries"]["query_correctness"] = True
    with pytest.raises(ValueError, match="finite"):
        validate_run(invalid)
    # Readable backups must outlive stricter rules for authoring new tasks.
    from src.capstone_models import validate_definition
    older = deepcopy(legacy)
    older["challenges"]["queries"]["dataset_sql"]["tasks"][0]["id"] = "scratch"
    assert validate_run(older) == older
    with pytest.raises(ValueError, match="reserved"):
        validate_definition(older["definition"], list(older["challenges"].values()))
