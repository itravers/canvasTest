//Objects
function PowerNode (xLoc, yLoc, totalPower, interimPower, parent, children, belongsToLine){   
	this.location = [xLoc, yLoc];
	this.size = [totalPower, totalPower];
	this.backgroundColor = 'blue';
	this.totalPower = totalPower;
	this.interimPower = interimPower;
	this.parent = parent;
	this.children = children;
	this.belongsToLine = belongsToLine;
}
PowerNode.prototype = {    
		constructor: PowerNode,
		draw:function(ctx){
			//alert("draw " + ctx.canvas.width);
			ctx.strokeStyle = this.backgroundColor;
			ctx.rect(this.location[0], this.location[1], this.size[0], this.size[1]);
			ctx.stroke();
		}
}