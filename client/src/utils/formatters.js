export const getId = (entity) => {
  const id = entity?._id || entity?.id || entity;
  return id === undefined || id === null ? '' : id.toString();
};

export const getPostAuthorId = (post) => getId(post?.user || post?.author || post?.createdBy);

export const getImageUrl = (imageLike) => {
  if (!imageLike) return '';
  if (typeof imageLike === 'string') return imageLike;
  return imageLike.url || '';
};

export const getMediaUrl = (post) => {
  const media = Array.isArray(post?.media) ? post.media[0] : null;
  if (media?.url) return media.url;
  return getImageUrl(post?.image);
};

export const getMediaType = (post) => {
  const media = Array.isArray(post?.media) ? post.media[0] : null;
  if (media?.type) return media.type;
  return getImageUrl(post?.image) ? 'image' : undefined;
};

export const getPostText = (post) => post?.textContent || post?.caption || '';

export const timeAgo = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    ['y', 31536000],
    ['mo', 2592000],
    ['w', 604800],
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
  ];

  const match = intervals.find(([, amount]) => seconds >= amount);
  if (!match) return 'now';

  const [label, amount] = match;
  return `${Math.floor(seconds / amount)}${label}`;
};

export const isLikedBy = (post, userId) =>
  Boolean(post?.likes?.some((like) => getId(like)?.toString() === userId?.toString()));
