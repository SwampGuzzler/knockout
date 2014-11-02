//var name = ko.observable("Lucas");
var MyViewModel = function() {
	this.name = ko.observable("Lucas");
	this.parkCount = ko.computed(function() {
		return 5
	});

};


var map = L.map('map').setView([45.528, -122.680], 13);

L.esri.basemapLayer("Gray").addTo(map);

var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
	style: function () {
	  return { color: "#70ca49", weight: 2 };
	}
}).addTo(map);

var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

var counter = 0;
parks.bindPopup(function(feature){
	counter++;
	return L.Util.template(popupTemplate, feature.properties)
});


ko.applyBindings(new MyViewModel);
