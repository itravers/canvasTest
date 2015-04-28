
var scope;
var dataService;
//var networkTestCanvas;

var app = angular.module("networkTestApp", []); 

// ANGULAR STUFF=====================================================
app.controller('networkTestCtrl', function($scope, $http, dataService) {
	$scope.networkData = {};
	$scope.networkData.data = {};
	$scope.networkData.getDataClick = loadRemoteData;
	$scope.networkTestCanvas = new NetworkTestCanvas(document.getElementById("canvas"), 1200, 800);
	
	loadRemoteData();
    // I apply the remote data to the local scope.
    function applyRemoteData( data ) {
    	if($scope.networkData != undefined)
        $scope.networkData.data = data;
    }

    // I load the remote data from the server.
    function loadRemoteData() {
        // The friendService returns a promise.
    	dataService.getData()
            .then(
                function( data ) {
                    applyRemoteData( data );
                    $scope.networkTestCanvas.draw(data);
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