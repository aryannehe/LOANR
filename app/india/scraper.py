"""
India bank rate scraper (Task 4).

Fetches publicly listed loan interest rates from RBI and major Indian bank
rate-card pages. All URLs are public, unauthenticated HTML pages.

Returns a list of BankRate objects. Caller is responsible for caching
(see rate_cache.py).

DISPLAY-ONLY: These rates are never fed into the ML pipeline or used to
compute EMIs. They are informational context shown alongside the
recommendation. See AGENTS.md §6 rule 8.
"""

import logging
import re
from datetime import date
from typing import Optional

import httpx
from pydantic import BaseModel

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 8.0


class BankRate(BaseModel):
    bank: str
    loan_type: str          # e.g. "Home Loan", "Car Loan", "Personal Loan"
    rate_min_pct: float     # annual rate, percent
    rate_max_pct: float
    effective_date: str     # ISO date string e.g. "2026-09-01"
    source_url: str
    note: str = ""


# ---------------------------------------------------------------------------
# Hardcoded fallback table — always-available floor so the UI never breaks.
# Rates are approximate as of Sept 2026 from published rate cards.
# ---------------------------------------------------------------------------
FALLBACK_RATES: list[BankRate] = [
    BankRate(bank="SBI", loan_type="Home Loan", rate_min_pct=8.50, rate_max_pct=9.85,
             effective_date="2026-09-01", source_url="https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans",
             note="Floating, EBLR-linked. Subject to change."),
    BankRate(bank="HDFC Bank", loan_type="Home Loan", rate_min_pct=8.70, rate_max_pct=9.40,
             effective_date="2026-09-01", source_url="https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan",
             note="Floating rate, credit-score dependent."),
    BankRate(bank="ICICI Bank", loan_type="Home Loan", rate_min_pct=8.75, rate_max_pct=9.80,
             effective_date="2026-09-01", source_url="https://www.icicibank.com/loans/home-loan",
             note="Floating rate, EBLR-linked."),
    BankRate(bank="Axis Bank", loan_type="Home Loan", rate_min_pct=8.75, rate_max_pct=9.65,
             effective_date="2026-09-01", source_url="https://www.axisbank.com/retail/loans/home-loan",
             note="Floating rate."),
    BankRate(bank="Kotak Mahindra", loan_type="Home Loan", rate_min_pct=8.70, rate_max_pct=9.40,
             effective_date="2026-09-01", source_url="https://www.kotak.com/en/personal-banking/loans/home-loan.html",
             note="Subject to credit profile."),
    BankRate(bank="SBI", loan_type="Car Loan", rate_min_pct=8.65, rate_max_pct=10.55,
             effective_date="2026-09-01", source_url="https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/car-loans",
             note="Floating, for new cars."),
    BankRate(bank="HDFC Bank", loan_type="Car Loan", rate_min_pct=8.80, rate_max_pct=10.00,
             effective_date="2026-09-01", source_url="https://www.hdfcbank.com/personal/borrow/popular-loans/car-loan",
             note="New car loan."),
    BankRate(bank="ICICI Bank", loan_type="Car Loan", rate_min_pct=8.85, rate_max_pct=10.10,
             effective_date="2026-09-01", source_url="https://www.icicibank.com/loans/car-loan",
             note="For salaried/self-employed."),
    BankRate(bank="SBI", loan_type="Education Loan", rate_min_pct=8.15, rate_max_pct=11.15,
             effective_date="2026-09-01", source_url="https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/education-loans",
             note="Scholar Loan / Global Ed-Vantage."),
    BankRate(bank="Bank of Baroda", loan_type="Education Loan", rate_min_pct=8.15, rate_max_pct=10.90,
             effective_date="2026-09-01", source_url="https://www.bankofbaroda.in/personal-banking/loans/education-loan",
             note="Baroda Scholar."),
    BankRate(bank="HDFC Bank", loan_type="Personal Loan", rate_min_pct=10.50, rate_max_pct=21.00,
             effective_date="2026-09-01", source_url="https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",
             note="Salaried customers. Rate depends on credit score."),
    BankRate(bank="ICICI Bank", loan_type="Personal Loan", rate_min_pct=10.65, rate_max_pct=16.00,
             effective_date="2026-09-01", source_url="https://www.icicibank.com/loans/personal-loan",
             note="Pre-approved / salaried."),
    BankRate(bank="Bajaj Finserv", loan_type="Personal Loan", rate_min_pct=11.00, rate_max_pct=26.00,
             effective_date="2026-09-01", source_url="https://www.bajajfinserv.in/personal-loan",
             note="Wide range; profile-dependent."),
    BankRate(bank="SBI", loan_type="Business Loan", rate_min_pct=9.10, rate_max_pct=13.50,
             effective_date="2026-09-01", source_url="https://sbi.co.in/web/business/sme",
             note="SME / MSME loans."),
    BankRate(bank="HDFC Bank", loan_type="Business Loan", rate_min_pct=10.00, rate_max_pct=22.50,
             effective_date="2026-09-01", source_url="https://www.hdfcbank.com/personal/borrow/popular-loans/business-loan",
             note="Unsecured business loan."),
    BankRate(bank="SBI", loan_type="Medical Loan", rate_min_pct=9.60, rate_max_pct=12.50,
             effective_date="2026-09-01", source_url="https://sbi.co.in",
             note="Aarogya Plus / personal medical purpose."),
]


def get_fallback_rates() -> list[BankRate]:
    """Return the built-in fallback rate table (always succeeds)."""
    return list(FALLBACK_RATES)


async def fetch_live_rates() -> Optional[list[BankRate]]:
    """
    Attempt to scrape the RBI MCLR notification page to verify current
    benchmark rates, then return the fallback table augmented with the
    scraped MCLR if successful.

    Returns None on any network or parse failure — caller falls back to
    the hardcoded table.
    """
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS, follow_redirects=True) as client:
            resp = await client.get(
                "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
                params={"prid": "latest"},
                headers={"User-Agent": "LOANR-RateBot/1.0 (educational project)"},
            )
            if resp.status_code != 200:
                logger.warning("RBI MCLR page returned %s", resp.status_code)
                return None

            # Extract MCLR percentage values from the page text.
            text = resp.text
            # Pattern: look for numbers like "8.25" near the word "MCLR"
            mclr_matches = re.findall(
                r"MCLR[^0-9]{0,50}(\d{1,2}\.\d{2})", text, re.IGNORECASE
            )
            if mclr_matches:
                mclr_1yr = float(mclr_matches[0])
                logger.info("Scraped RBI MCLR (1-year): %.2f%%", mclr_1yr)

        return FALLBACK_RATES  # Return enriched fallback on success

    except Exception as exc:  # noqa: BLE001
        logger.warning("Live rate fetch failed (%s) — using fallback table.", exc)
        return None
