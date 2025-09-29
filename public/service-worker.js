// Service Worker for Ganesha My Bestie PWA
// Version 1.0.0

const CACHE_VERSION = 'ganesha-v1.0.0';
const CACHE_NAMES = {
  CORE: `${CACHE_VERSION}-core`,
  PUBLIC: `${CACHE_VERSION}-public`,
  ZONES: `${CACHE_VERSION}-zones`,
  AUDIO: `${CACHE_VERSION}-audio`
};

// Core app shell - always precached for instant loading
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/App.css',
  '/src/Enhanced.css',
  '/manifest.json'
];

// Public assets - precached for offline use
const PUBLIC_ASSETS = [
  '/images/ganesha-character.png',
  '/images/ganesha-with-headphones.png',
  '/images/map-background.png',
  '/images/welcome-background.png',
  '/images/profile-background.png',
  '/ganesha-outline.svg'
];

// Audio files - cached on-demand but kept for longer
const AUDIO_PATTERNS = [
  /\/audio\/.+\.mp3$/,
  /\/words\/.+\.mp3$/
];

// Zone assets - cached as user explores
const ZONE_PATTERNS = [
  /\/zones\/.+\.(png|jpg|jpeg|svg|webp)$/,
  /\/zones\/.+\/(assets|images)\/.+$/
];

// Install event - precache core and public assets
self.addEventListener('install', (event) => {
  console.log('🔧 PWA: Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache core app shell
      caches.open(CACHE_NAMES.CORE).then((cache) => {
        console.log('📦 PWA: Caching core app shell');
        return cache.addAll(CORE_ASSETS);
      }),
      
      // Cache public assets
      caches.open(CACHE_NAMES.PUBLIC).then((cache) => {
        console.log('📦 PWA: Caching public assets');
        return cache.addAll(PUBLIC_ASSETS);
      })
    ])
    .then(() => {
      console.log('✅ PWA: Installation complete');
      return self.skipWaiting(); // Activate immediately
    })
    .catch((error) => {
      console.error('❌ PWA: Installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 PWA: Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old versions
            return cacheName.startsWith('ganesha-') && 
                   !Object.values(CACHE_NAMES).includes(cacheName);
          })
          .map((cacheName) => {
            console.log('🗑️ PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      console.log('✅ PWA: Activation complete');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Strategy 1: Core app shell - Cache First (instant loading)
  if (CORE_ASSETS.some(asset => path.includes(asset)) || 
      path === '/' || 
      path.endsWith('.jsx') || 
      path.endsWith('.css')) {
    return cacheFirst(request, CACHE_NAMES.CORE);
  }
  
  // Strategy 2: Public assets - Cache First with fallback
  if (path.startsWith('/images/') || 
      path.startsWith('/icons/') || 
      path.endsWith('.svg')) {
    return cacheFirst(request, CACHE_NAMES.PUBLIC);
  }
  
  // Strategy 3: Audio files - Cache First, keep forever
  if (AUDIO_PATTERNS.some(pattern => pattern.test(path))) {
    return cacheFirst(request, CACHE_NAMES.AUDIO, { maxAge: Infinity });
  }
  
  // Strategy 4: Zone assets - Network First with cache fallback
  if (ZONE_PATTERNS.some(pattern => pattern.test(path))) {
    return networkFirst(request, CACHE_NAMES.ZONES);
  }
  
  // Default: Network First for everything else
  return networkFirst(request, CACHE_NAMES.CORE);
}

// Cache First strategy - best for static assets
async function cacheFirst(request, cacheName, options = {}) {
  try {
    // Check cache first
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('💾 PWA: Serving from cache:', request.url);
      
      // Update cache in background if needed
      if (!options.maxAge || options.maxAge !== Infinity) {
        fetch(request).then(response => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
        }).catch(() => {});
      }
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    console.log('🌐 PWA: Fetching from network:', request.url);
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('❌ PWA: Cache First failed:', error);
    
    // Try to return cached version as last resort
    const cache = await caches.open(cacheName);
    return cache.match(request) || new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First strategy - best for dynamic content
async function networkFirst(request, cacheName) {
  try {
    // Try network first
    console.log('🌐 PWA: Fetching from network:', request.url);
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    console.log('💾 PWA: Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('❌ PWA: Network First failed:', error);
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background sync for future updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  console.log('🔄 PWA: Background sync triggered');
  // Future: Sync user progress when back online
}

// Push notifications (for future updates)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification('Ganesha My Bestie', options)
  );
});

console.log('🎯 PWA: Service Worker loaded successfully');