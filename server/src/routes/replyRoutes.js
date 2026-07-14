const express =
  require('express');

const router =
  express.Router();

const authMiddleware =
  require('../middleware/auth.middleware');

const asyncHandler =
  require('../utils/asyncHandler');

const replyController =
  require('../controllers/replyController');

router.use(authMiddleware);

router.post(
  '/',
  asyncHandler(
    replyController.addReply
  )
);

router.get(
  '/:commentId',
  asyncHandler(
    replyController.getReplies
  )
);

router.patch(
  '/upvote/:replyId',
  asyncHandler(
    replyController.toggleUpvote
  )
);

router.delete(
  '/:replyId',
  asyncHandler(
    replyController.deleteReply
  )
);

module.exports = router;