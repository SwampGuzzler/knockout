
var southWest = L.latLng(45.518, -122.708);
var northEast = L.latLng(45.537, -122.651);
var bounds = L.latLngBounds(southWest, northEast);
var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0');
query.within(bounds);

var parksCurrent = 3;

query.run(function(error, featureCollection, response){
	parksCurrent = featureCollection.features.length;
	MyViewModel.computeParks(parksCurrent);
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

map.on("dragend", function(e) {
    updateParks();
});
map.on("zoomend", function(e) {
    updateParks();
});
var updateParks = function() {
	var bounding = map.getBounds();
	var sW = bounding._southWest;
	var nE = bounding._northEast;
	var viewBounds = L.latLngBounds(sW, nE);
	var spatialQuery = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0');
	spatialQuery.within(viewBounds);

	spatialQuery.run(function(error, featureCollection, response){
		parksCurrent = featureCollection.features.length;
		MyViewModel.computeParks(parksCurrent);
	});
}

parks.bindPopup(function(feature){
	return L.Util.template(popupTemplate, feature.properties)
});

ko.applyBindings(MyViewModel);



