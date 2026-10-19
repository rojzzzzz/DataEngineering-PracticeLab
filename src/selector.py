"""Filter exercises and recommend practice using newest-first attempt history."""
from __future__ import annotations

import random
from typing import Any


def eligible_challenges(
    challenges: list[dict[str, Any]],
    family: str | None = None,
    challenge_type: str | None = None,
    difficulty: int | None = None,
    max_minutes: int | None = None,
    learning_path: str | None = None,
    paths: list[dict[str, Any]] | None = None,
    include_project_stages: bool = False,
) -> list[dict[str, Any]]:
    """Apply optional filters without changing the challenge order."""
    path_ids = None
    if learning_path and learning_path != "All paths":
        path_ids = set(next(
            (path.get("challenges", []) for path in paths or []
             if path.get("name") == learning_path),
            [],
        ))

    matches = []
    for challenge in challenges:
        if challenge.get("capstone") and not include_project_stages:
            continue  # Project stages must be started through a run.
        if family and family != "All families" and challenge.get("id", "").split("-", 1)[0] != family:
            continue
        if challenge_type and challenge_type != "All types" and challenge.get("type") != challenge_type:
            continue
        if difficulty not in (None, 0) and challenge.get("difficulty") != difficulty:
            continue
        if max_minutes is not None and challenge.get("estimated_minutes", 0) > max_minutes:
            continue
        if path_ids is not None and challenge.get("id") not in path_ids:
            continue
        matches.append(challenge)
    return matches


def select_challenge(
    challenges: list[dict[str, Any]],
    attempts: list[dict[str, Any]] | None = None,
    *,
    seed: int | None = None,
    preferred_difficulty: int | None = None,
    adaptive: bool = False,
    weak_topics: list[str] | None = None,
    **filters: Any,
) -> dict[str, Any] | None:
    """Prefer unseen exercises, then rank by weakness, recency and coverage."""
    pool = eligible_challenges(challenges, **filters)
    if not pool:
        return None

    history = attempts or []
    seen = {attempt.get("challenge_id") for attempt in history}
    if len(pool) > 1:
        unseen = [challenge for challenge in pool if challenge.get("id") not in seen]
        if unseen:
            pool = unseen

    rng = random.Random(seed)
    if not adaptive or len(history) < 2:
        if preferred_difficulty:
            matched = [challenge for challenge in pool if challenge.get("difficulty") == preferred_difficulty]
            if matched:
                pool = matched
        return rng.choice(pool)

    weak = set(weak_topics or ())
    counts: dict[str | None, int] = {}
    latest: dict[str | None, int] = {}
    for index, attempt in enumerate(history, 1):
        challenge_id = attempt.get("challenge_id")
        counts[challenge_id] = counts.get(challenge_id, 0) + 1
        # History is newest first: retain the first occurrence of each ID.
        latest.setdefault(challenge_id, index)
        attempt_score = attempt.get("score")
        if attempt_score is not None and float(attempt_score) < 70:
            weak.update(attempt.get("weak_topics") or [])

    history_count = len(history)
    target = preferred_difficulty or 3

    def score(challenge: dict[str, Any]) -> float:
        challenge_id = challenge.get("id")
        topics = set(challenge.get("internal", {}).get("topics", []))
        weakness = len(topics & weak) / max(1, len(topics)) if weak else 0
        recency = latest.get(challenge_id, history_count) / history_count
        coverage = 1 / (1 + counts.get(challenge_id, 0))
        difficulty_match = max(0, 1 - abs(challenge.get("difficulty", 1) - target) / 5)
        return (
            .4 * weakness + .25 * recency + .15 * coverage
            + .1 * difficulty_match + .1 * rng.random()
        )

    return max(pool, key=score)
