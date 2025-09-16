import Typography from '../atoms/Typography';
import IconButton from '../atoms/IconButton';
import BellIcon from '../icons/BellIcon';
import CartIcon from '../icons/CartIcon';
import MenuIcon from '../icons/MenuIcon';

export default function VapoHeader() {
    return (
        <header className="w-full">
            <div className="bg-vapo-purple-primary text-white text-center py-2 px-4">
                <Typography variant="caption" className="text-white">
                    « Le vapotage est une transition vers une vie sans tabac puis sans dépendance à la nicotine. Ne vapotez pas si vous ne fumez pas. »
                </Typography>
            </div>
            <div className="bg-gray-800 flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <img src="/icons/vapo-logo-white.svg" alt="VapoStore Logo"  />
                </div>
                <div className="flex items-center gap-1">
                    <IconButton notification aria-label="Notifications">
                        <BellIcon className="text-white" />
                    </IconButton>
                    <IconButton aria-label="Panier">
                        <CartIcon className="text-white" />
                    </IconButton>
                    <IconButton aria-label="Menu">
                        <MenuIcon className="text-white" />
                    </IconButton>
                </div>
            </div>
        </header>
    );
}
