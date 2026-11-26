/* PHOBOS Feira Online · guarda a tela e a biblioteca do Supabase no aparelho
   para abrir mesmo sem internet. Os dados vão sempre direto ao Supabase. */
const CACHE = 'phobos-feira-online-v1';
const BASE = ['./', './index.html', './config.js', './manifest.webmanifest', './icone-192.png', './icone-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const local = u.origin === location.origin;
  const lib = u.hostname === 'cdn.jsdelivr.net' || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!local && !lib) return; // Supabase e demais: sempre pela rede
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || (local ? caches.match('./index.html') : undefined))));
});
