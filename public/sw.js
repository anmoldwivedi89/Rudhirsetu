const CACHE_NAME = 'rudhirsetu-v1';

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activated');
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Pass-through strategy - just needed to pass the PWA install criteria
  e.respondWith(fetch(e.request).catch(() => new Response('Offline working...')));
});
