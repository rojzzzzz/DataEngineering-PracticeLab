import json
from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

from src import config
from src.database import init_db, save_attempt


@pytest.fixture
def app_context(tmp_path, monkeypatch):
    database=tmp_path/"practice.db"
    monkeypatch.setattr(config,"DB_PATH",database)
    init_db(database)
    bank=json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))
    challenge=next(c for c in bank["challenges"] if c["id"].startswith("SCN-"))
    return database,challenge


def widget(widgets,label):
    return next(w for w in widgets if w.label==label)


@pytest.mark.parametrize("identity,label", [
    ("SQL-001", "Your solution"),
    ("PY-001", "Reasoning (optional)"),
    ("INC-001", "Additional notes (optional)"),
])
@pytest.mark.parametrize("save_fails", [False, True])
def test_lab_notes_flush_or_veto_navigation(app_context, monkeypatch, identity, label, save_fails):
    from src import database as db, sql_ui, python_ui, detective_ui
    # The native notes and navigation controls are real; execution is unrelated.
    monkeypatch.setattr(sql_ui, "render_workspace", lambda *args, **kwargs: None)
    monkeypatch.setattr(python_ui, "render_python", lambda *args, **kwargs: None)
    monkeypatch.setattr(detective_ui, "render_detective", lambda *args, **kwargs: None)
    path, _ = app_context
    aid = save_attempt(path, {"challenge_id": identity, "status": "In progress", "answer": "Saved notes"})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    save = db.save_attempt_details
    if save_fails:
        def fail(*args, **kwargs):
            raise OSError("disk full")
        monkeypatch.setattr(db, "save_attempt_details", fail)
    widget(app.text_area, label).set_value("Notes submitted with navigation")
    widget(app.radio, "Navigate").set_value("Progress").run()
    assert not app.exception
    if save_fails:
        assert app.session_state["navigate"] == "Practice"
        assert db.get_attempt(path, aid)["answer"] == "Saved notes"
        assert widget(app.text_area, label).value == "Notes submitted with navigation"
        monkeypatch.setattr(db, "save_attempt_details", save)
        widget(app.radio, "Navigate").set_value("Progress").run()
    assert app.session_state["navigate"] == "Progress"
    assert db.get_attempt(path, aid)["answer"] == "Notes submitted with navigation"


def test_total_only_evaluation_clears_previous_category_scores(app_context):
    from src.database import get_attempt
    path, challenge = app_context
    bank = json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))
    rubric = bank["rubrics"][challenge["rubric_ref"]]
    scores = {key: float(maximum) for key, maximum in rubric.items()}
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": "Evaluated",
        "answer": "Saved answer", "score": 100, "rubric_scores": scores, "evaluated_at": "2026-01-01"})
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    app = AppTest.from_file(source, default_timeout=20)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    widget(app.checkbox, "Enter a score for each rubric category").uncheck().run()
    widget(app.number_input, "Total score / 100").set_value(30.0).run()
    widget(app.button, "Save evaluation").click().run()
    assert not app.exception
    saved = get_attempt(path, aid)
    assert saved["score"] == 30 and saved["rubric_scores"] == {}
    reopened = AppTest.from_file(source, default_timeout=20)
    reopened.session_state["active_attempt"] = aid
    reopened.run()
    assert not reopened.exception
    assert not widget(reopened.checkbox, "Enter a score for each rubric category").value
    assert widget(reopened.number_input, "Total score / 100").value == 30


@pytest.mark.parametrize("stale_widget", [False, True])
def test_restored_scores_above_current_rubric_remain_recoverable(app_context, stale_widget):
    from src.database import get_attempt, merge_progress
    path, challenge = app_context
    bank = json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))
    rubric = bank["rubrics"][challenge["rubric_ref"]]
    category = next(iter(rubric))
    merge_progress(path, {"format": "data-engineering-practice-lab-progress", "version": 1,
        "attempts": [{"challenge_id": challenge["id"], "status": "Evaluated",
            "started_at": "2026-01-01", "updated_at": "2026-01-02",
            "evaluated_at": "2026-01-02", "answer": "Saved answer", "score": 100, "confidence": 3,
            "rubric_scores": {category: 100}, "evaluation_feedback": "Original feedback"}]})
    from src.database import list_attempts
    aid = list_attempts(path)[0]["attempt_id"]
    original = get_attempt(path, aid)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20)
    app.session_state["active_attempt"] = aid
    if stale_widget:
        app.session_state[f"rubric_{aid}_{category}"] = 100.0
    app.run()
    assert not app.exception
    assert any("current rubric" in item.value for item in app.warning)
    assert app.number_input(key=f"rubric_{aid}_{category}").value is None
    assert widget(app.button, "Save evaluation").disabled
    assert get_attempt(path, aid) == original
    for name, limit in rubric.items():
        app.number_input(key=f"rubric_{aid}_{name}").set_value(float(limit))
    app.run()
    assert not app.exception
    assert not widget(app.button, "Save evaluation").disabled
    widget(app.button, "Save evaluation").click().run()
    assert not app.exception
    saved = get_attempt(path, aid)
    assert saved["rubric_scores"] == rubric
    assert saved["evaluation_feedback"] == "Original feedback"


def test_reopen_same_day_attempts_outside_filters(app_context):
    database,challenge=app_context
    ids=[save_attempt(database,{
        "challenge_id":challenge["id"],"status":"Completed",
        "started_at":f"2026-01-01T0{i}:00:00+00:00",
        "updated_at":"2026-01-01T12:00:00+00:00","answer":f"Answer {i}",
        "weak_topics":["retired topic"],"mistake_categories":["retired category"],
    }) for i in (1,2)]
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.selectbox,"Challenge family").select("SQL").run()
    saved=widget(app.selectbox,"Saved attempts")
    assert len(saved.options)==2
    saved.select(next(label for label in saved.options if label.endswith(f"Attempt {ids[0]}")))
    widget(app.button,"Open saved attempt").click().run()
    assert not app.exception
    assert app.session_state["active_challenge"]==challenge["id"]
    assert widget(app.text_area,"Your solution").value=="Answer 1"
    assert widget(app.multiselect,"Weak topics").value==["retired topic"]


def test_progress_backup_is_lazy_fresh_and_bound_to_its_database(app_context, monkeypatch, tmp_path):
    import streamlit as st
    from src import database as database_module
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "answer": "First draft"})
    producers, reads = [], []
    download = st.download_button
    export = database_module.export_progress
    def capture(label, data, *args, **kwargs):
        if label == "Download progress backup":
            producers.append(data)
        return download(label, data, *args, **kwargs)
    def tracked_export(database):
        reads.append(database)
        return export(database)
    monkeypatch.setattr(st, "download_button", capture)
    monkeypatch.setattr(database_module, "export_progress", tracked_export)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"), default_timeout=20).run()
    widget(app.sidebar.radio, "Navigate").set_value("Progress").run()
    app.run()
    assert not app.exception and not reads
    producer = producers[-1]
    assert callable(producer)
    database_module.save_attempt_details(path, {**database_module.get_attempt(path, aid), "answer": "Latest saved draft"})
    other = tmp_path / "other.db"
    database_module.init_db(other)
    save_attempt(other, {"challenge_id": challenge["id"], "answer": "Another database"})
    monkeypatch.setattr(config, "DB_PATH", other)
    backup = json.loads(producer())  # Runs without Streamlit's ScriptRunContext.
    assert reads == [path]
    assert backup["attempts"][0]["answer"] == "Latest saved draft"
    assert backup["format"] == "data-engineering-practice-lab-progress"


def test_progress_backup_preserves_streamlit_151_compatibility(app_context, monkeypatch):
    import streamlit as st
    database, challenge = app_context
    save_attempt(database, {"challenge_id": challenge["id"], "answer": "Saved answer"})
    payloads = []
    download = st.download_button
    def capture(label, data, *args, **kwargs):
        if label == "Download progress backup":
            payloads.append(data)
        return download(label, data, *args, **kwargs)
    monkeypatch.setattr(st, "__version__", "1.51.0")
    monkeypatch.setattr(st, "download_button", capture)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"), default_timeout=20).run()
    widget(app.sidebar.radio, "Navigate").set_value("Progress").run()
    assert not app.exception
    assert json.loads(payloads[-1])["attempts"][0]["answer"] == "Saved answer"


def test_empty_filter_pool_clears_previous_preview(app_context):
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    assert app.session_state["active_challenge"]
    widget(app.selectbox,"Challenge family").select("SQL")
    # Scenario challenges and SQL challenges have distinct types in the bank.
    _,challenge=app_context
    widget(app.selectbox,"Challenge type").select(challenge["type"]).run()
    assert not app.exception
    assert app.session_state["active_challenge"] is None
    assert not any(button.label=="Start challenge" for button in app.button)


def test_unchanged_rerun_does_not_save_attempt(app_context, monkeypatch):
    import src.database as database_module
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'In progress',
        'started_at': '2026-01-01', 'updated_at': '2026-01-01', 'confidence': 3})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    assert not app.exception
    def unexpected_save(*args, **kwargs):
        pytest.fail('An unchanged rerun must not write an attempt')
    monkeypatch.setattr(database_module, 'save_attempt_details', unexpected_save)
    app.run()
    assert not app.exception


def test_untouched_tab_refreshes_without_overwriting_newer_writing(app_context):
    from src.database import get_attempt
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": "In progress",
        "answer": "Original answer", "confidence": 3, "started_at": "2026-01-01"})
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    first, second = [AppTest.from_file(source, default_timeout=20) for _ in range(2)]
    for app in (first, second):
        app.session_state["active_attempt"] = aid
        app.run()
        assert not app.exception
    widget(first.text_area, "Your solution").set_value("New answer from first tab").run()
    saved = get_attempt(path, aid)
    second.run()
    assert not second.exception
    assert get_attempt(path, aid) == saved
    assert widget(second.text_area, "Your solution").value == "New answer from first tab"


def test_viewing_legacy_attempt_preserves_timestamp_confidence_and_backup_freshness(app_context):
    from src.database import get_attempt, merge_progress
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": "Completed",
        "answer": "Old answer", "started_at": "2026-01-01", "updated_at": "2026-01-02"})
    original = get_attempt(path, aid)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    assert get_attempt(path, aid) == original
    widget(app.radio, "Navigate").set_value("Progress").run()
    assert not app.exception and get_attempt(path, aid) == original
    result = merge_progress(path, {"format": "data-engineering-practice-lab-progress", "version": 1,
        "attempts": [{"challenge_id": challenge["id"], "status": "Completed", "answer": "Newer answer",
            "started_at": "2026-01-01", "updated_at": "2026-01-03"}]})
    assert result["updated"] == 1 and get_attempt(path, aid)["answer"] == "Newer answer"


def test_filter_preferences_are_restored_in_a_fresh_session(app_context):
    from src.database import get_settings
    path, _ = app_context
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    app = AppTest.from_file(source, default_timeout=20).run()
    widget(app.number_input, "Maximum time (minutes)").set_value(400)
    widget(app.selectbox, "Difficulty").select(4)
    widget(app.checkbox, "Exclude completed").check().run()
    stored = get_settings(path)
    reopened = AppTest.from_file(source, default_timeout=20).run()
    assert not reopened.exception
    assert widget(reopened.number_input, "Maximum time (minutes)").value == 400
    assert widget(reopened.selectbox, "Difficulty").value == 4
    assert widget(reopened.checkbox, "Exclude completed").value
    assert get_settings(path) == stored


@pytest.mark.parametrize("keep_draft", [False, True])
def test_two_edited_tabs_preserve_both_versions_until_user_chooses(app_context, keep_draft):
    from src.database import get_attempt
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": "In progress",
        "answer": "Original answer", "confidence": 3, "started_at": "2026-01-01"})
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    first, second = [AppTest.from_file(source, default_timeout=20) for _ in range(2)]
    for app in (first, second):
        app.session_state["active_attempt"] = aid
        app.run()
    widget(first.text_area, "Your solution").set_value("First tab's new answer").run()
    widget(second.text_area, "Your solution").set_value("Second tab's pending answer").run()
    assert not second.exception
    assert get_attempt(path, aid)["answer"] == "First tab's new answer"
    assert widget(second.text_area, "Your solution").value == "Second tab's pending answer"
    assert any("another tab" in warning.value for warning in second.warning)
    widget(second.radio, "Navigate").set_value("Progress").run()
    assert not second.exception and second.session_state["navigate"] == "Practice"
    widget(second.button, "Save my draft instead" if keep_draft else "Use saved answer").click().run()
    assert not second.exception
    expected = "Second tab's pending answer" if keep_draft else "First tab's new answer"
    assert get_attempt(path, aid)["answer"] == expected
    assert widget(second.text_area, "Your solution").value == expected
    assert not any("another tab" in warning.value for warning in second.warning)


@pytest.mark.parametrize("status,action,target", [
    ("In progress", "Move to Not started", "Not started"),
    ("Completed", "Continue writing", "In progress"),
])
def test_stale_tab_status_actions_preserve_newer_answer(app_context, status, action, target):
    from src.database import get_attempt
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": status,
        "answer": "Original", "started_at": "2026-01-01", "confidence": 3})
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    first, second = [AppTest.from_file(source, default_timeout=20) for _ in range(2)]
    for app in (first, second):
        app.session_state["active_attempt"] = aid
        app.run()
    widget(first.text_area, "Your solution").set_value("New saved answer").run()
    widget(second.button, action).click().run()
    assert not second.exception
    saved = get_attempt(path, aid)
    assert saved["answer"] == "New saved answer" and saved["status"] == target


def test_unrecorded_confidence_can_be_explicitly_recorded_and_cleared(app_context):
    from src.database import get_attempt
    path, challenge = app_context
    aid = save_attempt(path, {"challenge_id": challenge["id"], "status": "In progress", "started_at": "2026-01-01"})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20)
    app.session_state["active_attempt"] = aid
    app.run()
    assert not app.exception
    assert get_attempt(path, aid)["confidence"] is None
    widget(app.select_slider, "Confidence").set_value(3).run()
    assert not app.exception and get_attempt(path, aid)["confidence"] == 3
    # AppTest uses None as "unchanged" for select sliders; choose its displayed label.
    widget(app.select_slider, "Confidence").set_value("Not recorded").run()
    assert not app.exception and get_attempt(path, aid)["confidence"] is None


def test_restored_legacy_preferences_apply_before_widgets_without_rewriting(app_context):
    from src.database import get_settings, merge_progress
    path, _ = app_context
    source = str(Path(__file__).resolve().parents[1] / "app.py")
    app = AppTest.from_file(source, default_timeout=20).run()
    widget(app.number_input, "Maximum time (minutes)").set_value(400).run()
    merge_progress(path, {"format": "data-engineering-practice-lab-progress", "version": 1,
        "attempts": [], "settings": {"maximum_session_time": 200, "exclude_completed": True}})
    stored = get_settings(path)
    app.session_state["restored_filter_settings"] = stored
    app.run()
    assert not app.exception
    assert widget(app.number_input, "Maximum time (minutes)").value == 200
    assert widget(app.checkbox, "Exclude completed").value
    assert get_settings(path) == stored
    reopened = AppTest.from_file(source, default_timeout=20).run()
    assert not reopened.exception and widget(reopened.number_input, "Maximum time (minutes)").value == 200


def test_invalid_saved_filter_values_do_not_crash_or_rewrite_settings(app_context):
    from src.database import get_settings, save_settings
    path, _ = app_context
    invalid = {"maximum_session_time": 1200, "filter_difficulty": [], "filter_family": "Retired",
        "last_learning_path": "Missing path", "exclude_completed": "yes", "filter_attempted": 0}
    save_settings(path, invalid)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py"), default_timeout=20).run()
    assert not app.exception
    assert widget(app.number_input, "Maximum time (minutes)").value == 180
    assert widget(app.selectbox, "Difficulty").value == "Any"
    assert widget(app.selectbox, "Challenge family").value == "All families"
    assert widget(app.selectbox, "Learning path").value == "All paths"
    assert get_settings(path) == invalid


def test_database_setup_is_reused_but_recreated_database_is_initialized(app_context, monkeypatch):
    import src.database as database_module
    database, _ = app_context
    initialize = database_module.init_db
    calls = []
    def tracked_initialize(path):
        calls.append(path)
        initialize(path)
    monkeypatch.setattr(database_module, "init_db", tracked_initialize)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20).run()
    app.run()
    assert not app.exception
    assert calls == [database]
    # Replacing a database at the same path must not reuse its previous setup.
    database.rename(database.with_suffix(".old.db"))
    app.run()
    assert not app.exception
    assert calls == [database, database]
    assert database.exists()


def test_status_change_hides_evaluation_immediately(app_context):
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'Completed',
        'started_at': '2026-01-01', 'updated_at': '2026-01-01'})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    assert not app.exception
    widget(app.button, 'Continue writing').click().run()
    assert not app.exception
    assert not any(button.label == 'Save evaluation' for button in app.button)


def test_written_hints_survive_fresh_session(app_context):
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'In progress',
        'hints_used': list(range(1, len(challenge['hints']) + 1)),
        'complications_used': [1]})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    assert not app.exception
    visible = '\n'.join(item.value for item in app.info)
    assert all(hint in visible for hint in challenge['hints'])
    assert challenge['follow_up_complications'][0] in visible
    assert not any(button.label.startswith('Reveal Hint') for button in app.button)


def test_written_outline_preserves_draft_and_saves(app_context):
    from src.database import get_attempt
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'In progress'})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    widget(app.button, 'Insert outline into empty answer').click().run()
    assert not app.exception
    expected = '\n\n'.join(f'## {heading}\n' for heading in challenge['student']['deliverables'])
    assert get_attempt(database, aid)['answer'] == expected
    widget(app.text_area, 'Your solution').set_value('My own answer').run()
    assert get_attempt(database, aid)['answer'] == 'My own answer'
    assert widget(app.button, 'Insert outline into empty answer').disabled


def test_written_evaluation_requires_explicit_score_and_keeps_zero(app_context):
    from src.database import get_attempt
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'Completed'})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    assert not any(item.label == 'Attempt status' for item in app.selectbox)
    assert widget(app.button, 'Save evaluation').disabled
    widget(app.number_input, 'Total score / 100').set_value(0.0).run()
    widget(app.button, 'Save evaluation').click().run()
    assert not app.exception
    saved = get_attempt(database, aid)
    assert saved['status'] == 'Evaluated' and saved['score'] == 0
    assert not any(button.label == 'Mark Complete' for button in app.button)


def test_daily_scenario_does_not_fall_back_to_sql(app_context):
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20).run()
    widget(app.selectbox, 'Challenge family').select('SQL').run()
    assert not app.exception
    assert app.session_state['active_challenge'] is None
    assert any('Daily Scenario' in item.value for item in app.warning)


def test_category_evaluation_waits_for_all_scores(app_context):
    database, challenge = app_context
    aid = save_attempt(database, {'challenge_id': challenge['id'], 'status': 'Completed'})
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    widget(app.checkbox, 'Enter a score for each rubric category').check().run()
    assert widget(app.button, 'Save evaluation').disabled
    rubric_inputs = [item for item in app.number_input if item.label != 'Maximum time (minutes)']
    assert len(rubric_inputs) > 1
    rubric_inputs[0].set_value(0.0).run()
    assert widget(app.button, 'Save evaluation').disabled
    for item in app.number_input:
        if item.label != 'Maximum time (minutes)': item.set_value(0.0)
    app.run()
    assert not app.exception
    assert not widget(app.button, 'Save evaluation').disabled


def test_sql_route_preview_start_and_filter(app_context):
    from src.database import list_attempts
    database, _ = app_context
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20).run()
    widget(app.button, 'Open SQL practice').click().run()
    assert not app.exception
    assert len(widget(app.selectbox, 'SQL exercise').options) == 9
    assert list_attempts(database) == []
    widget(app.button, 'Start challenge').click().run()
    assert not app.exception
    assert list_attempts(database)[0]['challenge_id'] == 'SQL-001'
    widget(app.button, 'Open SQL practice').click().run()
    widget(app.selectbox, 'Difficulty').select(5).run()
    assert len(widget(app.selectbox, 'SQL exercise').options) == 3
    assert not app.exception


def test_sql_current_draft_event_is_saved_and_run(app_context, monkeypatch):
    from src.database import get_attempt
    import src.sql_ui as sql_ui
    from src.sql_models import fingerprint, new_workspace
    import json
    database, _ = app_context
    bank = json.loads(config.CHALLENGES_PATH.read_text(encoding='utf-8'))
    exercise = next(c['sql_playground'] for c in bank['challenges'] if c['id']=='SQL-001')
    aid = save_attempt(database, {'challenge_id':'SQL-001','status':'In progress'})
    workspace = new_workspace(exercise)
    workspace['drafts']['ranking'] = 'SELECT 123'
    event = {'id':'event-1','attemptId':aid,'exerciseHash':fingerprint(exercise),'action':'run','active':'ranking','drafts':workspace['drafts'],'selection':''}
    monkeypatch.setattr(sql_ui, 'sql_editor', lambda *args, **kwargs: event)
    captured = []
    class Job:
        result = None
        def __init__(self, *args, **kwargs): captured.append(kwargs)
        def cancel(self): pass
    monkeypatch.setattr(sql_ui, 'SQLJob', Job)
    app = AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'), default_timeout=20)
    app.session_state['active_attempt'] = aid
    app.run()
    assert not app.exception
    assert captured[0]['sql'] == 'SELECT 123'
    assert get_attempt(database,aid)['sql_workspace']['drafts']['ranking'] == 'SELECT 123'
    app.run()
    assert len(captured) == 1

def test_another_preserves_unblurred_written_draft(app_context):
    from src.database import get_attempt, list_attempts
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","started_at":"2026-01-01","updated_at":"2026-01-01"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=aid
    app.run()
    widget(app.text_area,"Your solution").set_value("Draft committed by navigation")
    widget(app.button,"Give me another").click().run()
    assert not app.exception
    assert app.session_state["active_challenge"] != challenge["id"]
    assert get_attempt(database,aid)["answer"]=="Draft committed by navigation"
    assert len(list_attempts(database))==1
    assert any(button.label=="Start challenge" for button in app.button)


def test_continue_saved_writing_and_reset_filters(app_context):
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","answer":"Saved writing","started_at":"2026-01-01","updated_at":"2026-01-01"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.selectbox,"Challenge family").select("SQL").run()
    assert any("0 matching challenges" in caption.value for caption in app.caption)
    assert widget(app.button,"Give me another").disabled
    widget(app.button,"Continue written answer").click().run()
    assert not app.exception
    assert app.session_state["active_attempt"]==aid
    assert widget(app.text_area,"Your solution").value=="Saved writing"
    assert any("outside the current session filters" in caption.value for caption in app.caption)
    widget(app.button,"Reset filters").click().run()
    assert not app.exception
    assert widget(app.selectbox,"Challenge family").value=="All families"
    assert widget(app.checkbox,"Include attempted").value

def test_another_is_disabled_for_single_candidate(app_context,monkeypatch):
    import src.selector as selector
    _,challenge=app_context
    monkeypatch.setattr(selector,"eligible_challenges",lambda challenges,**filters:[challenge])
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    assert not app.exception
    assert any("1 matching challenge · Daily Scenario" in caption.value for caption in app.caption)
    assert widget(app.button,"Give me another").disabled
    assert any("Only one challenge matches" in caption.value for caption in app.caption)

def test_continue_chooses_latest_pending_written_and_flushes_draft(app_context):
    from src.database import get_attempt
    database,challenge=app_context
    bank=json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))["challenges"]
    second=next(c for c in bank if c["id"].startswith("SCN-") and c["id"]!=challenge["id"])
    lab=next(c for c in bank if c.get("sql_playground"))
    def saved(c,status,updated):
        return save_attempt(database,{"challenge_id":c["id"],"status":status,"started_at":"2026-01-01","updated_at":updated,"activity_at":updated})
    old=saved(challenge,"In progress","2026-01-01")
    latest=saved(second,"Not started","2026-01-02")
    saved(lab,"In progress","2025-12-31")
    saved(second,"Completed","2026-01-03")
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=old
    app.run()
    widget(app.text_area,"Your solution").set_value("Outgoing unfinished draft")
    widget(app.button,"Continue written answer").click().run()
    assert not app.exception
    assert app.session_state["active_attempt"]==latest
    assert get_attempt(database,old)["answer"]=="Outgoing unfinished draft"

def test_remounted_written_answer_restores_saved_draft_over_stale_widget(app_context):
    from src.database import get_attempt
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","started_at":"2026-01-01","updated_at":"2026-01-01","answer":"Saved initial draft"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=aid
    app.run()
    widget(app.text_area,"Your solution").set_value("Draft before switching")
    widget(app.button,"Give me another").click().run()
    assert get_attempt(database,aid)["answer"]=="Draft before switching"

    # Model browser widget state retained empty after the textarea was unmounted.
    app.session_state[f"answer_{aid}"]=""
    widget(app.button,"Continue written answer").click().run()
    assert not app.exception
    assert widget(app.text_area,"Your solution").value=="Draft before switching"
    app.run()
    assert widget(app.text_area,"Your solution").value=="Draft before switching"
    assert get_attempt(database,aid)["answer"]=="Draft before switching"


def catalog_app():
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.radio,"Navigate").set_value("Challenge Bank").run()
    return app


@pytest.mark.parametrize("destination", ["Practice", "Progress", "Constructor Mode"])
def test_catalog_retains_controls_after_navigation(app_context, destination):
    app=catalog_app()
    widget(app.text_input,"Search exercises").set_value("a").run()
    widget(app.number_input,"Catalog page").set_value(2).run()
    choices=widget(app.selectbox,"Exercise to practice")
    choices.select(choices.options[-1].rsplit(" · ",1)[-1]).run()
    selected=app.session_state["catalog_choice"]
    widget(app.radio,"Navigate").set_value(destination).run()
    widget(app.radio,"Navigate").set_value("Challenge Bank").run()
    assert not app.exception
    assert widget(app.text_input,"Search exercises").value=="a"
    assert widget(app.number_input,"Catalog page").value==2
    assert app.session_state["catalog_choice"]==selected
    widget(app.button,"Reset catalog filters").click().run()
    assert widget(app.text_input,"Search exercises").value==""
    assert widget(app.number_input,"Catalog page").value==1


def test_catalog_clamps_results_and_removed_filter(app_context, monkeypatch):
    import src.selector as selector
    app=catalog_app()
    widget(app.number_input,"Catalog page").set_value(3).run()
    _,challenge=app_context
    monkeypatch.setattr(selector,"eligible_challenges",lambda challenges,**filters:[challenge])
    widget(app.radio,"Navigate").set_value("Constructor Mode").run()
    app.session_state["filter_family"]="Removed family"
    widget(app.radio,"Navigate").set_value("Challenge Bank").run()
    app.run()
    assert not app.exception
    assert widget(app.number_input,"Catalog page").value==1
    assert app.session_state["catalog_choice"]==challenge["id"]
    assert widget(app.selectbox,"Challenge family").value=="All families"
    monkeypatch.setattr(selector,"eligible_challenges",lambda challenges,**filters:[])
    app.run()
    assert not app.exception
    assert app.session_state["catalog_page"]==1
    assert "catalog_choice" not in app.session_state


def test_answer_failure_is_not_reported_saved_and_can_retry(app_context, monkeypatch):
    import src.database as database_module
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","confidence":3,"answer":"Persisted"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=aid
    app.run()
    real_save=database_module.save_attempt_details
    def failed_save(*args, **kwargs):
        raise OSError("Disk unavailable")
    monkeypatch.setattr(database_module,"save_attempt_details",failed_save)
    widget(app.text_area,"Your solution").set_value("Pending response").run()
    assert not app.exception
    assert any("Save failed" in c.value for c in app.caption)
    assert not any(c.value.startswith("Saved") for c in app.caption)
    assert database_module.get_attempt(database,aid)["answer"]=="Persisted"
    monkeypatch.setattr(database_module,"save_attempt_details",real_save)
    widget(app.button,"Retry saving answer").click().run()
    assert not app.exception
    assert database_module.get_attempt(database,aid)["answer"]=="Pending response"
    assert any(c.value.startswith("Saved") for c in app.caption)


def test_failed_navigation_keeps_answer_until_persistence_recovers(app_context, monkeypatch):
    import src.database as database_module
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","confidence":3,"answer":"Original"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=aid
    app.run()
    real_save=database_module.save_attempt_details
    def failed_save(*args, **kwargs):
        raise OSError("Disk unavailable")
    monkeypatch.setattr(database_module,"save_attempt_details",failed_save)
    # Refresh callback globals before simulating a disk failure during navigation.
    app.run()
    widget(app.text_area,"Your solution").set_value("Latest draft on navigation")
    widget(app.radio,"Navigate").set_value("Challenge Bank").run()
    assert not app.exception
    assert app.session_state["navigate"]=="Practice"
    assert widget(app.text_area,"Your solution").value=="Latest draft on navigation"
    assert database_module.get_attempt(database,aid)["answer"]=="Original"
    monkeypatch.setattr(database_module,"save_attempt_details",real_save)
    widget(app.button,"Retry saving answer").click().run()
    fresh=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    fresh.session_state["active_attempt"]=aid
    fresh.run()
    assert not fresh.exception
    assert widget(fresh.text_area,"Your solution").value=="Latest draft on navigation"


def test_catalog_search_status_sidebar_filters_and_pagination(app_context,tmp_path,monkeypatch):
    database,challenge=app_context
    bank=json.loads(config.CHALLENGES_PATH.read_text(encoding="utf-8"))
    selected=next(c for c in bank["challenges"] if c["id"]==challenge["id"])
    selected["student"]["scenario"]="Public catalog scenario token"
    selected["internal"]["topics"]=["privatecatalogtoken"]
    bank_path=tmp_path/"bank.json"
    bank_path.write_text(json.dumps(bank),encoding="utf-8")
    monkeypatch.setattr(config,"CHALLENGES_PATH",bank_path)
    monkeypatch.setattr(config,"BUNDLED_CHALLENGES_PATH",bank_path)
    save_attempt(database,{"challenge_id":challenge["id"],"status":"Completed"})
    app=catalog_app()
    assert not app.exception
    assert len(widget(app.selectbox,"Exercise to practice").options)==25
    widget(app.number_input,"Catalog page").set_value(3).run()
    assert len(widget(app.selectbox,"Exercise to practice").options)<=25
    widget(app.text_input,"Search exercises").set_value("Public catalog scenario token").run()
    assert len(widget(app.selectbox,"Exercise to practice").options)==1
    assert widget(app.number_input,"Catalog page").value==1
    widget(app.selectbox,"Attempt status").select("Unattempted").run()
    assert not any(b.label=="Practice selected exercise" for b in app.button)
    widget(app.selectbox,"Attempt status").select("Completed").run()
    assert len(widget(app.selectbox,"Exercise to practice").options)==1
    widget(app.text_input,"Search exercises").set_value("privatecatalogtoken").run()
    assert not any(b.label=="Practice selected exercise" for b in app.button)
    widget(app.text_input,"Search exercises").set_value("")
    widget(app.selectbox,"Attempt status").select("All statuses")
    widget(app.selectbox,"Challenge family").select("SQL").run()
    assert all("SQL-" in label for label in widget(app.selectbox,"Exercise to practice").options)
    assert not app.exception


@pytest.mark.parametrize("cid,mode,chooser",[("SQL-009","SQL Practice","SQL exercise"),("PY-002","Python Practice","Python exercise"),("INC-003","Data-quality Detective","Investigation")])
def test_catalog_lab_preview_selects_exact_exercise_without_attempt(app_context,cid,mode,chooser,monkeypatch):
    import src.sql_ui as sql_ui
    import src.python_ui as python_ui
    monkeypatch.setattr(sql_ui,"sql_editor",lambda *args, **kwargs:None)
    monkeypatch.setattr(python_ui,"python_editor",lambda *args, **kwargs:None)
    from src.database import list_attempts
    database,_=app_context
    app=catalog_app()
    widget(app.text_input,"Search exercises").set_value(cid).run()
    widget(app.button,"Practice selected exercise").click().run()
    assert not app.exception
    assert app.session_state["navigate"]=="Practice"
    assert app.session_state["mode"]==mode
    assert app.session_state["active_challenge"]==cid
    assert cid in widget(app.selectbox,chooser).value
    assert list_attempts(database)==[]
    app.run()
    assert app.session_state["active_challenge"]==cid
    widget(app.button,"Start challenge").click().run()
    assert not app.exception
    assert [a["challenge_id"] for a in list_attempts(database)]==[cid]
    assert "direct_preview" not in app.session_state


def test_direct_preview_outside_filters_and_leaving_route(app_context):
    from src.database import list_attempts
    database,challenge=app_context
    app=catalog_app()
    widget(app.text_input,"Search exercises").set_value(challenge["id"]).run()
    # A direct selection must win even if current practice filters conflict.
    app.session_state["filter_family"]="SQL"
    widget(app.button,"Practice selected exercise").click().run()
    assert not app.exception
    assert app.session_state["active_challenge"]==challenge["id"]
    assert any("selected exercise outside" in c.value for c in app.caption)
    assert widget(app.selectbox,"Challenge family").value=="SQL"
    app.run()
    assert app.session_state["active_challenge"]==challenge["id"]
    widget(app.button,"Open SQL practice").click().run()
    assert app.session_state["active_challenge"].startswith("SQL-")
    assert "direct_preview" not in app.session_state
    assert list_attempts(database)==[]


def test_direct_preview_another_and_filter_change_clear_pin(app_context):
    _,challenge=app_context
    app=catalog_app()
    widget(app.text_input,"Search exercises").set_value(challenge["id"]).run()
    widget(app.button,"Practice selected exercise").click().run()
    widget(app.button,"Give me another").click().run()
    assert not app.exception
    assert app.session_state["active_challenge"]!=challenge["id"]
    assert "direct_preview" not in app.session_state
    widget(app.radio,"Navigate").set_value("Challenge Bank").run()
    widget(app.text_input,"Search exercises").set_value(challenge["id"]).run()
    widget(app.button,"Practice selected exercise").click().run()
    widget(app.selectbox,"Challenge family").select("SQL").run()
    assert not app.exception
    assert app.session_state["active_challenge"] is None
    assert "direct_preview" not in app.session_state


def test_progress_opens_exact_attempt_and_preserves_outgoing_draft(app_context):
    from src.database import get_attempt,list_attempts
    database,challenge=app_context
    ids=[save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","started_at":"2026-01-01","updated_at":"2026-01-01","answer":f"Same day draft {i}"}) for i in range(2)]
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=ids[1]
    app.run()
    widget(app.text_area,"Your solution").set_value("Draft saved with page navigation")
    widget(app.radio,"Navigate").set_value("Progress").run()
    assert get_attempt(database,ids[1])["answer"]=="Draft saved with page navigation"
    widget(app.selectbox,"Challenge family").select("SQL").run()
    history=widget(app.selectbox,"Practice history")
    assert all(challenge["title"] in label for label in history.options)
    history.set_value(ids[0])
    widget(app.button,"Open attempt").click().run()
    assert not app.exception
    assert app.session_state["active_attempt"]==ids[0]
    assert app.session_state["mode"]=="Daily Scenario"
    assert widget(app.text_area,"Your solution").value=="Same day draft 0"
    assert len(list_attempts(database))==2
    assert any("saved attempt outside" in c.value for c in app.caption)


def test_progress_missing_challenge_is_unavailable(app_context):
    database,_=app_context
    save_attempt(database,{"challenge_id":"REMOVED-001","status":"Completed"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.radio,"Navigate").set_value("Progress").run()
    assert not app.exception
    assert widget(app.button,"Open attempt").disabled
    assert any("challenge is unavailable" in c.value for c in app.caption)


def test_progress_recommendation_opens_preview_without_new_attempt(app_context):
    from src.database import list_attempts
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"Evaluated","score":50,"weak_topics":challenge["internal"]["topics"][:1]})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.radio,"Navigate").set_value("Progress").run()
    recommendation=next(item.value for item in app.info if item.value.startswith("Recommended next challenge:"))
    cid=recommendation.split(": ")[1].split(" · ")[0]
    widget(app.button,"Practice recommended challenge").click().run()
    assert not app.exception
    assert app.session_state["active_challenge"]==cid
    assert app.session_state["navigate"]=="Practice"
    assert any(b.label=="Start challenge" for b in app.button)
    assert [a["attempt_id"] for a in list_attempts(database)]==[aid]


def test_mode_switch_preserves_unblurred_written_draft(app_context):
    from src.database import get_attempt
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=aid
    app.run()
    widget(app.text_area,"Your solution").set_value("Draft saved with mode switch")
    widget(app.button,"Open SQL practice").click().run()
    assert not app.exception
    assert get_attempt(database,aid)["answer"]=="Draft saved with mode switch"


def test_resume_lab_opens_existing_attempt_outside_filters_and_saves_writing(app_context,monkeypatch):
    from src.database import get_attempt, list_attempts
    import src.sql_ui as sql_ui
    monkeypatch.setattr(sql_ui,"sql_editor",lambda *args, **kwargs:None)
    database,challenge=app_context
    writing=save_attempt(database,{"challenge_id":challenge["id"],"status":"In progress","updated_at":"2026-01-01"})
    lab=save_attempt(database,{"challenge_id":"SQL-001","status":"In progress","updated_at":"2026-01-02","activity_at":"2026-01-02"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20)
    app.session_state["active_attempt"]=writing
    app.session_state["filter_family"]="SCN"
    app.run()
    widget(app.text_area,"Your solution").set_value("Keep this draft when resuming SQL")
    widget(app.button,"Continue SQL lab").click().run()
    assert not app.exception
    assert app.session_state["active_attempt"]==lab
    assert app.session_state["mode"]=="SQL Practice"
    assert get_attempt(database,writing)["answer"]=="Keep this draft when resuming SQL"
    assert len(list_attempts(database))==2


def test_visible_filter_reset_keeps_route_and_attempt_history(app_context):
    from src.database import list_attempts
    database,challenge=app_context
    aid=save_attempt(database,{"challenge_id":challenge["id"],"status":"Completed"})
    app=AppTest.from_file(str(Path(__file__).resolve().parents[1]/"app.py"),default_timeout=20).run()
    widget(app.button,"Open SQL practice").click().run()
    widget(app.selectbox,"Challenge family").select("SCN").run()
    assert any("0 matching challenges" in c.value for c in app.caption)
    widget(app.button,"Clear filters").click().run()
    assert not app.exception
    assert app.session_state["mode"]=="SQL Practice"
    assert len(widget(app.selectbox,"SQL exercise").options)==9
    assert [a["attempt_id"] for a in list_attempts(database)]==[aid]
