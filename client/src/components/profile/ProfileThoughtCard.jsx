import { ContentThoughtCard } from '../content/ContentCardBase';

const ProfileThoughtCard = ({
  post,
  profile,
}) => (
  <ContentThoughtCard
    post={post}
    profileUser={profile}
  />
);

export default ProfileThoughtCard;
