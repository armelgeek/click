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
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-vapo-purple-primary transition-colors">
      <div className="w-24 h-24 relative rounded-md overflow-hidden bg-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className="object-contain w-full h-full p-2"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="h3" className="font-medium text-lg">
              {item.name}
            </Typography>
            <Typography className="text-vapo-purple-primary font-semibold text-lg">
              {formatPrice(item.price)}
            </Typography>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="h-8 w-8 p-0 rounded-full"
          >
            -
          </Button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleIncrement}
            className="h-8 w-8 p-0 rounded-full"
          >
            +
          </Button>
          <div className="ml-auto font-medium text-lg">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}