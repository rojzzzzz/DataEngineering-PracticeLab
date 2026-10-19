from src.database import export_progress, init_db, list_attempts, get_attempt, merge_progress, save_attempt
from src.statistics import overview
from src.diagrams import empty_diagram
from src.database import save_diagram
import sqlite3
import pytest

from src.database import connect, get_settings, save_attempt_details, save_settings

def test_create_save_update_reopen(tmp_path):
    path=tmp_path/"practice.db"; init_db(path)
    aid=save_attempt(path,{"challenge_id":"SQL-1","status":"In progress","updated_at":"2026-01-01","answer":"draft","hints_used":[1]})
    a=get_attempt(path,aid); assert a["answer"]=="draft" and a["hints_used"]==[1]
    save_attempt(path,{"attempt_id":aid,"challenge_id":"SQL-1","status":"Completed","updated_at":"2026-01-02","answer":"final","hints_used":[1,2]})
    assert get_attempt(path,aid)["status"]=="Completed"
    assert list_attempts(path,"SQL-1")[0]["answer"]=="final"

def test_move_out_of_progress_preserves_draft_and_removes_counter(tmp_path):
    path=tmp_path/"practice.db"; init_db(path)
    aid=save_attempt(path,{"challenge_id":"SQL-1","status":"In progress","updated_at":"2026-01-01","answer":"saved draft","score":82,"weak_topics":["joins"]})
    previous=get_attempt(path,aid)
    previous.update(status="Not started",updated_at="2026-01-02")
    save_attempt(path,previous)
    reopened=get_attempt(path,aid)
    assert reopened["status"]=="Not started"
    assert reopened["answer"]=="saved draft" and reopened["score"]==82
    assert overview(list_attempts(path))["in_progress"]==0
    assert reopened in list_attempts(path)

def test_backup_merge_is_repeatable_and_keeps_rubric_scores(tmp_path):
    source=tmp_path/"source.db"; target=tmp_path/"target.db"
    init_db(source); init_db(target)
    save_attempt(source,{"challenge_id":"DM-1","status":"Evaluated","started_at":"2026-01-01T10:00:00+00:00","updated_at":"2026-01-02T10:00:00+00:00","answer":"design","score":87,"rubric_scores":{"grain":20,"facts":67}})
    backup=export_progress(source)
    first=merge_progress(target,backup)
    second=merge_progress(target,backup)
    attempt=list_attempts(target)[0]
    assert first["added"]==1
    assert second["unchanged"]==1
    assert len(list_attempts(target))==1
    assert attempt["rubric_scores"]=={"grain":20,"facts":67}


def test_diagram_save_reopen_and_backup(tmp_path):
    source=tmp_path/"source.db"; target=tmp_path/"target.db"
    init_db(source); init_db(target)
    aid=save_attempt(source,{"challenge_id":"CM-001","status":"In progress","started_at":"2026-01-01","updated_at":"2026-01-01","answer":"text"})
    diagram=empty_diagram("conceptual_erd")
    save_diagram(source,aid,diagram)
    assert get_attempt(source,aid)["diagram"]==diagram
    save_attempt(source,{"attempt_id":aid,"challenge_id":"CM-001","status":"Completed","updated_at":"2026-01-02","answer":"final"})
    assert get_attempt(source,aid)["diagram"]==diagram
    merge_progress(target,export_progress(source))
    assert list_attempts(target)[0]["diagram"]==diagram


def test_legacy_database_and_backup(tmp_path):
    path=tmp_path/"old.db"
    with sqlite3.connect(path) as con:
        con.execute("CREATE TABLE attempts (attempt_id INTEGER PRIMARY KEY, challenge_id TEXT, status TEXT, started_at TEXT, updated_at TEXT, completed_at TEXT, evaluated_at TEXT, answer TEXT, score REAL, confidence INTEGER, minutes_taken REAL, hints_used TEXT, complications_used TEXT, weak_topics TEXT, mistake_categories TEXT, evaluation_feedback TEXT, personal_notes TEXT)")
    init_db(path)
    assert "diagram" in {row[1] for row in sqlite3.connect(path).execute("PRAGMA table_info(attempts)")}
    backup={"format":"data-engineering-practice-lab-progress","version":1,"attempts":[{"challenge_id":"CM-001","status":"In progress","started_at":"2026-01-01","updated_at":"2026-01-01","answer":"old"}],"settings":{}}
    merge_progress(path,backup)
    assert list_attempts(path)[0]["diagram"] is None


def test_stale_answer_save_preserves_newer_diagram(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    aid = save_attempt(path, {"challenge_id": "CM-001"})
    stale = get_attempt(path, aid)
    diagram = empty_diagram("conceptual_erd")
    save_diagram(path, aid, diagram)
    stale.update(answer="Revised prose", status="Completed")
    save_attempt_details(path, stale)
    reopened = get_attempt(path, aid)
    assert reopened["diagram"] == diagram
    assert reopened["answer"] == "Revised prose"
    assert reopened["status"] == "Completed"


def test_lookup_does_not_load_other_attempts(tmp_path, monkeypatch):
    path = tmp_path / "practice.db"
    init_db(path)
    aid = save_attempt(path, {"challenge_id": "CM-001"})

    def unexpected_scan(*args, **kwargs):
        pytest.fail("A single attempt lookup must not load all attempts")

    monkeypatch.setattr("src.database.list_attempts", unexpected_scan)
    assert get_attempt(path, aid)["challenge_id"] == "CM-001"
    assert get_attempt(path, aid + 1) is None


def test_connection_is_closed_and_rolls_back_on_failure(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    with pytest.raises(RuntimeError):
        with connect(path) as connection:
            connection.execute("INSERT INTO settings VALUES ('test', '1')")
            raise RuntimeError("abort")
    with pytest.raises(sqlite3.ProgrammingError, match="closed"):
        connection.execute("SELECT 1")
    assert get_settings(path) == {}


def test_backup_import_is_atomic(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    save_settings(path, {"theme": "existing"})
    backup = {
        "format": "data-engineering-practice-lab-progress",
        "version": 1,
        "attempts": [
            {"challenge_id": "CM-001", "status": "Completed"},
            {"challenge_id": "CM-002", "status": "Completed", "score": {"invalid": 1}},
        ],
        "settings": {"theme": "imported"},
    }
    with pytest.raises(ValueError, match="Invalid score"):
        merge_progress(path, backup)
    assert list_attempts(path) == []
    assert get_settings(path) == {"theme": "existing"}


def test_missing_attempt_update_is_reported(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    with pytest.raises(ValueError, match="Attempt not found"):
        save_attempt(path, {"attempt_id": 42, "challenge_id": "CM-001"})

@pytest.mark.parametrize('field,value', [
    ('score', '90'), ('score', float('nan')), ('score', float('inf')),
    ('confidence', 2.5), ('confidence', True), ('minutes_taken', -1),
    ('weak_topics', 'joins'), ('weak_topics', [{}]), ('hints_used', [0]),
    ('complications_used', [2]), ('started_at', 'bad-date'),
    ('status', []), ('rubric_scores', {'a': -1}), ('answer', {}),
])
def test_invalid_backup_is_rejected_before_writing(tmp_path, field, value):
    path = tmp_path / 'practice.db'
    init_db(path)
    row = {'challenge_id': 'A', 'status': 'Completed', field: value}
    backup = {'format': 'data-engineering-practice-lab-progress', 'version': 1,
              'attempts': [row], 'settings': {}}
    with pytest.raises(ValueError):
        merge_progress(path, backup)
    assert list_attempts(path) == []


def test_backup_merge_compares_instants_not_timestamp_strings(tmp_path):
    path = tmp_path / 'practice.db'
    init_db(path)
    aid = save_attempt(path, {'challenge_id': 'A', 'status': 'Completed',
        'started_at': '2026-01-01T10:00:00+00:00',
        'updated_at': '2026-01-01T12:00:00+00:00', 'answer': 'old'})
    backup = {'format': 'data-engineering-practice-lab-progress', 'version': 1,
        'attempts': [{'challenge_id': 'A', 'status': 'Completed',
            'started_at': '2026-01-01T04:00:00-06:00',
            'updated_at': '2026-01-01T07:00:00-06:00', 'answer': 'new'}]}
    assert merge_progress(path, backup)['updated'] == 1
    assert get_attempt(path, aid)['answer'] == 'new'
    assert len(list_attempts(path)) == 1


def test_history_can_omit_diagrams_without_affecting_exports(tmp_path):
    path = tmp_path / 'practice.db'
    init_db(path)
    diagram = empty_diagram('conceptual_erd')
    save_attempt(path, {'challenge_id': 'A', 'diagram': diagram})
    assert list_attempts(path, include_diagrams=False)[0]['diagram'] is None
    assert export_progress(path)['attempts'][0]['diagram'] == diagram


def test_metadata_history_preserves_stats_order_and_full_attempts(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    for index in range(3):
        save_attempt(path, {"challenge_id": "A", "status": "Evaluated", "score": index * 25,
            "updated_at": "2026-10-13T12:00:00+00:00", "weak_topics": ["joins"],
            "answer": f"Saved answer {index}", "evaluation_feedback": "Saved feedback",
            "personal_notes": "Private notes", "diagram": empty_diagram("conceptual_erd")})
    full = list_attempts(path)
    metadata = list_attempts(path, include_diagrams=False, include_content=False)
    assert [a["attempt_id"] for a in metadata] == [a["attempt_id"] for a in full]
    assert overview(metadata) == overview(full)
    assert all(a["answer"] is None and a["evaluation_feedback"] is None and a["personal_notes"] is None for a in metadata)
    assert all(a["diagram"] is None for a in metadata)
    assert get_attempt(path, metadata[0]["attempt_id"]) == full[0]
    assert export_progress(path)["attempts"] == full


def test_missing_json_defaults_are_not_shared_between_attempts(tmp_path):
    path = tmp_path / "practice.db"
    init_db(path)
    for _ in range(2):
        save_attempt(path, {"challenge_id": "A"})
    with connect(path) as connection:
        connection.execute("UPDATE attempts SET hints_used = ''")
    first, second = list_attempts(path)
    first["hints_used"].append(1)
    assert second["hints_used"] == []
    assert list_attempts(path)[0]["hints_used"] == []
