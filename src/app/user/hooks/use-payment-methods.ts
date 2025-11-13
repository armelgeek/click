import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentMethodsAPI } from '../api/payment-methods-api';
import { CreatePaymentMethodPayload } from '@/shared/types/api.types';

const paymentMethodKeys = {
  all: ['paymentMethods'] as const,
  list: () => [...paymentMethodKeys.all, 'list'] as const,
};

export const usePaymentMethods = () => {
  const query = useQuery({
    queryKey: paymentMethodKeys.list(),
    queryFn: () => PaymentMethodsAPI.getUserPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    paymentMethods: query.data?.paymentMethods || [],
  };
};

export const usePaymentMethodsMutations = () => {
  const queryClient = useQueryClient();

  const createPaymentMethod = useMutation({
    mutationFn: (payload: CreatePaymentMethodPayload) => PaymentMethodsAPI.createPaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'paymentMethods'] });
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: (paymentId: string) => PaymentMethodsAPI.deletePaymentMethod(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'paymentMethods'] });
    },
  });

  const setDefaultPaymentMethod = useMutation({
    mutationFn: (paymentId: string) => PaymentMethodsAPI.setDefaultPaymentMethod(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });
      queryClient.invalidateQueries({ queryKey: ['checkout', 'paymentMethods'] });
    },
  });

  return {
    createPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};
