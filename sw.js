const CACHE_NAME = 'radarpilot-v5';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './radars.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// URLs que NUNCA devem ser salvas em cache local (APIs externas, tiles, busca, rotas)
function shouldBypassCache(url) {
  return url.includes('nominatim.openstreetmap.org') ||
         url.includes('router.project-osrm.org') ||
         url.includes('tile.openstreetmap.org') ||
         url.includes('waze.com') ||
         url.includes('google.com') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Erro ao pré-cachear assets:', err);
      });
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Requisições para APIs externas, mapas ou navegação: SEMPRE ir para a rede
  if (shouldBypassCache(url)) {
    e.respondWith(fetch(e.request).catch(err => {
      console.warn('Erro ao buscar recurso externo:', url, err);
      return new Response(JSON.stringify({ error: 'Rede indisponível' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }));
    return;
  }

  // Para assets estáticos e base de dados: Network-first com fallback para Cache
  e.respondWith(
    fetch(e.request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
