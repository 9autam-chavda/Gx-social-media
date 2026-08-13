import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Icon from '../components/icons/Icon';

const navigation = [
  { label: 'About', to: '/#about' },
  { label: 'Features', to: '/#features' },
  { label: 'Explore', to: '/app/explore' },
];

const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const close = () => setOpen(false);

  useEffect(() => {
    document.title = pathname === '/' ? 'GX — Share what matters.' : 'GX';
  }, [pathname]);

  useEffect(() => {
    if (!hash) return undefined;
    const timeout = window.setTimeout(() => {
      const target = document.getElementById(hash.slice(1));
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
    return () => window.clearTimeout(timeout);
  }, [hash, pathname]);

  return <div className="min-h-screen overflow-x-clip bg-surface-muted text-ink">
    <header className="sticky top-0 z-50 border-b border-line bg-surface-muted/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
      <Link className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink" to="/" onClick={close} aria-label="GX home"><img src="/gx.png" alt="" className="h-9 w-9 rounded-control object-contain" /> GX</Link>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Public navigation">{navigation.map((item) => <Link key={item.to} to={item.to} className="text-sm font-semibold text-ink-muted transition hover:text-ink">{item.label}</Link>)}</nav>
      <div className="hidden items-center gap-3 md:flex"><Link className="text-sm font-semibold text-ink hover:text-brand" to="/login">Log in</Link><Link className="primary-button min-h-10 px-5 text-sm" to="/register">Get started <Icon name="arrowRight" size={16} /></Link></div>
      <button className="icon-button md:hidden" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'more'} size={20} /></button>
    </div>{open && <nav className="border-t border-line bg-white px-5 py-4 shadow-soft md:hidden" aria-label="Mobile public navigation"><div className="mx-auto grid max-w-6xl gap-2">{navigation.map((item) => <Link key={item.to} to={item.to} onClick={close} className="rounded-control px-3 py-3 text-sm font-semibold text-ink hover:bg-surface-muted">{item.label}</Link>)}<Link to="/login" onClick={close} className="rounded-control px-3 py-3 text-sm font-semibold text-ink">Log in</Link><Link to="/register" onClick={close} className="primary-button mt-1 w-full">Get started</Link></div></nav>}</header>
    <main><Outlet /></main>
    <footer className="border-t border-line bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-2 font-bold"><img src="/gx.png" alt="" className="h-7 w-7 rounded-control" /> GX</div><nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-muted" aria-label="Footer navigation"><Link to="/#about">About</Link><Link to="/#features">Features</Link><Link to="/app/explore">Explore</Link><Link to="/login">Log in</Link><Link to="/register">Get started</Link></nav></div><div className="mx-auto max-w-6xl border-t border-line px-5 py-5 text-xs font-semibold text-ink-muted lg:px-8">© {new Date().getFullYear()} GX</div></footer>
  </div>;
};

export default PublicLayout;
