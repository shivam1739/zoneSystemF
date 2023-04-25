const mapSection = document.getElementById("map");
const submit = document.getElementById("submit");
const zoneName = document.getElementById("zoneName");
const zoneCoordinates = document.getElementById("coordinates");
const clear = document.getElementById("clear");
const view = document.getElementById("view");
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

console.log(window.location);

map.on("draw:created", function (e) {
  const type = e.layerType;
  const layer = e.layer;
  drawnFeatures.addLayer(layer);

  polygon = layer.toGeoJSON();
  // console.log(polygon);
});
map.on("draw:edited", function (e) {
  const type = e.layerType;
  const layers = e.layers;
  layers.eachLayer(() => (polygon = layers.toGeoJSON()));
});

function handleSubmit(data) {
  if (!polygon) {
    window.alert("please select cordinates");
    return;
  }
  const { geometry } = polygon;
  let name = zoneName.value.trim();
  if (name.length <= 0 || geometry == undefined) {
    window.alert("please enter name of zone ");
    return;
  }

  zoneCoordinates.innerText = geometry.coordinates;
  console.log(geometry, polygon, name, "================");
  fetch(baseUrl + "/geo/api/v1/zone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, geometry }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.alert(data.message);
      location.reload();
    });
}
console.log(window.location.origin);
clear.addEventListener("click", () => location.reload());
submit.addEventListener("click", () => handleSubmit());
view.addEventListener("click", () => {
  window.location.href = window.location.origin + "/zoneSystem/zoneList.html";
});

module.export = { map };
