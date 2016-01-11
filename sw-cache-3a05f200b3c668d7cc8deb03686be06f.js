function cacheOpen(e,o){return function(t){return t.put(e.request,o.clone())["catch"](function(e){console.error("cache error",e)}),o}}function fetchSuccess(e){return function(o){return caches.open(CURRENT_VERSION).then(cacheOpen(e,o))}}function noCache(e){return function(){return console.info("no cache",e.request.url),fetch(e.request).then(fetchSuccess(e))}}function checkCacheResponse(e){if(!e)throw console.info("no cache response"),new Error;return e}importScripts("sw-toolbox-d61b8f9f071464c8cae92842a9b2db63.js"),toolbox.router.any("/",toolbox.networkFirst);var urlsToPrefetch=["assets/blog-bffc6be9e341f3948990fcfa0c157ab1.css","assets/blog-cca449030a03e2cc4e47e34a04de233c.js","assets/vendor-d41d8cd98f00b204e9800998ecf8427e.css","assets/vendor-15c82b37da7bb16c4acca7e0c8b2e5c7.js","vendor/Museo_Slab_500_2-webfont.woff","vendor/Museo_Slab_500_2-webfont.woff2"];urlsToPrefetch.forEach(function(e){toolbox.router.any(e,toolbox.fastest)}),toolbox.precache(urlsToPrefetch);var CURRENT_VERSION="v1",CACHE_URLS={"https://api.cosmicjs.com/v1/blog-cb/objects":1,"https://api.cosmicjs.com/v1/blog-cb/objects?bustcache=true":2};this.addEventListener("fetch",function(e){var o=CACHE_URLS[e.request.url];if(o)if(1===o)e.respondWith(caches.match(e.request).then(checkCacheResponse)["catch"](noCache(e))["catch"](function(){console.error("no cache fail")}));else if(navigator.onLine){var t=new Request("https://api.cosmicjs.com/v1/blog-cb/objects");fetch(t).then(fetchSuccess({request:t}))}}),this.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==CURRENT_VERSION?caches["delete"](e):void 0}))}))});