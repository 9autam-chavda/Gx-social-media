export const getId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
};

export const sameId = (left, right) => {
  const leftId = getId(left);
  const rightId = getId(right);

  return (
    !!leftId &&
    !!rightId &&
    leftId.toString() === rightId.toString()
  );
};

export const getUsername = (user) => {
  if (!user || typeof user === 'string') {
    return 'unknown';
  }

  return user.username || 'unknown';
};

export const normalizeUser = (user, fallback = null) => {
  if (!user) return fallback;

  if (typeof user === 'string') {
    return fallback && sameId(user, fallback)
      ? fallback
      : { _id: user };
  }

  return {
    ...user,
    _id: getId(user),
  };
};

export const normalizeReply = (reply, currentUser = null) => {
  const id = getId(reply);

  if (!id || !reply?.text) {
    return null;
  }

  return {
    ...reply,
    _id: id,
    user: normalizeUser(reply.user, currentUser),
    replyingTo: reply.replyingTo
      ? normalizeUser(reply.replyingTo)
      : null,
    text: reply.text,
    upvotes: Array.isArray(reply.upvotes)
      ? reply.upvotes
      : [],
    createdAt: reply.createdAt || new Date().toISOString(),
  };
};

export const normalizeReplies = (replies, currentUser) =>
  (Array.isArray(replies) ? replies : [])
    .map((reply) => normalizeReply(reply, currentUser))
    .filter(Boolean);

export const normalizeComment = (comment, currentUser = null) => {
  const id = getId(comment);

  if (!id || !comment?.text) {
    return null;
  }

  const replies = normalizeReplies(comment.replies, currentUser);

  return {
    ...comment,
    _id: id,
    user: normalizeUser(comment.user, currentUser),
    text: comment.text,
    upvotes: Array.isArray(comment.upvotes)
      ? comment.upvotes
      : [],
    replies,
    replyCount:
      comment.replyCount ??
      comment.repliesCount ??
      replies.length,
    createdAt:
      comment.createdAt || new Date().toISOString(),
  };
};

export const normalizeComments = (comments, currentUser) =>
  (Array.isArray(comments) ? comments : [])
    .map((comment) => normalizeComment(comment, currentUser))
    .filter(Boolean);
