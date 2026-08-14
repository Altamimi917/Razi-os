const APP_URL='./';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : 'Razi reminder' };
  }

  const title = data.title || 'Razi OS';
  const options = {
    body: data.body || 'You have a reminder.',
    tag: data.tag || 'razi-reminder',
    renotify: false,
    data: { url: data.url || APP_URL },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || APP_URL;
  event.waitUntil((async () => {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        try { await client.navigate(url); } catch (e) {}
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});
