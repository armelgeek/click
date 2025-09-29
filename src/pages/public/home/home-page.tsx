import { Input } from '@/shared/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select';
import StoreCard from '@/components/molecules/store-card';

import { Label } from '@/shared/components/ui/label';

export function HomePage() {
    return (
        <div className="min-h-screen  text-white px-4 py-4 flex flex-col gap-6">
            <Input
                placeholder="Rechercher des produits ou magasin"
                variant="search"
                rightIcon={<SearchIcon className="text-vapo-purple-primary" />}
            />

            <div className="flex items-center gap-2 mb-2">
                <Label icon={<img src='/icons/diamon.svg' className="text-vapo-purple-primary w-6 h-6" />} className="text-vapo-purple-primary text-md font-bold">
                    Les magasins Vapostore près de vous!
                </Label>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <StoreCard name="Gare du Nord" image={`/icons/store.svg`} />
                <StoreCard name="Avranches" image={`/icons/store.svg`}  />
                
            </div>

            <div className="flex items-center gap-2 mb-2 mt-4">
                <img src='/icons/map.svg' className="text-vapo-purple-primary w-6 h-6" />
                <span className="text-vapo-purple-primary text-xl font-bold">Autres magasins</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
                <Select>
                    <SelectTrigger variant='search'>
                        <SelectValue placeholder="Rechercher par magasin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gare">Gare du Nord</SelectItem>
                        <SelectItem value="plaisance">Plaisance</SelectItem>
                        <SelectItem value="lafayette">La Fayette</SelectItem>
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
                {['Agneaux', 'Avranches', 'Dieppe', 'Casablanca', 'Bordeaux', 'Buxerolles', 'Pessac', 'Royan', 'Le Bouscat'].map((name) => (
                    <StoreCard key={name} name={name}  image={`/icons/store.svg`} />
                ))}
            </div>
        </div>
    );
}