import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuthShell = ({ title, subtitle, footerText, footerLink, footerLabel, children }) => {
  useEffect(() => { document.title = `GX — ${title}`; }, [title]);
  return (
  <main className="grid min-h-screen place-items-center bg-surface-muted px-4 py-10">
    <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:grid-cols-[1fr_1.1fr]">
      <div className="hidden bg-ink p-8 text-white md:flex md:flex-col md:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 text-sm font-black text-blue-200"><img src="/gx.png" alt="GX" className="h-7 w-7 rounded-lg" /> GX SOCIAL</Link>
          <h1 className="mt-3 max-w-sm text-4xl font-black leading-tight">
            Share the moment. Keep the conversation moving.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-300">
          A focused social workspace for publishing posts, discovering people, saving content, and keeping conversations moving.
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-black text-brand"><img src="/gx.png" alt="GX" className="h-7 w-7 rounded-lg" /> GX</Link>
          <h2 className="mt-2 text-3xl font-black text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-ink-muted">
          {footerText}{' '}
          <Link className="font-bold text-brand hover:text-teal-800" to={footerLink}>
            {footerLabel}
          </Link>
        </p>
      </div>
    </section>
  </main>
  );
};

export default AuthShell;
