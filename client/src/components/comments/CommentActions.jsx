import Icon from '../icons/Icon';

const CommentActions = ({
  upvoted,
  upvoteCount,
  replyCount,
  repliesOpen,
  isOwner,
  deleting,
  voting,
  onToggleUpvote,
  onReply,
  onToggleReplies,
  onDelete,
}) => (
  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs sm:mt-4 sm:gap-2 sm:text-sm">
    <button
      type="button"
      onClick={onToggleUpvote}
      disabled={voting}
      className={`
        inline-flex min-h-8 items-center gap-1.5 rounded-full
        px-2.5 font-semibold transition-all duration-150
        active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70
        sm:min-h-9 sm:gap-2 sm:px-3
        ${
          upvoted
            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'
        }
      `}
      aria-label={upvoted ? 'Remove upvote' : 'Upvote'}
      aria-pressed={upvoted}
    >
      <Icon name='arrowUp'
        className={`
          text-[13px] transition-colors duration-150 sm:text-[15px]
          ${upvoted ? 'scale-110' : ''}
          ${voting ? 'animate-pulse' : ''}
        `}
      />
      {upvoteCount}
    </button>

    <button
      type="button"
      onClick={onReply}
      className="
        inline-flex min-h-8 items-center gap-1.5 rounded-full
        px-2.5 font-semibold text-zinc-500
        transition-all duration-150 hover:bg-zinc-100
        hover:text-zinc-950 active:scale-[0.98]
        sm:min-h-9 sm:gap-2 sm:px-3
      "
    >
      <Icon name="reply" className="text-[14px]" />
      Reply
    </button>

    <button
      type="button"
      onClick={onToggleReplies}
      className="
        inline-flex min-h-8 items-center gap-1.5 rounded-full
        px-2.5 font-semibold text-zinc-500
        transition-all duration-150 hover:bg-zinc-100
        hover:text-zinc-950 active:scale-[0.98]
        sm:min-h-9 sm:gap-2 sm:px-3
      "
    >
      <span className="transition-colors duration-150">
        {repliesOpen ? (
          <Icon name="chevronUp" className="text-[13px]" />
        ) : (
          <Icon name="chevronDown" className="text-[13px]" />
        )}
      </span>
      {repliesOpen
        ? 'Hide replies'
        : replyCount > 0
          ? `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
          : 'View replies'}
    </button>

    {isOwner && (
      <button
        type="button"
        disabled={deleting}
        onClick={onDelete}
        className="
          ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full
          px-2.5 font-semibold text-zinc-400
          transition-all duration-150 hover:bg-red-50
          hover:text-red-600 active:scale-[0.98] disabled:opacity-40
          sm:min-h-9 sm:gap-2 sm:px-3
        "
      >
        <Icon name="trash" className="text-[13px]" />
      </button>
    )}
  </div>
);

export default CommentActions;
