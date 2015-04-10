//Objects
function NetworkCanvas (canvas, width, height){   
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
			this.drawMenu(ctx);
		},
		drawMenu:function(ctx){
			for(i = 0; i < this.menu.length; i++){
				this.menu[i].draw(ctx);
			}
		}
}