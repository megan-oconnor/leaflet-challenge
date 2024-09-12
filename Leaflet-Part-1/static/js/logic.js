// Creating the map object
let myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 4
});
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Function to determine the marker size
function markerSize(mag) {
    return mag*3;
}
// Function for marker color
function markerColor(depth) {
    if (depth <=10) return "lightgreen";
    else if (depth <= 30) return "yellow";
    else if (depth <= 50) return "gold";
    else if (depth <= 70) return "orange";
    else if (depth <= 90) return "orangered";
    else return "red";
}

// Getting our GeoJSON data to populate the map
d3.json(url).then(function (data) {
    // Create a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Set up the circle markers
        pointToLayer: function(feature, location) {
            return L.circleMarker(location, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.3,
                opacity: 1,
                fillOpacity: 1
            })},
        // This is called on each feature.
        onEachFeature: function(feature, layer) {
            // Giving each feature a popup with information that's relevant to it
            layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + "Magnitude: " + feature.properties.mag + "</h2> <hr> <h3>" + "Time: " + feature.properties.time + "</h3>");
        }
    }).addTo(myMap);
});

// Add legend that decodes the color of each marker
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    depth = [-10, 10, 30, 50, 70, 90];
    labels = [];
    legendInfo = "<strong>Depth</strong>";
    div.innerHTML = legendInfo;
    for (let i = 0; i < depth.length; i++) {
        labels.push('<li style="background-color:' + markerColor(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1]
            ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></li>');
    }
    // add label items to the div under the <ul> tag
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};
legend.addTo(myMap);