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
		distributeCharge:function(supply, charge){
			if(!this.getChargedSet()){//this node hasn't already been charged and distributed
				var numCon = this.getConnections().length;
				this.setCharge(supply, charge);
				var newCharge;
				if(numCon > 1 && supply != this){
					newCharge = charge / (numCon-1);
				}else{
					 newCharge = charge / numCon;
				}
				
				for(var i = 0; i < numCon; i++){
					var conID = this.connections[i];
				    var con;
					con = getConnectorFromID(conID);
					con.distributeCharge(supply, newCharge);
				}
			}
			
		}, 
		setCharge:function(supply, charge){
			//loop through charges to see if there is a supply that matches this one
			var id = supply.getID();
			var foundIndex = -1;
			for(var i = 0; i < this.charges.length; i++){
				
				if(this.charges[i].supply == id){
					foundIndex = i;
				}
			}
			
			if(foundIndex == -1){//charge has not been found
				var newCharge = {supply:supply.getID(), charge:charge};
				this.charges.push(newCharge);
			}else{
				this.charges[foundIndex] = {supply:supply.getID(),
						   		   charge:charge};
			}
			
			this.chargeSet = true;
		
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
			return this.chargeSet;
		},
		setChargedSet:function(chargedSet){
			this.chargeSet = chargedSet;
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
	    },
	    getTotalCharge:function(){
	    	var totalCharge = 0;
	    	for(var i = 0; i < this.charges.length; i++){
	    		totalCharge += this.charges[i].charge;
	    	}
	    	return totalCharge;
	    }
		
};