import { Input } from '@/shared/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select';
import StoreCard from '@/components/molecules/store-card';
import { useNavigate } from 'react-router';
import { Label } from '@/shared/components/ui/label';
import { useShops } from '@/app/catalog/hooks/use-catalog';
export function HomePage() {
    const { shops, loading, error } = useShops();
    const navigate = useNavigate();

    const nearbyStores = shops.filter(shop => shop.isNearby);
    const otherStores = shops.filter(shop => !shop.isNearby);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-vapo-purple-primary">Chargement des magasins...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Erreur: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white px-4 py-4 flex flex-col gap-6 font-inter">
            <Input
                placeholder="Rechercher des produits ou magasin"
                variant="search"
                rightIcon={<SearchIcon className="text-vapo-purple-primary" />}
            />

            <div className="flex items-center gap-2 mb-2">
                <Label icon={<img src='/icons/diamon.svg' className="text-vapo-purple-primary w-6 h-6" />} className="text-vapo-purple-primary font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Les magasins Vapostore près de vous!
                </Label>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {nearbyStores.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-400 py-8">Aucun magasin à proximité pour le moment.</div>
                ) : (
                    nearbyStores.map((store) => (
                        <button
                            key={store.id}
                            className="focus:outline-none"
                            onClick={() => navigate(`/shop/${store.id}`)}
                        >
                            <StoreCard name={store.name} image={store.image || `/icons/store.svg`} />
                        </button>
                    ))
                )}
            </div>

            <div className="flex items-center gap-2 mb-2 mt-4">
                 <Label icon={<img src='/icons/map.svg' className="text-vapo-purple-primary w-6 h-6" />} className="text-vapo-purple-primary font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Autres magasins
                </Label>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
                <Select>
                    <SelectTrigger variant='search'>
                        <SelectValue placeholder="Rechercher par magasin" />
                    </SelectTrigger>
                    <SelectContent>
                        {otherStores.slice(0, 5).map((store) => (
                            <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger  variant='search'>
                        <SelectValue placeholder="Choisissez la région" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paris">Paris</SelectItem>
                        <SelectItem value="bordeaux">Bordeaux</SelectItem>
                        <SelectItem value="casablanca">Casablanca</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {otherStores.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-400 py-8">Aucun autre magasin disponible.</div>
                ) : (
                    otherStores.map((store) => (
                        <button
                            key={store.id}
                            className="focus:outline-none"
                            onClick={() => navigate(`/shop/${store.id}`)}
                        >
                            <StoreCard name={store.name} image={store.image || `/icons/store.svg`} />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}