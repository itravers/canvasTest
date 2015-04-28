var networkTestCanvas;
var scope;

var app = angular.module("networkTestApp", []); 
app.controller('networkTestCtrl', function($scope) {
  
})

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