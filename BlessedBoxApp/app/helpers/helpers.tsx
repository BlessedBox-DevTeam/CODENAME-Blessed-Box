import * as SecureStore from 'expo-secure-store';
/**
 * Formatea una fecha al estilo: "October 17, 2025 - 2:19 pm"
 * @param {string | Date} dateInput - Fecha en string ISO o Date object
 * @returns {string} Fecha formateada o cadena vacía si la fecha es inválida
 */
export function formatTransactionDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const monthName = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  if (hours === 0) hours = 12; // 12 AM / 12 PM case

  const minuteStr = minutes.toString().padStart(2, '0');

  return `${monthName} ${day}, ${year} - ${hours}:${minuteStr} ${ampm}`;
}

export async function saveToken(token: string) {
  await SecureStore.setItemAsync('userToken', token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('userToken');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('userToken');
}
