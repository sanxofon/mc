/*
  Aquí se llama a caches.open() con el nombre de caché deseado; 
  después se llama a cache.addAll() y se pasa la matriz de archivos. 
  Esta es una cadena de promesas (caches.open() y cache.addAll()). 
  El método event.waitUntil() toma una promesa y la usa para saber 
    cuánto tarda la instalación y si se realizó correctamente.
*/
var CACHE_NAME = 'metronomo-cache-v2.1';
var urlsToCache = [
  '/mc/',
  'mathjs-rythm.class.js',
  'mc.js',
  'beats.js',
  'vars.js',
  'w3.css',
  'mc.css',
  'favicon.png',
  'img/cog.png',
  'img/launcher-icon-512.png',
  'img/launcher-icon-1x.png',
  'img/launcher-icon-2x.png',
  'img/launcher-icon-4x.png'
];

/*
  Instalación de un service worker
  Después de que se inicia el proceso de registro en una página controlada, 
    pasemos a la perspectiva de la secuencia de comandos del service worker que 
    se encarga del evento install.
*/
self.addEventListener('install', function(event) {
  // Realiza pasos de install
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

/*
  Cuando se instala un service worker y el usuario actualiza la página o se dirige 
  a una diferente, el service worker comienza a recibir eventos fetch.

  Si existe una respuesta, se devuelve el valor almacenado en caché. 
  Si no existe, se devuelve el resultado de una llamada a fetch, que realizará 
    una solicitud de red y devolverá los datos si se puede recuperar algo de la red. 

  Almacenamos en caché solicitudes nuevas de forma acumulativa administrando la 
    respuesta de la solicitud de fetch y luego agregándola a la caché.

  Agregamos una devolución de llamada a .then() en la solicitud fetch.
  Cuando recibimos una respuesta, realizamos las siguientes verificaciones:
    1. Nos aseguramos de que la respuesta sea válida.
    2. Verificamos que el estado sea 200 en la respuesta.
    3. Nos aseguramos de que el tipo de respuesta sea basic, lo que indica que es 
      una solicitud proveniente de nuestro origen. Esto también significa que las 
      solicitudes a recursos de terceros no se almacenan en caché.
  Si pasamos las verificaciones, clonamos la respuesta. Esto es así porque, al ser 
    la respuesta una transmisión, el cuerpo solo se puede consumir una vez. 
  Debido a que deseamos devolver la respuesta para que el navegador la use, además 
    de pasarla a la caché para su aplicación, debemos clonarla a fin de enviar una 
      al navegador y otra a la caché.
 */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

/*
  Actualización de un service worker

  Cuando el service worker necesite una actualización debes seguir estos pasos:

    1. Actualiza el archivo JavaScript de tu service worker. Cuando un usuario 
        navega por tu sitio, el navegador intenta descargar de nuevo el archivo de 
        la secuencia de comandos que definió el service worker en segundo plano. 
        Aunque solo haya un byte de diferencia entre el archivo del service worker 
        y el que tiene actualmente, se lo considera nuevo.
    2. El service worker nuevo se inicia y el evento install se activa
    3. En este punto, el service worker antiguo todavía controla las páginas actuales, 
        por lo que el service worker nuevo pasa a un estado de waiting.
    4. Cuando las páginas abiertas del sitio se cierran, el service worker antiguo 
        finaliza y el service worker nuevo toma el control.
    5. Cuando el service worker nuevo toma el control, el evento activate 
        correspondiente se activa.

  Una tarea común que se realiza en la devolución de llamada de activate es la 
    administración de la caché. El motivo por el que es conveniente hacer esto 
    durante la devolución de llamada de activate es que, si tu intención es 
    borrar cachés antiguas durante el paso de instalación, los service workers 
    anteriores, que controlan las páginas actuales, repentinamente no podrán 
    obtener archivos de la caché en cuestión.

  Supongamos que hay una caché llamada 'my-site-cache-v1' y deseamos dividirla 
    en una caché para páginas y una caché para entradas de blog. Esto significa que, 
    en el paso de instalación, crearíamos dos cachés, 'pages-cache-v1' y 
    'blog-posts-cache-v1', y en el paso de activación deberíamos borrar la 
    'my-site-cache-v1' antigua.

  El siguiente código permitiría hacer esto generando un ciclo por todas las 
  cachés del service worker y eliminando cualquier caché que no esté definida 
  en la lista blanca de la caché.
*/
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['metronomo-cache-v1-91']; //, 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
