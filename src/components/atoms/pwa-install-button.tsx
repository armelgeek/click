import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'icon' | 'button' | 'banner';
}

export default function PWAInstallButton({ 
  className = '', 
  variant = 'icon' 
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;
    
    setIsInstalled(isInstalled);

    if (!isInstalled) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-vapo-purple-primary text-white p-3 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Installer ClickNVape</p>
            <p className="text-xs opacity-90">Accès rapide et notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleInstallClick}
            className="bg-white text-vapo-purple-primary hover:bg-gray-100"
          >
            Installer
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleInstallClick}
        variant="vapo"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
      >
        <Download className="w-4 h-4" />
        Installer l'app
      </Button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      className={`p-2 hover:bg-white/20 rounded-full transition-colors ${className}`}
      aria-label="Installer l'application"
      title="Installer VapoStore sur votre appareil"
    >
      <Download className="w-5 h-5 text-white" />
    </button>
  );
}