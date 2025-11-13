import { AddressesAPI } from '@/app/user/api/addresses-api';
import { Address } from '@/shared/types/api.types';

export class CheckoutAddressesAPI {
  static async getUserAddresses(): Promise<{ addresses: Address[] }> {
    // Delegate to the real AddressesAPI instead of using mock data
    return AddressesAPI.getUserAddresses();
  }
}
