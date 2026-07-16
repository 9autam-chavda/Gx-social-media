const UserSkeleton = ({ count = 6 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="
          flex items-center gap-3 rounded-2xl
          border border-line bg-white p-4
        "
      >
        <div className="skeleton h-12 w-12 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-48 max-w-full" />
        </div>
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    ))}
  </div>
);

export default UserSkeleton;
