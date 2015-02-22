

app.controller ('GeneralController', function ($scope,routeService) {
	var dropZone = document.getElementById("drop-zone");
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);

	routeService.getRoutes().$bindTo($scope,"routes");

});
