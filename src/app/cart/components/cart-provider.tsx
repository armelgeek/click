import { PropsWithChildren, useEffect, useRef } from 'react';
import { useCart } from '../hooks/use-cart';
import { useCartStore } from '../store';
import { Cart } from '../types';
import { useSession } from '@/shared/config/auth.config';

export function CartProvider({ children }: PropsWithChildren) {
  const { data: session} = useSession();
  const { cart } = useCart(session?.user?.id || '');
  const lastSyncedCart = useRef<string | null>(null);

  useEffect(() => {
    if (!cart) return;

    // Create a stable identifier for the cart state
    const cartSignature = JSON.stringify({
      itemCount: cart.itemCount ?? 0,
      total: cart.total ?? 0,
      items: cart.items?.map(i => ({ id: i.id, quantity: i.quantity, selected: i.selected }))
    });

    if (lastSyncedCart.current !== cartSignature) {
      lastSyncedCart.current = cartSignature;
      useCartStore.getState().setCartData(cart as Cart);
    }
  }, [cart]); // ✅ Ne dépend que de cart

  return <>{children}</>;
}