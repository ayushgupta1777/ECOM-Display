// ============================================
// mobile/src/services/api.js
// ============================================
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - Update this with your backend URL
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://era-backend-psi.vercel.app/api';

// For Android emulator use: http://10.0.2.2:5000/api
// For real device use your computer's IP: http://192.168.x.x:5000/api

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}); 

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Navigate to login screen (implement with navigation ref if needed)
    }
    return Promise.reject(error);
  }
);

export default api;
