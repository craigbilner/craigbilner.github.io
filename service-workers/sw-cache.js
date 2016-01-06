importScripts('sw-toolbox.js');

toolbox.router.any('/', toolbox.networkFirst);

var urlsToPrefetch = [
  'assets/blog.css',
  'assets/blog.js',
  'assets/vendor.css',
  'assets/vendor.js',
  'vendor/Museo_Slab_500_2-webfont.woff',
  'vendor/Museo_Slab_500_2-webfont.woff2'
];

urlsToPrefetch.forEach(function (url) {
  toolbox.router.any(url, toolbox.cacheFirst)
});
toolbox.precache(urlsToPrefetch);

var CURRENT_VERSION = 'v3';
var CACHE_URLS = {
  'https://api.cosmicjs.com/v1/blog-cb/objects': 1,
  'https://api.cosmicjs.com/v1/blog-cb/objects?bustcache=true': 2
};

function cacheOpen (event, response) {
  return function (cache) {
    cache
      .put(event.request, response.clone())
      .catch(function (err) {
        console.error('cache error', err);
      });
    return response;
  }
}

function fetchSuccess (event) {
  return function (response) {
    // console.info('fetch success', event.request.url);
    return caches
      .open(CURRENT_VERSION)
      .then(cacheOpen(event, response));
  }
}

function noCache (event) {
  return function () {
    console.info('no cache', event.request.url);
    return fetch(event.request)
      .then(fetchSuccess(event));
  }
}

function checkCacheResponse (response) {
  if (!response) {
    console.info('no cache response');
    throw new Error();
  }
  // console.info('cache response', response);
  return response;
}

this.addEventListener('fetch', function (event) {
  var cacheType = CACHE_URLS[event.request.url];
  if (!cacheType) return;

  // console.info('fetch', event.request.url);
  if (cacheType === 1) {
    event.respondWith(
      caches
        .match(event.request)
        .then(checkCacheResponse)
        .catch(noCache(event))
        .catch(function noCacheFail () {
          console.error('no cache fail');
        })
    );
  } else if (navigator.onLine) {
    var bustRequest = new Request('https://api.cosmicjs.com/v1/blog-cb/objects');
    fetch(bustRequest).then(fetchSuccess({
      request: bustRequest
    }));
  }
});

this.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== CURRENT_VERSION) {
          return caches.delete(key);
        }
      }));
    })
  );
});
