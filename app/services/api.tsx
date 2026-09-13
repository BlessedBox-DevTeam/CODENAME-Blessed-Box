import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '../helpers/helpers';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL || 'https://blessedbox.org';

const api = axios.create({
  baseURL: API_URL,
});

const refreshableTokenErrors = new Set(['ACCESS_TOKEN_EXPIRED']);

interface ApiErrorResponse {
  code?: string;
}

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('The server did not return a valid token pair');
      }

      await saveAccessToken(newAccessToken);
      await saveRefreshToken(newRefreshToken);

      return newAccessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const errorCode = error.response?.data?.code;

    if (
      error.response?.status !== 401 ||
      typeof errorCode !== 'string' ||
      !refreshableTokenErrors.has(errorCode) ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
