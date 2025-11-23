// Shared API types for all endpoints

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Address types
export interface Address {
  id: string;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressPayload {
  userId?: string; // made optional — backend infers user from auth when possible
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

// Payment Method types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'other';
  provider: string;
  token?: string;
  last4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentMethodPayload {
  type: 'card' | 'paypal' | 'other';
  provider: string;
  token: string;
  last4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Shipping types
export interface ShippingEstimate {
  shippingCost: number;
  estimatedDeliveryTime: string;
  estimatedDays?: number;
}

export interface EstimateShippingPayload {
  addressId: string;
}

// Order Statistics types
export interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
}

// Order Rating types
export interface OrderRatingPayload {
  rating: number;
  comment?: string;
}

// Order Return types
export interface OrderReturnPayload {
  reason: string;
  items?: string[];
}

export interface OrderReturnStatus {
  orderId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

// Order Cancel types
export interface OrderCancelPayload {
  reason?: string;
}

// Delivery Confirmation types
export interface DeliveryConfirmationPayload {
  photoUrl?: string;
  signature?: string;
  notes?: string;
}

// Order Tracking types
export interface OrderTracking {
  orderId: string;
  status: string;
  tracking: TrackingEvent[];
  currentLocation?: {
    latitude: number;
    longitude: number;
    estimatedArrival?: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

export interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: string;
  message?: string;
}

// Payment types
export interface PaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount?: number;
  currency?: string;
}

export interface CreatePaymentIntentPayload {
  amount: number;
  currency: string;
  orderId: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  paymentMethodToken: string;
}

export interface PaymentConfirmation {
  success: boolean;
  status: string;
  message: string;
  transactionId?: string;
}

export interface PaymentErrorSimulation {
  type: 'declined' | 'insufficient_funds' | 'network_error' | 'authentication_required';
}

// Search types
export interface SearchResult {
  products: { id: string; name: string; price: number; image?: string }[];
  stores: { id: string; name: string; address?: string; image?: string }[];
  query: string;
  page: number;
  limit: number;
  totalProducts?: number;
  totalStores?: number;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'store' | 'category';
  image?: string;
}

// Category types (for completeness)
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Stock types
export interface ProductStock {
  productId: string;
  storeId: string;
  quantity: number;
  inStock: boolean;
  status: string;
}

// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
