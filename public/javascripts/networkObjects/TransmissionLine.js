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
				var con = this.getFirstUnchargedConnector();
				var con2ID = this.getOtherConID(con);
				var newCharge = this.calculateTransfer(charge, con.getID(), con2ID);
				if(con == undefined) return; //there are no uncharged connectors on this power line
				this.chargeSet = true;
				con.distributeCharge(supply, newCharge);
			}
			
		},
		calculateTransfer:function(charge, con1ID, con2ID){
			var connectorA = getConnectorFromID(this.conA);
			var connectorB = getConnectorFromID(this.conB);
			var locA = connectorA.getLocation();
			var locB = connectorB.getLocation();
			var l = this.getDistance(locA, locB);
			var d = this.dParam;
			var k = this.kParam;
			
			if(this.resistor != "NONE"){
				var r = getConnectorFromID(this.resistor);
				k = r.getKParam();
				d = r.getDParam();
			}
			
			
			var tCharge = charge / (Math.pow(d, (l/k))); //my formula lover
			
			return tCharge;
		},
		getOtherConID:function(conID){
			if(conID == this.conA){
				return this.conB;
			}else{
				return this.conA;
			}
		},//returns the distance between two nodes
		getDistance:function(locA, locB){
			var x1 = locA.x;
			var x2 = locB.x;
			var y1 = locA.y;
			var y2 = locB.y;
			
			var d = Math.sqrt((Math.pow((x2-x1), 2))+(Math.pow((y2-y1), 2)));
			return d;
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