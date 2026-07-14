const mongoose = require('mongoose');

/**
 * UNIVERSAL POST MODEL
 */

const mediaSchema =
  new mongoose.Schema(
    {
      type: {
        type: String,
        enum: [
          'image',
          'video',
        ],
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      fileId: {
        type: String,
        required: true,
      },

      thumbnail: String,

      duration: Number,

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { _id: false }
  );

const postSchema =
  new mongoose.Schema(
    {
      // ====================
      // AUTHOR
      // ====================

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true,

        index: true,
      },

      // ====================
      // CONTENT
      // ====================

      type: {
        type: String,

        enum: [
          'text',
          'image',
          'video',
        ],

        default: 'text',

        required: true,

        index: true,
      },

      textContent: {
        type: String,

        maxlength: 2000,
      },

      caption: {
        type: String,

        maxlength: 500,
      },

      media: [mediaSchema],

      // ====================
      // ENGAGEMENT
      // ====================

      likesCount: {
        type: Number,

        default: 0,

        min: 0,
      },

      commentsCount: {
        type: Number,

        default: 0,

        min: 0,
      },

      sharesCount: {
        type: Number,

        default: 0,

        min: 0,
      },

      viewsCount: {
        type: Number,

        default: 0,

        min: 0,
      },

      likes: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: 'User',
        },
      ],

      // ====================
      // METADATA
      // ====================

      visibility: {
        type: String,

        enum: [
          'public',
          'followers',
          'private',
        ],

        default: 'public',
      },

      hashtags: [String],

      mentions: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: 'User',
        },
      ],

      isEdited: {
        type: Boolean,

        default: false,
      },

      editedAt: Date,
    },
    {
      timestamps: true,
    }
  );

// ====================
// INDEXES
// ====================

postSchema.index({
  createdAt: -1,
});

postSchema.index({
  user: 1,
  createdAt: -1,
});

postSchema.index({
  type: 1,
  createdAt: -1,
});

postSchema.index({
  hashtags: 1,
  createdAt: -1,
});

postSchema.index({
  visibility: 1,
  user: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    'Post',
    postSchema
  );