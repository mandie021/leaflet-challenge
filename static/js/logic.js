async function main() {
    // Creating the map object
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 3
    });
    
    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    

    // API listings
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // Get the data 
    const response =  await fetch(url);
    const data = await response.json();
    console.log(data);
        
    //adding variable
    var features = data.features;
    console.log("features", features);

    // Create a new marker cluster group.
    // var markers = L.markerClusterGroup();

    // Loop through the data.
    for (var i = 0; i < features.length; i++) {

        // Set the earthquake property to a variable.
        var quake = features[i];
        console.log("quake", quake);
        console.log(quake.geometry.coordinates[1]);
        console.log(quake.geometry.coordinates[0]);

        // Check for the location property.
        // if (quake) {

        // Add a new marker to the cluster group, and bind a popup.
        // markers.addLayer(L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
        //     .bindPopup(features[i].descriptor));
        // }

    }
    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);

}
main();
