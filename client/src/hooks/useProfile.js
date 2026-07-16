import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { userService } from '../services/userService';

import { getErrorMessage } from '../utils/api';

export const useProfile = (
  username
) => {
  const [profile, setProfile] =
    useState(null);

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadProfile =
    useCallback(async () => {
      if (!username) return;

      setLoading(true);
      setError('');

      try {
        const data =
          await userService.getProfileByUsername(
            username
          );

        setProfile(data);

        setPosts(data.posts || []);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            'Unable to load profile'
          )
        );
      } finally {
        setLoading(false);
      }
    }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    setProfile,

    posts,
    setPosts,

    loading,
    error,

    refresh: loadProfile,
  };
};
