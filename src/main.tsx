import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use correct base path for service worker
    const swPath = import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL}sw.js` : '/sw.js';
    let hasReloadedForUpdate = false;

    navigator.serviceWorker
      .register(swPath)
      .then(registration => {
        // Ask browser to check if a newer service worker exists.
        registration.update();

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hasReloadedForUpdate) return;
      hasReloadedForUpdate = true;
      window.location.reload();
    });
  });
}
