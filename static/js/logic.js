async function main() {
    
    // Adding the tile layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    

    // API listings
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // Get the data 
    const response =  await fetch(url);
    const data = await response.json();
    console.log(data);
        
    //adding variable
    var features = data.features;
    console.log("features", features);

    // create color for mag 

    // Create a new circle cluster group.
    quakeMarker = [];

    // Loop through the data.
    for (var i = 0; i < features.length; i++) {

        // Set the earthquake property to a variable.
        var quake = features[i];
        // console.log("quake", quake);
        // console.log(quake.geometry.coordinates[1]);
        // console.log(quake.geometry.coordinates[0]);
        // console.log("place", quake.properties.place);
        // console.log("mag", quake.properties.mag);
        var mag = quake.properties.mag;
        var dep = quake.geometry.coordinates[2];
        if (quake){
            quakeMarker.push(
            L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]]).bindPopup(
                "<h1>"+ "Quake Title: " + quake.properties.title + "<br>"+ "<hr>"+ "Time: " + quake.properties.time +
                "<br>"+ "<hr>"+ "Magnitute: " + mag + "<br>"+ "Depth: " + dep + "<h1>")
            )};
        /// add color function to create map function            

    };
    // Create a layer group that's made from the quake markers array
    var quakeLayer = L.layerGroup(quakeMarker){
        radius: markerSize(mag);

    };
    

    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
        Street: street,
      };
    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
        Quake: quakeLayer,
    };

    // Creating the map object
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 3,
        layers : [street, quakeLayer]
    });
    
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


};
main();
