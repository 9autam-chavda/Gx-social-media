const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

// Optional alias for earlier testing.
router.get('/profile', authMiddleware, getMe);

module.exports = router;
