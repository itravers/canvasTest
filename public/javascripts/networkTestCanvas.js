function NetworkTestCanvas (canvas, width, height){
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.setupCanvas(width, height);
	this.mousePos = {};
	//this.draw();
}
NetworkTestCanvas.prototype = {    
		constructor: NetworkTestCanvas,    
		setupCanvas:function(width, height){        
			this.ctx.canvas.width = width;
			this.ctx.canvas.height = height;
			this.ctx.canvas.onmousemove = function (e) {
			   // alert("mouseMoved " + JSON.stringify(e));
			};
			
			this.ctx.canvas.addEventListener('mousemove', function(evt) {
		       this.mousePos = getMousePos(canvas, evt);
		       var message = 'Mouse position: ' + this.mousePos.x + ',' + this.mousePos.y;
		       writeMessage(message, canvas);
		      }, false);
		}, 
		fillBackground:function (color){        
			this.ctx.fillStyle = color;
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		},
		draw:function(networkData){
			//var scope = angular.element($("#networkTestApp")).scope();
			ctx = this.canvas.getContext("2d");
			this.fillBackground("black");
				this.drawNetworkData(networkData);
			
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
		drawNetworkData:function(networkData){
				var supplies = 0;
				supplies = networkData.powerSupplies;
				var powerConsumers = networkData.powerConsumers;
				var connectors = networkData.connectors;
				var transmissionLines = networkData.transmissionLines;
				var resistors = networkData.resistors;
				var batteries = networkData.batteries;
				data = [];
				data.push(supplies);
				data.push(powerConsumers);
				data.push(connectors);
				data.push(transmissionLines);
				data.push(resistors);
				data.push(batteries);
				for(var i = 0; i < supplies.length; i++) this.drawPowerSupply(supplies[i]);
				for(var i = 0; i < powerConsumers.length; i++) this.drawPowerConsumer(powerConsumers[i]);
				for(var i = 0; i < connectors.length; i++) this.drawConnector(connectors[i]);
				for(var i = 0; i < batteries.length; i++) this.drawBattery(batteries[i]);
				for(var i = 0; i < transmissionLines.length; i++) this.drawTransmissionLine(transmissionLines[i], data);
				for(var i = 0; i < resistors.length; i++) this.drawResistor(resistors[i], data);
		},
		drawResistor:function(r, data){
			var tLineID = r.getTLine();
			var tLine = this.getConnectorFromID(tLineID, data);
			var conAID = tLine.getConA();
			var conBID = tLine.getConB();
			var conA = this.getConnectorFromID(conAID, data);
			var conB = this.getConnectorFromID(conBID, data);
			var locA = conA.getLocation();
			var locB = conB.getLocation();
			var loc = this.getMidPoint(locA, locB);
			this.drawSquare("pink", loc, 10);
		},
		drawTransmissionLine:function(tLine, data){
			var conAID = tLine.getConA();
			var conBID = tLine.getConB();
			var conA = this.getConnectorFromID(conAID, data);
			var conB = this.getConnectorFromID(conBID, data);
			var locA = conA.getLocation();
			var locB = conB.getLocation();
			this.drawLine("yellow", locA, locB);
			//alert(JSON.stringify(data));
		},
		drawBattery:function(battery){
			var loc = battery.getLocation();
			var totalPower = battery.getTotalPower();
			var chargeSupplied = battery.getChargeSupplied();
			var consumerCharge = battery.getConsumerCharge();
			var chargeSuppliedCircleSize = this.map(chargeSupplied, 0 ,1000,2 ,250 );
			var totalPowerCircleSize = this.map(totalPower, 0 ,100000,2 ,250 );
			var consumerChargeSize = this.map(consumerCharge, 0 ,1000 ,2 ,200 );
			this.drawCircle(totalPowerCircleSize, loc, "red");
			this.drawCircle(chargeSuppliedCircleSize, loc, "yellow");
			this.drawCircle(consumerChargeSize, loc, "blue");
		},
		drawPowerSupply:function(powerSupply){
			var loc = powerSupply.getLocation();
			var totalPower = powerSupply.getTotalPower();
			var chargeSupplied = powerSupply.getChargeSupplied();
			var totalPowerCircleSize = this.map(totalPower, 0 ,100000,2 ,150 );
			var chargeSuppliedCircleSize = this.map(chargeSupplied, 0 ,1000,2 ,250 );
			this.drawCircle(totalPowerCircleSize, loc, "red");
			this.drawCircle(chargeSuppliedCircleSize, loc, "yellow");
		},
		drawPowerConsumer:function(powerConsumer){
			var loc = powerConsumer.getLocation();
			var consumerCharge = powerConsumer.getConsumerCharge();
			var consumerChargeSize = this.map(consumerCharge, 0 ,1000,2 ,250 );
			this.drawCircle(consumerChargeSize, loc, "blue");
		},
		drawConnector:function(connector){
			var loc = connector.getLocation();
			this.drawCircle(5, loc, "green");
		},
		drawCircle:function(size, loc, color){
			ctx = this.canvas.getContext("2d");
			var style = ctx.strokeStyle;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,size,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		drawSquare:function(color, loc, size){
			var style = ctx.fillStyle;
			ctx.fillStyle=color;
			ctx.fillRect(loc.x-(size/2), loc.y-(size/2), size, size);
			ctx.fillStyle = style;
		},
		drawLine:function(color, locA, locB){
			var style = ctx.strokeStyle;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(locA.x, locA.y);
			ctx.lineTo(locB.x, locB.y);
			ctx.stroke();
			ctx.strokeStyle = style;
		},
		getConnectorFromID:function(id, data){
			for(var i = 0; i < data.length; i++){
				var list = data[i];
				for(var n = 0; n < list.length; n++){
					var item = list[n];
					if((item.getID() == id)){
						return item;
					}
				}
			}
		}
}
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function writeMessage(message, canvas) {
	ctx = canvas.getContext("2d");
	var style = ctx.fillStyle;
	ctx.fillStyle="black";
	ctx.fillRect(0, 0, 300, 30);
	ctx.fillStyle = style;
	
    ctx.font = '18pt Calibri';
    ctx.fillStyle = 'white';
    ctx.fillText(message, 10, 25);
 }