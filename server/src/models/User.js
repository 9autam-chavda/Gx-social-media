const mongoose = require('mongoose');

// User Schema - Defines the structure of user data in MongoDB
const userSchema = new mongoose.Schema({
  // Basic user information
  email: {
    type: String,
    required: [true, 'Please provide an email'], // Must provide email
    unique: true, // No two users with same email
    lowercase: true, // Convert to lowercase (user@gmail.com = USER@GMAIL.COM)
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'], // Basic email validation
  },

  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true, // Remove whitespace from beginning and end
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password by default when fetching user (security)
  },

  // Profile information
  profilePicture: {
    url: {
      type: String,
      default: null,
    },
    fileId: {
      type: String,
      default: null,
    },
  },

  bio: {
    type: String,
    default: '',
    maxlength: [200, 'Bio cannot exceed 200 characters'],
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],

  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],

  // Hidden likes system - users can only see their own likes
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],

}, {
  timestamps: true,
});

userSchema.index({ createdAt: -1 });



// Create and export the model
// 'User' is the model name, MongoDB will create a collection called 'users' (lowercase, plural)
module.exports = mongoose.model('User', userSchema);

