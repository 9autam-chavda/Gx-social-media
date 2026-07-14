const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const chatController = require('../controllers/chatController');

router.use(authMiddleware);

router.post('/', asyncHandler(chatController.createMessage));
router.get(
  '/:conversationId',
  validateObjectId('conversationId'),
  asyncHandler(chatController.getMessages)
);

module.exports = router;
