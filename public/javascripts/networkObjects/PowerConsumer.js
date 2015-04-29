/**
 * Network Power Supply
 */

function PowerConsumer (p){
	this.prototype = new NetworkNode(p);
	this.consumerCharge = p.consumerCharge;
}
PowerConsumer.prototype = {    
		constructor: PowerConsumer, 
		getConsumerCharge:function(){
			return this.consumerCharge;
		},
		setConsumerCharge:function(consumerCharge){
			this.consuerCharge = consumerCharge;
		},
		distributeCharge:function(){  
			var charge = this.getChargeSupplied();
			this.prototype.distributeCharge(this, charge);
			//this.prototype.distributeCharge();
		},
		distributeCharge:function(supply, charge){  
			this.prototype.distributeCharge(supply, charge);
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
	    }

};