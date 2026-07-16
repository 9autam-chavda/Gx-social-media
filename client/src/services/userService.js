import api from '../api/axios';

import {
  toFormData,
  unwrap,
} from '../utils/api';

export const userService = {
  async getProfile(
    userIdOrUsername
  ) {
    const response =
      await api.get(
        `/users/profile/${userIdOrUsername}`
      );

    return unwrap(response);
  },

  async getProfileByUsername(
    username
  ) {
    const response =
      await api.get(
        `/users/profile/${username}`
      );

    return unwrap(response);
  },

  async updateProfile(
    payload
  ) {
    const response =
      await api.put(
        '/users/profile',
        toFormData(payload),
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return unwrap(response);
  },

  async follow(userId) {
    const response =
      await api.put(
        `/users/follow/${userId}`
      );

    return unwrap(response);
  },

  async unfollow(userId) {
    const response =
      await api.put(
        `/users/unfollow/${userId}`
      );

    return unwrap(response);
  },

  async getFollowers(
    userId,
    page = 1,
    limit = 20
  ) {
    const response =
      await api.get(
        `/users/${userId}/followers`,
        {
          params: {
            page,
            limit,
          },
        }
      );

    return unwrap(response);
  },

  async getFollowing(
    userId,
    page = 1,
    limit = 20
  ) {
    const response =
      await api.get(
        `/users/${userId}/following`,
        {
          params: {
            page,
            limit,
          },
        }
      );

    return unwrap(response);
  },

  async toggleSave(postId) {
    const response =
      await api.put(
        `/users/save/${postId}`
      );

    return unwrap(response);
  },

  async getSaved({
    page = 1,
    limit = 18,
  } = {}) {
    const response =
      await api.get(
        '/users/saved',
        {
          params: {
            page,
            limit,
          },
        }
      );

    return unwrap(response);
  },
};