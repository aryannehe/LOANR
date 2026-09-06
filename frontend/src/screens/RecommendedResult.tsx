import { useState } from "react";
import type {
  Candidate,
  CatalogueCoverage,
  Recommendation,
  RecommendRequest,
  ScoredCandidate,
} from "../types";
import { rupees, yearsMonths, strategyHuman, candidateTitle } from "../lib/format";
import CoverageFunnel from "../components/CoverageFunnel";
import ExplanationPanel from "./ExplanationPanel";
import StrategyComparison from "./StrategyComparison";
import BlockedCallout from "./BlockedCallout";

export default function RecommendedResult({
  result,
  request,
}: {
  result: Recommendation;
  request: RecommendRequest;
}) {
  const winner = result.selected_candidate;
  if (!winner) {
    return <div className="glass-card p-6 text-slate-400">No candidate was selected.</div>;
  }

  return (
    <div className="space-y-5">
      <BlockedCallout blocked={result.ml_top_choice_blocked} />
      <Headline winner={winner} suitability={result.ml_suitability} />
      <ExplanationPanel result={result} request={request} />
      <Alternatives alternatives={result.alternatives} winnerId={winner.candidate_id} />
      <StrategyComparison traceCounts={result.decision_trace} winner={winner} />
      <div className="glass-card p-6">
        <CoverageFunnel coverage={result.coverage} />
      </div>
      <EliminatedOptions
        coverage={result.coverage}
        ranked={result.decision_trace.ranked_candidates}
        winnerId={winner.candidate_id}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- Suitability ring */
function SuitabilityRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const dash = circ * pct;
  const color = pct >= 0.75 ? "#10B981" : pct >= 0.55 ? "#4F46E5" : "#F59E0B";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle className="ring-track" cx="40" cy="40" r={radius} strokeWidth="7" />
          <circle
            className="ring-fill"
            cx="40" cy="40" r={radius}
            strokeWidth="7"
            stroke={color}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset="0"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-white">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
        ML Suitability
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- Headline card */
function Headline({ winner, suitability }: { winner: Candidate; suitability?: number | null }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10"
      style={{
        background: "linear-gradient(135deg, #1a1f4e 0%, #0e1438 60%, #0a0f2e 100%)",
      }}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-64 rounded-full bg-emerald/10 blur-3xl" />

      <div className="relative p-6">
        {/* Top row */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce-gentle inline-block" />
              Recommended for you
            </div>
            <h3 className="mt-1.5 text-2xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
              {candidateTitle(winner)}
            </h3>
          </div>
          {suitability != null ? (
            <SuitabilityRing value={suitability} />
          ) : (
            <span className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-300">
              Deterministic fallback
            </span>
          )}
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Loan Amount" value={rupees(winner.loan_amount)} icon="💰" />
          <StatCard label="Tenure" value={yearsMonths(winner.tenure_months)} icon="📅" />
          <StatCard label="Monthly EMI" value={rupees(winner.emi)} icon="💳" highlight />
          <StatCard label="Strategy" value={strategyHuman(winner.strategy)} icon="🎯" />
        </div>

        {/* Suitability bar (below ring) */}
        {suitability != null && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-500">How well this fits your profile</span>
              <span className="font-bold text-brand-light">{(suitability * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.round(suitability * 100)}%`,
                  background: suitability >= 0.75
                    ? "linear-gradient(to right, #10B981, #6EE7B7)"
                    : "linear-gradient(to right, #4F46E5, #818CF8)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }: {
  label: string; value: string; icon: string; highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        highlight
          ? "border-brand/40 bg-brand/15 shadow-lg shadow-brand/20"
          : "border-white/8 bg-white/5"
      }`}
    >
      <div className="mb-1 text-lg">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-base font-black ${highlight ? "text-brand-light" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Alternatives */
function Alternatives({ alternatives, winnerId }: { alternatives: ScoredCandidate[]; winnerId: string }) {
  const next = alternatives.filter((a) => a.candidate.candidate_id !== winnerId);
  if (!next.length) return null;
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🔄</span>
        <div>
          <h3 className="text-base font-bold text-white">Alternative Options</h3>
          <p className="text-xs text-slate-500">Next best choices in the model's ranking.</p>
        </div>
      </div>
      <ul className="space-y-2.5">
        {next.slice(0, 4).map((a, idx) => (
          <li
            key={a.candidate.candidate_id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-slate-400">
                {idx + 2}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-200">{candidateTitle(a.candidate)}</div>
                <div className="text-xs text-slate-500">
                  {rupees(a.candidate.loan_amount)} · {yearsMonths(a.candidate.tenure_months)} · EMI {rupees(a.candidate.emi)}
                </div>
              </div>
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                a.suitability != null && a.suitability >= 0.7
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-brand/30 bg-brand/10 text-brand-light"
              }`}
            >
              {a.suitability == null ? "—" : `${(a.suitability * 100).toFixed(1)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- Eliminated */
function EliminatedOptions({ ranked, coverage, winnerId }: {
  ranked: ScoredCandidate[]; coverage: CatalogueCoverage; winnerId: string;
}) {
  const [open, setOpen] = useState(false);
  const others = ranked.filter((s) => s.candidate.candidate_id !== winnerId).filter((s) => s.candidate.feasible !== false);
  const above = others.filter((s) => s.suitability != null && s.suitability > 0.5);
  const below = others.filter((s) => s.suitability == null || s.suitability <= 0.5);

  return (
    <div className="glass-card p-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-base font-bold text-white"
      >
        <div className="flex items-center gap-2">
          <span>🗑️</span>
          Eliminated options
        </div>
        <span
          className={`rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400 transition ${
            open ? "bg-white/10" : ""
          }`}
        >
          {open ? "Hide" : "Show all"}
        </span>
      </button>

      {!open && (
        <p className="mt-2 text-xs text-slate-600">
          Loans filtered out at eligibility and options that scored below the suitability threshold.
        </p>
      )}

      {open && (
        <div className="mt-5 space-y-4">
          <EliminatedGroup
            title="You don't qualify for these"
            note="These products require credentials your profile doesn't meet."
            emoji="🚫"
            items={[]}
            categories={groupIneligible(coverage)}
            color="border-red-500/15 bg-red-500/5"
          />
          <EliminatedGroup
            title="Low suitability match"
            note="Cleared eligibility but scored below the suitability threshold."
            emoji="📉"
            items={below}
            color="border-yellow-500/15 bg-yellow-500/5"
          />
          {above.length ? (
            <EliminatedGroup
              title="Good match — not selected"
              note="Above threshold but ranked lower than the winner."
              emoji="📊"
              items={above}
              color="border-emerald-500/15 bg-emerald-500/5"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function EliminatedGroup({ title, note, emoji, items, categories, color }: {
  title: string; note: string; emoji: string; items: ScoredCandidate[];
  categories?: Array<{ label: string; count: number }>; color: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <span>{emoji}</span>
        {title}
      </div>
      <div className="mt-0.5 text-xs text-slate-500">{note}</div>
      {categories ? (
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          {categories.map((c) => (
            <li key={c.label}>• {c.count} product{c.count === 1 ? "" : "s"} — {c.label}</li>
          ))}
        </ul>
      ) : null}
      {items.length ? (
        <ul className="mt-2 space-y-1 text-xs text-slate-500">
          {items.map((s) => (
            <li key={s.candidate.candidate_id}>
              • {candidateTitle(s.candidate)} —{" "}
              {s.suitability == null ? "no score" : `${(s.suitability * 100).toFixed(1)}%`}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function groupIneligible(coverage: CatalogueCoverage): Array<{ label: string; count: number }> {
  const ineligible = coverage.catalogue_products - coverage.products_passing_eligibility;
  const infeasible = coverage.products_passing_eligibility - coverage.products_with_feasible_candidates;
  const counts: Array<{ label: string; count: number }> = [];
  if (ineligible > 0) counts.push({ label: "failed eligibility checks", count: ineligible });
  if (infeasible > 0) counts.push({ label: "no feasible candidate (amount / tenure / EMI)", count: infeasible });
  return counts;
}