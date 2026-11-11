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
  const title = data.title || '🔔 নতুন অ্যাপয়েন্টমেন্ট!';
  
  const options = {
    body: data.body || 'আপনার চেম্বারে একটি নতুন বুকিং এসেছে।',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [500, 200, 500, 200, 500], // দীর্ঘ ও শক্তিশালী ভাইব্রেশন প্যাটার্ন
    tag: 'dental-appointment-alert',
    renotify: true,
    requireInteraction: true, // ইউজার ক্লিক না করা পর্যন্ত নোটিফিকেশন স্ক্রিনে থাকবে
    silent: false, // নোটিফিকেশন যেন কোনোভাবেই সাইলেন্ট না হয়
    actions: [
      { action: 'open', title: 'ড্যাশবোর্ড খুলুন' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// নোটিফিকেশনে ক্লিক করলে সরাসরি এডমিন প্যানেল ওপেন হওয়ার লজিক
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/admin');
      }
    })
  );
});