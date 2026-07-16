import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from '../icons/Icon';

import Avatar from '../common/Avatar';
import replyService from '../../services/replyService';
import { timeAgo } from '../../utils/formatters';

const getId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
};

const sameId = (left, right) => {
  const leftId = getId(left);
  const rightId = getId(right);

  return (
    !!leftId &&
    !!rightId &&
    leftId.toString() ===
      rightId.toString()
  );
};

const normalizeUser = (user, fallback = null) => {
  if (!user) return fallback;
  if (typeof user === 'string') {
    return fallback &&
      sameId(user, fallback)
      ? fallback
      : { _id: user };
  }

  return {
    ...user,
    _id: getId(user),
  };
};

const getUsername = (user) => {
  if (!user || typeof user === 'string') {
    return 'unknown';
  }

  return user.username || 'unknown';
};

const normalizeReply = (
  reply,
  currentUser = null
) => {
  const id = getId(reply);

  if (!id || !reply?.text) {
    return null;
  }

  return {
    ...reply,
    _id: id,
    user: normalizeUser(
      reply.user,
      currentUser
    ),
    replyingTo: reply.replyingTo
      ? normalizeUser(reply.replyingTo)
      : null,
    text: reply.text,
    upvotes: Array.isArray(
      reply.upvotes
    )
      ? reply.upvotes
      : [],
    createdAt:
      reply.createdAt ||
      new Date().toISOString(),
  };
};

const normalizeReplies = (
  replies,
  currentUser
) =>
  (Array.isArray(replies) ? replies : [])
    .map((reply) =>
      normalizeReply(reply, currentUser)
    )
    .filter(Boolean);

const ReplyInput = ({
  value,
  replyingToUser,
  loading,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="mt-3 flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={loading}
        onChange={(event) =>
          onChange(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onCancel();
          }
        }}
        placeholder={
          replyingToUser
            ? `Reply to @${getUsername(
                replyingToUser
              )}`
            : 'Write a reply...'
        }
        className="
          min-w-0 flex-1 rounded-full
          border border-zinc-200 bg-white
          px-4 py-2 text-sm outline-none
          transition placeholder:text-zinc-400
          focus:border-zinc-400
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />

      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="
          grid h-9 w-9 shrink-0 place-items-center
          rounded-full bg-zinc-950 text-white
          transition hover:bg-zinc-800
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        aria-label="Post reply"
      >
        <Icon name="send" className="text-[12px]" />
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="
          rounded-full px-3 py-2 text-xs
          font-semibold text-zinc-500
          transition hover:bg-zinc-100
          hover:text-zinc-900
        "
      >
        Cancel
      </button>
    </form>
  );
};

const ReplyItem = memo(
  ({
    reply,
    currentUserId,
    onReply,
    onDelete,
    onUpvote,
  }) => {
    const replyUser =
      reply?.user || {};
    const upvotes =
      Array.isArray(reply?.upvotes)
        ? reply.upvotes
        : [];
    const isOwner = sameId(
      replyUser,
      currentUserId
    );
    const isUpvoted = upvotes.some(
      (upvote) =>
        sameId(upvote, currentUserId)
    );

    return (
      <div
        className="
          flex gap-2 border-l-2 border-zinc-200
          pl-4 animate-[fadeIn_180ms_ease-out]
        "
      >
        <Avatar
          user={replyUser}
          size="xs"
          className="mt-1"
        />

        <div className="min-w-0 flex-1 rounded-2xl bg-zinc-50 px-3 py-2">
          <p className="break-words text-sm leading-6 text-zinc-700">
            <span className="font-semibold text-zinc-950">
              @{getUsername(replyUser)}
            </span>

            {reply.replyingTo && (
              <>
                {' '}
                <span className="font-semibold text-blue-600">
                  @
                  {getUsername(
                    reply.replyingTo
                  )}
                </span>
              </>
            )}{' '}

            {reply.text}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpvote(reply)
              }
              className={`
                flex items-center gap-1 text-xs
                font-semibold transition
                ${
                  isUpvoted
                    ? 'text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950'
                }
              `}
            >
              <Icon name="arrowUp" className="text-[9px]" />
              {upvotes.length}
            </button>

            <button
              type="button"
              onClick={() =>
                onReply(replyUser)
              }
              className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-950"
            >
              Reply
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={() =>
                  onDelete(reply)
                }
                className="text-xs text-red-500 transition hover:text-red-700"
                aria-label="Delete reply"
              >
                <Icon name="trash" className="text-[10px]" />
              </button>
            )}

            <span className="text-xs text-zinc-400">
              {timeAgo(reply.createdAt) ||
                'just now'}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ReplyItem.displayName = 'ReplyItem';

const ReplySection = ({
  comment,
  currentUser,
  currentUserId,
  onReplyCountChange = () => {},
}) => {
  const commentId = getId(comment);

  const initialReplies =
    useMemo(
      () =>
        normalizeReplies(
          comment?.replies,
          currentUser
        ),
      [comment?.replies, currentUser]
    );

  const [replies, setReplies] =
    useState(initialReplies);

  const [loaded, setLoaded] =
    useState(
      initialReplies.length > 0
    );

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [replyText, setReplyText] =
    useState('');

  const [replyingTo, setReplyingTo] =
    useState(null);

  const [showReplies, setShowReplies] =
    useState(
      initialReplies.length > 0
    );

  const replyCount =
    loaded
      ? replies.length
      : comment?.replyCount ??
        comment?.repliesCount ??
        initialReplies.length;

  useEffect(() => {
    if (loaded) {
      onReplyCountChange(
        replies.length
      );
    }
  }, [
    loaded,
    onReplyCountChange,
    replies.length,
  ]);

  const fetchReplies =
    useCallback(async () => {
      if (!commentId) return;

      try {
        setLoading(true);

        const data =
          await replyService.getReplies(
            commentId
          );

        setReplies(
          normalizeReplies(
            data,
            currentUser
          )
        );
        setLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, [commentId, currentUser]);

  const openReplies =
    useCallback(async () => {
      setShowReplies(true);

      if (!loaded) {
        await fetchReplies();
      }
    }, [fetchReplies, loaded]);

  const handleToggleReplies =
    async () => {
      if (showReplies) {
        setShowReplies(false);
        return;
      }

      await openReplies();
    };

  const handleReplySubmit =
    async (event) => {
      event.preventDefault();

      const text = replyText.trim();

      if (!text || !commentId) return;

      try {
        setSubmitting(true);

        const response =
          await replyService.addReply(
            commentId,
            text,
            getId(replyingTo)
          );

        const reply =
          normalizeReply(
            response?.reply ||
              response,
            currentUser
          );

        if (!reply) {
          throw new Error(
            'Server returned an invalid reply.'
          );
        }

        setReplies((prev) => [
          ...prev.filter(
            (item) =>
              item._id !== reply._id
          ),
          reply,
        ]);

        setLoaded(true);
        setShowReplies(true);
        setReplyText('');
        setReplyingTo(null);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    };

  const handleDeleteReply =
    async (reply) => {
      const replyId = getId(reply);

      if (!replyId) return;

      const previous = replies;

      setReplies((prev) =>
        prev.filter(
          (item) => item._id !== replyId
        )
      );

      try {
        await replyService.deleteReply(
          replyId
        );
      } catch (err) {
        console.error(err);
        setReplies(previous);
      }
    };

  const handleUpvoteReply =
    async (reply) => {
      const replyId = getId(reply);

      if (!replyId) return;

      const previous = replies;
      const upvotes =
        Array.isArray(reply.upvotes)
          ? reply.upvotes
          : [];
      const isUpvoted =
        upvotes.some((upvote) =>
          sameId(upvote, currentUserId)
        );

      setReplies((prev) =>
        prev.map((item) => {
          if (item._id !== replyId) {
            return item;
          }

          return {
            ...item,
            upvotes: isUpvoted
              ? upvotes.filter(
                  (upvote) =>
                    !sameId(
                      upvote,
                      currentUserId
                    )
                )
              : [
                  ...upvotes,
                  currentUserId,
                ].filter(Boolean),
          };
        })
      );

      try {
        const result =
          await replyService.toggleUpvote(
            replyId
          );

        setReplies((prev) =>
          prev.map((item) =>
            item._id === replyId
              ? {
                  ...item,
                  upvotes:
                    Array.isArray(
                      result?.upvotes
                    )
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

  if (!commentId) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setReplyingTo(null);
            setReplyText('');
            openReplies();
          }}
          className="text-xs font-semibold text-zinc-500 transition hover:text-zinc-950"
        >
          Reply
        </button>

        <button
          type="button"
          onClick={handleToggleReplies}
          className="
            inline-flex items-center gap-1
            text-xs font-semibold text-zinc-500
            transition hover:text-zinc-950
          "
        >
          {showReplies ? (
            <Icon name="chevronUp" className="text-[10px]" />
          ) : (
            <Icon name="chevronDown" className="text-[10px]" />
          )}
          {showReplies
            ? 'Hide replies'
            : replyCount > 0
              ? `View ${replyCount} ${
                  replyCount === 1
                    ? 'reply'
                    : 'replies'
                }`
              : 'View replies'}
        </button>
      </div>

      {showReplies && (
        <div className="mt-3 space-y-3">
          {loading && (
            <div className="ml-4 h-12 animate-pulse rounded-2xl bg-zinc-100" />
          )}

          {!loading &&
            replies.map((reply) => (
              <ReplyItem
                key={reply._id}
                reply={reply}
                currentUserId={
                  currentUserId
                }
                onReply={(user) => {
                  setReplyingTo(user);
                  setReplyText('');
                  setShowReplies(true);
                }}
                onDelete={
                  handleDeleteReply
                }
                onUpvote={
                  handleUpvoteReply
                }
              />
            ))}

          <ReplyInput
            value={replyText}
            replyingToUser={replyingTo}
            loading={submitting}
            onChange={setReplyText}
            onCancel={() => {
              setReplyText('');
              setReplyingTo(null);
              if (replies.length === 0) {
                setShowReplies(false);
              }
            }}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}
    </div>
  );
};

export default ReplySection;
