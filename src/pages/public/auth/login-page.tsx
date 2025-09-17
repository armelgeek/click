import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-8">
            <img src="/logo/vapo-logo-2.svg" alt="VapoStore" className="h-12 mb-6" />
            <h1 className="text-2xl font-semibold text-center mb-6">Connexion</h1>
            <form className="w-full max-w-sm flex flex-col gap-4">
                <Input placeholder="Email" type="email" />
                <Input placeholder="Mot de passe" type="password" />
                <Button variant="vapo" type="submit" className="mt-2">Connexion</Button>
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
                Vous n’avez pas de compte ?{' '}
                <a href="/register" className="text-black font-medium underline">S’inscrire</a>
            </div>
        </div>
    );
}