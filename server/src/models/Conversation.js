const mongoose = require('mongoose');

const conversationSchema =
  new mongoose.Schema(
    {
      participants: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],

      participantKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      lastMessage: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

conversationSchema.index({
  participants: 1,
  updatedAt: -1,
});

conversationSchema.pre(
  'validate',
  function setParticipantKey() {
    if (!Array.isArray(this.participants)) {
      return;
    }

    const uniqueParticipants = [
      ...new Set(
        this.participants
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ].sort();

    this.participants = uniqueParticipants;
    this.participantKey = uniqueParticipants.join(':');
  }
);

conversationSchema.path('participants').validate(
  function validateParticipants(value) {
    return Array.isArray(value) && value.length === 2;
  },
  'A conversation must have exactly two unique participants'
);

module.exports =
  mongoose.model(
    'Conversation',
    conversationSchema
  );
