import { mockPaymentMethods } from '../data/mock-checkout-data';
import { PaymentMethod } from '@/shared/types/api.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Use a copy of the mock data to allow modifications
const currentPaymentMethods = [...mockPaymentMethods];

export class CheckoutPaymentMethodsAPI {
  static async getUserPaymentMethods(): Promise<{ paymentMethods: PaymentMethod[] }> {
    await delay(200);
    return {
      paymentMethods: currentPaymentMethods,
    };
  }
}
