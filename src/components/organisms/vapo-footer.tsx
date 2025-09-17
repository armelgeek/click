import Typography from '../atoms/typography';

export default function VapoFooter() {
  return (
    <footer className="bg-gray-800 py-8 w-full">
      <div className="flex flex-col items-center gap-4 text-white">
        <Typography variant="body" className="text-center">Contact</Typography>
        <Typography variant="body" className="text-center">Politique de Confidentialité</Typography>
        <Typography variant="body" className="text-center">Conditions d’Utilisation</Typography>
      </div>
    </footer>
  );
}
