const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  countUnread,
} = require('../services/notificationService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

exports.getNotifications = async (req, res) => {
  try {
    const result = await getNotifications({
      recipientId: req.user._id,
      page: req.query.page,
      limit: req.query.limit,
    });

    return ApiResponse.success(
      'Notifications retrieved successfully',
      result
    ).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.error(error.message, error.statusCode).send(res);
    }

    return ApiResponse.error('Failed to fetch notifications', 500).send(res);
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await countUnread(req.user._id);

    return ApiResponse.success('Unread notification count retrieved', {
      unreadCount: count,
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.error(error.message, error.statusCode).send(res);
    }

    return ApiResponse.error('Failed to fetch unread count', 500).send(res);
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await markNotificationRead({
      recipientId: req.user._id,
      notificationId: req.params.id,
    });

    return ApiResponse.success('Notification marked as read', notification).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.error(error.message, error.statusCode).send(res);
    }

    return ApiResponse.error('Failed to mark notification as read', 500).send(res);
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const result = await markAllNotificationsRead({
      recipientId: req.user._id,
    });

    return ApiResponse.success('All notifications marked as read', result).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.error(error.message, error.statusCode).send(res);
    }

    return ApiResponse.error('Failed to mark all notifications as read', 500).send(res);
  }
};
