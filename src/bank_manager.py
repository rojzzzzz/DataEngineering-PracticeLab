"""Challenge-bank validation, merging, and bundled upgrade rules."""
from __future__ import annotations

import json
from copy import deepcopy
from collections import Counter
from typing import Any

from .json_validator import validate_bank


def sync_bundled_capstones(current, bundled):
    if not bundled.get("capstones"):
        return current
    merged = deepcopy(current)
    existing = {c["id"] for c in merged["challenges"]}
    for c in bundled.get("challenges", []):
        if c.get("capstone") and c["id"] not in existing:
            merged["challenges"].append(deepcopy(c))
            existing.add(c["id"])
    definitions = merged.setdefault("capstones", [])
    for definition in bundled.get("capstones", []):
        if not any(d["id"] == definition["id"] for d in definitions):
            definitions.append(deepcopy(definition))
        ref = definition["rubric_ref"]
        merged.setdefault("rubrics", {}).setdefault(ref, deepcopy(bundled["rubrics"][ref]))
    # Constructor synchronization already merges the family/topic metadata for
    # attached stages. Include the dataset-SQL stage in the same derived indexes.
    meta, source = merged["bank"], bundled.get("bank", {})
    ids = {s["challenge_id"] for d in definitions for s in d["stages"]}
    for topic, references in source.get("topic_index", {}).items():
        refs = [cid for cid in references if cid in ids]
        if refs:
            meta.setdefault("topic_index", {})[topic] = list(dict.fromkeys(meta.get("topic_index", {}).get(topic, []) + refs))
    for cid in ids:
        meta.setdefault("prerequisite_graph", {}).setdefault(cid, deepcopy(source.get("prerequisite_graph", {}).get(cid, [])))
    meta["challenge_count"] = len(merged["challenges"])
    return merged


def sync_bundled_constructor(current: dict, bundled: dict) -> dict:
    """Upgrade only unchanged baselines; preserve user-authored challenge edits."""
    from src.constructor_artifacts import fingerprint
    merged = deepcopy(current)
    indexes = {c["id"]: i for i, c in enumerate(merged["challenges"])}
    linked = [c for c in bundled.get("challenges", []) if c.get("constructor_tasks")]
    conflicts = []
    for challenge in linked:
        identity = challenge["id"]
        index = indexes.get(identity)
        if index is None:
            indexes[identity] = len(merged["challenges"])
            merged["challenges"].append(deepcopy(challenge))
        elif merged["challenges"][index] != challenge:
            existing = merged["challenges"][index]
            if fingerprint(existing) == challenge.get("constructor_baseline_hash"):
                merged["challenges"][index] = deepcopy(challenge)
            else:
                conflicts.append(identity)
    selected = {c["id"] for c in linked}
    rubric_names = {c["rubric_ref"] for c in linked}
    for name in rubric_names:
        if name not in merged.setdefault("rubrics", {}):
            merged["rubrics"][name] = deepcopy(bundled["rubrics"][name])
    meta, source = merged.setdefault("bank", {}), bundled.get("bank", {})
    for field, key in (("learning_paths", "name"), ("challenge_families", "prefix")):
        values = meta.setdefault(field, [])
        existing = {v[key]: v for v in values}
        for value in source.get(field, []):
            if field == "learning_paths" and not any(i in selected for i in value.get("challenges", [])):
                continue
            if value[key] not in existing:
                values.append(deepcopy(value))
            elif field == "learning_paths":
                target = existing[value[key]]
                target["challenges"] = list(dict.fromkeys(target.get("challenges", []) + [i for i in value.get("challenges", []) if i in selected]))
    for topic, ids in source.get("topic_index", {}).items():
        refs = [i for i in ids if i in selected]
        if refs:
            target = meta.setdefault("topic_index", {}).setdefault(topic, [])
            target[:] = list(dict.fromkeys(target + refs))
    for identity in selected:
        if identity in source.get("prerequisite_graph", {}):
            meta.setdefault("prerequisite_graph", {}).setdefault(identity, deepcopy(source["prerequisite_graph"][identity]))
    meta["constructor_upgrade_conflicts"] = conflicts
    meta["challenge_count"] = len(merged["challenges"])
    return merged


def sync_bundled_python(current: dict, bundled: dict) -> dict:
    """Append missing bundled Python exercises to existing persistent banks."""
    existing = {c["id"] for c in current["challenges"]}
    additions = [deepcopy(c) for c in bundled["challenges"] if c.get("python_playground") and c["id"] not in existing]
    if not additions:
        return current
    # Reuse metadata merging, and never overwrite a user's existing pilot.
    required = {c["rubric_ref"] for c in additions}
    ids = {c["id"] for c in additions}
    prefixes = {cid.split("-", 1)[0] for cid in ids}
    metadata = bundled.get("bank", {})
    incoming = {
        "challenges": additions,
        "rubrics": {k: v for k, v in bundled["rubrics"].items() if k in required},
        "bank": {
            "type_enum": list(dict.fromkeys(c["type"] for c in additions)),
            "challenge_families": [deepcopy(f) for f in metadata.get("challenge_families", []) if f.get("prefix") in prefixes],
            "topic_index": {topic: [cid for cid in refs if cid in ids] for topic, refs in metadata.get("topic_index", {}).items() if any(cid in ids for cid in refs)},
        },
    }
    return merge_banks(current, incoming)

DETECTIVE_BASELINE_HASHES = {
    "INC-001": "cd25516bceeae981363325d5097012c798da68db9183e5d52b935e8d62fc1d6d",
    "INC-003": "e71353a7cbbb4f031f968583de6e86e549b89e554fde05ecc2f266ff6cf0b18f",
    "CLN-001": "ba78d70cd3c9182ee110d71e73c4d90172c6fcf66118d058759a008a8931cf69",
    "CLN-002": "9a58cd56b4643d6eef5b4121a6bf6f06a09a02673a5a04583131b2240e59cc26",
    "CLN-003": "18b6d45cdf10e870cd18987fc2feaf5ad50ca5b4aed33bb6460269929e766fb8",
}


def prepare_append(current: dict[str, Any], incoming: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    # Check the input's shape, but resolve references against the combined bank.
    validate_bank(incoming)
    from .sql_runner import validate_reference_queries
    for challenge in incoming["challenges"]:
        if isinstance(challenge, dict) and challenge.get("sql_playground"):
            try:
                validate_reference_queries(json.dumps(challenge["sql_playground"], sort_keys=True))
            except ValueError as exc:
                raise ValueError(f"Challenge {challenge.get('id')}: {exc}") from exc
    return validate_bank(merge_banks(current, incoming))


def merge_banks(current: dict[str, Any], incoming: dict[str, Any]) -> dict[str, Any]:
    """Append incoming challenges and merge their rubrics and learning metadata."""
    # Own both inputs: later edits must not mutate the imported bank or vice versa.
    merged = deepcopy(current)
    incoming = deepcopy(incoming)
    old_challenges=merged.get("challenges",[])
    new_challenges=incoming.get("challenges",[])
    if not isinstance(new_challenges,list) or not new_challenges:
        raise ValueError("The uploaded bank must contain at least one challenge object.")
    if any(not isinstance(c,dict) or not isinstance(c.get("id"),str) or not c["id"].strip() for c in new_challenges):
        raise ValueError("Every added challenge needs a non-empty string ID.")
    old_ids={c.get("id") for c in old_challenges if isinstance(c,dict)}
    new_ids=[c.get("id") for c in new_challenges if isinstance(c,dict)]
    collisions=sorted(old_ids & set(new_ids))
    if collisions:
        raise ValueError("Challenge ID conflicts with the current bank: " + ", ".join(collisions))
    duplicates=sorted(cid for cid, count in Counter(new_ids).items() if count > 1)
    if duplicates:
        raise ValueError("The uploaded file has duplicate challenge IDs: " + ", ".join(duplicates))
    merged["challenges"].extend(new_challenges)
    for definition in incoming.get("capstones", []):
        if any(d["id"] == definition["id"] for d in merged.setdefault("capstones", [])):
            raise ValueError("Capstone definition ID conflict: " + definition["id"])
        merged["capstones"].append(deepcopy(definition))

    for name,rubric in incoming.get("rubrics",{}).items():
        if name in merged.setdefault("rubrics",{}) and merged["rubrics"][name] != rubric:
            raise ValueError(f"Rubric '{name}' differs from the current bank. Use Replace or rename the incoming rubric.")
        merged["rubrics"][name]=rubric

    for key in ("mistake_categories",):
        values=merged.setdefault(key,[])
        for value in incoming.get(key,[]):
            if value not in values: values.append(value)
    for key in ("prompt_templates",):
        merged.setdefault(key,{})
        for name,value in incoming.get(key,{}).items(): merged[key].setdefault(name,value)

    current_bank=merged.setdefault("bank",{})
    incoming_bank=incoming.get("bank",{})
    current_bank["challenge_count"]=len(merged["challenges"])
    families={item.get("prefix"):item for item in current_bank.get("challenge_families",[]) if isinstance(item,dict)}
    for item in incoming_bank.get("challenge_families",[]):
        if not isinstance(item,dict) or not item.get("prefix"): continue
        if item["prefix"] not in families:
            families[item["prefix"]]=item
        elif not families[item["prefix"]].get("intent") and item.get("intent"):
            families[item["prefix"]]["intent"]=item["intent"]
    current_bank["challenge_families"]=list(families.values())
    conventions=current_bank.setdefault("type_conventions",{})
    incoming_conventions=incoming_bank.get("type_conventions",{})
    if isinstance(incoming_conventions,dict):
        for key in ("families",):
            conventions.setdefault(key,{}).update(incoming_conventions.get(key,{}))
        for key in ("types_in_family",):
            destination=conventions.setdefault(key,{})
            for prefix,types in incoming_conventions.get(key,{}).items():
                values=destination.setdefault(prefix,[])
                for value in types:
                    if value not in values: values.append(value)
    for key in ("type_enum","artifact_formats"):
        values=current_bank.setdefault(key,[])
        for value in incoming_bank.get(key,[]):
            if value not in values: values.append(value)

    paths={item.get("name"):item for item in current_bank.get("learning_paths",[]) if isinstance(item,dict)}
    for item in incoming_bank.get("learning_paths",[]):
        if not isinstance(item,dict) or not item.get("name"): continue
        if item["name"] not in paths: paths[item["name"]]=item
        else:
            path=paths[item["name"]]
            for cid in item.get("challenges",[]):
                if cid not in path.setdefault("challenges",[]): path["challenges"].append(cid)
    current_bank["learning_paths"]=list(paths.values())

    for key in ("prerequisite_graph","topic_index"):
        target=current_bank.setdefault(key,{})
        for name,values in incoming_bank.get(key,{}).items():
            current_values=target.setdefault(name,[])
            if isinstance(values,list):
                for value in values:
                    if value not in current_values: current_values.append(value)
    # Topic metadata is optional in imports; exercise tags must still be usable
    # by evaluator forms and review selection after an append.
    topic_index = current_bank.setdefault("topic_index", {})
    for challenge in new_challenges:
        for topic in challenge.get("internal", {}).get("topics", []):
            references = topic_index.setdefault(topic, [])
            if challenge["id"] not in references:
                references.append(challenge["id"])
    for key in ("glossary","mistake_category_examples"):
        target=current_bank.setdefault(key,{})
        values=incoming_bank.get(key,{})
        if isinstance(target,dict) and isinstance(values,dict): target.update(values)
    for key in ("source_scope",):
        values=current_bank.setdefault(key,[])
        for value in incoming_bank.get(key,[]):
            if value not in values: values.append(value)
    return merged


def sync_bundled_sql(current: dict[str, Any], bundled: dict[str, Any]) -> dict[str, Any]:
    """Refresh image-shipped SQL questions in a persisted bank without dropping custom questions."""
    merged = deepcopy(current)
    challenges = merged.setdefault("challenges", [])
    bundled_challenges = bundled.get("challenges", [])
    sql_challenges = [challenge for challenge in bundled_challenges if challenge.get("sql_playground")]
    sql_ids = {challenge["id"] for challenge in sql_challenges}
    conflicts = []
    challenge_indexes = {
        challenge.get("id"): index
        for index, challenge in enumerate(challenges)
        if isinstance(challenge, dict)
    }

    for challenge in sql_challenges:
        challenge_id = challenge["id"]
        if challenge_id in challenge_indexes:
            existing = challenges[challenge_indexes[challenge_id]]
            # Valid executable exercises can be learner-authored edits of a
            # bundled ID. Refresh legacy placeholders, but review changed
            # executable definitions instead of overwriting their contents.
            if existing.get("sql_playground") and existing != challenge:
                from .sql_models import fingerprint
                if fingerprint(existing) != DETECTIVE_BASELINE_HASHES.get(challenge_id):
                    conflicts.append(challenge_id)
                    continue
            if challenge.get("data_quality_detective"):
                from .sql_models import fingerprint
                original = DETECTIVE_BASELINE_HASHES.get(challenge_id)
                if not existing.get("data_quality_detective") and original and fingerprint(existing) != original:
                    conflicts.append(challenge_id)
                    continue
                if existing.get("data_quality_detective") and (existing["data_quality_detective"] != challenge["data_quality_detective"] or existing.get("sql_playground") != challenge["sql_playground"]):
                    conflicts.append(challenge_id)
                    continue
                existing.update({key: deepcopy(challenge[key]) for key in ("data_quality_detective", "sql_playground", "student")})
            else:
                challenges[challenge_indexes[challenge_id]] = deepcopy(challenge)
        else:
            challenge_indexes[challenge_id] = len(challenges)
            challenges.append(deepcopy(challenge))

    sql_rubrics = {challenge["rubric_ref"] for challenge in sql_challenges}
    for name, rubric in bundled.get("rubrics", {}).items():
        if name in sql_rubrics:
            merged.setdefault("rubrics", {}).setdefault(name, deepcopy(rubric))

    metadata = merged.setdefault("bank", {})
    source_metadata = bundled.get("bank", {})
    families = {
        family.get("prefix"): family
        for family in metadata.get("challenge_families", [])
        if isinstance(family, dict)
    }
    sql_families = {challenge_id.split("-", 1)[0] for challenge_id in sql_ids}
    for family in source_metadata.get("challenge_families", []):
        if family.get("prefix") in sql_families:
            families[family["prefix"]] = deepcopy(family)
    metadata["challenge_families"] = list(families.values())

    paths = {
        path.get("name"): path
        for path in metadata.get("learning_paths", [])
        if isinstance(path, dict)
    }
    for path in source_metadata.get("learning_paths", []):
        sql_refs = [challenge_id for challenge_id in path.get("challenges", []) if challenge_id in sql_ids]
        if not sql_refs:
            continue
        target = paths.setdefault(path["name"], {**deepcopy(path), "challenges": []})
        target["challenges"] = list(dict.fromkeys(target.get("challenges", []) + sql_refs))
    metadata["learning_paths"] = list(paths.values())

    topic_index = metadata.setdefault("topic_index", {})
    for topic, references in source_metadata.get("topic_index", {}).items():
        sql_refs = [challenge_id for challenge_id in references if challenge_id in sql_ids]
        if sql_refs:
            topic_index[topic] = list(dict.fromkeys(topic_index.get(topic, []) + sql_refs))

    prerequisites = metadata.setdefault("prerequisite_graph", {})
    for challenge_id, references in source_metadata.get("prerequisite_graph", {}).items():
        if challenge_id in sql_ids:
            prerequisites[challenge_id] = deepcopy(references)

    metadata["challenge_count"] = len(challenges)
    metadata["bundled_upgrade_conflicts"] = conflicts
    return merged
