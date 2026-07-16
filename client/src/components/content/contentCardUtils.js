import {
  getId,
  getMediaType,
  getMediaUrl,
  getPostText,
} from '../../utils/formatters';

export const isThoughtPost = (post) =>
  post?.type === 'text';

export const createContentKey = (post) =>
  getId(post) ||
  `${post?.type}-${post?.createdAt}`;

export const getPostAuthor = (post) =>
  post?.author ||
  post?.user ||
  post?.createdBy ||
  null;

export const getPostHref = (post) =>
  `/post/${getId(post)}`;

export const getPostPreviewText = (post) =>
  getPostText(post) || 'Untitled post';

export const getPostCounts = (post) => ({
  likes:
    post?.likeCount ??
    post?.likesCount ??
    post?.likes?.length ??
    0,
  comments:
    post?.commentCount ??
    post?.commentsCount ??
    post?.comments?.length ??
    0,
});

export const getPostMedia = (post) => {
  const mediaUrl =
    getMediaUrl(post) ||
    post?.media?.[0]?.url ||
    '';

  const mediaType =
    getMediaType(post) ||
    post?.media?.[0]?.type;

  return {
    mediaUrl,
    mediaType,
    isVideo: mediaType === 'video',
    poster:
      post?.media?.[0]?.thumbnail ||
      post?.thumbnail ||
      '',
  };
};
