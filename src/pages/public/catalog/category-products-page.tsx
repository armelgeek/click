import { useNavigate, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/molecules/product-card';
import Typography from '@/components/atoms/typography';
import { Button } from '@/shared/components/ui/button';
import { ProductCardSkeleton } from '@/components/atoms/skeleton';
import { CategoriesAPI } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  
  const hasMore = currentPage < totalPages;

  // Reset when category changes
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
  }, [categoryId]);

  // Fetch paginated products
  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
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
          currentItemsCount: products.length
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
      }
    };

    fetchProducts();
  }, [categoryId, currentPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          console.log('Loading more products...', { currentPage, totalPages });
          setCurrentPage(prev => prev + 1);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(currentLoader);
    return () => observer.unobserve(currentLoader);
  }, [hasMore, isLoading, isLoadingMore, currentPage, totalPages]);

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

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
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
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
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {products.map(product => (
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
              ))}
            </div>

            {/* Loader for infinite scroll */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-6">
                <span className="w-8 h-8 rounded-full border-2 border-vapo-purple-primary border-t-transparent animate-spin inline-block"></span>
              </div>
            )}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <span className="text-gray-500 text-sm">Chargement...</span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
