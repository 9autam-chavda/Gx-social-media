import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import CommentInput from '../comments/CommentInput';
import CommentList from '../comments/CommentList';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

import commentService from '../../services/commentService';
import {
  normalizeComment,
  normalizeComments,
} from '../comments/commentUtils';

const ThoughtPostDetail = ({
  post,
  currentUser,
  currentUserId,
  onPostChange,
  onCommentSubmit,
  commentLoading,
  actionError,
  onError,
}) => {
  const author =
    post?.author || post?.user;

  const authorPath = author?.username
    ? `/app/profile/${author.username}`
    : '/app/feed';

  const [commentText, setCommentText] =
    useState('');

  const [comments, setComments] =
    useState([]);

  const [
    commentsLoading,
    setCommentsLoading,
  ] = useState(false);

  const [localError, setLocalError] =
    useState('');

  const commentCount = useMemo(
    () =>
      post?.commentCount ??
      post?.commentsCount ??
      comments.length,
    [
      post?.commentCount,
      post?.commentsCount,
      comments.length,
    ]
  );

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        setLocalError('');

        const data =
          await commentService.getComments(
            post?._id
          );

        if (mounted) {
          setComments(
            normalizeComments(
              data,
              currentUser
            )
          );
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setLocalError(
            'Unable to load comments.'
          );
        }
      } finally {
        if (mounted) {
          setCommentsLoading(false);
        }
      }
    };

    if (post?._id) {
      fetchComments();
    }

    return () => {
      mounted = false;
    };
  }, [post?._id, currentUser]);

  const syncPostCommentCount =
    useCallback(
      (delta) => {
        onPostChange?.((current) => {
          if (!current) return current;

          const currentCount =
            current.commentCount ??
            current.commentsCount ??
            comments.length;

          return {
            ...current,
            commentCount: Math.max(
              0,
              currentCount + delta
            ),
            commentsCount: Math.max(
              0,
              currentCount + delta
            ),
          };
        });
      },
      [comments.length, onPostChange]
    );

  const handleSubmitComment =
    async (event) => {
      event.preventDefault();

      const text = commentText.trim();

      if (!text) return;

      try {
        setLocalError('');

        const result =
          onCommentSubmit
            ? await onCommentSubmit(text)
            : await commentService.createComment(
                post?._id,
                text
              );

        const comment =
          normalizeComment(
            result?.comment || result,
            currentUser
          );

        if (!comment) {
          throw new Error(
            'Server returned an invalid comment.'
          );
        }

        setComments((prev) => [
          comment,
          ...prev.filter(
            (item) =>
              item._id !== comment._id
          ),
        ]);

        setCommentText('');

        if (!onCommentSubmit) {
          syncPostCommentCount(1);
        }
      } catch (err) {
        console.error(err);
        setLocalError(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to add comment.'
        );
      }
    };

  const handleCommentDeleted =
    useCallback(
      (commentId) => {
        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment._id !== commentId
          )
        );
        syncPostCommentCount(-1);
      },
      [syncPostCommentCount]
    );

  const handleCommentUpdated =
    useCallback((updatedComment) => {
      const comment =
        normalizeComment(
          updatedComment,
          currentUser
        );

      if (!comment) return;

      setComments((prev) =>
        prev.map((item) =>
          item._id === comment._id
            ? {
                ...item,
                ...comment,
              }
            : item
        )
      );
    }, [currentUser]);

  return (
    <div
      className="
        bg-zinc-100 px-0 py-0
        sm:rounded-3xl sm:px-4 sm:py-4
      "
    >
      <article
        className="
          mx-auto flex max-w-2xl
          flex-col overflow-hidden bg-white
          shadow-sm
          sm:rounded-3xl
          sm:border sm:border-zinc-200
        "
      >
        <div className="px-1 pt-2 sm:px-3 sm:pt-3">
          <PostHeader
            post={post}
            authorPath={authorPath}
          />
        </div>

        <div className="px-5 pb-5 pt-2 sm:px-7 sm:pb-6">
          <p
            className="
              whitespace-pre-wrap break-words
              text-[1.35rem] leading-9
              tracking-normal text-zinc-950
              sm:text-[1.65rem] sm:leading-10
            "
          >
            {post?.textContent ||
              post?.caption ||
              ''}
          </p>
        </div>

        <div
          className="
            flex items-center justify-between
            border-y border-zinc-100 px-5 py-3
            text-xs font-medium text-zinc-500
            sm:px-7
          "
        >
          <span>
            {commentCount}{' '}
            {commentCount === 1
              ? 'comment'
              : 'comments'}
          </span>

          <PostActions
            post={post}
            currentUser={currentUser}
            onPostChange={onPostChange}
            onError={onError}
          />
        </div>

        <div className="flex-1 px-2 py-3 sm:px-4">
          <CommentList
            comments={comments}
            loading={commentsLoading}
            currentUser={currentUser}
            currentUserId={currentUserId}
            onCommentDeleted={
              handleCommentDeleted
            }
            onCommentUpdated={
              handleCommentUpdated
            }
            variant="thought"
          />
        </div>

        <CommentInput
          currentUser={currentUser}
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleSubmitComment}
          loading={commentLoading}
          error={localError || actionError}
          variant="thought"
        />
      </article>
    </div>
  );
};

export default ThoughtPostDetail;
