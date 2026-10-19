from src.selector import eligible_challenges, select_challenge
import json
from pathlib import Path
import pytest

def bank():
    return [{"id":"SCN-1","type":"DESIGN","difficulty":2,"estimated_minutes":20,"internal":{"topics":["x"]}},{"id":"SQL-1","type":"SQL","difficulty":4,"estimated_minutes":45,"internal":{"topics":["y"]}}]

def test_filters():
    assert [c["id"] for c in eligible_challenges(bank(),family="SCN",max_minutes=30)]==["SCN-1"]
    assert eligible_challenges(bank(),challenge_type="SQL",difficulty=2)==[]

def test_seed_and_seen_avoidance():
    a=select_challenge(bank(),seed=4); b=select_challenge(bank(),seed=4)
    assert a["id"]==b["id"]
    choice=select_challenge(bank(),[{"challenge_id":a["id"]}],seed=4)
    assert choice["id"]!=a["id"]

def test_adaptive_selection_is_valid_and_deterministic():
    history=[{"challenge_id":"SCN-1","score":40,"weak_topics":["x"]},{"challenge_id":"SCN-1","score":50,"weak_topics":["x"]}]
    c=select_challenge(bank(),history,adaptive=True,weak_topics=["x"],seed=9)
    assert c["id"] in {"SCN-1","SQL-1"}

def test_new_bank_families_are_selectable():
    bank_data=json.loads((Path(__file__).resolve().parents[1]/"data"/"challenges.json").read_text(encoding="utf-8"))
    candidates=eligible_challenges(bank_data["challenges"],family="DM")
    assert len(candidates)==6
    assert all(c["id"].startswith("DM-") for c in candidates)


def test_adaptive_recency_uses_latest_repeat():
    candidates=[{"id":cid,"difficulty":3} for cid in ("A","B")]
    history=[{"challenge_id":cid} for cid in ("A","B","B","A")]
    # Equal coverage and difficulty: B was last practiced earlier than A.
    assert select_challenge(candidates,history,adaptive=True,seed=0)["id"]=="B"


@pytest.mark.parametrize("score, expected", [(None, "C"), (69, "A"), (70, "C"), (100, "C")])
def test_adaptive_weakness_uses_scores_below_seventy(score, expected):
    candidates = [
        {"id": cid, "difficulty": 3, "internal": {"topics": [cid]}}
        for cid in ("A", "B", "C")
    ]
    history = [
        {"challenge_id": "A", "score": score, "weak_topics": ["A", "A"]},
        {"challenge_id": "B", "score": 90},
        {"challenge_id": "C", "score": 90},
    ]
    assert select_challenge(candidates, history, adaptive=True, seed=0)["id"] == expected
    assert select_challenge(candidates, history, adaptive=True, weak_topics=["A"], seed=0)["id"] == "A"


def test_learning_path_filters_and_all_sentinels_preserve_order():
    candidates = bank()
    paths = [{"name": "SQL practice", "challenges": ["SQL-1"]}]
    assert eligible_challenges(candidates, learning_path="SQL practice", paths=paths) == [candidates[1]]
    assert eligible_challenges(candidates, learning_path="Unknown", paths=paths) == []
    assert eligible_challenges(
        candidates, family="All families", challenge_type="All types",
        difficulty=0, learning_path="All paths", paths=paths,
    ) == candidates
