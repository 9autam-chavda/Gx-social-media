import api from '../api/axios';
import { unwrap } from '../utils/api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return unwrap(response);
  },

  async register(payload) {
    const response = await api.post('/auth/register', payload);
    return unwrap(response);
  },

  async me() {
    const response = await api.get('/auth/me');
    return unwrap(response);
  },

  async forgotPassword(payload) {
    const response = await api.post('/auth/forgot-password', payload);
    return unwrap(response);
  },
};
