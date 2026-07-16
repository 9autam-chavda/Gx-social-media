export const PostSkeleton = () => (
  <article className="card overflow-hidden p-4">
    <div className="flex items-center gap-3">
      <div className="skeleton h-11 w-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-3 w-20" />
      </div>
    </div>
    <div className="skeleton mt-4 aspect-square w-full" />
    <div className="mt-4 space-y-2">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  </article>
);

export const GridSkeleton = () => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
    {Array.from({ length: 9 }).map((_, index) => (
      <div
        className={`
          skeleton rounded-2xl
          ${
            index % 3 === 0
              ? 'h-64'
              : index % 3 === 1
                ? 'h-48'
                : 'h-72'
          }
        `}
        key={index}
      />
    ))}
  </div>
);
