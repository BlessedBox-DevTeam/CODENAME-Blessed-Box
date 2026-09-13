import { getRefreshToken } from '../helpers/helpers';
import api from './api';
import publicApi from './publicApi';

// Public API calls
/**
 *
 * @returns
 */
export const logout = async () => {
  const refreshToken = await getRefreshToken();
  return await publicApi.post(`/api/auth/logout`, { refreshToken });
};
// Private API calls
/**
 *
 * @param email
 * @param password
 * @returns
 */
export const login = async (email: string, password: string) => {
  return await publicApi.post(`/api/auth/login`, { email, password });
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
  return await publicApi.post(`/api/auth/register`, { name, lastName, email, password });
};
/**
 *
 * @param email
 * @returns
 */
export const forgotPassword = async (email: string) => {
  return await publicApi.post(`/api/auth/forgot-password`, { email });
};
/**
 *
 * @param email
 * @param otp
 * @returns
 */
export const verifyOTP = async (email: string, otp: number | string) => {
  return await publicApi.post(`/api/auth/verify-otp`, {
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
  return await publicApi.post(`/api/auth/resend-otp`, { email });
};
// Private API calls
/**
 *
 * @returns
 */
export const getUserBoxes = async () => {
  return await api.get(`/api/boxes/userBoxes`);
};
/**
 *
 * @returns
 */
export const getRecollectionCenterBoxesCount = async () => {
  return await api.get(`/api/boxes/countRCBoxes`);
};
/**
 *
 * @param codeValue
 * @returns
 */
export const scanQRCode = async (codeValue: string) => {
  return await api.post(`/api/qrCodes/isQRCode`, { accessCode: codeValue });
};

export const getRecollectionCenterTransactions = async (params: object) => {
  return await api.get(`/api/transactions/recollectionCenterTransactions`, { params });
};
