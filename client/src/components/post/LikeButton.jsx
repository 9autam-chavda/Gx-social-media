import { useMemo, useState } from 'react';
import Icon from '../icons/Icon';
import { postService } from '../../services/postService';
import { getErrorMessage } from '../../utils/api';
import { getId, isLikedBy } from '../../utils/formatters';

const LikeButton = ({
  post,
  currentUser,
  onOptimisticChange,
  onError,
}) => {
  const currentUserId =
    currentUser?.id || currentUser?._id;

  const postId = getId(post);

  const derivedLiked = Boolean(post?.isLiked ?? isLikedBy(post, currentUserId));
  const derivedLikeCount = post?.likeCount ?? post?.likes?.length ?? 0;

  const [optimistic, setOptimistic] = useState(null);
  const [loading, setLoading] = useState(false);

  const liked = optimistic?.postId === postId ? optimistic.liked : derivedLiked;
  const likeCount = optimistic?.postId === postId ? optimistic.likeCount : derivedLikeCount;
  const likes = useMemo(() => post?.likes || [], [post?.likes]);

  const buildLikes = (
    nextLiked,
    sourceLikes = likes
  ) => {
    if (!currentUserId) return sourceLikes;

    if (nextLiked) {
      const alreadyLiked = sourceLikes.some(
        (like) =>
          getId(like) ===
          currentUserId.toString()
      );

      if (alreadyLiked) return sourceLikes;

      return [
        ...sourceLikes,
        {
          _id: currentUserId,
          username: currentUser?.username,
        },
      ];
    }

    return sourceLikes.filter(
      (like) =>
        getId(like) !== currentUserId.toString()
    );
  };

  const optimisticUpdate = (
    nextLiked,
    nextCount
  ) => {
    const nextLikes = buildLikes(nextLiked);

    onOptimisticChange?.((current) => ({
      ...current,
      likes: nextLikes,
      isLiked: nextLiked,
      likeCount: nextCount,
    }));
  };

  const rollbackUpdate = (previous) => {
    onOptimisticChange?.((current) => ({
      ...current,
      likes: previous.likes,
      isLiked: previous.liked,
      likeCount: previous.likeCount,
    }));
  };

  const handleToggle = async () => {
    if (!postId || !currentUserId || loading)
      return;

    const previous = {
      liked,
      likeCount,
      likes,
    };

    const nextLiked = !liked;

    const nextCount = Math.max(
      0,
      likeCount + (nextLiked ? 1 : -1)
    );

    setOptimistic({ postId, liked: nextLiked, likeCount: nextCount });

    optimisticUpdate(nextLiked, nextCount);

    setLoading(true);

    onError?.('');

    try {
      const data = nextLiked
        ? await postService.likePost(postId)
        : await postService.unlikePost(postId);

      const serverPost = data?.post || {};

      const serverLiked =
        data?.isLiked ?? nextLiked;

      const serverCount =
        data?.likeCount ??
        serverPost?.likeCount ??
        serverPost?.likes?.length ??
        nextCount;

      const serverLikes =
        data?.likes ||
        serverPost?.likes ||
        buildLikes(serverLiked);

      setOptimistic(null);

      onOptimisticChange?.((current) => ({
        ...current,
        ...serverPost,
        likes: serverLikes,
        isLiked: serverLiked,
        likeCount: serverCount,
      }));
    } catch (error) {
      setOptimistic(null);

      rollbackUpdate(previous);

      onError?.(
        getErrorMessage(
          error,
          'Unable to update like'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  

  return (
  <div className="flex items-center gap-1">
    <button
      onClick={handleToggle}
      type="button"
      aria-label={
        liked ? 'Unlike post' : 'Like post'
      }
      aria-pressed={liked}
      disabled={loading}
      title={liked ? 'Unlike' : 'Like'}
      className="
        group flex h-8 items-center gap-1.5 rounded-full px-2
        text-ink-muted transition-all duration-150
        hover:bg-red-50 hover:text-red-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white
        active:scale-[0.98] disabled:opacity-70
        sm:h-10 sm:gap-2 sm:px-3
      "
    >
      <span
        className={`
          transition duration-150
          ${
            liked
              ? 'text-red-500'
              : ''
          }
        `}
      >
        <Icon
          name={liked ? 'like' : 'likeOutline'}
          className={liked ? 'animate-[iconPop_160ms_ease-out]' : ''}
          size={20}
        />
      </span>

    <span
      className={`
        text-xs font-black tracking-tight
        transition-colors duration-150 sm:text-sm
        ${
          liked
            ? 'text-red-500'
            : ''
        }
      `}
    >
      {likeCount}
    </span>
    </button>
  </div>
);
};

export default LikeButton;
