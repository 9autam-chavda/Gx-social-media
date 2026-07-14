/**
 * POST VALIDATION UTILITY
 * =====================
 *
 * Validates post creation requests
 * Ensures business logic compliance:
 * - At least one content (text OR media)
 * - Valid post type selection
 * - Proper media type matching
 * - Text length constraints
 */

/**
 * Validate post creation request
 * @param {Object} postData - Post data to validate
 * @param {string} postData.type - Post type: 'text' | 'image' | 'video'
 * @param {string} postData.textContent - Text content (optional)
 * @param {string} postData.caption - Caption (optional)
 * @param {Array} postData.media - Media files (optional)
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validatePostCreation = (postData) => {
  const errors = [];
  const { type, textContent, caption, media } = postData;

  // ==================== TYPE VALIDATION ====================
  if (!type || !['text', 'image', 'video'].includes(type)) {
    errors.push('Invalid post type. Must be: text, image, or video');
    return { isValid: false, errors };
  }

  // ==================== CONTENT VALIDATION ====================
  const hasText = textContent && textContent.trim().length > 0;
  const hasMedia = Array.isArray(media) && media.length > 0;
  const hasCaption = caption && caption.trim().length > 0;

  // At least one content type must be present
  if (!hasText && !hasMedia && !hasCaption) {
    errors.push('Post must have either text, caption, or media content');
  }

  // ==================== TEXT CONTENT VALIDATION ====================
  if (hasText && textContent.trim().length > 2000) {
    errors.push('Text content cannot exceed 2000 characters');
  }

  // ==================== CAPTION VALIDATION ====================
  if (hasCaption && caption.trim().length > 500) {
    errors.push('Caption cannot exceed 500 characters');
  }

  // ==================== TYPE-SPECIFIC VALIDATION ====================
  switch (type) {
    case 'text':
      // Text posts MUST have text content
      if (!hasText && !hasCaption) {
        errors.push('Text posts must have text content or caption');
      }
      // Text posts should NOT have media
      if (hasMedia) {
        errors.push('Text posts should not include media files');
      }
      break;

    case 'image':
      // Image posts MUST have media
      if (!hasMedia) {
        errors.push('Image posts must include at least one image file');
      }
      // Validate media types
      if (hasMedia && !media.every(m => m.type === 'image')) {
        errors.push('Image posts can only contain image files');
      }
      break;

    case 'video':
      // Video posts MUST have media
      if (!hasMedia) {
        errors.push('Video posts must include at least one video file');
      }
      // Validate media types
      if (hasMedia && !media.every(m => m.type === 'video')) {
        errors.push('Video posts can only contain video files');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize post data before saving
 * @param {Object} postData - Raw post data
 * @returns {Object} - Sanitized post data
 */
const sanitizePostData = (postData) => {
  return {
    type: postData.type,
    textContent: postData.textContent ? postData.textContent.trim() : undefined,
    caption: postData.caption ? postData.caption.trim() : undefined,
    media: postData.media || [],
    visibility: postData.visibility || 'public',
    hashtags: postData.hashtags ? postData.hashtags.filter(tag => tag.trim()) : [],
  };
};

module.exports = {
  validatePostCreation,
  sanitizePostData,
};