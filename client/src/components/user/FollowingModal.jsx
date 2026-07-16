import { useCallback } from 'react';
import Icon from '../icons/Icon';

import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

import FollowingList from './FollowingList';
import RelationshipModal from './RelationshipModal';

const FollowingModal = ({
  open,
  userId,
  count,
  isOwnProfile = false,
  onFollowingDelta,
  onClose,
}) => {
  const { user } = useAuth();

  const extractUsers = useCallback(
    (data) =>
      data?.users ||
      data?.following ||
      data?.data ||
      [],
    []
  );

  return (
    <RelationshipModal
      open={open}
      title="Following"
      count={count}
      userId={userId}
      fetchUsers={userService.getFollowing}
      extractUsers={extractUsers}
      emptyIcon={() => <Icon name="userAdd" />}
      emptyTitle="Not following anyone yet"
      emptyDescription="Accounts this profile follows will appear here."
      onClose={onClose}
      renderList={(users, setUsers) => (
        <FollowingList
          users={users}
          currentUserId={user?._id || user?.id}
          removeOnUnfollow={isOwnProfile}
          onFollowingDelta={onFollowingDelta}
          onUsersChange={setUsers}
        />
      )}
    />
  );
};

export default FollowingModal;
