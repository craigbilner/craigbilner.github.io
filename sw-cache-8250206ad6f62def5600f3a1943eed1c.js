function cacheOpen(e,c){return function(t){return t.put(e.request,c.clone())["catch"](function(e){console.error("cache error",e)}),c}}function fetchSuccess(e){return function(c){return caches.open(CURRENT_VERSION).then(cacheOpen(e,c))}}function noCache(e){return function(){return console.info("no cache",e.request.url),fetch(e.request).then(fetchSuccess(e))}}function checkCacheResponse(e){if(!e)throw console.info("no cache response"),new Error;return e}importScripts("sw-toolbox-d61b8f9f071464c8cae92842a9b2db63.js"),toolbox.router.any("/",toolbox.networkFirst);var CURRENT_VERSION="v3",CACHE_URLS={"https://api.cosmicjs.com/v1/blog-cb/objects":1,"https://api.cosmicjs.com/v1/blog-cb/objects?bustcache=true":2};this.addEventListener("fetch",function(e){var c=CACHE_URLS[e.request.url];if(c)if(1===c)e.respondWith(caches.match(e.request).then(checkCacheResponse)["catch"](noCache(e))["catch"](function(){console.error("no cache fail")}));else if(navigator.onLine){var t=new Request("https://api.cosmicjs.com/v1/blog-cb/objects");fetch(t).then(fetchSuccess({request:t}))}}),this.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==CURRENT_VERSION?caches["delete"](e):void 0}))}))});