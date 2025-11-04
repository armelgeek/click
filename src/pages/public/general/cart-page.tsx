import { Label } from '@/shared/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/components/molecules/cart-item';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import ProductCard from '@/components/molecules/product-card';
import { useNavigate, Link } from 'react-router';
import { useCart, useCartMutations } from '@/app/cart';
import { useRecommendedProducts } from '@/app/catalog/hooks/use-recommended-products';
import { CartItem as CartItemType } from '@/app/cart/types';

function RecommendedProducts({ cartItems }: { cartItems: CartItemType[] }) {
    const firstItem = cartItems[0];
    const { data: recommendedProducts, isLoading } = useRecommendedProducts(firstItem?.productId, !!firstItem);

    if (isLoading || !recommendedProducts?.length) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl p-6 mt-4">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Vous pourriez aussi aimer</h2>
            </div>
            <div
                className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-vapo-purple-primary scrollbar-track-gray-100 py-1 px-1"
                style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
                tabIndex={0}
                aria-label="Produits recommandés à faire défiler horizontalement"
            >
                {recommendedProducts.slice(0, 4).map((product) => (
                    <Link 
                        key={product.id} 
                        to={`/product/${product.id}`} 
                        className="no-underline block transform hover:scale-[1.02] transition-transform duration-200"
                    >
                        <ProductCard
                            image={product.image || '/icons/product-placeholder.png'}
                            title={product.name}
                            subtitle={`${product.priceTTC.toFixed(2)} €`}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
// import { useCartActions } from '@/app/cart/hooks/use-cart-actions';
import { CartPageSkeleton } from '@/components/atoms/cart-skeleton';

export default function CartPage() {
    const navigate = useNavigate();
    const { cart, isLoading, error } = useCart();
    const {
        incrementQuantity,
        decrementQuantity,
        createOrder,
        isCreatingOrder,
    } = useCartMutations();
    const { removeFromCart } = useCartMutations();

    const handleRemove = (itemId: string) => {
        if (window.confirm('Voulez-vous vraiment retirer cet article du panier ?')) {
            removeFromCart.mutate(itemId);
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
        return <CartPageSkeleton />;
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

            {cart && cart.items.length > 0 && <RecommendedProducts cartItems={cart.items} />}
        </div>
    );
}