//var name = ko.observable("Lucas");
var southWest = L.latLng(45.518, -122.708);
var northEast = L.latLng(45.537, -122.651);
var bounds = L.latLngBounds(southWest, northEast);
var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0');
query.within(bounds);
//console.log(L.getBounds());
var parksCurrent = 3;

query.run(function(error, featureCollection, response){
	parksCurrent = featureCollection.features.length;
	MyViewModel.computeParks(parksCurrent);
    console.log('Found ' + featureCollection.features.length + ' features');
});


var MyViewModel =  {
	name: ko.observable("Lucas"),
	parkCount: ko.observable(),
	computeParks: function(input) {
		return this.parkCount(input);
	}
};

var map = L.map('map').setView([45.528, -122.680], 15);
L.esri.basemapLayer("Gray").addTo(map);
var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
	style: function () {
	  return { color: "#70ca49", weight: 2 };
	}
}).addTo(map);
var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";
console.log(map);
console.log(map.getBounds());
//console.log(map._onResize);
map.on("dragend", function(e) {
    updateParks();
});
map.on("zoomend", function(e) {
    updateParks();
});
var updateParks = function() {
	var bound = map.getBounds();

	var sW = bound._southWest;
	var nE = bound._northEast;
	console.log(sW);
	var viewBounds = L.latLngBounds(sW, nE);
	debugger;
	var spatialQuery = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0');
	spatialQuery.within(bounds);

	spatialQuery.run(function(error, featureCollection, response){
		parksCurrent = featureCollection.features.length;
		MyViewModel.computeParks(parksCurrent);
	    console.log('Found ' + featureCollection.features.length + ' features');
	});
}



//console.log(parks);

parks.bindPopup(function(feature){
	return L.Util.template(popupTemplate, feature.properties)
});


//setTimeout(function() {
	ko.applyBindings(MyViewModel);

//}, 5000);


