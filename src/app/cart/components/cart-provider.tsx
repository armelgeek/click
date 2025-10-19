import { PropsWithChildren, useEffect } from 'react';
import { useCart } from '../hooks/use-cart';
import { useCartStore } from '../store';
import { Cart } from '../types';

export function CartProvider({ children }: PropsWithChildren) {
  const { cart } = useCart();
  const setCartData = useCartStore((state) => state.setCartData);
  const currentItemCount = useCartStore((s) => s.itemCount);
  const currentTotal = useCartStore((s) => s.total);

  useEffect(() => {
    if (!cart) return;

    // Only update the local store if the server cart differs from current store
    const server = cart as Cart;
    const serverItemCount = server.itemCount ?? 0;
    const serverTotal = server.total ?? 0;

    if (serverItemCount !== currentItemCount || serverTotal !== currentTotal) {
      setCartData(server);
    }
  }, [cart, setCartData, currentItemCount, currentTotal]);

  return <>{children}</>;
}