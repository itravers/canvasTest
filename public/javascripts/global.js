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
	//alpha algorithm
	for(var i = 0; i < powerSupplies.length; i++) {
	//for(var i = 1; i < 1; i++) {
	//{
		//var i = 1;
		var supply = powerSupplies[i];
		var node = getNodeFromPowerSupply(supply);
		//var node = nodes.filter(function(v) {
		//    return v._id === supply.nodeID; // filter out appropriate one
		//})[0];
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
		
		calculateNeighbourNodes(node);
		resetNodesCalculation();
		
	}
	scope.$apply(function(){
		//scope.powerSuppliesList = powerSupplies;
    });
	networkCanvas.draw();
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

function calculateNeighbourNodes(node){
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
	node.interimPower.pop();
	node.calculated = true;
	//alpha.2.E
	for(var i = 0; i < neighbours.length; i++){
		nnode = neighbours[i];
		//if this node is attached to a tLine, calculate the other nodes info
		//alpha.1.E.II
		if(nnode.belongsToLine){
			//calculate Power Transmission
			var nodeB = getOtherTLineNode(nnode);
			transferPower(nnode, nodeB);
			nnode.calculated = true;
			calculateNeighbourNodes(nodeB);
		}else if(nnode.belongsToConsumer){
			//alert("nnode belongstoConsumer "+nnode._id);
			//calculate n
			//here is where we will make the consumer have power
			nnode.calculated = true;
		}else{
			calculateNeighbourNodes(nnode);
			nnode.calculated = true;
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
function transferPower(nodeA, nodeB){
	var transferPower = nodeA.interimPower[nodeA.interimPower.length -1]/2;
	nodeB.interimPower.push(transferPower);
	nodeA.interimPower[nodeA.interimPower.length -1] = nodeA.interimPower[nodeA.interimPower.length -1] - transferPower;
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




