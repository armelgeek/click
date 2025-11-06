import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OrdersAPI } from '@/app/orders/api/orders-api';
import { orderKeys, CART_STALE_TIME, CART_CACHE_TIME } from '../config';

/**
 * Hook to get all orders
 */
export const useOrders = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: orderKeys.lists(),
    queryFn: async () => {
      const response = await OrdersAPI.getOrders({ page: 1, limit: 100 });
      return { orders: response.data };
    },
    staleTime: CART_STALE_TIME.ORDERS,
    gcTime: CART_CACHE_TIME.ORDERS,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: orderKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    ...query,
    orders: query.data?.orders || [],
    invalidate,
  };
};

/**
 * Hook to get a specific order by ID
 */
export const useOrder = (orderId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: async () => {
      const order = await OrdersAPI.getOrderById(orderId!);
      return { order };
    },
    enabled: !!orderId,
    staleTime: CART_STALE_TIME.ORDERS,
    gcTime: CART_CACHE_TIME.ORDERS,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: orderKeys.detail(orderId || ''),
      refetchType: 'all',
    });
  };

  return {
    ...query,
    order: query.data?.order,
    invalidate,
  };
};