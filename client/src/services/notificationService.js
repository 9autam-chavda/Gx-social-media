import api from '../api/axios';
import { unwrap } from '../utils/api';

export const notificationService = {
  async getNotifications({ page = 1, limit = 20 } = {}) {
    const response = await api.get('/notifications', {
      params: { page, limit },
    });

    return unwrap(response);
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/counts/unread');
    return unwrap(response);
  },

  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return unwrap(response);
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return unwrap(response);
  },
};
