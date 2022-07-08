const cacheName = "PWA-calc";
const filesToCache = [
  "index.html",
  "manifest.json",
  "assets/style.css",
  "assets/script.js",
  "assets/icons/android-chrome-192x192.png",
  "assets/icons/android-chrome-512x512.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/favicon-16x16.png",
  "assets/icons/favicon-32x32.png",
  "assets/icons/favicon.ico",
];

self.addEventListener("install", (e) =>
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  )
);

self.addEventListener("fetch", (e) =>
  e.respondWith(
    caches
      .match(e.request)
      .then((cachedResponse) => cachedResponse || fetch(e.request))
  )
);
