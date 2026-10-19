from copy import deepcopy
import json
from pathlib import Path

import pytest

from src.authoring import MODES, authoring_prompt, example_package, repair_prompt
from src.authoring_catalog import allocate_ids, exercise_format, normalize_generated_package, remap_package
from src.bank_manager import prepare_append
from src.json_validator import validate_bank


@pytest.fixture
def bank():
    return json.loads((Path(__file__).resolve().parents[1] / "data/challenges.json").read_text(encoding="utf-8"))


def generated(bank, mode, **options):
    package = example_package(bank, mode, **options)
    prefix = package["challenges"][0]["id"].split("-", 1)[0]
    package["authoring"] = {"version": 1, "format": mode, "family": prefix, "count": 1}
    if mode == "Diagram":
        package["authoring"]["diagram_kind"] = options.get("diagram_kind", "conceptual_erd")
    if mode == "Repair exercise":
        package["authoring"]["repair_tool"] = options.get("repair_tool", "diagram")
    return package


def test_sequences_ignore_legacy_batches_and_extend_beyond_three_digits():
    bank = {"challenges": [{"id": cid} for cid in ("SQL-999", "SQL-ABCDEF-001", "PY-6000", "SQL-003")]}
    assert allocate_ids(bank, "SQL", 2) == ["SQL-1000", "SQL-1001"]
    with pytest.raises(ValueError):
        allocate_ids(bank, "ANYTHING", 1)


def test_append_indexes_generated_topics_without_optional_metadata(bank):
    from src.authoring_ui import prepare_package
    package = generated(bank, "Written practice")
    package["bank"].pop("topic_index", None)
    package["challenges"][0]["internal"]["topics"] = ["new_imported_topic"]
    original = deepcopy(bank)
    candidate, _, normalized, _ = prepare_package(bank, package)
    assert candidate["bank"]["topic_index"]["new_imported_topic"] == [normalized["challenges"][0]["id"]]
    assert bank == original


@pytest.mark.parametrize("mode", MODES)
def test_all_new_formats_round_trip_with_naming_contract(bank, mode):
    package = generated(bank, mode)
    original = deepcopy(bank)
    normalized, changes = normalize_generated_package(bank, package)
    _, report = validate_bank(normalized)
    assert report["valid_challenges"] == len(normalized["challenges"])
    assert all(exercise_format(c) == mode for c in normalized["challenges"])
    assert bank == original
    assert package == generated(bank, mode)
    prompt = authoring_prompt(bank, mode, "Subscription logistics", count=1, audience="Junior engineers", edge_cases="Late arrivals")
    assert '"format": "' + mode + '"' in prompt
    assert normalized["challenges"][0]["id"] in prompt
    assert "Late arrivals" in prompt and "Junior engineers" in prompt
    assert "EXERCISE QUALITY" in prompt and "not a reservation" in prompt


@pytest.mark.parametrize("tool", ["diagram", "pipeline", "mock", "sql"])
def test_repair_options_have_native_public_starters(bank, tool):
    package = generated(bank, "Repair exercise", repair_tool=tool)
    normalized, _ = normalize_generated_package(bank, package)
    slots = normalized["challenges"][0]["constructor_tasks"]["slots"]
    repair = next(s for s in slots if s.get("requires_changes"))
    assert repair["tool"] == tool and repair["required"] and repair["starter"]
    assert not repair["starter"].get("generation") and not repair["starter"].get("results")


@pytest.mark.parametrize("kind,prefix", [("conceptual_erd", "CM"), ("logical_erd", "LM"), ("star_schema", "DM")])
def test_diagram_kinds_choose_subject_families(bank, kind, prefix):
    package = generated(bank, "Diagram", diagram_kind=kind)
    normalized, _ = normalize_generated_package(bank, package)
    assert normalized["challenges"][0]["id"].startswith(prefix + "-")


def test_rerun_is_deterministic_and_installed_bank_controls_ids_not_template(bank):
    installed = deepcopy(bank)
    installed["challenges"].append({**deepcopy(bank["challenges"][0]), "id": "SCN-075"})
    prompt = authoring_prompt(installed, "Written practice", "Logistics", examples=bank)
    assert '["SCN-076", "SCN-077", "SCN-078"]' in prompt
    assert prompt == authoring_prompt(installed, "Written practice", "Logistics", examples=bank)


def test_import_after_another_append_updates_all_references_and_not_prose(bank):
    package = generated(bank, "Connected Capstone")
    ids = [c["id"] for c in package["challenges"]]
    package["challenges"][0]["student"]["scenario"] += " Literal identifier " + ids[0]
    package["bank"].update(learning_paths=[{"name": "Generated path", "challenges": ids}],
        topic_index={"testing": ids}, prerequisite_graph={ids[1]: [ids[0]]})
    installed = deepcopy(bank)
    installed["challenges"].append({**deepcopy(bank["challenges"][0]), "id": "CAP-020"})
    installed["capstones"].append({"id": "cap-021"})
    original = deepcopy(package)
    normalized, changes = normalize_generated_package(installed, package)
    new_ids = [c["id"] for c in normalized["challenges"]]
    assert new_ids == [f"CAP-{n:03d}" for n in range(21, 27)]
    assert normalized["capstones"][0]["id"] == "cap-021-2"
    assert [s["challenge_id"] for s in normalized["capstones"][0]["stages"]] == new_ids
    assert normalized["bank"]["learning_paths"][0]["challenges"] == new_ids
    assert normalized["bank"]["topic_index"]["testing"] == new_ids
    assert normalized["bank"]["prerequisite_graph"] == {new_ids[1]: [new_ids[0]]}
    assert ids[0] in normalized["challenges"][0]["student"]["scenario"]
    assert len([r for r in changes if r["Kind"] == "Exercise"]) == 6
    assert package == original
    assert validate_bank(normalized)[1]["valid_challenges"] == 6


def test_existing_rubrics_are_never_replaced(bank):
    package = generated(bank, "Written practice")
    installed = deepcopy(bank)
    installed["rubrics"]["practice_scn_009_1"] = {"custom": 100}
    normalized, changes = normalize_generated_package(installed, package)
    assert normalized["challenges"][0]["rubric_ref"] == "practice_scn_009_1-2"
    combined, _ = prepare_append(installed, normalized)
    assert combined["rubrics"]["practice_scn_009_1"] == {"custom": 100}
    assert combined["challenges"][:len(bank["challenges"])] == bank["challenges"]


@pytest.mark.parametrize("change,error", [
    (lambda p: p["authoring"].update(count=2), "Expected 2"),
    (lambda p: p["authoring"].update(family="PY"), "family"),
    (lambda p: p["authoring"].update(version=2), "contract"),
    (lambda p: p["challenges"][0].update(type="INVENTED"), "type"),
    (lambda p: p["challenges"][0].update(python_playground={"version": 2}), "format"),
])
def test_generated_contract_cannot_be_bypassed(bank, change, error):
    package = generated(bank, "Written practice")
    change(package)
    with pytest.raises(ValueError, match=error):
        normalize_generated_package(bank, package)


def test_legacy_imports_keep_their_names_and_collision_checks(bank):
    incoming = example_package(bank, "Written practice")
    incoming["challenges"][0]["id"] = bank["challenges"][0]["id"]
    same, changes = normalize_generated_package(bank, incoming)
    assert same == incoming and not changes
    with pytest.raises(ValueError, match="ID conflicts"):
        prepare_append(bank, same)


def test_model_to_recipe_and_sql_focus_options_have_matching_contracts(bank):
    package = generated(bank, "Mock data", mock_from_model=True)
    package["authoring"]["mock_from_model"] = True
    normalize_generated_package(bank, package)
    slots = package["challenges"][0]["constructor_tasks"]["slots"]
    assert {s["tool"] for s in slots} == {"diagram", "mock"}
    package["challenges"][0]["constructor_tasks"]["slots"] = [s for s in slots if s["tool"] != "diagram"]
    with pytest.raises(ValueError, match="logical model"):
        normalize_generated_package(bank, package)
    prompt = authoring_prompt(bank, "SQL Practice", exercise_type="CLEAN")
    assert '"type": "CLEAN"' in prompt


def test_multiple_connected_projects_keep_independent_stage_references(bank):
    first = generated(bank, "Connected Capstone")
    identities = {c["id"]: f"CAP-{i:03d}" for i, c in enumerate(first["challenges"], 7)}
    second = remap_package(first, identities, {"cap-001": "cap-007"})
    first["challenges"].extend(second["challenges"])
    first["capstones"].extend(second["capstones"])
    first["authoring"]["count"] = 2
    normalized, _ = normalize_generated_package(bank, first)
    assert validate_bank(normalized)[1]["valid_challenges"] == 12
    assert {d["id"] for d in normalized["capstones"]} == {"cap-001", "cap-007"}
    assert len({s["challenge_id"] for d in normalized["capstones"] for s in d["stages"]}) == 12
    assert "total stage briefs: 12" in authoring_prompt(bank, "Connected Capstone", count=2)


def test_repair_prompt_includes_the_imported_format_without_placeholders(bank):
    package = generated(bank, "Connected Capstone")
    prompt = repair_prompt("Missing stage reference", json.dumps(package))
    assert "six-stage graph" in prompt and "dataset_sql" in prompt
    assert "[PASTE_THE_ORIGINAL_AUTHORING_PROMPT]" not in prompt
