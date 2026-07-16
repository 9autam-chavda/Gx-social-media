import { useEffect, useRef } from 'react';
import Icon from '../icons/Icon';
import EmptyState from '../common/EmptyState';
import FeedContainer from './FeedContainer';
import FeedPostCard from './FeedPostCard';
import FeedSkeleton from './FeedSkeleton';

const FeedList = ({
  posts,
  loading,
  loadingMore,
  error,
  onPostChange,
  onLoadMore,
  hasMore,
  empty,
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loadingMore || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore?.();
        }
      },
      { rootMargin: '480px 0px' }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading) {
    return <FeedSkeleton count={3} />;
  }

  if (error) {
    return (
      <EmptyState
        icon={() => <Icon name="inbox" />}
        title="Could not load posts"
        description={error}
      />
    );
  }

  if (!posts.length) {
    return (
      <EmptyState
        icon={() => <Icon name="inbox" />}
        title={
          empty?.title ||
          'No posts yet'
        }
        description={
          empty?.description ||
          'Follow people or create your first post to fill this space.'
        }
        action={empty?.action}
      />
    );
  }

  return (
    <FeedContainer>
      {posts.map((post) => (
        <FeedPostCard
          key={post._id}
          post={post}
          onPostChange={onPostChange}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-1" ref={sentinelRef}>
          <button
            className="secondary-button min-h-10 px-5 py-2 text-sm"
            onClick={onLoadMore}
            disabled={loadingMore}
            type="button"
          >
            {loadingMore
              ? 'Loading...'
              : 'Load more'}
          </button>
        </div>
      )}

      {loadingMore && (
        <div className="pt-1">
          <FeedSkeleton count={2} />
        </div>
      )}
    </FeedContainer>
  );
};

export default FeedList;
