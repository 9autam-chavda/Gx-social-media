import { ContentMediaCard } from '../content/ContentCardBase';

const ProfileMediaCard = ({
  post,
  profile,
}) => (
  <ContentMediaCard
    post={post}
    density="compact"
    profileUser={profile}
  />
);

export default ProfileMediaCard;
