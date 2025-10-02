import { useNavigate } from 'react-router';
import StoreCard from '@/components/molecules/store-card';
import { Label } from '@/shared/components/ui/label';
import { Box, Gem, MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import CategoryIcon from '@/components/atoms/category-icon';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/shared/components/ui/select';
import { Search } from 'lucide-react';
import { useShops } from '@/app/catalog/hooks/use-catalog';

export default function ShopListPage() {
  const navigate = useNavigate();
  const { shops, loading, error } = useShops();

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

  const nearbyStores = shops.filter(shop => shop.isNearby);
  const otherStores = shops.filter(shop => !shop.isNearby);
  return (
    <div className="min-h-screen  flex flex-col gap-4 p-4">
      <Input
        variant="search"
        placeholder="Rechercher des produits ou magasin"
        rightIcon={<Search/>}
      />
      <Label icon={<Box className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mb-2">
        Catégorie des produits populaires
      </Label>
      <div className="flex justify-between mb-4">
        {[
          { label: 'E-liquides', icon: <img src="/icons/e-liquide.svg" alt="E-liquides" className="w-10 h-10" /> },
          { label: 'DIY', icon: <img src="/icons/diy.svg" alt="DIY" className="w-10 h-10" /> },
          { label: 'E-cig', icon: <img src="/icons/e-cig.svg" alt="E-cig" className="w-10 h-10" /> },
          { label: 'Accessoires', icon: <img src="/icons/accessoire.svg" alt="Accessoires" className="w-10 h-10" /> },
        ].map((cat) => (
          <CategoryIcon key={cat.label}  label={cat.label} />
        ))}
      </div>
      <Label icon={<Gem className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mb-2">
        Les magasins Vapostore près de vous!
      </Label>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {nearbyStores.length === 0 ? (
          <div className="text-gray-400 text-center w-full py-8">Aucun magasin à proximité pour le moment.</div>
        ) : (
          nearbyStores.map(store => (
            <button
              key={store.id}
              className="min-w-[180px] focus:outline-none"
              style={{cursor:'pointer'}}
              onClick={() => navigate(`/shop/${store.id}`)}
            >
              <StoreCard name={store.name} />
            </button>
          ))
        )}
      </div>
      <Label icon={<MapPin className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-base font-semibold mt-4 mb-2">
        Autres magasins
      </Label>
      <div className="flex gap-4 mb-2">
        <Input
          variant="search"
          className="flex-1 rounded-xl px-4 py-3 text-sm"
          placeholder="Rechercher par magasin"
        />
        <Select>
          <SelectTrigger variant='search'>
            <SelectValue placeholder="Choisissez la région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="idf">Île-de-France</SelectItem>
            <SelectItem value="sud">Sud-Ouest</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {otherStores.length === 0 ? (
          <div className="col-span-3 text-gray-400 text-center py-8">Aucun autre magasin disponible.</div>
        ) : (
          otherStores.map(store => (
            <button
              key={store.id}
              className="focus:outline-none"
              style={{cursor:'pointer'}}
              onClick={() => navigate(`/shop/${store.id}`)}
            >
              <StoreCard name={store.name} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
