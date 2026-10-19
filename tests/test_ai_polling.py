"""Exercise the actual fragment callback without waiting for wall-clock expiry."""
from types import SimpleNamespace
import weakref

import pytest

from src import ai, ai_ui


class Rerun(Exception):
    pass


class SessionState(dict):
    def __getattr__(self, name):
        return self[name]

    def __setattr__(self, name, value):
        self[name] = value


@pytest.fixture
def cancelled_poll(monkeypatch):
    clock = [1000.0]
    monkeypatch.setattr(ai, "time", SimpleNamespace(monotonic=lambda: clock[0]))
    session = ai.AISession()
    session._watched = True  # Drive the real expiry watcher deterministically below.
    session.configure(ai.AIConnection("Chat Completions", "https://example.com/v1", "simulated"), "test-only-key")
    session.request = ai.AIRequest("test", "Reply with OK.", "connection-test", "revision")
    session._worker_active = True
    session.invalidate("cancelled")
    callbacks, intervals = [], []
    def fragment(*, run_every):
        intervals.append(run_every)
        def decorate(callback):
            callbacks.append(callback)
            return callback
        return decorate
    def rerun():
        raise Rerun
    streamlit = SimpleNamespace(session_state=SessionState(optional_ai=session), fragment=fragment,
        caption=lambda *a, **k: None, info=lambda *a, **k: None, warning=lambda *a, **k: None,
        button=lambda *a, **k: False, rerun=rerun)
    monkeypatch.setattr(ai_ui, "st", streamlit)
    ai_ui.render_request_status("connection-test")
    return session, clock, callbacks, intervals


def test_cancelled_request_polling_does_not_prevent_credential_expiry(cancelled_poll):
    session, clock, callbacks, _ = cancelled_poll
    activity = session._heartbeat
    for _ in range(3):
        clock[0] += ai.SESSION_IDLE_SECONDS / 2
        callbacks[-1]()
    # Execute the production expiry watcher once, without real sleeping.
    class StopWatcher(Exception):
        pass
    sleeps = [0]
    def sleep(seconds):
        sleeps[0] += 1
        if sleeps[0] > 1:
            raise StopWatcher
    ai.time.sleep = sleep
    with pytest.raises(StopWatcher):
        ai._expire_session(weakref.ref(session))
    assert session.connection is None and session._credential == ""
    assert session._heartbeat == activity


@pytest.mark.parametrize("state", ["cancelled", "outdated"])
def test_polling_stops_when_invalidated_worker_finishes(cancelled_poll, state):
    session, _, callbacks, intervals = cancelled_poll
    session.invalidate(state)
    callbacks[-1]()  # Record an invalidated state while transport is still active.
    assert intervals[-1] == .5
    session._worker_active = False
    with pytest.raises(Rerun):
        callbacks[-1]()
    ai_ui.render_request_status("connection-test")
    assert intervals[-1] is None


def test_only_human_activity_renews_the_idle_timer(cancelled_poll):
    session, clock, _, _ = cancelled_poll
    activity = session._heartbeat
    ai_ui.reconcile_page("Optional AI")
    clock[0] += 10
    ai_ui.reconcile_page("Optional AI")  # A repeated page render is passive.
    ai_ui.ai_session()  # Looking up the connection is passive as well.
    assert session._heartbeat == activity
    ai_ui.record_activity()  # Widget callbacks mark explicit interaction.
    assert session._heartbeat == clock[0]
    clock[0] += 10
    ai_ui.reconcile_page("Practice")  # Changing pages counts as navigation.
    assert session._heartbeat == clock[0]
