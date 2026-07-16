import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Icon from '../icons/Icon';

import EmptyState from '../common/EmptyState';
import UserSkeleton from './UserSkeleton';

const RelationshipModal = ({
  open,
  title,
  count,
  userId,
  fetchUsers,
  extractUsers,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  renderList,
  onClose,
}) => {
  const [users, setUsers] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [loadingMore, setLoadingMore] =
    useState(false);
  const [error, setError] =
    useState('');
  const [pagination, setPagination] =
    useState(null);

  const loadUsers = useCallback(
    async (page = 1, append = false) => {
      if (!userId) return;

      append
        ? setLoadingMore(true)
        : setLoading(true);

      setError('');

      try {
        const data =
          await fetchUsers(userId, page);
        const incoming =
          extractUsers(data);

        setUsers((prev) =>
          append
            ? [...prev, ...incoming]
            : incoming
        );
        setPagination(
          data?.pagination || null
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            'Unable to load users'
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [extractUsers, fetchUsers, userId]
  );

  useEffect(() => {
    let timer;

    if (open && userId) {
      timer = setTimeout(() => {
        loadUsers(1, false);
      }, 0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loadUsers, open, userId]);

  if (!open) return null;

  const defaultEmpty = (props) => <Icon name="users" {...props} />;
  const EmptyIcon = emptyIcon || defaultEmpty;

  return (
    <div
      className="
        fixed inset-0 z-50 grid place-items-end
        bg-slate-950/60 p-0 backdrop-blur-md
        sm:place-items-center sm:p-4
      "
    >
      <section
        className="
          flex max-h-[92vh] w-full max-w-2xl
          animate-[modalEnter_160ms_ease-out]
          flex-col overflow-hidden rounded-t-3xl
          bg-white shadow-soft ring-1 ring-white/20
          sm:rounded-2xl
        "
      >
        <header
          className="
            sticky top-0 z-10 flex items-center
            justify-between gap-3 border-b
            border-line bg-white/95 px-4 py-4
            backdrop-blur-xl sm:px-5
          "
        >
            <button
            className="
              grid h-10 w-10 place-items-center rounded-full
              text-ink-muted transition-colors duration-150
              hover:bg-surface-muted hover:text-ink
              active:scale-[0.98]
            "
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <Icon name="arrowLeft" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h2 className="truncate text-lg font-black tracking-tight text-ink">
              {title}
            </h2>
            {count !== undefined && (
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {count} {title.toLowerCase()}
              </p>
            )}
          </div>

          <div className="h-10 w-10" />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
          {loading ? (
            <UserSkeleton />
            ) : error ? (
            <EmptyState
              icon={() => <Icon name="userAdd" />}
              title={`${title} unavailable`}
              description={error}
            />
          ) : users.length === 0 ? (
            <EmptyState
              icon={EmptyIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            renderList(users, setUsers)
          )}
        </div>

        {pagination?.hasNext && (
          <div className="border-t border-line bg-white p-4">
            <button
              className="secondary-button w-full"
              type="button"
              onClick={() =>
                loadUsers(
                  pagination.currentPage + 1,
                  true
                )
              }
              disabled={loadingMore}
            >
              {loadingMore
                ? 'Loading...'
                : 'Load more'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default RelationshipModal;
