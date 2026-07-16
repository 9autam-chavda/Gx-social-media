import { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';

import Avatar from '../common/Avatar';

import { timeAgo } from '../../utils/formatters';

import {
  getPostAuthor,
  getPostCounts,
  getPostHref,
  getPostMedia,
  getPostPreviewText,
} from './contentCardUtils';

const Stat = ({ icon, value }) => {
  const IconComponent = icon;

  return (
  <span className="inline-flex items-center gap-1.5">
    <IconComponent className="text-[13px]" />
    {value}
  </span>
  );
};

const getMediaAspectClass = (post) => {
  const textLength =
    getPostPreviewText(post).length;

  if (post?.type === 'video') {
    return 'aspect-square sm:aspect-[4/5]';
  }

  if (textLength > 80) {
    return 'aspect-square sm:aspect-[3/4]';
  }

  return 'aspect-square';
};

const resolveAuthor = (post, fallbackUser = null) => {
  const author = getPostAuthor(post);

  if (
    author &&
    typeof author === 'object' &&
    author.username
  ) {
    return author;
  }

  return fallbackUser || author || null;
};

export const ContentMediaCard = memo(
  ({
    post,
    density = 'default',
    profileUser = null,
  }) => {
    const {
      mediaUrl,
      isVideo,
      poster,
    } = getPostMedia(post);

    const author =
      resolveAuthor(post, profileUser);
    const counts =
      getPostCounts(post);
    const text =
      getPostPreviewText(post);

    if (!mediaUrl) {
      return null;
    }

    return (
      <Link
        to={getPostHref(post)}
        className="
          group block overflow-hidden rounded-2xl
          bg-white shadow-sm ring-1 ring-line/90
          transition-shadow duration-150
          hover:shadow-md hover:ring-line
        "
      >
        <div
          className={`
            relative overflow-hidden bg-surface-muted
            ${getMediaAspectClass(post)}
          `}
        >
          {isVideo ? (
            <video
              className="
                h-full w-full object-cover
                transition-opacity duration-150
              "
              src={mediaUrl}
              poster={poster}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              className="
                h-full w-full object-cover
                transition-opacity duration-150
              "
              src={mediaUrl}
              alt={text}
              loading="lazy"
              decoding="async"
            />
          )}

              {isVideo && (
            <div
              className="
                absolute right-3 top-3 grid h-9 w-9
                place-items-center rounded-full
                bg-black/45 text-white backdrop-blur-md
              "
            >
                <Icon name="play" className="ml-0.5 text-xs" />
            </div>
          )}

          <div
            className="
              absolute inset-0 flex items-end
              bg-gradient-to-t from-black/75
              via-black/10 to-transparent
              p-4 opacity-0 transition-all
              duration-150 group-hover:opacity-100
            "
          >
            <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold text-white">
              <div className="min-w-0">
                <p className="truncate">
                  @{author?.username || 'unknown'}
                </p>
              </div>

                <div className="flex shrink-0 items-center gap-3">
                <Stat
                  icon={(props) => <Icon name="like" {...props} />}
                  value={counts.likes}
                />
                <Stat
                  icon={(props) => <Icon name="comment" {...props} />}
                  value={counts.comments}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`
            px-3 py-2.5 sm:px-4 sm:py-3
            ${
              density === 'compact'
                ? 'space-y-2'
                : 'space-y-3'
            }
          `}
        >
          <p className="line-clamp-2 text-[13px] leading-5 text-ink sm:text-sm">
            {text}
          </p>

          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-ink-muted sm:gap-3 sm:text-xs">
            <span className="truncate">
              @{author?.username || 'unknown'}
            </span>
            <span className="shrink-0">
              {timeAgo(post?.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }
);

ContentMediaCard.displayName = 'ContentMediaCard';

export const ContentThoughtCard = memo(
  ({ post, profileUser = null }) => {
    const author =
      resolveAuthor(post, profileUser);
    const counts =
      getPostCounts(post);
    const text =
      getPostPreviewText(post);

    return (
      <Link
        to={getPostHref(post)}
        className="
          group flex min-h-[132px] flex-col
          justify-between rounded-2xl border
          border-line bg-white p-3
          shadow-sm transition-shadow duration-150
          hover:shadow-md sm:min-h-[180px] sm:p-5
        "
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <Avatar
            user={author}
            size="xs"
            className="sm:h-9 sm:w-9"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="truncate text-sm font-bold text-ink">
                @{author?.username || 'unknown'}
              </p>

              <span className="text-xs font-medium text-ink-muted">
                {timeAgo(post?.createdAt)}
              </span>
            </div>

            <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-[0.95rem] font-semibold leading-6 tracking-normal text-ink sm:mt-3 sm:line-clamp-7 sm:text-xl sm:leading-relaxed">
              {text}
            </p>
          </div>
        </div>

        <div
          className="
            mt-3 flex items-center justify-between
            border-t border-line/70 pt-2.5
            text-xs font-semibold text-ink-muted
            sm:mt-5 sm:pt-4 sm:text-sm
          "
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <Stat
              icon={(props) => <Icon name="like" {...props} />}
              value={counts.likes}
            />
            <Stat
              icon={(props) => <Icon name="comment" {...props} />}
              value={counts.comments}
            />
          </div>

          <span className="text-[11px] text-ink-muted transition-colors duration-150 group-hover:text-ink sm:text-xs">
            Thought
          </span>
        </div>
      </Link>
    );
  }
);

ContentThoughtCard.displayName = 'ContentThoughtCard';
