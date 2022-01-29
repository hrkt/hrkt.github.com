const serviceWorkerVersion = '0.1.0'
const cacheName = 'MyPdfSlideshowPWA-v' + serviceWorkerVersion
const appShellFiles = [
  './index.html',
  './app.js',
  './app.css',
  './images/mps-icon-128-16x16.png',
  './images/mps-icon-128-32x32.png',
  './images/mps-icon-128-48x48.png',
  './images/mps-icon-128-64x64.png',
  './images/mps-icon-128-128x128.png',
  './lib/lodash/full.min.js',
  './lib/pdfjs/pdf.js',
  './lib/pdfjs/pdf.worker.js'
]
const otherFiles = []
const contentToCache = appShellFiles.concat(otherFiles)

self.addEventListener('install', function (evt) {
  console.log('[Service Worker] Installing... version: ' + serviceWorkerVersion + ' cacheName:' + cacheName) 
  // use newly installed service worker.
  // returned Promise from skipWaiting() can be safely ignored.
  self.skipWaiting()
  evt.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content')
      return cache.addAll(contentToCache)
    })
  )
})

self.addEventListener('fetch', function (evt) {
  evt.respondWith(
    caches.match(evt.request).then(function (r) {
      console.log('[Service Worker] Fetching resource: ' + evt.request.url)
      // we don't store falsy objects, so '||' works fine here.
      return r || fetch(evt.request).then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          console.log('[Service Worker] Caching new resource: ' + evt.request.url)
          cache.put(evt.request, response.clone())
          return response
        })
      })
    })
  )
})

self.addEventListener('activate', (evt) => {
  console.log('Activating new service worker...')
  const cacheAllowlist = [cacheName]

  evt.waitUntil(
    caches.keys().then((keyList) => {
      // eslint-disable-next-line array-callback-return
      return Promise.all(keyList.map((key) => {
        if (cacheAllowlist.indexOf(key) === -1) {
          console.log('[Service Worker] deleting old cache: ' + cacheName)
          return caches.delete(key)
        }
      }))
    })
  )
  console.log('done.')
})
