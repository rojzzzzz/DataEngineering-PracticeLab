import json
from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

from src.authoring import MODES, authoring_prompt, example_package, parse_package
from src.json_validator import validate_bank

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
def bank():
    return json.loads((ROOT / "data/challenges.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("mode", MODES)
def test_every_format_has_a_valid_self_contained_prompt(bank, mode):
    original = json.dumps(bank)
    package = example_package(bank, mode)
    _, report = validate_bank(package)
    assert report["valid_challenges"] == (6 if mode == "Connected Capstone" else 1)
    prompt = authoring_prompt(bank, mode)
    assert "[TOPIC]" in prompt and "NAMING CONTRACT" in prompt
    assert "generate a fresh 12-character" not in prompt
    assert json.dumps(package, ensure_ascii=False, indent=2) in prompt
    assert json.dumps(bank) == original


@pytest.mark.parametrize("wrapper", ["{}", "```json\n{}\n```", "\ufeff{}"])
def test_pasted_and_uploaded_json(bank, wrapper):
    package = example_package(bank, "Written practice")
    text = wrapper.format(json.dumps(package))
    assert parse_package(text) == package
    assert parse_package(text.encode("utf-8")) == package


@pytest.mark.parametrize("text", ["Here is your JSON: {}", "[]", '{"challenges":[]}', "x" * (8 * 1024 * 1024 + 1)], ids=["prose", "array", "empty", "oversized"])
def test_invalid_imports_are_rejected(text):
    with pytest.raises(ValueError):
        parse_package(text)


def test_mixed_formats_and_wrong_python_answers_identify_the_exercise(bank):
    package = example_package(bank, "Python Practice")
    challenge = package["challenges"][0]
    challenge["sql_playground"] = {}
    with pytest.raises(ValueError, match="Challenge PY-.*Choose one"):
        validate_bank(package)
    del challenge["sql_playground"]
    from scripts.build_python_pilot import pilot
    challenge["python_playground"] = pilot()["python_playground"]
    challenge["python_playground"]["cases"][0]["expected"] = -123
    with pytest.raises(ValueError, match="Challenge PY-.*expected"):
        validate_bank(package)


@pytest.mark.parametrize("mode", ["Written practice", "Python Practice"])
def test_prompt_paste_preview_and_append_flow(bank, tmp_path, monkeypatch, mode):
    from src import bank_manager, config

    path = tmp_path / "challenges.json"
    path.write_text(json.dumps(bank), encoding="utf-8")
    for name, value in {
        "DB_PATH": tmp_path / "practice.db", "SOURCE_PATH": path,
        "CHALLENGES_PATH": path, "VALIDATION_REPORT_PATH": tmp_path / "report.json",
        "IMPORTS_DIR": tmp_path / "imports", "VERSIONS_DIR": tmp_path / "versions",
    }.items():
        monkeypatch.setattr(config, name, value)
        if hasattr(bank_manager, name):
            monkeypatch.setattr(bank_manager, name, value)
    import streamlit as st
    st.cache_data.clear()  # Each parameter uses a separate temporary bank/database.
    app = AppTest.from_file(str(ROOT / "app.py"), default_timeout=25).run()
    app.sidebar.radio[0].set_value("Challenge Bank").run()
    assert not app.exception
    next(w for w in app.selectbox if w.label == "Exercise format").set_value(mode).run()
    next(w for w in app.number_input if w.label == "Exercise count").set_value(1).run()
    next(w for w in app.text_input if w.label == "Topic").set_value("Warehouse design").run()
    assert "Topic: Warehouse design" in app.code[0].value
    next(w for w in app.radio if w.label == "Import method").set_value("Paste JSON").run()
    field = next(w for w in app.text_area if w.label == "Paste the AI's JSON response")
    field.set_value("bad JSON").run()
    assert app.error and any("ORIGINAL PACKAGE" in w.value for w in app.code)
    package = example_package(bank, mode)
    if mode == "Python Practice":
        from src import python_runner
        from src.python_models import fingerprint
        exercise = package["challenges"][0]["python_playground"]
        job = {"id": "validation-test", "operation": "validate_exercise", "state": "finished",
               "exercise_hash": fingerprint(exercise), "runner_hash": "a" * 64,
               "result": {"ok": True, "passed": True}}
        monkeypatch.setattr(python_runner, "health", lambda: {"ready": True, "runner_hash": "a" * 64})
        monkeypatch.setattr(python_runner, "validate", lambda exercise: job)
        monkeypatch.setattr(python_runner, "poll", lambda job_id: job)
    field = next(w for w in app.text_area if w.label == "Paste the AI's JSON response")
    field.set_value(json.dumps(package)).run()
    assert not app.exception
    assert any(w.label == "Preview an added exercise" for w in app.selectbox), [w.value for w in app.error]
    if mode == "Python Practice":
        assert next(w for w in app.button if w.label == "Append exercises").disabled
        next(w for w in app.button if w.label == "Validate Python exercises").click().run()
        assert not app.exception
        assert not next(w for w in app.button if w.label == "Append exercises").disabled
    next(w for w in app.button if w.label == "Append exercises").click().run()
    assert not app.exception
    saved = json.loads(path.read_text(encoding="utf-8"))
    assert len(saved["challenges"]) == len(bank["challenges"]) + 1
    assert saved["challenges"][:-1] == bank["challenges"]
    assert list((tmp_path / "imports").iterdir())
    assert list((tmp_path / "versions").iterdir())
