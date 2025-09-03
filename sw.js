const CACHE_NAME = 'keenanet-finance-tracker-v1.1.1';
const URLS_TO_CACHE = [
  // App structure
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json',

  // TS/TSX modules
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/context/AppContext.tsx',
  '/services/dbService.ts',
  '/services/exportService.ts',
  '/services/dateService.ts',
  '/components/common/Icon.tsx',
  '/components/common/EmojiPicker.tsx',
  '/components/layout/Header.tsx',
  '/components/layout/BottomNav.tsx',
  '/components/transactions/TransactionForm.tsx',
  '/components/transactions/TransactionList.tsx',
  '/components/transactions/RecurringTransactionForm.tsx',
  '/pages/Dashboard.tsx',
  '/pages/AddOrEditTransaction.tsx',
  '/pages/Reports.tsx',
  '/pages/Settings.tsx',
  '/pages/AllTransactions.tsx',
  '/pages/RecurringTransactions.tsx',
  '/pages/AddOrEditRecurringTransaction.tsx',

  // External CDNs
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  // Import map dependencies
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react-router-dom@^7.8.2',
  'https://aistudiocdn.com/recharts@^3.1.2',
];

// Install event: cache the application shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Fetch event: serve from cache, fallback to network, handle SPA routing
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, serve the SPA shell.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match('/index.html').then(response => {
          return response || fetch(event.request);
        });
      })
    );
    return;
  }

  // For other requests (assets, APIs), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network and cache the new response
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                if (!event.request.url.startsWith('chrome-extension://')) {
                   cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        );
      })
  );
});