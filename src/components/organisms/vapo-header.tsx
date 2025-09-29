import Typography from '../atoms/typography';
import IconButton from '../atoms/icon-button';
import BellIcon from '../icons/bell-icon';
//import CartIcon from '../icons/CartIcon';
import MenuIcon from '../icons/menu-icon';
import CloseIcon from '../icons/close-icon';
import PWAInstallButton from '../atoms/pwa-install-button';
import { useState } from 'react';
import SideMenu from './side-menu';
import { Link } from 'react-router';
export default function VapoHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className="w-full relative">
            <div className="bg-vapo-purple-primary text-white text-center py-2 px-4">
                <Typography variant="caption" className="text-white">
                    « Ne vapotez pas si vous ne fumez pas. »
                </Typography>
            </div>
            <div className="bg-gray-800 flex items-center justify-between px-4 py-3">
                <Link className="flex items-center cursor-pointer" to={'/'}  >
                    <img src="/icons/vapo-logo-white.svg" alt="VapoStore Logo"  />
                </Link>
                <div className="flex items-center gap-1">
                    <PWAInstallButton variant="icon" />
                    <IconButton notification aria-label="Notifications">
                        <BellIcon className="text-white" />
                    </IconButton>
                    {/**<IconButton aria-label="Panier">
                        <CartIcon className="text-white" />
                    </IconButton>**/}
                    <IconButton
                        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        {menuOpen ? (
                            <CloseIcon className="text-white" />
                        ) : (
                            <MenuIcon className="text-white" />
                        )}
                    </IconButton>
                </div>
            </div>
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </header>
    );
}
