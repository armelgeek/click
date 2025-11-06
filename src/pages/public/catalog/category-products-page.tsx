import { useNavigate, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/molecules/product-card';
import Typography from '@/components/atoms/typography';
import { Button } from '@/shared/components/ui/button';
import { CategoriesAPI } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { InfiniteScrollList } from '@/components/molecules/infinite-scroll-list';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function CategoryProductsPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => CategoriesAPI.getCategoryById(categoryId!),
    enabled: !!categoryId,
  });

  // Paginated state for products
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingRef = useRef(false); // ✅ Protection contre les appels multiples
  
  const hasMore = currentPage < totalPages;

  // Reset when category changes
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    isLoadingRef.current = false;
  }, [categoryId]);

  // Fetch paginated products
  useEffect(() => {
    if (!categoryId) return;
    if (isLoadingRef.current) return; // ✅ Empêche les appels pendant le chargement

    const fetchProducts = async () => {
      isLoadingRef.current = true; // ✅ Verrouille
      
      if (currentPage === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const response = await CategoriesAPI.getProductsByCategory(categoryId, {
          page: currentPage,
          limit: 12
        });

        console.log('API Response:', {
          currentPage,
          totalPages: response.totalPages,
          newItemsCount: response.data.length,
        });

        // Update products
        setProducts(prev => {
          const updatedProducts = currentPage === 1 
            ? response.data 
            : [...prev, ...response.data];
          return updatedProducts;
        });

        // Update pagination info
        setTotalPages(response.totalPages || 1);

      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isLoadingRef.current = false; // ✅ Déverrouille
      }
    };

    fetchProducts();
  }, [categoryId, currentPage]);

  // Handler pour le chargement de la page suivante
  const handleLoadMore = () => {
    if (!isLoadingRef.current && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Typography variant="subtitle" className="text-vapo-purple-primary font-semibold text-lg">
              {category?.name || 'Catégorie'}
            </Typography>
            {category?.description && (
              <Typography variant="body" className="text-sm text-gray-500 mt-1">
                {category.description}
              </Typography>
            )}
          </div>
        </div>

        {/* Products Grid with Infinite Scroll */}
        <InfiniteScrollList
          items={products}
          renderItem={(product) => (
            <button
              key={product.id}
              className="focus:outline-none w-full text-left"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <ProductCard
                image={product.image || '/icons/product.png'}
                title={product.name}
                subtitle={typeof product.price === 'number' ? product.price.toFixed(2) + ' €' : '—'}
              />
            </button>
          )}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading || isLoadingMore}
          gridCols={3}
          emptyComponent={
            <div className="flex flex-col items-center justify-center py-12">
              <Typography variant="subtitle" className="text-gray-500 mb-2">
                Aucun produit dans cette catégorie
              </Typography>
              <Typography variant="body" className="text-sm text-gray-400 mb-4">
                Revenez plus tard pour découvrir nos nouveautés
              </Typography>
              <Button onClick={() => navigate('/shops')} variant="outline">
                Voir tous les magasins
              </Button>
            </div>
          }
          keyExtractor={(product) => product.id}
        />
      </main>
    </div>
  );
}