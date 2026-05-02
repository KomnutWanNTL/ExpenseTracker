import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use correct base path for service worker
    const swPath = import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL}sw.js` : '/sw.js';
    navigator.serviceWorker.register(swPath).catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
