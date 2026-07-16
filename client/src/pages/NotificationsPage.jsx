import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import Icon from '../components/icons/Icon';
import NotificationBell from '../components/layout/NotificationBell';
import NotificationList from '../components/layout/NotificationList';
import PageHeader from '../components/layout/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { getErrorMessage } from '../utils/api';

const NotificationsPage = () => {
  const { unreadNotifications, refreshUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationService.getNotifications({
        page: 1,
        limit: 30,
      });
      setNotifications(data.notifications || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load notifications'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleLoadMore = async () => {
    if (loadingMore || !pagination?.hasNext) return;

    try {
      setLoadingMore(true);
      setError('');
      const data = await notificationService.getNotifications({
        page: (pagination.page || 1) + 1,
        limit: pagination.limit || 30,
      });

      setNotifications((current) => [
        ...current,
        ...(data.notifications || []).filter(
          (incoming) => !current.some((item) => item._id === incoming._id)
        ),
      ]);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load more notifications'));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      const updated = await notificationService.markAsRead(notificationId);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? updated : item
        )
      );
      refreshUnreadCount();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update notification status'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      refreshUnreadCount();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to mark all notifications as read'));
    }
  };

  const visibleNotifications = useMemo(
    () =>
      showUnreadOnly
        ? notifications.filter((item) => !item.isRead)
        : notifications,
    [notifications, showUnreadOnly]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PageHeader
        badge="Activity"
        description="Recent followers, likes, comments, and mentions."
        title="Notifications"
      />

      <div className="app-panel flex flex-wrap items-center gap-3 p-3 sm:justify-between sm:p-4">
        <div className="flex items-center gap-3">
          <NotificationBell count={unreadNotifications} />
          <p className="text-sm font-semibold text-ink-muted">
            {unreadNotifications ? `${unreadNotifications} unread` : 'You are all caught up'}
          </p>
        </div>

        <div className="segmented-control">
          <button
            className="segmented-option"
            data-active={!showUnreadOnly}
            onClick={() => setShowUnreadOnly(false)}
            type="button"
          >
            All
          </button>
          <button
            className="segmented-option"
            data-active={showUnreadOnly}
            onClick={() => setShowUnreadOnly(true)}
            type="button"
          >
            Unread
          </button>
        </div>

        <button
          className="secondary-button min-h-10 px-4 py-2 text-sm disabled:opacity-50"
          disabled={!notifications.some((item) => !item.isRead)}
          onClick={handleMarkAllRead}
          type="button"
        >
          Mark all read
        </button>
      </div>

      {error && <div className="app-alert">{error}</div>}

      <div className="app-panel overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-3">
            {[0, 1, 2, 3, 4].map((item) => (
              <div className="skeleton h-16 rounded-2xl" key={item} />
            ))}
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="p-3">
            <EmptyState
              description={
                showUnreadOnly
                  ? 'No unread notifications. Switch back to All to see older activity.'
                  : 'Likes, comments, and follows will appear here.'
              }
              icon={() => <Icon name="notification" />}
              title="No notifications yet"
            />
          </div>
        ) : (
          <>
            <NotificationList
              notifications={visibleNotifications}
              onMarkRead={handleMarkRead}
            />
            {!showUnreadOnly && pagination?.hasNext && (
              <div className="border-t border-line p-3 text-center">
                <button
                  className="secondary-button min-h-9 px-4 py-1.5 text-sm"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                  type="button"
                >
                  {loadingMore ? 'Loading...' : 'Load older notifications'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
