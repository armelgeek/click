import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { 
  Address, 
  CreateAddressPayload, 
  UpdateAddressPayload 
} from '@/shared/types/api.types';

export class AddressesAPI {
  
  static async getUserAddresses(): Promise<{ addresses: Address[] }> {
    const response = await apiClient.get<{ addresses: Address[] }>(
      API_ENDPOINTS.addresses.list
    );
    return response.data;
  }

  static async createAddress(payload: CreateAddressPayload): Promise<{ address: Address }> {
    const response = await apiClient.post<{ address: Address }>(
      API_ENDPOINTS.addresses.create,
      payload
    );
    return response.data;
  }

  static async updateAddress(
    addressId: string, 
    payload: UpdateAddressPayload
  ): Promise<{ address: Address }> {
    const response = await apiClient.put<{ address: Address }>(
      API_ENDPOINTS.addresses.update(addressId),
      payload
    );
    return response.data;
  }

  static async deleteAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.addresses.delete(addressId)
    );
    return response.data;
  }

  static async setDefaultAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      API_ENDPOINTS.addresses.setDefault(addressId)
    );
    return response.data;
  }
}
