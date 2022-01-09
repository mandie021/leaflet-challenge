async function main() {
    // API listings
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // Get the data 
    const response =  await fetch(url);
    const data = await response.json();
    console.log(data);
        
    //adding variable
    var features = data.features;
    console.log("features", features); 
       
    // Adding the tile layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
  
    // Create a new circle cluster group.
    quakeMarker = []

    // Loop through the data.
    for (var i = 0; i < features.length; i++) {

        // Set the earthquake property to a variable.
        var quake = features[i];
        // console.log("quake", quake);
        // console.log(quake.geometry.coordinates[1]);
        // console.log(quake.geometry.coordinates[0]);
        // console.log("place", quake.properties.place);
        console.log("mag", quake.properties.mag);
        // console.log("dep", quake.geometry.coordinates[2])
        
        // variable for my marker size and color
        var mag = quake.properties.mag;
        var dep = quake.geometry.coordinates[2];

        // create color conditions for depth 
        var color = "";
            if (dep > 69) {
            color = "red";
            }
            else if (dep > 49) {
            color = "orange";
            }
            else if (dep > 29) {
            color = "yellow";
            }
            else if ( dep > 9){
                color = "yellowgreen"
            }
            else {
            color = "green";
        }

        var radius = "";
        if (mag > 3) {
            radius = 50000;
            }
            else if (dep > 4) {
            radius = 10000;
            }
            else if (dep > 2) {
                radius = 3000;
            }
            else if ( dep > 1){
                radius = 2000;
            }
            else {
                radius = 100;
        }
        if (quake){
            quakeMarker.push(
            L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
                fillOpacity: 0.75,
                color: color,
                fillColor: color,
                radius: radius,   
            }).bindPopup(
                "<h1>"+ "Quake Title: " + quake.properties.title + "<br>"+ "<hr>"+ 
                "Magnitute: " + mag + "<br>"+ "Depth: " + dep + "<h1>")
            )};
         

    };
    // Create a layer group that's made from the quake markers array
    var quakeLayer = L.layerGroup(quakeMarker)
    

    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
      };
    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
        Earthquakes: quakeLayer,
    };
    // Create legend
    var legend = L.control({
        position: "bottomright"
    })

    // Creating the map object
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 3,
        layers : [street, quakeLayer]
    });
    
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, legend).addTo(myMap);

   


};
main();
