var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index', 
	  					pages: [{title : "Canvas Test", 
	  							 link : "/canvasTest"},
	  							{title : "Network Test",
	  							 link : "/network"}]});
});

/* GET networkTest page. */
router.get('/networkTest', function(req, res, next) {
  res.render('networkTest', {title: "NetworkTest"});
});


/* GET networkTest data. */
router.get('/networkTest/getNetworkData.json', function(req, res, next) {
	  sendNetworkData(req, res);
});

/* GET home page. */
router.get('/canvasTest', function(req, res, next) {
	var db = req.db;
	var powerSupplies = db.get('powerSupplies');
	var powerSuppliesList = 0;
	var nodes = db.get('nodes');
	var nodesList = 0;
	var transmissionLines = db.get('transmissionLines');
	var transmissionLinesList = 0;
	var powerConsumers = db.get('powerConsumers');
	var powerConsumersList = 0;
	var batteries = db.get('batteries');
	var batteriesList = 0;
	var resistors = db.get('resistors');
	var resistorsList = 0;
	//pull data from db in a series and then render it to the jade view
	powerSupplies.find({},{}, function(e, docs){
		powerSuppliesList = docs;
		transmissionLines.find({},{}, function(e, docs){
			transmissionLinesList = docs;
			powerConsumers.find({},{}, function(e, docs){
				powerConsumersList = docs;
				batteries.find({},{}, function(e, docs){
					batteriesList = docs;
					resistors.find({},{}, function(e, docs){
						resistorsList = docs;
						nodes.find({},{}, function(e, docs){
							nodesList = docs;
							res.render('canvasTest', { title: 'Canvas Test', 
													   "nodesList" : nodesList, 
													   "powerSuppliesList" : powerSuppliesList,
													   "transmissionLinesList" : transmissionLinesList,
													   "powerConsumersList" : powerConsumersList,
													   "batteriesList" : batteriesList,
													   "resistorsList" : resistorsList
													   });
						});
					});
					
				});
			});
		});
	});
});










//HELPER FUNCTIONS-------------------------------------------------
function sendNetworkData(req, res){
	var db = req.db;
	var powerSupplies = db.get('powerSupplies');
	var powerSuppliesList = 0;
	var connectors = db.get('connectors');
	var connectorsList = 0;
	var transmissionLines = db.get('transmissionLines');
	var transmissionLinesList = 0;
	var powerConsumers = db.get('powerConsumers');
	var powerConsumersList = 0;
	var batteries = db.get('batteries');
	var batteriesList = 0;
	var resistors = db.get('resistors');
	var resistorsList = 0;
	var returnList = 0;
	//pull data from db in a series and then render it to the jade view
	powerSupplies.find({},{}, function(e, docs){
		powerSuppliesList = docs;
		transmissionLines.find({},{}, function(e, docs){
			transmissionLinesList = docs;
			powerConsumers.find({},{}, function(e, docs){
				powerConsumersList = docs;
				batteries.find({},{}, function(e, docs){
					batteriesList = docs;
					resistors.find({},{}, function(e, docs){
						resistorsList = docs;
						connectors.find({},{}, function(e, docs){
							connectorsList = docs;
							returnList = {
									"connectors" : connectorsList, 
									"powerSupplies" : powerSuppliesList,
									"transmissionLines" : transmissionLinesList,
									"powerConsumers" : powerConsumersList,
									"batteries" : batteriesList,
									"resistors" : resistorsList
							};
							res.send(returnList);
						});
					});
					
				});
			});
		});
	});
}

module.exports = router;
