import { useQuery } from '@tanstack/react-query';
import { OrdersAPI } from '../api/orders-api';
import type { Order } from '../types/order.schema';
import type { PaginatedResponse } from '@/shared/types/api.types';

interface UsePaginatedOrdersParams {
  userId: string;
  page?: number;
  limit?: number;
}

export function usePaginatedOrders({ userId, page = 1, limit = 10 }: UsePaginatedOrdersParams) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', userId, page, limit],
    queryFn: () => OrdersAPI.getOrders({ userId, page, limit }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
    enabled: !!userId,
  });
}
