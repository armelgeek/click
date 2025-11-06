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
  // Cart Management
  cart: {
    get: '/cart',
    addItem: '/cart/items',
    updateItem: (itemId: string) => `/cart/items/${itemId}`,
    removeItem: (itemId: string) => `/cart/items/${itemId}`,
    clear: '/cart',
    selectAll: '/cart/select-all',
    estimateShipping: '/cart/estimate-shipping',
    save: '/cart/save',
    saved: '/cart/saved',
    validateStock: '/cart/validate-stock',
  },
  
  // Orders Management
  orders: {
    create: '/orders',
    list: '/orders',
    detail: (orderId: string) => `/orders/${orderId}`,
    statistics: '/orders/statistics',
    cancel: (orderId: string) => `/orders/${orderId}/cancel`,
    return: (orderId: string) => `/orders/${orderId}/return`,
    returnStatus: (orderId: string) => `/orders/${orderId}/return-status`,
    rating: (orderId: string) => `/orders/${orderId}/rating`,
    tracking: (orderId: string) => `/orders/${orderId}/tracking`,
    invoice: (orderId: string) => `/orders/${orderId}/invoice`,
    confirmDelivery: (orderId: string) => `/orders/${orderId}/confirm-delivery`,
  },
  
  // Payment Processing
  payment: {
    intent: '/payment/intent',
    confirm: '/payment/confirm',
    webhook: '/payment/webhook',
    simulateError: '/payment/simulate-error',
  },
  
  // Search & Categories
  search: {
    global: '/search',
    suggestions: '/search/suggestions',
  },
  categories: {
    list: '/categories',
    detail: (categoryId: string) => `/categories/${categoryId}`,
    products: (categoryId: string) => `/categories/${categoryId}/products`,
  },
  
  // Stores & Products
  stores: {
    list: '/stores',
    detail: (id: string) => `/stores/${id}`,
    products: (id: string) => `/stores/${id}/products`,
    by: (id: string, category: string) => `/stores/${id}/products?category=${category}`,
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    similar: (id: string) => `/products/${id}/similar`,
    stock: (productId: string) => `/products/${productId}/stock`,
  },
  
  // User Addresses
  addresses: {
    list: '/users/addresses',
    create: '/users/addresses',
    update: (addressId: string) => `/users/addresses/${addressId}`,
    delete: (addressId: string) => `/users/addresses/${addressId}`,
    setDefault: (addressId: string) => `/users/addresses/${addressId}/default`,
  },
  
  // User Payment Methods
  paymentMethods: {
    list: '/users/payment-methods',
    create: '/users/payment-methods',
    delete: (paymentId: string) => `/users/payment-methods/${paymentId}`,
    setDefault: (paymentId: string) => `/users/payment-methods/${paymentId}/default`,
  },
  
  // Delivery & Tracking
  delivery: {
    tracking: (orderId: string) => `/delivery/${orderId}/tracking`,
    statusUpdates: (orderId: string) => `/delivery/${orderId}/status-updates`,
    callDriver: (orderId: string) => `/delivery/${orderId}/call-driver`,
    sendMessage: (orderId: string) => `/delivery/${orderId}/message`,
    markReceived: (orderId: string) => `/delivery/${orderId}/mark-received`,
  },
} as const;
