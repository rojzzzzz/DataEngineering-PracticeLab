"""One idle Python worker per feature; every leased process runs one request.

Preparation is an optional optimization: a request never waits for it. Leases
own active processes; closing the pool retires only idle/preparing processes.
"""
from __future__ import annotations

from collections.abc import Callable, Iterator
from contextlib import contextmanager
from pathlib import Path
import subprocess
import sys
import threading


def _start_worker(module: str, ready: bool) -> subprocess.Popen:
    command = [sys.executable, "-m", module]
    if ready:
        command.append("--ready")
    return subprocess.Popen(
        command, cwd=Path(__file__).resolve().parents[1],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
    )


def _kill(process: subprocess.Popen) -> None:
    try:
        if process.poll() is None:
            process.kill()
    except OSError:
        pass  # Another owner may have just observed the process exit.


def _dispose(process: subprocess.Popen | None) -> None:
    if process is None:
        return
    _kill(process)
    try:
        process.wait()
    finally:
        for stream in (process.stdin, process.stdout, process.stderr):
            if stream is not None:
                stream.close()


class DisposableWorkers:
    def __init__(self, module: str, *, preparation_timeout: float | None = None,
                 idle_timeout: float | None = None,
                 start: Callable[[bool], subprocess.Popen] | None = None):
        self._start = start or (lambda ready: _start_worker(module, ready))
        self._preparation_timeout = preparation_timeout
        self._idle_timeout = idle_timeout
        self._lock = threading.Lock()
        self._ready: subprocess.Popen | None = None
        self._starting: subprocess.Popen | None = None
        self._reservation: object | None = None
        self._preparation: threading.Thread | None = None
        self._expiration: threading.Timer | None = None
        self._closed = False

    def prewarm(self) -> None:
        """Reserve at most one preparation slot without blocking a request."""
        with self._lock:
            if self._closed or self._ready is not None or self._reservation is not None:
                return
            reservation = self._reservation = object()
            thread = threading.Thread(target=self._prepare, args=(reservation,), daemon=True)
            self._preparation = thread
            try:
                thread.start()
            except RuntimeError:
                self._reservation = None
                self._preparation = None

    def _prepare(self, reservation: object) -> None:
        process = None
        timer = None
        try:
            process = self._start(True)
            with self._lock:
                if self._closed or self._reservation is not reservation:
                    return
                self._starting = process
                if self._preparation_timeout is not None:
                    timer = threading.Timer(self._preparation_timeout, self._preparation_expired,
                                            args=(process, reservation))
                    timer.daemon = True
                    timer.start()
            prepared = process.stdout.readline() == b"READY\n" and process.poll() is None
            with self._lock:
                if self._reservation is reservation:
                    self._reservation = None
                    self._starting = None
                if prepared and not self._closed:
                    self._ready = process
                    if self._idle_timeout is not None:
                        self._expiration = threading.Timer(self._idle_timeout, self._expire, args=(process,))
                        self._expiration.daemon = True
                        self._expiration.start()
                    process = None  # The idle slot now owns the process.
        except Exception:
            pass  # Failed preparation must not prevent cold execution.
        finally:
            if timer is not None:
                timer.cancel()
            with self._lock:
                if self._reservation is reservation:
                    self._reservation = None
                    self._starting = None
            _dispose(process)

    def _preparation_expired(self, process: subprocess.Popen, reservation: object) -> None:
        with self._lock:
            if self._reservation is reservation and self._starting is process:
                _kill(process)

    def _expire(self, process: subprocess.Popen) -> None:
        with self._lock:
            # A cancelled timer may already be running. It cannot retire a
            # leased process or a replacement idle process.
            if self._ready is not process:
                return
            self._ready = None
            self._expiration = None
        _dispose(process)

    @contextmanager
    def worker(self) -> Iterator[subprocess.Popen]:
        """Transfer one ready worker, or start cold; always reap it on exit."""
        with self._lock:
            if self._closed:
                raise RuntimeError("Worker pool is closed.")
            process, self._ready = self._ready, None
            if self._expiration is not None:
                self._expiration.cancel()
                self._expiration = None
        self.prewarm()
        if process is not None and process.poll() is not None:
            _dispose(process)
            process = None
        if process is None:
            process = self._start(False)
        try:
            yield process
        finally:
            _dispose(process)

    def close(self) -> None:
        """Reject new leases and retire idle/preparing work; leases stay owned."""
        with self._lock:
            self._closed = True
            ready, self._ready = self._ready, None
            starting = self._starting
            preparation = self._preparation
            if self._expiration is not None:
                self._expiration.cancel()
                self._expiration = None
        if starting is not None:
            _kill(starting)  # Its preparation thread owns the read and cleanup.
        _dispose(ready)
        if preparation is not None and preparation is not threading.current_thread():
            preparation.join(timeout=2)
