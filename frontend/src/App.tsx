import { useState } from "react";
import type {
  CustomerProfile,
  Holding,
  LoanRequirement,
  Portfolio,
  Recommendation,
  RecommendRequest,
} from "./types";
import { LOAN_PURPOSE, RISK_APPETITE } from "./types";
import { recommend } from "./api/client";
import ProfileForm from "./screens/ProfileForm";
import PortfolioForm from "./screens/PortfolioForm";
import RequirementForm from "./screens/RequirementForm";
import ResultsScreen from "./screens/ResultsScreen";
import LoadingPanel from "./components/LoadingPanel";
import ErrorPanel from "./components/ErrorPanel";
import IndiaBankRates from "./components/IndiaBankRates";

type Step = "profile" | "portfolio" | "requirement" | "results";

const DEFAULT_PROFILE: CustomerProfile = {
  user_id: null,
  monthly_income: 120000,
  monthly_expenses: 45000,
  existing_emi: 8000,
  credit_score: 780,
  employment_type: "SALARIED",
  employment_years: 8,
  age: 34,
  dependents: 1,
};

const DEFAULT_REQUIREMENT: LoanRequirement = {
  purpose: LOAN_PURPOSE.HOME,
  required_amount: 1500000,
  preferred_tenure_months: 120,
  risk_appetite: RISK_APPETITE.MODERATE,
};

export default function App() {
  const [step, setStep] = useState<Step>("profile");
  const [profile, setProfile] = useState<CustomerProfile>(DEFAULT_PROFILE);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [requirement, setRequirement] = useState<LoanRequirement>(DEFAULT_REQUIREMENT);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [submitted, setSubmitted] = useState<RecommendRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = () => {
    setHoldings([]);
    setStep("requirement");
  };

  const submit = async () => {
    const portfolio: Portfolio = { holdings };
    const request: RecommendRequest = {
      customer: profile,
      portfolio,
      requirement,
      user_id: profile.user_id,
    };
    setLoading(true);
    setError(null);
    try {
      const res = await recommend(request);
      setResult(res);
      setSubmitted(request);
      setStep("results");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not reach the recommendation service.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ------------------------------------------------------------------ Header */}
      <header className="sticky top-0 z-30">
        <div
          className="border-b border-white/8"
          style={{
            background: "rgba(8,13,40,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            {/* Logo + wordmark */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-lg shadow-brand/40">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand to-brand-dark opacity-50 blur-md animate-glow-pulse" />
                <svg className="relative h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 21h18" />
                  <path d="M6 18V10" />
                  <path d="M10 18V5" />
                  <path d="M14 18V8" />
                  <path d="M18 18V11" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
                  LOAN<span className="text-brand-light">R</span>
                </h1>
                <p className="text-xs font-medium text-slate-500 leading-none">
                  India's intelligent loan recommender
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce-gentle inline-block" />
                ML-powered
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-light">
                🇮🇳 India-specific
              </span>
            </div>
          </div>
          {/* India tri-color accent bar */}
          <div className="india-bar" />
        </div>
      </header>

      {/* ------------------------------------------------------------------ Main */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {step !== "results" ? (
          <StepIndicator current={step} />
        ) : null}

        {/* India bank rates panel — displayed on profile and requirement steps */}
        {(step === "profile" || step === "requirement") && (
          <IndiaBankRates />
        )}

        {step === "profile" && (
          <ProfileForm
            value={profile}
            onChange={setProfile}
            onNext={() => setStep("portfolio")}
          />
        )}

        {step === "portfolio" && (
          <PortfolioForm
            holdings={holdings}
            onChange={setHoldings}
            onContinue={() => setStep("requirement")}
            onSkip={skip}
            onBack={() => setStep("profile")}
          />
        )}

        {step === "requirement" && (
          <RequirementForm
            value={requirement}
            onChange={setRequirement}
            onBack={() => setStep("portfolio")}
            onSubmit={submit}
            submitting={loading}
          />
        )}

        {step === "results" && result && submitted && (
          <>
            {error ? <div className="mb-4"><ErrorPanel message={error} /></div> : null}
            <ResultsScreen
              result={result}
              request={submitted}
              onEdit={() => setStep("profile")}
            />
          </>
        )}

        {loading && step !== "results" ? (
          <LoadingPanel label="Scoring your options…" />
        ) : null}
      </main>
    </div>
  );
}

// ------------------------------------------------------------------ Step indicator
const STEPS: Array<{ key: Step; label: string; icon: string }> = [
  { key: "profile",     label: "Your finances",    icon: "💰" },
  { key: "portfolio",   label: "Your investments",  icon: "📈" },
  { key: "requirement", label: "Your loan",         icon: "🏦" },
];

function StepIndicator({ current }: { current: Step }) {
  const activeIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="mb-8 flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done   = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={s.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5 px-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : active
                    ? "bg-brand text-white shadow-lg shadow-brand/40 ring-4 ring-brand/20"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{s.icon}</span>
                )}
              </div>
              <span
                className={`hidden text-xs font-semibold sm:block transition-colors ${
                  active ? "text-brand-light" : done ? "text-emerald-400" : "text-slate-600"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <div
                className={`h-px flex-1 mx-1 transition-all duration-500 ${
                  done ? "bg-emerald-500/60" : "bg-white/8"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}