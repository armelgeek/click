import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select';
import StoreCard from '@/components/icons/store-card';
import { useNavigate } from 'react-router';
import { Label } from '@/shared/components/ui/label';
import { useShops } from '@/app/catalog/hooks/use-catalog';
import { HomePageSkeleton } from '@/components/atoms/home-skeleton';
import { SearchBarWithSuggestions } from '@/components/molecules/search-bar-with-suggestions';
import { InfiniteScrollList } from '@/components/molecules/infinite-scroll-list';
import { HorizontalScrollContainer } from '@/components/molecules/horizontal-scroll-container';
import { useState, useEffect, useRef } from 'react';
import { CatalogAPI } from '@/app/catalog/api/catalog-api';
export  function HomePage() {
    const { shops, loading, error } = useShops();
    const navigate = useNavigate();
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    const nearbyStores = shops.slice(0, 5);
    const hasMoreNearby = nearbyStores.length > 5;

    // Paginated state for 'other stores'
    const [otherStores, setOtherStores] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMoreStores, setHasMoreStores] = useState(true);
    const [loadingStores, setLoadingStores] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [errorStores, setErrorStores] = useState<string | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // Reset and fetch on filter change
    useEffect(() => {
        setOtherStores([]);
        setPage(1);
        setHasMoreStores(true);
    }, [selectedStore, selectedRegion]);

    // Fetch paginated 'other stores'
    useEffect(() => {
        let mounted = true;
        if (!hasMoreStores) return;
        if (page === 1) setLoadingStores(true);
        else setLoadingMore(true);
        setErrorStores(null);
        CatalogAPI.getStores({
            page,
            limit: 12,
            region: selectedRegion && selectedRegion !== 'all' ? selectedRegion : undefined,
            search: selectedStore && selectedStore !== 'all' ? selectedStore : undefined,
        })
            .then(res => {
                if (!mounted) return;
                // Only keep non-nearby stores
                const filtered = res.data.filter(store => !store.isNearby);
                setOtherStores(prev => page === 1 ? filtered : [...prev, ...filtered]);
                setHasMoreStores(res.meta.page < res.meta.totalPages);
            })
            .catch(err => {
                if (mounted) setErrorStores('Erreur: ' + (err?.message || 'Chargement impossible'));
            })
            .finally(() => {
                if (mounted) {
                    setLoadingStores(false);
                    setLoadingMore(false);
                }
            });
        return () => { mounted = false; };
    }, [page, selectedStore, selectedRegion]);

    // Infinite scroll load more
    useEffect(() => {
        if (!hasMoreStores || loadingStores || loadingMore) return;
        const currentLoader = loaderRef.current;
        const observer = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1);
            }
        }, { threshold: 0.5 });
        if (currentLoader) observer.observe(currentLoader);
        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMoreStores, loadingStores, loadingMore]);

    if (loading) {
        return <HomePageSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Erreur: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white px-4 py-2 flex flex-col gap-6 font-inter">
            <SearchBarWithSuggestions />

            <div className="flex items-center gap-2 mb-2">
                <Label icon={<img src='/icons/diamon.svg' className="text-vapo-purple-primary w-6 h-6" />} className="text-vapo-purple-primary font-bold text-md">
                    Les magasins Vapostore près de vous!
                </Label>
            </div>

            {nearbyStores.length === 0 ? (
                <div className="col-span-3 text-center text-gray-400 py-8">Aucun magasin à proximité pour le moment.</div>
            ) : (
                <>
                    <HorizontalScrollContainer className="-mx-2 px-2">
                        {nearbyStores.map(store => (
                            <div
                                key={store.id}
                                className="min-w-[120px] snap-start cursor-pointer"
                                onClick={() => navigate(`/shop/${store.id}`)}
                            >
                                <StoreCard name={store.name} image={store.image || '/icons/store.svg'} />
                            </div>
                        ))}
                    </HorizontalScrollContainer>
                    {hasMoreNearby && (
                        <div className="flex justify-end mt-2">
                            <button
                                className="text-vapo-purple-primary font-semibold hover:underline text-sm px-2"
                                onClick={() => navigate('/catalog/shop-list')}
                            >
                                Voir plus
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="flex items-center gap-2 mb-2">
                 <Label icon={<img src='/icons/map.svg' className="text-vapo-purple-primary w-6 h-6" />} className="text-vapo-purple-primary font-bold text-md">
                    Autres magasins
                </Label>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger variant='search'>
                        <SelectValue placeholder="Rechercher par magasin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les magasins</SelectItem>
                        {shops.filter(shop => !shop.isNearby).slice(0, 10).map((store) => (
                            <SelectItem key={store.id} value={store.id} className='uppercase'>{store.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger  variant='search'>
                        <SelectValue placeholder="Choisissez la région" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les régions</SelectItem>
                        <SelectItem value="paris">Paris</SelectItem>
                        <SelectItem value="bordeaux">Bordeaux</SelectItem>
                        <SelectItem value="casablanca">Casablanca</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {otherStores.length === 0 && !loadingStores ? (
                    <div className="col-span-3 text-center text-gray-400 py-8">
                        Aucun autre magasin disponible.
                    </div>
                ) : (
                    otherStores.map((store) => (
                        <button
                            key={store.id}
                            className="focus:outline-none w-full"
                            onClick={() => navigate(`/shop/${store.id}`)}
                        >
                            <StoreCard name={store.name} image={store.image || `/icons/store.svg`} />
                        </button>
                    ))
                )}
            </div>
            {hasMoreStores && !loadingStores && (
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