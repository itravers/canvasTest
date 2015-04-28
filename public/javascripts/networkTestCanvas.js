//Objects
//to make a db object available here..
//1. pull the object out of db in index.js and send to jade template
//2. make new frontend js variable using the jade template
//3. utilize that variable here ie batteriesList
function NetworkTestCanvas (canvas, width, height){
	//alert(JSON.stringify( scope.nodesList ));
	//alert(scope.nodesList[0]["_id"]);
	//alert(powerSuppliesList[0]["_id"]);
	
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.setupCanvas(width, height);
	this.draw();
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
		draw:function(){
			var scope = angular.element($("#networkTestApp")).scope();
			ctx = this.canvas.getContext("2d");
			this.fillBackground("white");
			//this.draw
			
		},
		getMidPoint:function(locA, locB){
			var x = (locA.x + locB.x)/2;
			var y = (locA.y + locB.y)/2;
			var loc = {x : x, y : y};
			return loc;
		},
		map:function (num, in_min ,in_max ,out_min ,out_max ) {
			  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		}
}