import UserRelationshipCard from './UserRelationshipCard';

const FollowersList = ({
  users,
  currentUserId,
  onUsersChange,
}) => {
  const handleFollowChange = (
    userId,
    following,
    meta
  ) => {
    if (!meta?.optimistic && !meta?.rollback) {
      return;
    }

    onUsersChange?.((current) =>
      current.map((user) => {
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
      })
    );
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

export default FollowersList;
