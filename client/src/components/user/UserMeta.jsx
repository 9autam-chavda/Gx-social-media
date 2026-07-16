const UserMeta = ({ user }) => {
  const followers =
    user?.followerCount ??
    user?.followersCount ??
    user?.followers?.length ??
    0;

  const following =
    user?.followingCount ??
    user?.following?.length ??
    0;

  return (
    <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
      <span>{followers} followers</span>
      <span>{following} following</span>
    </div>
  );
};

export default UserMeta;
