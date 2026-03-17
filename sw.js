const cacheName = "task-app-v1"

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        "/",
        "/index.html"
      ])
    })
  )
})

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request)
    })
  )
})
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
});

self.addEventListener("push", function(event) {
  const data = event.data ? event.data.text() : "Reminder!";

  event.waitUntil(
    self.registration.showNotification("Task Reminder", {
      body: data,
      icon: "/icon.png"
    })
  );
});
