import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? 'https://resoanance-neondb.onrender.com/api' : 'http://localhost:5000/api');

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and refresh tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token using the HTTP-only cookie
        await useAuthStore.getState().refreshToken();
        
        // Retry the original request with new token attached by request interceptor
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        useAuthStore.getState().clear();
        // Since we are outside a React component, we can use window to redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
