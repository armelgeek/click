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
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="w-20 h-20 relative rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <Typography variant="h3" className="font-medium">
            {item.name}
          </Typography>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        <Typography className="text-gray-600">
          {formatPrice(item.price)}
        </Typography>

        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleIncrement}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}