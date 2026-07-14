const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const chatController = require('../controllers/chatController');

router.use(authMiddleware);

router.post('/', asyncHandler(chatController.createConversation));
router.get('/', asyncHandler(chatController.getConversations));

module.exports = router;
