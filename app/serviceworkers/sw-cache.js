function cacheOpen (event, response) {
  return function (cache) {
    cache.put(event.request, response.clone());
    return response;
  }
}

function fetchSuccess (event) {
  return function (response) {
    return caches
      .open('v1')
      .then(cacheOpen(event, response));
  }
}

function noCache (event) {
  return function () {
    return fetch(event.request)
      .then(fetchSuccess(event));
  }
}

function noCacheFail () {
  console.error('no cache fail');
}

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .catch(noCache(event))
      .catch(noCacheFail)
  );
});
