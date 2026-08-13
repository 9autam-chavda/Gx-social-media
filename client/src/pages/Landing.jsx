import { Link, Navigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useAuth } from '../hooks/useAuth';

const features = [
  ['01', 'Share', 'Post the moments and ideas that feel like you.'],
  ['02', 'Discover', 'Find people and visual posts beyond your usual feed.'],
  ['03', 'Connect', 'Follow people and keep up with what they share.'],
];

const ExploreTile = ({ color, label, tall = false }) => (
  <div className={`relative min-h-0 overflow-hidden rounded-control ${tall ? 'row-span-2' : ''}`} style={{ backgroundColor: color }}>
    <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-ink-muted backdrop-blur">{label}</span>
  </div>
);

const ProductPreview = () => (
  <div className="overflow-hidden rounded-card border border-line bg-white p-3 shadow-card sm:p-5">
    <div className="flex items-center justify-between border-b border-line px-1 pb-3 sm:pb-4">
      <div className="flex items-center gap-2"><img src="/gx.png" alt="" className="h-7 w-7 rounded-control" /><span className="text-sm font-bold">Explore</span></div>
      <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink-muted">For you</span>
    </div>
    <div className="mt-3 grid h-[225px] grid-cols-3 gap-3 sm:mt-5 sm:h-[300px] sm:gap-5">
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
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">GX Social</p><h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">Share what matters.</h1><p className="mt-6 max-w-md text-lg leading-8 text-ink-muted">A simple social space to share moments, discover people, and stay connected.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="primary-button min-h-12 px-6" to="/register">Get started <Icon name="arrowRight" size={16} /></Link><Link className="secondary-button min-h-12 px-6" to="/login">Log in</Link></div></div>
      <div className="mx-auto w-full max-w-[590px]"><ProductPreview /></div>
    </section>
    <section id="about" className="scroll-mt-20 border-y border-line bg-white"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Social, without the noise</p><div><h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">A focused place for sharing, discovering, and connecting.</h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">Posts, profiles, and people—kept simple and personal.</p></div></div></section>
    <section id="features" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:px-8"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">The essentials</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Made for the way people share.</h2></div><div className="mt-10 border-y border-line">{features.map(([number, title, copy]) => <article className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr_1.2fr] sm:items-baseline sm:gap-6" key={title}><span className="text-xs font-bold tracking-[.16em] text-brand">{number}</span><h3 className="text-xl font-bold tracking-tight">{title}</h3><p className="max-w-sm text-sm leading-6 text-ink-muted">{copy}</p></article>)}</div></section>
    <section className="border-t border-line bg-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-5 py-16 sm:flex-row sm:items-end sm:py-20 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">GX</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Ready to share?</h2></div><Link className="primary-button min-h-12 shrink-0 px-6" to="/register">Get started <Icon name="arrowRight" size={16} /></Link></div></section>
  </>;
};

export default Landing;
