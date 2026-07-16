import { memo } from 'react';

import Avatar from '../common/Avatar';
import ReplyActions from './ReplyActions';

import {
  getUsername,
  sameId,
} from './commentUtils';

import { timeAgo } from '../../utils/formatters';

const ReplyItem = memo(
  ({
    reply,
    currentUserId,
    onReply,
    onDelete,
    onUpvote,
  }) => {
    const replyUser = reply?.user || {};
    const upvotes = Array.isArray(reply?.upvotes)
      ? reply.upvotes
      : [];
    const isOwner = sameId(replyUser, currentUserId);
    const isUpvoted = upvotes.some((upvote) =>
      sameId(upvote, currentUserId)
    );

    return (
      <div
        className="
          ml-7 flex gap-2 border-l border-zinc-200
          pl-3 transition-all duration-150 sm:ml-12 sm:pl-4
        "
      >
        <Avatar
          user={replyUser}
          size="xs"
          className="mt-1 border-zinc-200"
        />

        <div
          className="
            min-w-0 flex-1 rounded-2xl bg-zinc-50
            px-3 py-2 transition-colors duration-150 sm:py-2.5
            hover:bg-zinc-100/80
          "
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-sm font-semibold text-zinc-900">
              @{getUsername(replyUser)}
            </p>

            <span className="text-xs text-zinc-400">
              {timeAgo(reply.createdAt) || 'just now'}
            </span>
          </div>

          <p className="mt-1 break-words text-sm leading-6 text-zinc-800">
            {reply.replyingTo && (
              <span className="mr-1 font-semibold text-blue-600">
                @{getUsername(reply.replyingTo)}
              </span>
            )}
            {reply.text}
          </p>

          <ReplyActions
            upvoted={isUpvoted}
            upvoteCount={upvotes.length}
            isOwner={isOwner}
            onToggleUpvote={() => onUpvote(reply)}
            onReply={() => onReply(replyUser)}
            onDelete={() => onDelete(reply)}
          />
        </div>
      </div>
    );
  }
);

ReplyItem.displayName = 'ReplyItem';

export default ReplyItem;
