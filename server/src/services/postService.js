const mongoose =
  require('mongoose');

const Post =
  require('../models/Post');

const User =
  require('../models/User');

const {
  uploadMultipleMediaToImageKit,
  deleteMultipleMediaFromImageKit,
} = require('../utils/imagekitHelper');

const {
  validatePostCreation,
} = require('../utils/postValidation');

const ApiError =
  require('../utils/ApiError');

const POST_POPULATE = [
  {
    path: 'user',
    select:
      'username profilePicture _id',
  },
  {
    path: 'likes',
    select:
      'username profilePicture _id',
  },
  {
    path: 'mentions',
    select:
      'username profilePicture _id',
  },
];

const validatePagination = (
  page = 1,
  limit = 10
) => {
  const validPage =
    Math.max(
      parseInt(page, 10) || 1,
      1
    );

  const validLimit =
    Math.min(
      Math.max(
        parseInt(limit, 10) ||
          10,
        1
      ),
      100
    );

  return {
    page: validPage,

    limit: validLimit,

    skip:
      (validPage - 1) *
      validLimit,
  };
};

const decoratePost = (
  post,
  currentUserId = null,
  savedPosts = []
) => {
  if (!post) return null;

  const likeIds = (
    post.likes || []
  ).map((like) =>
    typeof like ===
    'string'
      ? like
      : like._id?.toString()
  );

  return {
    ...post,

    likeCount:
      post.likes?.length || 0,

    commentCount:
      post.commentsCount || 0,

    sharesCount:
      post.sharesCount || 0,

    viewsCount:
      post.viewsCount || 0,

    isLiked:
      currentUserId
        ? likeIds.includes(
            currentUserId?.toString()
          )
        : false,

    isSaved:
      currentUserId
        ? (
            savedPosts || []
          ).some(
            (id) =>
              id.toString() ===
              post._id.toString()
          )
        : false,
  };
};

const createPost =
  async (params) => {
    const {
      userId,
      type = 'text',
      textContent,
      caption,
      files = [],
      visibility = 'public',
      hashtags = [],
    } = params;

    const postData = {
      type,

      textContent,

      caption,

      media:
        files &&
        files.length > 0
          ? files.map(
              (file) => ({
                type:
                  file.mimetype.startsWith(
                    'video/'
                  )
                    ? 'video'
                    : 'image',
              })
            )
          : [],
    };

    const validation =
      validatePostCreation(
        postData
      );

    if (!validation.isValid) {
      throw new ApiError(
        validation.errors.join(
          '; '
        ),
        400
      );
    }

    let uploadedMedia = [];

    if (
      files &&
      files.length > 0
    ) {
      uploadedMedia =
        await uploadMultipleMediaToImageKit(
          files
        );
    }

    const post =
      await Post.create({
        user: userId,

        type,

        textContent:
          textContent?.trim(),

        caption:
          caption?.trim(),

        media: uploadedMedia,

        visibility,

        hashtags:
          hashtags.filter(
            (tag) =>
              tag.trim()
          ),

        likesCount: 0,

        commentsCount: 0,

        sharesCount: 0,

        viewsCount: 0,
      });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          posts: post._id,
        },
      }
    );

    await post.populate(
      POST_POPULATE
    );

    return decoratePost(
      post,
      userId
    );
  };

const getFeed =
  async (params) => {
    const {
      page = 1,
      limit = 10,
      currentUserId = null,
    } = params;

    const pagination =
      validatePagination(
        page,
        limit
      );

    const [
      posts,
      totalCount,
    ] = await Promise.all([
      Post.find({
        visibility:
          'public',
      })
        .populate(
          POST_POPULATE
        )
        .sort({
          createdAt: -1,
        })
        .skip(
          pagination.skip
        )
        .limit(
          pagination.limit
        )
        .lean(),

      Post.countDocuments({
        visibility:
          'public',
      }),
    ]);

    const currentUser =
      currentUserId
        ? await User.findById(
            currentUserId
          )
            .select(
              'savedPosts'
            )
            .lean()
        : null;

    const savedPosts =
      currentUser
        ?.savedPosts || [];

    const decoratedPosts =
      posts.map((post) =>
        decoratePost(
          post,
          currentUserId,
          savedPosts
        )
      );

    return {
      posts:
        decoratedPosts,

      pagination: {
        page:
          pagination.page,

        limit:
          pagination.limit,

        totalCount,

        totalPages:
          Math.ceil(
            totalCount /
              pagination.limit
          ),

        hasNext:
          pagination.page *
            pagination.limit <
          totalCount,

        hasPrev:
          pagination.page >
          1,
      },
    };
  };

const getPosts =
  async (params) => {
    const result =
      await getFeed(params);

    return {
      posts: result.posts,

      currentPage:
        result.pagination.page,

      totalPages:
        result.pagination
          .totalPages,

      totalPosts:
        result.pagination
          .totalCount,

      hasNext:
        result.pagination
          .hasNext,
    };
  };

const getPostById =
  async (
    postId,
    currentUserId = null
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        postId
      )
    ) {
      throw new ApiError(
        'Invalid post ID',
        400
      );
    }

    const [
      post,
      currentUser,
    ] = await Promise.all([
      Post.findById(postId)
        .populate(
          POST_POPULATE
        )
        .lean(),

      currentUserId
        ? User.findById(
            currentUserId
          )
            .select(
              'savedPosts'
            )
            .lean()
        : null,
    ]);

    if (!post) {
      throw new ApiError(
        'Post not found',
        404
      );
    }

    const savedPosts =
      currentUser
        ?.savedPosts || [];

    return decoratePost(
      post,
      currentUserId,
      savedPosts
    );
  };

const deletePost =
  async (
    postId,
    userId
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        postId
      )
    ) {
      throw new ApiError(
        'Invalid post ID',
        400
      );
    }

    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      throw new ApiError(
        'Post not found',
        404
      );
    }

    if (
      post.user.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        'You can only delete your own posts',
        403
      );
    }

    if (
      post.media &&
      post.media.length > 0
    ) {
      const fileIds =
        post.media
          .map(
            (m) => m.fileId
          )
          .filter(Boolean);

      if (
        fileIds.length > 0
      ) {
        await deleteMultipleMediaFromImageKit(
          fileIds
        );
      }
    }

    await Post.findByIdAndDelete(
      postId
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          posts: postId,
        },
      }
    );

    return postId;
  };

const likePost =
  async (
    postId,
    userId
  ) => {
    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      throw new ApiError(
        'Post not found',
        404
      );
    }

    const isLiked =
      post.likes.some(
        (like) =>
          like.toString() ===
          userId.toString()
      );

    if (isLiked) {
      throw new ApiError(
        'Post already liked',
        400
      );
    }

    post.likes.push(userId);

    post.likesCount =
      post.likes.length;

    await post.save();

    const updatedPost =
      await Post.findById(
        postId
      )
        .populate(
          POST_POPULATE
        )
        .lean();

    return {
      post: decoratePost(
        updatedPost,
        userId
      ),

      likeCount:
        updatedPost.likes
          .length,

      isLiked: true,
    };
  };

const unlikePost =
  async (
    postId,
    userId
  ) => {
    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      throw new ApiError(
        'Post not found',
        404
      );
    }

    post.likes =
      post.likes.filter(
        (like) =>
          like.toString() !==
          userId.toString()
      );

    post.likesCount =
      post.likes.length;

    await post.save();

    const updatedPost =
      await Post.findById(
        postId
      )
        .populate(
          POST_POPULATE
        )
        .lean();

    return {
      post: decoratePost(
        updatedPost,
        userId
      ),

      likeCount:
        updatedPost.likes
          .length,

      isLiked: false,
    };
  };

module.exports = {
  createPost,

  getPosts,

  getFeed,

  getPostById,

  deletePost,

  likePost,

  unlikePost,

  decoratePost,

  validatePagination,
};