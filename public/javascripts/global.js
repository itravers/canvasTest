// DOM Ready =============================================================
$(document).ready(function() {
	setupCanvas();
});

// Functions =============================================================

function importScript(script){
	//importScript("/javascripts/NetworkCanvas.js");
	$.getScript("/javascripts/NetworkCanvas.js", function(){
		   alert("Script loaded and executed.");
		   // Use anything defined in the loaded script...
	});
}
function setupCanvas(){
	var networkCanvas = new NetworkCanvas(document.getElementById("canvas"), 1000, 550);
	
}


