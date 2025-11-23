import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/ui/carousel';

import { useState, useEffect } from 'react';
import { AddToCartSuccessModal } from '@/components/molecules/add-to-cart-success-modal';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/components/atoms/badge';
import { Boxes, Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate, useParams } from 'react-router';
import { useCartMutations } from '@/app/cart';
import { useProduct, useSimilarProducts, useStore } from '@/app/catalog/hooks/use-catalog-api';
import { useProductStock } from '@/app/catalog/hooks/use-product-stock';
import ProductCard from '@/components/molecules/product-card';
import { ProductDetailSkeleton } from '@/components/atoms/product-detail-skeleton';
import { toastService } from '@/hooks/use-toast';
import { HorizontalScrollContainer } from '@/components/molecules/horizontal-scroll-container';

function hasImagesAndOwner(product: unknown): product is { owner: string; images: string[]; name: string } {
    const obj = product as Record<string, unknown>;
    return (
        typeof product === 'object' &&
        product !== null &&
        'owner' in obj && typeof obj.owner === 'string' &&
        'images' in obj && Array.isArray(obj.images) && (obj.images as string[]).length > 1 &&
        'name' in obj && typeof obj.name === 'string'
    );
}
type ProductImageInfo = {
    image?: string;
    images?: string[];
    owner?: string;
};

function getProductMainImage(product: ProductImageInfo): string {
    let img = '';
    if (product.owner === 'VAPOSTORE' && Array.isArray(product.images) && product.images.length > 0) {
        img = product.images[0];
    } else {
        img = product.image || '';
    }
    // If not a valid URL, fallback to default icon
    if (!img || !(img.startsWith('http://') || img.startsWith('https://'))) {
        return '/icons/product.png';
    }
    return img;
}
export default function ProductDetailPage() {
    const { productId } = useParams();
    const { product, loading, error } = useProduct(productId);
    const { data: productStock } = useProductStock(productId);
    const { store: productStore } = useStore(product?.shopId);
    const { products: similarProducts, loading: similarLoading } = useSimilarProducts(productId);
    const [qty, setQty] = useState(1);
    const productQuantity = productStock?.quantity ?? product?.quantity ?? undefined;
    const outOfStock = typeof productQuantity === 'number' && productQuantity <= 0;
    const lowStock = typeof productQuantity === 'number' && productQuantity > 0 && productQuantity < 5; // <5 show warning
    const navigate = useNavigate();
    const { addToCart, isAddingToCart } = useCartMutations();
    const [showCartModal, setShowCartModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    useEffect(() => {
        if (typeof productQuantity === 'number' && qty > productQuantity) {
            setQty(productQuantity);
        }
    }, [productQuantity, qty]);

    // Refetch stock whenever we display the product (we rely on useProductStock hook refetch policy), but we also want to re-check on mount
    useEffect(() => {
        // This effect is intentionally left simple. UseProductStock already handles querying on productId changes.
    }, [productId]);

    if (loading) {
        return <ProductDetailSkeleton />;
    }
    if (error || !product) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Produit introuvable</div>;
    }

    const handleAddToCart = () => {
        // S'assurer que toutes les infos produit sont transmises pour le panier guest (LegacyProduct)
        // Ne pas ajouter si rupture de stock
        if (productQuantity === 0) {
            toastService.addToast({ type: 'error', message: 'Produit en rupture de stock', duration: 3000 });
            return;
        }
        if (typeof productQuantity === 'number' && qty > productQuantity) {
            toastService.addToast({ type: 'error', message: 'Quantité demandée supérieure au stock disponible', duration: 3000 });
            return;
        }
        addToCart.mutate(
            {
                productId: product.id,
                quantity: qty,
                name: product.name,
                price: typeof product.price === 'number' ? product.price : 0,
                image: product.image || '/icons/product.png',
                storeId: product.shopId || undefined,
            },
            {
                onSuccess: () => {
                    setShowCartModal(true);
                },
                onError: (error) => {
                    toastService.addToast({
                        type: 'error',
                        message: "Erreur lors de l'ajout au panier",
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
                    {hasImagesAndOwner(product) && product.owner !== 'VAPOSTORE' ? (
                        <Carousel className="w-full max-w-[400px]">
                            <CarouselContent>
                                {product.images.map((img: string, idx: number) => (
                                    <CarouselItem key={String(idx)}>
                                        <img
                                            src={typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://')) ? img : '/icons/product.png'}
                                            alt={product.name + ' ' + (idx + 1)}
                                            className="object-contain w-full h-full max-h-80 rounded-lg border"
                                            onError={(e) => { e.currentTarget.src = '/icons/product.png'; }}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    ) : (
                        <img
                            src={getProductMainImage(product)}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.src = '/icons/product.png'; }}
                        />
                    )}
                </div>
                <div className="space-y-4">
                    <div>
                        <div className='py-2'>
                            {hasImagesAndOwner(product) ? (
                                product.owner === 'VAPOSTORE' ? (
                                    <Badge className="text-xs text-vapo-purple-primary" variant="outline">VapoStore</Badge>
                                ) : (
                                    <Badge className="text-xs text-vapo-purple-primary"  variant="outline">Autre vendeur</Badge>
                                )
                            ) : product && product.shopId && productStore ? (
                                (productStore.name || '').toLowerCase().includes('vapo') ? (
                                    <Badge className="text-xs text-vapo-purple-primary" variant="outline">VapoStore</Badge>
                                ) : (
                                    <Badge className="text-xs text-vapo-purple-primary" variant="outline">Autre vendeur</Badge>
                                )
                            ) : null}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{product.price.toFixed(2)} €</div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h1>

                        </div>
                        <div className="text-gray-700 text-sm mb-3">
                            <span className="font-semibold">Description du produit :</span>
                            &nbsp;{product.description ? product.description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut malesuada orci. Quisque at turpis vel odio fermentum ultricies non sit amet eros. Vivamus vehicula dapibus arcu a cursus."}
                        </div>
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
                                onClick={() => setQty(q => Math.min((productQuantity ?? Infinity), q + 1))}
                                disabled={isAddingToCart || (typeof productQuantity === 'number' && qty >= productQuantity)}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            variant="vapo"
                            className="flex-1 h-12 text-base font-medium"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || outOfStock}
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
                        <AddToCartSuccessModal
                            isOpen={showCartModal}
                            onClose={() => setShowCartModal(false)}
                            onContinueShopping={() => { setShowCartModal(false); }}
                            onGoToCart={() => { setShowCartModal(false); navigate('/cart'); }}
                            productName={product.name}
                        />
                    </div>
                    {typeof productQuantity === 'number' && (
                        outOfStock ? (
                            <div className="mt-3 text-red-600 font-medium">Actuellement indisponible.</div>
                        ) : lowStock ? (
                            <div className="mt-3 text-yellow-600 font-medium">Il ne reste plus que {productQuantity} exemplaire(s) en stock.</div>
                        ) : (
                            <></>
                        )
                    )}
                </div>
            </div>

            {similarProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 mt-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Vous pourriez aussi aimer</h2>
                    </div>
                    {similarLoading ? (
                        <div className="text-gray-500">Chargement des produits similaires...</div>
                    ) : (
                        <HorizontalScrollContainer className="-mx-2 px-2">
                            {similarProducts.map(p => (
                                <div
                                    key={p.id}
                                    className="min-w-[140px] snap-start cursor-pointer"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <ProductCard
                                        image={p.owner === 'VAPOSTORE' ? (p.images?.[0] || '/icons/product.png') : (p.image || '/icons/product.png')}
                                        title={p.name}
                                        subtitle={p.priceTTC.toFixed(2) + ' €'}
                                        stock={p.quantity}
                                    />
                                </div>
                            ))}
                        </HorizontalScrollContainer>
                    )}
                </div>
            )}
        </div>
    );
}
