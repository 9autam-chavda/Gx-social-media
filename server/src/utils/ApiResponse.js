/**
 * API Response Utility
 * Standardizes API responses across the application
 */

class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success(message, data = null, statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message, statusCode = 500, data = null) {
    return new ApiResponse(false, message, data, statusCode);
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      ...(this.data && { data: this.data })
    });
  }
}

module.exports = ApiResponse;