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
import { getMockOrders, getMockOrderById } from '../data/mock-orders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  
  static async createOrder(_payload: CreateOrderPayload): Promise<{ order: Order }> {
    await delay(300);
    // This should not be called directly - orders are created via CartAPI
    throw new Error('Orders should be created via CartAPI.createOrder()');
  }

  static async getOrders(params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    await delay(250);
    const orders = getMockOrders();
    
    // Convert orders to the expected format
    const convertedOrders: Order[] = orders.map(order => ({
      id: order.id,
      status: order.status || 'pending',
      statusLabel: this.getStatusLabel(order.status),
      statusColor: this.getStatusColor(order.status),
      date: order.createdAt || new Date().toISOString(),
      deliveryAddress: order.deliveryAddress || '',
      totalAmount: order.total || 0,
      currency: 'EUR',
      items: order.items?.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })) || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: convertedOrders.slice(start, end),
      total: convertedOrders.length,
      page,
      limit,
      totalPages: Math.ceil(convertedOrders.length / limit)
    };
  }

  static async getOrderById(orderId: string): Promise<Order> {
    await delay(200);
    const order = getMockOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.id,
      status: order.status || 'pending',
      statusLabel: this.getStatusLabel(order.status),
      statusColor: this.getStatusColor(order.status),
      date: order.createdAt || new Date().toISOString(),
      deliveryAddress: order.deliveryAddress || '',
      totalAmount: order.total || 0,
      currency: 'EUR',
      items: order.items?.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })) || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  static async getOrderStatistics(): Promise<OrderStatistics> {
    await delay(200);
    const orders = getMockOrders();
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      totalOrders: orders.length,
      totalSpent,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
    };
  }

  static async cancelOrder(_orderId: string, _payload?: OrderCancelPayload): Promise<{ success: boolean; message: string }> {
    await delay(300);
    return {
      success: true,
      message: 'Commande annulée avec succès'
    };
  }

  static async requestReturn(_orderId: string, _payload: OrderReturnPayload): Promise<{ success: boolean; message: string }> {
    await delay(400);
    return {
      success: true,
      message: 'Demande de retour enregistrée'
    };
  }

  static async getReturnStatus(orderId: string): Promise<OrderReturnStatus> {
    await delay(200);
    return {
      orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async rateOrder(_orderId: string, _payload: OrderRatingPayload): Promise<{ success: boolean; message: string }> {
    await delay(300);
    return {
      success: true,
      message: 'Merci pour votre évaluation !'
    };
  }

  static async getOrderTracking(_orderId: string): Promise<OrderTracking> {
    await delay(250);
    // This should use DeliveryAPI instead
    throw new Error('Use DeliveryAPI.getOrderTracking() instead');
  }

  static async getOrderInvoice(_orderId: string): Promise<{ url: string }> {
    await delay(300);
    return {
      url: `/invoices/${_orderId}.pdf`
    };
  }

  static async confirmDelivery(_orderId: string, _payload: DeliveryConfirmationPayload): Promise<{ success: boolean; message: string }> {
    await delay(400);
    return {
      success: true,
      message: 'Livraison confirmée'
    };
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
