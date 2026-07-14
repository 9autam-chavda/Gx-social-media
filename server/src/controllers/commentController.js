const commentService =
  require('../services/commentService');

const ApiResponse =
  require('../utils/ApiResponse');

const Post = require('../models/Post');
const {
  createNotification,
} = require('../services/notificationService');

exports.createComment =
  async (req, res) => {
    const { postId, text } =
      req.body;

    const comment =
      await commentService.createComment({
        postId,

        userId: req.user._id,

        text,
      });

    const post = await Post.findById(postId).select('user').lean();

    if (post?.user?.toString() && post.user.toString() !== req.user._id.toString()) {
      const notification = await createNotification({
        recipientId: post.user,
        senderId: req.user._id,
        type: 'comment',
        postId,
        commentId: comment._id,
      });

      const io = req.app.get('io');
      if (io && notification) {
        io.to(post.user.toString()).emit('newNotification', notification);
      }
    }

    return ApiResponse.success(
      'Comment added successfully',
      comment
    ).send(res);
  };

exports.getComments =
  async (req, res) => {
    const { postId } =
      req.params;

    const comments =
      await commentService.getCommentsByPost(
        postId
      );

    return ApiResponse.success(
      'Comments fetched successfully',
      comments
    ).send(res);
  };

  exports.toggleUpvote =
  async (req, res) => {
    const result =
      await commentService.toggleCommentUpvote(
        {
          commentId:
            req.params.commentId,

          userId:
            req.user._id,
        }
      );

    return ApiResponse.success(
      'Comment upvote toggled',
      result
    ).send(res);
  };

  exports.deleteComment =
  async (req, res) => {
    const result =
      await commentService.deleteComment(
        {
          commentId:
            req.params.commentId,

          userId:
            req.user._id,
        }
      );

    return ApiResponse.success(
      'Comment deleted successfully',
      result
    ).send(res);
  };