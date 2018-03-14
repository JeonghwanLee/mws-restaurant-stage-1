var staticCacheName = 'restaurant-review';
var urlToCache = ['/','/css/styles.css','index.html','restaurant.html','/js/dbhelper.js','/js/main.js','/js/restaurant_info.js','/data/restaurants.json','/img/1.jpg','/img/2.jpg','/img/3.jpg','/img/4.jpg','/img/5.jpg','/img/6.jpg','/img/7.jpg','/img/8.jpg','/img/9.jpg','/img/10.jpg'];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
      		return cache.addAll(urlToCache);
    	})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			// Cache hit - return response
      		if (response) {
        		return response;
      		}
      		// Clone the request. A request is a stream and
        	// can only be consumed once. Since we are consuming this
        	// once by cache and once by the browser for fetch, we need
        	// to clone the response.
      		var fetchRequest = event.request.clone();

    		return fetch(fetchRequest).then(function(response) {
        		if(!response || response.status !== 200 || response.type !== 'basic') {
            		return response;
        		}
        		// Clone the response. A response is a stream
            	// and because we want the browser to consume the response
            	// as well as the cache consuming the response, we need
           		 // to clone it so we have two streams.
       			var responseToCache = response.clone();

       			caches.open(staticCacheName).then(function(cache) {
            		cache.put(event.request, responseToCache);
        		});

        		return response;
    		});
    	})
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames){
        	return Promise.all(
            	cacheNames.map(function(cacheName) {
                	if (cacheName !== staticCacheName) {
                    	return caches.delete(cacheName);
                	}
            	})
        	);
        })
    );
});
