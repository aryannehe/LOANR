import { useState } from "react";
import type { Recommendation, RecommendRequest } from "../types";
import { RECOMMENDATION_STATUS } from "../types";
import { runScenario } from "../api/client";
import SourceBadge from "../components/SourceBadge";
import SyntheticDataLabel from "../components/SyntheticDataLabel";
import RecommendedResult from "./RecommendedResult";
import NoLoanResult from "./NoLoanResult";
import WhatIfPanel from "./WhatIfPanel";

export default function ResultsScreen({
  result,
  request,
  onEdit,
}: {
  result: Recommendation;
  request: RecommendRequest;
  onEdit: () => void;
}) {
  const [scenario, setScenario] = useState<Recommendation | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);

  const runWhatIf = async (next: RecommendRequest) => {
    setScenarioLoading(true);
    setScenarioError(null);
    try {
      setScenario(await runScenario(next));
    } catch (e) {
      setScenarioError(
        e instanceof Error ? e.message : "Could not run the what-if comparison.",
      );
    } finally {
      setScenarioLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Results header banner */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-6"
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(55,48,163,0.20) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black text-white" style={{ letterSpacing: "-0.01em" }}>
                Your LOANR Recommendation
              </h2>
              <div className="mt-0.5 flex items-center gap-2">
                <SourceBadge source={result.source} />
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18 hover:border-white/25"
            onClick={onEdit}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit my details
          </button>
        </div>
      </div>

      {result.source === "DETERMINISTIC_FALLBACK" ? (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/8 px-4 py-3">
          <span className="text-lg">⚠️</span>
          <p className="text-sm text-yellow-300">
            The ML model is currently unavailable. This result was produced by the deterministic fallback — suitability scores are not shown.
          </p>
        </div>
      ) : null}

      {renderStatus(result, request)}

      <WhatIfPanel
        base={result}
        request={request}
        scenario={scenario}
        loading={scenarioLoading}
        error={scenarioError}
        onRun={runWhatIf}
      />

      <SyntheticDataLabel />
      <Footer />
    </div>
  );
}

function renderStatus(result: Recommendation, request: RecommendRequest) {
  switch (result.status) {
    case RECOMMENDATION_STATUS.RECOMMENDED:
      return <RecommendedResult result={result} request={request} />;
    case RECOMMENDATION_STATUS.NO_ELIGIBLE_PRODUCTS:
    case RECOMMENDATION_STATUS.NO_FEASIBLE_CANDIDATES:
    case RECOMMENDATION_STATUS.ALL_CANDIDATES_BLOCKED:
    case RECOMMENDATION_STATUS.NO_SUITABLE_LOAN:
      return <NoLoanResult result={result} />;
  }
}

function Footer() {
  return (
    <footer className="rounded-xl border border-white/5 bg-white/2 px-5 py-4 text-xs text-slate-600 leading-relaxed">
      <span className="font-semibold text-slate-500">Disclaimer: </span>
      This is an illustrative recommendation tool powered by synthetic training data, not financial advice, a credit decision, or an offer of credit. Eligibility and suitability are modelled on your self-entered details. Always verify loan terms directly with the bank before applying.
    </footer>
  );
}