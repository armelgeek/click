import { useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Boxes, Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import ProductCard from '@/components/molecules/product-card';
import { useNavigate } from 'react-router';
import { useCartMutations } from '@/app/cart';

const product = {
    id: 'prod-1',
    name: 'Blue Devil By Avap 50ml',
    price: 25.90,
    image: "/icons/product.png",
    description: 'Description du produit : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut malesuada orci. Quisque at turpis vel odio fermentum ultricies non sit amet eros. Vivamus vehicula dapibus arcu a cursus.'
};

const relatedProducts = Array.from({ length: 3 }).map((_, i) => ({
    id: `prod-${i + 2}`,
    name: 'Blue Devil By Avap 50ml',
    price: 25.90,
    image: "/icons/product.png"
}));

export default function ProductDetailPage() {
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();
    const { addToCart, isAddingToCart } = useCartMutations();

    const handleAddToCart = () => {
        addToCart.mutate(
            {
                productId: product.id,
                quantity: qty,
            },
            {
                onSuccess: () => {
                    navigate('/cart');
                },
                onError: (error) => {
                    console.error('Failed to add to cart:', error);
                },
            }
        );
    };
    return (
        <div className="min-h-screen flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <Label icon={<Boxes className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-lg font-semibold">
                    Détails du produit
                </Label>
                <Button variant="link" className="text-gray-500 text-sm underline px-0" onClick={() => navigate(-1)}>
                    Retour à la liste
                </Button>
            </div>
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
                <div className="bg-gray-100 rounded-xl flex items-center justify-center min-h-[260px]">
                    <img src={product.image} alt={product.name} className="h-56 object-contain" />
                </div>
                <div className="text-3xl font-bold mb-2">{product.price.toFixed(2)} €</div>
                <div className="text-xl font-semibold mb-1">{product.name}</div>
                <div className="text-gray-700 mb-2">{product.description}</div>
                <div className="flex items-center gap-2 mb-2">
                    <Button 
                        variant="vapo" 
                        size="icon" 
                        onClick={() => setQty(q => Math.max(1, q - 1))} 
                        className='rounded-full'
                        disabled={isAddingToCart}
                    >
                        <Minus />
                    </Button>
                    <span className="text-lg font-semibold w-6 text-center">{qty}</span>
                    <Button 
                        variant="vapo" 
                        size="icon" 
                        className='rounded-full' 
                        onClick={() => setQty(q => q + 1)}
                        disabled={isAddingToCart}
                    >
                        <Plus />
                    </Button>
                    <Button 
                        variant="vapo" 
                        className="flex-1 h-10 ml-4"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                    >
                        {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
                    </Button>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4 mt-2">
                <div className="text-md font-semibold mb-4">D’autres produits qui peuvent vous intéresser !</div>
                <div className="flex gap-4">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} image={p.image} title={p.name} subtitle={p.price.toFixed(2) + ' €'} />
                    ))}
                </div>
            </div>
        </div>
    );
}
