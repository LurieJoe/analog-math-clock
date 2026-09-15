const CACHE_NAME = "equation-clock-v37";
const APP_SHELL = [
  "./",
  "./index.html",
  "./theme.js",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./site.css",
  "./faq/",
  "./privacy/",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
const CACHEABLE_PATHS = new Set(APP_SHELL.map((url) => new URL(url, self.location.href).pathname));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" })))
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request, { cache: "no-store" });
        const requestUrl = new URL(event.request.url);
        if (
          response &&
          response.status === 200 &&
          CACHEABLE_PATHS.has(requestUrl.pathname) &&
          !response.headers.get("Cache-Control")?.includes("no-store")
        ) {
          const cache = await caches.open(CACHE_NAME);
          const copy = response.clone();
          await cache.put(event.request, copy);
        }
        return response;
      } catch {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          const fallback = await caches.match("./index.html");
          if (fallback) return fallback;
        }
        return Response.error();
      }
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
