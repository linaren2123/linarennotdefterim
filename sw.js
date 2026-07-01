const CACHE_NAME = "linaren-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./linaren.ico",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install Event - Pre-cache essential app shell assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("LinareN: App shell assets pre-cached.");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("LinareN: Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-while-revalidate for local assets, network-first with cache-fallback for external APIs/CDNs
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests and chrome-extension requests
  if (e.request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Handle local assets
  const isLocalAsset = url.origin === self.location.origin;

  if (isLocalAsset) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((cachedResponse) => {
          const fetchPromise = fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback
            return cachedResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else {
    // External assets (Google Fonts, Lucide icons, etc.) - Cache first / network fallback
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache but fetch fresh in background to update
          fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          // If network fails and not in cache
          return new Response("Çevrimdışı bağlantı hatası.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        });
      })
    );
  }
});
