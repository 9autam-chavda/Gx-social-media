const User = require('../models/User');
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');

const clampPagination = ({ page = 1, limit = 10 } = {}) => ({
  page: Math.max(parseInt(page, 10) || 1, 1),
  limit: Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50),
});

const decoratePosts = (posts, currentUserId, savedPosts = []) => {
  const viewerId = currentUserId.toString();

  const savedSet = new Set(
    savedPosts.map((id) => id.toString())
  );

  return posts.map((post) => {
    const likes = post.likes || [];

    const isSaved = savedSet.has(
      post._id.toString()
    );

    return {
      ...post,

      likeCount: likes.length,

      commentCount:
        post.commentsCount || 0,

      isLiked: likes.some(
        (like) =>
          (like._id || like).toString() ===
          viewerId
      ),

      isSaved,

      saved: isSaved,
    };
  });
};

const getFeedPosts = async ({
  currentUserId,
  page = 1,
  limit = 10,
}) => {
  const {
    page: currentPage,
    limit: pageSize,
  } = clampPagination({ page, limit });

  const currentUser =
    await User.findById(currentUserId)
      .select('following savedPosts')
      .lean();

  if (!currentUser) {
    throw new ApiError(
      'User not found',
      404
    );
  }

  const userIds = [
    ...new Set([
      currentUserId.toString(),
      ...(currentUser.following || []).map(
        (id) => id.toString()
      ),
    ]),
  ];

  const skip =
    (currentPage - 1) * pageSize;

  const [posts, totalPosts] =
    await Promise.all([
      Post.find({
        user: { $in: userIds },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate(
          'user',
          'username profilePicture'
        )
        .populate(
          'likes',
          'username profilePicture'
        )
        .lean(),

      Post.countDocuments({
        user: { $in: userIds },
      }),
    ]);

  return {
    posts: decoratePosts(
      posts,
      currentUserId,
      currentUser.savedPosts || []
    ),

    pagination: {
      currentPage,

      totalPages: Math.max(
        1,
        Math.ceil(totalPosts / pageSize)
      ),

      totalPosts,

      hasNext:
        currentPage * pageSize <
        totalPosts,

      limit: pageSize,
    },
  };
};

const getExplorePosts = async ({
  currentUserId,
  page = 1,
  limit = 10,
}) => {
  const {
    page: currentPage,
    limit: pageSize,
  } = clampPagination({ page, limit });

  const skip =
    (currentPage - 1) * pageSize;

  const currentUser =
    await User.findById(currentUserId)
      .select('savedPosts')
      .lean();

  const [posts, totalPosts] =
    await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate(
          'user',
          'username profilePicture'
        )
        .populate(
          'likes',
          'username profilePicture'
        )
        .lean(),

      Post.countDocuments(),
    ]);

  return {
    posts: decoratePosts(
      posts,
      currentUserId,
      currentUser?.savedPosts || []
    ),

    pagination: {
      currentPage,

      totalPages: Math.max(
        1,
        Math.ceil(totalPosts / pageSize)
      ),

      totalPosts,

      hasNext:
        currentPage * pageSize <
        totalPosts,

      limit: pageSize,
    },
  };
};

module.exports = {
  getFeedPosts,
  getExplorePosts,
};