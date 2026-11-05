// Carnet du salon — cache hors ligne (version 15)
const CACHE = "carnet-15";
const SHELL = ["./", "./index.html", "./thumbs.js", "./icon.png", "./icon512.png", "./logo.png", "./manifest.webmanifest"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  const same = u.origin === location.origin, fonts = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!same && !fonts) return; // l'API de synchro passe toujours par le réseau
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || (same ? caches.match("./index.html") : undefined))));
});
