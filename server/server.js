const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const cors = require('cors');
const http = require('http');

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const userRoutes = require('./src/routes/userRoutes');
const feedRoutes = require('./src/routes/feedRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const replyRoutes = require('./src/routes/replyRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const errorHandler = require('./src/middleware/errorHandler');
const initializeChatSocket = require('./src/socket/chatSocket');

const app = express();
const server = http.createServer(app);

/*
 * ============================
 * Database
 * ============================
 */
connectDB();

/*
 * ============================
 * CORS
 * ============================
 *
 * Local:
 * http://localhost:5173
 *
 * Production:
 * CLIENT_URL will be provided
 * through Render environment variables.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/*
 * ============================
 * Body Parsers
 * ============================
 */
app.use(express.urlencoded({ extended: true }));

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

/*
 * ============================
 * Static Files
 * ============================
 */
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

/*
 * ============================
 * Authentication Routes
 * ============================
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/profile
 * etc.
 */
app.use('/api/auth', authRoutes);

/*
 * ============================
 * Post Routes
 * ============================
 *
 * POST   /api/posts
 * GET    /api/posts
 * GET    /api/posts/:id
 * DELETE /api/posts/:id
 * PUT    /api/posts/like/:id
 * POST   /api/posts/comment/:id
 */
app.use('/api/posts', postRoutes);

/*
 * ============================
 * User Routes
 * ============================
 *
 * PUT /api/users/follow/:id
 * PUT /api/users/unfollow/:id
 * GET /api/users/:id
 * PUT /api/users/profile
 * PUT /api/users/save/:postId
 * GET /api/users/saved/posts
 */
app.use('/api/users', userRoutes);

/*
 * ============================
 * Comment Routes
 * ============================
 */
app.use('/api/comments', commentRoutes);

/*
 * ============================
 * Reply Routes
 * ============================
 */
app.use('/api/replies', replyRoutes);

/*
 * ============================
 * Feed Routes
 * ============================
 *
 * GET /api/feed
 * GET /api/feed/explore
 */
app.use('/api/feed', feedRoutes);

/*
 * ============================
 * Search Routes
 * ============================
 */
app.use('/api/search', searchRoutes);

/*
 * ============================
 * Conversation Routes
 * ============================
 */
app.use('/api/conversations', conversationRoutes);

/*
 * ============================
 * Message Routes
 * ============================
 */
app.use('/api/messages', messageRoutes);

/*
 * ============================
 * Notification Routes
 * ============================
 */
app.use('/api/notifications', notificationRoutes);

/*
 * ============================
 * Socket.io
 * ============================
 */
initializeChatSocket(server, app);

/*
 * ============================
 * JSON Parsing Error Handler
 * ============================
 */
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    console.error(
      'Invalid JSON payload:',
      req.headers['content-type'],
      req.rawBody
    );

    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
    });
  }

  next(err);
});

/*
 * ============================
 * Global Error Handler
 * ============================
 *
 * Must remain after all routes.
 */
app.use(errorHandler);

/*
 * ============================
 * Health Check
 * ============================
 */
app.get('/', (req, res) => {
  res.status(200).send('API Running 🚀');
});

/*
 * ============================
 * Server
 * ============================
 *
 * Render provides PORT.
 * Local development falls back
 * to port 5000.
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

/*
 * ============================
 * Server Error Handling
 * ============================
 */
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} already in use. Another server may be running.`
    );

    console.error(
      'Find the owning process with: netstat -ano | findstr :${PORT}'
    );

    console.error(
      'Then stop it with: taskkill /PID <pid> /F'
    );

    process.exit(1);
  }

  console.error('Server error:', err);
  process.exit(1);
});

/*
 * ============================
 * Graceful Shutdown
 * ============================
 */
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down server...');

  server.close(() => {
    process.exit(0);
  });
});