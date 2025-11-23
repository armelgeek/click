import { DeliveryTrackingResponse, DeliveryStatusUpdateResponse } from '../types';
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';

export class DeliveryAPI {

  static async getOrderTracking(orderId: string, userId: string): Promise<DeliveryTrackingResponse> {
    const response = await apiClient.get<DeliveryTrackingResponse>(
      API_ENDPOINTS.delivery.tracking(orderId, userId)
    );
    return response.data;
  }

  static async getStatusUpdates(orderId: string): Promise<DeliveryStatusUpdateResponse> {
    const response = await apiClient.get<DeliveryStatusUpdateResponse>(
      API_ENDPOINTS.delivery.statusUpdates(orderId)
    );
    return response.data;
  }

  static async callDriver(orderId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.delivery.callDriver(orderId)
    );
    return response.data;
  }

  static async sendMessage(orderId: string, message: string): Promise<{ success: boolean; response: string }> {
    const response = await apiClient.post<{ success: boolean; response: string }>(
      API_ENDPOINTS.delivery.sendMessage(orderId),
      { message }
    );
    return response.data;
  }

  static async markAsReceived(orderId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.delivery.markReceived(orderId)
    );
    return response.data;
  }
}