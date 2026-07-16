import { io } from 'socket.io-client';

let socket = null;

const getSocketUrl = () => {
  const explicitUrl = import.meta.env.VITE_SOCKET_URL;

  if (explicitUrl) return explicitUrl;

  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/api\/?$/, '');
  }

  return 'http://localhost:5000';
};

export const connectSocket = () => {
  const token = localStorage.getItem('token');

  if (!token) return null;

  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: {
        token,
      },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 600,
      reconnectionDelayMax: 4000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  } else {
    socket.auth = {
      token,
    };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const getSocket = () => socket;

export const sendSocketMessage = (payload, callback) => {
  if (!socket?.connected) {
    callback?.({
      ok: false,
      message: 'Socket is not connected',
    });
    return;
  }

  socket.timeout(8000).emit('message:send', payload, (error, response) => {
    if (error) {
      callback?.({
        ok: false,
        message: 'Message delivery timed out',
      });
      return;
    }

    callback?.(response);
  });
};

export const disconnectSocket = () => {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();

  socket = null;
};
