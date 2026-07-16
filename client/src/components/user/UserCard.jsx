import UserRelationshipCard from './UserRelationshipCard';

const UserCard = ({
  user,
  currentUserId,
}) => (
  <UserRelationshipCard
    user={user}
    currentUserId={currentUserId}
  />
);

export default UserCard;
