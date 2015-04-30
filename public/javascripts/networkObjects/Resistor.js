/**
 * Resistor
 */

function Resistor (p){
	this._id = p._id;
	this.type = p.type;
	this.tLine = p.tLine;
	this.dParam = p.dParam;
	this.kParam = p.kParam;
}
Resistor.prototype = {    
		constructor: Resistor,
		getTLine:function(){
			return this.tLine;
		},
		setTLine:function(tLine){
			this.tLine = tLine;
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
		setID:function(id){
			this._id = id;
		},
		getID:function(){
			return this._id;
		},
		setType:function(type){
			this.type= type;
		},
		getType:function(){
			return this.type;
		}
};