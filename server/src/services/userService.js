const User = require('../models/User');

const Post = require('../models/Post');

const ApiError =
  require('../utils/ApiError');

const {
  uploadMediaToImageKit,
  deleteMediaFromImageKit,
} = require('../utils/imagekitHelper');

const followUser =
  async ({
    currentUserId,
    targetUserId,
  }) => {
    if (
      currentUserId.toString() ===
      targetUserId.toString()
    ) {
      throw new ApiError(
        'You cannot follow yourself',
        400
      );
    }

    const currentUser =
      await User.findById(
        currentUserId
      );

    const targetUser =
      await User.findById(
        targetUserId
      );

    if (!targetUser) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    const isAlreadyFollowing =
      currentUser.following.some(
        (id) =>
          id.toString() ===
          targetUserId.toString()
      );

    if (isAlreadyFollowing) {
      throw new ApiError(
        'Already following this user',
        400
      );
    }

    if (
      !currentUser.following.some(
        (id) =>
          id.toString() ===
          targetUserId.toString()
      )
    ) {
      currentUser.following.push(
        targetUserId
      );
    }

    if (
      !targetUser.followers.some(
        (id) =>
          id.toString() ===
          currentUserId.toString()
      )
    ) {
      targetUser.followers.push(
        currentUserId
      );
    }
    await currentUser.save();

    await targetUser.save();

    return {
      following: true,

      followerCount:
        targetUser.followers.length,

      followingCount:
        currentUser.following.length,
    };
  };

const unfollowUser =
  async ({
    currentUserId,
    targetUserId,
  }) => {
    const currentUser =
      await User.findById(
        currentUserId
      );

    const targetUser =
      await User.findById(
        targetUserId
      );

    if (!targetUser) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    currentUser.following =
      currentUser.following.filter(
        (id) =>
          id.toString() !==
          targetUserId.toString()
      );

    targetUser.followers =
      targetUser.followers.filter(
        (id) =>
          id.toString() !==
          currentUserId.toString()
      );

    await currentUser.save();

    await targetUser.save();

    return {
      following: false,

      followerCount:
        targetUser.followers.length,

      followingCount:
        currentUser.following.length,
    };
  };

const getProfile =
  async ({
    userId,
    currentUserId,
  }) => {
    const user =
      await User.findById(
        userId
      )
        .select('-password')
        .lean();

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    const posts =
      await Post.find({
        user: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      id: user._id,

      ...user,

      posts,

      followerCount:
        user.followers
          ?.length || 0,

      followingCount:
        user.following
          ?.length || 0,

      isFollowing:
        user.followers?.some(
          (id) =>
            id.toString() ===
            currentUserId.toString()
        ) || false,
    };
  };

const getProfileByUsername =
  async ({
    username,
    currentUserId,
  }) => {
    const normalizedUsername =
      username.trim();

    const user =
      await User.findOne({
        username:
          normalizedUsername,
      })
        .select('-password')
        .lean();

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    const posts =
      await Post.find({
        user: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      id: user._id,

      ...user,

      posts,

      followerCount:
        user.followers
          ?.length || 0,

      followingCount:
        user.following
          ?.length || 0,

      isFollowing:
        user.followers?.some(
          (id) =>
            id.toString() ===
            currentUserId.toString()
        ) || false,
    };
  };

const getFollowList =
  async ({
    userId,
    type,
    currentUserId,
    page = 1,
    limit = 20,
  }) => {
    const currentPage =
      Math.max(
        parseInt(page, 10) || 1,
        1
      );

    const pageSize =
      Math.min(
        Math.max(
          parseInt(limit, 10) || 20,
          1
        ),
        50
      );

    const user =
      await User.findById(
        userId
      )
        .populate({
          path: type,

          select:
            'username profilePicture bio followers following',
        })
        .lean();

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    const list =
      user[type] || [];

    const start =
      (currentPage - 1) *
      pageSize;

    const end =
      start + pageSize;

    const paginatedUsers =
      list
        .slice(start, end)
        .map((person) => ({
          _id: person._id,

          username:
            person.username,

          bio: person.bio,

          profilePicture:
            person.profilePicture,

          followerCount:
            person.followers
              ?.length || 0,

          followingCount:
            person.following
              ?.length || 0,

          isFollowing:
            person.followers?.some(
              (id) =>
                id.toString() ===
                currentUserId.toString()
            ) || false,
        }));

    return {
      users: paginatedUsers,

      pagination: {
        currentPage,

        totalPages:
          Math.ceil(
            list.length /
              pageSize
          ) || 1,

        totalUsers:
          list.length,

        hasNext:
          end < list.length,

        limit: pageSize,
      },
    };
  };

const updateProfile =
  async ({
    userId,
    username,
    bio,
    file,
  }) => {
    const updates = {};

    if (bio !== undefined) {
      if (
        bio.trim().length > 200
      ) {
        throw new ApiError(
          'Bio cannot exceed 200 characters',
          400
        );
      }

      updates.bio =
        bio.trim();
    }

    if (
      username !== undefined
    ) {
      const normalizedUsername =
        username.trim();

      if (
        normalizedUsername.length <
          3 ||
        normalizedUsername.length >
          20
      ) {
        throw new ApiError(
          'Username must be between 3 and 20 characters',
          400
        );
      }

      const existingUser =
        await User.findOne({
          username:
            normalizedUsername,

          _id: {
            $ne: userId,
          },
        }).lean();

      if (existingUser) {
        throw new ApiError(
          'Username is already taken',
          400
        );
      }

      updates.username =
        normalizedUsername;
    }

    if (file) {
      const uploadResult =
        await uploadMediaToImageKit(
          file.buffer,
          file.originalname,
          file.mimetype
        );

      const currentUser =
        await User.findById(
          userId
        )
          .select(
            'profilePicture'
          )
          .lean();

      if (
        currentUser
          ?.profilePicture
          ?.fileId
      ) {
        await deleteMediaFromImageKit(
          currentUser
            .profilePicture
            .fileId
        );
      }

      updates.profilePicture =
        {
          url: uploadResult.url,

          fileId:
            uploadResult.fileId,
        };
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        updates,
        {
          new: true,
          runValidators: true,
        }
      )
        .select('-password')
        .lean();

    if (!updatedUser) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    return {
      id: updatedUser._id,

      username:
        updatedUser.username,

      bio: updatedUser.bio,

      profilePicture:
        updatedUser.profilePicture,

      followerCount:
        updatedUser.followers
          ?.length || 0,

      followingCount:
        updatedUser.following
          ?.length || 0,

      savedPostsCount:
        updatedUser.savedPosts
          ?.length || 0,
    };
  };

const savePost =
  async ({
    userId,
    postId,
  }) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    if (
      !user.savedPosts.includes(
        postId
      )
    ) {
      user.savedPosts.push(
        postId
      );

      await user.save();
    }

    return {
      saved: true,
    };
  };

const unsavePost =
  async ({
    userId,
    postId,
  }) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    user.savedPosts =
      user.savedPosts.filter(
        (id) =>
          id.toString() !==
          postId.toString()
      );

    await user.save();

    return {
      saved: false,
    };
  };

const toggleSavePost =
  async ({
    userId,
    postId,
  }) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    const isSaved =
      user.savedPosts.some(
        (id) =>
          id.toString() ===
          postId.toString()
      );

    if (isSaved) {
      user.savedPosts =
        user.savedPosts.filter(
          (id) =>
            id.toString() !==
            postId.toString()
        );
    } else {
      user.savedPosts.push(
        postId
      );
    }

    await user.save();

    return {
      saved: !isSaved,
    };
  };

const getSavedPosts =
  async ({
    userId,
    page = 1,
    limit = 10,
  }) => {
    const user =
      await User.findById(
        userId
      )
        .populate({
          path: 'savedPosts',

          options: {
            sort: {
              createdAt: -1,
            },

            skip:
              (page - 1) *
              limit,

            limit,
          },

          populate: {
            path: 'user',

            select:
              'username profilePicture',
          },
        })
        .lean();

    if (!user) {
      throw new ApiError(
        'User not found',
        404
      );
    }

    return {
      posts:
        user.savedPosts || [],
    };
  };

module.exports = {
  followUser,

  unfollowUser,

  getProfile,

  getProfileByUsername,

  getFollowList,

  updateProfile,

  savePost,

  unsavePost,

  toggleSavePost,

  getSavedPosts,
};