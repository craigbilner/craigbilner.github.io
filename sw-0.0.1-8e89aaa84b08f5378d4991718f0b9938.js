function cacheOpen(e,t){return function(o){return o.put(e.request,t.clone())["catch"](function(e){console.error("cache error",e)}),t}}function fetchSuccess(e){return function(t){return caches.open(CURRENT_VERSION).then(cacheOpen(e,t))}}function noCache(e){return function(){return console.info("no cache",e.request.url),fetch(e.request).then(fetchSuccess(e))}}function checkCacheResponse(e){if(!e)throw console.info("no cache response"),new Error;return e}function logDebug(){toolbox.options.debug&&console.log(arguments)}importScripts("sw-toolbox-d61b8f9f071464c8cae92842a9b2db63.js");var CACHE_PREFIX="brocsw-v",CACHE_VERSION=CACHE_PREFIX+"1452038087621";toolbox.options.cache.name=CACHE_VERSION;var urlsToPrefetch=["assets/blog-bd67d8c315b4257205607481a6c16eb0.css","assets/blog-4aafbe1658dd698c6725912d70552dea.js","assets/vendor-d41d8cd98f00b204e9800998ecf8427e.css","assets/vendor-c390a549adb1d8619037cae53ae053e5.js","crossdomain.xml","index.html","robots.txt","vendor/Museo_Slab_500_2-webfont.woff","vendor/Museo_Slab_500_2-webfont.woff2"];urlsToPrefetch.forEach(function(e){toolbox.router.any(e,toolbox.cacheFirst)}),toolbox.precache(urlsToPrefetch),toolbox.router.any("/",toolbox.networkFirst);var CURRENT_VERSION="v3",CACHE_URLS={"https://api.cosmicjs.com/v1/blog-cb/objects":1,"https://api.cosmicjs.com/v1/blog-cb/objects?bustcache=true":2};this.addEventListener("fetch",function(e){var t=CACHE_URLS[e.request.url];if(t)if(1===t)e.respondWith(caches.match(e.request).then(checkCacheResponse)["catch"](noCache(e))["catch"](function(){console.error("no cache fail")}));else if(navigator.onLine){var o=new Request("https://api.cosmicjs.com/v1/blog-cb/objects");fetch(o).then(fetchSuccess({request:o}))}}),this.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==CURRENT_VERSION?caches["delete"](e):void 0}))}))}),self.addEventListener("activate",function(e){logDebug("Deleting out of date caches, current cache version:",CACHE_VERSION),e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return-1===e.indexOf("$$$inactive$$$")&&0===e.indexOf(CACHE_PREFIX)&&e!==CACHE_VERSION}).map(function(e){return logDebug("Deleting out of date cache:",e),caches["delete"](e)}))}))});