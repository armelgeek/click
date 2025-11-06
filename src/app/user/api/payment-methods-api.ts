import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { 
  PaymentMethod, 
  CreatePaymentMethodPayload 
} from '@/shared/types/api.types';

export class PaymentMethodsAPI {
  
  static async getUserPaymentMethods(): Promise<{ paymentMethods: PaymentMethod[] }> {
    const response = await apiClient.get<{ paymentMethods: PaymentMethod[] }>(
      API_ENDPOINTS.paymentMethods.list
    );
    return response.data;
  }

  static async createPaymentMethod(payload: CreatePaymentMethodPayload): Promise<{ paymentMethod: PaymentMethod }> {
    const response = await apiClient.post<{ paymentMethod: PaymentMethod }>(
      API_ENDPOINTS.paymentMethods.create,
      payload
    );
    return response.data;
  }

  static async deletePaymentMethod(paymentId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.paymentMethods.delete(paymentId)
    );
    return response.data;
  }

  static async setDefaultPaymentMethod(paymentId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      API_ENDPOINTS.paymentMethods.setDefault(paymentId)
    );
    return response.data;
  }
}
