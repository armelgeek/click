import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersAPI } from '../api/orders-api';
import type { DeliveryConfirmationPayload } from '@/shared/types/api.types';

export function useConfirmDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, payload }: { orderId: string; payload: DeliveryConfirmationPayload }) => {
      return OrdersAPI.confirmDelivery(orderId, payload);
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific order and the orders list
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
