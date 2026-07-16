import { useMemo, useState } from 'react';
import FeedList from '../components/feed/FeedList';
import FeedComposer from '../components/feed/FeedComposer';
import FeedLayout from '../components/feed/FeedLayout';
import PageHeader from '../components/layout/PageHeader';
import { useFeed } from '../hooks/useFeed';
import { useAuth } from '../hooks/useAuth';

const Feed = () => {
  const feed = useFeed();
  const { user } = useAuth();

  const [filterType, setFilterType] = useState('all');

  const visiblePosts = useMemo(() => {
    if (!feed.posts) return [];
    if (filterType === 'media') {
      return feed.posts.filter(
        (post) => post?.type === 'image' || post?.type === 'video'
      );
    }
    if (filterType === 'thoughts') {
      return feed.posts.filter((post) => post?.type === 'text');
    }
    return feed.posts;
  }, [feed.posts, filterType]);

  return (
    <FeedLayout>
      <PageHeader
        badge="Today"
        title="Feed"
        description="Recent posts from people you follow."
      />

      <div className="mb-3 sm:mb-4">
        <div className="segmented-control">
        {[
          { id: 'all', label: 'All' },
          { id: 'media', label: 'Media' },
          { id: 'thoughts', label: 'Thoughts' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className="segmented-option"
            data-active={filterType === tab.id}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </div>
      <div className="mb-3 sm:mb-4">
        <FeedComposer user={user} />
      </div>

      <FeedList
        posts={visiblePosts}
        loading={feed.loading}
        loadingMore={feed.loadingMore}
        error={feed.error}
        onPostChange={feed.updatePost}
        onLoadMore={feed.loadMore}
        hasMore={feed.pagination?.hasNext}
        empty={{
          title: 'No posts yet',
          description: 'Create your first post to start sharing in the feed.',
        }}
      />
    </FeedLayout>
  );
};

export default Feed;
