import { useCartStore } from '../store';
import { useCartMutations } from './use-cart';
import { AddToCartPayloadExtended } from '../api/cart-api';

export function useCartActions() {
  const { addToCart, updateCartItem, removeFromCart, clearCart } = useCartMutations();
  const cartStore = useCartStore();

  const handleAddToCart = async (payload: AddToCartPayloadExtended) => {
    try {
      const { cart } = await addToCart.mutateAsync(payload);
      cartStore.setCartData(cart);
      cartStore.openCart();
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { cart } = await updateCartItem.mutateAsync({
        itemId,
        payload: { quantity }
      });
      cartStore.setCartData(cart);
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return false;
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const { cart } = await removeFromCart.mutateAsync(itemId);
      cartStore.setCartData(cart);
      return true;
    } catch (error) {
      console.error('Failed to remove item:', error);
      return false;
    }
  };

  const handleClearCart = async () => {
    try {
      const { cart } = await clearCart.mutateAsync();
      cartStore.setCartData(cart);
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return false;
    }
  };

  return {
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    isAddingToCart: addToCart.isPending,
    isUpdatingCart: updateCartItem.isPending,
    isRemovingFromCart: removeFromCart.isPending,
    isClearingCart: clearCart.isPending
  };
}