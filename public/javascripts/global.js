var networkCanvas;
var scope;

// DOM Ready =============================================================
$(document).ready(function() {
	scope = angular.element($("#canvasTestApp")).scope();
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
	
	scope.$apply(function(){
		scope.resistorsList[0].tLineID = "transmissionLine4";
		scope.resistorsList[1].tLineID = "transmissionLine3";
		scope.nodesList[0].totalPower = 50;
		scope.batteriesList[0].nodeID = "node9";
    });
	networkCanvas.draw();
}




