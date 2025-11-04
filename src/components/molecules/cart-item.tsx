import { Button } from '@/shared/components/ui/button';
import { CartItem as CartItemType } from '@/app/cart/types';
import Typography from '@/components/atoms/typography';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

export default function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const handleIncrement = () => {
    onQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-white rounded-xl shadow-sm">
      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-1 justify-center min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-base truncate">{item.name}</span>
        </div>
        <div className="font-bold text-xl mt-1">{formatPrice(item.price)}</div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        {item.quantity > 1 ? (
          <Button
            size="icon"
            variant="outline"
            onClick={handleDecrement}
            className="h-7 w-7 p-0 rounded-full"
          >
            -
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            onClick={onRemove}
            className="h-7 w-7 p-0 rounded-full"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          size="icon"
          variant="outline"
          onClick={handleIncrement}
          className="h-7 w-7 p-0 rounded-full"
        >
          +
        </Button>
      </div>
      <button
        onClick={onRemove}
        className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-2"
        aria-label="Supprimer l'article"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}