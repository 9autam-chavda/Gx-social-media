import { NavLink } from 'react-router-dom';
import { mobileBottomNavItems, getProfileNavItem } from './navItems';
import { useAuth } from '../../hooks/useAuth';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const navItems = [...mobileBottomNavItems, getProfileNavItem(user?.username ? `/app/profile/${user.username}` : '/app/feed')];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/95 px-2 pb-[calc(0.375rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_22px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {navItems.map((item) => (
          <NavLink
            aria-label={item.label}
            className={({ isActive }) =>
              `group grid h-12 place-items-center rounded-xl text-[1.05rem] transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isActive ? 'bg-brand text-white shadow-sm' : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
              }`
            }
            key={item.to}
            to={item.to}
          >
            {({ isActive }) => (
              <span className="grid h-6 w-6 place-items-center transition-transform duration-150 group-hover:scale-105">
                {isActive ? <item.activeIcon size={24} strokeWidth={2} /> : <item.icon size={24} strokeWidth={2} />}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
