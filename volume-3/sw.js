// Service worker básico — cache de arquivos estáticos
const CACHE_NAME = 'pmm-v3-cache-v1';
const FILES_TO_CACHE = [
  '/volume-3/index.html',
  '/volume-3/styles.css',
  '/volume-3/app.js',
  '/volume-3/caderno-celular.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
