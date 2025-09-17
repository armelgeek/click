import { Checkbox } from '@/shared/components/ui/checkbox';

interface CartItemProps {
    image: string;
    title: string;
    subtitle: string;
    quantity: number;
    selected?: boolean;
    onSelect?: () => void;
    onIncrement?: () => void;
    onDecrement?: () => void;
    className?: string;
}

export default function CartItem({
    image,
    title,
    subtitle,
    quantity,
    onSelect,
    onIncrement,
    onDecrement,
    className = '',
}: CartItemProps) {
    return (
        <div className={`flex gap-4 w-full flex-1 py-3 ${className}`}>
            <div className='flex flex-col justify-center'>
                <Checkbox
                    onCheckedChange={onSelect}
                    className="w-8 h-8 rounded-lg bg-gray-200 data-[state=checked]:bg-vapo-purple-primary border-none flex items-center justify-center"
                    aria-label="Sélectionner l'article"
                />
            </div>
            <div className="bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img src={image} alt={title} className="object-contain h-24" />
            </div>


            <div className="flex flex-col justify-between">
                <div className="text-black text-lg font-medium truncate">{title}</div>
                <div className='flex flex-row justify-between'>
                    <div>
                        <span className="text-black font-extrabold text-lg mt-1">{subtitle}</span>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-xl text-gray-700 hover:bg-gray-200"
                            aria-label="Diminuer la quantité"
                            onClick={onDecrement}
                        >
                            –
                        </button>
                        <span className="w-6 text-center text-medium font-medium">{quantity}</span>
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-xl text-gray-700 hover:bg-gray-200"
                            aria-label="Augmenter la quantité"
                            onClick={onIncrement}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}