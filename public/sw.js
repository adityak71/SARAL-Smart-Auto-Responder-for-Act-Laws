/**
 * SARAL Progressive Web App (PWA) Service Worker
 * Ensures offline shell availability and satisfies browser installability criteria.
 */

const CACHE_NAME = "saral-pwa-v1";
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install: Pre-cache core app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("PWA pre-cache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up older cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first strategy with cache fallback for pages and static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never intercept non-GET, API routes, or Firebase/external requests
  if (
    request.method !== "GET" ||
    request.url.includes("/api/") ||
    request.url.includes("firestore.googleapis.com") ||
    request.url.includes("identitytoolkit.googleapis.com") ||
    request.url.includes("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for internal GET requests
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback to cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If HTML navigation request fails while offline, serve root shell
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
      })
  );
});