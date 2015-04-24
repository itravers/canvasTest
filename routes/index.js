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
	powerSupplies.find({},{}, function(e, docs){
		powerSuppliesList = docs;
		//res.render('canvasTest', { title: 'Canvas Test', "powerSuppliesList" : docs });
	});
	
	transmissionLines.find({},{}, function(e, docs){
		transmissionLinesList = docs;
	});
	
	
	nodes.find({},{}, function(e, docs){
		nodesList = docs;
		res.render('canvasTest', { title: 'Canvas Test', 
								   "nodesList" : nodesList, 
								   "powerSuppliesList" : powerSuppliesList,
								   "transmissionLinesList" : transmissionLinesList
								   });
	});
	
	
	
  
});

module.exports = router;
