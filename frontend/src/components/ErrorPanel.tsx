export default function ErrorPanel({
  message,
  detail,
  onRetry,
}: {
  message: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-200">{message}</p>
          {detail ? <p className="mt-1 text-xs text-red-300/80">{detail}</p> : null}
        </div>
      </div>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-400/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-white/20"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}