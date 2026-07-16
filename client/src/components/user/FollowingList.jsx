import UserRelationshipCard from './UserRelationshipCard';

const FollowingList = ({
  users,
  currentUserId,
  removeOnUnfollow = false,
  onUsersChange,
  onFollowingDelta,
}) => {
  const handleFollowChange = (
    userId,
    following,
    meta
  ) => {
    if (meta?.rollback) {
      onFollowingDelta?.(
        following ? 1 : -1
      );
    } else if (meta?.optimistic) {
      onFollowingDelta?.(
        following ? 1 : -1
      );
    }

    onUsersChange?.((current) => {
      if (
        removeOnUnfollow &&
        !following &&
        !meta?.optimistic &&
        !meta?.rollback
      ) {
        return current.filter((user) => {
          const id = user._id || user.id;
          return (
            id?.toString() !==
            userId?.toString()
          );
        });
      }

      if (!meta?.optimistic && !meta?.rollback) {
        return current;
      }

      return current.map((user) => {
        const id = user._id || user.id;

        if (
          id?.toString() !==
          userId?.toString()
        ) {
          return user;
        }

        return {
          ...user,
          isFollowing: following,
          followerCount: Math.max(
            0,
            (user.followerCount || 0) +
              (following ? 1 : -1)
          ),
        };
      });
    });
  };

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRelationshipCard
          key={user._id || user.id}
          user={user}
          currentUserId={currentUserId}
          onFollowChange={
            handleFollowChange
          }
        />
      ))}
    </div>
  );
};

export default FollowingList;
