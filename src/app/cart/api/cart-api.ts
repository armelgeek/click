import { 
  UpdateCartItemPayload, 
  CreateOrderPayload, 
  Order,
  CartResponse,
  OrderResponse
} from '../types';
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';

// Extended payload for addToCart that includes product details
// This allows adding products to cart with full information
export interface AddToCartPayloadExtended {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export class CartAPI {

  static async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>(
      API_ENDPOINTS.cart.get
    );
    return response.data;
  }

  static async addToCart(payload: AddToCartPayloadExtended): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.cart.addItem,
      payload
    );
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
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.cart.clear
    );
    return response.data;
  }

  static async selectAllItems(selected: boolean): Promise<CartResponse> {
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.cart.selectAll,
      { selected }
    );
    return response.data;
  }

  static async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    // Create order through the orders endpoint
    // The backend will handle removing selected items from cart
    // deliveryAddress and paymentMethod in the payload are actually IDs
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.orders.create,
      {
        addressId: payload.deliveryAddress,
        paymentMethodId: payload.paymentMethod,
        notes: payload.notes
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
}
