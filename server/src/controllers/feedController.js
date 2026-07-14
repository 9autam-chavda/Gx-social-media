const { getFeedPosts, getExplorePosts } = require('../services/feedService');
const ApiResponse = require('../utils/ApiResponse');

exports.getFeedPosts = async (req, res) => {
  const result = await getFeedPosts({
    currentUserId: req.user._id,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  });
  return ApiResponse.success('Feed retrieved successfully', result).send(res);
};

exports.getExplorePosts = async (req, res) => {
  const result = await getExplorePosts({
    currentUserId: req.user._id,
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  });
  return ApiResponse.success('Explore posts retrieved successfully', result).send(res);
};
