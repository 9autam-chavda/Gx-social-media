import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import {
  getPostAuthor,
  getPostHref,
  getPostPreviewText,
} from '../content/contentCardUtils';

const SavedThoughtCard = ({ post }) => {
  const author = getPostAuthor(post);

  return (
    <Link
      className="group flex aspect-square flex-col justify-between rounded-xl border border-line bg-white p-3 shadow-sm transition-colors duration-150 hover:border-brand/30 hover:bg-surface sm:rounded-2xl sm:p-4"
      to={getPostHref(post)}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-bold text-ink-muted">
          @{author?.username || 'unknown'}
        </p>
        <Icon name="bookmark" className="shrink-0 text-brand" size={13} />
      </div>
      <p className="line-clamp-5 text-sm font-semibold leading-5 text-ink sm:line-clamp-6 sm:text-base sm:leading-6">
        {getPostPreviewText(post)}
      </p>
      <p className="text-[10px] font-black uppercase tracking-wide text-ink-muted">
        Saved thought
      </p>
    </Link>
  );
};

export default SavedThoughtCard;
