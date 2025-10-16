import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Typography from '@/components/atoms/typography';
import CartItem from '@/components/molecules/cart-item';
import { useCartStore } from '../store';
import { formatPrice } from '@/lib/utils';
import { useNavigate } from 'react-router';

export function CartDrawer() {
  const navigate = useNavigate();
  const { items, total, isOpen, closeCart } = useCartStore();
  const { removeItem, updateItemQuantity } = useCartStore();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-[90%] sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mon Panier
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <Typography>Votre panier est vide</Typography>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onQuantityChange={(quantity) => updateItemQuantity(item.id, quantity)}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <Typography>Total</Typography>
              <Typography className="font-bold">{formatPrice(total)}</Typography>
            </div>
            <Button onClick={handleCheckout} className="w-full">
              Commander
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}