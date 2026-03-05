self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : { title: 'New Notification', body: 'No message content' };
    } catch (e) {
        console.error('Error parsing push data:', e);
        data = { title: 'New Notification', body: 'Error parsing message' };
    }

    const options = {
        body: data.body || '',
        icon: data.icon || '/pwa-192x192.png',
        badge: data.badge || '/pwa-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
