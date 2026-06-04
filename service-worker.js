/* ============================================================
   service-worker.js — PWA Service Worker + Firebase Push
   ============================================================ */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ── Firebase config (igual que en firebase-config.js) ────────────
firebase.initializeApp({
  apiKey:            "AIzaSyBK87kzAE09YKMOZ5CDq8A53wYlppdtB_Q",
  authDomain:        "vivir-mejor-f6377.firebaseapp.com",
  projectId:         "vivir-mejor-f6377",
  storageBucket:     "vivir-mejor-f6377.firebasestorage.app",
  messagingSenderId: "865823677864",
  appId:             "1:865823677864:web:b7350815828d24c5a7519d",
});

const messaging = firebase.messaging();

// ── Notificaciones en segundo plano (app cerrada) ─────────────────
messaging.onBackgroundMessage(payload => {
  console.log('📬 Notificación en background:', payload);
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon:  icon || '/vivir-mejor/assets/icon-192.png',
    badge: '/vivir-mejor/assets/icon-72.png',
    vibrate: [200, 100, 200],
    data:  payload.data || {},
    actions: [
      { action: 'open',    title: 'Abrir app' },
      { action: 'dismiss', title: 'Descartar' },
    ],
  });
});

// ── Click en notificación → abrir la app ─────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});

// ── Cache offline ─────────────────────────────────────────────────
const CACHE_NAME = 'vivir-mejor-v2';
const ASSETS = [
  '/', '/index.html', '/manifest.json', '/css/app.css',
  '/js/data.js', '/js/utils.js', '/js/router.js', '/js/activation.js',
  '/js/firebase-config.js', '/js/firebase-auth.js',
  '/js/firebase-user.js', '/js/firebase-subscriptions.js', '/js/app.js',
  '/js/pages/welcome.js', '/js/pages/login.js', '/js/pages/home.js',
  '/js/pages/sleep.js', '/js/pages/water.js', '/js/pages/exercise.js',
  '/js/pages/mood.js', '/js/pages/stats.js', '/js/pages/reminders.js',
  '/js/pages/premium.js', '/js/pages/checkout.js', '/js/pages/waiting.js',
  '/js/pages/admin.js', '/vivir-mejor/assets/icon-192.png', '/assets/icon-512.png',
];

self.addEventListener('install',  e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  if (event.request.url.includes('firebase') || event.request.url.includes('gstatic') ||
      event.request.url.includes('googleapis') || event.request.url.includes('mercadopago')) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request)
      .then(r => { if(r.status===200){const cl=r.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,cl));} return r; })
      .catch(() => event.request.destination==='document' ? caches.match('/index.html') : undefined)
    )
  );
});
