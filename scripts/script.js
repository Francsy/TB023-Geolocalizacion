// 2. Posicionar el transporte público (trenes y autobuses) de Los Angeles en el mapa. 🎉 🚌 🚊

// Fetch de la posición de los vehículos en tiempo real
// Después de hacer fetch(), tratar el objeto para poder pintar los puntos con Leafelt
// Avanzado:
// Haz que se refresque la posición de los vehículos en el mapa cada 3 segundos para dar efecto de "movimiento"
// Con un popup, dibujar el ID del vehículo


//MAPA:
// cordenadas de los ANGELES. google maps y clik derecho y copiar coordenadas.

var latitud = 34.064541037456436;
var longitud = -118.31563894120258;
var zoom = 14;

var map = L.map('map').setView([latitud, longitud], zoom);

// var map = L.map('map').setView([34.064541037456436, -118.31563894120258], 10);

// copair el paso 5 de la documentacion de geolocalizacion
const MAPBOX_API = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'

const ATTRIBUTION =
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// Este token será el que obtengamos en la web de Mapbox
const ACCESS_TOKEN =
    'pk.eyJ1IjoiY2Nhc3RpbGxvMDZtYiIsImEiOiJja2k1eXpybXU3em1mMnRsNjNqajJ0YW12In0.aFQJlFDBDQeUpLHT4EiRYg';


// copar ajustes de la documentacion de mapbox. para cambiar el estilo mas parecido a google maps.

L.tileLayer(MAPBOX_API, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: 'mapbox/navigation-day-v1', // cambiar el tipo de mapa desde la pagina del slack https://docs.mapbox.com/api/maps/styles/
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN
}).addTo(map);

var metroIcon = L.icon({
    iconUrl: "../Assets/tren-electrico.png",
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [15, 15], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var busesIcon = L.icon({
    iconUrl: "../Assets/autobus-escolar.png",
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [15, 15], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


async function getMetro() {
    const respuestaMetro = await fetch("https://api.metro.net/LACMTA_Rail/vehicle_positions/all?geojson=false")
    const dataMetro = await respuestaMetro.json();

    const arrayMetros = []
    for (let i = 0; i < dataMetro.length; i++) {
        let posicionVehiculo = {
            latitud: dataMetro[i].position.latitude,
            longitud: dataMetro[i].position.longitude,
            id: dataMetro[i].vehicle.vehicle_id
        }
        arrayMetros.push(posicionVehiculo)
    }

    // for (let i = 0; i < arrayMetros.length; i++) {
    //     var marker = L.marker([arrayMetros[i].latitud, arrayMetros[i].longitud], { icon: metroIcon }).addTo(map);
    //     marker.bindPopup(`${arrayMetros[i].id}`);

    // }
    return arrayMetros;

}

async function getBus() {

    const respuestaBus = await fetch("https://api.metro.net/LACMTA/vehicle_positions/all?geojson=false")
    const dataBus = await respuestaBus.json();

    const arrayBuses = []
    for (let i = 0; i < dataBus.length; i++) {
        let posicionVehiculo = {
            latitud: dataBus[i].position.latitude,
            longitud: dataBus[i].position.longitude,
            id: dataBus[i].vehicle.vehicle_id
        }
        arrayBuses.push(posicionVehiculo)
    }

    // for (let i = 0; i < arrayBuses.length; i++) {
    //     var marker = L.marker([arrayBuses[i].latitud, arrayBuses[i].longitud], { icon: busesIcon }).addTo(map);
    //     marker.bindPopup(`${arrayBuses[i].id}`);

    // }
    return arrayBuses;
}


// OPCION A

setInterval(()=> Promise.all([getMetro(),getBus()]).then((value)=> {
for (let i = 0; i < value.length; i++) {
    console.log(value);
    for (let j = 0; j < value[i].length; j++) {

        if (i === 0) {
        let marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: metroIcon }).addTo(map)
        marker.bindPopup(`${value[i][j].id}`)
        } else {
        let marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: busesIcon }).addTo(map)
        marker.bindPopup(`${value[i][j].id}`)   
        }
    }   
}
}), 10000)

//OPCION B

// async function updateMap() {
//     const [metro, bus] = await Promise.all([getMetro(), getBus()]);
//     for (let i = 0; i < metro.length; i++) {
//       const marker = L.marker([metro[i].latitud, metro[i].longitud], { icon: metroIcon }).addTo(map);
//       marker.bindPopup(`${metro[i].id}`);
//     }
//     for (let i = 0; i < bus.length; i++) {
//       const marker = L.marker([bus[i].latitud, bus[i].longitud], { icon: busesIcon }).addTo(map);
//       marker.bindPopup(`${bus[i].id}`);
//     }
//   }
//   setInterval(updateMap(), 30000);