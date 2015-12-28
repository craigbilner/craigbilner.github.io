var CURRENT_VERSION = 'v2';
var CACHE_URLS = {
  'https://cdn.polyfill.io/v2/polyfill.min.js?features=fetch': true,
  'https://api.cosmicjs.com/v1/blog-cb/objects': true
};

function cacheOpen (event, response) {
  return function (cache) {
    cache
      .put(event.request, response.clone())
      .then(function () {
        console.info('successfully cached');
      })
      .catch(function (err) {
        console.error('cache error', err);
      });
    return response;
  }
}

function fetchSuccess (event) {
  return function (response) {
    console.info('fetch success');
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
  if (!CACHE_URLS[event.request.url]) return;

  // console.info('fetch', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(checkCacheResponse)
      .catch(noCache(event))
      .catch(function noCacheFail () {
        console.error('no cache fail');
      })
  );
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
