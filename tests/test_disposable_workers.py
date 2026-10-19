"""Process ownership through public leases, using a controllable launch adapter."""
from contextlib import contextmanager
import io
import json
import subprocess
import threading
import time

import pytest

from src.disposable_workers import DisposableWorkers


class ReadyPipe(io.BytesIO):
    def __init__(self, process, gate, line):
        super().__init__(line)
        self.process, self.gate = process, gate

    def readline(self):
        assert self.gate.wait(3), "Preparation did not finish or get cancelled"
        return b"" if self.process.returncode is not None else super().readline()


class Process:
    def __init__(self, warm, gate, line=b"READY\n"):
        self.warm, self.gate = warm, gate
        self.returncode = None
        self.stdin = io.BytesIO()
        self.stdout = ReadyPipe(self, gate, line)
        self.stderr = io.BytesIO()
        self.reaped = threading.Event()
        self.requests = []

    def poll(self):
        return self.returncode

    def kill(self):
        self.returncode = -9
        self.gate.set()

    def wait(self):
        assert self.returncode is not None, "A live process must be killed before waiting"
        self.reaped.set()
        return self.returncode

    def communicate(self, payload, timeout=None):
        self.requests.append(payload)
        self.returncode = 0
        return b'{"ok":true}', b""


class Launcher:
    def __init__(self, *, blocked=False, line=b"READY\n"):
        self.gate = threading.Event()
        if not blocked:
            self.gate.set()
        self.line = line
        self.processes = []
        self.created = threading.Condition()

    def __call__(self, warm):
        process = Process(warm, self.gate if warm else threading.Event(), self.line)
        with self.created:
            self.processes.append(process)
            self.created.notify_all()
        return process

    def prepared_process(self):
        with self.created:
            assert self.created.wait_for(lambda: any(p.warm for p in self.processes), timeout=2)
            return next(p for p in self.processes if p.warm)


class Timer:
    def __init__(self, delay, callback, args=()):
        self.delay, self.callback, self.args = delay, callback, args
        self.cancelled = False
        self.daemon = False

    def start(self):
        pass

    def cancel(self):
        self.cancelled = True

    def fire(self):
        # Even a cancelled timer may have entered its callback already.
        self.callback(*self.args)


@pytest.fixture
def timers(monkeypatch):
    created = []

    def timer(*args, **kwargs):
        instance = Timer(*args, **kwargs)
        created.append(instance)
        return instance

    monkeypatch.setattr("src.disposable_workers.threading.Timer", timer)
    return created


def eventually(predicate):
    deadline = time.monotonic() + 2
    while not predicate():
        assert time.monotonic() < deadline, "Timed out waiting for worker lifecycle"
        time.sleep(.005)


@contextmanager
def warm_lease(workers):
    deadline = time.monotonic() + 2
    while True:
        with workers.worker() as process:
            if process.warm:
                yield process
                return
        assert time.monotonic() < deadline, "Prepared worker was never handed off"
        time.sleep(.005)


def assert_disposed(process):
    assert process.poll() is not None and process.reaped.is_set()
    assert all(stream.closed for stream in (process.stdin, process.stdout, process.stderr))


def test_concurrent_prewarm_reserves_only_one_slot_and_close_cleans_it():
    launcher = Launcher(blocked=True)
    workers = DisposableWorkers("test", start=launcher)
    threads = [threading.Thread(target=workers.prewarm) for _ in range(16)]
    try:
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join(2)
        process = launcher.prepared_process()
        assert len(launcher.processes) == 1
    finally:
        workers.close()
    assert_disposed(process)
    workers.close()
    workers.prewarm()
    assert len(launcher.processes) == 1
    with pytest.raises(RuntimeError, match="closed"):
        with workers.worker():
            pass


def test_preparing_never_blocks_a_cold_request():
    launcher = Launcher(blocked=True)
    workers = DisposableWorkers("test", start=launcher)
    try:
        workers.prewarm()
        preparing = launcher.prepared_process()
        with workers.worker() as process:
            assert not process.warm
            assert process.communicate(b"request")[0] == b'{"ok":true}'
        assert_disposed(process)
        assert preparing.poll() is None
    finally:
        workers.close()
    assert_disposed(preparing)


def test_each_prepared_process_is_leased_once_and_then_reaped():
    launcher = Launcher()
    workers = DisposableWorkers("test", start=launcher)
    try:
        workers.prewarm()
        with warm_lease(workers) as first:
            first.communicate(b"one")
        assert_disposed(first)
        with warm_lease(workers) as second:
            assert second is not first
            second.communicate(b"two")
        assert_disposed(second)
        assert first.requests == [b"one"] and second.requests == [b"two"]
    finally:
        workers.close()


@pytest.mark.parametrize("error", [subprocess.TimeoutExpired("worker", .1), ValueError("decode failed")])
def test_lease_cleanup_runs_when_request_fails(error):
    workers = DisposableWorkers("test", start=Launcher(blocked=True))
    try:
        with pytest.raises(type(error)):
            with workers.worker() as process:
                raise error
        assert_disposed(process)
    finally:
        workers.close()


def test_cancellation_reaps_and_next_request_has_an_independent_process():
    workers = DisposableWorkers("test", start=Launcher(blocked=True))
    try:
        with workers.worker() as first:
            first.kill()
        assert_disposed(first)
        with workers.worker() as second:
            assert second is not first
            second.communicate(b"next")
        assert_disposed(second)
    finally:
        workers.close()


def test_failed_handshake_is_disposed_and_requests_still_start_cold():
    launcher = Launcher(line=b"NOT READY\n")
    workers = DisposableWorkers("test", start=launcher)
    try:
        workers.prewarm()
        failed = launcher.prepared_process()
        eventually(lambda: failed.stderr.closed)
        assert_disposed(failed)
        with workers.worker() as process:
            assert not process.warm
            process.communicate(b"fallback")
        assert_disposed(process)
    finally:
        workers.close()


def test_preparation_spawn_failure_does_not_break_cold_execution():
    launcher = Launcher()
    failed = threading.Event()

    def start(warm):
        if warm:
            failed.set()
            raise OSError("Cannot prepare")
        return launcher(False)

    workers = DisposableWorkers("test", start=start)
    try:
        workers.prewarm()
        assert failed.wait(2)
        with workers.worker() as process:
            process.communicate(b"fallback")
        assert_disposed(process)
    finally:
        workers.close()


def test_preparation_deadline_kills_and_reaps_unready_worker(timers):
    launcher = Launcher(blocked=True)
    workers = DisposableWorkers("test", start=launcher, preparation_timeout=5)
    try:
        workers.prewarm()
        process = launcher.prepared_process()
        eventually(lambda: len(timers) == 1)
        assert timers[0].delay == 5
        timers[0].fire()
        eventually(lambda: process.stderr.closed)
        assert_disposed(process)
        assert timers[0].cancelled
    finally:
        workers.close()


def test_idle_expiry_reaps_only_its_owned_process(timers):
    launcher = Launcher()
    workers = DisposableWorkers("test", start=launcher, idle_timeout=90)
    try:
        workers.prewarm()
        first = launcher.prepared_process()
        eventually(lambda: len(timers) == 1)
        assert timers[0].delay == 90
        timers[0].fire()
        assert_disposed(first)
        with warm_lease(workers) as replacement:
            assert replacement is not first
            timers[0].fire()  # A stale callback cannot kill the replacement.
            assert replacement.poll() is None
    finally:
        workers.close()


def test_cancelled_preparation_and_idle_timers_cannot_kill_a_lease(timers):
    workers = DisposableWorkers("test", start=Launcher(), preparation_timeout=5, idle_timeout=90)
    try:
        workers.prewarm()
        eventually(lambda: any(timer.delay == 90 for timer in timers))
        startup = next(timer for timer in timers if timer.delay == 5)
        idle = next(timer for timer in timers if timer.delay == 90)
        with warm_lease(workers) as process:
            assert startup.cancelled and idle.cancelled
            startup.fire()
            idle.fire()
            assert process.poll() is None
            process.communicate(b"still running")
        assert_disposed(process)
    finally:
        workers.close()


def test_close_keeps_an_active_request_owned_by_its_lease():
    workers = DisposableWorkers("test", start=Launcher(blocked=True))
    with workers.worker() as process:
        workers.close()
        assert process.poll() is None
        process.communicate(b"complete")
    assert_disposed(process)


def test_close_during_process_creation_disposes_the_late_process():
    entered, release = threading.Event(), threading.Event()
    launcher = Launcher()

    def start(warm):
        if warm:
            entered.set()
            assert release.wait(3)
        return launcher(warm)

    workers = DisposableWorkers("test", start=start)
    workers.prewarm()
    assert entered.wait(2)
    closer = threading.Thread(target=workers.close)
    closer.start()
    try:
        def is_closed():
            try:
                with workers.worker():
                    return False
            except RuntimeError:
                return True
        eventually(is_closed)
    finally:
        release.set()
        closer.join(3)
        workers.close()
    assert not closer.is_alive()
    assert_disposed(launcher.prepared_process())


def test_dead_prepared_worker_is_reaped_before_cold_fallback(timers):
    launcher = Launcher()
    workers = DisposableWorkers("test", start=launcher, idle_timeout=90)
    try:
        workers.prewarm()
        dead = launcher.prepared_process()
        eventually(lambda: len(timers) == 1)
        dead.kill()
        with workers.worker() as process:
            assert process is not dead and not process.warm
            assert_disposed(dead)
            process.communicate(b"fallback")
        assert_disposed(process)
    finally:
        workers.close()


@pytest.mark.parametrize("module", ["src.sql_worker", "src.sql_tools_worker"])
def test_real_prepared_worker_handles_one_request_and_exits(module):
    if module == "src.sql_worker":
        from scripts.build_sql_exercises import build
        request = {"exercise": build()["SQL-006"], "operation": "run", "sql": "SELECT 42"}
    else:
        request = {"action": "convert", "sql": "SELECT 42", "dialect": "postgres", "target": "bigquery"}
    workers = DisposableWorkers(module, preparation_timeout=5, idle_timeout=90)
    payload = json.dumps(request).encode()
    deadline = time.monotonic() + 10
    seen = set()
    try:
        workers.prewarm()
        while True:
            with workers.worker() as process:
                assert process.pid not in seen
                seen.add(process.pid)
                output, _ = process.communicate(payload, timeout=10)
                response = json.loads(output)
                assert process.returncode == 0 and response["ok"]
                if module == "src.sql_worker":
                    assert response["rows"] == [[42]]
                else:
                    assert response["result"]["sql"] == "SELECT\n  42;"
                prepared = "--ready" in process.args
            assert process.poll() is not None
            assert all(stream.closed for stream in (process.stdin, process.stdout, process.stderr))
            if prepared:
                break
            assert time.monotonic() < deadline, "A real prepared worker was never leased"
    finally:
        workers.close()
