export default function LoadingPanel({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-white/8 bg-white/3 p-14 shadow-xl backdrop-blur-md">
      {/* Branded logo pulse */}
      <div className="relative">
        <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-brand opacity-30 blur-xl animate-glow-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-lg">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M6 18V10" />
            <path d="M10 18V5" />
            <path d="M14 18V8" />
            <path d="M18 18V11" />
          </svg>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-brand-light"
            style={{ animation: `bounceGentle 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-500">Running ML scoring + safety checks…</p>
      </div>
    </div>
  );
}