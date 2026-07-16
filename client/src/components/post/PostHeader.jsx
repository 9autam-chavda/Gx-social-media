import { Link } from 'react-router-dom';

import Avatar from '../common/Avatar';

import { timeAgo } from '../../utils/formatters';

const PostHeader = ({
  post,
  authorPath,
}) => {
  const author =
    post?.author || post?.user;

  if (!author) {
    return (
      <header className="flex items-center gap-3 px-4 py-3">
        <Avatar user={null} />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            @unknown
          </p>

          <p className="mt-0.5 text-xs text-zinc-400">
            unknown
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <Link
        className="
          group flex min-w-0 items-center gap-3
        "
        to={authorPath}
      >
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar user={author} />
        </div>

        {/* User info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className="
                truncate text-[0.95rem]
                font-semibold tracking-tight
                text-zinc-900
                transition-colors duration-200
                group-hover:text-black
              "
            >
              @{author?.username || 'unknown'}
            </p>

            <span className="text-zinc-300">
              ·
            </span>

            <p
              className="
                text-xs font-medium
                text-zinc-400
              "
            >
              {timeAgo(post?.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default PostHeader;