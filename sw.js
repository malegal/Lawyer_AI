const CACHE_NAME = 'egy-lawyer-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = e.request.url;
    
    // استثناء جميع واجهات برمجة التطبيقات (APIs) من الكاش لتعمل بشكل سليم
    if (url.includes('groq.com') || url.includes('openrouter.ai') || url.includes('googleapis.com') || url.includes('tavily.com')) {
        return; // يعتمد على الإنترنت مباشرة
    }

    // جلب باقي الملفات الأساسية والمكتبات من الكاش إن أمكن
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});
