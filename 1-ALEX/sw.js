//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener( 'install', e => {
    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => cache.addAll( APP_SHELL ) );

    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => cache.addAll( APP_SHELL_INMUTABLE ) );

    e.waitUntil( Promise.all( [ cacheInmutable, cacheStatic ] ) );
});

self.addEventListener('activate', e => {
    caches.keys().then(keys => {
        keys.forEach(key => {
            //elimina todos los caches que tengan la palabra static
            if ( key.includes( 'static' ) && key !== STATIC_CACHE ) {
                return caches.delete( key );
            }
            //elimina todos los caches que tengan la palabra dynamic
            if ( key.includes( 'dynamic' ) && key !== DYNAMIC_CACHE ) {
                return caches.delete( key );
            }
        });
    });
});

self.addEventListener( 'fetch', e => {

    const respuesta = caches.match( e.request ).then(res => {
        
        if ( res ) {
            return res;
        }else{
            console.log( 'No se encontro en el cache: ', e.request.url );
            fetch( e.request ).then( nvaRes => { 
                return actualziarCacheDinamico( DYNAMIC_CACHE, e.request, nvaRes );
            });
        }

        
    });

    e.respondWith( respuesta );
    
});


