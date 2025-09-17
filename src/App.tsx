import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import { Provider } from './provider';
const router = createBrowserRouter(routes);
function App() {
  const [, setIsOnline] = useState(navigator.onLine);

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

  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
