import { PaymentMethodsAPI } from '@/app/user/api/payment-methods-api';
import { PaymentMethod } from '@/shared/types/api.types';

export class CheckoutPaymentMethodsAPI {
  static async getUserPaymentMethods(): Promise<{ paymentMethods: PaymentMethod[] }> {
    // Delegate to the real PaymentMethodsAPI instead of using mock data
    return PaymentMethodsAPI.getUserPaymentMethods();
  }
}
