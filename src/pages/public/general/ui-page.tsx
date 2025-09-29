import VapoHeader from '@/components/organisms/vapo-header';
import VapoFooter from '@/components/organisms/vapo-footer';
import CategoryIcon from '@/components/atoms/category-icon';
import ProductCard from '@/components/molecules/product-card';
import CartItem from '@/components/molecules/cart-item';
import StoreCard from '@/components/molecules/store-card';
import { Input } from '@/shared/components/ui/input';
import { Info, SearchIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
export function UiPage() {
    return (
        <>
            <VapoHeader />
            <div className="flex flex-row gap-3 py-2 px-3">
                <CategoryIcon label="E-Liquides" />
            </div>
            <div className="grid grid-cols-3 gap-3 py-2 px-3">
                <ProductCard
                    image="/icons/product.png"
                    title="Blue  Devil By Avap 50ml"
                    subtitle="25.90 €"
                />
                <ProductCard
                    image="/icons/product.png"
                    title="Blue  Devil By Avap 50ml"
                    subtitle="25.90 €"
                />
                <ProductCard
                    image="/icons/product.png"
                    title="Blue  Devil By Avap 50ml"
                    subtitle="25.90 €"
                />
                <ProductCard
                    image="/icons/product.png"
                    title="Blue  Devil By Avap 50ml"
                    subtitle="25.90 €"
                />
            </div>

            <div className="flex flex-col justify-center gap-2 py-4 px-3">
                <CartItem
                    image="/icons/product.png"
                    title="Blue Devil By Avap 50ml"
                    subtitle="25.90 €"
                    quantity={2}
                    selected={true}
                    onSelect={() => { }}
                    onIncrement={() => { }}
                    onDecrement={() => { }}
                />
                <CartItem
                    image="/icons/product.png"
                    title="Red Devil By Avap 50ml"
                    subtitle="25.90 €"
                    quantity={1}
                    selected={false}
                    onSelect={() => { }}
                    onIncrement={() => { }}
                    onDecrement={() => { }}
                />
            </div>
            <div className="flex flex-row gap-3 justify-center py-4">
                <StoreCard name="Gare du Nord" image="/icons/store.svg" className="" />
                <StoreCard name="Gare du Nord" image="/icons/store.svg" className="" />
                <StoreCard name="Gare du Nord" image="/icons/store.svg" className="" />
            </div>
            <div className="flex flex-row gap-3 justify-center py-2 px-4">
                <Input placeholder="Rechercher des produits ou magasin" variant='search' rightIcon={<SearchIcon className='text-vapo-purple-primary' />} />

            </div>

            <div className="flex flex-row gap-3 justify-center py-2 px-4">

                <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Choix 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Choix 2</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-row gap-3 justify-center py-2 px-4">

                <Select>
                    <SelectTrigger variant='search'>
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center px-5 gap-2 py-3">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex flex-row items-center px-5 gap-2 py-3">
                <Button variant='vapo' className='flex-1'>Accepter</Button>
                <Button variant='vapo-secondary' className='flex-1'>Annuler</Button>

            </div>
            <div className="flex flex-col gap-4 px-5 py-4">
                <Label icon={<Info className="text-gray-400" />}>Label avec icône</Label>
                <Label
                    icon={<Info className="text-vapo-purple-primary" />}
                    className='text-base text-vapo-purple-primary font-medium'
                    link={<a href="#" className="flex items-center gap-1 text-sm text-gray-500 hover:underline">Lien</a>}
                >
                    Label avec icône et lien
                </Label>
            </div>

            {/**{isAuthenticated && session ? (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <div className="card">
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        </div>
      ) : (
        <p>Please sign in.</p>
      )}
      <button onClick={() => socialSignIn('google')}>Sign in with Google</button>
      <button onClick={() => socialSignIn('facebook')}>Sign in with Facebook</button>
      <button onClick={() => socialSignIn('twitter')}>Sign in with X</button>
      **/}
            <VapoFooter />
        </>
    )
}