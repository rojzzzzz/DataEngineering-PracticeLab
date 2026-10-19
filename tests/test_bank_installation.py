"""Challenge-bank installation through its interface and real temporary files."""
from copy import deepcopy
import json
import os
from pathlib import Path

import pytest

from src.bank_installation import BankInstallation, BankPaths


def bank(cid="CUSTOM-1"):
    return {"bank": {"challenge_count": 1}, "rubrics": {"model": {"correctness": 100}},
            "prompt_templates": {"student": "s", "hint": "h", "evaluation": "e"},
            "challenges": [{"id": cid, "title": cid, "type": "MODEL", "difficulty": 2,
                            "estimated_minutes": 15, "rubric_ref": "model",
                            "student": {"scenario": "Scenario", "requirements": [], "tasks": [],
                                        "constraints": [], "deliverables": []}}]}


@pytest.fixture
def installation(tmp_path):
    paths = BankPaths(active=tmp_path / "active.json", source=tmp_path / "source.json",
                      report=tmp_path / "report.json", imports=tmp_path / "imports",
                      versions=tmp_path / "versions")
    paths.active.write_text(json.dumps(bank()), encoding="utf-8")
    paths.source.write_text(json.dumps(bank(), indent=4), encoding="utf-8")
    installer = BankInstallation(paths)
    return installer, paths


def test_install_publishes_a_matching_bank_and_report_and_archives_originals(installation):
    installer, paths = installation
    previous = installer.load().bank
    old_source = paths.source.read_bytes()
    old_active = paths.active.read_bytes()
    candidate = deepcopy(previous)
    candidate["challenges"].append(bank("CUSTOM-2")["challenges"][0])
    payload = b'```json\n{"original":"exact imported bytes"}\n```'
    result = installer.install(candidate, expected_bank=previous,
                               import_payload=payload, import_name="../../questions.json")
    loaded = BankInstallation(paths).load()
    assert [c["id"] for c in loaded.bank["challenges"]] == ["CUSTOM-1", "CUSTOM-2"]
    assert loaded.report == result.report
    assert loaded.report["normalized_challenge_count"] == 2
    assert json.loads(paths.source.read_bytes()) == loaded.bank
    assert result.import_archive.read_bytes() == payload
    assert result.import_archive.parent == paths.imports
    assert {p.read_bytes() for p in result.previous_archives} == {old_source, old_active}


def appended(previous, cid="CUSTOM-2"):
    result = deepcopy(previous)
    result["challenges"].append(bank(cid)["challenges"][0])
    return result


def publish(installer, previous, cid="CUSTOM-2"):
    return installer.install(appended(previous, cid), expected_bank=previous,
                             import_payload=b"original import", import_name="questions.json")


@pytest.mark.parametrize("failed_role", ["source", "active", "report"])
def test_write_failure_restores_all_previous_files(installation, monkeypatch, failed_role):
    installer, paths = installation
    previous = installer.load().bank
    before = {p: p.read_bytes() for p in (paths.active, paths.source, paths.report)}
    replace = os.replace
    failed = False

    def interrupted(source, target):
        nonlocal failed
        if Path(target) == getattr(paths, failed_role) and not failed:
            failed = True
            raise OSError("Disk unavailable")
        return replace(source, target)

    monkeypatch.setattr(os, "replace", interrupted)
    with pytest.raises(OSError, match="Disk unavailable"):
        publish(installer, previous)
    assert {p: p.read_bytes() for p in before} == before
    assert BankInstallation(paths).load().bank == previous


def test_process_interruption_recovers_before_the_next_read(installation, monkeypatch):
    installer, paths = installation
    previous = installer.load().bank
    before = {p: p.read_bytes() for p in (paths.active, paths.source, paths.report)}
    replace = os.replace

    def power_loss(source, target):
        if Path(target) == paths.report:
            raise SystemExit("Simulated interruption")
        return replace(source, target)

    with monkeypatch.context() as patch:
        patch.setattr(os, "replace", power_loss)
        with pytest.raises(SystemExit):
            publish(installer, previous)
    assert json.loads(paths.active.read_bytes()) != previous
    assert BankInstallation(paths).load().bank == previous
    assert {p: p.read_bytes() for p in before} == before


def test_failed_rollback_remains_recoverable(installation, monkeypatch):
    installer, paths = installation
    previous = installer.load().bank
    replace = os.replace
    failed = False

    def unavailable(source, target):
        nonlocal failed
        if Path(target) == paths.report:
            failed = True
            raise OSError("Report unavailable")
        if failed and Path(target) == paths.active:
            raise OSError("Rollback temporarily unavailable")
        return replace(source, target)

    with monkeypatch.context() as patch:
        patch.setattr(os, "replace", unavailable)
        with pytest.raises(RuntimeError, match="recovery is pending"):
            publish(installer, previous)
    assert BankInstallation(paths).load().bank == previous
    assert not BankInstallation(paths).recover()


def test_committed_install_is_not_rolled_back_when_cleanup_was_interrupted(installation, monkeypatch):
    import shutil
    installer, paths = installation
    previous = installer.load().bank

    def cannot_cleanup(*args):
        raise OSError("Directory busy")

    with monkeypatch.context() as patch:
        patch.setattr(shutil, "rmtree", cannot_cleanup)
        published = publish(installer, previous)
        assert BankInstallation(paths).load().bank == published.bank
    assert BankInstallation(paths).load().bank == published.bank
    assert not BankInstallation(paths).recover()


def test_partial_cleanup_cannot_turn_a_committed_install_into_a_rollback(installation, monkeypatch):
    import shutil
    installer, paths = installation
    previous = installer.load().bank

    def partial_cleanup(directory):
        # Directory traversal may delete the marker before failing on another file.
        (Path(directory) / "committed").unlink(missing_ok=True)
        raise OSError("Interrupted cleanup")

    with monkeypatch.context() as patch:
        patch.setattr(shutil, "rmtree", partial_cleanup)
        result = publish(installer, previous)
    loaded = BankInstallation(paths).load()
    assert loaded.bank == result.bank
    assert loaded.report == result.report


def test_stale_review_cannot_replace_a_newer_bank(installation):
    installer, paths = installation
    reviewed = installer.load().bank
    successful = publish(installer, reviewed)
    with pytest.raises(RuntimeError, match="changed after review"):
        publish(installer, reviewed, "CUSTOM-3")
    assert BankInstallation(paths).load().bank == successful.bank


def test_archive_failure_does_not_replace_live_files(installation):
    installer, paths = installation
    previous = installer.load().bank
    paths.imports.write_text("An existing file blocks this archive directory")
    before = {p: p.read_bytes() for p in (paths.active, paths.source, paths.report)}
    with pytest.raises(OSError):
        publish(installer, previous)
    assert {p: p.read_bytes() for p in before} == before


@pytest.mark.parametrize("bad", ["duplicate", "difficulty", "rubric"])
def test_invalid_reviewed_candidate_never_starts_installation(installation, bad):
    installer, paths = installation
    previous = installer.load().bank
    candidate = deepcopy(previous)
    if bad == "duplicate":
        candidate["challenges"].append(deepcopy(candidate["challenges"][0]))
    elif bad == "difficulty":
        candidate["challenges"][0]["difficulty"] = 9
    else:
        candidate["rubrics"]["model"] = {"correctness": 90}
    with pytest.raises(ValueError):
        installer.install(candidate, expected_bank=previous, import_payload=b"bad", import_name="bad.json")
    assert installer.load().bank == previous
    assert not paths.imports.exists() and not paths.versions.exists()


def test_source_and_active_can_alias_the_same_file(installation):
    _, paths = installation
    paths = BankPaths(paths.active, paths.active, paths.report, paths.imports, paths.versions)
    installer = BankInstallation(paths)
    previous = installer.load().bank
    result = publish(installer, previous)
    assert len(result.previous_archives) == 1
    assert BankInstallation(paths).load().bank == result.bank


def test_bootstrap_prefers_existing_custom_source_and_preserves_its_bytes(installation, tmp_path):
    installer, paths = installation
    paths.active.unlink()
    original = paths.source.read_bytes()
    shipped = tmp_path / "bundled.json"
    shipped.write_text(json.dumps(bank("BUNDLED-1")), encoding="utf-8")
    loaded = installer.load(shipped)
    assert loaded.bank["challenges"][0]["id"] == "CUSTOM-1"
    assert paths.source.read_bytes() == original
    assert loaded.report["valid_challenges"] == 1


def test_bootstrap_uses_the_bundle_when_no_working_files_exist(installation, tmp_path):
    installer, paths = installation
    paths.active.unlink()
    paths.source.unlink()
    shipped = tmp_path / "bundled.json"
    shipped.write_text(json.dumps(bank("BUNDLED-1")), encoding="utf-8")
    loaded = installer.load(shipped)
    assert loaded.bank["challenges"][0]["id"] == "BUNDLED-1"
    assert json.loads(paths.active.read_bytes()) == loaded.bank
    assert paths.source.exists() and paths.report.exists()


def test_two_reviewed_imports_cannot_silently_overwrite_each_other(installation):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier
    installer, paths = installation
    previous = installer.load().bank
    ready = Barrier(2)

    def concurrent(cid):
        ready.wait()
        try:
            return publish(BankInstallation(paths), previous, cid).bank
        except RuntimeError as exc:
            assert "changed after review" in str(exc)
            return None

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(concurrent, ["CUSTOM-2", "CUSTOM-3"]))
    assert sum(result is not None for result in results) == 1
    assert installer.load().bank == next(result for result in results if result is not None)


def test_reviewed_install_cannot_drop_or_replace_existing_custom_questions(installation):
    installer, paths = installation
    previous = installer.load().bank
    for candidate in (bank("REPLACEMENT-1"), deepcopy(previous)):
        if candidate["challenges"][0]["id"] == "CUSTOM-1":
            candidate["challenges"][0]["title"] = "Unexpected replacement"
        with pytest.raises(ValueError, match="existing challenges"):
            installer.install(candidate, expected_bank=previous, import_payload=b"replacement", import_name="bad.json")
    assert installer.load().bank == previous
    assert not paths.imports.exists()


@pytest.mark.parametrize("payload", [b"{broken JSON", b"[]"])
def test_loading_repairs_a_damaged_report_without_replacing_custom_bank(installation, payload):
    installer, paths = installation
    original = paths.active.read_bytes()
    paths.report.write_bytes(payload)
    loaded = installer.load()
    assert loaded.report["valid_challenges"] == 1
    assert json.loads(paths.report.read_bytes()) == loaded.report
    assert paths.active.read_bytes() == original


def test_interrupted_first_install_removes_new_live_files_during_recovery(installation, tmp_path, monkeypatch):
    installer, paths = installation
    paths.active.unlink()
    paths.source.unlink()
    bundled = tmp_path / "bundled.json"
    bundled.write_text(json.dumps(bank("BUNDLED-1")), encoding="utf-8")
    replace = os.replace

    def power_loss(source, target):
        if Path(target) == paths.report:
            raise SystemExit()
        return replace(source, target)

    with monkeypatch.context() as patch:
        patch.setattr(os, "replace", power_loss)
        with pytest.raises(SystemExit):
            installer.load(bundled)
    assert paths.active.exists()
    assert BankInstallation(paths).recover()
    assert not paths.active.exists() and not paths.source.exists() and not paths.report.exists()


def test_bundled_upgrade_preserves_custom_questions_and_archives_only_once(installation, tmp_path):
    installer, paths = installation
    custom = installer.load().bank["challenges"][0]
    bundled = tmp_path / "bundled.json"
    bundled.write_bytes((Path(__file__).resolve().parents[1] / "data/challenges.json").read_bytes())
    loaded = installer.load(bundled)
    assert next(c for c in loaded.bank["challenges"] if c["id"] == "CUSTOM-1") == custom
    assert any(c.get("sql_playground") for c in loaded.bank["challenges"])
    assert any(c.get("python_playground") for c in loaded.bank["challenges"])
    assert loaded.previous_archives
    archives = list(paths.versions.iterdir())
    assert installer.load(bundled).bank == loaded.bank
    assert list(paths.versions.iterdir()) == archives


def test_cached_parsing_never_shares_mutable_bank_or_report_state(installation):
    installer, paths = installation
    loaded = installer.load()
    loaded.bank["challenges"][0]["title"] = "Changed in memory"
    loaded.report["valid_challenges"] = -1
    reopened = BankInstallation(paths).load()
    assert reopened.bank["challenges"][0]["title"] == "CUSTOM-1"
    assert reopened.report["valid_challenges"] == 1
