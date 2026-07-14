const express =
  require('express');

const router =
  express.Router();

const authMiddleware =
  require('../middleware/auth.middleware');

const asyncHandler =
  require('../utils/asyncHandler');

const commentController =
  require('../controllers/commentController');

router.use(authMiddleware);

router.post(
  '/',
  asyncHandler(
    commentController.createComment
  )
);

router.get(
  '/:postId',
  asyncHandler(
    commentController.getComments
  )
);

router.patch(
  '/upvote/:commentId',
  asyncHandler(
    commentController.toggleUpvote
  )
);

router.delete(
  '/:commentId',
  asyncHandler(
    commentController.deleteComment
  )
);

module.exports = router;