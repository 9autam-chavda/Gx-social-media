import { Link, Navigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useAuth } from '../hooks/useAuth';

const features = [
  ['01', 'Share', 'Post the moments and ideas that feel like you.'],
  ['02', 'Discover', 'Find people and visual posts beyond your usual feed.'],
  ['03', 'Connect', 'Follow people and keep up with what they share.'],
];

const ExploreTile = ({ color, label, tall = false }) => (
  <div className={`relative min-h-0 overflow-hidden rounded-xl ${tall ? 'row-span-2' : ''}`} style={{ backgroundColor: color }}>
    <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-black text-slate-700 backdrop-blur">{label}</span>
  </div>
);

const ProductPreview = ({ compact = false }) => (
  <div className={`overflow-hidden rounded-2xl border border-line bg-white shadow-card sm:rounded-3xl ${compact ? 'p-3' : 'p-3 sm:p-5'}`}>
    <div className="flex items-center justify-between border-b border-line px-1 pb-3 sm:pb-4">
      <div className="flex items-center gap-2"><img src="/gx.png" alt="" className="h-7 w-7 rounded-lg" /><span className="text-sm font-black">Explore</span></div>
      <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-ink-muted">For you</span>
    </div>
    <div className={`mt-3 grid grid-cols-3 gap-3 sm:mt-5 sm:gap-5 ${compact ? 'h-[225px] sm:h-[300px]' : 'h-[270px] sm:h-[420px]'}`}>
      <div className="grid gap-3 sm:gap-5"><ExploreTile color="#c7d9f5" label="places" /><ExploreTile color="#ded2f7" label="objects" tall /></div>
      <div className="grid gap-3 sm:gap-5"><ExploreTile color="#f2d6c7" label="colour" tall /><ExploreTile color="#f4e7ad" label="weekend" /></div>
      <div className="grid gap-3 sm:gap-5"><ExploreTile color="#cce8d8" label="notes" /><ExploreTile color="#c9e3e8" label="studio" tall /></div>
    </div>
  </div>
);

const Landing = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/app" replace />;

  return <>
    <section className="mx-auto grid min-h-[calc(80vh-4rem)] max-w-6xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-20">
      <div><p className="text-xs font-black uppercase tracking-[.16em] text-brand">GX Social</p><h1 className="mt-4 max-w-xl text-5xl font-black tracking-[-0.06em] text-ink sm:text-6xl lg:text-7xl">Share what matters.</h1><p className="mt-6 max-w-md text-lg leading-8 text-ink-muted">A simple social space to share moments, discover people, and stay connected.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="primary-button min-h-12 px-6" to="/register">Get started <Icon name="arrowRight" size={17} /></Link><Link className="secondary-button min-h-12 px-6" to="/login">Log in</Link></div></div>
      <div className="mx-auto w-full max-w-[590px]"><ProductPreview compact /></div>
    </section>
    <section id="about" className="scroll-mt-20 border-y border-line bg-white"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-8"><p className="text-xs font-black uppercase tracking-[.16em] text-brand">Social, without the noise</p><div><h2 className="max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">GX is a focused place for sharing, discovering, and connecting through the things you care about.</h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">Posts, profiles, and people—kept simple so the experience stays personal.</p></div></div></section>
    <section id="features" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:px-8"><div className="max-w-xl"><p className="text-xs font-black uppercase tracking-[.16em] text-brand">The essentials</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Made for the way people actually share.</h2></div><div className="mt-10 border-y border-line">{features.map(([number, title, copy]) => <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr_1.2fr] sm:items-baseline sm:gap-6" key={title}><span className="text-xs font-black tracking-[.16em] text-brand">{number}</span><h3 className="text-xl font-black tracking-tight">{title}</h3><p className="max-w-sm text-sm leading-6 text-ink-muted">{copy}</p></article>)}</div></section>
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20 lg:px-8"><div className="mb-7 flex items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.16em] text-brand">A look inside</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Discover what’s worth following.</h2></div><Icon name="compass" className="mb-1 hidden text-brand sm:block" size={22} /></div><ProductPreview /></section>
    <section className="border-t border-line bg-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-5 py-16 sm:flex-row sm:items-end sm:py-20 lg:px-8"><div><p className="text-xs font-black uppercase tracking-[.16em] text-brand">Your space is waiting</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Ready to share?</h2><p className="mt-3 text-ink-muted">Join GX and make the space yours.</p></div><Link className="primary-button min-h-12 shrink-0 px-6" to="/register">Get started <Icon name="arrowRight" size={17} /></Link></div></section>
  </>;
};

export default Landing;
