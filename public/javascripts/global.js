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

function calculateClicked(timePassed){
	var powerSupplies = scope.powerSuppliesList;
	//alert(JSON.stringify(powerSupplies));
	for(var i = 0; i < powerSupplies.length; i++) {
		var supply = powerSupplies[i];
		var node = getNodeFromPowerSupply(supply);
		//alpha.1.A integrate time passed with pps to get interim node power
		var interimPower = (supply.powerPerSecond * (timePassed/1000));
		node.interimPower.push(interimPower);
		//alpha.2.B fix total power
		if(supply.totalPower > node.interimPower[node.interimPower.length - 1]){
			supply.totalPower = supply.totalPower - node.interimPower[node.interimPower.length - 1];
		}else{
			node.interimPower[node.interimPower.length -1] = supply.totalPower;
			supply.totalPower = 0;
		}
		
	}
	scope.$apply(function(){
		
    });
	networkCanvas.draw();
}

function getNodeFromPowerSupply(powerSupply){
	var node = scope.nodesList.filter(function(v) {
	    return v._id === powerSupply.nodeID; // filter out appropriate one
	})[0];
	return node;
}




