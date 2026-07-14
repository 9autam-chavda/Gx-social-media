const replyService =
  require('../services/replyService');

const ApiResponse =
  require('../utils/ApiResponse');

exports.addReply =
  async (req, res) => {
    const {
      commentId,
      text,
      replyingTo,
    } = req.body;

    const reply =
      await replyService.addReply({
        commentId,

        userId: req.user._id,

        text,

        replyingTo,
      });

    return ApiResponse.success(
      'Reply added successfully',
      reply
    ).send(res);
  };

exports.getReplies =
  async (req, res) => {
    const { commentId } =
      req.params;

    const replies =
      await replyService.getRepliesByComment(
        commentId
      );

    return ApiResponse.success(
      'Replies fetched successfully',
      replies
    ).send(res);
  };

  exports.toggleUpvote =
  async (req, res) => {
    const result =
      await replyService.toggleReplyUpvote(
        {
          replyId:
            req.params.replyId,

          userId:
            req.user._id,
        }
      );

    return ApiResponse.success(
      'Reply upvote toggled',
      result
    ).send(res);
  };

  exports.deleteReply =
  async (req, res) => {
    const result =
      await replyService.deleteReply(
        {
          replyId:
            req.params.replyId,

          userId:
            req.user._id,
        }
      );

    return ApiResponse.success(
      'Reply deleted successfully',
      result
    ).send(res);
  };