// Service Worker for Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ব্যাকগ্রাউন্ডে পুশ নোটিফিকেশন রিসিভ করার লজিক
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'নতুন অ্যাপয়েন্টমেন্ট!';
  const options = {
    body: data.body || 'আপনার চেম্বারে একটি নতুন বুকিং এসেছে।',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// নোটিফিকেশনে ক্লিক করলে অ্যাপ ওপেন হওয়ার লজিক
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});