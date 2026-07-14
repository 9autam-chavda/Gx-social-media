const mongoose = require('mongoose');

const Reply = require('../models/Reply');

const Comment = require('../models/Comment');

const ApiError = require('../utils/ApiError');

const addReply = async ({
  commentId,
  userId,
  text,
  replyingTo = null,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      commentId
    )
  ) {
    throw new ApiError(
      'Invalid comment ID',
      400
    );
  }

  if (!text?.trim()) {
    throw new ApiError(
      'Reply text is required',
      400
    );
  }

  const comment =
    await Comment.findById(
      commentId
    );

  if (!comment) {
    throw new ApiError(
      'Comment not found',
      404
    );
  }

  const reply =
    await Reply.create({
      comment: commentId,

      user: userId,

      replyingTo,

      text: text.trim(),
    });

  await reply.populate([
    {
      path: 'user',

      select:
        'username profilePicture _id',
    },
    {
      path: 'replyingTo',

      select:
        'username profilePicture _id',
    },
  ]);

  return reply;
};

const getRepliesByComment =
  async (commentId) => {
    const replies =
      await Reply.find({
        comment: commentId,
      })
        .populate(
          'user',
          'username profilePicture _id'
        )
        .populate(
          'replyingTo',
          'username profilePicture _id'
        )
        .sort({
          createdAt: 1,
        });

    return replies;
  };

  const toggleReplyUpvote =
  async ({
    replyId,
    userId,
  }) => {
    const reply =
      await Reply.findById(
        replyId
      );

    if (!reply) {
      throw new ApiError(
        'Reply not found',
        404
      );
    }

    const alreadyUpvoted =
      reply.upvotes.some(
        (id) =>
          id.toString() ===
          userId.toString()
      );

    if (alreadyUpvoted) {
      reply.upvotes =
        reply.upvotes.filter(
          (id) =>
            id.toString() !==
            userId.toString()
        );
    } else {
      reply.upvotes.push(
        userId
      );
    }

    await reply.save();

    return {
      upvoted:
        !alreadyUpvoted,

      upvotes:
        reply.upvotes,
    };
  };

  const deleteReply =
  async ({
    replyId,
    userId,
  }) => {
    const reply =
      await Reply.findById(
        replyId
      );

    if (!reply) {
      throw new ApiError(
        'Reply not found',
        404
      );
    }

    if (
      reply.user.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        'Unauthorized',
        403
      );
    }

    await reply.deleteOne();

    return {
      success: true,
    };
  };

module.exports = {
  addReply,
  deleteReply,
  getRepliesByComment,
  toggleReplyUpvote,
};