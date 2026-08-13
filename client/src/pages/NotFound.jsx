import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const NotFound = () => { const { isAuthenticated } = useAuth(); return <main className="grid min-h-screen place-items-center bg-surface-muted px-5 text-center"><div><img src="/gx.png" alt="GX" className="mx-auto h-12 w-12 rounded-xl"/><p className="mt-8 text-sm font-black text-brand">404</p><h1 className="mt-2 text-4xl font-black">This page isn’t here.</h1><p className="mt-3 text-ink-muted">It may have moved, or never existed in the first place.</p><Link className="primary-button mt-7" to={isAuthenticated ? '/app' : '/'}>{isAuthenticated ? 'Go to app' : 'Back home'}</Link></div></main>; };
export default NotFound;
