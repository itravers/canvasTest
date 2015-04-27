var networkTestCanvas;
var scope;

// DOM Ready =============================================================
$(document).ready(function() {
	scope = angular.element($("#networkTestApp")).scope();
	//setupAngularControllers();
	setupCanvas();
});

// Functions =============================================================
function setupCanvas(){
	
	networkTestCanvas = new NetworkTestCanvas(document.getElementById("canvas"), 1200, 600);
	
}