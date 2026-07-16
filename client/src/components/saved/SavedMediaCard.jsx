import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import {
  getPostHref,
  getPostMedia,
  getPostPreviewText,
} from '../content/contentCardUtils';

const SavedMediaCard = ({ post }) => {
  const { mediaUrl, isVideo, poster } = getPostMedia(post);

  if (!mediaUrl) return null;

  return (
    <Link
      className="group relative block aspect-square overflow-hidden rounded-xl bg-surface-muted ring-1 ring-line/80 sm:rounded-2xl"
      to={getPostHref(post)}
    >
      {isVideo ? (
        <video
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.015]"
          muted
          playsInline
          poster={poster}
          preload="metadata"
          src={mediaUrl}
        />
      ) : (
        <img
          alt={getPostPreviewText(post)}
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.015]"
          decoding="async"
          loading="lazy"
          src={mediaUrl}
        />
      )}

      <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs text-ink shadow-sm backdrop-blur-sm">
        <Icon name={isVideo ? 'play' : 'bookmark'} />
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
        <p className="truncate text-xs font-semibold text-white">
          {getPostPreviewText(post)}
        </p>
      </div>
    </Link>
  );
};

export default SavedMediaCard;
