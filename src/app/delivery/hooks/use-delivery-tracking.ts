import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliveryAPI } from '../api/delivery-api';

// Query keys for delivery tracking
export const deliveryKeys = {
  all: ['delivery'] as const,
  tracking: (orderId: string) => ['delivery', 'tracking', orderId] as const,
  updates: (orderId: string) => ['delivery', 'updates', orderId] as const,
};

/**
 * Hook to get delivery tracking information for an order
 */
export const useDeliveryTracking = (orderId: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: deliveryKeys.tracking(orderId),
    queryFn: () => DeliveryAPI.getOrderTracking(orderId),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: options?.refetchInterval || 15000, // Refetch every 15 seconds for real-time updates
    refetchIntervalInBackground: true,
    enabled: !!orderId
  });
};

/**
 * Hook to get real-time status updates
 */
export const useDeliveryStatusUpdates = (orderId: string) => {
  return useQuery({
    queryKey: deliveryKeys.updates(orderId),
    queryFn: () => DeliveryAPI.getStatusUpdates(orderId),
    refetchInterval: 5000, // More frequent updates for position
    refetchIntervalInBackground: true,
    enabled: !!orderId,
    staleTime: 0 // Always fresh for real-time updates
  });
};

/**
 * Hook for delivery actions (call, message, mark as received)
 */
export const useDeliveryActions = (orderId: string) => {
  const queryClient = useQueryClient();

  const invalidateTracking = () => {
    queryClient.invalidateQueries({
      queryKey: deliveryKeys.tracking(orderId)
    });
    queryClient.invalidateQueries({
      queryKey: deliveryKeys.updates(orderId)
    });
  };

  const callDriverMutation = useMutation({
    mutationFn: () => DeliveryAPI.callDriver(orderId),
    onSuccess: (data) => {
      if (data.success) {
        // You could show a toast notification here
        console.log('Call initiated:', data.message);
      }
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => DeliveryAPI.sendMessage(orderId, message),
    onSuccess: (data) => {
      if (data.success) {
        // You could show the driver's response in a toast or modal
        console.log('Driver response:', data.response);
      }
    }
  });

  const markAsReceivedMutation = useMutation({
    mutationFn: () => DeliveryAPI.markAsReceived(orderId),
    onSuccess: (data) => {
      if (data.success) {
        invalidateTracking(); // Refresh tracking data
        console.log('Order marked as received:', data.message);
      }
    }
  });

  return {
    callDriver: callDriverMutation.mutate,
    isCallingDriver: callDriverMutation.isPending,
    callDriverError: callDriverMutation.error,
    
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    sendMessageError: sendMessageMutation.error,
    
    markAsReceived: markAsReceivedMutation.mutate,
    isMarkingAsReceived: markAsReceivedMutation.isPending,
    markAsReceivedError: markAsReceivedMutation.error,
    
    invalidateTracking
  };
};