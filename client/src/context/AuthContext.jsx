import { useEffect, useState } from 'react';
import { AuthContext } from './authContextCore';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import {
  connectSocket,
  disconnectSocket,
} from '../socket/socket';

const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const refreshUnreadCount = async () => {
    try {
      setNotificationsLoading(true);
      const response = await notificationService.getUnreadCount();
      setUnreadNotifications(response.unreadCount || 0);
    } catch {
      setUnreadNotifications(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        setUser(response.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    };

    window.addEventListener(
      'auth:unauthorized',
      handleUnauthorized
    );

    return () =>
      window.removeEventListener(
        'auth:unauthorized',
        handleUnauthorized
      );
  }, []);

  useEffect(() => {
    const userId = user?.id || user?._id;

    if (!userId) {
      disconnectSocket();
      setUnreadNotifications(0);
      return;
    }

    const socket = connectSocket();

    refreshUnreadCount();

    if (!socket) {
      return undefined;
    }

    const handleNewNotification = () => {
      setUnreadNotifications((current) => current + 1);
    };

    const handleReconnect = () => {
      refreshUnreadCount();
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('connect', handleReconnect);
    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('connect', handleReconnect);
      socket.io.off('reconnect', handleReconnect);
      disconnectSocket();
    };
  }, [user?.id, user?._id]);

  const persistSession = (payload) => {
    const { token: authToken, user: authUser } = payload;

    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const register = async (formData) => {
    const response = await authService.register(formData);
    persistSession(response);
    return response;
  };

  const login = async (formData) => {
    const response = await authService.login(formData);
    persistSession(response);
    return response;
  };

  const logout = () => {
    disconnectSocket();

    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);
  };

  const updateUser = (nextUser) => {
    setUser((current) => ({
      ...current,
      ...nextUser,
    }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    unreadNotifications,
    notificationsLoading,
    refreshUnreadCount,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
