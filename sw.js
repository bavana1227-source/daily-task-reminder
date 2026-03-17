const CACHE_NAME = "task-reminder-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// --- Install Service Worker and cache files ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// --- Fetch requests: serve cached first ---
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});

// --- Handle notification click ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Optional: focus the app if it’s open
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});

// --- Push notifications: show even when app is closed ---
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "You have a task reminder!";
  const options = {
    body: data,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    // You can add vibrate for mobile devices
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification("Task Reminder", options));
});
