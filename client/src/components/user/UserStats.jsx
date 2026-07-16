const UserStats = ({
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  onFollowersClick,
  onFollowingClick,
}) => {
  const stats = [
    {
      label: postsCount === 1 ? 'Post' : 'Posts',
      value: postsCount,
      type: 'static',
    },
    {
      label:
        followersCount === 1
          ? 'Follower'
          : 'Followers',
      value: followersCount,
      onClick: onFollowersClick,
    },
    {
      label: 'Following',
      value: followingCount,
      onClick: onFollowingClick,
    },
  ];

  return (
    <div className="mt-4 flex items-center gap-5 border-y border-line/80 py-3 sm:mt-5 sm:gap-8 sm:py-4">
      {stats.map((stat) => {
        const Component = stat.onClick
          ? 'button'
          : 'div';

        return (
          <Component
            key={stat.label}
            type={stat.onClick ? 'button' : undefined}
            onClick={stat.onClick}
            aria-label={`${stat.value} ${stat.label}`}
            className="
              min-w-0 text-left transition-colors duration-150
              hover:text-brand active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white
            "
          >
            <p className="text-lg font-black tracking-tight text-ink sm:text-xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-ink-muted sm:text-xs">
              {stat.label}
            </p>
          </Component>
        );
      })}
    </div>
  );
};

export default UserStats;
