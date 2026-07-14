const imagekit = require('../config/imagekit');
const { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } = require('../middleware/uploadMiddleware');

/**
 * MEDIA UPLOAD UTILITY
 * ===================
 *
 * Handles:
 * - Image uploads to ImageKit
 * - Video uploads to ImageKit
 * - Media deletion from ImageKit
 * - Future: Thumbnail generation, metadata extraction
 */

// ==================== MEDIA TYPE DETECTION ====================
/**
 * Determine media type from MIME type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - 'image' | 'video' | null
 */
const getMediaTypeFromMime = (mimeType) => {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return 'image';
  }
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return 'video';
  }
  return null;
};

// ==================== UPLOAD UTILITIES ====================
/**
 * Upload single media file to ImageKit
 * @param {Buffer} fileBuffer - File content
 * @param {string} fileName - Original file name
 * @param {string} mimeType - MIME type
 * @returns {Promise<{url: string, fileId: string, type: string}>}
 */
const uploadMediaToImageKit = async (
  fileBuffer,
  fileName,
  mimeType
) => {
  try {
    // Determine media type
    const mediaType = getMediaTypeFromMime(mimeType);
    if (!mediaType) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    // Create unique file name
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const uniqueFileName = `${timestamp}-${randomStr}-${fileName}`;

    // Upload to ImageKit
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: `/social-media-posts/${mediaType}s`,
      tags: ['social-media-post', mediaType],
    });

    return {
      url: result.url,
      fileId: result.fileId,
      type: mediaType,
      uploadedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple media files
 * @param {Array} files - Array of Multer file objects
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleMediaToImageKit = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map((file) =>
    uploadMediaToImageKit(file.buffer, file.originalname, file.mimetype)
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

// ==================== DELETE UTILITIES ====================
/**
 * Delete media from ImageKit
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<void>}
 */
const deleteMediaFromImageKit = async (fileId) => {
  try {
    if (!fileId) return;

    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error(`Error deleting media from ImageKit (ID: ${fileId}):`, error);
    // Don't throw - deletion errors shouldn't fail post deletion
  }
};

/**
 * Delete multiple media files
 * @param {Array} fileIds - Array of ImageKit file IDs
 * @returns {Promise<void>}
 */
const deleteMultipleMediaFromImageKit = async (fileIds) => {
  if (!fileIds || fileIds.length === 0) {
    return;
  }

  const deletePromises = fileIds.map((fileId) =>
    deleteMediaFromImageKit(fileId)
  );

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple media files:', error);
    // Don't throw - allow operation to continue
  }
};

// ==================== LEGACY COMPATIBILITY ====================
/**
 * Legacy upload function for backward compatibility
 * @deprecated Use uploadMediaToImageKit instead
 */
const uploadToImageKit = async (filePath, fileName) => {
  const fs = require('fs');
  const fsp = require('fs').promises;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await uploadMediaToImageKit(
      fileBuffer,
      fileName,
      'image/jpeg' // Default to image for legacy
    );

    // Clean up local file
    await fsp.unlink(filePath);

    return {
      url: result.url,
      fileId: result.fileId
    };
  } catch (error) {
    try {
      await fsp.unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up local file:', cleanupError);
    }
    throw error;
  }
};

/**
 * Legacy delete function for backward compatibility
 * @deprecated Use deleteMediaFromImageKit instead
 */
const deleteFromImageKit = async (fileId) => {
  return deleteMediaFromImageKit(fileId);
};

// ==================== EXPORTS ====================
module.exports = {
  // New API
  uploadMediaToImageKit,
  uploadMultipleMediaToImageKit,
  deleteMediaFromImageKit,
  deleteMultipleMediaFromImageKit,
  getMediaTypeFromMime,

  // Legacy API (for backward compatibility)
  uploadToImageKit,
  deleteFromImageKit,
};
