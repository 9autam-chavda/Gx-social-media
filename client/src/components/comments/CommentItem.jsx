import {
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Avatar from '../common/Avatar';
import CommentActions from './CommentActions';
import ReplyInput from './ReplyInput';
import ReplyItem from './ReplyItem';

import commentService from '../../services/commentService';
import replyService from '../../services/replyService';
import { timeAgo } from '../../utils/formatters';

import {
  getId,
  getUsername,
  normalizeReplies,
  normalizeReply,
  sameId,
} from './commentUtils';

const CommentItem = memo(
  ({
    comment,
    currentUser,
    currentUserId,
    onCommentDeleted,
    onCommentUpdated,
    variant = 'thought',
  }) => {
    const commentId = getId(comment);
    const commentUser = comment?.user || {};
    const upvotes = Array.isArray(comment?.upvotes)
      ? comment.upvotes
      : [];

    const initialReplies = useMemo(
      () => normalizeReplies(comment?.replies, currentUser),
      [comment?.replies, currentUser]
    );

    const [replies, setReplies] = useState(initialReplies);
    const [loaded, setLoaded] = useState(initialReplies.length > 0);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [showReplies, setShowReplies] = useState(initialReplies.length > 0);
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replying, setReplying] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [deletingComment, setDeletingComment] = useState(false);
    const [votingComment, setVotingComment] = useState(false);

    const isOwner = sameId(commentUser, currentUserId);
    const isUpvoted = upvotes.some((upvote) =>
      sameId(upvote, currentUserId)
    );

    const replyCount = loaded
      ? replies.length
      : comment?.replyCount ??
        comment?.repliesCount ??
        initialReplies.length;

    useEffect(() => {
      if (!loaded) return;

      if (comment.replyCount === replies.length) {
        return;
      }

      onCommentUpdated({
        ...comment,
        replyCount: replies.length,
      });
    }, [comment, loaded, onCommentUpdated, replies.length]);

    if (!commentId) {
      return null;
    }

    const fetchReplies = async () => {
      if (!commentId) return;

      try {
        setLoadingReplies(true);
        const data = await replyService.getReplies(commentId);
        setReplies(normalizeReplies(data, currentUser));
        setLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReplies(false);
      }
    };

    const openReplies = async () => {
      setShowReplies(true);

      if (!loaded) {
        await fetchReplies();
      }
    };

    const handleToggleReplies = async () => {
      if (showReplies) {
        setShowReplies(false);
        return;
      }

      await openReplies();
    };

    const handleToggleUpvote = async () => {
      if (!currentUserId || votingComment) return;

      const previous = upvotes;
      const nextUpvotes = isUpvoted
        ? previous.filter((upvote) => !sameId(upvote, currentUserId))
        : [...previous, currentUserId].filter(Boolean);

      onCommentUpdated({
        ...comment,
        upvotes: nextUpvotes,
      });

      try {
        setVotingComment(true);
        const result = await commentService.toggleUpvote(commentId);

        onCommentUpdated({
          ...comment,
          upvotes: Array.isArray(result?.upvotes)
            ? result.upvotes
            : nextUpvotes,
        });
      } catch (err) {
        console.error(err);
        onCommentUpdated({
          ...comment,
          upvotes: previous,
        });
      } finally {
        setVotingComment(false);
      }
    };

    const handleDeleteComment = async () => {
      try {
        setDeletingComment(true);
        await commentService.deleteComment(commentId);
        onCommentDeleted(commentId);
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingComment(false);
      }
    };

    const handleReplySubmit = async (event) => {
      event.preventDefault();

      const text = replyText.trim();

      if (!text) return;

      try {
        setSubmittingReply(true);
        const response = await replyService.addReply(
          commentId,
          text,
          getId(replyingTo)
        );

        const reply = normalizeReply(response?.reply || response, currentUser);

        if (!reply) {
          throw new Error('Server returned an invalid reply.');
        }

        setReplies((prev) => [
          ...prev.filter((item) => item._id !== reply._id),
          reply,
        ]);
        setLoaded(true);
        setShowReplies(true);
        setReplying(false);
        setReplyText('');
        setReplyingTo(null);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmittingReply(false);
      }
    };

    const handleDeleteReply = async (reply) => {
      const replyId = getId(reply);

      if (!replyId) return;

      const previous = replies;

      setReplies((prev) => prev.filter((item) => item._id !== replyId));

      try {
        await replyService.deleteReply(replyId);
      } catch (err) {
        console.error(err);
        setReplies(previous);
      }
    };

    const handleUpvoteReply = async (reply) => {
      const replyId = getId(reply);

      if (!replyId) return;

      const previous = replies;
      const replyUpvotes = Array.isArray(reply.upvotes)
        ? reply.upvotes
        : [];
      const replyUpvoted = replyUpvotes.some((upvote) =>
        sameId(upvote, currentUserId)
      );

      setReplies((prev) =>
        prev.map((item) =>
          item._id === replyId
            ? {
                ...item,
                upvotes: replyUpvoted
                  ? replyUpvotes.filter(
                      (upvote) => !sameId(upvote, currentUserId)
                    )
                  : [...replyUpvotes, currentUserId].filter(Boolean),
              }
            : item
        )
      );

      try {
        const result = await replyService.toggleUpvote(replyId);

        setReplies((prev) =>
          prev.map((item) =>
            item._id === replyId
              ? {
                  ...item,
                  upvotes: Array.isArray(result?.upvotes)
                    ? result.upvotes
                    : [],
                }
              : item
          )
        );
      } catch (err) {
        console.error(err);
        setReplies(previous);
      }
    };

    const dense = variant === 'media';

    return (
      <article
        className={`
          rounded-2xl border border-zinc-200 bg-white
          shadow-sm transition-all duration-150
          hover:border-zinc-300 hover:shadow
          ${dense ? 'p-2.5 sm:p-4' : 'p-3 sm:p-5'}
        `}
      >
        <div className="flex gap-2.5 sm:gap-3">
          <Avatar
            user={commentUser}
            size="sm"
            className="border-zinc-200"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                @{getUsername(commentUser)}
              </p>

              <span className="text-xs text-zinc-400">
                {timeAgo(comment?.createdAt) || 'just now'}
              </span>
            </div>

            <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-800 sm:mt-2 sm:text-[15px] sm:leading-relaxed">
              {comment?.text}
            </p>

            <CommentActions
              upvoted={isUpvoted}
              upvoteCount={upvotes.length}
              replyCount={replyCount}
              repliesOpen={showReplies}
              isOwner={isOwner}
              deleting={deletingComment}
              voting={votingComment}
              onToggleUpvote={handleToggleUpvote}
              onReply={() => {
                setReplying(true);
                setReplyingTo(null);
                openReplies();
              }}
              onToggleReplies={handleToggleReplies}
              onDelete={handleDeleteComment}
            />

            <div
              className={`
                overflow-hidden transition-all duration-150
                ${
                  showReplies
                    ? 'mt-3 max-h-[900px] opacity-100 sm:mt-4'
                    : 'mt-0 max-h-0 opacity-0'
                }
              `}
            >
              <div className="space-y-2.5 sm:space-y-3">
                {loadingReplies && (
                  <div className="ml-10 h-14 animate-pulse rounded-2xl bg-zinc-100 sm:ml-12" />
                )}

                {!loadingReplies &&
                  replies.map((reply) => (
                    <ReplyItem
                      key={reply._id}
                      reply={reply}
                      currentUserId={currentUserId}
                      onReply={(user) => {
                        setReplying(true);
                        setReplyingTo(user);
                        setShowReplies(true);
                      }}
                      onDelete={handleDeleteReply}
                      onUpvote={handleUpvoteReply}
                    />
                  ))}
              </div>
            </div>

            {replying && (
              <ReplyInput
                value={replyText}
                replyingToUser={replyingTo}
                loading={submittingReply}
                onChange={setReplyText}
                onCancel={() => {
                  setReplying(false);
                  setReplyText('');
                  setReplyingTo(null);
                }}
                onSubmit={handleReplySubmit}
              />
            )}
          </div>
        </div>
      </article>
    );
  }
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
