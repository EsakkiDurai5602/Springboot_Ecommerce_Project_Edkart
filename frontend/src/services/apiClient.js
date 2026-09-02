import axios from 'axios';

/**
 * Centralized API Client with JWT Authorization & Fallback Engine
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach Bearer JWT token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edkart_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error payloads and handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('edkart_auth_token');
        localStorage.removeItem('edkart_user');
        // Dispatch custom session-expired event
        window.dispatchEvent(new CustomEvent('edkart:session_expired'));
      }
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Server returned an error.',
        errors: error.response.data?.errors,
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Unable to reach the banking server. Please check your connection.',
      });
    } else {
      return Promise.reject({
        status: 500,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  }
);

export default apiClient;
