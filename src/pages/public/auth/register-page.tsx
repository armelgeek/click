import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Link } from 'react-router';

export function RegisterPage() {
    return (
        <div className="min-h-screen flex py-12 flex-col items-center justify-center bg-white px-8">
            <img src="/logo/vapo-logo-2.svg" alt="VapoStore" className="h-12 mb-6" />
            <h1 className="text-2xl font-semibold text-center mb-6">Inscription</h1>
            <form className="w-full  flex flex-col gap-4">
                <Input placeholder="Nom" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Téléphone" type="tel" />
                <Input placeholder="Nouveau mot de passe" type="password" />
                <Input placeholder="Retapez le nouveau mot de passe" type="password" />
                <div className="flex items-center gap-2 mt-2">
                    <Checkbox id="all" />
                    <Label htmlFor="all">J'ai lu et accepte les <Link to="/terms" className="text-blue-500 underline">conditions d'utilisation</Link></Label>
                </div>
                <Button variant="vapo" type="submit" className="mt-2 h-10">Inscription</Button>
            </form>
            <div className="flex items-center gap-2 w-full max-w-sm my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex flex-row items-center justify-center gap-6 mb-6">
                <button type="button" aria-label="Google" className=""><img src="/icons/google.svg" alt="Google" className="w-8 h-8" /></button>
                <button type="button" aria-label="Facebook" className=""><img src="/icons/facebook.svg" alt="Facebook" className="w-8 h-8" /></button>
                <button type="button" aria-label="X" className=""><img src="/icons/x.svg" alt="X" className="w-8 h-8" /></button>
            </div>
            <div className="text-center text-gray-500 text-sm">
                Vous avez déjà un compte ?{' '}
                <a href="/login" className="text-black font-medium underline">Se connecter</a>
            </div>
        </div>
    );
}