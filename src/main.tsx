import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for push notifications in PWA mode
if ('serviceWorker' in navigator) {
  // Hard-refresh once when a new Service Worker takes control so updated
  // header/composer styles always appear in preview and production.
  let hasReloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return;
    hasReloaded = true;
    console.log('[SW] Controller changed - reloading for fresh UI');
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      // Register the custom service worker for push notifications
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // Check for updates immediately so layout changes are picked up fast
      try { await registration.update(); } catch {}
      
      console.log('[SW] Service Worker registered successfully:', registration.scope);
      
      // Check if this is a PWA (standalone mode)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      
      if (isStandalone) {
        console.log('[PWA] Running in standalone mode - push notifications enabled');
      }
      
      // Update service worker if available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('[SW] New service worker activated');
            }
          });
        }
      });
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
