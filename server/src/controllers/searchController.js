const {
  searchAll,
} = require('../services/searchService');

const ApiResponse = require('../utils/ApiResponse');

exports.globalSearch = async (
  req,
  res
) => {
  const q = req.query.q || '';

  const results = await searchAll(q);

  return ApiResponse.success(
    'Search results',
    results
  ).send(res);
};