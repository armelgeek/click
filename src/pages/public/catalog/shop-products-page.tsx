import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import ProductCard from '@/components/molecules/product-card';
import Typography from '@/components/atoms/typography';
import { Button } from '@/shared/components/ui/button';
import { useShop, useShopCategories, useShopProducts } from '@/app/catalog/hooks/use-catalog';
import { ShopProductsPageSkeleton } from '@/components/atoms/shop-products-skeleton';
import { ProductCardSkeleton } from '@/components/atoms/skeleton';

export default function ShopProductsPage() {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const { shop, loading: shopLoading, error: shopError } = useShop(shopId);
  const { categories, loading: categoriesLoading, error: categoriesError } = useShopCategories(shopId);
  const { products, loading: productsLoading, error: productsError } = useShopProducts(shopId, selectedCategoryId);

  if (shopLoading || categoriesLoading) {
    return <ShopProductsPageSkeleton />;
  }

  if (shopError || categoriesError || productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          Erreur: {shopError || categoriesError || productsError}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Magasin non trouvé</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen  flex flex-col">
      <main className="flex-1 w-full mb-4">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Typography variant="subtitle" className="text-vapo-purple-primary font-semibold text-lg">
            {shop.name}
          </Typography>
          <Button variant="link" className="text-gray-500 text-sm underline px-0" onClick={() => navigate(-1)}>
            Retour à la liste
          </Button>
        </div>
        <div className="rounded-xl border border-vapo-purple-primary/10 shadow-sm mt-2 p-4 mx-3">
          {/**<Typography variant="body" className="font-semibold py-4">Catégories</Typography>
          <div className="flex justify-between my-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`cursor-pointer transition-opacity ${
                  selectedCategoryId && selectedCategoryId !== cat.id ? 'opacity-50' : 'opacity-100'
                } ${
                  selectedCategoryId === cat.id ? 'ring-2 ring-vapo-purple-primary rounded-lg' : ''
                }`}
              >
                <CategoryIcon label={cat.name} />
              </div>
            ))}
          </div>**/}
          
          <div className="flex items-center justify-between mt-4 py-4">
            <Typography variant="body" className="font-semibold">
              Produits {selectedCategoryId ? `- ${categories.find(c => c.id === selectedCategoryId)?.name}` : ''}
            </Typography>
            {selectedCategoryId && (
              <Button 
                variant="link" 
                className="text-vapo-purple-primary text-sm px-0"
                onClick={() => setSelectedCategoryId(undefined)}
              >
                Voir tout
              </Button>
            )}
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-3 gap-4 my-4">
                {Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun produit trouvé pour cette sélection
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 my-4">
              {products.map((p) => (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{cursor:'pointer'}}>
                  <ProductCard 
                    image={p.image} 
                    title={p.name} 
                    subtitle={typeof p.price === 'number' ? p.price.toFixed(2) + ' €' : '—'} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
