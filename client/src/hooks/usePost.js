import { useCallback, useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { getErrorMessage } from '../utils/api';

export const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [error, setError] = useState('');

  const loadPost = useCallback(async () => {
    if (!postId) {
      setPost(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await postService.getById(postId);
      setPost(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load post'));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return {
    post,
    setPost,
    loading,
    error,
    refresh: loadPost,
  };
};
