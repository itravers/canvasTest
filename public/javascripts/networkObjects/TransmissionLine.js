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
			return this.prototype.getChargedSet();
		},
		setChargedSet:function(chargedSet){
			this.prototype.setChargedSet(chargedSet);
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