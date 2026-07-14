const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { getFeedPosts, getExplorePosts } = require('../controllers/feedController');

router.use(authMiddleware);

router.get('/', asyncHandler(getFeedPosts));
router.get('/explore', asyncHandler(getExplorePosts));

module.exports = router;