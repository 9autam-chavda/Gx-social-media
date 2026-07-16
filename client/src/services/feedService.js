import api from '../api/axios';
import { unwrap } from '../utils/api';

export const feedService = {
  async getFeed({ page = 1, limit = 10 } = {}) {
    const response = await api.get('/feed', { params: { page, limit } });
    return unwrap(response);
  },

  async getExplore({ page = 1, limit = 18 } = {}) {
    const response = await api.get('/feed/explore', { params: { page, limit } });
    return unwrap(response);
  },
};
