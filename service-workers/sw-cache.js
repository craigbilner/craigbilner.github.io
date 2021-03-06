importScripts('sw-toolbox.js');

var CURRENT_VERSION = 'v5';
toolbox.options.cache.name = CURRENT_VERSION;

toolbox.router.any('/', toolbox.fastest);

var urlsToPrefetch = [
  'assets/blog.css',
  'assets/blog.js',
  'assets/vendor.css',
  'assets/vendor.js',
  'vendor/Museo_Slab_500_2-webfont.woff',
  'vendor/Museo_Slab_500_2-webfont.woff2'
];

urlsToPrefetch.forEach(function (url) {
  toolbox.router.any(url, toolbox.fastest)
});
toolbox.precache(urlsToPrefetch);

var OBJECT_TYPE = 'posts';
var BLOG_POSTS = 'https://api.cosmicjs.com/v1/blog-cb/object-type/' + OBJECT_TYPE;

var CACHE_URLS = {};
CACHE_URLS[BLOG_POSTS] = 1;
CACHE_URLS[BLOG_POSTS + '?bustcache=true'] = 2;

function cacheOpen(event, response) {
  return function (cache) {
    cache
      .put(event.request, response.clone())
      .catch(function (err) {
        console.error('cache error', err);
      });
    return response;
  }
}

function fetchSuccess(event) {
  return function (response) {
    // console.info('fetch success', event.request.url);
    return caches
      .open(CURRENT_VERSION)
      .then(cacheOpen(event, response));
  }
}

function noCache(event) {
  return function () {
    console.info('no cache', event.request.url);
    return fetch(event.request)
      .then(fetchSuccess(event));
  }
}

function checkCacheResponse(response) {
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
        .catch(function noCacheFail() {
          console.error('no cache fail');
        })
    );
  } else if (navigator.onLine) {
    var bustRequest = new Request(BLOG_POSTS);
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
          console.info('deleting', key);
          return caches.delete(key);
        }
      }));
    })
  );
});
