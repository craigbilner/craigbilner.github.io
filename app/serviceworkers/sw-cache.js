var CURRENT_VERSION = 'v1';

function cacheOpen (event, response) {
  return function (cache) {
    cache.put(event.request, response.clone());
    return response;
  }
}

function fetchSuccess (event) {
  return function (response) {
    return caches
      .open(CURRENT_VERSION)
      .then(cacheOpen(event, response));
  }
}

function noCache (event) {
  return function () {
    return fetch(event.request)
      .then(fetchSuccess(event));
  }
}

function checkCacheResponse (response) {
  if (!response) {
    throw new Error();
  }
  return response;
}

this.addEventListener('fetch', function (event) {
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
