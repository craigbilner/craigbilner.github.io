function cacheOpen (event, response) {
  return function (cache) {
    console.info('caching', event.request.url);
    cache.put(event.request, response.clone());
    return response;
  }
}

function fetchSuccess (event) {
  return function (response) {
    console.info('fetch success', event.request.url);
    return caches
      .open('v1')
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

function noCacheFail () {
  console.error('no cache fail');
}

this.addEventListener('fetch', function (event) {
  console.info('fetching', event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .catch(noCache(event))
      .catch(noCacheFail)
  );
});
