import { NavLink } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Icon from '../icons/Icon';
import NotificationBadge from './NotificationBadge';
import { useAuth } from '../../hooks/useAuth';

const actionClassName = ({ isActive }) =>
  `inline-flex h-10 w-10 items-center justify-center rounded-full border text-ink transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
    isActive
      ? 'border-brand/30 bg-brand-soft text-brand shadow-sm'
      : 'border-line/70 bg-white hover:border-brand/40 hover:bg-surface-muted hover:text-brand'
  }`;

const Navbar = () => {
  const { user, unreadNotifications, logout } = useAuth();
  const profilePath = user?.username ? `/profile/${user.username}` : '/feed';

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-xl sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
        <NavLink className="flex items-center gap-3 text-xl font-black tracking-normal text-ink" to="/feed">
          <img src="/gx.png" alt="Gx Logo" className="h-9 w-9 rounded-xl object-contain sm:h-10 sm:w-10" />
          <span>GX</span>
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-black leading-5 text-ink">@{user?.username}</p>
            <p className="truncate text-xs font-semibold leading-4 text-ink-muted">Logged in</p>
          </div>
          <NavLink className={actionClassName} to="/notifications" aria-label="Notifications">
            {({ isActive }) => (
              <span className="relative grid h-5 w-5 place-items-center">
                <Icon name={isActive ? 'notificationActive' : 'notification'} size={20} />
                {unreadNotifications > 0 && <NotificationBadge count={unreadNotifications} className="absolute -right-1 -top-1" />}
              </span>
            )}
          </NavLink>
          <NavLink to={profilePath} aria-label="Profile" className="rounded-full ring-1 ring-transparent transition-all duration-200 hover:ring-brand/20">
            <Avatar user={user} size="sm" />
          </NavLink>
          <button
            className="hidden min-h-10 items-center gap-2 rounded-full border border-line/80 bg-white px-3 text-sm font-black text-ink transition-all duration-150 hover:border-brand/40 hover:bg-surface-muted hover:text-brand active:scale-[0.98] sm:inline-flex"
            onClick={logout}
            type="button"
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
