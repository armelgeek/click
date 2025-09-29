
import { useSession, signOut } from '@/shared/config/auth.config';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  const { data: session } = useSession();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-label="Fermer le menu"
      />
      <div className="fixed left-1/2 top-1/5 z-50 -translate-x-1/2 flex justify-center w-1/4 pointer-events-none">
        <div
          className="relative bg-neutral-900 shadow-2xl p-8 flex flex-col items-center w-full pointer-events-auto border border-gray-700 rounded-xl"
          onClick={e => e.stopPropagation()}
        >
         
          <button
            className="absolute top-3 right-3 text-white text-2xl hover:text-vapo-purple-primary transition-colors"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            &times;
          </button>
          {session ? (
            <>
              <nav className="flex flex-col items-center gap-6 text-white text-xl font-light text-center mb-8">
                <button type="button" className="text-left text-white hover:text-vapo-purple-primary transition-colors" onClick={() => { navigate('/profile/home'); onClose(); }}>Mon compte</button>
                <button type="button" className="text-left text-white hover:text-vapo-purple-primary transition-colors" onClick={() => { navigate('/products'); onClose(); }}>Les boutiques</button>
                <button type="button" className="text-left text-white hover:text-vapo-purple-primary transition-colors" onClick={() => { navigate('/orders/history'); onClose(); }}>Mes commandes</button>
                <button type="button" className="text-left text-white hover:text-vapo-purple-primary transition-colors" onClick={() => { navigate('/settings'); onClose(); }}>Mes adresses</button>
                <button type="button" className="text-left text-white hover:text-vapo-purple-primary transition-colors" onClick={() => { navigate('/about'); onClose(); }}>A propos</button>
              </nav>
              <Button variant="vapo" className="w-full h-12 mt-2 text-md" onClick={() => { signOut(); onClose(); }}>
                Se déconnecter
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-4 w-full">
                 <img
                    src="/icons/vapo-logo-white.svg"
                    alt="VapoStore Logo"
                    className="mb-6 object-contain"
                />
              <Button  onClick={() => { navigate('/login'); onClose(); }} variant="secondary" className="w-full h-12 text-lg">
                Se connecter
              </Button>
              <Button   onClick={() => { navigate('/register'); onClose(); }} variant="vapo" className="w-full h-12 text-lg border-white text-white">
                Créer un compte
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
