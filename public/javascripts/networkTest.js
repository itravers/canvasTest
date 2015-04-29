
var scope;
var dataService;
//var networkTestCanvas;

var app = angular.module("networkTestApp", []); 

// ANGULAR STUFF=====================================================
app.controller('networkTestCtrl', function($scope, $http, dataService) {
	$scope.networkData = {};
	$scope.networkData.data = {};
	$scope.networkData.getDataClick = loadRemoteData;
	$scope.networkData.drawNetworkClick = drawNetwork;
	$scope.networkData.calculateClick = calculateClick;
	$scope.networkTestCanvas = new NetworkTestCanvas(document.getElementById("canvas"), 1200, 800);
	
	loadRemoteData();
	
    // I apply the remote data to the local scope.
    function applyRemoteData( data ) {
    	$scope.networkData.powerSupplies = objectifyRemoteData(data.powerSupplies);
    	$scope.networkData.powerConsumers = objectifyRemoteData(data.powerConsumers);
    	$scope.networkData.resistors = objectifyRemoteData(data.resistors);
    	$scope.networkData.transmissionLines = objectifyRemoteData(data.transmissionLines);
    	$scope.networkData.connectors = objectifyRemoteData(data.connectors);
    	$scope.networkData.batteries = objectifyRemoteData(data.batteries);
       // $scope.networkData.data = data;
    }
    
    //turn data taken from database into objects.
    function objectifyRemoteData(data){
    	var objectifiedData = [];
    	for(var i = 0; i < data.length; i++){
    		var d = data[i];
    		if(d.type == "powerSupply"){
    			var ps = new PowerSupply(d);
    			objectifiedData.push(ps);
    			//alert("remote data objectified");
    		}else if(d.type == "powerConsumer"){
    			var pc = new PowerConsumer(d);
    			objectifiedData.push(pc);
    		}else if(d.type == "connector"){
    			var c = new NetworkNode(d);
    			objectifiedData.push(c);
    		}else if(d.type == "battery"){
    			var b = new Battery(d);
    			objectifiedData.push(b);
    		}else if(d.type == "tLine"){
    			var tLine = new TransmissionLine(d);
    			objectifiedData.push(tLine);
    		}else if(d.type == "resistor"){
    			var r = new Resistor(d);
    			objectifiedData.push(r);
    		}
    	}
    	//objectifiedData[0].distributeCharge();
    	return objectifiedData;
    }
    
    function drawNetwork(){
    	$scope.networkTestCanvas.draw($scope.networkData);
    }
    
    function calculateClick(){
    	$scope.networkData.powerSupplies[0].distributeCharge();
    }

    // I load the remote data from the server.
    function loadRemoteData() {
        // The friendService returns a promise.
    	dataService.getData()
            .then(
                function( data ) {
                    applyRemoteData( data );
                	//data = objectifyRemoteData(data);
                	//$scope.networkData.data = data;
                	
                	drawNetwork();
                }
            )
        ;
    }
    
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
	
});

// Functions =============================================================