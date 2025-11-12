import { mockAddresses } from '../data/mock-checkout-data';
import { Address } from '@/shared/types/api.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Use a copy of the mock data to allow modifications
const currentAddresses = [...mockAddresses];

export class CheckoutAddressesAPI {
  static async getUserAddresses(): Promise<{ addresses: Address[] }> {
    await delay(200);
    return {
      addresses: currentAddresses,
    };
  }
}
