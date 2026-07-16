import { useCallback } from 'react';
import { postService } from '../services/postService';
import { usePaginatedPosts } from './usePaginatedPosts';

export const useFeed = () => {
  const fetchFeed = useCallback((params) => postService.getFeed(params), []);
  return usePaginatedPosts(fetchFeed, { limit: 8 });
};
