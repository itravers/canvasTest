/**
 * Transmission Line
 */

function TransmissionLine (p){
	this._id = p._id;
	this.type = p.type;
	this.conA = p.conA;
	this.conB = p.conB;
	this.dParam = p.dParam;
	this.kParam = p.kParam;
	this.resistor = p.resistor;
	this.chargeSet = p.chargeSet;
}
TransmissionLine.prototype = {    
		constructor: TransmissionLine,
		distributeCharge:function(supply, charge){  
			if(this.chargeSet != true){//this has already been charged, ignore it if so
				var newCharge = this.calculateTransfer(charge, this.conA, this.conB);
				var con = this.getFirstUnchargedConnector();
				if(con == undefined) return; //there are no uncharged connectors on this power line
				this.chargeSet = true;
				con.distributeCharge(supply, newCharge);
			}
			
		},
		calculateTransfer:function(charge, con1, con2){
			return charge;
		},
		getFirstUnchargedConnector:function(){
			var connectorA = getConnectorFromID(this.conA);
			var connectorB = getConnectorFromID(this.conB);
			if(!connectorA.getChargedSet()){
				return connectorA;
			}else if(!connectorB.getChargedSet()){
				return connectorB;
			}
		},
		getResistor:function(){
			return this.resistor;
		},
		setResistor:function(resistor){
			this.resistor = resistor;
		},
		getDParam:function(){
			return this.dParam;
		},
		setDParam:function(dParam){
			this.dParam = dParam;
		},
		getKParam:function(){
			return this.kParam;
		},
		setKParam:function(kParam){
			this.kParam = kParam;
		},
		getConA:function(){
			return this.conA;
		},
		setConA:function(conA){
			this.conA = conA;
		},
		getConB:function(){
			return this.conB;
		},
		setConB:function(conB){
			this.conB = conB;
		},
		getChargedSet:function(){
			return this.chargeSet;
		},
		setChargedSet:function(chargedSet){
			this.chargeSet = chargedSet;
		},
		setID:function(id){
			this._id = id;
		},
		getID:function(){
			return this._id;
		},
		getType:function(){
			return this.type;
		},
		setType:function(type){
			this.type = type;
		}
};