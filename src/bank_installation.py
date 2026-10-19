"""Recoverable publication of challenge banks, with explicit path ownership.

All readers and writers use the same file lock. A prepared journal describes
the previous files; an interrupted publication rolls back on the next access.
A committed marker distinguishes successful publication from failed cleanup.
"""
from __future__ import annotations

from contextlib import contextmanager
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from functools import lru_cache
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from uuid import uuid4

from src.bank_manager import sync_bundled_python, sync_bundled_sql, sync_bundled_constructor, sync_bundled_capstones
from src.json_validator import validate_bank


@dataclass(frozen=True)
class BankPaths:
    active: Path
    source: Path
    report: Path
    imports: Path
    versions: Path


@dataclass(frozen=True)
class InstalledBank:
    bank: dict
    report: dict
    import_archive: Path | None = None
    previous_archives: tuple[Path, ...] = ()


class BankInstallationError(RuntimeError):
    pass


def _encoded(value: dict) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


@lru_cache(maxsize=8)
def _decoded(payload: bytes) -> dict:
    return json.loads(payload)


@lru_cache(maxsize=8)
def _upgrade(active: bytes, bundled: bytes) -> tuple[dict, dict]:
    current = _decoded(active)
    shipped = _decoded(bundled)
    return validate_bank(sync_bundled_capstones(sync_bundled_constructor(sync_bundled_python(sync_bundled_sql(current, shipped), shipped), shipped), shipped))


def _sync_directory(path: Path) -> None:
    if os.name != "nt":
        descriptor = os.open(path, os.O_RDONLY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)


def _write(path: Path, payload: bytes) -> None:
    """Replace one file using a flushed temporary file on its own filesystem."""
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
        _sync_directory(path.parent)
    finally:
        try:
            Path(temporary).unlink(missing_ok=True)
        except OSError:
            pass


class BankInstallation:
    def __init__(self, paths: BankPaths):
        self.paths = BankPaths(*(Path(getattr(paths, key)).resolve()
                                 for key in ("active", "source", "report", "imports", "versions")))
        if self.paths.report in (self.paths.active, self.paths.source):
            raise ValueError("The validation report must have its own file path")
        self._targets = {"source": self.paths.source, "bank": self.paths.active, "report": self.paths.report}
        self._journal = self.paths.active.with_name(f".{self.paths.active.name}.install")
        self._lock_path = self.paths.active.with_name(f".{self.paths.active.name}.install.lock")

    @contextmanager
    def _locked(self):
        self._lock_path.parent.mkdir(parents=True, exist_ok=True)
        with self._lock_path.open("a+b") as stream:
            if os.name == "nt":
                import msvcrt
                stream.seek(0, os.SEEK_END)
                if stream.tell() == 0:
                    stream.write(b"\0")
                    stream.flush()
                stream.seek(0)
                msvcrt.locking(stream.fileno(), msvcrt.LK_LOCK, 1)
            else:
                import fcntl
                fcntl.flock(stream.fileno(), fcntl.LOCK_EX)
            try:
                yield
            finally:
                if os.name == "nt":
                    stream.seek(0)
                    msvcrt.locking(stream.fileno(), msvcrt.LK_UNLCK, 1)
                else:
                    fcntl.flock(stream.fileno(), fcntl.LOCK_UN)

    def _cleanup(self) -> None:
        # Delete only the dedicated journal next to this exact active bank.
        expected = self.paths.active.parent / f".{self.paths.active.name}.install"
        if self._journal.is_symlink() or self._journal.resolve() != expected:
            raise BankInstallationError("Unsafe installation journal path")
        # Retire recovery before deleting any backup or commit marker. A
        # partially removed directory must never look like a prepared install.
        (self._journal / "manifest.json").unlink(missing_ok=True)
        _sync_directory(self._journal)
        shutil.rmtree(self._journal)
        _sync_directory(self._journal.parent)

    def _recover(self) -> bool:
        if not self._journal.exists():
            return False
        if self._journal.is_symlink():
            raise BankInstallationError("Unsafe installation journal path")
        manifest_path = self._journal / "manifest.json"
        if not manifest_path.exists():
            # Either preparation never reached publication, or recovery was
            # retired after a commit/rollback. In both cases live files are safe.
            try:
                self._cleanup()
            except OSError:
                pass
            return False
        manifest = json.loads(manifest_path.read_bytes())
        configured = {key: str(path) for key, path in self._targets.items()}
        if manifest.get("version") != 1 or manifest.get("paths") != configured:
            raise BankInstallationError("Pending installation uses different paths; restore its configuration before recovery")
        if (self._journal / "committed").exists():
            try:
                self._cleanup()
            except OSError:
                pass  # Committed files are readable; a new install must wait.
            return False
        entries = manifest.get("entries")
        if not isinstance(entries, list) or not entries:
            raise BankInstallationError("Invalid installation recovery journal")
        backups = []
        seen = set()
        # Check every backup before changing any live file.
        for index, entry in enumerate(entries):
            if not isinstance(entry, dict):
                raise BankInstallationError("Invalid installation recovery target")
            role = entry.get("role")
            if role not in self._targets or self._targets[role] in seen or type(entry.get("existed")) is not bool:
                raise BankInstallationError("Invalid installation recovery target")
            seen.add(self._targets[role])
            payload = (self._journal / f"{index}.before").read_bytes() if entry["existed"] else None
            if payload is not None and hashlib.sha256(payload).hexdigest() != entry.get("sha256"):
                raise BankInstallationError("Installation backup is damaged; recovery files were preserved")
            backups.append((self._targets[role], payload))
        for path, payload in backups:
            if payload is None:
                path.unlink(missing_ok=True)
                if path.parent.exists():
                    _sync_directory(path.parent)
            else:
                _write(path, payload)
        self._cleanup()
        return True

    def recover(self) -> bool:
        """Restore the last complete bank after an interrupted publication."""
        with self._locked():
            return self._recover()

    def _publish(self, contents: dict[str, bytes]) -> None:
        if self._journal.exists():
            raise BankInstallationError("Previous installation cleanup is pending; retry after restoring file access")
        # Source and active may intentionally be the same file. The normalized
        # bank wins that alias and is backed up/published exactly once.
        targets = {}
        for role in ("source", "bank", "report"):
            if role in contents:
                targets[self._targets[role]] = (role, contents[role])
        self._journal.mkdir()
        entries = []
        try:
            for index, (path, (role, payload)) in enumerate(targets.items()):
                before = path.read_bytes() if path.exists() else None
                if before is not None:
                    _write(self._journal / f"{index}.before", before)
                _write(self._journal / f"{index}.after", payload)
                entries.append({"role": role, "existed": before is not None,
                                "sha256": hashlib.sha256(before).hexdigest() if before is not None else None})
            _write(self._journal / "manifest.json", _encoded({
                "version": 1, "paths": {key: str(path) for key, path in self._targets.items()},
                "entries": entries,
            }))
            for index, path in enumerate(targets):
                _write(path, (self._journal / f"{index}.after").read_bytes())
            _write(self._journal / "committed", b"committed\n")
        except Exception:
            try:
                self._recover()
            except Exception as recovery_error:
                raise BankInstallationError("Installation failed and recovery is pending. Restore file access and retry; recovery files were preserved") from recovery_error
            raise
        try:
            self._cleanup()
        except OSError:
            pass  # Publication committed; cleanup can finish on the next access.

    def _archives(self, payload: bytes | None = None, name: str = "questions.json") -> tuple[Path | None, tuple[Path, ...]]:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + "_" + uuid4().hex
        imported = None
        if payload is not None:
            safe = re.sub(r"[^A-Za-z0-9._-]+", "_", Path(name).name).strip("._")[:100] or "questions.json"
            imported = self.paths.imports / f"{stamp}_{safe}"
            _write(imported, payload)
        previous = []
        for role, path in {"active": self.paths.active, "source": self.paths.source}.items():
            if role == "source" and path == self.paths.active:
                continue
            if path.exists():
                archived = self.paths.versions / f"{stamp}_{role}_bank.json"
                _write(archived, path.read_bytes())
                previous.append(archived)
        return imported, tuple(previous)

    def load(self, bundled: Path | None = None) -> InstalledBank:
        """Recover first, bootstrap or upgrade if needed, then read one snapshot.

        Parsing and upgrade computation are cached by file contents; filesystem
        reads and recovery always occur under the lock, including warm loads.
        """
        with self._locked():
            self._recover()
            if not self.paths.active.exists():
                source = self.paths.source if self.paths.source.exists() else bundled
                if source is None or not source.exists():
                    raise FileNotFoundError("Working challenge bank is missing")
                payload = source.read_bytes()
                bank, report = validate_bank(_decoded(payload))
                contents = {"bank": _encoded(bank), "report": _encoded(report)}
                if not self.paths.source.exists():
                    contents["source"] = payload
                self._publish(contents)
                return InstalledBank(bank, report)
            active = self.paths.active.read_bytes()
            bank = deepcopy(_decoded(active))
            if bundled is not None and bundled.exists() and bundled.resolve() != self.paths.active:
                updated, report = deepcopy(_upgrade(active, bundled.read_bytes()))
                if updated != bank:
                    _, previous = self._archives()
                    self._publish({"source": _encoded(updated), "bank": _encoded(updated), "report": _encoded(report)})
                    return InstalledBank(updated, report, previous_archives=previous)
            try:
                report = deepcopy(_decoded(self.paths.report.read_bytes()))
            except (FileNotFoundError, json.JSONDecodeError, UnicodeDecodeError):
                report = None
            if not isinstance(report, dict) or "valid_challenges" not in report:
                _, report = validate_bank(bank)
                self._publish({"report": _encoded(report)})
            return InstalledBank(bank, report)

    def install(self, candidate: dict, *, expected_bank: dict,
                import_payload: bytes, import_name: str) -> InstalledBank:
        """Publish a reviewed candidate only if its current-bank snapshot holds.

        Original import bytes and prior files are archived before publication.
        Existing progress is outside this module and is never changed here.
        """
        bank, report = validate_bank(candidate)
        if (report["duplicate_ids"] or report["valid_challenges"] != len(bank["challenges"])
                or any(issue["kind"] == "rubric_total" for issue in report["issues"])):
            raise ValueError("Resolve invalid challenges, IDs and rubrics before installing this bank")
        with self._locked():
            self._recover()
            current = _decoded(self.paths.active.read_bytes())
            if current != expected_bank:
                raise BankInstallationError("The challenge bank changed after review. Reload and review the import again.")
            by_id = {challenge["id"]: challenge for challenge in bank["challenges"]}
            if any(by_id.get(challenge["id"]) != challenge for challenge in current["challenges"]):
                raise ValueError("Reviewed imports must preserve existing challenges")
            imported, previous = self._archives(import_payload, import_name)
            self._publish({"source": _encoded(bank), "bank": _encoded(bank), "report": _encoded(report)})
            return InstalledBank(bank, report, imported, previous)
