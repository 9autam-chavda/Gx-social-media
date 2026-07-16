import api from '../api/axios';

import {
  toFormData,
  unwrap,
} from '../utils/api';

export const postService = {
  async list({
    page = 1,
    limit = 10,
  } = {}) {
    const response =
      await api.get('/posts', {
        params: {
          page,
          limit,
        },
      });

    return unwrap(response);
  },

  async create({
    type = 'text',
    caption = '',
    textContent = '',
    hashtags = '',
    visibility = 'public',
    mediaFile = null,
  } = {}) {
    const formData =
      toFormData({
        type,
        caption,
        textContent,
        hashtags,
        visibility,
      });

    if (mediaFile) {
      formData.append(
        'media',
        mediaFile
      );
    }

    const response =
      await api.post(
        '/posts',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return unwrap(response);
  },

  async likePost(postId) {
    const response =
      await api.put(
        `/posts/like/${postId}`
      );

    return unwrap(response);
  },

  async unlikePost(postId) {
    const response =
      await api.put(
        `/posts/unlike/${postId}`
      );

    return unwrap(response);
  },

  async toggleLike(
    postId,
    liked = false
  ) {
    return liked
      ? this.unlikePost(postId)
      : this.likePost(postId);
  },

  async savePost(postId) {
    const response =
      await api.put(
        `/posts/save/${postId}`
      );

    return unwrap(response);
  },

  async unsavePost(postId) {
    const response =
      await api.put(
        `/posts/unsave/${postId}`
      );

    return unwrap(response);
  },

  async getFeed({
    page = 1,
    limit = 10,
  } = {}) {
    const response =
      await api.get(
        '/posts/feed',
        {
          params: {
            page,
            limit,
          },
        }
      );

    return unwrap(response);
  },

  async getById(postId) {
    const response =
      await api.get(
        `/posts/${postId}`
      );

    return unwrap(response);
  },

  async delete(postId) {
    const response =
      await api.delete(
        `/posts/${postId}`
      );

    return unwrap(response);
  },

  async addComment(postId, text) {
    const response =
      await api.post('/comments', {
        postId,
        text,
      });

    return unwrap(response);
  },

  async deleteComment(commentId) {
    const response =
      await api.delete(
        `/comments/${commentId}`
      );

    return unwrap(response);
  },
};
