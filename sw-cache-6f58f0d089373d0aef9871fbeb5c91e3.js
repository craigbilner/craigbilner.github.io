function cacheOpen(e,t){return function(o){return o.put(e.request,t.clone())["catch"](function(e){console.error("cache error",e)}),t}}function fetchSuccess(e){return function(t){return caches.open(CURRENT_VERSION).then(cacheOpen(e,t))}}function noCache(e){return function(){return console.info("no cache",e.request.url),fetch(e.request).then(fetchSuccess(e))}}function checkCacheResponse(e){if(!e)throw console.info("no cache response"),new Error;return e}importScripts("sw-toolbox-d61b8f9f071464c8cae92842a9b2db63.js"),toolbox.router.any("/",toolbox.networkFirst);var urlsToPrefetch=["assets/blog-fbf9f146aa9f9ab1e498eb9993664cad.css","assets/blog-c242ebbd60f680db8b6c6ecc11797566.js","assets/vendor-d41d8cd98f00b204e9800998ecf8427e.css","assets/vendor-15c82b37da7bb16c4acca7e0c8b2e5c7.js","vendor/Museo_Slab_500_2-webfont.woff","vendor/Museo_Slab_500_2-webfont.woff2"];urlsToPrefetch.forEach(function(e){toolbox.router.any(e,toolbox.fastest)}),toolbox.precache(urlsToPrefetch);var CURRENT_VERSION="v3",OBJECT_TYPE="posts",BLOG_POSTS="https://api.cosmicjs.com/v1/blog-cb/object-type/"+OBJECT_TYPE,CACHE_URLS={};CACHE_URLS[BLOG_POSTS]=1,CACHE_URLS[BLOG_POSTS+"?bustcache=true"]=2,this.addEventListener("fetch",function(e){var t=CACHE_URLS[e.request.url];if(t)if(1===t)e.respondWith(caches.match(e.request).then(checkCacheResponse)["catch"](noCache(e))["catch"](function(){console.error("no cache fail")}));else if(navigator.onLine){var o=new Request(BLOG_POSTS);fetch(o).then(fetchSuccess({request:o}))}}),this.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==CURRENT_VERSION?(console.info("deleting",e),caches["delete"](e)):void 0}))}))});