import Typography from '../atoms/typography';
import { Link } from 'react-router';
export default function VapoFooter() {
  return (
    <footer className="bg-gray-800 py-8 w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 text-center text-white">
        <Link to="/contact" className="w-full">
          <Typography variant="body" className="text-center hover:underline cursor-pointer">Contact</Typography>
        </Link>
        <Link to="/privacy" className="w-full">
          <Typography variant="body" className="text-center hover:underline cursor-pointer">Politique de Confidentialité</Typography>
        </Link>
        <Link to="/terms" className="w-full">
          <Typography variant="body" className="text-center hover:underline cursor-pointer">Conditions d’Utilisation</Typography>
        </Link>
      </div>
    </footer>
  );
}
