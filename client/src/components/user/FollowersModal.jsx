import { useCallback } from 'react';
import Icon from '../icons/Icon';

import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

import FollowersList from './FollowersList';
import RelationshipModal from './RelationshipModal';

const FollowersModal = ({
  open,
  userId,
  count,
  onClose,
}) => {
  const { user } = useAuth();

  const extractUsers = useCallback(
    (data) =>
      data?.users ||
      data?.followers ||
      data?.data ||
      [],
    []
  );

  return (
    <RelationshipModal
      open={open}
      title="Followers"
      count={count}
      userId={userId}
      fetchUsers={userService.getFollowers}
      extractUsers={extractUsers}
      emptyIcon={() => <Icon name="users" />}
      emptyTitle="No followers yet"
      emptyDescription="When people follow this profile, they will appear here."
      onClose={onClose}
      renderList={(users, setUsers) => (
        <FollowersList
          users={users}
          currentUserId={user?._id || user?.id}
          onUsersChange={setUsers}
        />
      )}
    />
  );
};

export default FollowersModal;
