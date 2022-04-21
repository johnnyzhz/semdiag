/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *     
 ***************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//define the svg and arrows
//定义svg画布，以及静态元素：连线箭头
var mysvg = d3.select('#svgcontainer').append('svg').attr("width",w).attr("height",h);  
var defs1 = mysvg.append('svg:defs');
var arrowfake=defs1.append('svg:marker')
	.attr("id", "arrowfake")
	.attr('viewBox', '0 -5 15 5')
	.attr("refX", "15")
	.attr("refY", "0")
	.attr('markerWidth', 7)
	.attr('markerHeight', 10)
	.attr('orient', 'auto');
	arrowfake.append('svg:polyline')
		.attr("points", "0,0 15,-5 15,5")
		.attr("stroke-width", "1px")
		.attr("stroke", "none")
		.attr("fill", "none");	
//defaultCOLOR
//定义连线结束端的箭头 	
var defs2 = mysvg.append('svg:defs');
var endarrow=defs2.append('svg:marker')
	.attr("id", "endarrow")
	.attr('viewBox', '0 -5 15 5')
	.attr("refX", "15")
	.attr("refY", "0")
	.attr('markerWidth', 1)
	.attr('markerHeight', 1)
	.attr('orient', 'auto');
	endarrow.append('svg:polyline')
		.attr("points", "0,-5 0,5 15,0 ")
		.attr("stroke-width", "1px")
		.attr("stroke", backgroundCOLOR)
		.attr("fill", backgroundCOLOR);	
//定义连线开始端的箭头 (双向路径的情形)
var defs3 = mysvg.append('svg:defs');
var beginarrow=defs3.append('svg:marker')
	.attr("id", "beginarrow")
	.attr('viewBox', '0 -5 15 5')
	.attr("refX", "15")
	.attr("refY", "0")
	.attr('markerWidth', 7)
	.attr('markerHeight', 10)
	.attr('orient', 'auto');
	beginarrow.append('svg:polyline')
		.attr("points", "0,0 15,-5 15,5")
		.attr("stroke-width", "1px")
		.attr("stroke", defaultCOLOR)
		.attr("fill", defaultCOLOR);	
//BLACK, RED , BLUE, GREEN:
for(var i=0; i<COLORlist.length; i++){

	//定义连线结束端的箭头 		
	var tempdefs1 = mysvg.append('svg:defs');
	var endarrow=tempdefs1.append('svg:marker')
		.attr("id", "endarrow"+COLORlist[i])
		.attr('viewBox', '0 -5 15 5')
		.attr("refX", "15")
		.attr("refY", "0")
		.attr('markerWidth', 7)
		.attr('markerHeight', 10)
		.attr('orient', 'auto');
		endarrow.append('svg:polyline')
			.attr("points", "0,-5 0,5 15,0 ")
			.attr("stroke-width", "1px")
			.attr("stroke", COLORlist[i])
			.attr("fill", COLORlist[i]);	
	//定义连线开始端的箭头 (双向路径的情形)
	var tempdefs2 = mysvg.append('svg:defs');
	var beginarrow= tempdefs2.append('svg:marker')
		.attr("id", "beginarrow"+COLORlist[i])
		.attr('viewBox', '0 -5 15 5')
		.attr("refX", "15")
		.attr("refY", "0")
		.attr('markerWidth', 7)
		.attr('markerHeight', 10)
		.attr('orient', 'auto');
		beginarrow.append('svg:polyline')
			.attr("points", "0,0 15,-5 15,5")
			.attr("stroke-width", "1px")
			.attr("stroke", COLORlist[i])
			.attr("fill", COLORlist[i]);
}
