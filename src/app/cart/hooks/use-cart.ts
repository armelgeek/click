import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartAPI } from '../api/cart-api';
import { OrdersAPI } from '@/app/orders/api/orders-api';
import { useCartStore } from '../store';
import { CartResponse } from '../types';
import { cartKeys, CART_STALE_TIME, CART_CACHE_TIME } from '../config';
import { AddToCartPayload, UpdateCartItemPayload } from '../types';


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
  onSuccess: (data: CartResponse) => {
      // update react-query cache
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      // update local zustand store immediately so header reflects change
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = (data.cart as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (err) {
          console.warn('Failed to save cart updatedAt', err);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const updateCartItem = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateCartItemPayload }) =>
      CartAPI.updateCartItem(itemId, payload),
  onSuccess: (data: CartResponse) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = (data.cart as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (err) {
          console.warn('Failed to save cart updatedAt', err);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to update cart item:', error);
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (itemId: string) => CartAPI.removeFromCart(itemId),
  onSuccess: (data: CartResponse) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = (data.cart as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (err) {
          console.warn('Failed to save cart updatedAt', err);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to remove from cart:', error);
    },
  });

  const clearCart = useMutation({
    mutationFn: () => CartAPI.clearCart(),
  onSuccess: (data: CartResponse) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = (data.cart as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (err) {
          console.warn('Failed to save cart updatedAt', err);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
    },
  });

  const selectAllItems = useMutation({
    mutationFn: (selected: boolean) => CartAPI.selectAllItems(selected),
  onSuccess: (data: CartResponse) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = data.cart.updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (e) {
          console.warn('Failed to save cart updatedAt:', e);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to select all items:', error);
    },
  });

  const createOrder = useMutation({
    mutationFn: (payload: { addressId: string; paymentMethodId: string; notes?: string }) => 
      OrdersAPI.createOrder(payload),
    onSuccess: () => {
      // Order created, invalidate cart and orders so data is refreshed from the server
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