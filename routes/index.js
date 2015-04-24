var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
	powerSupplies.find({},{}, function(e, docs){
		powerSuppliesList = docs;
		//res.render('canvasTest', { title: 'Canvas Test', "powerSuppliesList" : docs });
	});
	
	transmissionLines.find({},{}, function(e, docs){
		transmissionLinesList = docs;
	});
	
	powerConsumers.find({},{}, function(e, docs){
		powerConsumersList = docs;
	});
	
	batteries.find({},{}, function(e, docs){
		batteriesList = docs;
	});
	
	
	nodes.find({},{}, function(e, docs){
		nodesList = docs;
		res.render('canvasTest', { title: 'Canvas Test', 
								   "nodesList" : nodesList, 
								   "powerSuppliesList" : powerSuppliesList,
								   "transmissionLinesList" : transmissionLinesList,
								   "powerConsumersList" : powerConsumersList,
								   "batteriesList" : batteriesList
								   });
	});
	
	
	
  
});

module.exports = router;
