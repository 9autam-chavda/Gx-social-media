import { useCallback } from 'react';
import { postService } from '../services/postService';
import { usePaginatedPosts } from './usePaginatedPosts';

export const usePosts = () => {
  const fetchPosts = useCallback((params) => postService.list(params), []);
  return usePaginatedPosts(fetchPosts, { limit: 10 });
};
