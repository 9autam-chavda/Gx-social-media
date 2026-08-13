import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import { useAuth } from '../hooks/useAuth';

const visuals = ['#bfe0ff', '#ffd5bd', '#cbe9d7', '#ddd0ff', '#f9e7a8', '#bfe5ec'];
const values = [
  ['compass', 'Discover your next favorite thing', 'Explore posts and people beyond the circle you already know.'],
  ['pen', 'Share in your own voice', 'Publish thoughts and visual moments without turning them into a performance.'],
  ['users', 'Keep up with your people', 'Follow the creators, friends, and perspectives you want close.'],
  ['bookmarkOutline', 'Save what stays with you', 'Build a small collection of posts worth returning to.'],
];

const PreviewCard = ({ color, tall = false, label }) => <div className={`overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-card ${tall ? 'row-span-2' : ''}`}><div className="relative h-full min-h-24 overflow-hidden rounded-xl" style={{ background: color }}><span className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-1 text-[10px] font-black text-slate-700 backdrop-blur">{label}</span></div></div>;

const Landing = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return (
  <>
    <section className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.04fr_.96fr] lg:px-8 lg:pb-28 lg:pt-24">
      <div className="relative z-10 self-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft/50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> GX SOCIAL</p>
        <h1 className="max-w-xl text-5xl font-black tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">Share what feels like you.</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-ink-muted">GX is a quieter, more visual social space for the things you want to say, save, and discover with people who get it.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="primary-button min-h-12 px-6" to="/register">Get started <Icon name="arrowRight" size={18} /></Link><Link className="secondary-button min-h-12 px-6" to="/login">Log in</Link></div>
        <p className="mt-6 text-sm font-semibold text-ink-muted">Posts, profiles, discovery, and real conversations—already in one place.</p>
      </div>
      <div className="relative mx-auto w-full max-w-[520px]">
        <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-brand-soft/45 blur-3xl" />
        <div className="rotate-[-2deg] rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_30px_70px_rgba(15,23,42,.14)] sm:p-4">
          <div className="flex items-center justify-between border-b border-line px-2 pb-3"><div className="flex items-center gap-2"><img src="/gx.png" alt="" className="h-7 w-7 rounded-lg"/><span className="text-sm font-black">GX</span></div><Icon name="more" className="text-ink-muted" /></div>
          <div className="mt-3 grid grid-cols-[.88fr_1.12fr] gap-3"><div className="grid gap-3"><PreviewCard color="#c6daf7" label="design notes" tall /><PreviewCard color="#f5d6c5" label="morning walk" /></div><div className="rounded-2xl border border-line bg-surface-muted p-3"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#334155] text-xs font-black text-white">A</span><div><p className="text-xs font-black">@alina</p><p className="text-[10px] text-ink-muted">just now</p></div></div><p className="mt-3 text-sm font-bold leading-5">The best ideas always start a little unfinished.</p><div className="mt-3 h-32 rounded-xl bg-[#d8eadc]" /><div className="mt-3 flex gap-4 text-xs font-bold text-ink-muted"><span>♡ 24</span><span>◌ 6</span><span>⌑ Save</span></div></div></div>
        </div>
        <div className="absolute -bottom-5 -left-6 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft"><p className="text-xs font-black">Made for your perspective</p><p className="mt-1 text-xs text-ink-muted">Not an endless scroll.</p></div>
      </div>
    </section>
    <section className="border-y border-line bg-white"><div className="mx-auto max-w-6xl px-5 py-16 lg:px-8"><div className="max-w-xl"><p className="eyebrow text-brand">A SOCIAL SPACE, NOT A STAGE</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A place built around your point of view.</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map(([icon, title, text]) => <article key={title} className="rounded-2xl border border-line bg-[#fbfcfe] p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand"><Icon name={icon} /></span><h3 className="mt-5 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-muted">{text}</p></article>)}</div></div></section>
    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-black uppercase tracking-[.18em] text-brand">Explore</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">There’s always a fresh perspective nearby.</h2><p className="mt-5 text-base leading-7 text-ink-muted">Browse an evolving mix of visual posts and ideas, then follow the people whose work you want more of.</p><Link className="secondary-button mt-7" to="/app/explore">Explore GX <Icon name="arrowRight" size={16}/></Link></div><div className="grid h-[340px] grid-cols-3 gap-3 sm:h-[420px]"><div className="grid gap-3"><PreviewCard color={visuals[0]} label="places" /><PreviewCard color={visuals[3]} label="objects" tall /></div><div className="grid gap-3"><PreviewCard color={visuals[1]} label="color" tall /><PreviewCard color={visuals[4]} label="weekend" /></div><div className="grid gap-3"><PreviewCard color={visuals[2]} label="notes" /><PreviewCard color={visuals[5]} label="studio" tall /></div></div></div></section>
    <section className="bg-[#152238] text-white"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_.9fr] lg:px-8"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-200">Your identity, in context</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">More than a profile. Your corner of GX.</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">Give the things you share a home, keep your saved inspiration close, and let people find the work and thoughts that represent you.</p></div><div className="rounded-3xl bg-white p-4 text-ink shadow-2xl"><div className="h-20 rounded-2xl bg-[#c9daf1]"/><div className="-mt-8 ml-4 flex items-end justify-between"><span className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-[#3b4864] font-black text-white">M</span><button className="secondary-button min-h-9 px-3 text-xs">Following</button></div><div className="px-4 pb-3"><p className="mt-3 font-black">Mira S.</p><p className="text-sm text-ink-muted">@mira</p><p className="mt-3 text-sm">Small observations, photos, and things worth keeping.</p><div className="mt-4 flex gap-5 text-sm"><b>38 <span className="font-medium text-ink-muted">posts</span></b><b>124 <span className="font-medium text-ink-muted">following</span></b></div></div></div></div></section>
    <section className="mx-auto max-w-6xl px-5 py-20 text-center lg:px-8"><p className="text-xs font-black uppercase tracking-[.18em] text-brand">Start with what matters to you</p><h2 className="mx-auto mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Your space is waiting.</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-ink-muted">Create a profile, share a first post, and find the conversations worth returning to.</p><Link className="primary-button mt-8 min-h-12 px-7" to="/register">Get started <Icon name="arrowRight" size={18}/></Link></section>
  </>);
};
export default Landing;
