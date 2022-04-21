/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         * 
 ***************************************************/
 /*
 * SVG_MathJax
 * 
 * Copyright 2014 Jason M. Sachs
 * Based loosely on an approach outlined by Martin Clark
 * in http://stackoverflow.com/a/21923030/44330
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Improved by Yujiao Mai in Sep 2016
 * First, use MathJax.Callback.Queue() to render dynamically generated svg elements.
 * Second, use MathJax.Callback.Queue() to solve the asychronous problem with recruisive functions with MathJax rendering steps. 
 */

 Svg_MathJax_queue=function(a){function b(a,b){for(var c=a.length,d=0;d<c;++d)b(a[d])}function c(a,c){var d=/^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;c=c||document,b(c.getElementsByTagName("svg"),function(c){b(c.getElementsByTagName("text"),function(b){var e=b.textContent.match(d);e&&a(c,b,e)})})}function d(d){function f(a){var b=document.createElement("div");b.setAttribute("id","mathjax_svg_bucket"),a.parentElement.appendChild(b),c(function(a,c,d){var f=document.createElement("div");b.appendChild(f);var g=d[2].replace(/^\$(.*)\$$/,"\\($1\\)");f.appendChild(document.createTextNode(g)),c.textContent="";var h=c.parentNode;e.push([c,f,d[1],h])},d.context)}function g(a){b(a,function(a){var b=a[0],c=a[1],e=a[2],f=a[3],g=c.getElementsByClassName("MathJax_SVG"),h=g[0],i=h.getElementsByTagName("svg")[0],j=i,k={width:j.viewBox.baseVal.width,height:j.viewBox.baseVal.height},l=j.getElementsByTagName("g")[0].cloneNode(!0),m=b.getAttribute("font-size");m=m.split("pt")[0];var r,n=d.scale*m,a=+b.getAttribute("x"),o=+b.getAttribute("y"),p=a,q=o;switch(e.toUpperCase()){case"L":r=0;break;case"R":r=-k.width;break;case"C":default:r=.5*-k.width}var s=0*k.height;l.setAttribute("transform","translate("+p+" "+q+") scale("+n+") translate("+r+" "+s+") matrix(1 0 0 -1 0 0)"),d.escape_clip&&b.parentNode.removeAttribute("clip-path"),f.replaceChild(l,b)});var c=document.getElementById("mathjax_svg_bucket");c.parentNode.removeChild(c)}var e=[];a=d.context||document;var h=h||MathJax.Callback.Queue();h.Push([f,a]),h.Push(["Typeset",MathJax.Hub]),h.Push([g,e])}var e=function(a){this.scale=.0016,this.escape_clip=!1,this.context=a||document};return e.prototype.install=function(){d(this)},e}(),Svg_MathJax=function(a){function b(a,b){var c=a.length;console.log("length of svg TagName"+c);for(var d=0;d<c;++d)b(a[d])}function c(a,c){var d=/^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;c=c||document,b(c.getElementsByTagName("svg"),function(c){b(c.getElementsByTagName("text"),function(b){var e=b.textContent.match(d);e&&a(c,b,e)})})}function d(a){var d=[];MathJax.Hub.Register.StartupHook("Begin Typeset",function(){var b=document.createElement("div");b.setAttribute("id","mathjax_svg_bucket"),document.body.appendChild(b),c(function(a,c,e){var f=document.createElement("div");b.appendChild(f);var g=e[2].replace(/^\$(.*)\$$/,"\\($1\\)");f.appendChild(document.createTextNode(g)),c.textContent="",d.push([c,f,e[1]])},a.context)}),console.log("items:"),console.log(d),MathJax.Hub.Register.StartupHook("End Typeset",function(){b(d,function(b){var c=b[0],d=b[1],e=b[2],f=d.getElementsByClassName("MathJax_SVG")[0].getElementsByTagName("svg")[0],g={width:f.viewBox.baseVal.width,height:f.viewBox.baseVal.height},h=f.getElementsByTagName("g")[0].cloneNode(!0),i=c.getAttribute("font-size");i=i.split("pt")[0];var n,j=a.scale*i,b=+c.getAttribute("x"),k=+c.getAttribute("y"),l=b,m=k;switch(e.toUpperCase()){case"L":n=0;break;case"R":n=-g.width;break;case"C":default:n=.5*-g.width}var o=0*g.height;h.setAttribute("transform","translate("+l+" "+m+") scale("+j+") translate("+n+" "+o+") matrix(1 0 0 -1 0 0)"),a.escape_clip&&c.parentNode.removeAttribute("clip-path"),c.parentNode.replaceChild(h,c)});var c=document.getElementById("mathjax_svg_bucket");c.parentNode.removeChild(c)})}var e=function(a){this.scale=.0016,this.escape_clip=!1,this.context=a||document};return e.prototype.install=function(){d(this)},e}();