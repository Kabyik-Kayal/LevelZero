const CACHE_VERSION = 'levelzero-cache-v2';
const APP_SHELL = [
    './',
    './index.html',
    './css/variables.css',
    './css/base.css',
    './css/components.css',
    './css/animations.css',
    './css/responsive.css',
    './js/app.js',
    './js/engine/GameEngine.js',
    './js/engine/SaveManager.js',
    './js/engine/EventBus.js',
    './js/engine/AIAgent.js',
    './js/data/starterPacks.js',
    './js/data/achievements.js',
    './js/data/shopItems.js',
    './js/data/titles.js',
    './js/data/dailyQuests.js',
    './js/modules/Settings.js',
    './js/modules/Character.js',
    './js/modules/Shop.js',
    './js/modules/Achievements.js',
    './js/modules/Activities.js',
    './js/components/Toast.js',
    './js/components/Modal.js',
    './js/components/IntroGuide.js',
    './js/components/Header.js',
    './js/components/Icons.js',
    './js/utils/escapeHTML.js',
    './assets/icon.png',
    './manifest.webmanifest'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys
                .filter(key => key !== CACHE_VERSION)
                .map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
                    return response;
                })
                .catch(async () => (await caches.match(request)) || caches.match('./index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;

            return fetch(request).then(response => {
                if (!response || response.status !== 200 || response.type === 'opaque') {
                    return response;
                }

                const copy = response.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
                return response;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
