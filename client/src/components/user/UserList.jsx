import EmptyState from '../common/EmptyState';
import UserCard from './UserCard';

const UserList = ({
  users,
  currentUserId,
  onFollow,
  onUnfollow,
}) => {
  if (!users?.length) {
    return (
      <EmptyState
        title="No users found"
        description="Try a different search or check back later."
      />
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserCard
          key={user._id || user.id}
          user={user}
          currentUserId={currentUserId}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
      ))}
    </div>
  );
};

export default UserList;
