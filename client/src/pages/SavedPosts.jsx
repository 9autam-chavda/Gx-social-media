import { useCallback } from 'react';
import Icon from '../components/icons/Icon';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/layout/PageHeader';
import { GridSkeleton } from '../components/common/Skeletons';
import SavedGrid from '../components/saved/SavedGrid';
import { usePaginatedPosts } from '../hooks/usePaginatedPosts';
import { userService } from '../services/userService';

const SavedPosts = () => {
  const fetchSaved = useCallback((params) => userService.getSaved(params), []);
  const saved = usePaginatedPosts(fetchSaved, { limit: 18 });

  return (
    <section className="pb-8">
      <PageHeader
        badge="Collection"
        title="Saved posts"
        description="Your private collection for posts worth revisiting."
      />

      {saved.loading ? (
        <GridSkeleton />
      ) : saved.error ? (
        <EmptyState icon={() => <Icon name="bookmark" />} title="Saved posts are unavailable" description={saved.error} />
      ) : (
        <>
          <SavedGrid
            posts={saved.posts}
            emptyTitle="No saved posts yet"
            emptyDescription="Tap the bookmark icon on a post to save it here."
          />
          {saved.pagination?.hasNext && (
            <button className="secondary-button mt-4 w-full rounded-full sm:mt-6" onClick={saved.loadMore} disabled={saved.loadingMore} type="button">
              {saved.loadingMore ? 'Loading...' : 'Load more'}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default SavedPosts;
