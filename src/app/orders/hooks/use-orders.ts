import { useQuery } from '@tanstack/react-query';
import { OrdersMockService } from '../api/orders-mock';
import { Order } from '../types/order.schema';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => OrdersMockService.getOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => OrdersMockService.getOrderById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useOrdersByStatus(status: Order['status']) {
  return useQuery({
    queryKey: ['orders', 'status', status],
    queryFn: () => OrdersMockService.getOrdersByStatus(status),
    staleTime: 5 * 60 * 1000,
  });
}