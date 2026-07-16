import Icon from '../icons/Icon';
import NotificationBadge from './NotificationBadge';

const NotificationBell = ({ count, className = '' }) => (
  <div className={`relative inline-flex items-center ${className}`}>
    <Icon name="notification" className="text-lg text-ink-muted" />
    <NotificationBadge count={count} className="absolute -top-1 -right-2" />
  </div>
);

export default NotificationBell;
