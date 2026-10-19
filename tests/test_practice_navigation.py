"""Behavior at the navigation seam, using real temporary SQLite persistence."""
from types import SimpleNamespace

import pytest

from src import database
from src.practice_navigation import PracticeNavigation


CHALLENGES = [
    {"id": "SCN-001"}, {"id": "SCN-002"}, {"id": "CASE-001"},
    {"id": "SQL-001", "sql_playground": {"enabled": True}},
    {"id": "PY-001", "python_playground": {"enabled": True}},
    {"id": "INC-001", "data_quality_detective": {"enabled": True}, "sql_playground": {"enabled": True}},
]


def test_filter_restore_accepts_legacy_settings_and_rejects_invalid_controls():
    from src.practice_navigation import restore_filter_settings
    state = {"filter_family": "SQL"}
    restore_filter_settings(state, {"maximum_session_time": 400, "last_learning_path": "Saved path",
        "exclude_completed": True, "filter_difficulty": ["invalid"], "filter_attempted": "false"})
    assert state["filter_minutes"] == 400 and state["filter_path"] == "Saved path"
    assert state["filter_completed"] is True and state["filter_family"] == "SQL"
    assert state["filter_difficulty"] == "Any" and state["filter_attempted"] is True


@pytest.fixture
def session(tmp_path):
    path = tmp_path / "practice.db"
    database.init_db(path)
    aid = database.save_attempt(path, {"challenge_id": "SCN-001", "status": "In progress",
                                     "answer": "Saved answer", "confidence": 3})
    state = {"navigate": "Practice", "mode": "Daily Scenario", "active_challenge": "SCN-001",
             "active_attempt": aid, "rendered_written_attempt": aid,
             f"answer_{aid}": "Unblurred draft", f"confidence_{aid}": 4}
    cancellations = []

    def cancel():
        # Ordering matters: work must be safe before cancellation.
        assert database.get_attempt(path, aid)["answer"] == state[f"answer_{aid}"]
        cancellations.append(True)

    nav = PracticeNavigation(state, path, CHALLENGES, cancel)
    return SimpleNamespace(nav=nav, state=state, path=path, aid=aid, cancellations=cancellations)


@pytest.mark.parametrize("destination,value", [
    ("page", "Progress"), ("mode", "SQL Practice"), ("preview", "SQL-001"),
    ("exercise", "SCN-002"), ("filters", None), ("reset", None),
])
def test_every_transition_flushes_the_outgoing_draft(session, destination, value):
    assert session.nav.go(destination, value)
    attempt = database.get_attempt(session.path, session.aid)
    assert attempt["answer"] == "Unblurred draft"
    assert attempt["confidence"] == 4
    assert len(database.list_attempts(session.path)) == 1
    assert len(session.cancellations) == (0 if destination in ("filters", "reset") else 1)


@pytest.mark.parametrize("destination,value", [
    ("page", "Challenge Bank"), ("mode", "SQL Practice"), ("preview", "SQL-001"),
    ("exercise", "SQL-001"), ("attempt", "saved"), ("filters", None), ("reset", None),
])
def test_failed_save_vetoes_all_destination_changes(session, monkeypatch, destination, value):
    state = session.state
    target = database.save_attempt(session.path, {"challenge_id": "SQL-001"})
    state.update(direct_preview="SCN-001", filter_family="SCN", catalog_search="keep me")
    if destination == "page":
        state["navigate"] = value  # Native on_change has already changed the widget.
    if destination == "exercise":
        state["sql_challenge_choice"] = value

    def fail(*args):
        raise OSError("Disk unavailable")

    monkeypatch.setattr(database, "save_attempt_details", fail)
    assert not session.nav.go(destination, target if value == "saved" else value)
    assert not session.cancellations
    assert state["navigate"] == "Practice"
    assert state["mode"] == "Daily Scenario"
    assert state["active_attempt"] == session.aid
    assert state["active_challenge"] == state["sql_challenge_choice"] == "SCN-001"
    assert state["direct_preview"] == "SCN-001"
    assert state["filter_family"] == "SCN" and state["catalog_search"] == "keep me"
    assert state["pending_answers"][session.aid] == "Unblurred draft"
    assert database.get_attempt(session.path, session.aid)["answer"] == "Saved answer"


def test_reopening_same_attempt_restores_the_just_flushed_draft(session):
    assert session.nav.go("attempt", session.aid)
    assert session.state[f"answer_{session.aid}"] == "Unblurred draft"
    assert session.state["active_attempt"] == session.aid
    assert len(session.cancellations) == 1


@pytest.mark.parametrize("cid,mode", [
    ("SCN-002", "Daily Scenario"), ("CASE-001", "Complete Case Study"),
    ("SQL-001", "SQL Practice"), ("PY-001", "Python Practice"),
    ("INC-001", "Data-quality Detective"),
])
def test_preview_selects_exact_challenge_and_mode_without_an_attempt(session, cid, mode):
    assert session.nav.go("preview", cid)
    assert session.state["active_challenge"] == session.state["sql_challenge_choice"] == cid
    assert session.state["direct_preview"] == cid and session.state["mode"] == mode
    assert "active_attempt" not in session.state
    assert len(database.list_attempts(session.path)) == 1


def test_reopen_attempt_ignores_filters_and_preserves_its_identity(session):
    target = database.save_attempt(session.path, {"challenge_id": "SQL-001", "answer": "SQL reasoning"})
    session.state.update(filter_family="SCN", direct_preview="SCN-002")
    assert session.nav.go("attempt", target)
    assert session.state["active_attempt"] == target
    assert session.state["active_challenge"] == "SQL-001"
    assert session.state[f"answer_{target}"] == "SQL reasoning"
    assert session.state["filter_family"] == "SCN"
    assert "direct_preview" not in session.state


def test_reset_preserves_mode_and_history_but_clears_preview_and_catalog(session):
    session.state.update(mode="Surprise Me", direct_preview="SCN-001", filter_family="SQL",
                         catalog_search="search", catalog_choice="SQL-001", catalog_page=5)
    assert session.nav.go("reset")
    assert session.state["mode"] == "Surprise Me"
    assert session.state["filter_family"] == "All families"
    assert session.state["catalog_page"] == 1 and session.state["catalog_search"] == ""
    assert "catalog_choice" not in session.state and "direct_preview" not in session.state
    assert len(database.list_attempts(session.path)) == 1


@pytest.mark.parametrize("destination,value", [("attempt", 9999), ("preview", "missing"), ("exercise", "missing")])
def test_unavailable_destination_has_no_side_effects(session, destination, value):
    before = dict(session.state)
    assert not session.nav.go(destination, value)
    assert session.state == before and not session.cancellations
    assert database.get_attempt(session.path, session.aid)["answer"] == "Saved answer"


@pytest.mark.parametrize("operation,invalidated", [("evaluation", True), ("creation", False)])
def test_filter_changes_only_invalidate_evaluation(session, operation, invalidated):
    calls = []
    session.state["optional_ai"] = SimpleNamespace(
        snapshot=lambda: (SimpleNamespace(operation=operation), None, None),
        invalidate=lambda: calls.append(True),
    )
    assert session.nav.go("filters")
    assert bool(calls) == invalidated
    assert not session.cancellations
