"""
India bank rate cache (Task 4).

Stores fetched bank rates in MongoDB with a 24-hour TTL.
Falls back to the hardcoded fallback table if MongoDB is unavailable.

DISPLAY-ONLY: Cached rates are returned to the frontend for informational
display only. They are never used to modify the ML recommendation or compute
any EMI figures (AGENTS.md §6 rule 8, §2).
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from app.config import settings
from app.india.scraper import BankRate, fetch_live_rates, get_fallback_rates

logger = logging.getLogger(__name__)

CACHE_TTL_HOURS = 24
CACHE_KEY = "bank_rates_india"

# Module-level simple in-memory cache as the primary layer.
# MongoDB is the secondary (persistent across restarts) layer.
_memory_cache: Optional[list[BankRate]] = None
_memory_cache_at: Optional[datetime] = None

_refresh_lock = asyncio.Lock()


def _is_stale(cached_at: datetime) -> bool:
    cutoff = datetime.now(tz=timezone.utc) - timedelta(hours=CACHE_TTL_HOURS)
    return cached_at < cutoff


def _get_mongo_collection() -> Any:
    """Return the MongoDB rate_cache collection or None."""
    if not settings.MONGODB_URI:
        return None
    try:
        import motor.motor_asyncio  # noqa: PLC0415
        client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_URI, serverSelectionTimeoutMS=2000
        )
        return client["loanr"]["rate_cache"]
    except Exception:  # noqa: BLE001
        return None


async def _load_from_mongo() -> Optional[list[BankRate]]:
    """Try to load non-stale rates from MongoDB."""
    col = _get_mongo_collection()
    if col is None:
        return None
    try:
        doc = await col.find_one({"_id": CACHE_KEY})
        if doc and not _is_stale(doc["cached_at"]):
            return [BankRate(**r) for r in doc["rates"]]
    except Exception as exc:  # noqa: BLE001
        logger.debug("MongoDB rate read failed: %s", exc)
    return None


async def _save_to_mongo(rates: list[BankRate]) -> None:
    """Persist rates to MongoDB with current timestamp."""
    col = _get_mongo_collection()
    if col is None:
        return
    try:
        await col.replace_one(
            {"_id": CACHE_KEY},
            {
                "_id": CACHE_KEY,
                "cached_at": datetime.now(tz=timezone.utc),
                "rates": [r.model_dump() for r in rates],
            },
            upsert=True,
        )
    except Exception as exc:  # noqa: BLE001
        logger.debug("MongoDB rate write failed: %s", exc)


async def get_rates() -> list[BankRate]:
    """
    Return current Indian bank rates.

    Resolution order:
    1. In-memory cache (if fresh)
    2. MongoDB cache (if fresh)
    3. Live scrape (if reachable)
    4. Hardcoded fallback table
    """
    global _memory_cache, _memory_cache_at

    # 1. In-memory
    if _memory_cache is not None and _memory_cache_at and not _is_stale(_memory_cache_at):
        return _memory_cache

    async with _refresh_lock:
        # Re-check after acquiring lock (another coroutine may have refreshed).
        if _memory_cache is not None and _memory_cache_at and not _is_stale(_memory_cache_at):
            return _memory_cache

        # 2. MongoDB
        mongo_rates = await _load_from_mongo()
        if mongo_rates:
            _memory_cache = mongo_rates
            _memory_cache_at = datetime.now(tz=timezone.utc)
            return _memory_cache

        # 3. Live scrape
        live = await fetch_live_rates()
        rates = live if live else get_fallback_rates()

        # Persist to MongoDB and memory
        await _save_to_mongo(rates)
        _memory_cache = rates
        _memory_cache_at = datetime.now(tz=timezone.utc)
        return _memory_cache
