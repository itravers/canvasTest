//Objects
function MenuItem (xLoc, yLoc, xSize, ySize){   
	this.location = [xLoc, yLoc];
	this.size = [xSize, ySize];
	this.backgroundColor = 'blue';
	this.shapes = [];
}
MenuItem.prototype = {    
		constructor: MenuItem,    
		initMenuItem:function(location){        
			
		},
		draw:function(ctx){
			alert("draw " + ctx.canvas.width);
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(this.location[0], this.location[1], this.size[0], this.size[1]);
		}
}