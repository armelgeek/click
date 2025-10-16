import { PropsWithChildren, useEffect } from 'react';
import { useCart } from '../hooks/use-cart';
import { useCartStore } from '../store';

export function CartProvider({ children }: PropsWithChildren) {
  const { cart } = useCart();
  const setCartData = useCartStore((state) => state.setCartData);

  useEffect(() => {
    if (cart) {
      setCartData(cart);
    }
  }, [cart, setCartData]);

  return <>{children}</>;
}