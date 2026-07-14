const {
  followUser,
  unfollowUser,
  getProfile,
  getProfileByUsername,
  getFollowList,

  // ONLY THIS RENAMED
  updateProfile: updateProfileService,

  savePost,
  unsavePost,
  toggleSavePost,
  getSavedPosts,
} = require('../services/userService');

const {
  createNotification,
} = require('../services/notificationService');

const ApiResponse = require('../utils/ApiResponse');

exports.followUser = async (
  req,
  res
) => {
  const result =
    await followUser({
      currentUserId:
        req.user._id,

      targetUserId:
        req.params.id,
    });

  const notification = await createNotification({
    recipientId: req.params.id,
    senderId: req.user._id,
    type: 'follow',
  });

  const io = req.app.get('io');
  if (io && notification) {
    io.to(req.params.id.toString()).emit('newNotification', notification);
  }

  return ApiResponse.success(
    'Followed user successfully',
    result
  ).send(res);
};

exports.unfollowUser = async (
  req,
  res
) => {
  const result =
    await unfollowUser({
      currentUserId:
        req.user._id,

      targetUserId:
        req.params.id,
    });

  return ApiResponse.success(
    'Unfollowed user successfully',
    result
  ).send(res);
};

exports.getUserProfile = async (
  req,
  res
) => {
  const result =
    await getProfile({
      userId: req.params.id,

      currentUserId:
        req.user._id,
    });

  return ApiResponse.success(
    'User profile retrieved successfully',
    result
  ).send(res);
};

exports.getUserProfileByUsername =
  async (req, res) => {
    const result =
      await getProfileByUsername({
        username:
          req.params.username,

        currentUserId:
          req.user._id,
      });

    return ApiResponse.success(
      'User profile retrieved successfully',
      result
    ).send(res);
  };

exports.getFollowers = async (
  req,
  res
) => {
  const result =
    await getFollowList({
      userId: req.params.id,

      currentUserId:
        req.user._id,

      type: 'followers',

      page: req.query.page,

      limit: req.query.limit,
    });

  return ApiResponse.success(
    'Followers retrieved successfully',
    result
  ).send(res);
};

exports.getFollowing = async (
  req,
  res
) => {
  const result =
    await getFollowList({
      userId: req.params.id,

      currentUserId:
        req.user._id,

      type: 'following',

      page: req.query.page,

      limit: req.query.limit,
    });

  return ApiResponse.success(
    'Following retrieved successfully',
    result
  ).send(res);
};

// ONLY THIS CHANGED
exports.updateProfile = async (
  req,
  res
) => {
  const updated =
    await updateProfileService({
      userId: req.user._id,

      username:
        req.body.username,

      bio: req.body.bio,

      file: req.file,
    });

  return ApiResponse.success(
    'Profile updated successfully',
    updated
  ).send(res);
};

exports.savePost = async (
  req,
  res
) => {
  const result =
    await savePost({
      userId: req.user._id,

      postId:
        req.params.id ||
        req.params.postId,
    });

  return ApiResponse.success(
    'Post saved successfully',
    result
  ).send(res);
};

exports.unsavePost = async (
  req,
  res
) => {
  const result =
    await unsavePost({
      userId: req.user._id,

      postId:
        req.params.id ||
        req.params.postId,
    });

  return ApiResponse.success(
    'Post unsaved successfully',
    result
  ).send(res);
};

exports.toggleSavePost =
  async (req, res) => {
    const result =
      await toggleSavePost({
        userId: req.user._id,

        postId:
          req.params.id ||
          req.params.postId,
      });

    return ApiResponse.success(
      result.saved
        ? 'Post saved successfully'
        : 'Post removed from saved posts',

      result
    ).send(res);
  };

exports.getSavedPosts = async (
  req,
  res
) => {
  const result =
    await getSavedPosts({
      userId: req.user._id,

      page:
        parseInt(
          req.query.page,
          10
        ) || 1,

      limit:
        parseInt(
          req.query.limit,
          10
        ) || 10,
    });

  return ApiResponse.success(
    'Saved posts retrieved successfully',
    result
  ).send(res);
};