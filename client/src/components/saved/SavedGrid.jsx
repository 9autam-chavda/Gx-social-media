import EmptyState from '../common/EmptyState';
import {
  createContentKey,
  isThoughtPost,
} from '../content/contentCardUtils';
import SavedMediaCard from './SavedMediaCard';
import SavedThoughtCard from './SavedThoughtCard';

const SavedGrid = ({
  posts = [],
  emptyTitle,
  emptyDescription,
}) => {
  if (!posts.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
      {posts.map((post) =>
        isThoughtPost(post) ? (
          <SavedThoughtCard key={createContentKey(post)} post={post} />
        ) : (
          <SavedMediaCard key={createContentKey(post)} post={post} />
        )
      )}
    </div>
  );
};

export default SavedGrid;
