"""MongoDB session logger (Task 3).

Logs anonymised recommendation sessions to MongoDB for future dataset improvement.
This is a fire-and-forget side-effect — it NEVER blocks the recommendation path and
NEVER raises to the caller. If MongoDB is absent or the write fails, we log a warning
and return cleanly.

Architecture constraints:
  - No business logic here. This module only serialises a completed Recommendation
    and writes it; the recommendation itself is already decided.
  - Stores NO PII: user_id is pseudonymous (caller-supplied or null), names, PAN,
    Aadhaar and contact data are never accepted by the schema and thus never land here.
  - The MongoDB collection `loanr_sessions` is separate from the personalization DB
    (SQLite) which remains the authoritative personalization feature source.
"""

import logging
from datetime import datetime, timezone
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)

_client: Any = None
_db: Any = None


def _get_collection():
    """Lazy-connect to MongoDB. Returns None if MONGODB_URI is not configured."""
    global _client, _db
    if not settings.MONGODB_URI:
        return None
    if _client is None:
        try:
            import motor.motor_asyncio  # noqa: PLC0415 — deferred to keep import light
            _client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000,
            )
            _db = _client["loanr"]
            logger.info("MongoDB session logger connected.")
        except Exception as exc:  # noqa: BLE001
            logger.warning("MongoDB unavailable — session logging disabled: %s", exc)
            _client = None
            return None
    return _db["loanr_sessions"]


async def log_session(request: Any, recommendation: Any) -> None:
    """
    Asynchronously write a session record to MongoDB.

    Parameters
    ----------
    request       RecommendRequest schema object
    recommendation Recommendation schema object

    This function is always safe to fire-and-forget: it swallows all exceptions.
    """
    col = _get_collection()
    if col is None:
        return

    try:
        # Serialise only non-PII fields.
        cust = request.customer
        req = request.requirement
        doc = {
            "timestamp": datetime.now(tz=timezone.utc),
            "user_id": request.user_id,
            # Financial profile — no names or ID numbers
            "monthly_income": cust.monthly_income,
            "monthly_expenses": cust.monthly_expenses,
            "existing_emi": cust.existing_emi,
            "credit_score": cust.credit_score,
            "employment_type": cust.employment_type,
            "employment_years": cust.employment_years,
            "age": cust.age,
            "dependents": cust.dependents,
            # Requirement
            "loan_purpose": req.purpose,
            "required_amount": req.required_amount,
            "preferred_tenure_months": req.preferred_tenure_months,
            "risk_appetite": req.risk_appetite,
            # Outcome
            "recommendation_status": recommendation.status,
            "recommendation_source": recommendation.source,
            "ml_suitability": recommendation.ml_suitability,
            "risk_class": recommendation.risk.risk_class if recommendation.risk else None,
            "recommended_product_id": (
                recommendation.selected_candidate.product_id
                if recommendation.selected_candidate
                else None
            ),
        }
        await col.insert_one(doc)
    except Exception as exc:  # noqa: BLE001
        logger.warning("MongoDB session log write failed: %s", exc)


async def close() -> None:
    """Close the MongoDB connection gracefully on app shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        logger.info("MongoDB session logger disconnected.")
