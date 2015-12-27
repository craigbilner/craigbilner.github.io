!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.toolbox=e()}}(function(){return function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a="function"==typeof require&&require;if(!u&&a)return a(i,!0);if(c)return c(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var f=n[i]={exports:{}};t[i][0].call(f.exports,function(e){var n=t[i][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[i].exports}for(var c="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){"use strict";function r(e,t){return a.openCache(t).then(function(t){return t.add(e)})}function o(e,t){return a.openCache(t).then(function(t){return t["delete"](e)})}function c(e){Array.isArray(e)||(e=[e]),i.preCacheItems=i.preCacheItems.concat(e)}e("serviceworker-cache-polyfill");var i=e("./options"),u=e("./router"),a=e("./helpers"),s=e("./strategies");a.debug("Service Worker Toolbox is loading");var f=function(e){return e.reduce(function(e,t){return e.concat(t)},[])};self.addEventListener("install",function(e){var t=i.cache.name+"$$$inactive$$$";a.debug("install event fired"),a.debug("creating cache ["+t+"]"),e.waitUntil(a.openCache({cache:{name:t}}).then(function(e){return Promise.all(i.preCacheItems).then(f).then(function(t){return a.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}),self.addEventListener("activate",function(e){a.debug("activate event fired");var t=i.cache.name+"$$$inactive$$$";e.waitUntil(a.renameCache(t,i.cache.name))}),self.addEventListener("fetch",function(e){var t=u.match(e.request);t?e.respondWith(t(e.request)):u["default"]&&"GET"===e.request.method&&e.respondWith(u["default"](e.request))}),t.exports={networkOnly:s.networkOnly,networkFirst:s.networkFirst,cacheOnly:s.cacheOnly,cacheFirst:s.cacheFirst,fastest:s.fastest,router:u,options:i,cache:r,uncache:o,precache:c}},{"./helpers":2,"./options":4,"./router":6,"./strategies":10,"serviceworker-cache-polyfill":15}],2:[function(e,t,n){"use strict";function r(e,t){t=t||{};var n=t.debug||f.debug;n&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||f.cache.name,r('Opening cache "'+t+'"',e),caches.open(t)}function c(e,t){t=t||{};var n=t.successResponses||f.successResponses;return fetch(e.clone()).then(function(r){return"GET"===e.method&&n.test(r.status)&&o(t).then(function(n){n.put(e,r).then(function(){var r,o,c;t.cache?(r=t.cache.maxEntries,o=t.cache.maxAgeSeconds,c=t.cache.name):(r=f.cache.maxEntries,o=f.cache.maxAgeSeconds,c=f.cache.name),(r||o)&&c&&i(e,n,c,r,o)})}),r.clone()})}function i(e,t,n,r,o){var c=u.bind(null,e,t,n,r,o);s=s?s.then(c):c()}function u(e,t,n,o,c){var i=e.url,u=Date.now();return r("Updating LRU order for "+i+". Max entries is "+o+", max age is "+c),h.getDb(n).then(function(e){return h.setTimestampForUrl(e,i,u)}).then(function(e){return h.expireEntries(e,o,c,u)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t["delete"](e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})})["catch"](function(e){r(e)})}function a(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches["delete"](t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches["delete"](e)})})})}var s,f=e("./options"),h=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:c,openCache:o,renameCache:a}},{"./idb-cache-expiration":3,"./options":4}],3:[function(e,t,n){"use strict";function r(e){return new Promise(function(t,n){var r=indexedDB.open(s+e,f);r.onupgradeneeded=function(){var e=r.result.createObjectStore(h,{keyPath:p});e.createIndex(l,l,{unique:!1})},r.onsuccess=function(){t(r.result)},r.onerror=function(){n(r.error)}})}function o(e){return e in d||(d[e]=r(e)),d[e]}function c(e,t,n){return new Promise(function(r,o){var c=e.transaction(h,"readwrite"),i=c.objectStore(h);i.put({url:t,timestamp:n}),c.oncomplete=function(){r(e)},c.onabort=function(){o(c.error)}})}function i(e,t,n){return t?new Promise(function(r,o){var c=1e3*t,i=[],u=e.transaction(h,"readwrite"),a=u.objectStore(h),s=a.index(l);s.openCursor().onsuccess=function(e){var t=e.target.result;if(t&&n-c>t.value[l]){var r=t.value[p];i.push(r),a["delete"](r),t["continue"]()}},u.oncomplete=function(){r(i)},u.onabort=o}):Promise.resolve([])}function u(e,t){return t?new Promise(function(n,r){var o=[],c=e.transaction(h,"readwrite"),i=c.objectStore(h),u=i.index(l),a=u.count();u.count().onsuccess=function(){var e=a.result;e>t&&(u.openCursor().onsuccess=function(n){var r=n.target.result;if(r){var c=r.value[p];o.push(c),i["delete"](c),e-o.length>t&&r["continue"]()}})},c.oncomplete=function(){n(o)},c.onabort=r}):Promise.resolve([])}function a(e,t,n,r){return i(e,n,r).then(function(n){return u(e,t).then(function(e){return n.concat(e)})})}var s="sw-toolbox-",f=1,h="store",p="url",l="timestamp",d={};t.exports={getDb:o,setTimestampForUrl:c,expireEntries:a}},{}],4:[function(e,t,n){"use strict";var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){"use strict";var r=new URL("./",self.location),o=r.pathname,c=e("path-to-regexp"),i=function(e,t,n,r){0!==t.indexOf("/")&&(t=o+t),this.method=e,this.keys=[],this.regexp=c(t,this.keys),this.options=r,this.handler=n};i.prototype.makeHandler=function(e){var t=this.regexp.exec(e),n={};return this.keys.forEach(function(e,r){n[e.name]=t[r+1]}),function(e){return this.handler(e,n,this.options)}.bind(this)},t.exports=i},{"path-to-regexp":13}],6:[function(e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var o=e("./route"),c=function(e,t){for(var n=e.entries(),r=n.next();!r.done;){var o=new RegExp(r.value[0]);if(o.test(t))return r.value[1];r=n.next()}return null},i=function(){this.routes=new Map,this["default"]=null};["get","post","put","delete","head","any"].forEach(function(e){i.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),i.prototype.add=function(e,t,n,c){c=c||{};var i=c.origin||self.location.origin;i=i instanceof RegExp?i.source:r(i),e=e.toLowerCase();var u=new o(e,t,n,c);this.routes.has(i)||this.routes.set(i,new Map);var a=this.routes.get(i);a.has(e)||a.set(e,new Map);var s=a.get(e);s.set(u.regexp.source,u)},i.prototype.matchMethod=function(e,t){t=new URL(t);var n=t.origin,r=t.pathname;e=e.toLowerCase();var o=c(this.routes,n);if(!o)return null;var i=o.get(e);if(!i)return null;var u=c(i,r);return u?u.makeHandler(r):null},i.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new i},{"./route":5}],7:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: cache first ["+e.url+"]",n),o.openCache(n).then(function(t){return t.match(e).then(function(t){return t?t:o.fetchAndCache(e,n)})})}var o=e("../helpers");t.exports=r},{"../helpers":2}],8:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: cache only ["+e.url+"]",n),o.openCache(n).then(function(t){return t.match(e)})}var o=e("../helpers");t.exports=r},{"../helpers":2}],9:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(r,i){var u=!1,a=[],s=function(e){a.push(e.toString()),u?i(new Error('Both cache and network failed: "'+a.join('", "')+'"')):u=!0},f=function(e){e instanceof Response?r(e):s("No result returned")};o.fetchAndCache(e.clone(),n).then(f,s),c(e,t,n).then(f,s)})}var o=e("../helpers"),c=e("./cacheOnly");t.exports=r},{"../helpers":2,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){"use strict";function r(e,t,n){n=n||{};var r=n.successResponses||o.successResponses,i=n.networkTimeoutSeconds||o.networkTimeoutSeconds;return c.debug("Strategy: network first ["+e.url+"]",n),c.openCache(n).then(function(t){var o,u=[];if(i){var a=new Promise(function(n){o=setTimeout(function(){t.match(e).then(function(e){e&&n(e)})},1e3*i)});u.push(a)}var s=c.fetchAndCache(e,n).then(function(e){if(o&&clearTimeout(o),r.test(e.status))return e;throw c.debug("Response was an HTTP error: "+e.statusText,n),new Error("Bad response")})["catch"](function(){return c.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e)});return u.push(s),Promise.race(u)})}var o=e("../options"),c=e("../helpers");t.exports=r},{"../helpers":2,"../options":4}],12:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}var o=e("../helpers");t.exports=r},{"../helpers":2}],13:[function(e,t,n){function r(e){for(var t,n=[],r=0,o=0,c="";null!=(t=v.exec(e));){var i=t[0],a=t[1],s=t.index;if(c+=e.slice(o,s),o=s+i.length,a)c+=a[1];else{c&&(n.push(c),c="");var f=t[2],h=t[3],p=t[4],l=t[5],d=t[6],m=t[7],g="+"===d||"*"===d,w="?"===d||"*"===d,x=f||"/",y=p||l||(m?".*":"[^"+x+"]+?");n.push({name:h||r++,prefix:f||"",delimiter:x,optional:w,repeat:g,pattern:u(y)})}}return o<e.length&&(c+=e.substr(o)),c&&n.push(c),n}function o(e){return c(r(e))}function c(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^"+e[n].pattern+"$"));return function(n){for(var r="",o=n||{},c=0;c<e.length;c++){var i=e[c];if("string"!=typeof i){var u,a=o[i.name];if(null==a){if(i.optional)continue;throw new TypeError('Expected "'+i.name+'" to be defined')}if(m(a)){if(!i.repeat)throw new TypeError('Expected "'+i.name+'" to not repeat, but received "'+a+'"');if(0===a.length){if(i.optional)continue;throw new TypeError('Expected "'+i.name+'" to not be empty')}for(var s=0;s<a.length;s++){if(u=encodeURIComponent(a[s]),!t[c].test(u))throw new TypeError('Expected all "'+i.name+'" to match "'+i.pattern+'", but received "'+u+'"');r+=(0===s?i.prefix:i.delimiter)+u}}else{if(u=encodeURIComponent(a),!t[c].test(u))throw new TypeError('Expected "'+i.name+'" to match "'+i.pattern+'", but received "'+u+'"');r+=i.prefix+u}}else r+=i}return r}}function i(e){return e.replace(/([.+*?=^!:${}()[\]|\/])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function a(e,t){return e.keys=t,e}function s(e){return e.sensitive?"":"i"}function f(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,pattern:null});return a(e,t)}function h(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);var c=new RegExp("(?:"+r.join("|")+")",s(n));return a(c,t)}function p(e,t,n){for(var o=r(e),c=l(o,n),i=0;i<o.length;i++)"string"!=typeof o[i]&&t.push(o[i]);return a(c,t)}function l(e,t){t=t||{};for(var n=t.strict,r=t.end!==!1,o="",c=e[e.length-1],u="string"==typeof c&&/\/$/.test(c),a=0;a<e.length;a++){var f=e[a];if("string"==typeof f)o+=i(f);else{var h=i(f.prefix),p=f.pattern;f.repeat&&(p+="(?:"+h+p+")*"),p=f.optional?h?"(?:"+h+"("+p+"))?":"("+p+")?":h+"("+p+")",o+=p}}return n||(o=(u?o.slice(0,-2):o)+"(?:\\/(?=$))?"),o+=r?"$":n&&u?"":"(?=\\/|$)",new RegExp("^"+o,s(t))}function d(e,t,n){return t=t||[],m(t)?n||(n={}):(n=t,t=[]),e instanceof RegExp?f(e,t,n):m(e)?h(e,t,n):p(e,t,n)}var m=e("isarray");t.exports=d,t.exports.parse=r,t.exports.compile=o,t.exports.tokensToFunction=c,t.exports.tokensToRegExp=l;var v=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){Cache.prototype.addAll||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(t){return Promise.all(t.map(function(t,r){return n.put(e[r],t)}))}).then(function(){return void 0})})},{}]},{},[1])(1)});