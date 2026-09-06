import type { CustomerProfile, EmploymentType } from "../types";

const EMPLOYMENT_TYPES: Array<{ value: EmploymentType; label: string; icon: string }> = [
  { value: "SALARIED",     label: "Salaried",      icon: "🏢" },
  { value: "SELF_EMPLOYED",label: "Self-employed",  icon: "💼" },
  { value: "CONTRACT",     label: "Contract",       icon: "📋" },
  { value: "RETIRED",      label: "Retired",        icon: "🌴" },
];

interface Props {
  value: CustomerProfile;
  onChange: (next: CustomerProfile) => void;
  onNext: () => void;
}

export default function ProfileForm({ value, onChange, onNext }: Props) {
  const set = (patch: Partial<CustomerProfile>) => onChange({ ...value, ...patch });
  const valid = value.credit_score >= 300 && value.credit_score <= 900 && value.monthly_income > 0;

  const creditColor =
    value.credit_score >= 750 ? "text-emerald-400" :
    value.credit_score >= 650 ? "text-yellow-400" :
    "text-red-400";

  const creditLabel =
    value.credit_score >= 750 ? "Excellent" :
    value.credit_score >= 700 ? "Good" :
    value.credit_score >= 650 ? "Fair" :
    "Poor";

  return (
    <section className="animate-fade-up">
      {/* Card */}
      <div className="glass-card card-accent p-7">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/30 to-brand-dark/20 text-2xl border border-brand/20">
            💰
          </div>
          <div>
            <h2 className="section-heading text-xl">Your financial profile</h2>
            <p className="section-sub">
              Your monthly income, expenses and existing loans help us determine exactly how much you can comfortably borrow.
            </p>
          </div>
        </div>

        {/* Income & expenses row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            id="monthly_income"
            label="Monthly Income (₹)"
            type="number"
            min={0}
            value={value.monthly_income}
            onChange={(v) => set({ monthly_income: Number(v) })}
            hint="Your net take-home income per month"
          />
          <InputField
            id="monthly_expenses"
            label="Monthly Expenses (₹)"
            type="number"
            min={0}
            value={value.monthly_expenses}
            onChange={(v) => set({ monthly_expenses: Number(v) })}
            hint="Rent, groceries, utilities, etc."
          />
          <InputField
            id="existing_emi"
            label="Existing EMI (₹)"
            type="number"
            min={0}
            value={value.existing_emi}
            onChange={(v) => set({ existing_emi: Number(v) })}
            hint="Total of all current loan EMIs"
          />

          {/* Credit Score with visual meter */}
          <div>
            <label className="field-label" htmlFor="credit_score">
              CIBIL Credit Score
            </label>
            <div className="relative">
              <input
                id="credit_score"
                className="field-input pr-28"
                type="number"
                min={300}
                max={900}
                value={value.credit_score}
                onChange={(e) => set({ credit_score: Math.round(Number(e.target.value)) })}
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${creditColor}`}>
                {creditLabel}
              </span>
            </div>
            {/* Score bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, ((value.credit_score - 300) / 600) * 100))}%`,
                  background: value.credit_score >= 750
                    ? "linear-gradient(to right, #10B981, #6EE7B7)"
                    : value.credit_score >= 650
                    ? "linear-gradient(to right, #F59E0B, #FDE68A)"
                    : "linear-gradient(to right, #EF4444, #FCA5A5)",
                }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Range: 300–900</p>
          </div>

          <InputField
            id="employment_years"
            label="Years Employed"
            type="number"
            min={0}
            value={value.employment_years}
            onChange={(v) => set({ employment_years: Number(v) })}
          />
          <InputField
            id="age"
            label="Age"
            type="number"
            min={18}
            max={100}
            value={value.age}
            onChange={(v) => set({ age: Math.round(Number(v)) })}
          />
          <InputField
            id="dependents"
            label="Dependents"
            type="number"
            min={0}
            value={value.dependents}
            onChange={(v) => set({ dependents: Math.max(0, Math.round(Number(v))) })}
            hint="Children, parents, spouse who depend on you"
          />
        </div>

        {/* Employment type */}
        <div className="mt-6">
          <span className="field-label">Employment Type</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EMPLOYMENT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set({ employment_type: t.value })}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 ${
                  value.employment_type === t.value
                    ? "border-brand/60 bg-brand/15 shadow-lg shadow-brand/20 text-white"
                    : "border-white/8 bg-white/3 text-slate-400 hover:border-white/15 hover:bg-white/6"
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="btn-primary px-8 py-3"
            onClick={onNext}
            disabled={!valid}
          >
            Next — My investments
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Reusable input */
function InputField({
  id, label, type, min, max, value, onChange, hint,
}: {
  id: string; label: string; type: string; min?: number; max?: number;
  value: number | undefined; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="field-input"
        type={type}
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}