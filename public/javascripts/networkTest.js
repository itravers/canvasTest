var networkTestCanvas;
var scope;

var app = angular.module("networkTestApp", []); 
app.controller('networkTestCtrl', function($scope, $http) {
	var networkData = 0;
	$scope.networkData = {};
    $scope.networkData.doClick = function(item, event, scope) {
    	alert("Angular Click");
    	 var responsePromise = $http.get("/networkTest/getNetworkData.json");
         responsePromise.success(function(data, status, headers, config) {
        	 alert(JSON.stringify(data));
        	 $scope.networkData.data = data;
         });
         responsePromise.error(function(data, status, headers, config) {
             alert("AJAX failed!");
         });
    };
   //
    

});

// DOM Ready =============================================================
$(document).ready(function() {
	scope = angular.element($("#networkTestApp")).scope();
	//setupAngularControllers();
	setupCanvas();
	registerClicks();
});

// Functions =============================================================
function setupCanvas(){
	networkTestCanvas = new NetworkTestCanvas(document.getElementById("canvas"), 1200, 600);
}

function registerClicks(){
	$( "#calculate" ).click(function() {
		  var timePassed = $("#timePassed").val();
		 // alert("timePassed: "+ timePassed);
		  calculateClicked(timePassed);
    });
	
	
	  $( "#drawCanvas" ).click(function() {
		  networkTestCanvas.draw();
       });
}

function calculateClicked(timePassed){
	alert("you Clicked 'calculate' at " + timePassed + " ms.");
}

function getDataClicked(){
	alert("you Clicked 'getData'");
}