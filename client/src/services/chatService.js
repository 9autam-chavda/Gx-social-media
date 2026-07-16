import api from '../api/axios';
import { unwrap } from '../utils/api';

export const chatService = {
  async createConversation(participantId) {
    const response = await api.post('/conversations', {
      participantId,
    });

    return unwrap(response);
  },

  async getConversations() {
    const response = await api.get('/conversations');
    return unwrap(response);
  },

  async getMessages(conversationId, params = {}) {
    const response = await api.get(`/messages/${conversationId}`, {
      params,
    });

    return unwrap(response);
  },

  async sendMessage({ conversationId, text, clientId }) {
    const response = await api.post('/messages', {
      conversationId,
      text,
      clientId,
    });

    return unwrap(response);
  },
};
