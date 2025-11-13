import { io } from 'socket.io-client';
import Constants from 'expo-constants';
import { getAccessToken } from './helpers/helpers';
import { useEffect } from 'react';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL;
const API_PORT = extra?.PORT;
let socket = null;

export const initSocket = async () => {
  if (socket && socket.connected) return socket;

  const token = await getAccessToken();
  if (!token) return null;

  socket = io(`${API_URL}:${API_PORT}`, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
  socket.on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason));
  socket.on('connect_error', (err) => console.log('⚠️ Socket error:', err.message));
  socket.on('transaction:new', (data) => {
    console.log('Nueva transacción:', data);
    // actualizar lista o mostrar notificación
  });
  socket.on('transaction:statusUpdated', (data) => {
    console.log('Transacción modificada:', data);
    // actualizar lista o mostrar notificación
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
