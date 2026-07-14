const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const VALID_TYPES = ['follow', 'like', 'comment'];

const normalizeObjectId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return mongoose.Types.ObjectId.isValid(value)
      ? new mongoose.Types.ObjectId(value)
      : null;
  }
  if (value instanceof mongoose.Types.ObjectId) {
    return value;
  }
  if (typeof value === 'object' && value._id) {
    return normalizeObjectId(value._id);
  }
  return null;
};

const createNotification = async ({
  recipientId,
  senderId,
  type,
  postId = null,
  commentId = null,
  metadata = {},
}) => {
  const normalizedRecipient = normalizeObjectId(recipientId);
  const normalizedSender = normalizeObjectId(senderId);

  if (!normalizedRecipient || !normalizedSender) {
    throw new ApiError('Invalid recipient or sender ID', 400);
  }

  if (!VALID_TYPES.includes(type)) {
    throw new ApiError('Invalid notification type', 400);
  }

  if (normalizedRecipient.equals(normalizedSender)) {
    return null;
  }

  const created = await Notification.create({
    recipient: normalizedRecipient,
    sender: normalizedSender,
    type,
    post: normalizeObjectId(postId),
    comment: normalizeObjectId(commentId),
    metadata,
  });

  const notification = await Notification.findById(created._id)
    .populate('sender', 'username profilePicture')
    .populate('post', 'caption type user')
    .populate('comment', 'text post')
    .lean();

  return notification;
};

const getNotifications = async ({
  recipientId,
  page = 1,
  limit = 20,
}) => {
  const normalizedRecipient = normalizeObjectId(recipientId);

  if (!normalizedRecipient) {
    throw new ApiError('Invalid recipient ID', 400);
  }

  const normalizedPage = Math.max(parseInt(page, 10) || 1, 1);
  const normalizedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [notifications, totalCount] = await Promise.all([
    Notification.find({ recipient: normalizedRecipient })
      .populate('sender', 'username profilePicture')
      .populate('post', 'caption type user')
      .populate('comment', 'text post')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .lean(),
    Notification.countDocuments({ recipient: normalizedRecipient }),
  ]);

  return {
    notifications,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      totalCount,
      totalPages: Math.max(Math.ceil(totalCount / normalizedLimit), 1),
      hasNext: skip + normalizedLimit < totalCount,
    },
  };
};

const countUnread = async (recipientId) => {
  const normalizedRecipient = normalizeObjectId(recipientId);

  if (!normalizedRecipient) {
    throw new ApiError('Invalid recipient ID', 400);
  }

  return Notification.countDocuments({
    recipient: normalizedRecipient,
    isRead: false,
  });
};

const markNotificationRead = async ({ recipientId, notificationId }) => {
  const normalizedRecipient = normalizeObjectId(recipientId);
  const normalizedNotification = normalizeObjectId(notificationId);

  if (!normalizedRecipient || !normalizedNotification) {
    throw new ApiError('Invalid notification or recipient ID', 400);
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: normalizedNotification,
      recipient: normalizedRecipient,
    },
    { isRead: true },
    { new: true }
  )
    .populate('sender', 'username profilePicture')
    .populate('post', 'caption type user')
    .populate('comment', 'text post')
    .lean();

  if (!notification) {
    throw new ApiError('Notification not found', 404);
  }

  return notification;
};

const markAllNotificationsRead = async ({ recipientId }) => {
  const normalizedRecipient = normalizeObjectId(recipientId);

  if (!normalizedRecipient) {
    throw new ApiError('Invalid recipient ID', 400);
  }

  await Notification.updateMany(
    { recipient: normalizedRecipient, isRead: false },
    { isRead: true }
  );

  return {
    success: true,
  };
};

module.exports = {
  createNotification,
  getNotifications,
  countUnread,
  markNotificationRead,
  markAllNotificationsRead,
};
