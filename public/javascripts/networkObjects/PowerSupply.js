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
		setCharge:function(supply, charge){
			this.prototype.setCharge(supply, charge);
		},
		getTotalPower:function(){
			return this.totalPower;
		},
		setTotalPower:function(totalPower){
			this.totalPower = totalPower;
		},
		getChargeSupplied:function(){
			return this.chargeSupplied;
		},
		setChargeSupplied:function(charge){
			this.chargeSupplied = charge;
		},
		distributeCharge:function(supply, charge){
			this.prototype.distributeCharge(supply, charge);
		},
		distCharge:function(){  
			var charge = this.getChargeSupplied();
			this.prototype.distributeCharge(this, charge);
		},
		getLocation:function(){
			return this.prototype.getLocation();
		}, 
		getConnections:function(){
			return this.prototype.getConnections();
		},
		setConnections:function(connections){
			this.prototype.setConnections(connections);
		},
		getCharges:function(){
			return this.prototype.getCharges();
		},
		setCharges:function(charges){
			this.prototype.setCharges(charges);
		},
		getChargedSet:function(){
			return this.prototype.getChargedSet();
		},
		setChargedSet:function(chargedSet){
			this.prototype.setChargedSet(chargedSet);
		},
		getLocation:function(){  
			return this.prototype.getLocation();
		},
	    setLocation:function(loc){
	    	this.prototype.setLocation(loc);
	    },
	    getID:function(){
	    	return this.prototype.getID();
	    },
	    setID:function(id){
	    	this.prototype.setID(id);
	    },
	    getType:function(){
	    	return this.prototype.getType();
	    },
	    setType:function(type){
	    	this.prototype.setType(type);
	    }, 
	    getTotalCharge:function(){
	    	return this.prototype.getTotalCharge();
	    }

};