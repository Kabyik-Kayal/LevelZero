const CACHE_VERSION = 'levelzero-cache-v3';
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
            .then(cache => cache.addAll(APP_SHELL.map(asset => new Request(asset, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        const previousKeys = keys.filter(key => key !== CACHE_VERSION);

        await Promise.all(previousKeys.map(key => caches.delete(key)));
        await self.clients.claim();

        if (previousKeys.length > 0) {
            const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            await Promise.all(clients.map(client => {
                try {
                    const clientUrl = new URL(client.url);
                    if (clientUrl.origin === self.location.origin) {
                        return client.navigate(client.url);
                    }
                } catch (err) {
                    console.warn('[SW] Failed to refresh client:', err);
                }
                return Promise.resolve();
            }));
        }
    })());
});

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_VERSION);

        try {
            const response = await fetch(request);
            if (response && response.ok && response.type !== 'opaque') {
                cache.put(request, response.clone());
            }
            return response;
        } catch (err) {
            const cached = await caches.match(request);
            if (cached) return cached;

            if (request.mode === 'navigate') {
                const shell = await caches.match('./index.html');
                if (shell) return shell;
            }

            throw err;
        }
    })());
});
