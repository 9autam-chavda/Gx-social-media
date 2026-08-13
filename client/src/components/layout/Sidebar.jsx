import { NavLink } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Icon from '../icons/Icon';
import { desktopSidebarNavItems, getProfileNavItem } from './navItems';
import { useAuth } from '../../hooks/useAuth';

const navClass = ({ isActive }) =>
  `group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
    isActive
      ? 'bg-white/10 text-white shadow-sm'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const profilePath = user?.username ? `/app/profile/${user.username}` : '/app/feed';
  const navItems = [...desktopSidebarNavItems, getProfileNavItem(profilePath)];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#1E293B] px-4 py-5 text-white shadow-[8px_0_28px_rgba(15,23,42,0.08)] lg:flex">
      <NavLink className="mb-6 flex shrink-0 items-center gap-3 rounded-xl px-2 py-1 text-xl font-black tracking-normal text-white" to="/app/feed">
        <img src="/gx.png" alt="Gx Logo" className="h-9 w-9 rounded-lg bg-white object-contain p-1" />
        <span>GX</span>
      </NavLink>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto py-1" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink className={navClass} key={item.to} to={item.to}>
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 h-5 w-1 rounded-full bg-brand transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                  }`}
                />
                <span className="grid h-5 w-5 shrink-0 place-items-center text-[1.05rem]">
                  {isActive ? <item.activeIcon size={22} strokeWidth={2} /> : <item.icon size={22} strokeWidth={2} />}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 shrink-0 rounded-xl border border-white/10 bg-white/10 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar user={user} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">@{user?.username}</p>
            <p className="truncate text-xs font-semibold text-slate-300">{user?.email}</p>
          </div>
        </div>
        <button
          className="primary-button mt-3 w-full min-h-10 bg-white px-3 py-2 text-sm text-slate-900 shadow-none hover:bg-brand hover:text-white"
          onClick={logout}
          type="button"
        >
          <Icon name="logout" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
