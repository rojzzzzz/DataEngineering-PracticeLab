"""Exercise formats, family conventions and review-time identity allocation.

Only incoming packages are renamed. Installed challenge IDs remain stable so
saved attempts, prerequisites and project runs keep their identities.
"""
from copy import deepcopy
import re

DEFAULT_FAMILIES = {
    "Written practice": "SCN", "Diagram": "CM", "SQL Practice": "SQL",
    "Data-quality Detective": "INC", "Python Practice": "PY", "Pipeline design": "ARCH",
    "Mock data": "MOCK", "SQL analysis": "SQL", "Repair exercise": "REP",
    "Integrated case study": "CASE", "Connected Capstone": "CAP",
}
MODES = tuple(DEFAULT_FAMILIES)

# A family describes the subject/deliverable, independently of its editor.
FAMILIES = {
    "SCN": ("Applied scenarios", ("DESIGN", "MODEL", "PIPELINE", "ARCH", "EVOLVE")),
    "CASE": ("End-to-end case studies", ("CASE",)),
    "DM": ("Dimensional modeling", ("MODEL",)),
    "NORM": ("Normalization", ("NORMALIZE",)),
    "ARCH": ("Architecture and pipelines", ("ARCH", "PIPELINE")),
    "INC": ("Incidents and investigations", ("INCIDENT",)),
    "GOV": ("Governance", ("GOVERN",)),
    "REV": ("Design reviews", ("REVIEW",)),
    "CM": ("Conceptual modeling", ("CONCEPTUAL",)),
    "LM": ("Logical and physical modeling", ("LOGICAL", "PHYSICAL")),
    "CLN": ("Data cleaning", ("CLEAN",)),
    "BIZ": ("Greenfield business design", ("GREENFIELD",)),
    "SQL": ("SQL practice and analysis", ("SQL", "CLEAN")),
    "PY": ("Python Practice", ("PYTHON",)),
    "MOCK": ("Synthetic data and reproducibility", ("MODEL",)),
    "REP": ("Repair exercises", ("MODEL",)),
    "CAP": ("Connected capstone stages", ("MODEL", "SQL")),
}
WRITTEN_FAMILIES = tuple(p for p in FAMILIES if p not in ("SQL", "PY", "MOCK", "REP", "CAP"))
DIAGRAM_FAMILIES = {"conceptual_erd": "CM", "logical_erd": "LM", "star_schema": "DM"}


def exercise_format(challenge):
    if challenge.get("capstone"):
        return "Connected Capstone"
    slots = challenge.get("constructor_tasks", {}).get("slots", [])
    if any(s.get("requires_changes") for s in slots):
        return "Repair exercise"
    if challenge.get("data_quality_detective"):
        return "Data-quality Detective"
    if challenge.get("sql_playground"):
        return "SQL Practice"
    if challenge.get("python_playground"):
        return "Python Practice"
    if challenge.get("diagram_kind"):
        return "Diagram"
    tools = {s.get("tool") for s in slots}
    if tools == {"pipeline"}:
        return "Pipeline design"
    if "mock" in tools and tools <= {"diagram", "mock"}:
        return "Mock data"
    if tools == {"sql"}:
        return "SQL analysis"
    if tools and tools <= {"diagram"}:
        return "Diagram"
    if len(tools) > 1:
        return "Integrated case study"
    return "Written practice"


def family_for(mode, family=None, diagram_kind="conceptual_erd"):
    if mode not in MODES:
        raise ValueError("Choose a supported exercise format.")
    expected = DIAGRAM_FAMILIES.get(diagram_kind) if mode == "Diagram" else DEFAULT_FAMILIES[mode]
    if expected is None:
        raise ValueError("Choose a supported diagram kind.")
    selected = family or expected
    if selected not in (WRITTEN_FAMILIES if mode == "Written practice" else (expected,)):
        raise ValueError("The exercise family does not match its format or diagram kind.")
    return selected


def allocate_ids(bank, prefix, count):
    if prefix not in FAMILIES or type(count) is not int or not 1 <= count <= 60:
        raise ValueError("Choose a known family and between 1 and 60 exercise IDs.")
    # Legacy batch IDs are retained, but do not distort the numeric sequence.
    pattern = re.compile(re.escape(prefix) + r"-([0-9]{3,})\Z")
    maximum = max((int(m[1]) for c in bank.get("challenges", [])
                   if (m := pattern.fullmatch(c.get("id", "")))), default=0)
    return [f"{prefix}-{number:03d}" for number in range(maximum + 1, maximum + count + 1)]


def available_name(base, occupied):
    value, suffix = base, 2
    while value in occupied:
        value, suffix = f"{base}-{suffix}", suffix + 1
    occupied.add(value)
    return value


def remap_package(source, identities, projects=None, rubrics=None):
    """Remap schema references, never arbitrary prose, SQL, or native element IDs."""
    package = deepcopy(source)
    projects, rubrics = projects or {}, rubrics or {}
    for challenge in package["challenges"]:
        challenge["id"] = identities.get(challenge["id"], challenge["id"])
        challenge["rubric_ref"] = rubrics.get(challenge["rubric_ref"], challenge["rubric_ref"])
        if challenge.get("capstone"):
            label = challenge["capstone"]
            label["definition_id"] = projects.get(label["definition_id"], label["definition_id"])
    package["rubrics"] = {rubrics.get(k, k): v for k, v in package.get("rubrics", {}).items()}
    for definition in package.get("capstones", []):
        definition["id"] = projects.get(definition["id"], definition["id"])
        definition["rubric_ref"] = rubrics.get(definition["rubric_ref"], definition["rubric_ref"])
        for stage in definition["stages"]:
            stage["challenge_id"] = identities.get(stage["challenge_id"], stage["challenge_id"])
    metadata = package.setdefault("bank", {})
    for path in metadata.get("learning_paths", []):
        path["challenges"] = [identities.get(cid, cid) for cid in path.get("challenges", [])]
    for key in ("prerequisite_graph", "topic_index"):
        if key in metadata:
            metadata[key] = {(identities.get(k, k) if key == "prerequisite_graph" else k):
                             [identities.get(cid, cid) for cid in values]
                             for k, values in metadata[key].items()}
    return package


def normalize_generated_package(bank, incoming):
    """Allocate current IDs for a generated draft and return a reviewable change list.

    Older/manual imports keep their identifiers and the existing collision checks.
    The authoring envelope makes generation rules explicit for new prompts.
    """
    manifest = incoming.get("authoring")
    if manifest is None:
        return deepcopy(incoming), []
    if not isinstance(manifest, dict) or type(manifest.get("version")) is not int or manifest["version"] != 1:
        raise ValueError("Unsupported exercise authoring contract.")
    mode, count = manifest.get("format"), manifest.get("count")
    if type(count) is not int or not 1 <= count <= 10:
        raise ValueError("The authoring contract needs a count from 1 to 10.")
    family = family_for(mode, manifest.get("family"), manifest.get("diagram_kind", "conceptual_erd"))
    challenges = incoming.get("challenges", [])
    expected = count * 6 if mode == "Connected Capstone" else count
    if len(challenges) != expected:
        raise ValueError(f"Expected {expected} exercises for this authoring request; received {len(challenges)}.")
    old_ids = [c.get("id") for c in challenges if isinstance(c, dict)]
    if len(old_ids) != expected or any(not isinstance(cid, str) or not cid.strip() for cid in old_ids) or len(set(old_ids)) != expected:
        raise ValueError("Generated exercises need distinct, nonempty IDs before references can be renamed.")
    for challenge in challenges:
        if exercise_format(challenge) != mode:
            raise ValueError(f"Exercise {challenge['id']} does not match the requested {mode} format.")
        if challenge.get("type") not in FAMILIES[family][1]:
            raise ValueError(f"Exercise {challenge['id']}: type must be one of {', '.join(FAMILIES[family][1])} for {family}.")
        if manifest.get("type") is not None and challenge.get("type") != manifest["type"]:
            raise ValueError("The deliverable type does not match the reviewed authoring request.")
        slots = challenge.get("constructor_tasks", {}).get("slots", [])
        if mode == "Diagram":
            kinds = {challenge["diagram_kind"]} if challenge.get("diagram_kind") else {s.get("kind") for s in slots}
            if manifest.get("diagram_kind", "conceptual_erd") not in kinds:
                raise ValueError("The diagram kind does not match the authoring request.")
        required_tool = {"Pipeline design": "pipeline", "Mock data": "mock", "SQL analysis": "sql"}.get(mode)
        if required_tool and not any(s.get("tool") == required_tool and s.get("required") is True for s in slots):
            raise ValueError(f"{mode} needs a required {required_tool} deliverable.")
        if mode == "Mock data" and manifest.get("mock_from_model") is True and not any(
                s.get("tool") == "diagram" and s.get("kind") == "logical_erd" and s.get("required") is True for s in slots):
            raise ValueError("Model-to-recipe exercises also need a required logical model.")
        if mode == "Repair exercise" and not any(s.get("requires_changes") and s.get("required") is True
                and (not manifest.get("repair_tool") or s.get("tool") == manifest["repair_tool"]) for s in slots):
            raise ValueError("The repair needs a required starter for the selected repair tool.")
        if mode == "Connected Capstone" and challenge["type"] != ("SQL" if challenge.get("dataset_sql") else "MODEL"):
            raise ValueError("Capstone type must match the stage's deliverable.")
    if mode == "Connected Capstone" and len(incoming.get("capstones", [])) != count:
        raise ValueError("Each requested connected project needs its complete definition and six stages.")
    if mode == "Connected Capstone" and any(len(d.get("stages", [])) != 6 for d in incoming["capstones"]):
        raise ValueError("Each connected project needs exactly six stages.")
    from src.json_validator import validate_bank
    validate_bank(incoming)  # Validate reference shapes before traversing/remapping them.
    new_ids = allocate_ids(bank, family, expected)
    identities = dict(zip(old_ids, new_ids))
    occupied = {d["id"] for d in bank.get("capstones", [])}
    projects = {d["id"]: available_name("cap-" + identities[d["stages"][0]["challenge_id"]].split("-", 1)[1], occupied)
                for d in incoming.get("capstones", [])}
    occupied_rubrics = set(bank.get("rubrics", {}))
    rubric_names = {name: available_name(f"practice_{new_ids[0].lower().replace('-', '_')}_{index}", occupied_rubrics)
                    for index, name in enumerate(incoming.get("rubrics", {}), 1)}
    package = remap_package(incoming, identities, projects, rubric_names)
    metadata = package["bank"]
    metadata["challenge_count"] = expected
    metadata["challenge_families"] = [{"prefix": family, "name": FAMILIES[family][0], "count": expected}]
    metadata["type_conventions"] = {"families": {family: FAMILIES[family][0]}, "types_in_family": {family: list(FAMILIES[family][1])}}
    changes = [{"Kind": kind, "From": old, "To": new} for kind, mapping in
               (("Exercise", identities), ("Project", projects), ("Rubric", rubric_names))
               for old, new in mapping.items() if old != new]
    return package, changes
