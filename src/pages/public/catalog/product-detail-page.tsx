import { useState, useEffect } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Boxes, Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate, useParams } from 'react-router';
import { useCartMutations } from '@/app/cart';
import { useProduct, useSimilarProducts } from '@/app/catalog/hooks/use-catalog-api';
import ProductCard from '@/components/molecules/product-card';
import { ProductDetailSkeleton } from '@/components/atoms/product-detail-skeleton';
import { toastService } from '@/hooks/use-toast';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const { product, loading, error } = useProduct(productId);
    const { products: similarProducts, loading: similarLoading } = useSimilarProducts(productId);
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();
    const { addToCart, isAddingToCart } = useCartMutations();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    if (loading) {
        return <ProductDetailSkeleton />;
    }
    if (error || !product) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Produit introuvable</div>;
    }

    const handleAddToCart = () => {
        addToCart.mutate(
            {
                productId: product.id,
                quantity: qty,
            },
            {
                onSuccess: () => {
                    toastService.addToast({
                        type: 'success',
                        message: `${product.name} a été ajouté au panier`,
                        duration: 3000
                    });
                },
                onError: (error) => {
                    toastService.addToast({
                        type: 'error',
                        message: 'Erreur lors de l\'ajout au panier',
                        duration: 3000
                    });
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
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
                <div className="bg-gray-50 rounded-xl flex items-center justify-center aspect-square max-h-[400px] p-8">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.currentTarget.src = '/icons/product.png'; }}
                    />
                </div>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-xl font-medium text-gray-900 mb-2">{product.name}</h1>
                    </div>
                    <div className="text-3xl font-bold text-vapo-purple-primary">
                        {product.price.toFixed(2)} €
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setQty(q => Math.max(1, q - 1))} 
                                className="h-8 w-8 rounded-full hover:bg-white"
                                disabled={isAddingToCart}
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg font-medium w-8 text-center">{qty}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-white"
                                onClick={() => setQty(q => q + 1)}
                                disabled={isAddingToCart}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button 
                            variant="vapo" 
                            className="flex-1 h-12 text-base font-medium"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Ajout en cours...
                                </div>
                            ) : (
                                'Ajouter au panier'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {similarProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 mt-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Vous pourriez aussi aimer</h2>
                        <button onClick={() => navigate('/catalog')} className="text-sm text-vapo-purple-primary hover:underline">
                            Voir plus
                        </button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
                        {similarLoading ? (
                            <div className="text-gray-500">Chargement des produits similaires...</div>
                        ) : (
                            similarProducts.map(p => (
                                <button
                                    key={p.id}
                                    className="focus:outline-none min-w-[150px]"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <ProductCard image={p.image || ''} title={p.name} subtitle={p.priceTTC.toFixed(2) + ' €'} />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
