
//Guardar en el ache dinamico
function actualziarCacheDinamico(dynamicCache, req, res){
    console.log('entro a la funcion!');
    
    if( res.ok ){
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());

            return res.clone();
        });
    } else {
        return res;
    }
}