import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartAPI } from '../api/cart-api';
import { cartKeys, CART_STALE_TIME, CART_CACHE_TIME } from '../config';
import { AddToCartPayload, UpdateCartItemPayload, CreateOrderPayload } from '../types';


export const useCart = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => CartAPI.getCart(),
    staleTime: CART_STALE_TIME.CART,
    gcTime: CART_CACHE_TIME.CART,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: cartKeys.cart(),
      refetchType: 'all',
    });
  };

  return {
    ...query,
    cart: query.data?.cart,
    invalidate,
  };
};

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: (payload: AddToCartPayload) => CartAPI.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const updateCartItem = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateCartItemPayload }) =>
      CartAPI.updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error) => {
      console.error('Failed to update cart item:', error);
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (itemId: string) => CartAPI.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error) => {
      console.error('Failed to remove from cart:', error);
    },
  });

  const clearCart = useMutation({
    mutationFn: () => CartAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
    },
  });

  const selectAllItems = useMutation({
    mutationFn: (selected: boolean) => CartAPI.selectAllItems(selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
    },
    onError: (error) => {
      console.error('Failed to select all items:', error);
    },
  });

  const createOrder = useMutation({
    mutationFn: (payload: CreateOrderPayload) => CartAPI.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });

  const incrementQuantity = (itemId: string, currentQuantity: number) => {
    updateCartItem.mutate({
      itemId,
      payload: { quantity: currentQuantity + 1 },
    });
  };

  const decrementQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem.mutate({
        itemId,
        payload: { quantity: currentQuantity - 1 },
      });
    }
  };

  const toggleItemSelection = (itemId: string, currentSelected: boolean) => {
    updateCartItem.mutate({
      itemId,
      payload: { selected: !currentSelected },
    });
  };

  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    selectAllItems,
    createOrder,

    incrementQuantity,
    decrementQuantity,
    toggleItemSelection,

    isAddingToCart: addToCart.isPending,
    isUpdatingCart: updateCartItem.isPending,
    isRemovingFromCart: removeFromCart.isPending,
    isClearingCart: clearCart.isPending,
    isSelectingAll: selectAllItems.isPending,
    isCreatingOrder: createOrder.isPending,

    addToCartError: addToCart.error,
    updateCartError: updateCartItem.error,
    removeFromCartError: removeFromCart.error,
    clearCartError: clearCart.error,
    selectAllError: selectAllItems.error,
    createOrderError: createOrder.error,
  };
};