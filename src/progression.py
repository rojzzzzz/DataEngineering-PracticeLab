from __future__ import annotations
from typing import Any

def unlock_next(items: list[str], opened: list[int] | None = None) -> tuple[str | None, list[int]]:
    """Unlock exactly one next 1-based item, preserving prior progress."""
    history=list(opened or [])
    index=len(history)
    if index >= len(items): return None,history
    history.append(index+1)
    return items[index],history
