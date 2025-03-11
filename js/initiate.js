/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         *
 ***************************************************/
 var mysvg = d3.select("#svgcontainer").append("svg").attr("id", "svgmain").attr("width", w).attr("height", h),
 defs1 = mysvg.append("svg:defs"),
 arrowfake = defs1.append("svg:marker").attr("id", "arrowfake").attr("viewBox", "0 -5 15 5").attr("refX", "15").attr("refY", "0").attr("markerWidth", 7).attr("markerHeight", 10).attr("orient", "auto");
arrowfake.append("svg:polyline").attr("points", "0,0 15,-5 15,5").attr("stroke-width", "1px").attr("stroke", "none").attr("fill", "none");
var defs2 = mysvg.append("svg:defs"),
 endarrow = defs2.append("svg:marker").attr("id", "endarrow").attr("viewBox", "0 -5 15 5").attr("refX", "15").attr("refY", "0").attr("markerWidth", 1).attr("markerHeight", 1).attr("orient", "auto");
endarrow.append("svg:polyline").attr("points", "0,-5 0,5 15,0 ").attr("stroke-width", "1px").attr("stroke", backgroundCOLOR).attr("fill", backgroundCOLOR);
var defs3 = mysvg.append("svg:defs"),
 beginarrow = defs3.append("svg:marker").attr("id", "beginarrow").attr("viewBox", "0 -5 15 5").attr("refX", "15").attr("refY", "0").attr("markerWidth", 7).attr("markerHeight", 10).attr("orient", "auto");
beginarrow.append("svg:polyline").attr("points", "0,0 15,-5 15,5").attr("stroke-width", "1px").attr("stroke", defaultCOLOR).attr("fill", defaultCOLOR);
for (var i = 0; i < COLORlist.length; i++) {
 var tempdefs1 = mysvg.append("svg:defs"),
     endarrow = tempdefs1
         .append("svg:marker")
         .attr("id", "endarrow" + COLORlist[i])
         .attr("viewBox", "0 -5 15 5")
         .attr("refX", "15")
         .attr("refY", "0")
         .attr("markerWidth", 7)
         .attr("markerHeight", 10)
         .attr("orient", "auto");
 endarrow.append("svg:polyline").attr("points", "0,-5 0,5 15,0 ").attr("stroke-width", "1px").attr("stroke", COLORlist[i]).attr("fill", COLORlist[i]);
 var tempdefs2 = mysvg.append("svg:defs"),
     beginarrow = tempdefs2
         .append("svg:marker")
         .attr("id", "beginarrow" + COLORlist[i])
         .attr("viewBox", "0 -5 15 5")
         .attr("refX", "15")
         .attr("refY", "0")
         .attr("markerWidth", 7)
         .attr("markerHeight", 10)
         .attr("orient", "auto");
 beginarrow.append("svg:polyline").attr("points", "0,0 15,-5 15,5").attr("stroke-width", "1px").attr("stroke", COLORlist[i]).attr("fill", COLORlist[i]);
}
var svgmathqueue = MathJax.Callback.Queue([updatesvg]);
