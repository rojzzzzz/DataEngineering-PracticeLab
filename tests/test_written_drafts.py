"""Draft recovery through the same interface used by forms and navigation."""
import pytest

from src import database as db
from src.written_drafts import WrittenDrafts


@pytest.fixture
def draft(tmp_path):
    path = tmp_path / "drafts.db"
    db.init_db(path)
    aid = db.save_attempt(path, {"challenge_id": "SCN-001", "status": "In progress",
        "answer": "Saved writing", "confidence": 3, "updated_at": "2026-01-01"})
    return path, aid, {}


def mount(draft, sections=()):
    path, aid, state = draft
    drafts = WrittenDrafts(state, path).begin_render()
    return drafts, drafts.mount(db.get_attempt(path, aid), sections=sections)


def test_unblurred_draft_and_confidence_flush_before_reopening(draft):
    path, aid, state = draft
    drafts, form = mount(draft)
    state[form.key] = "Unblurred draft"
    state[form.confidence_key] = 5
    assert drafts.flush()
    saved = db.get_attempt(path, aid)
    assert (saved["answer"], saved["confidence"]) == ("Unblurred draft", 5)
    drafts.accept_navigation(saved)
    state[form.key] = ""  # Empty state retained by an unmounted widget.
    _, reopened = mount(draft)
    assert reopened.answer == "Unblurred draft"


@pytest.mark.parametrize("sections", [(), ("First", "Second")])
def test_failed_save_survives_widget_cleanup_and_retries(draft, monkeypatch, sections):
    path, aid, state = draft
    drafts, form = mount(draft, sections)
    if sections:
        state[form.fields[0][1]] = "Pending text"
        form.changed()
    else:
        state[form.key] = "Pending text"
    pending = form.answer
    save = db.save_attempt_details
    monkeypatch.setattr(db, "save_attempt_details", lambda *args: (_ for _ in ()).throw(OSError("disk full")))
    result = drafts.save(db.get_attempt(path, aid), answer=pending)
    assert result.failed and result.attempt["answer"] == "Saved writing"
    assert not drafts.flush()
    # The form disappears without accepting navigation. Pending text remains
    # available even if every native widget key has been removed.
    drafts.begin_render()
    state.pop(form.key)
    for _, key in form.fields:
        state.pop(key)
    _, reopened = mount(draft, sections)
    assert reopened.answer == pending
    monkeypatch.setattr(db, "save_attempt_details", save)
    assert drafts.flush()
    assert db.get_attempt(path, aid)["answer"] == pending


def test_partial_section_cleanup_preserves_siblings_and_explicit_clear(draft):
    path, aid, state = draft
    drafts, form = mount(draft, ("First", "Second"))
    state[form.fields[0][1]] = "First reasoning"
    state[form.fields[1][1]] = "Second reasoning"
    form.changed()
    state.pop(form.fields[1][1])
    state[form.fields[0][1]] = ""
    form.changed()
    assert form.answer == "## First\n\n\n## Second\nSecond reasoning"
    assert drafts.flush()
    assert db.get_attempt(path, aid)["answer"] == form.answer
    drafts.accept_navigation()
    _, reopened = mount(draft, ("First", "Second"))
    assert state[reopened.fields[0][1]] == ""
    assert state[reopened.fields[1][1]] == "Second reasoning"


def test_cleaned_up_sections_do_not_replace_the_last_assembled_answer(draft):
    path, aid, state = draft
    drafts, form = mount(draft, ("First", "Second"))
    state[form.fields[0][1]] = "Keep first"
    state[form.fields[1][1]] = "Keep second"
    form.changed()
    expected = form.answer
    state.pop(form.fields[1][1])
    state[form.fields[0][1]] = ""  # Stale hidden widget, no edit callback.
    assert drafts.flush()
    assert db.get_attempt(path, aid)["answer"] == expected


def test_clearing_all_sections_stays_empty_after_reopening(draft):
    path, aid, state = draft
    drafts, form = mount(draft, ("First", "Second"))
    for _, key in form.fields:
        state[key] = "Reasoning"
    form.changed()
    assert drafts.flush()
    for _, key in form.fields:
        state[key] = ""
    form.changed()
    assert form.answer == "" and drafts.flush()
    drafts.accept_navigation()
    _, reopened = mount(draft, ("First", "Second"))
    assert reopened.answer == "" and db.get_attempt(path, aid)["answer"] == ""


def test_switching_attempts_keeps_each_attempts_sections(draft):
    path, aid, state = draft
    drafts, first = mount(draft, ("Reasoning",))
    state[first.fields[0][1]] = "First attempt"
    first.changed()
    assert drafts.flush()
    second_id = db.save_attempt(path, {"challenge_id": "SCN-001", "answer": "## Reasoning\nSecond attempt"})
    second = db.get_attempt(path, second_id)
    drafts.accept_navigation(second)
    other = WrittenDrafts(state, path).begin_render().mount(second, sections=("Reasoning",))
    assert other.answer == "## Reasoning\nSecond attempt"
    drafts.accept_navigation(db.get_attempt(path, aid))
    _, reopened = mount(draft, ("Reasoning",))
    assert reopened.answer == "## Reasoning\nFirst attempt"


def test_unchanged_drafts_do_not_write_or_change_timestamp(draft, monkeypatch):
    path, aid, state = draft
    drafts, form = mount(draft)
    attempt = db.get_attempt(path, aid)
    monkeypatch.setattr(db, "save_attempt_details", lambda *args: pytest.fail("Unchanged drafts must not write"))
    assert drafts.save(attempt, answer=form.answer).attempt == attempt
    assert drafts.flush()
    assert db.get_attempt(path, aid)["updated_at"] == "2026-01-01"


def test_mounting_structured_writing_does_not_reformat_saved_text(draft, monkeypatch):
    path, aid, state = draft
    text = "## First\nKeep this text.\n## Extra explanation\nKeep this subheading.\n\n## Second\n  Keep spacing.\n"
    attempt = db.get_attempt(path, aid)
    db.save_attempt_details(path, {**attempt, "answer": text})
    drafts, form = mount(draft, ("First", "Second"))
    monkeypatch.setattr(db, "save_attempt_details", lambda *args: pytest.fail("Mounting must not change saved text"))
    assert form.answer == text
    assert not drafts.save(db.get_attempt(path, aid), answer=form.answer).failed


def test_reverting_failed_text_does_not_resurrect_it_on_remount(draft, monkeypatch):
    path, aid, state = draft
    drafts, form = mount(draft)
    attempt = db.get_attempt(path, aid)
    save = db.save_attempt_details
    monkeypatch.setattr(db, "save_attempt_details", lambda *args: (_ for _ in ()).throw(OSError("disk full")))
    assert drafts.save(attempt, answer="Discard this failed edit").failed
    monkeypatch.setattr(db, "save_attempt_details", save)
    assert not drafts.save(attempt, answer=attempt["answer"]).failed
    drafts.accept_navigation()
    state[form.key] = ""
    _, reopened = mount(draft)
    assert reopened.answer == "Saved writing"


@pytest.mark.parametrize("keep_draft", [False, True])
def test_concurrent_answer_edits_require_explicit_resolution(draft, keep_draft):
    path, aid, state = draft
    drafts, form = mount(draft)
    original = db.get_attempt(path, aid)
    state[form.key] = "My pending version"
    db.save_attempt_details(path, {**original, "answer": "Another tab's version", "evaluation_feedback": "New feedback"})
    latest = db.get_attempt(path, aid)
    result = drafts.save(latest, answer=form.answer)
    assert result.failed and result.conflict
    assert not drafts.flush()
    assert db.get_attempt(path, aid) == latest
    assert state["pending_answers"][aid] == "My pending version"
    drafts.resolve_conflict(aid, keep_draft)
    assert drafts.flush()
    saved = db.get_attempt(path, aid)
    assert saved["answer"] == ("My pending version" if keep_draft else "Another tab's version")
    assert saved["evaluation_feedback"] == "New feedback"


def test_database_guard_catches_edits_arriving_during_save(draft, monkeypatch):
    path, aid, state = draft
    drafts, form = mount(draft)
    original = db.get_attempt(path, aid)
    state[form.key] = "This tab's edit"
    save = db.save_attempt_details
    def concurrent_save(path, updated, expected=None):
        save(path, {**db.get_attempt(path, aid), "answer": "Concurrent edit"})
        return save(path, updated, expected)
    monkeypatch.setattr(db, "save_attempt_details", concurrent_save)
    result = drafts.save(original, answer=form.answer)
    assert result.failed and result.conflict
    assert db.get_attempt(path, aid)["answer"] == "Concurrent edit"


def test_reopening_attempt_refreshes_all_fields_from_other_session(draft):
    path, aid, state = draft
    drafts, form = mount(draft)
    db.save_attempt_details(path, {**db.get_attempt(path, aid), "answer": "New saved answer", "confidence": 5})
    saved = db.get_attempt(path, aid)
    drafts.accept_navigation(saved)
    drafts, form = mount(draft)
    assert form.answer == "New saved answer"
    assert state[form.confidence_key] == 5
    assert drafts.flush() and db.get_attempt(path, aid) == saved


def test_edit_after_commit_is_not_mistaken_for_this_editors_loaded_base(draft, monkeypatch):
    path, aid, state = draft
    drafts, form = mount(draft)
    original = db.get_attempt(path, aid)
    state[form.key] = "My saved edit"
    save = db.save_attempt_details
    def after_commit(path, updated, expected=None):
        result = save(path, updated, expected)
        save(path, {**db.get_attempt(path, aid), "answer": "Newer edit after commit"})
        return result
    monkeypatch.setattr(db, "save_attempt_details", after_commit)
    assert not drafts.save(original, answer=form.answer).failed
    monkeypatch.setattr(db, "save_attempt_details", save)
    drafts, form = mount(draft)
    assert form.answer == "Newer edit after commit"
    assert drafts.flush() and db.get_attempt(path, aid)["answer"] == form.answer


def test_rerun_after_commit_does_not_create_a_conflict_with_own_save(draft, monkeypatch):
    path, aid, _ = draft
    class Rerun(BaseException):
        pass
    class InterruptingState(dict):
        interrupt = False
        def get(self, *args):
            if self.interrupt:
                self.interrupt = False
                raise Rerun()
            return super().get(*args)
    state = InterruptingState()
    drafts, form = mount((path, aid, state))
    state[form.confidence_key] = 1
    save = db.save_attempt_details
    def interrupt_after_commit(*args):
        result = save(*args)
        state.interrupt = True
        return result
    monkeypatch.setattr(db, "save_attempt_details", interrupt_after_commit)
    with pytest.raises(Rerun):
        drafts.save(db.get_attempt(path, aid), confidence=1)
    monkeypatch.setattr(db, "save_attempt_details", save)
    drafts, form = mount((path, aid, state))
    state[form.confidence_key] = 5
    assert not drafts.save(db.get_attempt(path, aid), confidence=5).failed
    assert db.get_attempt(path, aid)["confidence"] == 5
