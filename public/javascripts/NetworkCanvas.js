//Objects
function NetworkCanvas (canvas, width, height){
	//alert(JSON.stringify( nodesList ));
	//alert(nodesList[0]["_id"]);
	//alert(powerSuppliesList[0]["_id"]);
	
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.setupCanvas(width, height);
	this.fillBackground("gray");
	this.menu = [];
	this.initializeMenu();
	this.draw(this.ctx);
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
		draw:function(ctx){
			//alert(nodesList);
			//this.drawMenu(ctx);
			for(var i = 0; i < nodesList.length; i++){
				this.drawNode(ctx, nodesList[i]);
			}
			for(var i = 0; i < powerSuppliesList.length; i++){
				this.drawPowerSupply(ctx, powerSuppliesList[i]);
			}
			
		},
		drawMenu:function(ctx){
			for(var i = 0; i < this.menu.length; i++){
				this.menu[i].draw(ctx);
			}
		},
		drawNode:function(ctx, node){
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,10,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = 'blue';
		}
		,
		drawPowerSupply:function(ctx, supply){
			alert("drawPowerSupply");
			var nodeID = supply["nodeID"];
			var node = nodesList.filter(function(v) {
			    return v._id === nodeID; // filter out appropriate one
			})[0];
			var loc = {x : node["location"]["x"], y : node["location"]["y"]};
			
			var style = ctx.strokeStyle;
			ctx.strokeStyle = 'green';
			ctx.beginPath();
			ctx.arc(loc.x,loc.y,30,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle = style;
		}
}