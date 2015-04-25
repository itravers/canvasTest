var networkCanvas;
var app = angular.module("canvasTestApp", []); 
app.controller('canvasTestCtrl', function($scope) {
    $scope.resistors = resistorsList;
    //$scope.lastName= "Doe";
});

// DOM Ready =============================================================
$(document).ready(function() {
	//setupAngularControllers();
	setupCanvas();
	registerClicks();
});

// Functions =============================================================

function setupCanvas(){
	
	networkCanvas = new NetworkCanvas(document.getElementById("canvas"), 1000, 550);
	
}

function registerClicks(){
	$( "#calculate" ).click(function() {
		  var timePassed = $("#timePassed").val();
		 // alert("timePassed: "+ timePassed);
		  calculateClicked(timePassed);
    });
}

function calculateClicked(){
	//just as a test lets move one of the resistors and redraw
	var resistor = resistorsList[0];
	var resistor2 = resistorsList[1];
	
	resistor.tLineID = "transmissionLine4";
	resistor2.tLineID = "transmissionLine3";
	//alert(JSON.stringify(networkCanvas));
	syncAngularData();
	networkCanvas.draw();
}

function syncAngularData(){
	var scope = angular.element($("#canvasTestApp")).scope();
	 //alert(JSON.stringify(scope));
	    scope.$apply(function(){
	        scope.resistors = resistorsList;
	    });
}




