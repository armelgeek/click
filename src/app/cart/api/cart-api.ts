import { 
  AddToCartPayload, 
  UpdateCartItemPayload, 
  CartResponse,
} from '../types';
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { 
  ShippingEstimate, 
  EstimateShippingPayload 
} from '@/shared/types/api.types';

export class CartAPI {

  static async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>(API_ENDPOINTS.cart.get);
    return response.data;
  }

  static async addToCart(payload: AddToCartPayload & { storeId?: string }): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(API_ENDPOINTS.cart.addItem, payload);
    return response.data;
  }

  static async updateCartItem(
    itemId: string, 
    payload: UpdateCartItemPayload
  ): Promise<CartResponse> {
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.updateItem(itemId),
      payload
    );
    return response.data;
  }

  static async removeFromCart(itemId: string): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.cart.removeItem(itemId)
    );
    return response.data;
  }

  static async clearCart(): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(API_ENDPOINTS.cart.clear);
    return response.data;
  }

  static async selectAllItems(selected: boolean): Promise<CartResponse> {
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.selectAll,
      { isSelected: selected }
    );
    return response.data;
  }

  static async estimateShipping(payload: EstimateShippingPayload): Promise<ShippingEstimate> {
    const response = await apiClient.post<ShippingEstimate>(
      API_ENDPOINTS.cart.estimateShipping,
      payload
    );
    return response.data;
  }

  static async saveCart(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.cart.save
    );
    return response.data;
  }

  static async getSavedCarts(): Promise<{ carts: CartResponse[] }> {
    const response = await apiClient.get<{ carts: CartResponse[] }>(API_ENDPOINTS.cart.saved);
    return response.data;
  }

  static async validateStock(): Promise<{ valid: boolean; issues?: { productId: string; message: string }[] }> {
    const response = await apiClient.get<{ valid: boolean; issues?: { productId: string; message: string }[] }>(
      API_ENDPOINTS.cart.validateStock
    );
    return response.data;
  }
}