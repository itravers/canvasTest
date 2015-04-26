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
	var deltaTime = timePassed;
	var powerSupplies = scope.powerSuppliesList;
	//alpha algorithm
	for(var i = 0; i < powerSupplies.length; i++) {
	//{var i = 0; //test line
		var supply = powerSupplies[i];
		var node = getNodeFromPowerSupply(supply);
		//alpha.1.A integrate time passed with pps to get interim node power
		var interimPower = (supply.powerPerSecond * (deltaTime/1000));
		node.interimPower.push(interimPower);
		//alpha.2.B fix total power
		if(supply.totalPower > node.interimPower[node.interimPower.length - 1]){
			supply.totalPower = supply.totalPower - node.interimPower[node.interimPower.length - 1];
		}else{
			node.interimPower[node.interimPower.length -1] = supply.totalPower;
			supply.totalPower = 0;
		}
		calculateNeighbourNodes(node, deltaTime);
		resetNodesCalculation();
	}
	var nodes = scope.nodesList;
	
	//beta algorithm
	addUpInterimPowers(nodes);
	
	//delta algorithm
	calculateConsumers(deltaTime);
	
	
	
	//newAlgorithm to balance total powers we try to equalize total powers in the nodes
	equalizeNodePowers(nodes);
	var tLines = scope.transmissionLinesList;
	equalizeTLinePowers(tLines, deltaTime);
	
	scope.$apply(function(){
		//scope.powerSuppliesList = powerSupplies;
    });
	networkCanvas.draw();
}

function calculateConsumers(deltaTime){
	var consumers = scope.powerConsumersList;
	for(var i = 0; i < consumers.length; i++){
		var consumer = consumers[i];
		var node = getNodeFromID(consumer.nodeID);
		var powerDesired = consumer.consumptionPerSec * (deltaTime/1000);
		if(powerDesired > node.totalPower){ //we want more power than is available
			powerDesired = node.totalPower;  //so we take all the power
		}else{
			//powerDesired = powerDesired
		}
		consumer.suppliedPower = powerDesired;
		node.totalPower -= powerDesired;
	}
}

function addUpInterimPowers(nodes){
	//beta algorithm
	for(var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		var totalPower = node.totalPower;
		for(var j = 0; j < node.interimPower.length; j++){
			totalPower += node.interimPower[j];
		}
		node.totalPower = totalPower;
		node.interimPower[node.interimPower.length -1] = 3.14;
		node.interimPower = [];
	}
}

function getNodeFromPowerSupply(powerSupply){
	var node = scope.nodesList.filter(function(v) {
	    return v._id === powerSupply.nodeID; // filter out appropriate one
	})[0];
	return node;
}

function getNeighboursFromNode(node){
	var neighbourIDS = node.neighbours;
	var neighbours = getNeighboursFromNeighbourIDS(neighbourIDS);
	return neighbours;
}

function getNeighboursFromNeighbourIDS(neighbourIDS){
	var neighbours = [];
	for(var i = 0; i < neighbourIDS.length; i++){
		var id = neighbourIDS[i];
		var newNode = getNodeFromID(id);
		if(!newNode.calculated){ //this stops us from unlimited loops of the graph
			neighbours.push(getNodeFromID(id));
		}
	}
	return neighbours;
}

function getNodeFromID(id){
	var node = scope.nodesList.filter(function(v) {
	    return v._id === id; // filter out appropriate one
	})[0];
	return node;
}

function calculateNeighbourNodes(node, deltaTime){
	//alpha.2.C
	var neighbours = getNeighboursFromNode(node);
	if(neighbours.length == 0)return; //there are no neighbors to calculate
	var neighbourPower = node.interimPower[node.interimPower.length -1] / neighbours.length;
	//alpha.2.D
	var nnode;
	for(var i = 0; i < neighbours.length; i++){
		nnode = neighbours[i];
		nnode.interimPower.push(neighbourPower);
	}
	//alpha.2.D.insert
	//node.interimPower.pop();
	node.interimPower[node.interimPower.length -1] = 0;
	node.calculated = true;
	//alpha.2.E
	for(var i = 0; i < neighbours.length; i++){
		nnode = neighbours[i];
		//if this node is attached to a tLine, calculate the other nodes info
		//alpha.1.E.II
		if(nnode.belongsToLine){
			//calculate Power Transmission
			var nodeB = getOtherTLineNode(nnode);
			transferPower(nnode, nodeB, deltaTime);
			nnode.calculated = true;
			calculateNeighbourNodes(nodeB, deltaTime);
		}else if(nnode.belongsToConsumer){
			//alert("nnode belongstoConsumer "+nnode._id);
			//calculate n
			//here is where we will make the consumer have power
			nnode.calculated = true;
		}else{
			calculateNeighbourNodes(nnode, deltaTime);
			nnode.calculated = true; //makes sure the last node in graph is marked calculated
		}
	}
}

//returns the OTHER node connected to this node
function getOtherTLineNode(node){
	var tLineID = getTLineIDFromNode(node);
	var tLine = getTLineFromID(tLineID);
	var nodes = getNodesFromTLine(tLine);
	var otherNode = 0;
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i]._id != node._id){
			otherNode = nodes[i];
		}
	}
	return otherNode;
}

//transfers power from nodeA to nodeB based on the tLine inbetween.
function transferPower(nodeA, nodeB, deltaTime){
	/* test transfer
	 var transferPower = nodeA.interimPower[nodeA.interimPower.length -1]/2;
	nodeB.interimPower.push(transferPower);
	nodeA.interimPower[nodeA.interimPower.length -1] = nodeA.interimPower[nodeA.interimPower.length -1] - transferPower;
	 */
	
	var tLine = getTLineFromNode(nodeA);
	var p1 = nodeA.interimPower[nodeA.interimPower.length -1];
	var l = getDistance(nodeA, nodeB);
	var s = deltaTime/1000;
	var d = tLine.dParam;
	var k = tLine.kParam;
	
	//if a resistor exists for this line, modify d and k
	var resistor = getResistor(tLine);
	if(resistor != undefined){
		d = resistor.dParam;
		k = resistor.kParam;
	}
	
	var p = (s * p1) / (d^(l/k));
	nodeB.interimPower[nodeB.interimPower.length -1] = p;

}

//returns a tline from our data with a matching id
function getTLineFromID(id){
	var tLine = scope.transmissionLinesList.filter(function(v) {
	    return v._id === id; // filter out appropriate one
	})[0];
	return tLine;
}

//returns the nodes associated to a tLine
function getNodesFromTLine(tLine){
	var nodes = [];
	var nodeAID = tLine.nodeAID;
	var nodeBID = tLine.nodeBID;
	var nodeA = getNodeFromID(nodeAID);
	var nodeB = getNodeFromID(nodeBID);
	nodes.push(nodeA);
	nodes.push(nodeB);
	return nodes;
}

function getTLineIDFromNode(node){
	var nodeID = node._id;
	var tLines = scope.transmissionLinesList;
	var id = 0;
	for(var i = 0; i < tLines.length; i++){
		if(tLines[i].nodeAID == node._id || tLines[i].nodeBID == node._id){
			id = tLines[i]._id;
		}
	}
	return id;
}

function resetNodesCalculation(){
	var nodes = scope.nodesList;
	//alpha algorithm
	for(var i = 0; i < nodes.length; i++) {
		nodes[i].calculated = false;
	}
}

/* Transverse the node and equalize total power with neighbors total powers */
function equalizeNodePowers(nodes){
	for(var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		if(!node.equalized || i == nodes.length-1){ //we need to equalize the last node no matter what
			var neighbours = getNeighboursFromNode(node);
			var filteredNeighbours = [];
			//filter neighbours based on if they have already been equalized
			for(var j = 0; j < neighbours.length; j++){
				var neighbour = neighbours[j];
				if(neighbour.equalized == true){
					//we don't want this in our filtered array
				}else{
					//we do want this in our filtered array.
					filteredNeighbours.push(neighbour);
				}
			}
			
			if(i == nodes.length-1){ //if this is the last node we want to balance it with all neighbors
				filteredNeighbours = neighbours;
			}
			
			
			//equalize power between this node and all it's neighbor nodes
			//first we figure out what the equalized power for all the neighbors will be
			var equalizedPower = node.totalPower; 
			for(var j = 0; j < filteredNeighbours.length; j++){
				var neighbour = filteredNeighbours[j];
				equalizedPower += neighbour.totalPower;
			}
			equalizedPower /= (filteredNeighbours.length + 1); //the average of the power of all the nodes
			
			//distribute this equalized power to each node
			node.totalPower = equalizedPower;
			node.equalized = true; //set node equalized
			for(var j = 0; j < filteredNeighbours.length; j++){
				var n = filteredNeighbours[j];
				n.totalPower = equalizedPower;
				n.equalized = true; //set neighbour as equalized
			}
		}
		//add all power in nodes connected to a power supply, back to the power supply
		if(node.belongsToPowerSupply){
			var supply = getPowerSupplyFromNode(node);
			supply.totalPower += node.totalPower;
			node.totalPower = 0;
		}
	}
	
	//now that node powers are equalized for this calculation we need to reset their
	//calculated field
	
	for(var j = 0; j < nodes.length; j++){
		var n = nodes[j];
		n.equalized = false;
	}
}

function getPowerSupplyFromNode(node){
	var supplies = scope.powerSuppliesList;
	for(var i = 0; i < supplies.length; i++){
		var supply = supplies[i];
		if(supply.nodeID == node._id)return supply;
	}
}

function getTLineFromNode(node){
	var tLineID = getTLineIDFromNode(node);
	var tLine = getTLineFromID(tLineID);
	return tLine;
}

//returns the distance between two nodes
function getDistance(nodeA, nodeB){
	var x1 = nodeA.location.x;
	var x2 = nodeB.location.x;
	var y1 = nodeA.location.y;
	var y2 = nodeB.location.y;
	var d = Math.sqrt(((x2-x1)^2)+((y2-y1)^2));
	return d;
}

//returns the resistor associated with tLine, or undefined if none
function getResistor(tLine){
	var resistors = scope.resistorsList;
	for(var i = 0; i < resistors.length; i++){
		if(resistors[i].tLineID == tLine._id)return resistors[i];
	}
}

//loop through every transmission line and equalize powers from nodes, based on
//the function
function equalizeTLinePowers(tLines, deltaTime){
	for(var i = 0; i < tLines.length; i++){
		var tLine = tLines[i];
		var nodes = getNodesFromTLine(tLine);
		var nodeA = nodes[0];
		var nodeB = nodes[1];
		
		var tLine = getTLineFromNode(nodeA);
		var nodeAP1 = nodeA.totalPower;
		var nodeBP1 = nodeB.totalPower;
		var l = getDistance(nodeA, nodeB);
		var s = deltaTime/1000;
		var d = tLine.dParam;
		var k = tLine.kParam;
		
		//if a resistor exists for this line, modify d and k
		var resistor = getResistor(tLine);
		if(resistor != undefined){
			d = resistor.dParam;
			k = resistor.kParam;
		}
		
		var nodeAP = (s * nodeAP1) / (d^(l/k));
		var nodeBP = (s * nodeBP1) / (d^(l/k)); 
		nodeA.totalPower = nodeAP;
		nodeB.totalPower = nodeBP;
	}
}