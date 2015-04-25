//Objects
//to make a db object available here..
//1. pull the object out of db in index.js and send to jade template
//2. make new frontend js variable using the jade template
//3. utilize that variable here ie batteriesList
function NetworkCanvas (canvas, width, height){
	//alert(JSON.stringify( scope.nodesList ));
	//alert(scope.nodesList[0]["_id"]);
	//alert(powerSuppliesList[0]["_id"]);
	
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.setupCanvas(width, height);
	
	this.menu = [];
	this.initializeMenu();
	this.draw();
}
NetworkCanvas.prototype = {    
		constructor: NetworkCanvas,    
		setupCanvas:function(width, height){        
			this.ctx.canvas.width = width;
			this.ctx.canvas.height = height;
		},    
		fillBackground:function (color){        
			this.ctx.fillStyle = color;
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		},    
		initializeMenu:function(){
			var menuSize = 100;
			for(i = 0; i < 4; i++){
				var menuItem = new MenuItem(this.ctx.canvas.width-menuSize, 0+(i*menuSize), menuSize, menuSize);
				this.setMenuItem(menuItem);
			}
			
		},
		setMenuItem:function (menuItem){        
			this.menu.push(menuItem);
		},
		draw:function(){
			var scope = angular.element($("#canvasTestApp")).scope();
			ctx = this.canvas.getContext("2d");
			this.fillBackground("gray");
			//alert(scope.nodesList);
			//this.drawMenu(ctx);
			for(var i = 0; i < scope.nodesList.length; i++){
				this.drawNode(ctx, scope.nodesList[i]);
			}
			for(var i = 0; i < scope.powerSuppliesList.length; i++){
				this.drawPowerSupply(ctx, scope.powerSuppliesList[i]);
			}
			for(var i = 0; i < scope.transmissionLinesList.length; i++){
				this.drawTransmissionLine(ctx, scope.transmissionLinesList[i]);
			}
			for(var i = 0; i < scope.powerConsumersList.length; i++){
				this.drawPowerConsumer(ctx, scope.powerConsumersList[i]);
			}
			for(var i = 0; i < scope.batteriesList.length; i++){
				this.drawBattery(ctx, scope.batteriesList[i]);
			}
			for(var i = 0; i < scope.resistorsList.length; i++){
				
				this.drawResistor(ctx, scope.resistorsList[i]);
			}
			
			
		},
		drawMenu:function(ctx){
			for(var i = 0; i < this.menu.length; i++){
				this.menu[i].draw(ctx);
			}
		},
		drawNode:function(ctx, node){
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			
			var size = 10;
			/*var nodePower = node.totalPower;
			var fillStyle = ctx.fillStyle;
			ctx.fillStyle = "red";
			ctx.font = "16px Arial";
			ctx.fillText(nodePower, loc.x-(size/2), loc.y + size);
			ctx.fillStyle = fillStyle;
			*/
			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = 'blue';
		}
		,
		drawPowerSupply:function(ctx, supply){
			var size = 30;
			//alert("drawPowerSupply");
			var nodeID = supply["nodeID"];
			var node = scope.nodesList.filter(function(v) {
			    return v._id === nodeID; // filter out appropriate one
			})[0];
			
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			
			var nodePower = node.totalPower;
			var fillStyle = ctx.fillStyle;
			ctx.fillStyle = "blue";
			ctx.font = "bold 16px Arial";
			ctx.fillText(nodePower, loc.x-(size/2), loc.y - size);
			ctx.fillStyle = fillStyle;
			
			var style = ctx.strokeStyle;
			ctx.strokeStyle = 'green';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		drawTransmissionLine:function(ctx, tLine){
			//alert("drawTLine");
			var nodeAID = tLine["nodeAID"];
			var nodeBID = tLine["nodeBID"];
			var nodeA = scope.nodesList.filter(function(v) {
			    return v._id === nodeAID; // filter out appropriate one
			})[0];
			var nodeB = scope.nodesList.filter(function(v) {
			    return v._id === nodeBID; // filter out appropriate one
			})[0];
			var loc = {x1 : nodeA["location"]["x"], y1 : nodeA["location"]["y"],
			           x2 : nodeB["location"]["x"], y2 : nodeB["location"]["y"]};
			//alert(JSON.stringify(loc));
			
			var locMid = this.getMidPoint({x : loc.x1, y : loc.y1}, {x : loc.x2, y : loc.y2});
			var size = 10;
			var nodePower = nodeA.totalPower;
			var fillStyle = ctx.fillStyle;
			ctx.fillStyle = "blue";
			ctx.font = "bold 16px Arial";
			ctx.fillText(nodePower, locMid.x-(size/2), locMid.y - size);
			ctx.fillStyle = fillStyle;
			
			
			var style = ctx.strokeStyle;
			ctx.strokeStyle = 'yellow';
			ctx.beginPath();
			ctx.moveTo(loc.x1, loc.y1);
			ctx.lineTo(loc.x2, loc.y2);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		drawPowerConsumer:function(ctx, consumer){
			//alert("drawPowerSupply");
			var nodeID = consumer["nodeID"];
			var node = scope.nodesList.filter(function(v) {
			    return v._id === nodeID; // filter out appropriate one
			})[0];
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			
			var size = 30;
			var nodePower = node.totalPower;
			var fillStyle = ctx.fillStyle;
			ctx.fillStyle = "blue";
			ctx.font = "bold 16px Arial";
			ctx.fillText(nodePower, loc.x-(size/2), loc.y - size);
			ctx.fillStyle = fillStyle;
			
			var style = ctx.strokeStyle;
			ctx.strokeStyle = 'BLUE';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		drawBattery:function(ctx, battery){
			//alert("drawPowerSupply");
			var nodeID = battery["nodeID"];
			var node = scope.nodesList.filter(function(v) {
			    return v._id === nodeID; // filter out appropriate one
			})[0];
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			
			var size = 20;
			var nodePower = node.totalPower;
			var fillStyle = ctx.fillStyle;
			ctx.fillStyle = "blue";
			ctx.font = "bold 16px Arial";
			ctx.fillText(nodePower, loc.x-(size/2), loc.y - size);
			ctx.fillStyle = fillStyle;
			
			var style = ctx.strokeStyle;
			ctx.strokeStyle = 'ORANGE';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		drawResistor:function(ctx, resistor){
			//get the associated transmission line
			var tLineID = resistor["tLineID"];
			
			var tLine = scope.transmissionLinesList.filter(function(v){
				return v._id === tLineID;
			})[0];
			//alert(tLine);
			//get the associated nodes
			var nodeAID = tLine["nodeAID"];
			var nodeBID = tLine["nodeBID"];
			
			var nodeA = scope.nodesList.filter(function(v) {
			    return v._id === nodeAID; // filter out appropriate one
			})[0];
			
			var nodeB = scope.nodesList.filter(function(v) {
			    return v._id === nodeBID; // filter out appropriate one
			})[0];
			
			//get the locations from the nodes
			var locA = {x : nodeA["location"]["x"], y : nodeA["location"]["y"]};
			var locB = {x : nodeB["location"]["x"], y : nodeB["location"]["y"]};
			var loc = this.getMidPoint(locA, locB);
			
			//var loc = getMidPoint(locA, locB);
			var size = 10;
			
			 var style = ctx.fillStyle;
			 ctx.fillStyle="BLACK";
			 ctx.fillRect(loc.x-(size/2), loc.y-(size/2), size, size);
			 ctx.fillStyle = style;

			 
		},
		getMidPoint:function(locA, locB){
			var x = (locA.x + locB.x)/2;
			var y = (locA.y + locB.y)/2;
			var loc = {x : x, y : y};
			return loc;
		}
}