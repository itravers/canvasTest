var networkTestCanvas;
var scope;
var dataService;

var app = angular.module("networkTestApp", []); 

// ANGULAR STUFF=====================================================
app.controller('networkTestCtrl', function($scope, $http, dataService) {
    // I apply the remote data to the local scope.
    function applyRemoteData( data ) {
        $scope.networkData.data = data;
    }

    // I load the remote data from the server.
    function loadRemoteData() {
        // The friendService returns a promise.
    	dataService.getData()
            .then(
                function( data ) {
                    applyRemoteData( data );
                }
            )
        ;
    }
    $scope.networkData = {};
    $scope.networkData.doClick = loadRemoteData;

	/*
	$scope.networkData = {};
    $scope.networkData.doClick = function(item, event) {
    	
    	 var responsePromise = $http.get("/networkTest/getNetworkData.json");
         responsePromise.success(function(data, status, headers, config) {
        	 $scope.networkData.data = data;
         });
         responsePromise.error(function(data, status, headers, config) {
             alert("AJAX failed!");
         });
    };*/
});

app.service(
        "dataService",
        function( $http, $q ) {
            // Return public API.
            return({
                getData: getData
            });

            // ---
            // PUBLIC METHODS.
            // ---
            
            function getData() {
                var request = $http({
                    method: "get",
                    url: "/networkTest/getNetworkData.json",
                    params: {
                        action: "get"
                    }
                });
                return( request.then( handleSuccess, handleError ) );
            }


            // ---
            // PRIVATE METHODS.
            // ---


            // I transform the error response, unwrapping the application dta from
            // the API response payload.
            function handleError( response ) {
                // The API response from the server should be returned in a
                // nomralized format. However, if the request was not handled by the
                // server (or what not handles properly - ex. server error), then we
                // may have to normalize it on our end, as best we can.
                if (
                    ! angular.isObject( response.data ) ||
                    ! response.data.message
                    ) {
                    return( $q.reject( "An unknown error occurred." ) );
                }
                // Otherwise, use expected error message.
                return( $q.reject( response.data.message ) );
            }


            // I transform the successful response, unwrapping the application data
            // from the API response payload.
            function handleSuccess( response ) {
                return( response.data );
            }
        }
    );


// DOM Ready =============================================================
$(document).ready(function() {
	scope = angular.element($("#networkTestApp")).scope();
	//setupAngularControllers();
	setupCanvas();
	registerServices();
	registerClicks();
});

// Functions =============================================================
function getData(){
	
}

function registerServices(){
	dataService = angular.module("dataService", []);
	dataService.service('dataService', ['$http', function ($http) {
		 var responsePromise = $http.get("/networkTest/getNetworkData.json");
         responsePromise.success(function(data, status, headers, config) {
        	 $scope.networkData.data = data;
        	
         });
         responsePromise.error(function(data, status, headers, config) {
             alert("AJAX failed!");
         });
        
	}]);
}

function setupCanvas(){
	networkTestCanvas = new NetworkTestCanvas(document.getElementById("canvas"), 1200, 800);
}

function registerClicks(){
	$( "#calculate" ).click(function() {
		  var timePassed = $("#timePassed").val();
		 // alert("timePassed: "+ timePassed);
		  calculateClicked(timePassed);
    });
	
	
	  $( "#drawCanvas" ).click(function() {

			//alert("drawCanvas Clicked");
		  networkTestCanvas.draw();
       });
}

function calculateClicked(timePassed){
	alert("you Clicked 'calculate' at " + timePassed + " ms.");
}

function getDataClicked(){
	alert("you Clicked 'getData'");
}