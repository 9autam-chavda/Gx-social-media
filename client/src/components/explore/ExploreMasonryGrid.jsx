import { useMemo } from 'react';
import EmptyState from '../common/EmptyState';
import { createContentKey, isThoughtPost } from '../content/contentCardUtils';
import ExploreMediaCard from './ExploreMediaCard';
import ExploreThoughtCard from './ExploreThoughtCard';

const tilePatterns = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
];

const getCardSpan = (index, post) => {
  if (isThoughtPost(post)) {
    return index % 5 === 0 ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1';
  }

  return tilePatterns[index % tilePatterns.length];
};

const ExploreMasonryGrid = ({ posts = [], emptyTitle = 'Nothing to discover yet', emptyDescription = 'Try another search or check back later.' }) => {
  const normalizedPosts = useMemo(() => posts.filter(Boolean), [posts]);

  if (!normalizedPosts.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid auto-rows-[8rem] grid-cols-2 gap-1.5 sm:auto-rows-[9.5rem] sm:grid-cols-4 sm:gap-2 lg:grid-cols-5 xl:grid-cols-6">
      {normalizedPosts.map((post, index) => {
        const spanClass = getCardSpan(index, post);

        return (
          <div className={`min-h-0 animate-[modalEnter_220ms_ease_both] ${spanClass}`} key={createContentKey(post)}>
            {isThoughtPost(post) ? <ExploreThoughtCard post={post} /> : <ExploreMediaCard post={post} featured={index % 8 === 0} />}
          </div>
        );
      })}
    </div>
  );
};

export default ExploreMasonryGrid;
