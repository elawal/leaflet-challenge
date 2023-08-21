var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<h4>Earthquake Depth Levels</h4>';
  div.innerHTML += '<i style="background:#b3ffb3"></i><span>Depth Below 10</span><br>';
  div.innerHTML += '<i style="background:#80ff80"></i><span>Depth Below 30</span><br>';
  div.innerHTML += '<i style="background:#4dff4d"></i><span>Depth Below 50</span><br>';
  div.innerHTML += '<i style="background:#1aff1a"></i><span>Depth Below 70</span><br>';
  div.innerHTML += '<i style="background:#00e600"></i><span>Depth Below 90</span><br>';
  div.innerHTML += '<i style="background:#00b300"></i><span>Depth Above 90</span><br>';

  return div;
};

function generateMap(earthquakes) {


    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var baseMaps = {
      "Street Map": street
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
  

    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);

    legend.addTo(myMap);
  }

d3.json(url).then(function(data) {
    generateFeatures(data.features);

  });


  function generateFeatures(earthquakeData) {
    function getColor(depth) {
      if (depth < 10) {
        return "#b3ffb3";
      } else if (depth < 30) {
        return "#80ff80";
      } else if (depth < 50) {
        return " #4dff4d";
      } else if (depth < 70) {
        return " #1aff1a";
      } else if (depth < 90) {
        return "#00e600";
      } else {
        return "#00b300";
      }
    }

  
    
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    });
  
   
    generateMap(earthquakes);
  }
