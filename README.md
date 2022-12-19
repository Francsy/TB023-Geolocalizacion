# TB023-Geolocalizacion

### Ejercicios
#### 1. Utiliza Leaflet para posicionarte en un mapa
Habrá que utilizar `navigator.geolocation.getCurrentPosition(...)`

#### 2. Posicionar el transporte público (trenes y autobuses) de Los Angeles en el mapa. :tada: :bus: :tram:

Tendrás que hacer:
- Fetch de la posición de los vehículos en tiempo real
- Después de hacer fetch(), tratar el objeto para poder pintar los puntos con Leafelt

#### Avanzado: 
- Haz que se refresque la posición de los vehículos en el mapa cada 3 segundos para dar efecto de "movimiento"
- Con un popup, dibujar el ID del vehículo

Recursos:
- [Metro.net - Los Angeles](https://developer.metro.net/)
- [Metro API LA](https://api.metro.net/)
- [API Endpoints LA - FastAPI](https://api.metro.net/docs)
- [Mapbox - proveedor de mapas en línea](https://www.mapbox.com/)
