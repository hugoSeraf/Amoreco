const CACHE_NAME = 'amoreco-v3';
const ARQUIVOS_PARA_CACHEAR = [
  './',
  './index.html',
  './album.html',
  './galaxia.html',
  './manifest.json',
  './icon-amoreco.svg',
  './nossa-foto.jpeg',
  './eueamoreco.jpeg',
  './foto-pai.jpeg',
  './foto1.jpeg',
  './foto2.jpeg',
  './foto3.jpeg',
  './bicoepiscina.jpeg',
  './cineminha.jpeg',
  './concentrado.jpeg',
  './corintos.jpeg',
  './ecacurintia.jpeg',
  './eujogandoeamo.jpeg',
  './jogatina.jpeg',
  './musica.m4a',
  './musica2.mp3',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ARQUIVOS_PARA_CACHEAR.map((url) =>
          cache.add(url).catch((err) => console.warn('Falha ao cachear', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cacheada) => {
      if (cacheada) return cacheada;

      return fetch(event.request)
        .then((resposta) => {
          if (!resposta || resposta.status !== 200 || resposta.type === 'opaque') {
            return resposta;
          }
          const respostaClonada = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, respostaClonada);
          });
          return resposta;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
