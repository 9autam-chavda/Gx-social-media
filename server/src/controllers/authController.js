const { registerUser, authenticateUser, getCurrentUser, resetPasswordByEmail } = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

exports.register = async (req, res) => {
  const result = await registerUser(req.body);
  return ApiResponse.success('User registered successfully', result, 201).send(res);
};

exports.login = async (req, res) => {
  const result = await authenticateUser(req.body);
  return ApiResponse.success('Login successful', result).send(res);
};

exports.getMe = async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  return ApiResponse.success('User retrieved successfully', { user }).send(res);
};

exports.logout = async (req, res) => {
  return ApiResponse.success('Logout successful').send(res);
};

exports.forgotPassword = async (req, res) => {
  await resetPasswordByEmail(req.body);
  return ApiResponse.success('Password updated successfully. Please log in with your new password.').send(res);
};
