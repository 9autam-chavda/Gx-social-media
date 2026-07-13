const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authorization token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError('Authorization token is required', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password').lean();

    if (!user) {
      throw new ApiError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
