const ApiResponse = require('../utils/ApiResponse');

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error: avoid full stack for expected ApiError
  if (err && err.name === 'ApiError') {
    console.warn('ApiError:', err.message);
  } else {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return ApiResponse.error(message, 404).send(res);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return ApiResponse.error(message, 400).send(res);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return ApiResponse.error(message, 400).send(res);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return ApiResponse.error(message, 401).send(res);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return ApiResponse.error(message, 401).send(res);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const message = 'File too large. Maximum size is 5MB';
      return ApiResponse.error(message, 400).send(res);
    }
    const message = 'File upload error';
    return ApiResponse.error(message, 400).send(res);
  }

  // Default error
  const message = error.message || 'Server Error';
  const statusCode = error.statusCode || 500;

  return ApiResponse.error(message, statusCode).send(res);
};

module.exports = errorHandler;