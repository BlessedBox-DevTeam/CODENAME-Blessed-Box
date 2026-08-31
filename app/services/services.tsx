import axios from 'axios';
import Constants from 'expo-constants';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
} from '../helpers/helpers';
import { disconnectSocket } from '../socketService';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL || 'https://blessedbox.org';
/**
 *
 * @returns
 */
export const logout = async () => {
  const refreshToken = await getRefreshToken();
  const { success } = (await axios.post(`${API_URL}/api/auth/logout`, { refreshToken })).data;
  if (success) {
    deleteAccessToken();
    deleteRefreshToken();
    disconnectSocket();
  }
  return success;
};
/**
 *
 * @param email
 * @param password
 * @returns
 */
export const login = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/api/auth/login`, { email, password });
};
/**
 *
 * @param name
 * @param lastName
 * @param email
 * @param password
 * @returns
 */
export const register = async (name: string, lastName: string, email: string, password: string) => {
  return await axios.post(`${API_URL}/api/auth/register`, { name, lastName, email, password });
};
/**
 *
 * @param refreshToken
 * @returns
 */
export const refreshTokens = async (refreshToken: string) => {
  return await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
};
/**
 *
 * @param email
 * @returns
 */
export const forgotPassword = async (email: string) => {
  return await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
};
/**
 *
 * @param email
 * @param otp
 * @returns
 */
export const verifyOTP = async (email: string, otp: number | string) => {
  return await axios.post(`${API_URL}/api/auth/verify-otp`, {
    email,
    otp,
  });
};
/**
 *
 * @param email
 * @returns
 */
export const resendOTP = async (email: string) => {
  return await axios.post(`${API_URL}/api/auth/resend-otp`, email);
};
/**
 *
 * @returns
 */
export const getUserBoxes = async () => {
  const token = await getAccessToken();
  return await axios.get(`${API_URL}/api/boxes/userBoxes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
/**
 *
 * @param codeValue
 * @returns
 */
export const getRecollectionCenterBoxesCount = async () => {
  const token = await getAccessToken();
  return await axios.get(`${API_URL}/api/boxes/countRCBoxes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const scanQRCode = async (codeValue: string) => {
  return await axios.post(`${API_URL}/api/qrCodes/isQRCode`, { qrCodeValue: codeValue });
};
