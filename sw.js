const CACHE_NAME = 'legal-assistant-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './logo.png',
    // تخزين المكتبات الخارجية لتسريع التحميل
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js',
    'https://cdn.jsdelivr.net/npm/idb-keyval@6/dist/umd.js'
];

// 1. حدث التثبيت (تخزين الملفات الأساسية)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[Service Worker] جاري تخزين الملفات الأساسية...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

// 2. حدث التفعيل (حذف الكاش القديم إن وجد تحديث)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. حدث الجلب (جلب الملفات من الكاش أو من الإنترنت)
self.addEventListener('fetch', (event) => {
    // استثناء طلبات الـ API (Groq و Google) من التخزين لتجنب تكرار نفس الإجابات
    if (event.request.url.includes('api.groq.com') || event.request.url.includes('googleapis.com')) {
        return; // السماح للطلب بالمرور للإنترنت مباشرة
    }

    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // إذا كان الملف موجوداً في الكاش، قم بإرجاعه
            if (response) {
                return response;
            }
            // إذا لم يكن موجوداً، قم بجلبه من الإنترنت
            return fetch(event.request).catch(() => {
                console.log('[Service Worker] فشل جلب المورد والإنترنت مقطوع.');
            });
        })
    );
});
