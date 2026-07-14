const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const notificationController = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/', asyncHandler(notificationController.getNotifications));
router.get('/counts/unread', asyncHandler(notificationController.getUnreadCount));
router.patch('/:id/read', asyncHandler(notificationController.markNotificationRead));
router.patch('/read-all', asyncHandler(notificationController.markAllNotificationsRead));

module.exports = router;
