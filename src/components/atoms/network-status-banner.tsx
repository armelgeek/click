import { useEffect, useState } from 'react';

export default function NetworkStatusBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] bg-red-600 text-white text-center py-2 shadow-lg animate-fade-in">
      <span>Vous êtes hors connexion. Certaines fonctionnalités peuvent être indisponibles.</span>
    </div>
  );
}
