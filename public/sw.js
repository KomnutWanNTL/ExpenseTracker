// Service worker tuned for PWA updates: prefer fresh network, keep cache as fallback.
const CACHE_NAME = 'expense-tracker-cache-v2';
const BASE_PATH = new URL(self.registration.scope).pathname;
const URLS_TO_CACHE = [
  `${BASE_PATH}`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}favicon.svg`,
  `${BASE_PATH}icons/icon-192.png`,
  `${BASE_PATH}icons/icon-512.png`,
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
        );
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
