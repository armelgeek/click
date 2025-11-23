import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressesAPI } from '../api/addresses-api';
import { CreateAddressPayload, UpdateAddressPayload } from '@/shared/types/api.types';

const addressKeys = {
  all: ['addresses'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export const useAddresses = (userId: string) => {
  const query = useQuery({
    queryKey: addressKeys.list(),
    queryFn: () => AddressesAPI.getUserAddresses(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    addresses: query.data?.addresses || [],
  };
};

export const useAddressesMutations = () => {
  const queryClient = useQueryClient();

  const createAddress = useMutation({
    mutationFn: (payload: CreateAddressPayload) => AddressesAPI.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'addresses'] });
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({ addressId, payload }: { addressId: string; payload: UpdateAddressPayload }) =>
      AddressesAPI.updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'addresses'] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: (addressId: string) => AddressesAPI.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'addresses'] });
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: (addressId: string) => AddressesAPI.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'addresses'] });
    },
  });

  return {
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
