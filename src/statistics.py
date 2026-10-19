"""Progress summaries with bounded per-topic aggregation."""
from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass
class _TopicStats:
    attempts: int = 0
    mistakes: int = 0
    score_total: float = 0
    score_count: int = 0
    confidence_total: float = 0
    confidence_count: int = 0
    last: str = ""
    last_instant: datetime | None = None


def _parse_time(value: str) -> datetime | None:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)
    except (ValueError, TypeError, AttributeError, OverflowError):
        return None


def weak_topic_summary(attempts: list[dict[str, Any]]) -> list[dict[str, Any]]:
    stats = defaultdict(_TopicStats)
    for attempt in attempts:
        if attempt.get("project_run_id"):
            continue  # Project runs are reported separately; stages are not extra completions.
        topics = dict.fromkeys(attempt.get("weak_topics") or [])
        if not topics:
            continue
        timestamp = attempt.get("updated_at") or ""
        instant = _parse_time(timestamp)
        mistakes = len(attempt.get("mistake_categories") or [])
        score = float(attempt["score"]) if attempt.get("score") is not None else None
        confidence = float(attempt["confidence"]) if attempt.get("confidence") is not None else None
        for topic in topics:
            topic_stats = stats[topic]
            topic_stats.attempts += 1
            topic_stats.mistakes += mistakes
            if score is not None:
                topic_stats.score_total += score
                topic_stats.score_count += 1
            if confidence is not None:
                topic_stats.confidence_total += confidence
                topic_stats.confidence_count += 1
            if instant is not None and (topic_stats.last_instant is None or instant > topic_stats.last_instant):
                topic_stats.last = timestamp
                topic_stats.last_instant = instant
            elif topic_stats.last_instant is None:
                topic_stats.last = max(topic_stats.last, timestamp)

    now = datetime.now(timezone.utc)
    summaries = []
    for topic, values in stats.items():
        average = values.score_total / values.score_count if values.score_count else 65
        confidence = values.confidence_total / values.confidence_count if values.confidence_count else 3
        days_since = max(0, (now - values.last_instant).days) if values.last_instant else 0
        priority = (
            (100 - average) * .55 + values.mistakes * 4
            + (5 - confidence) * 3 + min(days_since, 30) * .2
        )
        summaries.append({
            "topic": topic,
            "attempts": values.attempts,
            "average_score": round(average, 1) if values.score_count else None,
            "mistake_count": values.mistakes,
            "confidence_average": round(confidence, 1) if values.confidence_count else None,
            "last_practiced": values.last,
            "review_priority": round(priority, 1),
        })
    return sorted(summaries, key=lambda row: row["review_priority"], reverse=True)


def overview(attempts: list[dict[str, Any]]) -> dict[str, Any]:
    completed = set()
    in_progress = set()
    score_total = 0.0
    score_count = 0
    for attempt in attempts:
        if attempt.get("project_run_id"):
            continue
        if attempt.get("status") in ("Completed", "Evaluated"):
            completed.add(attempt["challenge_id"])
        elif attempt.get("status") == "In progress":
            in_progress.add(attempt["challenge_id"])
        if attempt.get("score") is not None:
            score_total += float(attempt["score"])
            score_count += 1
    return {
        "completed": len(completed),
        "in_progress": len(in_progress),
        "average_score": round(score_total / score_count, 1) if score_count else None,
        "score_count": score_count,
        "weak_topics": weak_topic_summary(attempts),
    }
