import { useState } from "react";
import type { AssetType, Holding } from "../types";

const ASSET_TYPES: Array<{ value: AssetType; label: string; icon: string; color: string }> = [
  { value: "STOCKS",       label: "Stocks",        icon: "📈", color: "text-blue-400" },
  { value: "MUTUAL_FUNDS", label: "Mutual Funds",  icon: "🏦", color: "text-indigo-400" },
  { value: "FIXED_DEPOSIT",label: "Fixed Deposit", icon: "🔒", color: "text-emerald-400" },
  { value: "BONDS",        label: "Bonds",         icon: "📄", color: "text-yellow-400" },
  { value: "CASH",         label: "Cash",          icon: "💵", color: "text-green-400" },
  { value: "CRYPTO",       label: "Crypto",        icon: "₿",  color: "text-orange-400" },
];

interface Props {
  holdings: Holding[];
  onChange: (holdings: Holding[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
}

function blankHolding(): Holding {
  return { asset_type: "STOCKS", current_value: 0, invested_value: 0 };
}

function fmt(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function PortfolioForm({ holdings, onChange, onContinue, onSkip, onBack }: Props) {
  const [newHolding, setNewHolding] = useState<Holding>(blankHolding());

  const add = () => {
    if (newHolding.current_value <= 0) return;
    onChange([...holdings, newHolding]);
    setNewHolding(blankHolding());
  };

  const remove = (index: number) => onChange(holdings.filter((_, i) => i !== index));

  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0);
  const selectedAsset = ASSET_TYPES.find((a) => a.value === newHolding.asset_type);

  return (
    <section className="animate-fade-up">
      <div className="glass-card card-accent p-7">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-brand-dark/20 text-2xl border border-indigo-500/20">
            📈
          </div>
          <div>
            <h2 className="section-heading text-xl">Your investments (optional)</h2>
            <p className="section-sub">
              Holdings you could liquidate to partly fund the loan. This lets LOANR model smarter borrow-vs-liquidate strategies.
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand/8 px-4 py-3">
          <span className="text-lg">💡</span>
          <p className="text-sm text-slate-300">
            No investments? Skip this step — LOANR will optimise a pure-borrow strategy for you.
          </p>
        </div>

        {/* Holdings list */}
        {holdings.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your holdings</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400">
                Total ₹{fmt(totalValue)}
              </span>
            </div>
            <ul className="space-y-2">
              {holdings.map((h, i) => {
                const asset = ASSET_TYPES.find((a) => a.value === h.asset_type);
                const gain = h.current_value - h.invested_value;
                const gainPct = h.invested_value > 0 ? (gain / h.invested_value) * 100 : 0;
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{asset?.icon}</span>
                      <div>
                        <div className={`text-sm font-semibold ${asset?.color}`}>
                          {h.asset_type.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs text-slate-500">
                          Current ₹{fmt(h.current_value)}
                          {h.invested_value > 0 && (
                            <span className={`ml-2 font-semibold ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {gain >= 0 ? "+" : ""}{gainPct.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(i)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Add holding row */}
        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Add a holding</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="field-label" htmlFor="holding_asset">Asset type</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{selectedAsset?.icon}</span>
                <select
                  id="holding_asset"
                  className="field-input pl-9"
                  value={newHolding.asset_type}
                  onChange={(e) => setNewHolding({ ...newHolding, asset_type: e.target.value as AssetType })}
                >
                  {ASSET_TYPES.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="hold_current">Current value (₹)</label>
              <input
                id="hold_current"
                className="field-input"
                type="number"
                min={0}
                value={newHolding.current_value || ""}
                onChange={(e) => setNewHolding({ ...newHolding, current_value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="hold_invested">Invested value (₹)</label>
              <input
                id="hold_invested"
                className="field-input"
                type="number"
                min={0}
                value={newHolding.invested_value || ""}
                onChange={(e) => setNewHolding({ ...newHolding, invested_value: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <button
                className="btn-secondary w-full"
                onClick={add}
                disabled={newHolding.current_value <= 0}
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <button className="btn-secondary" onClick={onBack}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={onSkip}>
              Skip — no investments
            </button>
            <button
              className="btn-primary"
              onClick={onContinue}
              disabled={holdings.length === 0}
            >
              Continue with holdings
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}