import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { APICONSTANTS } from '../constants/api';

// Create API instance
export const api = axios.create({
  baseURL: APICONSTANTS.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(async (config) => {
  try {
    // Get token from secure storage
    const storedData = await SecureStore.getItemAsync('accessToken');
    if (storedData) {
      const [[, token]] = JSON.parse(storedData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.log('Error accessing secure storage:', error);
  }

  console.log('Making request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data ? {...config.data, password: '[REDACTED]'} : undefined
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;
