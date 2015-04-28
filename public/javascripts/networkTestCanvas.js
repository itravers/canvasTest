//Objects
//to make a db object available here..
//1. pull the object out of db in index.js and send to jade template
//2. make new frontend js variable using the jade template
//3. utilize that variable here ie batteriesList
function NetworkTestCanvas (canvas, width, height){
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.setupCanvas(width, height);
	//this.draw();
}
NetworkTestCanvas.prototype = {    
		constructor: NetworkTestCanvas,    
		setupCanvas:function(width, height){        
			this.ctx.canvas.width = width;
			this.ctx.canvas.height = height;
		},    
		fillBackground:function (color){        
			this.ctx.fillStyle = color;
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		},
		draw:function(data){
			//var scope = angular.element($("#networkTestApp")).scope();
			ctx = this.canvas.getContext("2d");
			this.fillBackground("black");
				this.drawNetworkData(data);
			
		},
		getMidPoint:function(locA, locB){
			var x = (locA.x + locB.x)/2;
			var y = (locA.y + locB.y)/2;
			var loc = {x : x, y : y};
			return loc;
		},
		map:function (num, in_min ,in_max ,out_min ,out_max ) {
			  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		},
		drawNetworkData:function(data){
			//var data = datum.data;
			if(data != undefined){
				var supplies = 0;
				supplies = data.powerSupplies;
				var powerConsumers = data.powerConsumers;
				var connectors = data.connectors;
				var transmissionLines = data.transmissionLines;
				var resistors = data.resistors;
				var batteries = data.batteries;
				if(supplies == undefined || powerConsumers == undefined){
					
				}else{
					for(var i = 0; i < supplies.length; i++) this.drawPowerSupply(supplies[i]);
					for(var i = 0; i < powerConsumers.length; i++) this.drawPowerConsumer(powerConsumers[i]);
				}
				
			}
		},
		drawPowerSupply:function(powerSupply){
			var loc = powerSupply.location;
			var totalPower = powerSupply.totalPower;
			var chargeSupplied = powerSupply.chargeSupplied;
			var totalPowerCircleSize = this.map(totalPower, 0 ,100000,2 ,150 );
			this.drawCircle(totalPowerCircleSize, loc, "red");
		},
		drawPowerConsumer:function(powerConsumer){
			var loc = powerConsumer.location;
			var consumerCharge = powerConsumer.consumerCharge;
			var totalPowerCircleSize = this.map(consumerCharge, 0 ,1000,2 ,250 );
			this.drawCircle(totalPowerCircleSize, loc, "blue");
		},
		drawCircle:function(size, loc, color){
			ctx = this.canvas.getContext("2d");
			var style = ctx.strokeStyle;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		}
}