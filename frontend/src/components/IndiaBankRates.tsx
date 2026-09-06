import { useEffect, useState } from "react";
import axios from "axios";

interface BankRate {
  bank: string;
  loan_type: string;
  rate_min_pct: number;
  rate_max_pct: number;
  effective_date: string;
  source_url: string;
  note: string;
}

const LOAN_TYPE_ICONS: Record<string, string> = {
  "Home Loan": "🏠",
  "Car Loan": "🚗",
  "Vehicle Loan": "🚗",
  "Education Loan": "🎓",
  "Personal Loan": "👤",
  "Business Loan": "🏭",
  "Medical Loan": "🏥",
};

const LOAN_TYPE_ORDER = [
  "Home Loan", "Vehicle Loan", "Car Loan", "Education Loan",
  "Personal Loan", "Business Loan", "Medical Loan",
];

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function IndiaBankRates() {
  const [rates, setRates] = useState<BankRate[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeType, setActiveType] = useState<string>("Home Loan");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get<{ rates: BankRate[]; disclaimer: string }>(`${API_BASE}/india/bank-rates`)
      .then((res) => {
        setRates(res.data.rates);
        setDisclaimer(res.data.disclaimer);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const availableTypes = LOAN_TYPE_ORDER.filter((t) => rates.some((r) => r.loan_type === t));
  const filtered = rates.filter((r) => r.loan_type === activeType);

  if (loading) {
    return (
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm text-slate-500">Loading current Indian bank rates…</span>
        </div>
      </div>
    );
  }

  if (error || rates.length === 0) return null;

  return (
    <div className="glass-card mb-6 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron/30 to-gold/20 text-lg border border-saffron/20">
            🇮🇳
          </span>
          <div>
            <div className="text-sm font-bold text-white">Current Indian Bank Loan Rates</div>
            <div className="text-xs text-slate-500">Live rates from RBI & major banks</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 sm:inline-block">
            Indicative
          </span>
          <svg
            className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 px-5 pb-5 pt-4">
          {/* Type tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {availableTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activeType === t
                    ? "bg-brand text-white shadow-lg shadow-brand/30"
                    : "border border-white/8 bg-white/4 text-slate-400 hover:bg-white/8"
                }`}
              >
                <span>{LOAN_TYPE_ICONS[t] ?? "📋"}</span>
                {t}
              </button>
            ))}
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <a
                key={`${r.bank}-${r.loan_type}`}
                href={r.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/4 p-4 transition hover:border-brand/30 hover:bg-brand/8 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white group-hover:text-brand-light transition">{r.bank}</span>
                  <svg className="h-3.5 w-3.5 text-slate-600 group-hover:text-brand-light transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-brand-light">
                    {r.rate_min_pct.toFixed(2)}%
                  </span>
                  {r.rate_max_pct > r.rate_min_pct && (
                    <span className="text-sm text-slate-500">– {r.rate_max_pct.toFixed(2)}%</span>
                  )}
                  <span className="ml-auto text-xs text-slate-600">p.a.</span>
                </div>
                {r.note && (
                  <p className="text-xs text-slate-600 leading-relaxed">{r.note}</p>
                )}
              </a>
            ))}
          </div>

          {/* Disclaimer */}
          {disclaimer && (
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              ⚠️ {disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
