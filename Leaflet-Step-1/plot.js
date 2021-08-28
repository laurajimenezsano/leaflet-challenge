// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Create earthquake layerGroup
var earthquakes = L.layerGroup();

// Define streetmap layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});




d3.json(queryUrl, function(data) {
  // size of marker
  function markerSize(magnitude) {
    return magnitude * 4;
  };
  // color for marker (from gray to blue)
  function markerColor(depth) {
    switch(true) {
      case depth > 90:
        return "red";
      case depth > 60:
        return "orange";
      case depth > 30:
        return "yellow";
      case depth > 10:
        return "blue";
      default:
        return "lightgreen";
    }
  }

  // add feature of place and time
  L.geoJSON(data, {
    pointToLayer: function (feature, marker) {
      return L.circleMarker(marker, 
        // marker style
        {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" + "<hr><p>Date: "
      + new Date(feature.properties.time));
    }
  }).addTo(earthquakes);

  // adding function to map
  earthquakes.addTo(myMap);

});