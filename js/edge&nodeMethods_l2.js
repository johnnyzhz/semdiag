/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         *
 ***************************************************/
 function findIndexes(a, b) {
    for (var c = [], d = 0; d < a.length; d++) a[d] === b && c.push(d);
    return c;
}
function node_add(a, b, c, d) {
    var e = null;
    Nodecurrent_IdNUM++;
    var f = "node" + String(Nodecurrent_IdNUM),
        g = "V";
    switch (d) {
        case "rect":
            (e = NewNode()), (e.type = d), (g = "X"), Rec_current_TitleNUM++, (e.title = g + Rec_current_TitleNUM), nodes.push(e), numRec++, numNode++;
            break;
        case "ellipse":
            (e = NewNode()), (e.type = d), (g = "F"), Elli_current_TitleNUM++, (e.title = g + Elli_current_TitleNUM), nodes.push(e), numElli++, numNode++;
            break;
        case "triangle":
            (e = NewNode()), (e.type = d), (g = "1"), (e.title = g), nodes.push(e), numTri++, numNode++;
    }
    return (e.id = f), (e.x = a.x), (e.y = a.y), (e.rx = b), (e.ry = c), e;
}
function node_delete(a) {
    var b = nodes[a],
        c = delete_relatededges(b, edges, edges_tangents);
    if (((edges = c.edges), (edges_tangents = c.edges_tangents), (matchnodeindex(nodes, b.id) >= 0) & (matchnodeindex(nodes, b.id) < nodes.length))) {
        switch (b.type) {
            case "ellipse":
                numElli--, numNode--;
                break;
            case "rect":
                numRec--, numNode--;
                break;
            case "triangle":
                numTri--, numNode--;
        }
        nodes.splice(a, 1);
    }
}
function node_copy(a) {
    var b = null;
    return (
        null === a ||
            ((b = node_add({ x: a.x, y: a.y }, a.rx, a.ry, a.type)),
            (b.dotted = a.dotted),
            (b.color = a.color),
            (b.title = a.title),
            (b.fontsize = a.fontsize),
            (b.strokewidth = a.strokewidth),
            (b.selected = a.selected),
            (b.level = a.level)),
        b
    );
}
function delete_nonuseedges(a, b, c) {
    var d = 0;
    switch (c) {
        case "uni":
            for (var e = !1, f = 0; f < edges.length; f++) 2 === edges[f].power && (edges[f].startid === a) & (edges[f].endid === b) & ("bi" === edges[f].type) && (edge_delete(f), (e = !0));
            if (!e) for (var f = 0; f < edges.length; f++) 2 === edges[f].power && (edges[f].startid === b) & (edges[f].endid === a) & ("bi" === edges[f].type) && (edge_delete(f), (e = !0));
            break;
        case "bi":
            for (var f = 0; f < edges.length; f++) 2 === edges[f].power && (edges[f].startid === a) & (edges[f].endid === b) & ("uni" === edges[f].type) && (edge_delete(f), d++);
            for (var f = 0; f < edges.length; f++) 2 === edges[f].power && (edges[f].startid === b) & (edges[f].endid === a) & ("uni" === edges[f].type) && (edge_delete(f), d++);
            var g = nodes[matchnodeindex(nodes, b)],
                h = Is_dependentnode(g, nodes, edges);
            if (h);
            else {
                var i = lookfor_duplicatedbcurve(nodes, edges, b, b, "bi");
                (i >= 0) & (i < edges.length) && 1 == edges[i].IsAutoGenerated && edge_delete(i);
            }
    }
    return d;
}
function lookfor_relatededges(a) {
    for (var b = [], c = 0; c < edges.length; c++) 2 === edges[c].power ? (a === edges[c].startid && b.push(c), a === edges[c].endid && b.push(c)) : 3 === edges[c].power && a === edges[c].nodeid && b.push(c);
    return b;
}
function edge_delete(a) {
    var b = !1,
        c = edges[a];
    switch (c.power) {
        case 2:
            switch (c.type) {
                case "uni":
                    var d = nodes[matchnodeindex(nodes, c.startid)],
                        e = nodes[matchnodeindex(nodes, c.endid)];
                    edges.splice(a, 1), edges_tangents.splice(a, 1);
                    var f = Is_dependentnode(e, nodes, edges);
                    if (f);
                    else {
                        var g = lookfor_duplicatedbcurve(nodes, edges, e.id, e.id, "bi");
                        (g >= 0) & (g < edges.length) && edges[g].IsAutoGenerated === !0 && (edges.splice(g, 1), edges_tangents.splice(g, 1));
                    }
                    if ("triangle" === d.type) {
                        for (var h = !1, i = 0; i < edges.length; i++) (2 === edges[i].power) & (edges[i].startid === d.id) && (h = !0);
                        h || node_delete(matchnodeindex(nodes, d.id));
                    }
                    b = !0;
                    break;
                case "bi":
                    edges.splice(a, 1), edges_tangents.splice(a, 1), (b = !0);
                    break;
                default:
                    edges.splice(a, 1), edges_tangents.splice(a, 1), (b = !0);
            }
            break;
        case 3:
            edges.splice(a, 1), edges_tangents.splice(a, 1), (b = !0);
            break;
        default:
            edges.splice(a, 1), edges_tangents.splice(a, 1), (b = !0);
    }
    return b;
}
function delete_relatededges(a, b, c) {
    for (var d = a.id, e = 0; e < b.length; e++) {
        edges[e];
        2 === b[e].power ? (b[e].startid !== d && b[e].endid !== d) || (edge_delete(e) && e--) : 3 === b[e].power && b[e].nodeid === d && edge_delete(e) && e--;
    }
    return { edges: b, edges_tangents: c };
}
function edge_add_newbcurve(a) {
    var b = -1,
        c = a.type;
    switch (a.power) {
        case 2:
            var d = lookfor_duplicatedbcurve(nodes, edges, a.startid, a.endid, a.type);
            if ((d >= 0) & (d < edges.length));
            else
                switch (c) {
                    case "uni":
                        delete_nonuseedges(a.startid, a.endid, a.type);
                        edges.push(a), numEdge++, Edgecurrent_IdNUM++;
                        var f = generate_tangent(nodes, a);
                        edges_tangents.push(f), (b = numEdge - 1);
                        break;
                    case "bi":
                        delete_nonuseedges(a.startid, a.endid, a.type);
                        edges.push(a), numEdge++, Edgecurrent_IdNUM++;
                        var f = generate_tangent(nodes, a);
                        edges_tangents.push(f), (b = numEdge - 1);
                }
            break;
        case 3:
            var d = lookfor_duplicatedbcurve(nodes, edges, a.nodeid, a.nodeid, a.type);
            if ((d >= 0) & (d < edges.length));
            else {
                edges.push(a), numEdge++, Edgecurrent_IdNUM++;
                var f = generate_tangent(nodes, a);
                edges_tangents.push(f), (b = numEdge - 1);
            }
    }
    return b;
}
function edge_add(a, b, c) {
    var d = -1;
    if ("uni" === c) {
        if (a != b)
            if ("triangle" === nodes[b].type);
            else {
                var e = generate_edge(nodes, nodes[a].id, nodes[b].id, c);
                if (((d = edge_add_newbcurve(e)), "triangle" === nodes[a].type));
                else {
                    var f = generate_bcurve3p(nodes, nodes[b].id, "bi");
                    (f.IsAutoGenerated = !0), edge_add_newbcurve(f);
                }
            }
    } else if ("bi" === c)
        if (("triangle" === nodes[b].type) & (b != a) || ("triangle" === nodes[a].type) & (b != a));
        else {
            var e = generate_edge(nodes, nodes[a].id, nodes[b].id, c);
            d = edge_add_newbcurve(e);
        }
    return d;
}
function note_add(a, b) {
    Notecurrent_IdNUM++;
    var c = NewNote();
    return (c.id = "note" + Notecurrent_IdNUM), (c.x = a.x), (c.y = a.y), (c.text = b), notes.push(c), numnote++, c;
}
function note_delete(a) {
    (a >= 0) & (a < notes.length) && (notes.splice(a, 1), numnote--);
}
function note_copy(a) {
    var b = null;
    return null === a || ((b = note_add(tPoc, a.text)), (b.x = a.x), (b.y = a.y), (b.text = a.text), (b.color = a.color), (b.fontsize = a.fontsize), (b.selected = a.selected)), b;
}
function sethandlePhidden() {
    for (var a = 0; a < edges.length; a++) edges[a].handlePshow = !1;
}
function node_text_editing(a, b) {
    texteditdialog("node", a, b), updatesvg();
}
function bcurve_text_editing(a, b) {
    texteditdialog("edge", a, b), updatesvg();
}
function note_text_editing(a, b) {
    texteditdialog("note", a, b), updatesvg();
}
function texteditdialog(a, b, c) {
    var d;
    switch (a) {
        case "node":
            d = [b][0].title;
            break;
        case "edge":
            d = [b][0].label;
            break;
        case "note":
            d = [b][0].text;
    }
    $("#edittextdialog") && $("#edittextdialog").remove();
    var f = document.createElement("div");
    (f.id = "edittextdialog"), (f.style.color = "black");
    var g = document.createElement("div");
    g.style = "width=230px; height=100px";
    var h = document.createElement("form");
    h.id = "texteditform";
    var i = document.createElement("input");
    (i.id = "edittextinput"), (i.type = "text"), (i.name = "text"), (i.style = "width=200px; height=50px"), (i.contentEditable = !0), (i.value = d), i.focus();
    var j = i.value;
    $(i).keydown(function (a) {
        if (13 == a.keyCode || 13 == a.witch) return (j = i.value), a.preventDefault(), $(k).click(), !1;
    }),
        h.appendChild(i),
        g.appendChild(h);
    var k = document.createElement("button");
    (k.innerHTML = "OK"),
        (k.id = "dialogbuton1"),
        $(k).click(function () {
            if (d != i.value)
                switch (a) {
                    case "node":
                        if ((([b][0].title = i.value), [b][0].rx <= [b][0].title.length * [b][0].fontsize * 0.5)) {
                            [b][0].rx = [b][0].title.length * [b][0].fontsize * 0.5;
                            for (var c = lookfor_relatededges([b][0].id), e = 0; e < c.length; e++) {
                                var g = c[e];
                                2 === edges[g].power ? (edges[g] = update_bcurve2p(nodes, edges[g])) : 3 === edges[g].power && (edges[g] = update_bcurve3p(nodes, edges[g], edges[g].theta, selfpathANGLE_default)),
                                    (edges_tangents[g] = generate_tangent(nodes, edges[g]));
                            }
                        }
                        break;
                    case "edge":
                        ([b][0].label = i.value), ([b][0].labelInitial = !1);
                        break;
                    case "note":
                        [b][0].text = i.value;
                }
            $(f).dialog("close"), $("#edittextdialog").remove(), updatesvg();
        }),
        g.appendChild(k);
    var l = document.createElement("button");
    (l.innerHTML = "Cancel"),
        (l.id = "dialogbuton2"),
        (l.styles = "margin-left:2px"),
        $(l).click(function () {
            $(f).dialog("close"), $("#edittextdialog").remove();
        }),
        g.appendChild(l),
        f.appendChild(g),
        $(f).dialog({ modal: !0, title: "Edit Text", width: "230", height: "130", bgiframe: !0, closeOnEscape: !0, draggable: !0, resizable: !0 });
}
function Cal_Boundary(a, b) {
    var c = { x1: 0, y1: 0, x2: 0, y2: 0 };
    switch (b) {
        case "node":
            var d = a;
            (c.x1 = d.x - d.rx), (c.y1 = d.y - d.ry), (c.x2 = d.x + d.rx), (c.y2 = d.y + d.ry);
            break;
        case "edge":
            var e = a,
                f = nodes[matchnodeindex(nodes, e.startid)],
                g = nodes[matchnodeindex(nodes, e.endid)],
                h = e.handleP,
                i = Math.min(f.x, g.x, h.x),
                j = Math.max(f.x, g.x, h.x),
                k = Math.min(f.y, g.y, h.y),
                l = Math.max(f.y, g.y, h.y);
            (c.x1 = i), (c.y1 = k), (c.x2 = j), (c.y2 = l);
            break;
        case "note":
            var m = a,
                n = m.text.length * m.fontsize * 0.5,
                o = m.fontsize;
            (c.x1 = m.x - n), (c.y1 = m.y - o), (c.x2 = m.x + n), (c.y2 = m.y + o);
    }
    return c;
}
