import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuthShell = ({ title, subtitle, footerText, footerLink, footerLabel, children }) => {
  useEffect(() => { document.title = `GX — ${title}`; }, [title]);
  return (
  <main className="grid min-h-screen place-items-center bg-surface-muted px-4 py-10">
    <section className="grid w-full max-w-5xl overflow-hidden rounded-card border border-line bg-white shadow-soft md:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden bg-ink p-8 text-white md:flex md:flex-col md:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-blue-100"><img src="/gx.png" alt="" className="h-7 w-7 rounded-control" /> GX</Link>
          <h1 className="mt-4 max-w-sm text-4xl font-bold leading-tight tracking-tight">
            Share what matters.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-300">
          A simple place to share, discover, and stay connected.
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-brand"><img src="/gx.png" alt="" className="h-7 w-7 rounded-control" /> GX</Link>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-ink-muted">
          {footerText}{' '}
            <Link className="font-semibold text-brand hover:text-brand-strong" to={footerLink}>
            {footerLabel}
          </Link>
        </p>
      </div>
    </section>
  </main>
  );
};

export default AuthShell;
