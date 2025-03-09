import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { LocalStorageKey } from '@/constants/general';

const backendServer = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

backendServer.interceptors.request.use((config) => {
  const token = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default backendServer;
