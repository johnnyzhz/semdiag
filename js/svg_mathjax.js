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

 Svg_MathJax_queue = (function () {
    // Calls callback(item) for each element of an array-like list.
    function forEachItem(items, callback) {
        for (var count = items.length, i = 0; i < count; ++i) {
            callback(items[i]);
        }
    }

    // Calls onMatch(svgElement, textElement, match) for each <text> under root whose
    // content is LaTeX in $...$ or \(...\), with an optional L/R/C alignment letter.
    function findLatexTextNodes(onMatch, root) {
        var latexPattern = /^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;
        root = root || document;
        forEachItem(root.getElementsByTagName("svg"), function (svgElement) {
            forEachItem(svgElement.getElementsByTagName("text"), function (textElement) {
                var match = textElement.textContent.match(latexPattern);
                if (match) {
                    onMatch(svgElement, textElement, match);
                }
            });
        });
    }

    function installQueue(svgMath) {
        // Each entry: [textElement, mathContainer, alignment, parentElement, latexSource]
        var pendingLabels = [];

        // Step 1: copy each LaTeX label into a hidden bucket so MathJax can typeset it.
        function copyLabelsToBucket(context) {
            var bucket = document.createElement("div");
            bucket.setAttribute("id", "mathjax_svg_bucket");
            context.parentElement.appendChild(bucket);
            bucket.style.display = "none";
            svgMath.bucket = bucket;

            findLatexTextNodes(function (svgElement, textElement, match) {
                var mathContainer = document.createElement("div");
                bucket.appendChild(mathContainer);
                // MathJax reads \(...\) delimiters, so $...$ is converted.
                var mathSource = match[2].replace(/^\$(.*)\$$/, "\\($1\\)");
                mathContainer.appendChild(document.createTextNode(mathSource));
                textElement.textContent = "";
                var parentElement = textElement.parentNode;
                pendingLabels.push([textElement, mathContainer, match[1], parentElement, match[2]]);
            }, context);
        }

        // Step 2: swap each <text> for its typeset SVG and cache the result for reuse.
        function replaceLabelsWithRendered(labels) {
            forEachItem(labels, function (label) {
                var textElement = label[0];
                var mathContainer = label[1];
                var alignment = label[2];
                var parentElement = label[3];
                var latexSource = label[4];

                var mathSvg = mathContainer.getElementsByClassName("MathJax_SVG")[0].getElementsByTagName("svg")[0];
                var svgSize = {
                    width: mathSvg.viewBox.baseVal.width,
                    height: mathSvg.viewBox.baseVal.height
                };
                var renderedGroup = mathSvg.getElementsByTagName("g")[0].cloneNode(true);
                var fontSize = textElement.getAttribute("font-size").split("pt")[0];
                var scale = svgMath.scale * fontSize;
                var x = +textElement.getAttribute("x");
                var y = +textElement.getAttribute("y");

                var alignX;
                switch (alignment.toUpperCase()) {
                    case "L":
                        alignX = 0;
                        break;
                    case "R":
                        alignX = -svgSize.width;
                        break;
                    case "C":
                    default:
                        alignX = 0.5 * -svgSize.width;
                }
                var alignY = 0 * svgSize.height;

                window.svgmathcache = window.svgmathcache || {};
                window.svgmathcache[latexSource + "|" + fontSize + "|" + alignment] = {
                    inner: renderedGroup.cloneNode(true),
                    scale: scale,
                    alignX: alignX,
                    alignY: alignY
                };

                renderedGroup.setAttribute(
                    "transform",
                    "translate(" + x + " " + y + ") scale(" + scale + ") translate(" + alignX + " " + alignY + ") matrix(1 0 0 -1 0 0)"
                );
                if (svgMath.escape_clip) {
                    textElement.parentNode.removeAttribute("clip-path");
                }
                if (textElement.parentNode === parentElement) {
                    parentElement.replaceChild(renderedGroup, textElement);
                }
            });

            var staleBucket = document.getElementById("mathjax_svg_bucket");
            if (staleBucket) {
                staleBucket.parentNode.removeChild(staleBucket);
            }
            if (svgMath.onDone) {
                svgMath.onDone();
            }
        }

        var context = svgMath.context || document;
        var callbackQueue = MathJax.Callback.Queue();
        callbackQueue.Push([copyLabelsToBucket, context]);
        callbackQueue.Push([function () { return MathJax.Hub.Typeset(svgMath.bucket); }]);
        callbackQueue.Push([replaceLabelsWithRendered, pendingLabels]);
    }

    function SvgMathQueue(context) {
        this.scale = 0.0016;
        this.escape_clip = false;
        this.context = context || document;
    }

    SvgMathQueue.prototype.install = function () {
        installQueue(this);
    };

    return SvgMathQueue;
})(),
Svg_MathJax=(function () {
    // Logs the item count, then calls callback(item) for each element.
    function forEachItemLogged(items, callback) {
        var count = items.length;
        console.log("length of svg TagName" + count);
        for (var i = 0; i < count; ++i) {
            callback(items[i]);
        }
    }

    function findLatexTextNodes(onMatch, root) {
        var latexPattern = /^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;
        root = root || document;
        forEachItemLogged(root.getElementsByTagName("svg"), function (svgElement) {
            forEachItemLogged(svgElement.getElementsByTagName("text"), function (textElement) {
                var match = textElement.textContent.match(latexPattern);
                if (match) {
                    onMatch(svgElement, textElement, match);
                }
            });
        });
    }

    function installLegacyTypesetter(svgMath) {
        // Each entry: [textElement, mathContainer, alignment]
        var pendingLabels = [];

        MathJax.Hub.Register.StartupHook("Begin Typeset", function () {
            var bucket = document.createElement("div");
            bucket.setAttribute("id", "mathjax_svg_bucket");
            document.body.appendChild(bucket);
            findLatexTextNodes(function (svgElement, textElement, match) {
                var mathContainer = document.createElement("div");
                bucket.appendChild(mathContainer);
                // MathJax reads \(...\) delimiters, so $...$ is converted.
                var mathSource = match[2].replace(/^\$(.*)\$$/, "\\($1\\)");
                mathContainer.appendChild(document.createTextNode(mathSource));
                textElement.textContent = "";
                pendingLabels.push([textElement, mathContainer, match[1]]);
            }, svgMath.context);
        });

        console.log("items:");
        console.log(pendingLabels);

        MathJax.Hub.Register.StartupHook("End Typeset", function () {
            forEachItemLogged(pendingLabels, function (label) {
                var textElement = label[0];
                var mathContainer = label[1];
                var alignment = label[2];

                var mathSvg = mathContainer.getElementsByClassName("MathJax_SVG")[0].getElementsByTagName("svg")[0];
                var svgSize = {
                    width: mathSvg.viewBox.baseVal.width,
                    height: mathSvg.viewBox.baseVal.height
                };
                var renderedGroup = mathSvg.getElementsByTagName("g")[0].cloneNode(true);
                var fontSize = textElement.getAttribute("font-size").split("pt")[0];
                var scale = svgMath.scale * fontSize;
                var x = +textElement.getAttribute("x");
                var y = +textElement.getAttribute("y");

                var alignX;
                switch (alignment.toUpperCase()) {
                    case "L":
                        alignX = 0;
                        break;
                    case "R":
                        alignX = -svgSize.width;
                        break;
                    case "C":
                    default:
                        alignX = 0.5 * -svgSize.width;
                }
                var alignY = 0 * svgSize.height;

                renderedGroup.setAttribute(
                    "transform",
                    "translate(" + x + " " + y + ") scale(" + scale + ") translate(" + alignX + " " + alignY + ") matrix(1 0 0 -1 0 0)"
                );
                if (svgMath.escape_clip) {
                    textElement.parentNode.removeAttribute("clip-path");
                }
                textElement.parentNode.replaceChild(renderedGroup, textElement);
            });

            var bucket = document.getElementById("mathjax_svg_bucket");
            bucket.parentNode.removeChild(bucket);
        });
    }

    function SvgMathLegacy(context) {
        this.scale = 0.0016;
        this.escape_clip = false;
        this.context = context || document;
    }

    SvgMathLegacy.prototype.install = function () {
        installLegacyTypesetter(this);
    };

    return SvgMathLegacy;
})();