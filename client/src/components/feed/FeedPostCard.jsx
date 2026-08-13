import { memo, useState } from 'react';
import CommentModal from '../post/CommentModal';
import FeedMediaCard from './FeedMediaCard';
import FeedThoughtCard from './FeedThoughtCard';
import { getId } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

const FeedPostCard = ({ post, onPostChange }) => {
  const { user } = useAuth();
  const [commentOpen, setCommentOpen] = useState(false);
  const [error, setError] = useState('');

  const postId = getId(post);
  const currentUserId = user?.id || user?._id;
  const authorUsername =
    post?.user?.username || post?.author?.username || post?.createdBy?.username;
  const authorPath = authorUsername ? `/app/profile/${authorUsername}` : '/app/feed';

  const syncPost = (updater) => {
    onPostChange?.(postId, updater);
  };

  const sharedProps = {
    post,
    authorPath,
    currentUser: user,
    onCommentClick: () => setCommentOpen(true),
    onPostChange: syncPost,
    onError: setError,
  };

  const isTextPost = post?.type === 'text';

  return (
    <>
      {isTextPost ? <FeedThoughtCard {...sharedProps} /> : <FeedMediaCard {...sharedProps} />}

      <div className="-mt-4 px-4 sm:-mt-6 sm:px-5">
        {error && (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
      </div>

      <CommentModal
        open={commentOpen}
        post={post}
        currentUserId={currentUserId}
        onClose={() => setCommentOpen(false)}
        onCommentAdded={(comment) => {
          syncPost((current) => ({
            ...current,
            comments: [comment, ...(current.comments || [])],
            commentCount: (current.commentCount || 0) + 1,
          }));
        }}
      />
    </>
  );
};

export default memo(FeedPostCard);
