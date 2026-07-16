import {
  useState,
} from 'react';

import Icon from '../icons/Icon';

import { userService } from '../../services/userService';

const FollowButton = ({
  userId,
  isOwnProfile = false,
  initialFollowing = false,
  requested = false,
  onChange,
  className = '',
}) => {
  const [following, setFollowing] =
    useState(Boolean(initialFollowing));

  const [loading, setLoading] =
    useState(false);

  const [hovering, setHovering] =
    useState(false);

  if (isOwnProfile) {
    return null;
  }

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userId || loading || requested) {
      return;
    }

    const previous = following;
    const next = !following;

    setFollowing(next);
    setLoading(true);
    onChange?.(next, {
      optimistic: true,
      previous,
    });

    try {
      if (next) {
        await userService.follow(userId);
      } else {
        await userService.unfollow(userId);
      }

      onChange?.(next, {
        optimistic: false,
        previous,
      });
    } catch (err) {
      console.error(err);
      setFollowing(previous);
      onChange?.(previous, {
        optimistic: false,
        rollback: true,
        previous: next,
      });
    } finally {
      setLoading(false);
    }
  };

  const label = requested
    ? 'Requested'
    : following && hovering
      ? 'Unfollow'
      : following
        ? 'Following'
        : 'Follow';

  return (
    <button
      type="button"
      disabled={loading || requested}
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`
        inline-flex min-h-10 shrink-0 items-center justify-center
        gap-2 rounded-full px-4 text-sm font-black
        transition-all duration-150 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-60
        ${
          following
            ? hovering
              ? 'border border-red-200 bg-red-50 text-red-600 shadow-sm'
              : 'border border-line bg-white text-ink shadow-sm hover:border-line hover:bg-surface-muted'
            : 'border border-ink bg-ink text-white shadow-sm hover:bg-brand hover:border-brand'
        }
        ${className}
      `}
      aria-pressed={following}
    >
      {!following && !requested && (
        <Icon name="userAdd" className="text-xs" />
      )}
      {following && !hovering && (
        <Icon name="check" className="text-xs" />
      )}
      {loading ? 'Saving...' : label}
    </button>
  );
};

export default FollowButton;
