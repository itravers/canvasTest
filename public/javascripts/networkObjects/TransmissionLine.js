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
		getChargedSet:function(){
			return this.prototype.getChargedSet();
		},
		setChargedSet:function(chargedSet){
			this.prototype.setChargedSet(chargedSet);
		}
};