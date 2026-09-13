import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
/**
 * Formatea una fecha al estilo:
 * - Con hora: "October 17, 2025 - 2:19 pm"
 * - Sin hora: "October 17, 2025"
 *
 * @param {string | Date} dateInput - Fecha en string ISO o Date object
 * @param {boolean} includeTime - Si true, incluye la hora. Default: true
 * @returns {string} Fecha formateada o cadena vacía si la fecha es inválida
 */
export function formatTransactionDate(
  dateInput: string | Date,
  includeTime: boolean = true
): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthName = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  if (!includeTime) {
    return `${monthName} ${day}, ${year}`;
  }

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  if (hours === 0) hours = 12; // caso 12 AM / 12 PM

  const minuteStr = minutes.toString().padStart(2, '0');

  return `${monthName} ${day}, ${year} - ${hours}:${minuteStr} ${ampm}`;
}

/**
 * Ordena un arreglo por cualquier propiedad de tipo fecha.
 *
 * @param {Array} array - El arreglo a ordenar.
 * @param {string} dateProp - El nombre de la propiedad que contiene la fecha.
 * @param {string} order - 'asc' para ascendente o 'desc' para descendente (por defecto 'desc').
 * @returns {Array} - Nuevo arreglo ordenado.
 */
export const sortByDateProp = <T extends object>(array: T[], dateProp: string, order = 'desc') => {
  return array.slice().sort((a, b) => {
    const dateA = new Date(String((a as Record<string, unknown>)[dateProp]));
    const dateB = new Date(String((b as Record<string, unknown>)[dateProp]));

    if (order === 'asc') {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
  });
};
export const groupByDate = (transactions: any[], dateProp: string) => {
  return transactions.reduce((groups: Record<string, any[]>, item) => {
    const dateKey = new Date(item[dateProp]).toDateString(); // "Sun Oct 25 2025"

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);

    return groups;
  }, {});
};
// TOKEN HELPERS
interface TokenPayload {
  userId: number;
  email: string;
  roles: string[];
  exp: number;
}
export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync('accessToken', token);
}
export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}
export async function deleteAccessToken() {
  await SecureStore.deleteItemAsync('accessToken');
}
export async function getUserFromToken(): Promise<TokenPayload | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const expiresAt = Number(decoded.exp ?? 0);
    const currentTime = Math.floor(Date.now() / 1000);

    if (expiresAt && expiresAt < currentTime) {
      console.warn('Token has expired');
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
export type UserRole = {
  roleId: number;
};

export async function getUserRoles(): Promise<UserRole[] | null> {
  const user = await getUserFromToken();
  return user?.roles?.map((role) => ({ roleId: Number(role) })) ?? null;
}
// REFRESH TOKEN
export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync('refreshToken', token);
}
export async function getRefreshToken() {
  return await SecureStore.getItemAsync('refreshToken');
}
export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync('refreshToken');
}

export async function savePendingRegistrationEmail(email: string) {
  await SecureStore.setItemAsync('pendingRegistrationEmail', email);
}

export async function getPendingRegistrationEmail(): Promise<string | null> {
  return await SecureStore.getItemAsync('pendingRegistrationEmail');
}

export async function deletePendingRegistrationEmail() {
  await SecureStore.deleteItemAsync('pendingRegistrationEmail');
}

export type RegistrationDraft = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmation: string;
  termsAccepted: boolean;
};

const registrationDraftKey = 'registrationDraft';

export async function saveRegistrationDraft(draft: RegistrationDraft) {
  await SecureStore.setItemAsync(registrationDraftKey, JSON.stringify(draft));
}

export async function getRegistrationDraft(): Promise<RegistrationDraft | null> {
  const draft = await SecureStore.getItemAsync(registrationDraftKey);
  if (!draft) return null;

  try {
    return JSON.parse(draft) as RegistrationDraft;
  } catch {
    return null;
  }
}

export async function deleteRegistrationDraft() {
  await SecureStore.deleteItemAsync(registrationDraftKey);
}
