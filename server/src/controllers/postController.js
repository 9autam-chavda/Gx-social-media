const {
  createPost,
  getPosts,
  getFeed,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
} = require('../services/postService');

const {
  createNotification,
} = require('../services/notificationService');

const {
  savePost: saveUserPost,
  unsavePost: unsaveUserPost,
} = require('../services/userService');

const ApiResponse =
  require('../utils/ApiResponse');

const ApiError =
  require('../utils/ApiError');

/**
 * ====================
 * CREATE POST
 * ====================
 */

exports.createPost =
  async (req, res) => {
    try {
      const {
        type = 'text',
        textContent,
        caption,
        visibility = 'public',
        hashtags,
      } = req.body;

      const hashtagArray =
        typeof hashtags ===
        'string'
          ? hashtags
              .split(',')
              .map((tag) =>
                tag.trim()
              )
              .filter(Boolean)
          : Array.isArray(
                hashtags
              )
            ? hashtags
            : [];

      const post =
        await createPost({
          userId:
            req.user._id,

          type,

          textContent,

          caption,

          files:
            req.files ||
            (req.file
              ? [req.file]
              : []),

          visibility,

          hashtags:
            hashtagArray,
        });

      return ApiResponse.success(
        'Post created successfully',
        post,
        201
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to create post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * GET FEED
 * ====================
 */

exports.getFeedPosts =
  async (req, res) => {
    try {
      const result =
        await getFeed({
          page:
            req.query.page,

          limit:
            req.query.limit,

          currentUserId:
            req.user._id,
        });

      return ApiResponse.success(
        'Feed retrieved successfully',
        result
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to fetch feed',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * GET ALL POSTS
 * ====================
 */

exports.getAllPosts =
  async (req, res) => {
    try {
      const posts =
        await getPosts({
          page:
            req.query.page,

          limit:
            req.query.limit,

          currentUserId:
            req.user._id,
        });

      return ApiResponse.success(
        'Posts retrieved successfully',
        posts
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to fetch posts',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * GET SINGLE POST
 * ====================
 */

exports.getPostById =
  async (req, res) => {
    try {
      const post =
        await getPostById(
          req.params.id,
          req.user._id
        );

      return ApiResponse.success(
        'Post retrieved successfully',
        post
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to fetch post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * DELETE POST
 * ====================
 */

exports.deletePost =
  async (req, res) => {
    try {
      const postId =
        await deletePost(
          req.params.id,
          req.user._id
        );

      return ApiResponse.success(
        'Post deleted successfully',
        { postId }
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to delete post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * LIKE POST
 * ====================
 */

exports.likePost =
  async (req, res) => {
    try {
      const result =
        await likePost(
          req.params.id,
          req.user._id
        );

      const notification = await createNotification({
        recipientId: result.post.user,
        senderId: req.user._id,
        type: 'like',
        postId: req.params.id,
      });

      const io = req.app.get('io');
      if (io && notification) {
        io.to(result.post.user.toString()).emit('newNotification', notification);
      }

      return ApiResponse.success(
        'Post liked successfully',
        result
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to like post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * UNLIKE POST
 * ====================
 */

exports.unlikePost =
  async (req, res) => {
    try {
      const result =
        await unlikePost(
          req.params.id,
          req.user._id
        );

      return ApiResponse.success(
        'Post unliked successfully',
        result
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to unlike post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * SAVE POST
 * ====================
 */

exports.savePost =
  async (req, res) => {
    try {
      const result =
        await saveUserPost({
          postId:
            req.params.id,

          userId:
            req.user._id,
        });

      return ApiResponse.success(
        'Post saved successfully',
        result
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to save post',
        500
      ).send(res);
    }
  };

/**
 * ====================
 * UNSAVE POST
 * ====================
 */

exports.unsavePost =
  async (req, res) => {
    try {
      const result =
        await unsaveUserPost({
          postId:
            req.params.id,

          userId:
            req.user._id,
        });

      return ApiResponse.success(
        'Post unsaved successfully',
        result
      ).send(res);
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        return ApiResponse.error(
          error.message,
          error.statusCode
        ).send(res);
      }

      return ApiResponse.error(
        'Failed to unsave post',
        500
      ).send(res);
    }
  };