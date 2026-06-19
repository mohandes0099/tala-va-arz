const CACHE_NAME = 'signal-v1';
const urlsToCache = [
    '.',
    'index.html',
    'manifest.json'
];

// نصب و کش کردن فایل‌ها
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
    );
});

// فعال‌سازی و پاکسازی کش قدیمی
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// پاسخ به درخواست‌ها (استراتژی Cache First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => {
                // اگر آفلاین بود و چیزی در کش نبود، می‌توان پیام داد
            });
        })
    );
});