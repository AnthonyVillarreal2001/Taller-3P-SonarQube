## Ejecutar el backend
Dentro del directorio principal ejectur
```
npm install
npm start
```
El API estará disponible en http://localhost:3000. Prueba endpoints como http://localhost:3000/zones en un navegador o Postman.

## Ejecutar el Frontend:
El frontend usa ExtJS desde CDN, por lo que no necesita instalación de paquetes.
Para ejecutarlo se puede usar un servidor HTTP simple

```
npm install -g http-server
http-server
```
Posteriormente acceder a http://localhost:8080 (o el puerto que use http-server) para ver la app. 

Alternativamente, puede abrir el archivo index.html directamente en un navegador (asegúrese de que el backend esté corriendo, ya que hace llamadas a localhost:3000).