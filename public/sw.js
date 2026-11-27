// shortcut: bump CACHE_NAME on releases to retire stale shells; add build-time precaching if this grows.
const CACHE_NAME = 'pumopokus-v1'
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-512x512.png',
  '/apple-touch-icon-180x180.png',
]

async function precacheShell() {
  const cache = await caches.open(CACHE_NAME)
  await Promise.allSettled(SHELL.map((url) => cache.add(url)))

  try {
    const response = await fetch('/index.html', { cache: 'no-cache' })
    if (!response.ok) return
    const html = await response.text()
    const assetUrls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(
      (match) => match[1],
    )
    await Promise.allSettled(assetUrls.map((url) => cache.add(url)))
  } catch {
    /* online install failed; the runtime cache will fill in */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await precacheShell()
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

async function handleNavigation(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put('/index.html', response.clone())
    return response
  } catch {
    const cache = await caches.open(CACHE_NAME)
    return (await cache.match('/index.html')) ?? Response.error()
  }
}

async function handleAsset(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function handleOther(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)

  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) cache.put(request, response)
      })
      .catch(() => undefined)
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    return Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname === '/sw.js' || url.pathname === '/manifest.webmanifest') return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  event.respondWith(
    url.pathname.startsWith('/assets/') ? handleAsset(request) : handleOther(request),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const client = clients.find((item) => 'focus' in item)
      if (client) return client.focus()
      return self.clients.openWindow('/')
    })(),
  )
})
