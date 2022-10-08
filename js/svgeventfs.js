/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         *
 ***************************************************/
 function NodesUnselected() {
    for (var a = 0; a < selectednodeindexes.length; a++) selectednodeindexes[a] >= 0 && selectednodeindexes[a] < nodes.length && (nodes[selectednodeindexes[a]].selected = !1);
    (selectednodeindex = -1), (selectednodeindexes = []), (svgstatus.nodeselected = 0);
}
function EdgesUnselected() {
    for (var a = 0; a < selectededgeindexes.length; a++) selectededgeindexes[a] >= 0 && selectededgeindexes[a] < edges.length && (edges[selectededgeindexes[a]].selected = !1);
    (selectededgeindex = -1), (selectededgeindexes = []), (svgstatus.edgeselected = 0);
}
function NotesUnselected() {
    for (var a = 0; a < selectednoteindexes.length; a++) selectednoteindexes[a] >= 0 && selectednoteindexes[a] < notes.length && (notes[selectednoteindexes[a]].selected = !1);
    (selectednoteindex = -1), (selectednoteindexes = []), (svgstatus.noteselected = 0);
}
function update_edge_with_moved_node(a, b) {
    for (var c = lookfor_relatededges(a.id), d = 0; d < c.length; d++) {
        var e = c[d],
            f = edges[e];
        if (((labelP_delta_x = edges[e].labelP.x - edges[e].handleP.x), (labelP_delta_y = edges[e].labelP.y - edges[e].handleP.y), 2 === f.power)) {
            var g = nodes[matchnodeindex(nodes, f.startid)],
                h = nodes[matchnodeindex(nodes, f.endid)],
                i = "startP",
                j = -1,
                k = -1;
            switch ((i = f.startid === a.id ? "startP" : "endP")) {
                case "startP":
                    (j = (b.x + h.x) / 2), (k = (b.y + h.y) / 2);
                    break;
                case "endP":
                    (j = b.x + g.x), (k = b.y + g.y);
            }
            if (f.handleInitial === !0 || (f.handleP.x == j && f.handleP.y == k)) {
                var l = (g.x + h.x) / 2,
                    m = (g.y + h.y) / 2;
                edges[e].handleP = { x: l, y: m };
            } else if (g.x == h.x && g.y == h.y) {
                var l = (g.x + h.x) / 2,
                    m = (g.y + h.y) / 2;
                edges[e].handleP = { x: l, y: m };
            } else edges[e].handleP = generate_new_handleP_for_movednode(nodes, edges[e], i, b);
            edges[e] = update_bcurve2p(nodes, edges[e]);
        } else 3 === edges[e].power && (edges[e] = update_bcurve3p(nodes, edges[e], edges[e].theta, selfpathANGLE_default));
        edges_tangents[e] = generate_tangent(nodes, edges[e]);
        var n = matchnodeindex(nodes, edges[e].startid),
            o = matchnodeindex(nodes, edges[e].endid),
            p = { x: nodes[n].x, y: nodes[n].y },
            q = { x: nodes[o].x, y: nodes[o].y },
            r = edges[e].handleP;
        edges[e].labelP = cal_labelP(r, p, q, edges[e].power, labelP_delta_x, labelP_delta_y);
    }
}
function multidrag(a, b) {
    if (1 == svgstatus.nodeselected)
        for (var c = 0; c < selectednodeindexes.length; c++) {
            var d = selectednodeindexes[c];
            if ((d >= 0) & (d < nodes.length)) {
                var e = { x: nodes[d].x, y: nodes[d].y };
                (nodes[d].x += a), (nodes[d].y += b), update_edge_with_moved_node(nodes[d], e);
            }
        }
    if (1 == svgstatus.noteselected)
        for (var c = 0; c < selectednoteindexes.length; c++) {
            var f = selectednoteindexes[c];
            (f >= 0) & (f < notes.length) && ((notes[f].x += a), (notes[f].y += b));
        }
}
function OnNodeMouseOver(a, b, c) {
    d3.select("#" + b.type + b.id).attr("fill", "#FFEEEE"), d3.select("#" + b.type + b.id).attr("stroke", "GREY"), b.selected || d3.select("#" + b.type + b.id).attr("stroke-width", 2 * Math.log(10 * b.strokewidth) + "px");
}
function OnNodeMouseOut(a, b, c) {
    d3.select("#" + b.type + b.id).attr("fill", backgroundCOLOR), d3.select("#" + b.type + b.id).attr("stroke", b.color), b.selected || d3.select("#" + b.type + b.id).attr("stroke-width", b.strokewidth + "px");
}
function OnNodeMouseDown(a, b, c) {
    var d = matchnodeindex(nodes, b.id);
    (justmousedownnodeindex = d), svgstatus.linkingto >= 1 ? (1 === svgstatus.linkingto ? (linkinginitialindex = d) : 2 === svgstatus.linkingto) : 1 === svgstatus.nodeselected;
}
function OnNodeMouseUp(a, b, c) {
    var d = matchnodeindex(nodes, b.id);
    if (svgstatus.linkingto >= 1)
        linkinginitialindex != -1 &&
            ((linkingtargetindex = d),
            edge_add(linkinginitialindex, linkingtargetindex, linkingtoArrowTYPE),
            (linkinginitialindex = -1),
            (linkingtargetindex = -1),
            (svgdragline.x0 = 0),
            (svgdragline.y0 = 0),
            (svgdragline.x1 = 0),
            (svgdragline.y1 = 0)),
            (svgstatus.linkingto = 0);
    else if ((1 === svgstatus.texting && (node_text_editing(b, c), (svgstatus.texting = 0)), justmousedownnodeindex === d)) {
        1 === svgstatus.nodeselected && selectednodeindex === d && ((mouseCurrentclicktime = new Date()), mouseCurrentclicktime - mouseLastclicktime <= 300 && node_text_editing(b, c)),
            !d3.event.ctrlKey & (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1) &&
                (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
        var e = findIndexes(selectednodeindexes, d);
        0 == e.length && ((selectednodeindex = d), selectednodeindexes.push(selectednodeindex), (nodes[selectednodeindex].selected = !0)), (svgstatus.nodeselected = 1), (mouseLastclicktime = new Date());
    }
    1 === svgstatus.nodeondragged && (svgstatus.nodeondragged = 0), (justmousedownnodeindex = -1), updatesvg();
}
function OnNodeOnDragStart(a, b, c) {
    svgstatus.nodeondragged = 1;
    var d = matchnodeindex(nodes, b.id);
    predraggedindex = d;
}
function OnNodeOnDrag(a, b, c, d, e) {
    if (0 !== d || 0 !== e) {
        var f = matchnodeindex(nodes, b.id);
        if (svgstatus.linkingto >= 1)
            linkinginitialindex != -1 && ((svgdragline.x0 = nodes[linkinginitialindex].x), (svgdragline.y0 = nodes[linkinginitialindex].y), (svgdragline.x1 = d3.mouse(mysvg.node())[0]), (svgdragline.y1 = d3.mouse(mysvg.node())[1]));
        else if (0 === d && 0 === e);
        else if (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2) multidrag(d, e);
        else if (f >= 0 && f < nodes.length) {
            var g = { x: nodes[f].x, y: nodes[f].y };
            (nodes[f].x += d), (nodes[f].y += e), update_edge_with_moved_node(nodes[f], g);
        }
        updatesvg();
    }
}
function OnNodeOnDragEnd(a, b, c) {
    matchnodeindex(nodes, b.id);
    1 == svgstatus.multidraging && (svgstatus.multidraging = 0), (svgstatus.nodeondragged = 0);
}
function OnResizedCPMouseOver(a, b) {
    d3.select("#rcP" + b).attr("fill", defaultCOLOR);
}
function OnResizedCPMouseOut(a, b) {
    d3.select("#rcP" + b).attr("fill", backgroundCOLOR);
}
function OnResizedCPMouseDown(a, b, c) {
    var d = matchnodeindex(nodes, b.nodeid);
    justmousedownnodeindex = d;
}
function OnResizedCPMouseUp(a, b, c) {
    var d = matchnodeindex(nodes, b.nodeid);
    justmousedownnodeindex == d && ((justmousedownnodeindex = -1), (svgstatus.nodeselected = 1), (selectednodeindex = d), (nodes[selectednodeindex].selected = !0), updatesvg());
}
function OnResizedCPOnDrag(a, b, c, d, e) {
    (b.pos.x += d), (b.pos.y += e);
    var f = { x: b.pos.x, y: b.pos.y },
        g = matchnodeindex(nodes, b.nodeid),
        h = nodes[g],
        i = { rx: h.rx, ry: h.ry },
        j = h.rx,
        k = h.ry;
    switch (h.type) {
        case "ellipse":
            switch (b.type) {
                case "left":
                    var l = h.x - f.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2);
                    break;
                case "right":
                    var l = f.x - h.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2);
                    break;
                case "top":
                    var l = h.y - f.y,
                        k = Math.abs(l) - 2 * cPr;
                    k < default_RADIUSV / 2 && (k = default_RADIUSV / 2);
                    break;
                case "bottom":
                    var l = f.y - h.y,
                        k = Math.abs(l) - 2 * cPr;
                    k < default_RADIUSV / 2 && (k = default_RADIUSV / 2);
            }
            i = { rx: j, ry: k };
            break;
        case "rect":
            switch (b.type) {
                case "left":
                    var l = h.x - f.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2);
                    break;
                case "right":
                    var l = f.x - h.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2);
                    break;
                case "top":
                    var l = h.y - f.y,
                        k = Math.abs(l) - 2 * cPr;
                    k < default_RADIUSV / 2 && (k = default_RADIUSV / 2);
                    break;
                case "bottom":
                    var l = f.y - h.y,
                        k = Math.abs(l) - 2 * cPr;
                    k < default_RADIUSV / 2 && (k = default_RADIUSV / 2);
            }
            i = { rx: j, ry: k };
            break;
        case "triangle":
            switch (b.type) {
                case "top":
                    var l = h.y - f.y,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH && (j = default_RADIUSH), (k = j);
                    break;
                case "right_bottom":
                    var l = Math.sqrt((h.x - f.x) * (h.x - f.x) + (h.y - f.y) * (h.y - f.y)),
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH && (j = default_RADIUSH), (k = j);
                    break;
                case "left_bottom":
                    var l = Math.sqrt((h.x - f.x) * (h.x - f.x) + (h.y - f.y) * (h.y - f.y)),
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH && (j = default_RADIUSH), (k = j);
            }
            i = { rx: j, ry: k };
            break;
        case "diamond":
            switch (b.type) {
                case "left":
                    var l = h.x - f.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH && (j = default_RADIUSH), (k = j);
                    break;
                case "right":
                    var l = f.x - h.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH && (j = default_RADIUSH), (k = j);
            }
            i = { rx: j, ry: k };
            break;
        case "hexagon":
            switch (b.type) {
                case "left":
                    var l = h.x - f.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2), (k = j);
                    break;
                case "right":
                    var l = f.x - h.x,
                        j = Math.abs(l) - 2 * cPr;
                    j < default_RADIUSH / 2 && (j = default_RADIUSH / 2), (k = j);
            }
            i = { rx: j, ry: k };
    }
    (nodes[g].rx = i.rx), (nodes[g].ry = i.ry);
    for (var m = lookfor_relatededges(nodes[g].id), c = 0; c < m.length; c++) {
        var n = m[c];
        2 === edges[n].power ? (edges[n] = update_bcurve2p(nodes, edges[n])) : 3 === edges[n].power && (edges[n] = update_bcurve3p(nodes, edges[n], edges[n].theta, selfpathANGLE_default)),
            (edges_tangents[n] = generate_tangent(nodes, edges[n]));
    }
    updatesvg();
}
function OnPathMouseDown(a, b, c, d) {
    var e = c;
    (justmousedownedgeindex = e), 1 == svgstatus.linkingto;
}
function OnPathMouseUp(a, b, c, d) {
    var e = c;
    if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && ((linkinginitialindex = -1), (linkingtargetindex = -1), (svgdragline.x0 = 0), (svgdragline.y0 = 0), (svgdragline.x1 = 0), (svgdragline.y1 = 0)), (svgstatus.linkingto = 0);
    else if ((1 === svgstatus.texting && (becurve_text_editing(b, c), (svgstatus.texting = 0)), justmousedownedgeindex === e)) {
        1 === svgstatus.edgeselected &&
            selectededgeindex === e &&
            ((mouseCurrentclicktime = new Date()), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(b, c)),
            !d3.event.ctrlKey & (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1) &&
                (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
        var f = findIndexes(selectededgeindexes, e);
        0 === f.length && ((selectededgeindex = e), selectededgeindexes.push(selectededgeindex), (edges[selectededgeindex].selected = !0)), (svgstatus.edgeselected = 1), (mouseLastclicktime = new Date());
    }
    (justmousedownedgeindex = -1), updatesvg();
}
function OnPathMouseOver(a, b, c, d) {
    switch (((b.handlePshow = !0), d)) {
        case "path":
            d3
                .select("#handle" + c)
                .attr("fill", backgroundCOLOR)
                .attr("stroke", defaultCOLOR),
                d3.select("#path" + c).attr("stroke", "GREY"),
                b.selected || d3.select("#path" + c).attr("stroke-width", 1.5 * Math.log(10 * b.strokewidth) + "px");
            break;
        case "handleP":
            d3.select("#handle" + c)
                .attr("stroke", defaultCOLOR)
                .attr("fill", defaultCOLOR);
            break;
        case "labelT":
            d3.select("#label" + c).attr("stroke", "#888888");
    }
}
function OnPathMouseOut(a, b, c, d) {
    switch (d) {
        case "path":
            b.selected ||
                (d3
                    .select("#handle" + c)
                    .attr("fill", "none")
                    .attr("stroke", "none"),
                d3.select("#path" + c).attr("stroke-width", b.strokewidth + "px"),
                (b.handlePshow = !1)),
                d3.select("#path" + c).attr("stroke", b.color);
            break;
        case "handleP":
            b.selected
                ? d3
                      .select("#handle" + c)
                      .attr("stroke", defaultCOLOR)
                      .attr("fill", backgroundCOLOR)
                : (d3
                      .select("#handle" + c)
                      .attr("stroke", "none")
                      .attr("fill", "none"),
                  (b.handlePshow = !1));
            break;
        case "labelT":
            d3.select("#label" + c).attr("stroke", "none"), b.selected || (b.handlePshow = !1);
    }
}
function OnPathOnDrag(a, b, c, d, e, f, g, h) {
    if (0 !== d || 0 !== e) {
        if (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2) multidrag(d, e);
        else {
            b.handleInitial = !1;
            var i = b.handleP;
            (i.x += d), (i.y += e), (edges[c].handleP = i), (edges[c] = update_bcurve(nodes, edges[c])), (edges_tangents[c] = generate_tangent(nodes, edges[c]));
            var j = matchnodeindex(nodes, edges[c].startid),
                k = matchnodeindex(nodes, edges[c].endid),
                l = { x: nodes[j].x, y: nodes[j].y },
                m = { x: nodes[k].x, y: nodes[k].y },
                n = edges[c].handleP;
            edges[c].labelP = cal_labelP(n, l, m, edges[c].power, f, g);
        }
        updatesvg();
    }
}
function OnHandlePMouseUp(a, b, c) {
    1 === svgstatus.texting && (bcurve_text_editing(b, c), (svgstatus.texting = 0));
    var d = c;
    if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && ((linkinginitialindex = -1), (linkingtargetindex = -1), (svgdragline.x0 = 0), (svgdragline.y0 = 0), (svgdragline.x1 = 0), (svgdragline.y1 = 0)), (svgstatus.linkingto = 0);
    else if (justmousedownedgeindex === d) {
        1 === svgstatus.edgeselected &&
            selectededgeindex === d &&
            ((mouseCurrentclicktime = new Date()), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(b, c)),
            !d3.event.ctrlKey & (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1) &&
                (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
        var e = findIndexes(selectededgeindexes, d);
        0 === e.length && ((selectededgeindex = d), selectededgeindexes.push(selectededgeindex), (edges[selectededgeindex].selected = !0)), (svgstatus.edgeselected = 1), (mouseLastclicktime = new Date());
    }
    (justmousedownedgeindex = -1), updatesvg();
}
function OnLabelMouseDown(a, b, c) {
    var d = c;
    justmousedownedgeindex = d;
}
function OnLabelMouseUp(a, b, c) {
    1 === svgstatus.texting && (bcurve_text_editing(b, c), (svgstatus.texting = 0));
    var d = c;
    if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && ((linkinginitialindex = -1), (linkingtargetindex = -1), (svgdragline.x0 = 0), (svgdragline.y0 = 0), (svgdragline.x1 = 0), (svgdragline.y1 = 0)), (svgstatus.linkingto = 0);
    else if (justmousedownedgeindex === d) {
        1 === svgstatus.edgeselected &&
            selectededgeindex === d &&
            ((mouseCurrentclicktime = new Date()), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(b, c)),
            !d3.event.ctrlKey & (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1) &&
                (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
        var e = findIndexes(selectededgeindexes, d);
        0 === e.length && ((selectededgeindex = d), selectededgeindexes.push(selectededgeindex), (edges[selectededgeindex].selected = !0)), (svgstatus.edgeselected = 1), (mouseLastclicktime = new Date());
    }
    (justmousedownedgeindex = -1), updatesvg();
}
function OnLabelOnDragStart(a, b, c) {}
function OnLabelOnDrag(a, b, c, d, e) {
    (0 === d && 0 === e) || ((b.labelP.x += d), (b.labelP.y += e), updatesvg());
}
function OnLabelOnDragEnd(a, b, c) {}
function OnNoteMouseDown(a, b, c) {
    var d = c;
    justmousedownnoteindex = d;
}
function OnNoteMouseUp(a, b, c) {
    1 === svgstatus.texting && (note_text_editing(b, c), (svgstatus.texting = 0));
    var d = c;
    if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && ((linkinginitialindex = -1), (linkingtargetindex = -1), (svgdragline.x0 = 0), (svgdragline.y0 = 0), (svgdragline.x1 = 0), (svgdragline.y1 = 0)), (svgstatus.linkingto = 0);
    else if (justmousedownnoteindex === d) {
        1 === svgstatus.noteselected &&
            selectednoteindex === d &&
            ((mouseCurrentclicktime = new Date()), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectednoteindex >= 0 && selectednoteindex < notes.length && note_text_editing(b, c)),
            !d3.event.ctrlKey & (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1) &&
                (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected()),
            1 === svgstatus.nodeselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && NodesUnselected(),
            1 === svgstatus.edgeselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && EdgesUnselected(),
            1 === svgstatus.noteselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && NotesUnselected();
        var e = findIndexes(selectednoteindexes, d);
        0 === e.length && ((selectednoteindex = d), (notes[selectednoteindex].selected = !0), selectednoteindexes.push(selectednoteindex)), (svgstatus.noteselected = 1), (mouseLastclicktime = new Date());
    }
    (justmousedownnoteindex = -1), updatesvg();
}
function OnNoteOnDrag(a, b, c, d, e) {
    (0 === d && 0 === e) || (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2 ? multidrag(d, e) : ((b.x += d), (b.y += e)), updatesvg());
}
function OnNoteMouseOver(a, b, c) {
    d3.select("#note" + c).attr("stroke", "#888888");
}
function OnNoteMouseOut(a, b, c) {
    d3.select("#note" + c).attr("stroke", "none");
}
function Dragmove_for_linking(a) {
    if (svgstatus.linkingto >= 1 && linkinginitialindex != -1) {
        var b = d3.mouse(mysvg);
        (svgdragline.x0 = nodes[linkinginitialindex].x), (svgdragline.y0 = nodes[linkinginitialindex].y), (svgdragline.x1 = b[0]), (svgdragline.y1 = b[1]), updatesvg();
    }
}
function OnmysvgMouseDown(a, b) {
    if (justmousedownnodeindex === -1 && justmousedownedgeindex === -1 && justmousedownnoteindex === -1)
        if ((1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected(), sethandlePhidden(), 1 === svgstatus.texting)) {
            var c = d3.mouse(a)[0],
                d = d3.mouse(a)[1],
                e = { x: c, y: d };
            note_add(e, "New Note");
        } else if (0 === svgstatus.linkingto) {
            svgstatus.multipleselecting = 1;
            var c = d3.mouse(a)[0],
                d = d3.mouse(a)[1];
            (multipleselectframe.x = c), (multipleselectframe.y = d);
        }
    updatesvg();
}
function OnmysvgMouseUp(a, b) {
    svgstatus.linkingto >= 1
        ? ((linkinginitialindex = -1), (linkingtargetindex = -1), (svgdragline.x0 = 0), (svgdragline.y0 = 0), (svgdragline.x1 = 0), (svgdragline.y1 = 0), (svgstatus.linkingto = 0))
        : 1 === svgstatus.texting
        ? (svgstatus.texting = 0)
        : justmousedownedgeindex >= 0
        ? (justmousedownedgeindex = -1)
        : justmousedownnodeindex >= 0
        ? (justmousedownnodeindex = -1)
        : justmousedownnoteindex >= 0 && (justmousedownnoteindex = -1),
        1 === svgstatus.multipleselecting && ((multipleselectframe.x = 0), (multipleselectframe.y = 0), (multipleselectframe.width = 0), (multipleselectframe.height = 0), (svgstatus.multipleselecting = 0)),
        (svgstatus.nodeondragged = 0),
        (svgstatus.svgondragged = 0),
        updatesvg();
}
function OnmysvgMouseMove(a, b) {
    if (1 === svgstatus.multipleselecting) {
        var c = multipleselectframe,
            d = d3.mouse(a),
            e = { x: d[0] - multipleselectframe.x, y: d[1] - multipleselectframe.y };
        e.x < 0 || 2 * e.x < multipleselectframe.width ? ((multipleselectframe.x = d[0]), (multipleselectframe.width -= e.x)) : (multipleselectframe.width = e.x),
            e.y < 0 || 2 * e.y < multipleselectframe.height ? ((multipleselectframe.y = d[1]), (multipleselectframe.height -= e.y)) : (multipleselectframe.height = e.y);
        var f = { x1: multipleselectframe.x, y1: multipleselectframe.y, x2: multipleselectframe.x + multipleselectframe.width, y2: multipleselectframe.y + multipleselectframe.height };
        (f.x1 >= 0) & (f.x2 <= w) & (f.y1 >= 0) & (f.y2 <= h) ||
            ((multipleselectframe = c), (f = { x1: multipleselectframe.x, y1: multipleselectframe.y, x2: multipleselectframe.x + multipleselectframe.width, y2: multipleselectframe.y + multipleselectframe.height })),
            1 === svgstatus.nodeselected && NodesUnselected(),
            1 === svgstatus.edgeselected && EdgesUnselected(),
            1 === svgstatus.noteselected && NotesUnselected();
        for (var g = 0; g < nodes.length; g++) {
            var i = Cal_Boundary(nodes[g], "node");
            i.x1 >= f.x1 && i.x2 <= f.x2 && i.y1 >= f.y1 && i.y2 <= f.y2 && ((nodes[g].selected = !0), selectednodeindexes.push(g), (selectednodeindex = g), (svgstatus.nodeselected = 1));
        }
        for (var g = 0; g < edges.length; g++) {
            var j = Cal_Boundary(edges[g], "edge");
            j.x1 >= f.x1 && j.x2 <= f.x2 && j.y1 >= f.y1 && j.y2 <= f.y2 && ((edges[g].selected = !0), selectededgeindexes.push(g), (selectededgeindex = g), (svgstatus.edgeselected = 1));
        }
        for (var g = 0; g < notes.length; g++) {
            var k = Cal_Boundary(notes[g], "note");
            k.x1 >= f.x1 && k.x2 <= f.x2 && k.y1 >= f.y1 && k.y2 <= f.y2 && ((notes[g].selected = !0), selectednoteindexes.push(g), (selectednoteindex = g), (svgstatus.noteselected = 1));
        }
        updatesvg();
    }
}
function OnmysvgMouseOut(a, b) {}
function OnmysvgOnDrag(a, b) {}
function Attr_Stroke_dasharray(a, b) {
    var c;
    switch (a.dotted) {
        case 0:
            c = "none";
            break;
        case 1:
            c = "5,5";
            break;
        default:
            c = "none";
    }
    return c;
}
function generate_grids() {
    for (var a = h / default_RADIUSV, b = w / default_RADIUSH, c = [], d = [], e = 0; e < a; e++) {
        var f = e * default_RADIUSV,
            g = { x: 0, y: f },
            i = { x: w, y: f },
            j = { P1: g, P2: i };
        c.push(j);
    }
    for (var k = 0; k < b; k++) {
        var l = k * default_RADIUSH,
            g = { x: l, y: 0 },
            i = { x: l, y: h },
            j = { P1: g, P2: i };
        d.push(j);
    }
    return { grids_row: c, grids_col: d };
}
function updatesvg() {
    if (
        (mysvg.selectAll("line").remove(),
        mysvg.selectAll("ellipse").remove(),
        mysvg.selectAll("rect").remove(),
        mysvg.selectAll("polygon").remove(),
        mysvg.selectAll("circle").remove(),
        mysvg.selectAll("path").remove(),
        mysvg.selectAll("text").remove(),
        mysvg.selectAll("g").remove(),
        svgstatus.IsShowGrid)
    ) {
        var a = generate_grids(),
            b = a.grids_row,
            c = a.grids_col,
            d = mysvg.selectAll("line.gridrow").data(b);
        d
            .enter()
            .append("svg:line")
            .attr("class", "line.gridrow")
            .attr("x1", function (a) {
                return a.P1.x;
            })
            .attr("y1", function (a) {
                return a.P1.y;
            })
            .attr("x2", function (a) {
                return a.P2.x;
            })
            .attr("y2", function (a) {
                return a.P2.y;
            })
            .attr("stroke-width", "0.5px")
            .attr("stroke", "GREY")
            .attr("stroke-dasharray", "5,5"),
            d.exit().remove();
        var e = mysvg.selectAll("line.gridcol").data(c);
        e
            .enter()
            .append("svg:line")
            .attr("class", "line.gridcol")
            .attr("x1", function (a) {
                return a.P1.x;
            })
            .attr("y1", function (a) {
                return a.P1.y;
            })
            .attr("x2", function (a) {
                return a.P2.x;
            })
            .attr("y2", function (a) {
                return a.P2.y;
            })
            .attr("stroke-width", "0.5px")
            .attr("stroke", "GREY")
            .attr("stroke-dasharray", "5,5"),
            e.exit().remove();
    }
    var f = nodes.filter(function (a) {
            return "ellipse" == a.type;
        }),
        g = nodes.filter(function (a) {
            return "rect" == a.type;
        }),
        h = nodes.filter(function (a) {
            return "triangle" == a.type;
        }),
        j = nodes.filter(function (a) {
            return 1 == a.selected;
        }),
        k = generate_resize_cPs(j);
    (numRec = g.length), (numElli = f.length), (numTri = h.length), (numNode = nodes.length), (numEdge = edges.length), (numNote = notes.length);
    var l = mysvg.selectAll("path.Gs").data(edges);
    (pathGs = l.enter().append("svg:g").attr("class", "path.Gs")),
        pathGs
            .on("mouseover", function (a, b) {
                OnPathMouseOver(this, a, b, "path");
            })
            .on("mouseout", function (a, b) {
                OnPathMouseOut(this, a, b, "path");
            })
            .on("mousedown", function (a, b) {
                OnPathMouseDown(this, a, b, "path");
            })
            .on("mouseup", function (a, b) {
                OnPathMouseUp(this, a, b, "path");
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a, b) {
                        (labelP_delta_x = a.labelP.x - a.handleP.x), (labelP_delta_y = a.labelP.y - a.handleP.y);
                    })
                    .on("drag", function (a, b) {
                        0 != d3.event.dx && 0 != d3.event.dy && OnPathOnDrag(this, a, b, d3.event.dx, d3.event.dy, labelP_delta_x, labelP_delta_y, "pathG");
                    })
                    .on("dragend", function (a) {})
            ),
        pathGs
            .append("svg:path")
            .attr("class", "path.Arrow1")
            .attr("id", function (a, b) {
                return "patharrow1" + b;
            })
            .attr("d", function (a, b) {
                return edges_tangents[b].tangentline1;
            })
            .attr("fill", "none")
            .attr("stroke", "WHITE")
            .attr("stroke-width", function (a, b) {
                return edges[b].selected ? 0.6 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            })
            .style("opactic", "100%")
            .style("marker-end", function (a) {
                var b = "url(#endarrow)",
                    c = "url(#endarrow" + a.color + ")";
                switch (a.type) {
                    case "bi":
                        b = c;
                        break;
                    case "uni":
                        b = "url(#arrowfake)";
                }
                return b;
            }),
        pathGs
            .append("svg:path")
            .attr("class", "path.Arrow2")
            .attr("id", function (a, b) {
                return "patharrow2" + b;
            })
            .attr("d", function (a, b) {
                return edges_tangents[b].tangentline2;
            })
            .attr("fill", "none")
            .attr("stroke", "WHITE")
            .attr("stroke-width", function (a, b) {
                return edges[b].selected ? 0.6 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            })
            .style("opactic", "100%")
            .style("marker-end", function (a) {
                var b = "url(#endarrow" + a.color + ")";
                return b;
            }),
        pathGs
            .append("svg:path")
            .attr("class", "path.link")
            .attr("id", function (a, b) {
                return "path" + b;
            })
            .attr("d", function (a) {
                return a.line;
            })
            .attr("fill", "none")
            .attr("stroke", function (a, b) {
                return a.color;
            })
            .attr("stroke-width", function (a, b) {
                return edges[b].selected ? 1.5 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            })
            .attr("stroke-dasharray", function (a, b) {
                return Attr_Stroke_dasharray(a, b);
            })
            .style("opactic", "1"),
        l.exit().remove();
    var m = mysvg.selectAll("circle.handle").data(edges);
    m
        .enter()
        .append("svg:circle")
        .attr("class", "circle.handle")
        .attr("id", function (a, b) {
            return "handle" + b;
        })
        .attr("cx", function (a) {
            return a.handleP.x;
        })
        .attr("cy", function (a) {
            return a.handleP.y;
        })
        .attr("r", function (a, b) {
            return a.selected ? String(1.5 * cPr) : String(cPr);
        })
        .attr("stroke", function (a, b) {
            return a.handlePshow | a.selected ? defaultCOLOR : "none";
        })
        .attr("fill", function (a) {
            return a.handlePshow | a.selected ? backgroundCOLOR : "none";
        })
        .on("mouseover", function (a, b) {
            OnPathMouseOver(this, a, b, "handleP");
        })
        .on("mouseout", function (a, b) {
            OnPathMouseOut(this, a, b, "handleP");
        })
        .on("mousedown", function (a, b) {
            OnPathMouseDown(this, a, b, "handleP");
        })
        .on("mouseup", function (a, b) {
            OnPathMouseUp(this, a, b, "handleP");
        })
        .call(
            d3.behavior
                .drag()
                .on("dragstart", function (a, b) {
                    (labelP_delta_x = a.labelP.x - a.handleP.x), (labelP_delta_y = a.labelP.y - a.handleP.y);
                })
                .on("drag", function (a, b) {
                    0 != d3.event.dx && 0 != d3.event.dy && OnPathOnDrag(this, a, b, d3.event.dx, d3.event.dy, labelP_delta_x, labelP_delta_y, "handleP");
                })
                .on("dragend", function (a) {})
        ),
        m.exit().remove();
    var n = mysvg.selectAll("label.Gs").data(edges);
    (labelGs = n.enter().append("svg:g").attr("class", "label.Gs")),
        labelGs
            .style("stroke", function (a) {
                return a.color;
            })
            .attr("id", function (a) {
                return "Glabel" + a.id;
            })
            .on("mouseover", function (a, b) {
                OnPathMouseOver(this, a, b, "labelT");
            })
            .on("mouseout", function (a, b) {
                OnPathMouseOut(this, a, b, "labelT");
            })
            .on("mousedown", function (a, b) {
                OnPathMouseDown(this, a, b, "lableT");
            })
            .on("mouseup", function (a, b) {
                OnPathMouseUp(this, a, b, "lableT");
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a) {
                        OnLabelOnDragStart(this, a, i);
                    })
                    .on("drag", function (a, b) {
                        OnLabelOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                    })
                    .on("dragend", function (a) {
                        OnLabelOnDragEnd(this, a, i);
                    })
            ),
        labelGs
            .append("svg:rect")
            .attr("class", "lebel.rect")
            .attr("id", function (a) {
                return "rectlabel" + a.id;
            })
            .attr("x", function (a) {
                return a.labelP.x - a.label.length * a.labelFsize * 0.5;
            })
            .attr("y", function (a) {
                return a.labelP.y - 1 * a.labelFsize;
            })
            .attr("width", function (a) {
                var b = a.label.length * a.labelFsize * 0.5;
                return String(2 * b);
            })
            .attr("height", function (a) {
                return String(1.5 * a.labelFsize);
            })
            .attr("fill", "none")
            .attr("stroke", function (a, b) {
                return "none";
            })
            .attr("stroke-dasharray", "none")
            .attr("stroke-width", "1px"),
        labelGs
            .append("svg:text")
            .attr("class", "text.label")
            .attr("id", function (a, b) {
                return "label" + b;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", function (a, b) {
                if (selectededgeindex === b) {
                    var c = a.labelFsize + 5;
                    return c + "pt";
                }
                return a.labelFsize + "pt";
            })
            .attr("stroke", function (a, b) {
                return svgstatus.IsShowLabels, "none";
            })
            .attr("fill", function (a, b) {
                return svgstatus.IsShowLabels ? defaultCOLOR : "none";
            })
            .attr("x", function (a) {
                return a.labelP.x;
            })
            .attr("y", function (a) {
                return a.labelP.y;
            })
            .text(function (a, b) {
                return a.label;
            }),
        n.exit().remove(),
        svgstatus.linkingto >= 1 &&
            ((tline = "M" + svgdragline.x0 + " " + svgdragline.y0 + " L" + svgdragline.x1 + " " + svgdragline.y1),
            (linkingpath = mysvg.append("svg:path").attr("class", "path.linking").attr("d", tline).attr("fill", "none").attr("stroke", "BLACK").attr("stroke-width", "2px").attr("stroke-dasharray", "none").style("opactic", "1")));
    var o = mysvg.selectAll("rect.Gs").data(g);
    (rectGs = o.enter().append("svg:g").attr("class", "rect.Gs")),
        rectGs
            .attr("id", function (a) {
                return "G" + a.id;
            })
            .style("stroke", function (a) {
                return a.color;
            })
            .on("mouseover", function (a, b) {
                OnNodeMouseOver(this, a, b);
            })
            .on("mouseout", function (a, b) {
                OnNodeMouseOut(this, a, b);
            })
            .on("mousedown", function (a, b) {
                OnNodeMouseDown(this, a, b);
            })
            .on("mouseup", function (a, b) {
                OnNodeMouseUp(this, a, b);
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a, b) {
                        OnNodeOnDragStart(this, a, b);
                    })
                    .on("drag", function (a, b) {
                        OnNodeOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                    })
                    .on("dragend", function (a, b) {
                        OnNodeOnDragEnd(this, a, b);
                    })
            ),
        rectGs
            .append("svg:rect")
            .attr("class", "rect.node")
            .attr("id", function (a) {
                return "rect" + a.id;
            })
            .attr("x", function (a) {
                return String(a.x - a.rx);
            })
            .attr("y", function (a) {
                return String(a.y - a.ry);
            })
            .attr("width", function (a) {
                return String(2 * a.rx);
            })
            .attr("height", function (a) {
                return String(2 * a.ry);
            })
            .attr("fill", "WHITE")
            .attr("stroke", function (a) {
                return a.color;
            })
            .attr("stroke-dasharray", function (a, b) {
                return Attr_Stroke_dasharray(a, b);
            })
            .attr("stroke-width", function (a) {
                return a.selected ? 2 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            }),
        rectGs
            .append("svg:text")
            .attr("class", "text.node")
            .attr("text-anchor", "middle")
            .attr("font-size", function (a) {
                return a.fontsize ? a.fontsize + "pt" : "10pt";
            })
            .attr("stroke", "none")
            .attr("fill", defaultCOLOR)
            .attr("x", function (a) {
                return a.x;
            })
            .attr("y", function (a) {
                return a.y + a.fontsize / 2;
            })
            .text(function (a, b) {
                return a.title;
            }),
        o.exit().remove();
    var p = mysvg.selectAll("ellipse.Gs").data(f);
    (ellipseGs = p.enter().append("svg:g").attr("class", "ellipse.Gs")),
        ellipseGs
            .style("stroke", function (a) {
                return a.color;
            })
            .attr("id", function (a) {
                return "node" + a.id;
            })
            .on("mouseover", function (a, b) {
                OnNodeMouseOver(this, a, b);
            })
            .on("mouseout", function (a, b) {
                OnNodeMouseOut(this, a, b);
            })
            .on("mousedown", function (a, b) {
                OnNodeMouseDown(this, a, b);
            })
            .on("mouseup", function (a, b) {
                OnNodeMouseUp(this, a, b);
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a, b) {
                        OnNodeOnDragStart(this, a, b);
                    })
                    .on("drag", function (a, b) {
                        OnNodeOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                    })
                    .on("dragend", function (a, b) {
                        OnNodeOnDragEnd(this, a, b);
                    })
            ),
        ellipseGs
            .append("svg:ellipse")
            .attr("class", "ellipses.node")
            .attr("id", function (a) {
                return "ellipse" + a.id;
            })
            .attr("cx", function (a) {
                return a.x;
            })
            .attr("cy", function (a) {
                return a.y;
            })
            .attr("rx", function (a) {
                return a.rx;
            })
            .attr("ry", function (a) {
                return a.ry;
            })
            .attr("fill", "WHITE")
            .attr("stroke", function (a) {
                return a.color;
            })
            .attr("stroke-dasharray", function (a, b) {
                return Attr_Stroke_dasharray(a, b);
            })
            .attr("stroke-width", function (a, b) {
                return a.selected ? 2 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            }),
        ellipseGs
            .append("svg:text")
            .attr("class", "text.node")
            .attr("text-anchor", "middle")
            .attr("font-size", function (a) {
                return a.fontsize ? a.fontsize + "pt" : "10pt";
            })
            .attr("stroke", "none")
            .attr("fill", defaultCOLOR)
            .attr("x", function (a) {
                return a.x;
            })
            .attr("y", function (a) {
                return a.y + a.fontsize / 2;
            })
            .text(function (a, b) {
                return a.title;
            }),
        p.exit().remove();
    var q = mysvg.selectAll("triangle.Gs").data(h);
    (triangleGs = q.enter().append("svg:g").attr("class", "triangle.Gs")),
        triangleGs
            .attr("id", function (a) {
                return "G" + a.id;
            })
            .style("stroke", function (a) {
                return a.color;
            })
            .on("mouseover", function (a, b) {
                OnNodeMouseOver(this, a, b);
            })
            .on("mouseout", function (a, b) {
                OnNodeMouseOut(this, a, b);
            })
            .on("mousedown", function (a, b) {
                OnNodeMouseDown(this, a, b);
            })
            .on("mouseup", function (a, b) {
                OnNodeMouseUp(this, a, b);
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a, b) {
                        OnNodeOnDragStart(this, a, b);
                    })
                    .on("drag", function (a, b) {
                        OnNodeOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                    })
                    .on("dragend", function (a, b) {
                        OnNodeOnDragEnd(this, a, b);
                    })
            ),
        triangleGs
            .append("svg:polygon")
            .attr("id", function (a) {
                return "triangle" + a.id;
            })
            .attr("points", function (a) {
                var b = { x: a.x - (a.rx * Math.sqrt(3)) / 2, y: a.y + a.rx / 2 },
                    c = { x: a.x + (a.rx * Math.sqrt(3)) / 2, y: a.y + a.rx / 2 },
                    d = { x: a.x, y: a.y - a.ry };
                return (temp = b.x + "," + b.y + " " + c.x + "," + c.y + " " + d.x + "," + d.y + " " + b.x + "," + b.y), temp;
            })
            .attr("class", "polygon.triangle")
            .attr("fill", "WHITE")
            .attr("stroke", function (a) {
                return a.color;
            })
            .attr("stroke-dasharray", function (a, b) {
                return Attr_Stroke_dasharray(a, b);
            })
            .attr("stroke-width", function (a) {
                return a.selected ? 2 * Math.log(10 * a.strokewidth) + "px" : a.strokewidth + "px";
            }),
        triangleGs
            .append("svg:text")
            .attr("class", "text.node")
            .attr("text-anchor", "middle")
            .attr("font-size", function (a) {
                return a.fontsize ? a.fontsize + "pt" : "10pt";
            })
            .attr("stroke", "none")
            .attr("fill", defaultCOLOR)
            .attr("x", function (a) {
                return a.x;
            })
            .attr("y", function (a) {
                return a.y + a.fontsize / 2;
            })
            .text(function (a, b) {
                return a.title;
            }),
        q.exit().remove();
    var r = mysvg.selectAll("circle.resizecP").data(k);
    r
        .enter()
        .append("svg:circle")
        .attr("class", "circle.resizecPe")
        .attr("id", function (a, b) {
            return "rcP" + b;
        })
        .attr("cx", function (a) {
            return a.pos.x;
        })
        .attr("cy", function (a) {
            return a.pos.y;
        })
        .attr("r", String(cPr))
        .attr("stroke", defaultCOLOR)
        .attr("fill", backgroundCOLOR)
        .on("mouseover", function (a, b) {
            OnResizedCPMouseOver(a, b);
        })
        .on("mouseout", function (a, b) {
            OnResizedCPMouseOut(a, b);
        })
        .on("mousedown", function (a, b) {
            OnResizedCPMouseDown(this, a, b);
        })
        .on("mouseup", function (a, b) {
            OnResizedCPMouseUp(this, a, b);
        })
        .call(
            d3.behavior
                .drag()
                .on("dragstart", function (a) {})
                .on("drag", function (a, b) {
                    OnResizedCPOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                })
                .on("dragend", function (a) {})
        ),
        r.exit().remove();
    var s = mysvg.selectAll("note.Gs").data(notes);
    (noteGs = s.enter().append("svg:g").attr("class", "note.Gs")),
        noteGs
            .style("stroke", function (a) {
                return a.color;
            })
            .attr("id", function (a) {
                return "G" + a.id;
            })
            .on("mouseover", function (a, b) {
                d3.select("#note" + b).attr("stroke", "#888888");
            })
            .on("mouseout", function (a, b) {
                d3.select("#note" + b).attr("stroke", "none");
            })
            .on("mousedown", function (a, b) {
                OnNoteMouseDown(this, a, b);
            })
            .on("mouseup", function (a, b) {
                OnNoteMouseUp(this, a, b);
            })
            .call(
                d3.behavior
                    .drag()
                    .on("dragstart", function (a) {
                        this.__origin__ = { x: a.x, y: a.y };
                    })
                    .on("drag", function (a, b) {
                        OnNoteOnDrag(this, a, b, d3.event.dx, d3.event.dy);
                    })
                    .on("dragend", function (a) {
                        delete this.__origin__;
                    })
            ),
        noteGs
            .append("svg:rect")
            .attr("class", "note.node")
            .attr("id", function (a) {
                return "rectnote" + a.id;
            })
            .attr("x", function (a) {
                return a.x - a.text.length * a.fontsize * 0.5;
            })
            .attr("y", function (a) {
                return a.y - 1 * a.fontsize;
            })
            .attr("width", function (a) {
                var b = a.text.length * a.fontsize * 0.5;
                return String(2 * b);
            })
            .attr("height", function (a) {
                return String(1.5 * a.fontsize);
            })
            .attr("fill", "none")
            .attr("stroke", function (a, b) {
                return "none";
            })
            .attr("stroke-dasharray", "none")
            .attr("stroke-width", "1px"),
        noteGs
            .append("svg:text")
            .attr("class", "text.note")
            .attr("id", function (a, b) {
                return "note" + b;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", function (a, b) {
                if (a.selected === !0) {
                    var c = a.fontsize + 5;
                    return c + "pt";
                }
                return a.fontsize + "pt";
            })
            .attr("stroke", function (a, b) {
                return "none";
            })
            .attr("fill", function (a, b) {
                return a.color;
            })
            .attr("x", function (a) {
                return a.x;
            })
            .attr("y", function (a) {
                return a.y;
            })
            .text(function (a, b) {
                return a.text;
            }),
        s.exit().remove(),
        1 === svgstatus.multipleselecting &&
            mysvg
                .append("svg:rect")
                .attr("class", "selecting")
                .attr("x", multipleselectframe.x)
                .attr("y", multipleselectframe.y)
                .attr("width", multipleselectframe.width)
                .attr("height", multipleselectframe.height)
                .attr("fill", "transparent")
                .attr("stroke", "#8888BB")
                .attr("stroke-dasharray", "5,5")
                .attr("stroke-width", "1.5 px"),
        mysvg
            .on("mousedown", function (a) {
                OnmysvgMouseDown(this, a);
            })
            .on("mouseup", function (a) {
                OnmysvgMouseUp(this, a);
            })
            .on("mouseout", function (a) {
                OnmysvgMouseOut(this, a);
            }),
        0 === svgstatus.linkingto &&
            0 === svgstatus.texting &&
            1 === svgstatus.multipleselecting &&
            mysvg.on("mousemove", function (a) {
                OnmysvgMouseMove(this, a);
            }),
        (document.getElementById("submatrix").innerHTML = GraphToText1()),
        (document.getElementById("submatrix").height = 16 * (edges.length + 1));
}
function updatesvgmath() {
    svgmathqueue.Push([updatesvg]),
        svgmathqueue.Push([
            function () {
                new Svg_MathJax_queue(d3.select("#svgcontainer")[0][0]).install();
            },
        ]);
}
