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

    // Adding get color function for marker color and legend
    function getColor(dep) {
                return dep > 91  ? 'red' :
                    dep > 90  ? '#DD571C' :
                    dep > 70  ? '#FC6A03' :
                    dep > 50  ? '#EC9706' :
                    dep > 30  ? 'yellow' :
                    dep > 10  ? 'yellowgreen' :
                                'green';
            }
  
    // Create a new circle cluster group.
    quakeMarker = []
    
    // Loop through the data.
    for (var i = 0; i < features.length; i++) {

        // Set the earthquake property to a variable.
        var quake = features[i];
        
        // variable for my marker size and color
        var mag = quake.properties.mag;
        var dep = quake.geometry.coordinates[2];
      

        // Quake marker details
        if (quake){
            quakeMarker.push(
            L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
                fillOpacity: 0.75,
                color: getColor(dep),
                fillColor: getColor(dep),
                radius: mag * 5000,   
            }).bindPopup(
                "<h1>"+ "Location: " + quake.properties.title + "<br>"+ "<hr>"+ 
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

    // Creating the map object
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 3,
        layers : [street, quakeLayer]
    });

   // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
   L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // Create legend

    // YOU NEED A GET COLOR FUNCTION FOR THIS TO WORK
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            title = ['<strong>Depth</strong>'],
            depths = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < depths.length; i++) {
            div.innerHTML += 
          "<i style='background: " + getColor(depths[i] + 1) + "'></i> " +
          depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        return div;
    };
    
    //  add our legend to the map.
    legend.addTo(myMap);

};
main();
