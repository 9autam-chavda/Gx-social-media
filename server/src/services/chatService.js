const mongoose = require('mongoose');

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const USER_SELECT = 'username profilePicture bio';

const validateId = (value, label) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${label}`, 400);
  }
};

const buildParticipantKey = (firstUserId, secondUserId) =>
  [firstUserId, secondUserId]
    .map((id) => id.toString())
    .sort()
    .join(':');

const ensureDifferentUsers = (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError('You cannot start a conversation with yourself', 400);
  }
};

const assertConversationAccess = async ({ conversationId, userId }) => {
  validateId(conversationId, 'conversation ID');

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  return conversation;
};

const createConversation = async ({ currentUserId, participantId }) => {
  validateId(participantId, 'participant ID');
  ensureDifferentUsers(currentUserId, participantId);

  const participant = await User.findById(participantId).select('_id').lean();

  if (!participant) {
    throw new ApiError('User not found', 404);
  }

  const participantKey = buildParticipantKey(currentUserId, participantId);

  const conversation = await Conversation.findOneAndUpdate(
    { participantKey },
    {
      $setOnInsert: {
        participants: [currentUserId, participantId],
        participantKey,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
    .populate('participants', USER_SELECT)
    .populate({
      path: 'lastMessage',
      populate: [
        { path: 'sender', select: USER_SELECT },
        { path: 'receiver', select: USER_SELECT },
      ],
    });

  return conversation;
};

const getConversations = async ({ userId }) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .sort({ updatedAt: -1 })
    .populate('participants', USER_SELECT)
    .populate({
      path: 'lastMessage',
      populate: [
        { path: 'sender', select: USER_SELECT },
        { path: 'receiver', select: USER_SELECT },
      ],
    })
    .lean();

  return Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        receiver: userId,
        seen: false,
      });

      return {
        ...conversation,
        unreadCount,
      };
    })
  );
};

const createMessage = async ({ conversationId, senderId, text, clientId = null }) => {
  const cleanText = text?.trim();
  const cleanClientId = clientId?.trim();

  if (!cleanText) {
    throw new ApiError('Message text is required', 400);
  }

  if (cleanText.length > 2000) {
    throw new ApiError('Message cannot exceed 2000 characters', 400);
  }

  if (cleanClientId && cleanClientId.length > 120) {
    throw new ApiError('Invalid message client ID', 400);
  }

  const conversation = await assertConversationAccess({
    conversationId,
    userId: senderId,
  });

  const receiverId = conversation.participants.find(
    (participant) => participant.toString() !== senderId.toString()
  );

  if (!receiverId) {
    throw new ApiError('Message receiver not found', 400);
  }

  if (cleanClientId) {
    const existingMessage = await Message.findOne({
      conversationId: conversation._id,
      sender: senderId,
      clientId: cleanClientId,
    })
      .populate('sender', USER_SELECT)
      .populate('receiver', USER_SELECT);

    if (existingMessage) {
      return existingMessage;
    }
  }

  const message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    receiver: receiverId,
    text: cleanText,
    clientId: cleanClientId || undefined,
  });

  conversation.lastMessage = message._id;
  conversation.updatedAt = new Date();
  await conversation.save();

  await message.populate([
    { path: 'sender', select: USER_SELECT },
    { path: 'receiver', select: USER_SELECT },
  ]);

  return message;
};

const getMessages = async ({
  conversationId,
  userId,
  page = 1,
  limit = 40,
}) => {
  await assertConversationAccess({
    conversationId,
    userId,
  });

  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 40, 1), 100);

  const totalMessages = await Message.countDocuments({ conversationId });
  const skip = Math.max(totalMessages - currentPage * pageSize, 0);

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(pageSize)
    .populate('sender', USER_SELECT)
    .populate('receiver', USER_SELECT)
    .lean();

  await Message.updateMany(
    {
      conversationId: new mongoose.Types.ObjectId(conversationId),
      receiver: userId,
      seen: false,
    },
    {
      $set: {
        seen: true,
      },
    }
  );

  return {
    messages,
    pagination: {
      currentPage,
      totalPages: Math.ceil(totalMessages / pageSize) || 1,
      totalMessages,
      hasNext: skip > 0,
      limit: pageSize,
    },
  };
};

module.exports = {
  createConversation,
  getConversations,
  createMessage,
  getMessages,
  assertConversationAccess,
};
