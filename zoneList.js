const zoneSection = document.getElementById("zoneSection");
let showMapBtn;
let deleteBtn;
const baseUrl =
  "https://app-5ad16a8f-8829-4dd0-8d68-2a9969a05c54.cleverapps.io";
var map = L.map("map").setView([22.7196, 75.85], 13);
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
osm.addTo(map);

let polygon;
const drawnFeatures = new L.FeatureGroup();
map.addLayer(drawnFeatures);
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnFeatures,
    remove: false,
  },
});
map.addControl(drawControl);

map.on("draw:created", function (e) {
  const type = e.layerType;
  const layer = e.layer;
  drawnFeatures.addLayer(layer);

  console.log(JSON.stringify(layer.toGeoJSON()));
});
map.on("draw:edited", function (e) {
  const type = e.layerType;
  const layers = e.layers;
  layers.eachLayer(() => JSON.stringify(layers.toGeoJSON()));
});

// for load zone list

function loadList() {
  fetch(baseUrl + "/geo/api/v1/zone")
    .then((response) => response.json())
    .then((data) => {
      let zoneHtml = "";
      data.data.forEach(
        (ele) =>
          (zoneHtml += `<div class="list"><h1>${ele.name}</h1> <button id=${ele.id} class=showMap >map</button> <button class=deleteBtn id=${ele.id}>delete</button></div>`)
      );
      zoneSection.innerHTML = zoneHtml;
      polygon = data.data.map((ele) => ele);

      deleteBtn = document.querySelectorAll(".deleteBtn");
      showMapBtn = document.querySelectorAll(".showMap");

      showMapBtn.forEach((btn) =>
        btn.addEventListener("click", () => show(btn.id))
      );

      deleteBtn.forEach((btn) =>
        btn.addEventListener("click", () => deleteZone(btn.id))
      );
    });
}

/// for show  map of perticular zone
let polygonPrvLayer;
function show(id) {
  console.log(polygon, "polygon");
  const polygonData = polygon.filter((ele) => ele.id == id);
  if (polygonPrvLayer) {
    map.removeLayer(polygonPrvLayer);
  }
  showPoygon(polygonData[0].coordinates);
}

// for delete
function deleteZone(id) {
  console.log(id);
  const polygonData = polygon.filter((ele) => ele.id == id);
  console.log(polygonData[0]);
  fetch(`${baseUrl}/geo/api/v1/zone/${polygonData[0].id}`, {
    method: "DELETE",
  })
    .then((respone) => respone.json())
    .then((data) => {
      window.alert(data.message);
      location.reload();
    });
}

// for show polygon

async function showPoygon(polygon) {
  var polygonData = {
    type: "Feature",
    properties: {},
    geometry: polygon,
  };

  const polygonLayer = L.geoJSON(polygonData, {
    fillColor: "green",
    fillOpacity: 0.5,
    color: "red",
    weight: 2,
    opacity: 1,
    editable: false,
  });
  polygonLayer.addTo(map);
  polygonPrvLayer = polygonLayer;
  map.fitBounds(polygonLayer.getBounds());
  console.log(polygon.toGeoJSON());
}

loadList();
