import { memo } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../common/Avatar';
import FollowButton from './FollowButton';
import UserMeta from './UserMeta';

const getId = (user) =>
  user?._id || user?.id || '';

const UserRelationshipCard = memo(
  ({
    user,
    currentUserId,
    onFollowChange,
  }) => {
    const userId = getId(user);
    const isOwnProfile =
      currentUserId &&
      userId?.toString() ===
        currentUserId?.toString();

    return (
      <article
        className="
          group flex items-center gap-3 rounded-2xl
          border border-line bg-white p-3 shadow-sm
          transition-shadow duration-150
          hover:shadow-md sm:p-4
        "
      >
        <Link
          to={`/app/profile/${user?.username || userId}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Avatar
            user={user}
            size="md"
            className="border-line"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              @{user?.username || 'unknown'}
            </p>

            <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-muted">
              {user?.bio || 'No bio yet.'}
            </p>

            <UserMeta user={user} />
          </div>
        </Link>

        <FollowButton
          userId={userId}
          isOwnProfile={isOwnProfile}
          initialFollowing={user?.isFollowing}
          requested={user?.followRequested}
          onChange={(next, meta) =>
            onFollowChange?.(userId, next, meta)
          }
        />
      </article>
    );
  }
);

UserRelationshipCard.displayName =
  'UserRelationshipCard';

export default UserRelationshipCard;
