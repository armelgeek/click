import { useQuery } from '@tanstack/react-query';
import { CheckoutAddressesAPI } from '../api/checkout-addresses-api';
import { CheckoutPaymentMethodsAPI } from '../api/checkout-payment-methods-api';

export const useCheckoutAddresses = () => {
  const query = useQuery({
    queryKey: ['checkout', 'addresses'],
    queryFn: () => CheckoutAddressesAPI.getUserAddresses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    addresses: query.data?.addresses || [],
  };
};

export const useCheckoutPaymentMethods = () => {
  const query = useQuery({
    queryKey: ['checkout', 'paymentMethods'],
    queryFn: () => CheckoutPaymentMethodsAPI.getUserPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    paymentMethods: query.data?.paymentMethods || [],
  };
};
