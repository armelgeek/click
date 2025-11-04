import { useEffect, useState } from 'react';
import SplashScreen from './components/atoms/splash-screen';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import { Provider } from './provider';
import NetworkStatusBanner from './components/atoms/network-status-banner';
import AgeWarningModal from './components/organisms/age-warning-modal';
import { ToastContainer } from './components/atoms/toast-container';
import { CartProvider } from '@/app/cart';
const router = createBrowserRouter(routes);

function App() {
  const [, setIsOnline] = useState(navigator.onLine);
  const [ageAccepted, setAgeAccepted] = useState(() => {
    return localStorage.getItem('ageAccepted') === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Simulate DOM/content loading
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timeout);
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
  }

  return (
    <Provider>
      <CartProvider>
        <NetworkStatusBanner />
        <AgeWarningModal open={!ageAccepted} onAccept={handleAccept} onQuit={handleQuit} />
        <ToastContainer />
        <RouterProvider router={router} />
      </CartProvider>
    </Provider>
  );
}

export default App;
