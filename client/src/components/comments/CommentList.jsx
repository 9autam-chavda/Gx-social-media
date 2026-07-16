import { useMemo } from 'react';

import EmptyState from '../common/EmptyState';
import CommentItem from './CommentItem';

import { getId } from './commentUtils';

const CommentList = ({
  comments = [],
  loading = false,
  currentUser,
  currentUserId,
  onCommentDeleted = () => {},
  onCommentUpdated = () => {},
  variant = 'thought',
}) => {
  const safeComments = useMemo(
    () =>
      (Array.isArray(comments) ? comments : []).filter((comment) =>
        Boolean(getId(comment))
      ),
    [comments]
  );

  const dense = variant === 'media';

  if (loading) {
    return (
      <div className={dense ? 'space-y-3 p-2' : 'space-y-3 p-2 sm:p-3'}>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="skeleton h-24 rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (safeComments.length === 0) {
    return (
      <div className="px-4 py-10">
        <EmptyState
          title="No comments yet"
          description="Start the conversation."
        />
      </div>
    );
  }

  return (
    <section className={dense ? 'space-y-3 p-2' : 'space-y-3 p-2 sm:p-3'}>
      <div className="px-2 pb-1">
        <h2 className="text-xs font-bold uppercase tracking-normal text-ink-muted">
          Comments
        </h2>
      </div>

      {safeComments.map((comment) => (
        <CommentItem
          key={getId(comment)}
          comment={comment}
          currentUser={currentUser}
          currentUserId={currentUserId}
          onCommentDeleted={onCommentDeleted}
          onCommentUpdated={onCommentUpdated}
          variant={variant}
        />
      ))}
    </section>
  );
};

export default CommentList;
