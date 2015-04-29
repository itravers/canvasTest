/**
 * Network node Supply
 */

function NetworkNode (p){
	//alert("constructing node");
	this._id = p._id;
	this.type = p.type;
	this.location = p.location;
	this.connections = p.connections;
	this.charges = p.charges;
	this.chargeSet = p.chargeSet;
}
NetworkNode.prototype = {    
		constructor: NetworkNode,    
		distributeCharge:function(){        
			alert(this._id+"dist Charge");
		}, 
		getConnections:function(){
			return this.connections;
		},
		setConnections:function(connections){
			this.connections = connections;
		},
		getCharges:function(){
			return this.charges;
		},
		setCharges:function(charges){
			this.charges = charges;
		},
		getChargedSet:function(){
			return this.chargedSet;
		},
		setChargedSet:function(chargedSet){
			this.chargedSet = chargedSet;
		},
		getLocation:function(){  
			return this.location;
		},
	    setLocation:function(loc){
	    	this.location = loc;
	    },
	    getID:function(){
	    	return this._id;
	    },
	    setID:function(id){
	    	this._id = id;
	    },
	    getType:function(){
	    	return this.type;
	    },
	    setType:function(type){
	    	this.type = type;
	    }
		
};