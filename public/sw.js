// Service Worker for Push Notifications - Vithal AI PWA
const CACHE_NAME = 'vithal-ai-v7-ui-polish';

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
    ])
  );
});

// Handle push notifications from server
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let notificationData = {
    title: 'Vithal AI Study Room',
    body: 'You have a new message',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'room-notification',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    data: {},
    actions: [
      { action: 'open', title: 'Open Room' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        tag: data.tag || notificationData.tag,
        data: data.data || {},
      };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      try {
        notificationData.body = event.data.text();
      } catch (e2) {
        console.error('[SW] Error reading push data as text:', e2);
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate,
      data: notificationData.data,
      actions: notificationData.actions,
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        const url = event.notification.data?.url || '/';
        return self.clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event);
});

// Handle messages from the main app (for local notifications when app is open)
self.addEventListener('message', (event) => {
  console.log('[SW] Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon, url } = event.data;
    
    self.registration.showNotification(title, {
      body,
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: tag || 'room-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { url: url || '/' }
    });
  }
  
  // Handle SKIP_WAITING message from workbox
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle push subscription request
  if (event.data && event.data.type === 'GET_PUSH_SUBSCRIPTION') {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then((subscription) => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ subscription });
        }
      })
    );
  }
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed:', event);
  // The subscription was changed externally, notify the app
  event.waitUntil(
    self.clients.matchAll().then((clientsList) => {
      clientsList.forEach((client) => {
        client.postMessage({
          type: 'PUSH_SUBSCRIPTION_CHANGED',
        });
      });
    })
  );
});

// Fetch event - for offline support
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API calls
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    return;
  }
  
  // Network first strategy for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }
});
