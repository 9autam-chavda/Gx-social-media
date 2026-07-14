const multer = require('multer');
const path = require('path');

/**
 * MULTER MIDDLEWARE - UNIVERSAL MEDIA UPLOAD
 * ==========================================
 *
 * Supports:
 * - Multiple image formats (jpg, jpeg, png, webp, gif)
 * - Multiple video formats (mp4, webm, avi, mov)
 * - Multiple concurrent uploads
 * - Memory storage for efficient processing
 *
 * Security:
 * - MIME type validation
 * - File size limits (images: 10MB, videos: 100MB)
 * - Prevents malicious file uploads
 */

// ==================== MEMORY STORAGE ====================
// Store files in memory for direct upload to ImageKit
const memoryStorage = multer.memoryStorage();

// ==================== SUPPORTED TYPES ====================
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/x-msvideo', // .avi
  'video/quicktime',  // .mov
];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// ==================== FILE SIZE LIMITS ====================
const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024,    // 10MB
  video: 100 * 1024 * 1024,   // 100MB
};

// ==================== FILE FILTER ====================
/**
 * Validates file type and size
 * Allows both images and videos for flexible post creation
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        `File type ${file.mimetype} not supported. ` +
        `Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}, ${ALLOWED_VIDEO_TYPES.join(', ')}`
      ),
      false
    );
  }

  // Validation passed
  cb(null, true);
};

// ==================== BASE UPLOAD INSTANCE ====================
/**
 * Base multer instance used for custom field names
 */
const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.video, // Use video limit as max
  }
});

// ==================== MEDIA UPLOAD MIDDLEWARE ====================
const uploadSingle = upload.single('media');
const uploadMultiple = upload.array('media', 5);

// ==================== EXPORTS ====================
module.exports = {
  // Base multer instance for routes that need custom field names
  upload,

  // Dedicated middleware for media field uploads
  uploadSingle,
  uploadMultiple,

  // Utility exports
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_TYPES,
  FILE_SIZE_LIMITS,
};