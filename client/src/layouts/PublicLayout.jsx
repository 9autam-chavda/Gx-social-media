import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../components/icons/Icon';

const navigation = [
  { label: 'About', to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'Explore', to: '/app/explore' },
];

const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  useEffect(() => {
    const titles = { '/': 'GX — Share what feels like you', '/about': 'GX — About', '/features': 'GX — Features' };
    document.title = titles[pathname] || 'GX';
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fbfcfe] text-ink">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fbfcfe]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link className="flex items-center gap-2.5 text-lg font-black tracking-tight text-ink" to="/" onClick={close}>
            <img src="/gx.png" alt="GX" className="h-9 w-9 rounded-xl object-contain" /> GX
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Public navigation">
            {navigation.map((item) => <NavLink key={item.to} to={item.to} className="text-sm font-bold text-ink-muted transition hover:text-ink">{item.label}</NavLink>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link className="text-sm font-bold text-ink hover:text-brand" to="/login">Log in</Link>
            <Link className="primary-button min-h-10 px-5 text-sm" to="/register">Get started <Icon name="arrowRight" size={16} /></Link>
          </div>
          <button className="icon-button md:hidden" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'more'} />
          </button>
        </div>
        {open && <nav className="border-t border-line bg-white px-5 py-4 shadow-soft md:hidden" aria-label="Mobile public navigation">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={close} className="rounded-xl px-3 py-3 text-sm font-bold text-ink hover:bg-surface-muted">{item.label}</NavLink>)}
            <Link to="/login" onClick={close} className="rounded-xl px-3 py-3 text-sm font-bold text-ink">Log in</Link>
            <Link to="/register" onClick={close} className="primary-button mt-1 w-full">Get started</Link>
          </div>
        </nav>}
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
          <div><div className="flex items-center gap-2 font-black"><img src="/gx.png" alt="" className="h-7 w-7 rounded-lg" /> GX</div><p className="mt-3 max-w-xs text-sm leading-6 text-ink-muted">A more personal place to share, discover, and stay close to the conversations that matter.</p></div>
          <div><p className="text-sm font-black">Product</p><div className="mt-3 grid gap-2 text-sm font-semibold text-ink-muted"><Link to="/features">Features</Link><Link to="/app/explore">Explore</Link></div></div>
          <div><p className="text-sm font-black">Account</p><div className="mt-3 grid gap-2 text-sm font-semibold text-ink-muted"><Link to="/login">Log in</Link><Link to="/register">Sign up</Link><Link to="/about">About GX</Link></div></div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-line px-5 py-5 text-xs font-semibold text-ink-muted lg:px-8">© {new Date().getFullYear()} GX. Made for real expression.</div>
      </footer>
    </div>
  );
};

export default PublicLayout;
