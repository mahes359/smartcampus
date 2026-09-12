import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: injects token & tenant ID
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('smartcampus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const activeCollegeId = localStorage.getItem('smartcampus_college_id');
    if (activeCollegeId) {
      config.headers['X-College-Id'] = activeCollegeId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: standardizes error messages and handles session expiry
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear credentials if token is invalid or expired
      const isAuthRoute = window.location.pathname.startsWith('/login');
      if (!isAuthRoute) {
        localStorage.removeItem('smartcampus_token');
        localStorage.removeItem('smartcampus_user');
        window.location.href = '/login?expired=true';
      }
    }

    // Extract user-friendly error message
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    const message = data?.message || data?.error || error.message || 'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
