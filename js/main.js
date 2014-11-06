
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


var MyViewModel = {
	self: this,
	name: ko.observable("Lucas"),
	parkCount: ko.observable(),
	computeParks: function(input) {
		console.log(this.parkCount(input));
		return this.parkCount(input);
	},

	allowMax: ko.computed(function() {
		console.log("in the model:");
		console.log(self);
		//console.log(parkCount());
		return this.parkCount > 300;
	})
};



var map = L.map('map').setView([45.528, -122.680], 15);
L.esri.basemapLayer("Gray").addTo(map);
var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
	onEachFeature: onEachFeature,
	style: function () {
	  return { color: "#70ca49", weight: 2 };
	}
	
}).addTo(map);
var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";
//console.log(map);

var highlightStyle = {
    color: '#2262CC', 
    weight: 3,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};
var defaultStyle = {
	color: "#70ca49", 
	weight: 2
}
console.log(parks);

var onEachFeature = function(feature, layer) {
	console.log("mouseover!");
        layer.on({
            mouseover: highlightFeature
            //mouseout: resetHighlight,
            //click: zoomToFeature,
            //pointToLayer: pointToLayer
        });
    };
function highlightFeature(e) {
	console.log("Dafds");
	parks.on("mouseover", function (e) {
	    // Change the style to the highlighted version
	    this.setStyle(highlightStyle);
	});
	// parks.on("mouseout", function (e) {
	//     // Change the style to the highlighted version
	//     this.setStyle(defaultStyle);
	// });
};

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
		console.log(MyViewModel.allowMax());
		MyViewModel.allowMax();
	});
}

parks.bindPopup(function(feature){
	return L.Util.template(popupTemplate, feature.properties)
});

ko.applyBindings(MyViewModel);




     

    