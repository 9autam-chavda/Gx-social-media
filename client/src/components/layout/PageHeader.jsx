import Icon from '../icons/Icon';

const PageHeader = ({ badge, title, description, action }) => (
  <section className="mb-4 overflow-hidden rounded-xl border border-line/80 bg-white p-4 shadow-[var(--shadow-card)] sm:mb-5 sm:p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {badge && (
          <p className="text-[10px] font-black uppercase tracking-normal text-brand">
            {badge}
          </p>
        )}
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-xl font-black leading-tight text-ink sm:text-2xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-5 text-ink-muted">
            {description}
          </p>
        )}
      </div>

      {action?.label && (
        <div>
          <button
            type="button"
            className="secondary-button min-h-10 rounded-xl px-4 py-2 text-sm"
            onClick={action.onClick}
          >
            {action.icon && <Icon name={action.icon} />}
            {action.label}
          </button>
        </div>
      )}
    </div>
  </section>
);

export default PageHeader;
