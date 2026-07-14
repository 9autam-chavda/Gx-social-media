const { Server } = require('socket.io');

const User = require('../models/User');
const chatService = require('../services/chatService');
const { verifyToken } = require('../utils/tokenUtils');

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return (value._id || value.id || value).toString();
};

const getOnlineUserIds = (presence) =>
  Array.from(presence.keys());

const emitPresence = (io, presence) => {
  io.emit('presence:update', {
    onlineUserIds: getOnlineUserIds(presence),
  });
};

const initializeChatSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const presence = new Map();

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId)
        .select('_id username profilePicture')
        .lean();

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on('connection', (socket) => {
    const userId = getId(socket.user);
    const userSockets = presence.get(userId) || new Set();

    userSockets.add(socket.id);
    presence.set(userId, userSockets);
    socket.join(userId);
    emitPresence(io, presence);

    socket.on('message:send', async (payload = {}, ack) => {
      try {
        const message = await chatService.createMessage({
          conversationId: payload.conversationId,
          senderId: socket.user._id,
          text: payload.text,
          clientId: payload.clientId,
        });

        const conversationId = getId(message.conversationId);
        const senderId = getId(message.sender);
        const receiverId = getId(message.receiver);

        const eventPayload = {
          clientId: payload.clientId || null,
          conversationId,
          message,
        };

        io.to(senderId).to(receiverId).emit('message:new', eventPayload);
        io.to(senderId).to(receiverId).emit('conversation:updated', eventPayload);

        if (typeof ack === 'function') {
          ack({
            ok: true,
            ...eventPayload,
          });
        }
      } catch (error) {
        if (typeof ack === 'function') {
          ack({
            ok: false,
            message: error.message || 'Unable to send message',
          });
        }
      }
    });

    socket.on('presence:get', (ack) => {
      if (typeof ack === 'function') {
        ack({
          onlineUserIds: getOnlineUserIds(presence),
        });
      }
    });

    socket.on('disconnect', () => {
      const sockets = presence.get(userId);

      if (!sockets) return;

      sockets.delete(socket.id);

      if (sockets.size === 0) {
        presence.delete(userId);
      } else {
        presence.set(userId, sockets);
      }

      emitPresence(io, presence);
    });
  });

  app.set('io', io);
  app.set('presence', presence);

  return io;
};

module.exports = initializeChatSocket;
