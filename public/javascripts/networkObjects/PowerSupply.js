/**
 * Network Power Supply
 */

function PowerSupply (p){
	this.prototype = new NetworkNode(p);
	this.totalPower = p.totalPower;
	this.chargeSupplied = p.chargeSupplied;
}
PowerSupply.prototype = {    
		constructor: PowerSupply, 
		distributeCharge:function(){  
			this.prototype.distributeCharge();
		},
		getLocation:function(){
			return this.prototype.getLocation();
		}

};