import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import { Provider } from './provider';
import NetworkStatusBanner from './components/atoms/network-status-banner';
import PWAInstallButton from './components/atoms/pwa-install-button';
import AgeWarningModal from './components/organisms/age-warning-modal';
import { ToastContainer } from './components/atoms/toast-container';
const router = createBrowserRouter(routes);
function App() {
  const [, setIsOnline] = useState(navigator.onLine);
  const [ageAccepted, setAgeAccepted] = useState(() => {
    return localStorage.getItem('ageAccepted') === 'true';
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ageAccepted', 'true');
    setAgeAccepted(true);
  };
  const handleQuit = () => {
    if (window.close && window.top === window.self) {
      window.close();
    }
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;"><h2 style="color:#9333ea;font-family:sans-serif;">Accès refusé</h2></div>';
  };

  return (
    <Provider>
      <NetworkStatusBanner />
      <PWAInstallButton variant="banner" />
      <AgeWarningModal open={!ageAccepted} onAccept={handleAccept} onQuit={handleQuit} />
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
