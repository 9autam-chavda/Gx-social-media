import Masonry from 'react-masonry-css';

import EmptyState from '../common/EmptyState';

import { isThoughtPost } from './contentCardUtils';

const breakpoints = {
  default: 3,
  1024: 2,
  640: 2,
  420: 1,
};

const ContentAwareMasonry = ({
  posts = [],
  emptyTitle = 'No posts found',
  emptyDescription,
  renderMedia,
  renderThought,
}) => {
  if (!posts?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <Masonry
      breakpointCols={breakpoints}
      className="content-masonry-grid"
      columnClassName="content-masonry-column"
    >
      {posts.map((post) =>
        isThoughtPost(post)
          ? renderThought(post)
          : renderMedia(post)
      )}
    </Masonry>
  );
};

export default ContentAwareMasonry;
