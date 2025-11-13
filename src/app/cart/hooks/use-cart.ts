import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartAPI } from '../api/cart-api';
import { useCartStore } from '../store';
import { CartResponse, Cart } from '../types';
import { cartKeys, CART_STALE_TIME, CART_CACHE_TIME } from '../config';
import { UpdateCartItemPayload, CreateOrderPayload } from '../types';
import { AddToCartPayloadExtended } from '../api/cart-api';
import { GuestCartService } from '../services/guest-cart.service';
import { useSession } from '@/shared/config/auth.config';
import { useState, useEffect } from 'react';


export const useCart = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [guestCart, setGuestCart] = useState<Cart | null>(null);

  // Load guest cart on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const cart = GuestCartService.getCart() || GuestCartService.createEmptyCart();
      setGuestCart(cart);
    }
  }, [isAuthenticated]);

  const query = useQuery({
    queryKey: cartKeys.cart(),
    queryFn: () => CartAPI.getCart(),
    staleTime: CART_STALE_TIME.CART,
    gcTime: CART_CACHE_TIME.CART,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: isAuthenticated, // Only fetch from API if authenticated
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: cartKeys.cart(),
      refetchType: 'all',
    });
  };

  // Return guest cart if not authenticated, otherwise return API cart
  return {
    ...query,
    cart: isAuthenticated ? query.data?.cart : guestCart,
    isLoading: isAuthenticated ? query.isLoading : false,
    error: isAuthenticated ? query.error : null,
    invalidate,
  };
};

export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const addToCart = useMutation({
    mutationFn: async (payload: AddToCartPayloadExtended) => {
      if (isAuthenticated) {
        return CartAPI.addToCart(payload);
      } else {
        // Guest cart - use localStorage
        const cart = GuestCartService.addItem(
          payload.productId,
          payload.quantity,
          payload.name,
          payload.price,
          payload.image
        );
        return { cart };
      }
    },
    onSuccess: (data: CartResponse) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      }
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
    mutationFn: async ({ itemId, payload }: { itemId: string; payload: UpdateCartItemPayload }) => {
      if (isAuthenticated) {
        return CartAPI.updateCartItem(itemId, payload);
      } else {
        const cart = GuestCartService.updateItem(itemId, payload);
        return { cart };
      }
    },
    onSuccess: (data: CartResponse) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      }
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
    mutationFn: async (itemId: string) => {
      if (isAuthenticated) {
        return CartAPI.removeFromCart(itemId);
      } else {
        const cart = GuestCartService.removeItem(itemId);
        return { cart };
      }
    },
    onSuccess: (data: CartResponse) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      }
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
    mutationFn: async () => {
      if (isAuthenticated) {
        return CartAPI.clearCart();
      } else {
        const cart = GuestCartService.clearCart();
        return { cart };
      }
    },
    onSuccess: (data: CartResponse) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      }
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
    mutationFn: async (selected: boolean) => {
      if (isAuthenticated) {
        return CartAPI.selectAllItems(selected);
      } else {
        const cart = GuestCartService.selectAllItems(selected);
        return { cart };
      }
    },
    onSuccess: (data: CartResponse) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      }
      if (data?.cart) {
        useCartStore.getState().setCartData(data.cart);
        try {
          const updatedAt = (data.cart as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString();
          localStorage.setItem('cart-local-updatedAt', updatedAt);
        } catch (e) {
          // Ignore localStorage errors
          console.warn('Failed to save cart updatedAt', e);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to select all items:', error);
    },
  });

  const createOrder = useMutation({
    mutationFn: (payload: CreateOrderPayload) => CartAPI.createOrder(payload),
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
