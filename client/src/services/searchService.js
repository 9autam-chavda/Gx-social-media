import api from '../api/axios';
import { unwrap } from '../utils/api';

export const searchService = {
  async search(query) {
    const response = await api.get(
      `/search?q=${encodeURIComponent(query)}`
    );

    return unwrap(response);
  },
};
