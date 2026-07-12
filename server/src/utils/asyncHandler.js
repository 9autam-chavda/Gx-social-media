/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors and pass them to next middleware
 * Eliminates need for try-catch in every controller function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;