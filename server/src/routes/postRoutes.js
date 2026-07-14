const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');
const {
  createPost,
  getAllPosts,
  getFeedPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
} = require('../controllers/postController');

/**
 * POST ROUTES
 * ===========
 *
 * Universal content system routes
 * Supports: text, image, video posts
 *
 * All routes require JWT authentication
 */

// ==================== AUTHENTICATION ====================
// All routes below require authentication
router.use(authMiddleware);

// ==================== CREATE POST ====================
/**
 * POST /api/posts/create
 * POST /api/posts
 *
 * Create a new universal post
 * Supports: text-only, image, video
 *
 * Multipart form data:
 * - type: 'text' | 'image' | 'video'
 * - textContent: Optional text (for text posts)
 * - caption: Optional caption (for all posts)
 * - media: File upload(s)
 * - visibility: Optional 'public' | 'followers' | 'private'
 * - hashtags: Optional comma-separated tags
 */
router.post('/create', uploadSingle, asyncHandler(createPost));
router.post('/', uploadSingle, asyncHandler(createPost));

// ==================== GET POSTS ====================
/**
 * GET /api/posts/feed
 *
 * Get paginated feed of public posts
 * Newest first, optimized for discovery
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 */
router.get('/feed', asyncHandler(getFeedPosts));

/**
 * GET /api/posts
 *
 * Get all posts (backward compatibility with getFeed)
 *
 * Query params:
 * - page: Page number
 * - limit: Items per page
 */
router.get('/', asyncHandler(getAllPosts));

/**
 * GET /api/posts/:id
 *
 * Get single post by ID
 * Includes full author info, comments, and engagement metrics
 */
router.get('/:id', validateObjectId('id'), asyncHandler(getPostById));

// ==================== DELETE POST ====================
/**
 * DELETE /api/posts/:id
 *
 * Delete post (only owner can delete)
 * Also deletes media from ImageKit
 */
router.delete('/:id', validateObjectId('id'), asyncHandler(deletePost));

// ==================== ENGAGEMENT: LIKE/UNLIKE ====================
/**
 * PUT /api/posts/like/:id
 *
 * Like a post
 */
router.put('/like/:id', validateObjectId('id'), asyncHandler(likePost));

/**
 * PUT /api/posts/unlike/:id
 *
 * Unlike a post
 */
router.put('/unlike/:id', validateObjectId('id'), asyncHandler(unlikePost));

// ==================== ENGAGEMENT: SAVE/UNSAVE ====================
/**
 * PUT /api/posts/save/:id
 *
 * Save post to user's collection
 */
router.put('/save/:id', validateObjectId('id'), asyncHandler(savePost));

/**
 * PUT /api/posts/unsave/:id
 *
 * Remove post from user's saved collection
 */
router.put('/unsave/:id', validateObjectId('id'), asyncHandler(unsavePost));




module.exports = router;
