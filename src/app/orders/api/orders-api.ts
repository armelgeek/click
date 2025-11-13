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
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';

export interface CreateOrderPayload {
  addressId: string;
  paymentMethodId: string;
  notes?: string;
}

export interface OrderItemApi {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderApi {
  id: string;
  number?: number;
  status: string;
  date?: string;
  estimatedDelivery?: string;
  deliveryAddress?: string;
  totalAmount?: number;
  total?: number;
  currency?: string;
  items?: OrderItemApi[];
  proofOfDelivery?: ProofOfDelivery;
  tracking?: OrderTracking;
  createdAt?: string;
  updatedAt?: string;
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
  
  static async createOrder(_payload: CreateOrderPayload): Promise<{ order: Order }> {
    // This should not be called directly - orders are created via CartAPI
    throw new Error('Orders should be created via CartAPI.createOrder()');
  }

  static async getOrders(params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<OrderApi>>(
      API_ENDPOINTS.orders.list,
      { params }
    );
    
    // Convert API response to expected format
    const convertedOrders: Order[] = (response.data.data || []).map((order: OrderApi) => ({
      id: order.id,
      number: order.number,
      status: order.status || 'pending',
      statusLabel: this.getStatusLabel(order.status),
      statusColor: this.getStatusColor(order.status),
      date: order.date || order.createdAt || new Date().toISOString(),
      estimatedDelivery: order.estimatedDelivery,
      deliveryAddress: order.deliveryAddress || '',
      totalAmount: order.totalAmount || order.total || 0,
      currency: order.currency || 'EUR',
      items: (order.items || []).map((item: OrderItemApi) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      proofOfDelivery: order.proofOfDelivery,
      tracking: order.tracking,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return {
      data: convertedOrders,
      total: response.data.total || convertedOrders.length,
      page: response.data.page || (params?.page || 1),
      limit: response.data.limit || (params?.limit || 10),
      totalPages: response.data.totalPages || Math.ceil(convertedOrders.length / (params?.limit || 10))
    };
  }

  static async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<OrderApi>(
      API_ENDPOINTS.orders.detail(orderId)
    );
    
    const order = response.data;

    return {
      id: order.id,
      number: order.number,
      status: order.status || 'pending',
      statusLabel: this.getStatusLabel(order.status),
      statusColor: this.getStatusColor(order.status),
      date: order.date || order.createdAt || new Date().toISOString(),
      estimatedDelivery: order.estimatedDelivery,
      deliveryAddress: order.deliveryAddress || '',
      totalAmount: order.totalAmount || order.total || 0,
      currency: order.currency || 'EUR',
      items: (order.items || []).map((item: OrderItemApi) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      proofOfDelivery: order.proofOfDelivery,
      tracking: order.tracking,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  static async getOrderStatistics(): Promise<OrderStatistics> {
    const response = await apiClient.get<OrderStatistics>(
      API_ENDPOINTS.orders.statistics
    );
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
    // This should use DeliveryAPI instead
    throw new Error('Use DeliveryAPI.getOrderTracking() instead');
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

  private static getStatusLabel(status?: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'in_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  }

  private static getStatusColor(status?: string): string {
    switch (status) {
      case 'pending': return 'yellow';
      case 'confirmed': return 'blue';
      case 'preparing': return 'orange';
      case 'in_delivery': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  }
}
