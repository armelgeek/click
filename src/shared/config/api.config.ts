import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  stores: {
    list: '/stores',
    detail: (id: string) => `/stores/${id}`,
    products: (id: string) => `/stores/${id}/products`,
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
  },
} as const;
