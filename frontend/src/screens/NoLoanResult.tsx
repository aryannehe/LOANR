import type {
  MismatchReason,
  Recommendation,
} from "../types";
import { rupees, yearsMonths, percent } from "../lib/format";
import CoverageFunnel from "../components/CoverageFunnel";

const TITLES: Record<string, string> = {
  NO_ELIGIBLE_PRODUCTS: "No catalogue product matches your profile",
  NO_FEASIBLE_CANDIDATES: "No financing arrangement could be built",
  ALL_CANDIDATES_BLOCKED: "Every candidate was blocked by a safety rule",
  NO_SUITABLE_LOAN: "None of the available loans is a good fit for you",
};

export default function NoLoanResult({ result }: { result: Recommendation }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-6"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(180,83,9,0.14) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Background glow — amber rather than indigo: this is a "no result" outcome,
            and it should read as distinct from the recommended path at a glance. */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-80 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-light">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v3.75m0 3.25h.008v.008H12V16z" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-white" style={{ letterSpacing: "-0.01em" }}>
              {TITLES[result.status] ?? result.status}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              We looked through every option in the catalogue. Here is how far your request
              got, and why nothing was recommended.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <CoverageFunnel coverage={result.coverage} />
      </div>

      {result.mismatch_reasons.length ? (
        <div className="card card-pad">
          <h4 className="section-heading text-base">Why no loan was recommended</h4>
          <ul className="mt-3 space-y-2">
            {result.mismatch_reasons.map((reason, i) => (
              <MismatchLine key={i} reason={reason} />
            ))}
          </ul>
        </div>
      ) : null}

      <OutcomeAdvice result={result} />
    </div>
  );
}

function MismatchLine({ reason }: { reason: MismatchReason }) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2 text-sm">
      <span className="mt-0.5 text-gold-light">·</span>
      <span className="text-slate-300">
        {reading(reason)}
      </span>
    </li>
  );
}

function reading(reason: MismatchReason): string {
  switch (reason.code) {
    case "CREDIT_SCORE_BELOW_MINIMUM":
      return `This option requires a credit score of ${reason.threshold_value} (yours: ${reason.observed_value}).`;
    case "INCOME_BELOW_MINIMUM":
      return `This option requires monthly income of ${rupees(reason.threshold_value)} (your income: ${rupees(reason.observed_value)}).`;
    case "AMOUNT_ABOVE_PRODUCT_MAX":
      return `Your requested amount exceeds this product's maximum of ${rupees(reason.threshold_value)}.`;
    case "AMOUNT_BELOW_PRODUCT_MIN":
      return `Your requested amount is below this product's minimum of ${rupees(reason.threshold_value)}.`;
    case "TENURE_OUT_OF_RANGE":
      return `Your preferred tenure exceeds this product's limit (max ${yearsMonths(reason.threshold_value)}).`;
    case "PURPOSE_NOT_SUPPORTED":
      return `This product does not support your loan purpose.`;
    case "EMI_EXCEEDS_AFFORDABILITY":
      return `The EMI exceeds what you can afford each month.`;
    case "LIQUIDATION_EXCEEDS_PORTFOLIO":
      return `The strategy would liquidate more than your portfolio holds.`;
    case "REQUIRED_AMOUNT_UNREACHABLE":
      return `No combination of borrowing and liquidation reaches your requested amount.`;
    case "DEBT_BURDEN_CAP_EXCEEDED":
      return `Your debt burden would exceed the safety cap of ${percent(reason.threshold_value)} (this option: ${percent(reason.observed_value)}).`;
    case "LOAN_TO_INCOME_CAP_EXCEEDED":
      return `Your loan-to-income would exceed the safety cap (this option: ${percent(reason.observed_value)}).`;
    case "LIQUIDATION_SHARE_CAP_EXCEEDED":
      return `It would liquidate more of your portfolio than your risk profile allows (cap ${percent(reason.threshold_value)}, this option ${percent(reason.observed_value)}).`;
    case "VOLATILE_ASSET_LIQUIDATION_PROHIBITED":
      return `It relies on liquidating volatile assets, which your risk profile avoids.`;
    case "SUITABILITY_BELOW_THRESHOLD":
      return `The remaining eligible options scored below the suitability threshold (best ${percent(reason.observed_value)}, threshold ${percent(reason.threshold_value)}).`;
    default:
      return `This option was not a fit (${reason.code}).`;
  }
}

function OutcomeAdvice({ result }: { result: Recommendation }) {
  const suggestions: string[] = [];
  const reasons = result.mismatch_reasons;
  const has = (codes: string[]) =>
    reasons.some((r) => codes.includes(r.code));

  if (has(["AMOUNT_ABOVE_PRODUCT_MAX", "REQUIRED_AMOUNT_UNREACHABLE"])) {
    suggestions.push("a smaller loan amount");
  }
  if (has(["TENURE_OUT_OF_RANGE"])) {
    suggestions.push("a shorter tenure");
  }
  if (has(["CREDIT_SCORE_BELOW_MINIMUM"])) {
    suggestions.push("a higher credit score");
  }
  if (has(["INCOME_BELOW_MINIMUM", "EMI_EXCEEDS_AFFORDABILITY"])) {
    suggestions.push("higher income or lower existing commitments");
  }
  if (has(["PURPOSE_NOT_SUPPORTED"])) {
    suggestions.push("a loan purpose supported by more of the catalogue");
  }
  if (has(["LIQUIDATION_SHARE_CAP_EXCEEDED", "VOLATILE_ASSET_LIQUIDATION_PROHIBITED"])) {
    suggestions.push("a different risk appetite");
  }
  if (has(["SUITABILITY_BELOW_THRESHOLD"])) {
    suggestions.push("options closer to your preferred amount and tenure");
  }

  if (!suggestions.length) {
    return (
      <div className="card card-pad border-l-4 border-l-slate-500">
        <h5 className="text-sm font-bold text-white">What would change the outcome</h5>
        <p className="mt-1 text-sm text-slate-400">
          None of the present reasons points to a single change. Adjusting your profile
          and re-running may surface a suitable option.
        </p>
      </div>
    );
  }

  return (
    <div className="card card-pad border-l-4 border-l-brand">
      <h5 className="text-sm font-bold text-white">What would change the outcome</h5>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-emerald-light">→</span>
            {s.charAt(0).toUpperCase() + s.slice(1)}.
          </li>
        ))}
      </ul>
    </div>
  );
}