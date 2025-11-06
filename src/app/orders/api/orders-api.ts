import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { 
  OrderStatistics, 
  OrderRatingPayload, 
  OrderReturnPayload, 
  OrderReturnStatus,
  OrderCancelPayload,
  DeliveryConfirmationPayload,
  OrderTracking,
  PaginationParams,
  PaginatedResponse
} from '@/shared/types/api.types';

export interface CreateOrderPayload {
  addressId: string;
  paymentMethodId: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ProofOfDelivery {
  type: 'photo' | 'signature';
  image?: string;
  signature?: string;
  timestamp?: string;
}

export interface Order {
  id: string;
  number?: number;
  status: string;
  statusLabel?: string;
  statusColor?: string;
  date: string;
  estimatedDelivery?: string;
  deliveryAddress: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  proofOfDelivery?: ProofOfDelivery;
  tracking?: OrderTracking;
  createdAt?: string;
  updatedAt?: string;
}

export class OrdersAPI {
  
  static async createOrder(payload: CreateOrderPayload): Promise<{ order: Order }> {
    const response = await apiClient.post<{ order: Order }>(
      API_ENDPOINTS.orders.create,
      payload
    );
    return response.data;
  }

  static async getOrders(params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.orders.list,
      { params }
    );
    return response.data;
  }

  static async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(orderId));
    return response.data;
  }

  static async getOrderStatistics(): Promise<OrderStatistics> {
    const response = await apiClient.get<OrderStatistics>(API_ENDPOINTS.orders.statistics);
    return response.data;
  }

  static async cancelOrder(orderId: string, payload?: OrderCancelPayload): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      API_ENDPOINTS.orders.cancel(orderId),
      payload
    );
    return response.data;
  }

  static async requestReturn(orderId: string, payload: OrderReturnPayload): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.orders.return(orderId),
      payload
    );
    return response.data;
  }

  static async getReturnStatus(orderId: string): Promise<OrderReturnStatus> {
    const response = await apiClient.get<OrderReturnStatus>(
      API_ENDPOINTS.orders.returnStatus(orderId)
    );
    return response.data;
  }

  static async rateOrder(orderId: string, payload: OrderRatingPayload): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.orders.rating(orderId),
      payload
    );
    return response.data;
  }

  static async getOrderTracking(orderId: string): Promise<OrderTracking> {
    const response = await apiClient.get<OrderTracking>(
      API_ENDPOINTS.orders.tracking(orderId)
    );
    return response.data;
  }

  static async getOrderInvoice(orderId: string): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      API_ENDPOINTS.orders.invoice(orderId)
    );
    return response.data;
  }

  static async confirmDelivery(orderId: string, payload: DeliveryConfirmationPayload): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.orders.confirmDelivery(orderId),
      payload
    );
    return response.data;
  }
}
