// Service Worker for Push Notifications
const CACHE_NAME = 'vithal-ai-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Handle push notifications from server
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'Vithal AI Study Room',
    body: 'You have a new message',
    icon: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
    badge: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
    tag: 'room-notification',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
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
      console.error('Error parsing push data:', e);
      // Try as text
      try {
        notificationData.body = event.data.text();
      } catch (e2) {
        console.error('Error reading push data as text:', e2);
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle messages from the main app (for local notifications when app is open)
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon } = event.data;
    
    self.registration.showNotification(title, {
      body,
      icon: icon || '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
      badge: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
      tag: tag || 'room-notification',
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
    });
  }
  
  // Handle push subscription request
  if (event.data && event.data.type === 'GET_PUSH_SUBSCRIPTION') {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then((subscription) => {
        event.ports[0].postMessage({ subscription });
      })
    );
  }
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription changed:', event);
  // The subscription was changed externally, notify the app
  event.waitUntil(
    clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'PUSH_SUBSCRIPTION_CHANGED',
        });
      });
    })
  );
});
