const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { upload } = require('../middleware/uploadMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const {
  followUser,
  unfollowUser,
  getUserProfile,
  getUserProfileByUsername,
  getFollowers,
  getFollowing,
  updateProfile,
  unsavePost,
  toggleSavePost,
  getSavedPosts,
} = require('../controllers/userController');

router.use(authMiddleware);

router.put('/follow/:id', validateObjectId('id'), asyncHandler(followUser));
router.put('/unfollow/:id', validateObjectId('id'), asyncHandler(unfollowUser));
router.put('/profile', upload.single('image'),asyncHandler(updateProfile));
router.put('/save/:postId', validateObjectId('postId'), asyncHandler(toggleSavePost));
router.put('/unsave/:postId', validateObjectId('postId'), asyncHandler(unsavePost));
router.get('/saved', asyncHandler(getSavedPosts));
router.get('/saved/posts', asyncHandler(getSavedPosts));
router.get('/profile/:username', asyncHandler(getUserProfileByUsername));
router.get('/:id/followers', validateObjectId('id'), asyncHandler(getFollowers));
router.get('/:id/following', validateObjectId('id'), asyncHandler(getFollowing));
router.get('/:id', validateObjectId('id'), asyncHandler(getUserProfile));

module.exports = router;
