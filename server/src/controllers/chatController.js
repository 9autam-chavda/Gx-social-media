const chatService = require('../services/chatService');
const ApiResponse = require('../utils/ApiResponse');

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return (value._id || value.id || value).toString();
};

const emitMessageEvents = (req, message, clientId = null) => {
  const io = req.app.get('io');

  if (!io || !message) return;

  const conversationId = getId(message.conversationId);
  const senderId = getId(message.sender);
  const receiverId = getId(message.receiver);

  if (!conversationId || !senderId || !receiverId) return;

  const eventPayload = {
    clientId,
    conversationId,
    message,
  };

  io.to(senderId).to(receiverId).emit('message:new', eventPayload);
  io.to(senderId).to(receiverId).emit('conversation:updated', eventPayload);
};

exports.createConversation = async (req, res) => {
  const conversation = await chatService.createConversation({
    currentUserId: req.user._id,
    participantId: req.body.participantId,
  });

  return ApiResponse.success('Conversation ready', conversation, 201).send(res);
};

exports.getConversations = async (req, res) => {
  const conversations = await chatService.getConversations({
    userId: req.user._id,
  });

  return ApiResponse.success(
    'Conversations fetched successfully',
    conversations
  ).send(res);
};

exports.createMessage = async (req, res) => {
  const message = await chatService.createMessage({
    conversationId: req.body.conversationId,
    senderId: req.user._id,
    text: req.body.text,
    clientId: req.body.clientId,
  });

  emitMessageEvents(req, message, req.body.clientId || null);

  return ApiResponse.success(
    'Message sent successfully',
    message,
    201
  ).send(res);
};

exports.getMessages = async (req, res) => {
  const result = await chatService.getMessages({
    conversationId: req.params.conversationId,
    userId: req.user._id,
    page: req.query.page,
    limit: req.query.limit,
  });

  return ApiResponse.success('Messages fetched successfully', result).send(res);
};
