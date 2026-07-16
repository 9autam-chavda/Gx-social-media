const FeedSkeletonCard = ({ media = true }) => (
  <article className="feed-card overflow-hidden p-3 sm:p-5">
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="skeleton h-9 w-9 rounded-full sm:h-11 sm:w-11" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="skeleton h-4 w-36 rounded-full" />
        <div className="skeleton h-3 w-24 rounded-full" />
      </div>
    </div>

    {media ? (
      <div className="-mx-3 mt-3 overflow-hidden sm:-mx-5 sm:mt-4">
        <div className="skeleton aspect-square w-full rounded-none sm:aspect-[4/5]" />
      </div>
    ) : (
      <div className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
        <div className="skeleton h-4 w-11/12 rounded-full sm:h-5" />
        <div className="skeleton h-4 w-4/5 rounded-full sm:h-5" />
        <div className="skeleton h-4 w-2/3 rounded-full sm:h-5" />
      </div>
    )}

    <div className="mt-3 flex items-center justify-between sm:mt-4">
      <div className="flex gap-2 sm:gap-3">
        <div className="skeleton h-8 w-16 rounded-full sm:h-10 sm:w-20" />
        <div className="skeleton h-8 w-16 rounded-full sm:h-10 sm:w-20" />
      </div>
      <div className="skeleton h-8 w-8 rounded-full sm:h-10 sm:w-10" />
    </div>
  </article>
);

const FeedSkeleton = ({ count = 3 }) => (
  <div className="space-y-3 sm:space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <FeedSkeletonCard key={index} media={index !== 1} />
    ))}
  </div>
);

export default FeedSkeleton;
