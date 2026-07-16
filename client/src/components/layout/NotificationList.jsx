import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Icon from '../icons/Icon';

const typeConfig = {
  follow: {
    icon: 'user',
    title: 'started following you',
  },
  like: {
    icon: 'like',
    title: 'liked your post',
  },
  comment: {
    icon: 'comment',
    title: 'commented on your post',
  },
};

const formatTime = (value) => {
  if (!value) return '';

  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getPreview = (notification) => {
  const text =
    notification.type === 'comment'
      ? notification.comment?.text
      : notification.post?.caption;

  if (!text) return 'View the activity on your post.';

  return `"${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`;
};

const NotificationList = ({ notifications = [], onMarkRead }) => {
  const [now] = useState(() => Date.now());

  const groups = useMemo(() => {
    const grouped = { Today: [], Yesterday: [], Earlier: [] };

    notifications.forEach((notification) => {
      const timestamp = new Date(notification.createdAt).getTime();
      const diffDays = Math.floor((now - timestamp) / 86400000);

      if (diffDays === 0) grouped.Today.push(notification);
      else if (diffDays === 1) grouped.Yesterday.push(notification);
      else grouped.Earlier.push(notification);
    });

    return grouped;
  }, [notifications, now]);

  const renderItem = (notification) => {
    const config = typeConfig[notification.type] || typeConfig.follow;
    const sender = notification.sender || {};
    const targetPath =
      notification.type === 'follow'
        ? `/profile/${sender.username}`
        : `/post/${notification.post?._id}`;

    return (
      <div
        className={`relative border-t border-line/80 px-3 py-3 transition-colors duration-150 first:border-t-0 sm:px-4 ${
          notification.isRead
            ? 'bg-white hover:bg-surface-muted/60'
            : 'bg-brand-soft/35 hover:bg-brand-soft/55'
        }`}
        key={notification._id}
      >
        {!notification.isRead && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
        )}

        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar user={sender} size="sm" />
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-surface text-ink-muted">
              <Icon name={config.icon} size={9} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-ink">
              <Link
                className="font-black transition-colors duration-150 hover:text-brand"
                to={`/profile/${sender.username}`}
              >
                @{sender.username || 'Unknown'}
              </Link>{' '}
              {config.title}
              <span className="ml-2 whitespace-nowrap text-xs text-ink-muted">
                {formatTime(notification.createdAt)}
              </span>
            </p>

            <p className="mt-1 line-clamp-1 text-xs leading-5 text-ink-muted sm:text-sm">
              {getPreview(notification)}
            </p>

            <div className="mt-1.5 flex items-center gap-3">
              <Link
                className="text-xs font-bold text-brand transition-colors duration-150 hover:text-teal-800"
                to={targetPath}
              >
                View
              </Link>
              {!notification.isRead && onMarkRead && (
                <button
                  className="text-xs font-bold text-ink-muted transition-colors duration-150 hover:text-ink"
                  onClick={() => onMarkRead(notification._id)}
                  type="button"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {['Today', 'Yesterday', 'Earlier'].map((section) =>
        groups[section].length ? (
          <section key={section}>
            <h2 className="border-y border-line/80 bg-surface-muted px-4 py-2 text-xs font-bold text-ink-muted first:border-t-0">
              {section}
            </h2>
            <div>{groups[section].map(renderItem)}</div>
          </section>
        ) : null
      )}
    </div>
  );
};

export default NotificationList;
