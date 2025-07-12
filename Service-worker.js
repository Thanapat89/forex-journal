const CACHE_NAME = 'trading-journal-cache-v1';
const urlsToCache = [
  './', // Caches the root (index.html)
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js',
  // เพิ่ม Path ไปยังไอคอนของคุณที่นี่ (ถ้าอยู่ในโฟลเดอร์อื่น)
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install event: แคช Assets ที่จำเป็นทั้งหมด
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

// Fetch event: ให้บริการเนื้อหาที่แคชไว้เมื่อออฟไลน์หรือเพื่อความเร็ว
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ถ้ามีในแคช - ส่งคืน response จากแคช
        if (response) {
          return response;
        }
        // ถ้าไม่มีในแคช - ดึงจากเครือข่าย
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // คุณสามารถส่งคืนหน้าออฟไลน์แบบกำหนดเองได้ที่นี่หากต้องการ
        // ตัวอย่าง: return caches.match('/offline.html');
      })
  );
});

// Activate event: ล้างแคชเก่าๆ
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ลบแคชเก่าๆ
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
