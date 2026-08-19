const VERSION = 'ningxia-tourism-v2';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

self.addEventListener('install', (event) => {
  const scope = self.registration.scope;
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll([scope, `${scope}index.html`, `${scope}manifest.webmanifest`, `${scope}favicon.svg`]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const isSameOrigin = (request) => new URL(request.url).origin === self.location.origin;
const isMapData = (request) => new URL(request.url).pathname.endsWith('.json');

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) || (fallback ? caches.match(fallback) : Response.error());
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !isSameOrigin(request)) return;

  const scope = self.registration.scope;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, `${scope}index.html`));
    return;
  }

  if (isMapData(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        void caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    })),
  );
});
