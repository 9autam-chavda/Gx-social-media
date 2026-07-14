const mongoose = require('mongoose');

const messageSchema =
  new mongoose.Schema(
    {
      conversationId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      receiver: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },

      clientId: {
        type: String,
        trim: true,
        maxlength: 120,
      },

      seen: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

messageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

messageSchema.index({
  receiver: 1,
  seen: 1,
  createdAt: -1,
});

messageSchema.index(
  {
    conversationId: 1,
    sender: 1,
    clientId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

module.exports =
  mongoose.model(
    'Message',
    messageSchema
  );
