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
var zoom = 18;

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
    iconSize: [15, 15]
});

var busesIcon = L.icon({
    iconUrl: "../Assets/autobus-escolar.png",
    iconSize: [15, 15] 
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


//Version sin ASYNC AWAIT

// let marcadores = []; // matriz para guardar los marcadores
// setInterval(() => {Promise.all([getMetro(), getBus()]).then((value) => {
//     // eliminar marcadores del mapa
//     for (let i = 0; i < marcadores.length; i++) {
//       map.removeLayer(marcadores[i]);
//     }
//     marcadores = []; // vaciar array
//     // añadimos marcadores
//     for (let i = 0; i < value.length; i++) {
//       console.log(value);
//       for (let j = 0; j < value[i].length; j++) {
//         let marker;
//         if (i === 0) {
//           marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: metroIcon }).addTo(map);
//           console.log(value[i][j].latitud, value[i][j].longitud);
//         } else {
//           marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: busesIcon }).addTo(map);
//         }
//         marker.bindPopup(`${value[i][j].id}`);
//         marcadores.push(marker); //agregamos el marcador al array para luegoo poder borrarlo cuando vuelva a pasar
//       }
//     }
//   });
// }, 10000);




// VERSION ASYNC AWAIT

let marcadores = []; // matriz para guardar los marcadores

async function actualizaMarcadores() {
const valor = await Promise.all([getMetro(), getBus()]);
    for (let i = 0; i < marcadores.length; i++) {
      map.removeLayer(marcadores[i]);
    }
    marcadores = [];
    for (let i = 0; i < valor.length; i++) {
      for (let j = 0; j < valor[i].length; j++) {
        let marker;
        if (i === 0) {
          marker = L.marker([valor[i][j].latitud, valor[i][j].longitud], { icon: metroIcon }).addTo(map);
          console.log(valor[i][j].latitud, valor[i][j].longitud);
        } else {
          marker = L.marker([valor[i][j].latitud, valor[i][j].longitud], { icon: busesIcon }).addTo(map);
        }
        marker.bindPopup(`${valor[i][j].id}`);
        marcadores.push(marker);
      }
    }
  }

  setInterval(actualizaMarcadores, 4000);