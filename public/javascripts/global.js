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
	//{var i = 0; //test line
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
		calculateNeighbourNodes(node);
		resetNodesCalculation();
	}
	var nodes = scope.nodesList;
	
	
	
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
	
	//newAlgorithm to balance total powers we try to equalize total powers in the nodes
	equalizeNodePowers(nodes);
	
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

/* Transverse the node and equalize total power with neighbors total powers */
function equalizeNodePowers(nodes){
	for(var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		if(!node.equalized){
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
		
	}
	
	//now that node powers are equalized for this calculation we need to reset their
	//calculated field
	
	for(var j = 0; j < nodes.length; j++){
		var n = nodes[j];
		n.equalized = false;
	}
}




