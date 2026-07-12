const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Load server/.env

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes"); // Import auth routes
const postRoutes = require("./src/routes/postRoutes"); // Import post routes
const userRoutes = require("./src/routes/userRoutes"); // Import user social graph routes
const feedRoutes = require("./src/routes/feedRoutes"); // Import feed routes
const errorHandler = require("./src/middleware/errorHandler"); // Import error handler
const searchRoutes = require('./src/routes/searchRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const http = require("http");
const initializeChatSocket = require('./src/socket/chatSocket');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Mount auth routes at /api/auth
// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/profile
app.use('/api/auth', authRoutes);

// ✅ Mount post routes at /api/posts
// POST /api/posts - Create post
// GET /api/posts - Get all posts
// GET /api/posts/:id - Get single post
// DELETE /api/posts/:id - Delete post
// PUT /api/posts/like/:id - Like/unlike post
// POST /api/posts/comment/:id - Add comment
app.use('/api/posts', postRoutes);

// ✅ Mount user routes at /api/users
// PUT /api/users/follow/:id
// PUT /api/users/unfollow/:id
// GET /api/users/:id
// PUT /api/users/profile
// PUT /api/users/save/:postId
// GET /api/users/saved/posts
app.use('/api/users', userRoutes);

// ✅ Mount post comment routes at /api/comments
const commentRoutes =
require('./src/routes/commentRoutes');

const replyRoutes =
require('./src/routes/replyRoutes');

  app.use(
  '/api/comments',
  commentRoutes
);

app.use(
  '/api/replies',
  replyRoutes
);

// ✅ Mount feed routes at /api/feed
// GET /api/feed
// GET /api/feed/explore
app.use('/api/feed', feedRoutes);

// ✅ Mount search routes at /api/search
app.use('/api/search', searchRoutes);

// Mount chat routes at /api/conversations and /api/messages
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

const notificationRoutes = require('./src/routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

initializeChatSocket(server, app);

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON payload:', req.headers['content-type'], req.rawBody);
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
    });
  }

  next(err);
});

// Global error handler (must be last)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors such as EADDRINUSE so Node doesn't throw an unhandled exception
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Another server may be running.`);
    console.error(`Find the owning process with: netstat -ano | findstr :${PORT}`);
    console.error('Then stop it with: taskkill /PID <pid> /F');
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down server...');
  server.close(() => process.exit(0));
});

