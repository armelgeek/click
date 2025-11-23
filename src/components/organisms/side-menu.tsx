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
    { path: '/shops', label: 'Boutiques' },
    { path: '/orders', label: 'Commandes' },
    { path: '/profile/addresses', label: 'Adresses' },
    { path: '/about', label: 'À propos' }
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-label="Fermer le menu"
      />
      <div className="fixed left-1/2 top-1/5 z-50 -translate-x-1/2 flex justify-center pointer-events-none w-full">
        <div
          className="relative bg-neutral-900 shadow-xl p-8 px-6 flex flex-col items-center w-full max-w-[400px] md:max-w-[400px] pointer-events-auto border border-gray-700 rounded-xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-white text-2xl hover:text-vapo-purple-primary"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            &times;
          </button>
          
          {session ? (
            <>
              <nav className="flex flex-col mt-3 items-center gap-3 text-white  font-light text-center mb-8 w-full">
                {menuItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    className={`w-full text-left px-5 py-2 rounded-lg  transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-vapo-purple-primary/30 text-white font-semibold shadow'
                        : 'text-white hover:text-vapo-purple-primary hover:bg-neutral-800'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <Button
                variant="vapo"
                className="w-full h-10 mt-2 text-base"
                onClick={() => {
                  signOut();
                  success('Déconnexion réussie !');
                  onClose();
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <img
                src="/icons/vapo-logo-white.png"
                alt="VapoStore Logo"
                className="mb-4"
                width={180}
              />
              <Button
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
                variant="secondary"
                className="w-full h-10 text-base"
              >
                Connexion
              </Button>
              <Button
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
                variant="vapo"
                className="w-full h-10 border-white text-white text-base"
              >
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}