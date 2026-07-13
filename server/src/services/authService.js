const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const ApiError = require('../utils/ApiError');

const registerUser = async ({ username, email, password }) => {
  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    throw new ApiError('Please provide username, email, and password', 400);
  }

  if (password.length < 6) {
    throw new ApiError('Password must be at least 6 characters', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  }).lean();

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      throw new ApiError('Email already registered', 400);
    }
    throw new ApiError('Username already taken', 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id, user.email);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    },
  };
};

const authenticateUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new ApiError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError('Invalid email or password', 401);
  }

  const token = generateToken(user._id, user.email);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    },
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
    followerCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
    savedPostsCount: user.savedPosts?.length || 0,
  };
};

module.exports = {
  registerUser,
  authenticateUser,
  getCurrentUser,
};
