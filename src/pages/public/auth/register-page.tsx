
import RegisterForm from '@/app/auth/components/register-form';
import { useSocialAuth } from '@/app/auth/hooks/use-social-auth';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { Link } from 'react-router';


export function RegisterPage() {
    const { loading, signInWithProvider: handleSocial } = useSocialAuth();
    return (
        <div className="min-h-screen flex py-12 flex-col items-center justify-center bg-white px-8">
            <img src="/logo/vapo-logo-2.svg" alt="VapoStore" className="h-12 mb-6" />
            <h1 className="text-2xl font-semibold text-center mb-6">Inscription</h1>
            <RegisterForm />
            <div className="flex items-center gap-2 w-full max-w-sm my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <LoadingSpinner size={56} />
                </div>
            )}
            <div className="flex flex-row items-center justify-center gap-6 mb-6">
                <button type="button" onClick={() => handleSocial('google')} aria-label="Google" className=""><img src="/icons/google.svg" alt="Google" className="w-8 h-8" /></button>
                <button type="button" onClick={() => handleSocial('facebook')} aria-label="Facebook" className=""><img src="/icons/facebook.svg" alt="Facebook" className="w-8 h-8" /></button>
                <button type="button" onClick={() => handleSocial('x')} aria-label="X" className=""><img src="/icons/x.svg" alt="X" className="w-8 h-8" /></button>
            </div>
            <div className="text-center text-gray-500 text-sm">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-black font-medium underline">Se connecter</Link>
            </div>
        </div>
    );
}