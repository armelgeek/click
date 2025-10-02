import { useSession, signOut } from '@/shared/config/auth.config';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '@/shared/components/ui/button';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const { success } = useToast();
  const location = useLocation();

  if (!open) return null;

  const isActivePath = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/profile/home', label: 'Mon compte' },
    { path: '/products', label: 'Les boutiques' },
    { path: '/orders/history', label: 'Mes commandes' },
    { path: '/settings', label: 'Mes adresses' },
    { path: '/about', label: 'A propos' }
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-label="Fermer le menu"
      />
      <div className="fixed left-1/2 top-1/5 z-50 -translate-x-1/2 flex justify-center pointer-events-none">
        <div
          className="relative bg-neutral-900 shadow-2xl p-8 px-12 flex flex-col items-center w-full pointer-events-auto border border-gray-700 rounded-xl"
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
                {menuItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    className={`relative text-left transition-all px-4 py-2 rounded-lg min-w-[200px] ${
                      isActivePath(item.path)
                        ? 'bg-vapo-purple-primary text-white font-semibold shadow-lg'
                        : 'text-white hover:text-vapo-purple-primary hover:bg-neutral-800'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                  >
                   
                    <span className={isActivePath(item.path) ? 'ml-3' : ''}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
              
              <Button
                variant="vapo"
                className="w-full h-12 mt-2 text-base"
                onClick={() => {
                  signOut();
                  success('Déconnexion réussie !');
                  onClose();
                }}
              >
                Se déconnecter
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <img
                src="/icons/vapo-logo-white.png"
                alt="VapoStore Logo"
                className="mb-6"
                width={240}
              />
              <Button
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
                variant="secondary"
                className="w-full h-12 text-lg"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
                variant="vapo"
                className="w-full h-12 text-lg border-white text-white"
              >
                Créer un compte
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}