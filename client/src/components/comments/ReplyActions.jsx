import Icon from '../icons/Icon';

const ReplyActions = ({
  upvoted,
  upvoteCount,
  isOwner,
  onToggleUpvote,
  onReply,
  onDelete,
}) => (
  <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs font-semibold sm:mt-2 sm:gap-3">
    <button
      type="button"
      onClick={onToggleUpvote}
      className={`
        inline-flex items-center gap-1.5 rounded-full
        py-1 transition-all duration-150 active:scale-[0.98]
        ${
          upvoted
            ? 'text-orange-600'
            : 'text-zinc-500 hover:text-zinc-950'
        }
      `}
      aria-label={upvoted ? 'Remove upvote' : 'Upvote'}
    >
      <Icon name='arrowUp'
        className={`
          text-[12px] transition-colors duration-150
          ${upvoted ? 'scale-110' : ''}
        `}
      />
      {upvoteCount}
    </button>

    <button
      type="button"
      onClick={onReply}
      className="inline-flex items-center gap-1.5 py-1 text-zinc-500 transition-all duration-150 hover:text-zinc-950 active:scale-[0.98]"
    >
      <Icon name="reply" className="text-[11px]" />
      Reply
    </button>

    {isOwner && (
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 py-1 text-red-500 transition-all duration-150 hover:text-red-700 active:scale-[0.98]"
        aria-label="Delete reply"
      >
        <Icon name="trash" className="text-[11px]" />
      </button>
    )}
  </div>
);

export default ReplyActions;
