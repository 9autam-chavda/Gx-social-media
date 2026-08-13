import { Link } from 'react-router-dom';
import Icon from '../components/icons/Icon';

const coreFeatures = [
  ['01', 'Share', 'Post the moments and ideas that feel like you.'],
  ['02', 'Discover', 'Find fresh perspectives beyond your usual feed.'],
  ['03', 'Connect', 'Follow people and keep up with what they share.'],
];

const ExploreTile = ({ color, label, tall = false }) => (
  <div className={`relative overflow-hidden rounded-xl ${tall ? 'row-span-2' : ''}`} style={{ backgroundColor: color }}>
    <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-black text-slate-700 backdrop-blur">{label}</span>
  </div>
);

const Features = () => (
  <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
    <section className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[.16em] text-brand">Built for social</p>
      <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">
        Share. Discover.<br />Connect.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">
        GX keeps social simple: a place for what matters to you and the people you want to keep close.
      </p>
    </section>

    <section className="mt-16 border-y border-line sm:mt-20" aria-label="Core GX features">
      {coreFeatures.map(([number, title, description]) => (
        <article className="grid gap-3 border-line py-6 first:pt-7 last:pb-7 sm:grid-cols-[5rem_1fr_1.25fr] sm:items-baseline sm:gap-6" key={title}>
          <span className="text-xs font-black tracking-[.16em] text-brand">{number}</span>
          <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
          <p className="max-w-sm text-sm leading-6 text-ink-muted">{description}</p>
        </article>
      ))}
    </section>

    <section className="mt-16 sm:mt-20" aria-labelledby="explore-preview-title">
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-brand">A look inside</p>
          <h2 id="explore-preview-title" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Made to make discovery feel personal.</h2>
        </div>
        <Icon name="compass" className="mb-1 hidden text-brand sm:block" size={22} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-card sm:rounded-3xl sm:p-5">
        <div className="flex items-center justify-between border-b border-line pb-3 sm:pb-4">
          <div className="flex items-center gap-2"><img src="/gx.png" alt="" className="h-7 w-7 rounded-lg" /><span className="text-sm font-black">Explore</span></div>
          <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-ink-muted">For you</span>
        </div>
        <div className="mt-3 grid h-[250px] grid-cols-3 gap-3 sm:mt-5 sm:h-[390px] sm:gap-5">
          <div className="grid gap-3 sm:gap-5"><ExploreTile color="#c7d9f5" label="places" /><ExploreTile color="#ded2f7" label="objects" tall /></div>
          <div className="grid gap-3 sm:gap-5"><ExploreTile color="#f2d6c7" label="colour" tall /><ExploreTile color="#f4e7ad" label="weekend" /></div>
          <div className="grid gap-3 sm:gap-5"><ExploreTile color="#cce8d8" label="notes" /><ExploreTile color="#c9e3e8" label="studio" tall /></div>
        </div>
      </div>
    </section>

    <section className="mt-16 border-t border-line pt-12 sm:mt-20 sm:pt-16">
      <p className="text-xs font-black uppercase tracking-[.16em] text-brand">Make the space yours</p>
      <div className="mt-3 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div><h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">Ready to share?</h2><p className="mt-3 text-ink-muted">Join GX and make the space yours.</p></div>
        <Link className="primary-button min-h-12 shrink-0 px-6" to="/register">Get started <Icon name="arrowRight" size={17} /></Link>
      </div>
    </section>
  </div>
);

export default Features;
