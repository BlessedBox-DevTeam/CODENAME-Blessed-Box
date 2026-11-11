import axios from 'axios';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;
const API_URL = extra?.URL || 'https://blessedbox.org';
const publicApi = axios.create({
  baseURL: API_URL,
});

export default publicApi;
