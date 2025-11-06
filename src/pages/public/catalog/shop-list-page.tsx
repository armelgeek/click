import { useNavigate } from 'react-router';
import StoreCard from '@/components/icons/store-card';
import { Label } from '@/shared/components/ui/label';
import { Box, Gem, MapPin } from 'lucide-react';
import CategoryIcon from '@/components/atoms/category-icon';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/shared/components/ui/select';
import { ShopListPageSkeleton } from '@/components/atoms/shop-list-skeleton';
import { SearchBarWithSuggestions } from '@/components/molecules/search-bar-with-suggestions';
import { HorizontalScrollContainer } from '@/components/molecules/horizontal-scroll-container';
import { useState, useEffect, useRef } from 'react';
import { CatalogAPI } from '@/app/catalog/api/catalog-api';
import { Store, Category } from '@/app/catalog/types';
import { InfiniteScrollList } from '@/components/molecules/infinite-scroll-list';

export default function ShopListPage() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState<Store[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Categories state for infinite scroll
  const [categories, setCategories] = useState<Category[]>([]);
  const [catPage, setCatPage] = useState(1);
  const [catHasMore, setCatHasMore] = useState(true);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Load stores with pagination
  useEffect(() => {
    let mounted = true;
    const isFirstPage = page === 1;
    
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    CatalogAPI.getStores({ page, limit: 12, region: selectedRegion === 'all' ? undefined : selectedRegion })
      .then(res => {
        if (!mounted) return;
        const newStores = res.data;
        setStores(prev => page === 1 ? newStores : [...prev, ...newStores]);
        setHasMore(res.meta.page < res.meta.totalPages);
      })
      .catch(err => {
        if (mounted) setError('Erreur: ' + (err?.message || 'Chargement impossible'));
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { mounted = false; };
  }, [page, selectedRegion]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1);
      }
    }, { threshold: 0.5 });
    
    if (currentLoader) observer.observe(currentLoader);
    
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading, loadingMore]);

  // Reset pagination when region changes
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setPage(1);
    setStores([]);
    setHasMore(true);
  };

  // Fetch categories with pagination (simulate paginated API)
  useEffect(() => {
    let mounted = true;
    setCatLoading(true);
    setCatError(null);
    // Simulate paginated fetch: 8 per page
    CatalogAPI.getCategoriesByShop('gare-du-nord')
      .then(res => {
        if (!mounted) return;
        const allCats = res.categories;
        const pageSize = 8;
        const start = (catPage - 1) * pageSize;
        const end = start + pageSize;
        const newCats = allCats.slice(start, end);
        setCategories(prev => catPage === 1 ? newCats : [...prev, ...newCats]);
        setCatHasMore(end < allCats.length);
      })
      .catch(err => {
        if (mounted) setCatError('Erreur: ' + (err?.message || 'Chargement impossible'));
      })
      .finally(() => {
        if (mounted) setCatLoading(false);
      });
    return () => { mounted = false; };
  }, [catPage]);

  if (loading && page === 1) {
    return <ShopListPageSkeleton />;
  }

  if (error && stores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const nearbyStores = stores.filter(shop => shop.status === 'ACTIVATED').slice(0, 5);
  const otherStores = stores;

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <SearchBarWithSuggestions />
      <Label icon={<Box className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mb-2">
        Catégorie des produits populaires
      </Label>
      <div className="mb-4">
        <InfiniteScrollList
          items={categories}
          renderItem={(cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="cursor-pointer"
            >
              <CategoryIcon label={cat.name} />
            </div>
          )}
          onLoadMore={() => setCatPage(p => p + 1)}
          hasMore={catHasMore}
          isLoading={catLoading}
          gridCols={4}
          emptyComponent={catError ? <div className="text-red-500 text-center w-full py-4">{catError}</div> : <div className="text-gray-500 text-center w-full py-4">Aucune catégorie trouvée</div>}
          keyExtractor={(cat) => cat.id}
        />
      </div>
      <Label icon={<Gem className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mb-2">
        Les magasins Vapostore près de vous!
      </Label>
      {nearbyStores.length === 0 ? (
        <div className="text-gray-500 text-center w-full py-8 bg-gray-50/50 rounded-xl">
          Aucun magasin à proximité pour le moment.
        </div>
      ) : (
        <HorizontalScrollContainer className="-mx-2 px-2">
          {nearbyStores.map(store => (
            <div
              key={store.id}
              className="min-w-[200px] snap-start cursor-pointer"
              onClick={() => navigate(`/shop/${store.id}`)}
            >
              <StoreCard name={store.name} image={store.logoUrl || '/icons/store.svg'} />
            </div>
          ))}
        </HorizontalScrollContainer>
      )}
      <Label icon={<MapPin className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mt-4 mb-2">
        Autres magasins
      </Label>
      <div className="flex gap-4 mb-2">
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger variant='search'>
            <SelectValue placeholder="Choisissez la région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="idf">Île-de-France</SelectItem>
            <SelectItem value="sud">Sud-Ouest</SelectItem>
            <SelectItem value="casablanca">Casablanca</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3  gap-6">
        {otherStores.length === 0 && !loading ? (
          <div className="col-span-full text-gray-500 text-center w-full py-8 bg-gray-50/50 rounded-xl">
            Aucun autre magasin disponible pour le moment.
          </div>
        ) : (
          otherStores.map(store => (
            <div
              key={store.id}
              onClick={() => navigate(`/shop/${store.id}`)}
              className="transform hover:scale-[1.02] transition-transform duration-200"
            >
              <StoreCard name={store.name} image={store.logoUrl || '/icons/store.svg'} />
            </div>
          ))
        )}
      </div>
      {hasMore && !loading && (
        <div ref={loaderRef} className="flex justify-center py-6">
          <span className="w-8 h-8 rounded-full border-2 border-vapo-purple-primary border-t-transparent animate-spin inline-block"></span>
        </div>
      )}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <span className="text-gray-500 text-sm">Chargement...</span>
        </div>
      )}
    </div>
  );
}