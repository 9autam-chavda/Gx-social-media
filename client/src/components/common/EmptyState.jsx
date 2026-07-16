const EmptyState = ({ icon: Icon, title, description, action }) => (
  <section className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-line/90 bg-white/95 p-6 text-center shadow-[var(--shadow-card)] sm:p-8" role="status" aria-live="polite">
    <div className="max-w-sm">
      {Icon && (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand shadow-sm">
          <Icon />
        </div>
      )}
      <h2 className="text-base font-black text-ink sm:text-lg">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  </section>
);

export default EmptyState;
