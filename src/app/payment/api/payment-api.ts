import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import {
  PaymentIntent,
  CreatePaymentIntentPayload,
  ConfirmPaymentPayload,
  PaymentConfirmation,
  PaymentErrorSimulation,
} from '@/shared/types/api.types';

export class PaymentAPI {
  
  static async createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentIntent> {
    const response = await apiClient.post<PaymentIntent>(
      API_ENDPOINTS.payment.intent,
      payload
    );
    return response.data;
  }

  static async confirmPayment(payload: ConfirmPaymentPayload): Promise<PaymentConfirmation> {
    const response = await apiClient.post<PaymentConfirmation>(
      API_ENDPOINTS.payment.confirm,
      payload
    );
    return response.data;
  }

  static async simulateError(payload: PaymentErrorSimulation): Promise<{ error: string; message: string }> {
    const response = await apiClient.post<{ error: string; message: string }>(
      API_ENDPOINTS.payment.simulateError,
      payload
    );
    return response.data;
  }
}
