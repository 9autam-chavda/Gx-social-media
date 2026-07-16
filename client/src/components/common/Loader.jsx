const Loader = ({ label = 'Loading' }) => (
  <div className="grid min-h-56 place-items-center text-sm font-semibold text-ink-muted" role="status" aria-live="polite">
    <div className="inline-flex items-center gap-3 rounded-full border border-line/80 bg-white px-4 py-2 shadow-[var(--shadow-card)]">
      <span className="h-2 w-2 rounded-full bg-brand motion-safe:animate-pulse" />
      <span>{label}...</span>
    </div>
  </div>
);

export default Loader;
