import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/formatters';

const FeedPostMeta = ({ post, authorPath }) => {
  const author = post?.author || post?.user || post?.createdBy;

  return (
    <header className="flex items-center justify-between gap-2 sm:gap-3">
      <Link className="group flex min-w-0 items-center gap-2.5 sm:gap-3" to={authorPath}>
        <Avatar user={author} size="sm" className="sm:h-11 sm:w-11" />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <p className="truncate text-sm font-black leading-tight text-ink transition-colors duration-150 group-hover:text-brand sm:text-[0.95rem]">
              @{author?.username || 'unknown'}
            </p>
            <span className="h-1 w-1 rounded-full bg-line" />
            <p className="shrink-0 text-xs font-bold text-ink-muted">
              {timeAgo(post?.createdAt)}
            </p>
          </div>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-ink-muted sm:mt-1 sm:text-xs">
            {post?.type === 'text' ? 'Thought' : 'Media post'}
          </p>
        </div>
      </Link>

      <button
        aria-label="Post options"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-muted transition-all duration-200 hover:bg-surface-muted hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-10 sm:w-10"
        type="button"
      >
        <Icon name="more" />
      </button>
    </header>
  );
};

export default FeedPostMeta;
