import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/molecules/product-card';
import Typography from '@/components/atoms/typography';
import { Button } from '@/shared/components/ui/button';
import { useShop, useShopCategories } from '@/app/catalog/hooks/use-catalog';
import { CatalogAPI, PaginatedProductsResponse } from '@/app/catalog/api/catalog-api';
import type { Product } from '@/app/catalog/types';
import { ShopProductsPageSkeleton } from '@/components/atoms/shop-products-skeleton';
import { InfiniteScrollList } from '@/components/molecules/infinite-scroll-list';
import { ProductCardSkeleton } from '@/components/atoms/skeleton';

export default function ShopProductsPage() {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { shop, loading: shopLoading, error: shopError } = useShop(shopId);
  const { categories, loading: categoriesLoading, error: categoriesError } = useShopCategories(shopId);

  // Reset products when shop or category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setTotalPages(1);
  }, [shopId, selectedCategoryId]);

  // Fetch products page by page
  useEffect(() => {
    if (!shopId) return;
    const fetchProducts = async () => {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      try {
        const res: PaginatedProductsResponse = await CatalogAPI.getStoreProducts(shopId, {
          page,
          limit: 12,
          // Optionally: search, categoryId
        });
        setProducts(prev => page === 1 ? res.data : [...prev, ...res.data]);
        setTotalPages(res.totalPages || 1);
      } catch (e) {
        // Optionally: set error
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };
    fetchProducts();
  }, [shopId, selectedCategoryId, page]);

  const hasMoreProducts = page < totalPages && !isLoading && !isLoadingMore;
  const loadMoreProducts = () => {
    if (!isLoading && !isLoadingMore && page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (shopLoading || categoriesLoading) {
    return <ShopProductsPageSkeleton />;
  }

  if (shopError || categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          Erreur: {shopError || categoriesError}
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
          
          {isLoading && products.length === 0 ? (
            <div className="grid grid-cols-3 gap-4 my-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <InfiniteScrollList
              items={products}
              renderItem={(product) => (
                <div onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                  <ProductCard
                    image={product.image}
                    title={product.name}
                    subtitle={typeof product.price === 'number' ? product.price.toFixed(2) + ' €' : '—'}
                    stock={product.quantity}
                  />
                </div>
              )}
              onLoadMore={loadMoreProducts}
              hasMore={hasMoreProducts}
              isLoading={isLoadingMore}
              gridCols={3}
              keyExtractor={(product) => product.id}
              emptyComponent={
                <div className="text-center py-8 text-gray-500">
                  Aucun produit trouvé pour cette sélection
                </div>
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
