import {
  UpdateCartItemPayload,
  CreateOrderPayload,
  Order,
  CartResponse,
  OrderResponse,
  StockValidationResponse
} from '../types';
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';

export type ValidateStockRequestPayload = {
  userId?: string;
  items?: { productId: string; quantity: number }[];
  selectedOnly?: boolean;
};

// Extended payload for addToCart that includes product details
// This allows adding products to cart with full information
export interface AddToCartPayloadExtended {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  storeId?: string;
  userId?: string;
}

export class CartAPI {
  private static _validatePromises: Map<string, Promise<StockValidationResponse>> = new Map();
  private static _lastAttempts: Map<string, number> = new Map();
  private static _lastResults: Map<string, StockValidationResponse> = new Map();

  static async getCart(userId: string): Promise<CartResponse> {
    const response = await apiClient.get(API_ENDPOINTS.cart.get);
    const apiCart = response.data;
    // Adapter le mapping pour correspondre au type CartResponse
    // On mappe les champs pour correspondre à Cart
    type ApiCartItem = {
      id: string;
      productId: string;
      quantity: number;
      isSelected?: boolean;
      product?: {
        name?: string;
        priceTTC?: string | number;
        images?: { url?: string }[];
      };
    };
    const cart = {
      id: apiCart.id,
      userId,
      items: (apiCart.items || []).map((item: ApiCartItem) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || '',
        price: Number(item.product?.priceTTC || 0),
        image: item.product?.images?.[0]?.url || '/icons/product.png',
        quantity: item.quantity,
        selected: item.isSelected ?? true,
      })),
      total: Number(apiCart.subtotal || 0),
      itemCount: apiCart.itemCount || 0,
      createdAt: apiCart.createdAt,
      updatedAt: apiCart.updatedAt,
    };
    return { cart };
  }

  static async addToCart(payload: AddToCartPayloadExtended): Promise<CartResponse> {
    // Server expects only the minimal add-to-cart payload (productId, quantity, storeId)
    const body: Record<string, unknown> = {
      productId: payload.productId,
      quantity: payload.quantity,
    };
    if (payload.storeId) body.storeId = payload.storeId;
    if (payload.userId) body.userId = payload.userId;
    const response = await apiClient.post<CartResponse>(API_ENDPOINTS.cart.addItem, body);
    return response.data;
  }

  static async updateCartItem(
    itemId: string,
    payload: UpdateCartItemPayload,
    userId?: string
  ): Promise<CartResponse> {
    const body = { ...payload } as Record<string, unknown>;
    if (userId) body.userId = userId;
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.updateItem(itemId),
      body
    );
    return response.data;
  }

  static async removeFromCart(itemId: string, userId?: string): Promise<CartResponse> {
    const config: Record<string, unknown> = {};
    if (userId) config.data = { userId };
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.cart.removeItem(itemId),
      config
    );
    return response.data;
  }

  static async clearCart(userId?: string): Promise<CartResponse> {
    const config: Record<string, unknown> = {};
    if (userId) config.data = { userId };
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.cart.clear,
      config
    );
    return response.data;
  }

  static async selectAllItems(selected: boolean, userId?: string): Promise<CartResponse> {
    const body: Record<string, unknown> = { selected };
    if (userId) body.userId = userId;
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.selectAll,
      body
    );
    return response.data;
  }

  static async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    // Create order through the orders endpoint
    // The backend will handle removing selected items from cart
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.orders.create,
      {
        userId: payload.userId,
        storeId: payload.storeId,
        addressId: payload.addressId,
        notes: payload.notes,
        mode: payload.mode,
        planifiedDate: payload.planifiedDate,
        planifiedHour: payload.planifiedHour,
      }
    );
    return response.data;
  }

  static async getOrder(orderId: string): Promise<OrderResponse> {
    const response = await apiClient.get<OrderResponse>(
      API_ENDPOINTS.orders.detail(orderId)
    );
    return response.data;
  }

  static async getOrders(): Promise<{ orders: Order[] }> {
    const response = await apiClient.get<{ data: Order[] }>(
      API_ENDPOINTS.orders.list
    );
    // Transform response to match expected format
    return {
      orders: response.data.data
    };
  }

  static async validateStock(payload?: ValidateStockRequestPayload): Promise<StockValidationResponse> {
    const response = await apiClient.post<StockValidationResponse>(
      API_ENDPOINTS.cart.validateStock,
      payload || {}
    );
    return response.data;
  }

  // Throttled/deduped validation: reuses an in-flight request or returns last result within throttle window
  static async validateStockThrottled(force: boolean = false, throttleMs: number = 800, payload?: ValidateStockRequestPayload): Promise<StockValidationResponse> {
    const now = Date.now();
    const key = JSON.stringify(payload || {});
    if (!force) {
      const existing = CartAPI._validatePromises.get(key);
      if (existing) return existing;
      const lastAttempt = CartAPI._lastAttempts.get(key) ?? 0;
      const lastResult = CartAPI._lastResults.get(key);
      if (lastResult && (now - lastAttempt) < throttleMs) return lastResult;
    }
    CartAPI._lastAttempts.set(key, now);
    const p = CartAPI.validateStock(payload);
    CartAPI._validatePromises.set(key, p);
    try {
      const result = await p;
      CartAPI._lastResults.set(key, result);
      return result;
    } finally {
      CartAPI._validatePromises.delete(key);
    }
  }
}
