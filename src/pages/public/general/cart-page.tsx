import { Label } from '@/shared/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/components/molecules/cart-item';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import ProductCard from '@/components/molecules/product-card';
import { useNavigate } from 'react-router';
import { useCart, useCartMutations } from '@/app/cart';
import { useCartActions } from '@/app/cart/hooks/use-cart-actions';

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
        incrementQuantity,
        decrementQuantity,
        createOrder,
        isCreatingOrder,
    } = useCartMutations();
    const { removeFromCart } = useCartActions();

    const handleRemove = (itemId: string) => {
        if (window.confirm('Voulez-vous vraiment retirer cet article du panier ?')) {
            removeFromCart(itemId);
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

    const calculateSubtotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateShippingFee = () => {
        // Frais de livraison fixe pour l'instant
        return 4.99;
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
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                                Une erreur est survenue lors de la mise à jour du panier.
                                Veuillez réessayer.
                            </div>
                        )}
                        {cart.items.map(item => (
                            <CartItem
                                key={item.id}
                                item={{
                                    id: item.id,
                                    productId: item.productId,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    quantity: item.quantity,
                                    selected: item.selected
                                }}
                                onRemove={() => handleRemove(item.id)}
                                onQuantityChange={(quantity) => {
                                    if (quantity > item.quantity) {
                                        handleIncrement(item.id);
                                    } else {
                                        handleDecrement(item.id);
                                    }
                                }}
                            />
                        ))}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{formatPrice(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Frais de livraison</span>
                                <span>{formatPrice(calculateShippingFee())}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span className="text-2xl text-vapo-purple-primary">{formatPrice(calculateSubtotal() + calculateShippingFee())}</span>
                            </div>
                        </div>
                    </div>
                    
                    <Button 
                        variant="vapo" 
                        className="w-full h-14 text-lg font-semibold mt-4"
                        onClick={handleCheckout}
                        disabled={!hasSelectedItems || isCreatingOrder}
                    >
                        {isCreatingOrder ? (
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Traitement en cours...
                            </div>
                        ) : (
                            'Effectuer ma commande'
                        )}
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