import { Link } from 'react-router-dom';

import Icon from '../icons/Icon';

import EmptyState from '../common/EmptyState';

import {
  getId,
  getMediaType,
  getMediaUrl,
} from '../../utils/formatters';

const PostGrid = ({
  posts,
  emptyTitle = 'No posts found',
  emptyDescription,
}) => {
  if (!posts?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div
      className="
        grid grid-cols-2 gap-3
        sm:grid-cols-3
      "
    >
      {posts.map((post) => {
        const mediaUrl =
          getMediaUrl(post) ||
          post?.media?.[0]?.url ||
          '';

        const mediaType =
          getMediaType(post);

        const isVideo =
          mediaType === 'video' ||
          post?.media?.[0]?.type === 'video';

        const isTextPost =
          !mediaUrl;

        return (
          <Link
            key={getId(post)}
            to={`/post/${getId(post)}`}
            className="
              group relative aspect-square
              overflow-hidden rounded-2xl sm:rounded-[1.7rem]
              bg-zinc-100
            "
          >
            {/* IMAGE */}
            {mediaUrl && !isVideo && (
              <img
                className="
                  h-full w-full object-cover
                  transition-opacity duration-150
                "
                src={mediaUrl}
                alt={
                  post?.caption ||
                  'Post'
                }
                loading="lazy"
              />
            )}

            {/* VIDEO */}
            {mediaUrl && isVideo && (
              <>
                <video
                  className="
                    h-full w-full object-cover
                  "
                  muted
                  playsInline
                  preload="metadata"
                  poster={
                    post?.media?.[0]
                      ?.thumbnail || ''
                  }
                  src={mediaUrl}
                />

                {/* VIDEO ICON */}
                <div
                  className="
                    absolute right-3 top-3
                    flex h-8 w-8 items-center justify-center
                    rounded-full bg-black/40
                    backdrop-blur-md
                  "
                >
                  <Icon name="play" className="ml-0.5 text-xs text-white" />
                </div>
              </>
            )}

            {/* TEXT POST */}
            {isTextPost && (
              <div
                className="
                  flex h-full flex-col justify-between
                  p-3 sm:p-4
                "
              >
                <p
                  className="
                    line-clamp-6 whitespace-pre-wrap
                    text-sm leading-6
                    text-zinc-800
                  "
                >
                  {post?.textContent ||
                    post?.caption ||
                    'Untitled'}
                </p>

                <div
                  className="
                    mt-4 flex items-center gap-1
                    text-xs text-zinc-400
                  "
                >
                  <Icon name="like" />

                  <span>
                    {post.likeCount ??
                      post.likes?.length ??
                      0}
                  </span>
                </div>
              </div>
            )}

            {/* HOVER OVERLAY */}
            {!isTextPost && (
              <div
                className="
                  absolute inset-0
                  flex items-end
                  bg-gradient-to-t
                  from-black/70 via-black/10 to-transparent
                  p-4 opacity-0
                  transition-opacity duration-150
                  group-hover:opacity-100
                "
              >
                <div
                  className="
                    flex items-center gap-2
                    text-sm font-medium text-white
                  "
                >
                  <Icon name="like" />

                  <span>
                    {post.likeCount ??
                      post.likes?.length ??
                      0}
                  </span>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default PostGrid;
