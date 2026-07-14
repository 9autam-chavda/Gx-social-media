const mongoose = require('mongoose');

const Comment = require('../models/Comment');

const Post = require('../models/Post');

const ApiError = require('../utils/ApiError');

const Reply = require('../models/Reply');

const createComment = async ({
  postId,
  userId,
  text,
}) => {
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

  if (!text?.trim()) {
    throw new ApiError(
      'Comment text is required',
      400
    );
  }

  const post =
    await Post.findById(postId);

  if (!post) {
    throw new ApiError(
      'Post not found',
      404
    );
  }

  const comment =
    await Comment.create({
      post: postId,

      user: userId,

      text: text.trim(),
    });

  post.commentsCount += 1;

  await post.save();

  await comment.populate(
    'user',
    'username profilePicture _id'
  );

  return comment;
};

const getCommentsByPost =
  async (postId) => {
    const comments =
      await Comment.find({
        post: postId,
      })
        .populate(
          'user',
          'username profilePicture _id'
        )
        .sort({
          createdAt: -1,
        });

    return comments;
  };

  const toggleCommentUpvote =
  async ({
    commentId,
    userId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        commentId
      )
      ||
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new ApiError(
        'Invalid comment or user ID',
        400
      );
    }

    const userObjectId =
      new mongoose.Types.ObjectId(
        userId
      );

    const alreadyUpvoted =
      await Comment.exists({
        _id: commentId,
        upvotes: userObjectId,
      });

    const comment =
      await Comment.findByIdAndUpdate(
        commentId,
        alreadyUpvoted
          ? {
              $pull: {
                upvotes: userObjectId,
              },
            }
          : {
              $addToSet: {
                upvotes: userObjectId,
              },
            },
        {
          new: true,
          runValidators: true,
        }
      ).select('upvotes');

    if (!comment) {
      throw new ApiError(
        'Comment not found',
        404
      );
    }

    return {
      upvoted:
        !alreadyUpvoted,

      upvotes:
        comment.upvotes,

      upvoteCount:
        comment.upvotes.length,
    };
  };

  const deleteComment =
  async ({
    commentId,
    userId,
  }) => {
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

    if (
      comment.user.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        'Unauthorized',
        403
      );
    }

    await Reply.deleteMany({
      comment: commentId,
    });

    await Post.findByIdAndUpdate(
      comment.post,
      {
        $inc: {
          commentsCount: -1,
        },
      }
    );

    await comment.deleteOne();

    return {
      success: true,
    };
  };

module.exports = {
  createComment,

  getCommentsByPost,
  toggleCommentUpvote,
  deleteComment,
};
