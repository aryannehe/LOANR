import type { LoanPurpose, LoanRequirement, RiskAppetite } from "../types";

const PURPOSES: Array<{ value: LoanPurpose; label: string; icon: string; desc: string }> = [
  { value: "HOME",      label: "Home Loan",      icon: "🏠", desc: "Purchase or construct your home" },
  { value: "VEHICLE",   label: "Vehicle Loan",   icon: "🚗", desc: "Car, two-wheeler or commercial vehicle" },
  { value: "EDUCATION", label: "Education Loan", icon: "🎓", desc: "Higher education in India or abroad" },
  { value: "PERSONAL",  label: "Personal Loan",  icon: "👤", desc: "Wedding, travel, home renovation" },
  { value: "BUSINESS",  label: "Business Loan",  icon: "🏭", desc: "Working capital, expansion, MSME" },
  { value: "MEDICAL",   label: "Medical Loan",   icon: "🏥", desc: "Emergency healthcare or surgery" },
];

const APPETITES: Array<{ value: RiskAppetite; label: string; icon: string; hint: string; color: string }> = [
  {
    value: "CONSERVATIVE",
    label: "Conservative",
    icon: "🛡️",
    hint: "Stable, lower-risk financing. Avoids aggressive strategies.",
    color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  },
  {
    value: "MODERATE",
    label: "Moderate",
    icon: "⚖️",
    hint: "Balanced approach between borrowing and part-liquidation.",
    color: "border-brand/50 bg-brand/10 text-brand-light",
  },
  {
    value: "AGGRESSIVE",
    label: "Aggressive",
    icon: "🚀",
    hint: "Comfortable with higher leverage and portfolio liquidation.",
    color: "border-gold/50 bg-gold/10 text-gold",
  },
];

interface Props {
  value: LoanRequirement;
  onChange: (next: LoanRequirement) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function RequirementForm({ value, onChange, onBack, onSubmit, submitting }: Props) {
  const set = (patch: Partial<LoanRequirement>) => onChange({ ...value, ...patch });
  const valid = value.required_amount > 0 && value.preferred_tenure_months > 0;
  const tenureYears = (value.preferred_tenure_months / 12).toFixed(1);

  return (
    <section className="animate-fade-up">
      <div className="glass-card card-accent p-7">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-saffron/10 text-2xl border border-gold/20">
            🏦
          </div>
          <div>
            <h2 className="section-heading text-xl">Your loan requirement</h2>
            <p className="section-sub">
              What you're borrowing for, how much, over what term, and your risk tolerance.
            </p>
          </div>
        </div>

        {/* Purpose grid */}
        <div className="mb-6">
          <span className="field-label">Loan Purpose</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PURPOSES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => set({ purpose: p.value })}
                className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                  value.purpose === p.value
                    ? "border-brand/60 bg-brand/15 shadow-lg shadow-brand/20"
                    : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <span className="text-2xl">{p.icon}</span>
                <span className={`text-sm font-bold ${value.purpose === p.value ? "text-white" : "text-slate-300"}`}>
                  {p.label}
                </span>
                <span className="text-xs text-slate-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount and tenure */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="amount">Loan Amount</label>
            <input
              id="amount"
              className="field-input"
              type="number"
              min={1}
              value={value.required_amount || ""}
              onChange={(e) => set({ required_amount: Number(e.target.value) })}
            />
            {value.required_amount > 0 && (
              <p className="mt-1 text-xs font-semibold text-brand-light">{fmt(value.required_amount)}</p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="tenure">Preferred Tenure</label>
            <input
              id="tenure"
              className="field-input"
              type="number"
              min={1}
              value={value.preferred_tenure_months || ""}
              onChange={(e) => set({ preferred_tenure_months: Math.round(Number(e.target.value)) })}
            />
            {value.preferred_tenure_months > 0 && (
              <p className="mt-1 text-xs font-semibold text-brand-light">{tenureYears} years</p>
            )}
          </div>
        </div>

        {/* Risk appetite */}
        <div className="mb-7">
          <span className="field-label">Risk Appetite</span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {APPETITES.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => set({ risk_appetite: a.value })}
                className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                  value.risk_appetite === a.value
                    ? `${a.color} shadow-lg`
                    : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <div className="mb-2 text-2xl">{a.icon}</div>
                <div className={`text-sm font-bold ${value.risk_appetite === a.value ? "" : "text-slate-300"}`}>
                  {a.label}
                </div>
                <div className="mt-1 text-xs text-slate-500">{a.hint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary bar */}
        {valid && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Summary</span>
            <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand-light">{fmt(value.required_amount)}</span>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-300">{tenureYears} years</span>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-300">{value.risk_appetite}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button className="btn-secondary" onClick={onBack}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            className="btn-primary px-8 py-3"
            onClick={onSubmit}
            disabled={submitting || !valid}
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Scoring your options…
              </>
            ) : (
              <>
                Get My Recommendation
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}