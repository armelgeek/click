import { Label } from '@/shared/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/components/molecules/cart-item';
import { Button } from '@/shared/components/ui/button';
import ProductCard from '@/components/molecules/product-card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useNavigate } from 'react-router';
import { useCart, useCartMutations } from '@/app/cart';

const relatedProducts = Array.from({ length: 3 }).map((_, i) => ({
    id: i + 10,
    name: 'Blue Devil By Avap 50ml',
    price: 25.90,
    image: "/icons/product.png"
}));

export default function CartPage() {
    const navigate = useNavigate();
    const { cart, isLoading, error } = useCart();
    const {
        selectAllItems,
        toggleItemSelection,
        incrementQuantity,
        decrementQuantity,
        createOrder,
        isUpdatingCart,
        isCreatingOrder,
    } = useCartMutations();

    const handleSelectAll = (checked: boolean) => {
        selectAllItems.mutate(checked);
    };

    const handleSelect = (itemId: string) => {
        const item = cart?.items.find(item => item.id === itemId);
        if (item) {
            toggleItemSelection(itemId, item.selected);
        }
    };

    const handleIncrement = (itemId: string) => {
        const item = cart?.items.find(item => item.id === itemId);
        if (item) {
            incrementQuantity(itemId, item.quantity);
        }
    };

    const handleDecrement = (itemId: string) => {
        const item = cart?.items.find(item => item.id === itemId);
        if (item) {
            decrementQuantity(itemId, item.quantity);
        }
    };

    const handleCheckout = () => {
        if (!cart) return;
        
        createOrder.mutate(
            {
                cartId: cart.id,
                deliveryAddress: '123 Rue de la Paix, 75001 Paris',
                paymentMethod: 'card',
                notes: 'Livraison rapide',
            },
            {
                onSuccess: (response) => {
                    navigate(`/order-success/${response.order.id}`);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement du panier...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Erreur lors du chargement du panier</div>
            </div>
        );
    }

    const hasSelectedItems = cart?.items.some(item => item.selected) || false;
    const allItemsSelected = cart?.items.every(item => item.selected) || false;

    return (
        <div className="min-h-screen  flex flex-col gap-6 p-4">

            <div className="flex items-center justify-between">
                <Label icon={<ShoppingCart className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-lg font-semibold mb-2">
                    Panier
                </Label>
                <Button variant="link" className="text-gray-500 text-sm underline px-0" onClick={() => navigate(-1)}>
                    Retour à la liste
                </Button>
            </div>

            {!cart || cart.items.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center">
                    <div className="text-gray-500 text-lg mb-4">Votre panier est vide</div>
                    <Button variant="vapo" onClick={() => navigate('/shops')}>
                        Continuer mes achats
                    </Button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <Checkbox
                                checked={allItemsSelected}
                                onCheckedChange={handleSelectAll}
                                className="w-8 h-8 rounded-lg bg-gray-200 data-[state=checked]:bg-vapo-purple-primary border-none flex items-center justify-center"
                                aria-label="Sélectionner tous les articles"
                                disabled={isUpdatingCart}
                            />
                            <span className="text-lg font-medium">Tous sélectionner</span>
                        </div>
                        {cart.items.map(item => (
                            <CartItem
                                key={item.id}
                                image={item.image}
                                title={item.name}
                                subtitle={item.price.toFixed(2) + ' €'}
                                quantity={item.quantity}
                                selected={item.selected}
                                onSelect={() => handleSelect(item.id)}
                                onIncrement={() => handleIncrement(item.id)}
                                onDecrement={() => handleDecrement(item.id)}
                                className="border-b border-gray-100 last:border-none"
                            />
                        ))}
                        <div className="flex justify-end items-center mt-2 text-lg font-bold">
                            Total&nbsp;<span className="text-2xl">{cart.total.toFixed(2)} €</span>
                        </div>
                    </div>
                    
                    <Button 
                        variant="vapo" 
                        className="w-full h-14 text-lg font-semibold mt-2"
                        onClick={handleCheckout}
                        disabled={!hasSelectedItems || isCreatingOrder}
                    >
                        {isCreatingOrder ? 'Traitement en cours...' : 'Effectuer ma commande'}
                    </Button>
                </>
            )}

            <div className="bg-white rounded-2xl p-6 mt-2">
                <div className="text-lg font-semibold mb-4">D'autres produits qui peuvent vous intéresser !</div>
                <div className="flex gap-4">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} image={p.image} title={p.name} subtitle={p.price.toFixed(2) + ' €'} />
                    ))}
                </div>
            </div>
        </div>
    );
}