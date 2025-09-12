import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    <main className="app-container">
      <header>
        <img src="/vite.svg" alt="Vite Logo" width={64} height={64} />
        <h1>VapoStore</h1>
        <p>Votre starter React + Vite PWA</p>
      </header>
      <section>
        <button className="primary-btn">Découvrir</button>
        <p className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </p>
      </section>
      <footer>
        <small>
          PWA Ready • <a href="https://vite-pwa-org.netlify.app/" target="_blank" rel="noopener noreferrer">Doc vite-plugin-pwa</a>
        </small>
      </footer>
    </main>
  );
}

export default App;
