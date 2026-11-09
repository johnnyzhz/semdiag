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
  for (var index = 0; index < selectednodeindexes.length; index++) selectednodeindexes[index] >= 0 && selectednodeindexes[index] < nodes.length && (nodes[selectednodeindexes[index]].selected = !1);
  selectednodeindex = -1, selectednodeindexes = [], svgstatus.nodeselected = 0;
}
function EdgesUnselected() {
  for (var index = 0; index < selectededgeindexes.length; index++) selectededgeindexes[index] >= 0 && selectededgeindexes[index] < edges.length && (edges[selectededgeindexes[index]].selected = !1);
  selectededgeindex = -1, selectededgeindexes = [], svgstatus.edgeselected = 0;
}
function NotesUnselected() {
  for (var index = 0; index < selectednoteindexes.length; index++) selectednoteindexes[index] >= 0 && selectednoteindexes[index] < notes.length && (notes[selectednoteindexes[index]].selected = !1);
  selectednoteindex = -1, selectednoteindexes = [], svgstatus.noteselected = 0;
}
function update_edge_with_moved_node(movedNode, previousPosition) {
  for (var relatedEdgeIndexes = lookfor_relatededges(movedNode.id), relatedIndex = 0; relatedIndex < relatedEdgeIndexes.length; relatedIndex++) {
    var edgeIndex = relatedEdgeIndexes[relatedIndex],
      edge = edges[edgeIndex];
    if (labelP_delta_x = edges[edgeIndex].labelP.x - edges[edgeIndex].handleP.x, labelP_delta_y = edges[edgeIndex].labelP.y - edges[edgeIndex].handleP.y, 2 === edge.power) {
      var startNode = nodes[matchnodeindex(nodes, edge.startid)],
        endNode = nodes[matchnodeindex(nodes, edge.endid)],
        anchorSide = "startP",
        anchorX = -1,
        anchorY = -1;
      switch (anchorSide = edge.startid === movedNode.id ? "startP" : "endP") {
        case "startP":
          anchorX = (previousPosition.x + endNode.x) / 2, anchorY = (previousPosition.y + endNode.y) / 2;
          break;
        case "endP":
          anchorX = previousPosition.x + startNode.x, anchorY = previousPosition.y + startNode.y;
      }
      if (edge.handleInitial === !0 || edge.handleP.x == anchorX && edge.handleP.y == anchorY) {
        var midX = (startNode.x + endNode.x) / 2,
          midY = (startNode.y + endNode.y) / 2;
        edges[edgeIndex].handleP = {
          x: midX,
          y: midY
        };
      } else if (startNode.x == endNode.x && startNode.y == endNode.y) {
        var midX = (startNode.x + endNode.x) / 2,
          midY = (startNode.y + endNode.y) / 2;
        edges[edgeIndex].handleP = {
          x: midX,
          y: midY
        };
      } else edges[edgeIndex].handleP = generate_new_handleP_for_movednode(nodes, edges[edgeIndex], anchorSide, previousPosition);
      edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]);
    } else 3 === edges[edgeIndex].power && (edges[edgeIndex] = update_bcurve3p(nodes, edges[edgeIndex], edges[edgeIndex].theta, selfpathANGLE_default));
    edges_tangents[edgeIndex] = generate_tangent(nodes, edges[edgeIndex]);
    var startNodeIndex = matchnodeindex(nodes, edges[edgeIndex].startid),
      endNodeIndex = matchnodeindex(nodes, edges[edgeIndex].endid),
      startPoint = {
        x: nodes[startNodeIndex].x,
        y: nodes[startNodeIndex].y
      },
      endPoint = {
        x: nodes[endNodeIndex].x,
        y: nodes[endNodeIndex].y
      },
      handlePoint = edges[edgeIndex].handleP;
    edges[edgeIndex].labelP = cal_labelP(handlePoint, startPoint, endPoint, edges[edgeIndex].power, labelP_delta_x, labelP_delta_y);
  }
}
function multidrag(deltaX, deltaY) {
  if (1 == svgstatus.nodeselected) for (var selectionIndex = 0; selectionIndex < selectednodeindexes.length; selectionIndex++) {
    var nodeIndex = selectednodeindexes[selectionIndex];
    if (nodeIndex >= 0 & nodeIndex < nodes.length) {
      var previousPosition = {
        x: nodes[nodeIndex].x,
        y: nodes[nodeIndex].y
      };
      nodes[nodeIndex].x += deltaX, nodes[nodeIndex].y += deltaY, update_edge_with_moved_node(nodes[nodeIndex], previousPosition);
    }
  }
  if (1 == svgstatus.noteselected) for (var selectionIndex = 0; selectionIndex < selectednoteindexes.length; selectionIndex++) {
    var noteIndex = selectednoteindexes[selectionIndex];
    noteIndex >= 0 & noteIndex < notes.length && (notes[noteIndex].x += deltaX, notes[noteIndex].y += deltaY);
  }
}
function OnNodeMouseOver(element, node, nodeIndex) {
  d3.select("#" + node.type + node.id).attr("fill", "#FFEEEE"), d3.select("#" + node.type + node.id).attr("stroke", "GREY"), node.selected || d3.select("#" + node.type + node.id).attr("stroke-width", 2 * Math.log(10 * node.strokewidth) + "px");
}
function OnNodeMouseOut(element, node, nodeIndex) {
  d3.select("#" + node.type + node.id).attr("fill", backgroundCOLOR), d3.select("#" + node.type + node.id).attr("stroke", node.color), node.selected || d3.select("#" + node.type + node.id).attr("stroke-width", node.strokewidth + "px");
}
function OnNodeMouseDown(element, node, nodeIndex) {
  var clickedNodeIndex = matchnodeindex(nodes, node.id);
  justmousedownnodeindex = clickedNodeIndex, svgstatus.linkingto >= 1 ? 1 === svgstatus.linkingto ? linkinginitialindex = clickedNodeIndex : 2 === svgstatus.linkingto : 1 === svgstatus.nodeselected;
}
function OnNodeMouseUp(element, node, nodeIndex) {
  var clickedNodeIndex = matchnodeindex(nodes, node.id);
  if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (linkingtargetindex = clickedNodeIndex, edge_add(linkinginitialindex, linkingtargetindex, linkingtoArrowTYPE), linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0), svgstatus.linkingto = 0;else if (1 === svgstatus.texting && (node_text_editing(node, nodeIndex), svgstatus.texting = 0), justmousedownnodeindex === clickedNodeIndex) {
    1 === svgstatus.nodeselected && selectednodeindex === clickedNodeIndex && (mouseCurrentclicktime = new Date(), mouseCurrentclicktime - mouseLastclicktime <= 300 && node_text_editing(node, nodeIndex)), !d3.event.ctrlKey & selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
    var existingIndexes = findIndexes(selectednodeindexes, clickedNodeIndex);
    0 == existingIndexes.length && (selectednodeindex = clickedNodeIndex, selectednodeindexes.push(selectednodeindex), nodes[selectednodeindex].selected = !0), svgstatus.nodeselected = 1, mouseLastclicktime = new Date();
  }
  1 === svgstatus.nodeondragged && (svgstatus.nodeondragged = 0), justmousedownnodeindex = -1, updatesvg();
}
function OnNodeOnDragStart(element, node, nodeIndex) {
  svgstatus.nodeondragged = 1;
  var draggedNodeIndex = matchnodeindex(nodes, node.id);
  predraggedindex = draggedNodeIndex;
}
function OnNodeOnDrag(element, node, nodeIndex, dx, dy) {
  if (0 !== dx || 0 !== dy) {
    var draggedNodeIndex = matchnodeindex(nodes, node.id);
    if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (svgdragline.x0 = nodes[linkinginitialindex].x, svgdragline.y0 = nodes[linkinginitialindex].y, svgdragline.x1 = d3.mouse(mysvg.node())[0], svgdragline.y1 = d3.mouse(mysvg.node())[1]);else if (0 === dx && 0 === dy) ;else if (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2) multidrag(dx, dy);else if (draggedNodeIndex >= 0 && draggedNodeIndex < nodes.length) {
      var previousPosition = {
        x: nodes[draggedNodeIndex].x,
        y: nodes[draggedNodeIndex].y
      };
      nodes[draggedNodeIndex].x += dx, nodes[draggedNodeIndex].y += dy, update_edge_with_moved_node(nodes[draggedNodeIndex], previousPosition);
    }
    updatesvg();
  }
}
function OnNodeOnDragEnd(element, node, nodeIndex) {
  matchnodeindex(nodes, node.id);
  1 == svgstatus.multidraging && (svgstatus.multidraging = 0), svgstatus.nodeondragged = 0;
}
function OnResizedCPMouseOver(controlPoint, cpIndex) {
  d3.select("#rcP" + cpIndex).attr("fill", defaultCOLOR);
}
function OnResizedCPMouseOut(controlPoint, cpIndex) {
  d3.select("#rcP" + cpIndex).attr("fill", backgroundCOLOR);
}
function OnResizedCPMouseDown(element, controlPoint, cpIndex) {
  var nodeIndex = matchnodeindex(nodes, controlPoint.nodeid);
  justmousedownnodeindex = nodeIndex;
}
function OnResizedCPMouseUp(element, controlPoint, cpIndex) {
  var nodeIndex = matchnodeindex(nodes, controlPoint.nodeid);
  justmousedownnodeindex == nodeIndex && (justmousedownnodeindex = -1, svgstatus.nodeselected = 1, selectednodeindex = nodeIndex, nodes[selectednodeindex].selected = !0, updatesvg());
}
function OnResizedCPOnDrag(element, controlPoint, cpIndex, dx, dy) {
  controlPoint.pos.x += dx, controlPoint.pos.y += dy;
  var controlPointPos = {
      x: controlPoint.pos.x,
      y: controlPoint.pos.y
    },
    nodeIndex = matchnodeindex(nodes, controlPoint.nodeid),
    node = nodes[nodeIndex],
    radii = {
      rx: node.rx,
      ry: node.ry
    },
    newRx = node.rx,
    newRy = node.ry;
  switch (node.type) {
    case "ellipse":
      switch (controlPoint.type) {
        case "left":
          var signedDistance = node.x - controlPointPos.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2);
          break;
        case "right":
          var signedDistance = controlPointPos.x - node.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2);
          break;
        case "top":
          var signedDistance = node.y - controlPointPos.y,
            newRy = Math.abs(signedDistance) - 2 * cPr;
          newRy < default_RADIUSV / 2 && (newRy = default_RADIUSV / 2);
          break;
        case "bottom":
          var signedDistance = controlPointPos.y - node.y,
            newRy = Math.abs(signedDistance) - 2 * cPr;
          newRy < default_RADIUSV / 2 && (newRy = default_RADIUSV / 2);
      }
      radii = {
        rx: newRx,
        ry: newRy
      };
      break;
    case "rect":
      switch (controlPoint.type) {
        case "left":
          var signedDistance = node.x - controlPointPos.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2);
          break;
        case "right":
          var signedDistance = controlPointPos.x - node.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2);
          break;
        case "top":
          var signedDistance = node.y - controlPointPos.y,
            newRy = Math.abs(signedDistance) - 2 * cPr;
          newRy < default_RADIUSV / 2 && (newRy = default_RADIUSV / 2);
          break;
        case "bottom":
          var signedDistance = controlPointPos.y - node.y,
            newRy = Math.abs(signedDistance) - 2 * cPr;
          newRy < default_RADIUSV / 2 && (newRy = default_RADIUSV / 2);
      }
      radii = {
        rx: newRx,
        ry: newRy
      };
      break;
    case "triangle":
      switch (controlPoint.type) {
        case "top":
          var signedDistance = node.y - controlPointPos.y,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH && (newRx = default_RADIUSH), newRy = newRx;
          break;
        case "right_bottom":
          var signedDistance = Math.sqrt((node.x - controlPointPos.x) * (node.x - controlPointPos.x) + (node.y - controlPointPos.y) * (node.y - controlPointPos.y)),
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH && (newRx = default_RADIUSH), newRy = newRx;
          break;
        case "left_bottom":
          var signedDistance = Math.sqrt((node.x - controlPointPos.x) * (node.x - controlPointPos.x) + (node.y - controlPointPos.y) * (node.y - controlPointPos.y)),
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH && (newRx = default_RADIUSH), newRy = newRx;
      }
      radii = {
        rx: newRx,
        ry: newRy
      };
      break;
    case "diamond":
      switch (controlPoint.type) {
        case "left":
          var signedDistance = node.x - controlPointPos.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH && (newRx = default_RADIUSH), newRy = newRx;
          break;
        case "right":
          var signedDistance = controlPointPos.x - node.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH && (newRx = default_RADIUSH), newRy = newRx;
      }
      radii = {
        rx: newRx,
        ry: newRy
      };
      break;
    case "hexagon":
      switch (controlPoint.type) {
        case "left":
          var signedDistance = node.x - controlPointPos.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2), newRy = newRx;
          break;
        case "right":
          var signedDistance = controlPointPos.x - node.x,
            newRx = Math.abs(signedDistance) - 2 * cPr;
          newRx < default_RADIUSH / 2 && (newRx = default_RADIUSH / 2), newRy = newRx;
      }
      radii = {
        rx: newRx,
        ry: newRy
      };
  }
  nodes[nodeIndex].rx = radii.rx, nodes[nodeIndex].ry = radii.ry;
  for (var relatedEdgeIndexes = lookfor_relatededges(nodes[nodeIndex].id), cpIndex = 0; cpIndex < relatedEdgeIndexes.length; cpIndex++) {
    var edgeIndex = relatedEdgeIndexes[cpIndex];
    2 === edges[edgeIndex].power ? edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]) : 3 === edges[edgeIndex].power && (edges[edgeIndex] = update_bcurve3p(nodes, edges[edgeIndex], edges[edgeIndex].theta, selfpathANGLE_default)), edges_tangents[edgeIndex] = generate_tangent(nodes, edges[edgeIndex]);
  }
  updatesvg();
}
function OnPathMouseDown(element, edge, edgeIndex, partName) {
  var clickedEdgeIndex = edgeIndex;
  justmousedownedgeindex = clickedEdgeIndex, 1 == svgstatus.linkingto;
}
function OnPathMouseUp(element, edge, edgeIndex, partName) {
  var clickedEdgeIndex = edgeIndex;
  if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0), svgstatus.linkingto = 0;else if (1 === svgstatus.texting && (becurve_text_editing(edge, edgeIndex), svgstatus.texting = 0), justmousedownedgeindex === clickedEdgeIndex) {
    1 === svgstatus.edgeselected && selectededgeindex === clickedEdgeIndex && (mouseCurrentclicktime = new Date(), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(edge, edgeIndex)), !d3.event.ctrlKey & selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
    var existingIndexes = findIndexes(selectededgeindexes, clickedEdgeIndex);
    0 === existingIndexes.length && (selectededgeindex = clickedEdgeIndex, selectededgeindexes.push(selectededgeindex), edges[selectededgeindex].selected = !0), svgstatus.edgeselected = 1, mouseLastclicktime = new Date();
  }
  justmousedownedgeindex = -1, updatesvg();
}
function OnPathMouseOver(element, edge, edgeIndex, partName) {
  switch (edge.handlePshow = !0, partName) {
    case "path":
      d3.select("#handle" + edgeIndex).attr("fill", backgroundCOLOR).attr("stroke", defaultCOLOR), d3.select("#path" + edgeIndex).attr("stroke", "GREY"), edge.selected || d3.select("#path" + edgeIndex).attr("stroke-width", 1.5 * Math.log(10 * edge.strokewidth) + "px");
      break;
    case "handleP":
      d3.select("#handle" + edgeIndex).attr("stroke", defaultCOLOR).attr("fill", defaultCOLOR);
      break;
    case "labelT":
      d3.select("#label" + edgeIndex).attr("stroke", "#888888");
  }
}
function OnPathMouseOut(element, edge, edgeIndex, partName) {
  switch (partName) {
    case "path":
      edge.selected || (d3.select("#handle" + edgeIndex).attr("fill", "none").attr("stroke", "none"), d3.select("#path" + edgeIndex).attr("stroke-width", edge.strokewidth + "px"), edge.handlePshow = !1), d3.select("#path" + edgeIndex).attr("stroke", edge.color);
      break;
    case "handleP":
      edge.selected ? d3.select("#handle" + edgeIndex).attr("stroke", defaultCOLOR).attr("fill", backgroundCOLOR) : (d3.select("#handle" + edgeIndex).attr("stroke", "none").attr("fill", "none"), edge.handlePshow = !1);
      break;
    case "labelT":
      d3.select("#label" + edgeIndex).attr("stroke", "none"), edge.selected || (edge.handlePshow = !1);
  }
}
function OnPathOnDrag(element, edge, edgeIndex, dx, dy, labelDeltaX, labelDeltaY, partName) {
  if (0 !== dx || 0 !== dy) {
    if (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2) multidrag(dx, dy);else {
      edge.handleInitial = !1;
      var handleP = edge.handleP;
      handleP.x += dx, handleP.y += dy, edges[edgeIndex].handleP = handleP, edges[edgeIndex] = update_bcurve(nodes, edges[edgeIndex]), edges_tangents[edgeIndex] = generate_tangent(nodes, edges[edgeIndex]);
      var startNodeIndex = matchnodeindex(nodes, edges[edgeIndex].startid),
        endNodeIndex = matchnodeindex(nodes, edges[edgeIndex].endid),
        startPoint = {
          x: nodes[startNodeIndex].x,
          y: nodes[startNodeIndex].y
        },
        endPoint = {
          x: nodes[endNodeIndex].x,
          y: nodes[endNodeIndex].y
        },
        handlePoint = edges[edgeIndex].handleP;
      edges[edgeIndex].labelP = cal_labelP(handlePoint, startPoint, endPoint, edges[edgeIndex].power, labelDeltaX, labelDeltaY);
    }
    updatesvg();
  }
}
function OnHandlePMouseUp(element, edge, edgeIndex) {
  1 === svgstatus.texting && (bcurve_text_editing(edge, edgeIndex), svgstatus.texting = 0);
  var clickedEdgeIndex = edgeIndex;
  if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0), svgstatus.linkingto = 0;else if (justmousedownedgeindex === clickedEdgeIndex) {
    1 === svgstatus.edgeselected && selectededgeindex === clickedEdgeIndex && (mouseCurrentclicktime = new Date(), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(edge, edgeIndex)), !d3.event.ctrlKey & selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
    var existingIndexes = findIndexes(selectededgeindexes, clickedEdgeIndex);
    0 === existingIndexes.length && (selectededgeindex = clickedEdgeIndex, selectededgeindexes.push(selectededgeindex), edges[selectededgeindex].selected = !0), svgstatus.edgeselected = 1, mouseLastclicktime = new Date();
  }
  justmousedownedgeindex = -1, updatesvg();
}
function OnLabelMouseDown(element, edge, edgeIndex) {
  var clickedEdgeIndex = edgeIndex;
  justmousedownedgeindex = clickedEdgeIndex;
}
function OnLabelMouseUp(element, edge, edgeIndex) {
  1 === svgstatus.texting && (bcurve_text_editing(edge, edgeIndex), svgstatus.texting = 0);
  var clickedEdgeIndex = edgeIndex;
  if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0), svgstatus.linkingto = 0;else if (justmousedownedgeindex === clickedEdgeIndex) {
    1 === svgstatus.edgeselected && selectededgeindex === clickedEdgeIndex && (mouseCurrentclicktime = new Date(), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectededgeindex >= 0 && selectededgeindex < edges.length && bcurve_text_editing(edge, edgeIndex)), !d3.event.ctrlKey & selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected());
    var existingIndexes = findIndexes(selectededgeindexes, clickedEdgeIndex);
    0 === existingIndexes.length && (selectededgeindex = clickedEdgeIndex, selectededgeindexes.push(selectededgeindex), edges[selectededgeindex].selected = !0), svgstatus.edgeselected = 1, mouseLastclicktime = new Date();
  }
  justmousedownedgeindex = -1, updatesvg();
}
function OnLabelOnDragStart(element, edge, edgeIndex) {}
function OnLabelOnDrag(element, edge, edgeIndex, dx, dy) {
  0 === dx && 0 === dy || (edge.labelP.x += dx, edge.labelP.y += dy, updatesvg());
}
function OnLabelOnDragEnd(element, edge, edgeIndex) {}
function OnNoteMouseDown(element, note, noteIndex) {
  var clickedNoteIndex = noteIndex;
  justmousedownnoteindex = clickedNoteIndex;
}
function OnNoteMouseUp(element, note, noteIndex) {
  1 === svgstatus.texting && (note_text_editing(note, noteIndex), svgstatus.texting = 0);
  var clickedNoteIndex = noteIndex;
  if (svgstatus.linkingto >= 1) linkinginitialindex != -1 && (linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0), svgstatus.linkingto = 0;else if (justmousedownnoteindex === clickedNoteIndex) {
    1 === svgstatus.noteselected && selectednoteindex === clickedNoteIndex && (mouseCurrentclicktime = new Date(), mouseCurrentclicktime - mouseLastclicktime <= 300 && selectednoteindex >= 0 && selectednoteindex < notes.length && note_text_editing(note, noteIndex)), !d3.event.ctrlKey & selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected()), 1 === svgstatus.nodeselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && NodesUnselected(), 1 === svgstatus.edgeselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && EdgesUnselected(), 1 === svgstatus.noteselected && selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length <= 1 && NotesUnselected();
    var existingIndexes = findIndexes(selectednoteindexes, clickedNoteIndex);
    0 === existingIndexes.length && (selectednoteindex = clickedNoteIndex, notes[selectednoteindex].selected = !0, selectednoteindexes.push(selectednoteindex)), svgstatus.noteselected = 1, mouseLastclicktime = new Date();
  }
  justmousedownnoteindex = -1, updatesvg();
}
function OnNoteOnDrag(element, note, noteIndex, dx, dy) {
  0 === dx && 0 === dy || (selectededgeindexes.length + selectednodeindexes.length + selectednoteindexes.length >= 2 ? multidrag(dx, dy) : (note.x += dx, note.y += dy), updatesvg());
}
function OnNoteMouseOver(element, note, noteIndex) {
  d3.select("#note" + noteIndex).attr("stroke", "#888888");
}
function OnNoteMouseOut(element, note, noteIndex) {
  d3.select("#note" + noteIndex).attr("stroke", "none");
}
function Dragmove_for_linking(element) {
  if (svgstatus.linkingto >= 1 && linkinginitialindex != -1) {
    var mousePosition = d3.mouse(mysvg);
    svgdragline.x0 = nodes[linkinginitialindex].x, svgdragline.y0 = nodes[linkinginitialindex].y, svgdragline.x1 = mousePosition[0], svgdragline.y1 = mousePosition[1], updatesvg();
  }
}
function OnmysvgMouseDown(element, datum) {
  if (justmousedownnodeindex === -1 && justmousedownedgeindex === -1 && justmousedownnoteindex === -1) if (1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected(), sethandlePhidden(), 1 === svgstatus.texting) {
    var mouseX = d3.mouse(element)[0],
      mouseY = d3.mouse(element)[1],
      mousePoint = {
        x: mouseX,
        y: mouseY
      };
    note_add(mousePoint, "New Note");
  } else if (0 === svgstatus.linkingto) {
    svgstatus.multipleselecting = 1;
    var mouseX = d3.mouse(element)[0],
      mouseY = d3.mouse(element)[1];
    multipleselectframe.x = mouseX, multipleselectframe.y = mouseY;
  }
  updatesvg();
}
function OnmysvgMouseUp(element, datum) {
  svgstatus.linkingto >= 1 ? (linkinginitialindex = -1, linkingtargetindex = -1, svgdragline.x0 = 0, svgdragline.y0 = 0, svgdragline.x1 = 0, svgdragline.y1 = 0, svgstatus.linkingto = 0) : 1 === svgstatus.texting ? svgstatus.texting = 0 : justmousedownedgeindex >= 0 ? justmousedownedgeindex = -1 : justmousedownnodeindex >= 0 ? justmousedownnodeindex = -1 : justmousedownnoteindex >= 0 && (justmousedownnoteindex = -1), 1 === svgstatus.multipleselecting && (multipleselectframe.x = 0, multipleselectframe.y = 0, multipleselectframe.width = 0, multipleselectframe.height = 0, svgstatus.multipleselecting = 0), svgstatus.nodeondragged = 0, svgstatus.svgondragged = 0, updatesvg();
}
function OnmysvgMouseMove(element, datum) {
  if (1 === svgstatus.multipleselecting) {
    var savedFrame = multipleselectframe,
      mousePosition = d3.mouse(element),
      frameDelta = {
        x: mousePosition[0] - multipleselectframe.x,
        y: mousePosition[1] - multipleselectframe.y
      };
    frameDelta.x < 0 || 2 * frameDelta.x < multipleselectframe.width ? (multipleselectframe.x = mousePosition[0], multipleselectframe.width -= frameDelta.x) : multipleselectframe.width = frameDelta.x, frameDelta.y < 0 || 2 * frameDelta.y < multipleselectframe.height ? (multipleselectframe.y = mousePosition[1], multipleselectframe.height -= frameDelta.y) : multipleselectframe.height = frameDelta.y;
    var selectionBounds = {
      x1: multipleselectframe.x,
      y1: multipleselectframe.y,
      x2: multipleselectframe.x + multipleselectframe.width,
      y2: multipleselectframe.y + multipleselectframe.height
    };
    selectionBounds.x1 >= 0 & selectionBounds.x2 <= w & selectionBounds.y1 >= 0 & selectionBounds.y2 <= h || (multipleselectframe = savedFrame, selectionBounds = {
      x1: multipleselectframe.x,
      y1: multipleselectframe.y,
      x2: multipleselectframe.x + multipleselectframe.width,
      y2: multipleselectframe.y + multipleselectframe.height
    }), 1 === svgstatus.nodeselected && NodesUnselected(), 1 === svgstatus.edgeselected && EdgesUnselected(), 1 === svgstatus.noteselected && NotesUnselected();
    for (var itemIndex = 0; itemIndex < nodes.length; itemIndex++) {
      var nodeBounds = Cal_Boundary(nodes[itemIndex], "node");
      nodeBounds.x1 >= selectionBounds.x1 && nodeBounds.x2 <= selectionBounds.x2 && nodeBounds.y1 >= selectionBounds.y1 && nodeBounds.y2 <= selectionBounds.y2 && (nodes[itemIndex].selected = !0, selectednodeindexes.push(itemIndex), selectednodeindex = itemIndex, svgstatus.nodeselected = 1);
    }
    for (var itemIndex = 0; itemIndex < edges.length; itemIndex++) {
      var edgeBounds = Cal_Boundary(edges[itemIndex], "edge");
      edgeBounds.x1 >= selectionBounds.x1 && edgeBounds.x2 <= selectionBounds.x2 && edgeBounds.y1 >= selectionBounds.y1 && edgeBounds.y2 <= selectionBounds.y2 && (edges[itemIndex].selected = !0, selectededgeindexes.push(itemIndex), selectededgeindex = itemIndex, svgstatus.edgeselected = 1);
    }
    for (var itemIndex = 0; itemIndex < notes.length; itemIndex++) {
      var noteBounds = Cal_Boundary(notes[itemIndex], "note");
      noteBounds.x1 >= selectionBounds.x1 && noteBounds.x2 <= selectionBounds.x2 && noteBounds.y1 >= selectionBounds.y1 && noteBounds.y2 <= selectionBounds.y2 && (notes[itemIndex].selected = !0, selectednoteindexes.push(itemIndex), selectednoteindex = itemIndex, svgstatus.noteselected = 1);
    }
    updatesvg();
  }
}
function OnmysvgMouseOut(element, datum) {}
function OnmysvgOnDrag(element, datum) {}
function Attr_Stroke_dasharray(node, index) {
  var dashPattern;
  switch (node.dotted) {
    case 0:
      dashPattern = "none";
      break;
    case 1:
      dashPattern = "5,5";
      break;
    default:
      dashPattern = "none";
  }
  return dashPattern;
}
function generate_grids() {
  for (var rowCount = h / default_RADIUSV, colCount = w / default_RADIUSH, gridRows = [], gridCols = [], rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    var rowY = rowIndex * default_RADIUSV,
      lineStart = {
        x: 0,
        y: rowY
      },
      lineEnd = {
        x: w,
        y: rowY
      },
      gridLine = {
        P1: lineStart,
        P2: lineEnd
      };
    gridRows.push(gridLine);
  }
  for (var colIndex = 0; colIndex < colCount; colIndex++) {
    var colX = colIndex * default_RADIUSH,
      lineStart = {
        x: colX,
        y: 0
      },
      lineEnd = {
        x: colX,
        y: h
      },
      gridLine = {
        P1: lineStart,
        P2: lineEnd
      };
    gridCols.push(gridLine);
  }
  return {
    grids_row: gridRows,
    grids_col: gridCols
  };
}
function updatesvg() {
  if (mysvg.selectAll("line").remove(), mysvg.selectAll("ellipse").remove(), mysvg.selectAll("rect").remove(), mysvg.selectAll("polygon").remove(), mysvg.selectAll("circle").remove(), mysvg.selectAll("path").remove(), mysvg.selectAll("text").remove(), mysvg.selectAll("g").remove(), svgstatus.IsShowGrid) {
    var grids = generate_grids(),
      gridRows = grids.grids_row,
      gridCols = grids.grids_col,
      gridRowSelection = mysvg.selectAll("line.gridrow").data(gridRows);
    gridRowSelection.enter().append("svg:line").attr("class", "line.gridrow").attr("x1", function (datum) {
      return datum.P1.x;
    }).attr("y1", function (datum) {
      return datum.P1.y;
    }).attr("x2", function (datum) {
      return datum.P2.x;
    }).attr("y2", function (datum) {
      return datum.P2.y;
    }).attr("stroke-width", "0.5px").attr("stroke", "GREY").attr("stroke-dasharray", "5,5"), gridRowSelection.exit().remove();
    var gridColSelection = mysvg.selectAll("line.gridcol").data(gridCols);
    gridColSelection.enter().append("svg:line").attr("class", "line.gridcol").attr("x1", function (datum) {
      return datum.P1.x;
    }).attr("y1", function (datum) {
      return datum.P1.y;
    }).attr("x2", function (datum) {
      return datum.P2.x;
    }).attr("y2", function (datum) {
      return datum.P2.y;
    }).attr("stroke-width", "0.5px").attr("stroke", "GREY").attr("stroke-dasharray", "5,5"), gridColSelection.exit().remove();
  }
  var ellipseNodes = nodes.filter(function (datum) {
      return "ellipse" == datum.type;
    }),
    rectNodes = nodes.filter(function (datum) {
      return "rect" == datum.type;
    }),
    triangleNodes = nodes.filter(function (datum) {
      return "triangle" == datum.type;
    }),
    selectedNodes = nodes.filter(function (datum) {
      return 1 == datum.selected;
    }),
    resizeControlPoints = generate_resize_cPs(selectedNodes);
  numRec = rectNodes.length, numElli = ellipseNodes.length, numTri = triangleNodes.length, numNode = nodes.length, numEdge = edges.length, numNote = notes.length;
  var pathSelection = mysvg.selectAll("path.Gs").data(edges);
  pathGs = pathSelection.enter().append("svg:g").attr("class", "path.Gs"), pathGs.on("mouseover", function (datum, index) {
    OnPathMouseOver(this, datum, index, "path");
  }).on("mouseout", function (datum, index) {
    OnPathMouseOut(this, datum, index, "path");
  }).on("mousedown", function (datum, index) {
    OnPathMouseDown(this, datum, index, "path");
  }).on("mouseup", function (datum, index) {
    OnPathMouseUp(this, datum, index, "path");
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    labelP_delta_x = datum.labelP.x - datum.handleP.x, labelP_delta_y = datum.labelP.y - datum.handleP.y;
  }).on("drag", function (datum, index) {
    0 != d3.event.dx && 0 != d3.event.dy && OnPathOnDrag(this, datum, index, d3.event.dx, d3.event.dy, labelP_delta_x, labelP_delta_y, "pathG");
  }).on("dragend", function (datum) {})), pathGs.append("svg:path").attr("class", "path.Arrow1").attr("id", function (datum, index) {
    return "patharrow1" + index;
  }).attr("d", function (datum, index) {
    return edges_tangents[index].tangentline1;
  }).attr("fill", "none").attr("stroke", "WHITE").attr("stroke-width", function (datum, index) {
    return edges[index].selected ? 0.6 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }).style("opactic", "100%").style("marker-end", function (datum) {
    var defaultMarkerUrl = "url(#endarrow)",
      coloredMarkerUrl = "url(#endarrow" + datum.color + ")";
    switch (datum.type) {
      case "bi":
        defaultMarkerUrl = coloredMarkerUrl;
        break;
      case "uni":
        defaultMarkerUrl = "url(#arrowfake)";
    }
    return defaultMarkerUrl;
  }), pathGs.append("svg:path").attr("class", "path.Arrow2").attr("id", function (datum, index) {
    return "patharrow2" + index;
  }).attr("d", function (datum, index) {
    return edges_tangents[index].tangentline2;
  }).attr("fill", "none").attr("stroke", "WHITE").attr("stroke-width", function (datum, index) {
    return edges[index].selected ? 0.6 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }).style("opactic", "100%").style("marker-end", function (datum) {
    var coloredMarkerUrl = "url(#endarrow" + datum.color + ")";
    return coloredMarkerUrl;
  }), pathGs.append("svg:path").attr("class", "path.link").attr("id", function (datum, index) {
    return "path" + index;
  }).attr("d", function (datum) {
    return datum.line;
  }).attr("fill", "none").attr("stroke", function (datum, index) {
    return datum.color;
  }).attr("stroke-width", function (datum, index) {
    return edges[index].selected ? 1.5 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }).attr("stroke-dasharray", function (datum, index) {
    return Attr_Stroke_dasharray(datum, index);
  }).style("opactic", "1"), pathSelection.exit().remove();
  var handleSelection = mysvg.selectAll("circle.handle").data(edges);
  handleSelection.enter().append("svg:circle").attr("class", "circle.handle").attr("id", function (datum, index) {
    return "handle" + index;
  }).attr("cx", function (datum) {
    return datum.handleP.x;
  }).attr("cy", function (datum) {
    return datum.handleP.y;
  }).attr("r", function (datum, index) {
    return datum.selected ? String(1.5 * cPr) : String(cPr);
  }).attr("stroke", function (datum, index) {
    return datum.handlePshow | datum.selected ? defaultCOLOR : "none";
  }).attr("fill", function (datum) {
    return datum.handlePshow | datum.selected ? backgroundCOLOR : "none";
  }).on("mouseover", function (datum, index) {
    OnPathMouseOver(this, datum, index, "handleP");
  }).on("mouseout", function (datum, index) {
    OnPathMouseOut(this, datum, index, "handleP");
  }).on("mousedown", function (datum, index) {
    OnPathMouseDown(this, datum, index, "handleP");
  }).on("mouseup", function (datum, index) {
    OnPathMouseUp(this, datum, index, "handleP");
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    labelP_delta_x = datum.labelP.x - datum.handleP.x, labelP_delta_y = datum.labelP.y - datum.handleP.y;
  }).on("drag", function (datum, index) {
    0 != d3.event.dx && 0 != d3.event.dy && OnPathOnDrag(this, datum, index, d3.event.dx, d3.event.dy, labelP_delta_x, labelP_delta_y, "handleP");
  }).on("dragend", function (datum) {})), handleSelection.exit().remove();
  var labelSelection = mysvg.selectAll("label.Gs").data(edges);
  labelGs = labelSelection.enter().append("svg:g").attr("class", "label.Gs"), labelGs.style("stroke", function (datum) {
    return datum.color;
  }).attr("id", function (datum) {
    return "Glabel" + datum.id;
  }).on("mouseover", function (datum, index) {
    OnPathMouseOver(this, datum, index, "labelT");
  }).on("mouseout", function (datum, index) {
    OnPathMouseOut(this, datum, index, "labelT");
  }).on("mousedown", function (datum, index) {
    OnPathMouseDown(this, datum, index, "lableT");
  }).on("mouseup", function (datum, index) {
    OnPathMouseUp(this, datum, index, "lableT");
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    OnLabelOnDragStart(this, datum, index);
  }).on("drag", function (datum, index) {
    OnLabelOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum, index) {
    OnLabelOnDragEnd(this, datum, index);
  })), labelGs.append("svg:rect").attr("class", "lebel.rect").attr("id", function (datum) {
    return "rectlabel" + datum.id;
  }).attr("x", function (datum) {
    return datum.labelP.x - datum.label.length * datum.labelFsize * 0.5;
  }).attr("y", function (datum) {
    return datum.labelP.y - 1 * datum.labelFsize;
  }).attr("width", function (datum) {
    var halfWidth = datum.label.length * datum.labelFsize * 0.5;
    return String(2 * halfWidth);
  }).attr("height", function (datum) {
    return String(1.5 * datum.labelFsize);
  }).attr("fill", "none").attr("stroke", function (datum, index) {
    return "none";
  }).attr("stroke-dasharray", "none").attr("stroke-width", "1px"), labelGs.append("svg:text").attr("class", "text.label").attr("id", function (datum, index) {
    return "label" + index;
  }).attr("text-anchor", "middle").attr("font-size", function (datum, index) {
    if (selectededgeindex === index) {
      var selectedFontSize = datum.labelFsize + 5;
      return selectedFontSize + "pt";
    }
    return datum.labelFsize + "pt";
  }).attr("stroke", function (datum, index) {
    return svgstatus.IsShowLabels, "none";
  }).attr("fill", function (datum, index) {
    return svgstatus.IsShowLabels ? defaultCOLOR : "none";
  }).attr("x", function (datum) {
    return datum.labelP.x;
  }).attr("y", function (datum) {
    return datum.labelP.y;
  }).text(function (datum, index) {
    return datum.label;
  }), labelSelection.exit().remove(), svgstatus.linkingto >= 1 && (tline = "M" + svgdragline.x0 + " " + svgdragline.y0 + " L" + svgdragline.x1 + " " + svgdragline.y1, linkingpath = mysvg.append("svg:path").attr("class", "path.linking").attr("d", tline).attr("fill", "none").attr("stroke", "BLACK").attr("stroke-width", "2px").attr("stroke-dasharray", "none").style("opactic", "1"));
  var rectSelection = mysvg.selectAll("rect.Gs").data(rectNodes);
  rectGs = rectSelection.enter().append("svg:g").attr("class", "rect.Gs"), rectGs.attr("id", function (datum) {
    return "G" + datum.id;
  }).style("stroke", function (datum) {
    return datum.color;
  }).on("mouseover", function (datum, index) {
    OnNodeMouseOver(this, datum, index);
  }).on("mouseout", function (datum, index) {
    OnNodeMouseOut(this, datum, index);
  }).on("mousedown", function (datum, index) {
    OnNodeMouseDown(this, datum, index);
  }).on("mouseup", function (datum, index) {
    OnNodeMouseUp(this, datum, index);
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    OnNodeOnDragStart(this, datum, index);
  }).on("drag", function (datum, index) {
    OnNodeOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum, index) {
    OnNodeOnDragEnd(this, datum, index);
  })), rectGs.append("svg:rect").attr("class", "rect.node").attr("id", function (datum) {
    return "rect" + datum.id;
  }).attr("x", function (datum) {
    return String(datum.x - datum.rx);
  }).attr("y", function (datum) {
    return String(datum.y - datum.ry);
  }).attr("width", function (datum) {
    return String(2 * datum.rx);
  }).attr("height", function (datum) {
    return String(2 * datum.ry);
  }).attr("fill", "WHITE").attr("stroke", function (datum) {
    return datum.color;
  }).attr("stroke-dasharray", function (datum, index) {
    return Attr_Stroke_dasharray(datum, index);
  }).attr("stroke-width", function (datum) {
    return datum.selected ? 2 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }), rectGs.append("svg:text").attr("class", "text.node").attr("text-anchor", "middle").attr("font-size", function (datum) {
    return datum.fontsize ? datum.fontsize + "pt" : "10pt";
  }).attr("stroke", "none").attr("fill", defaultCOLOR).attr("x", function (datum) {
    return datum.x;
  }).attr("y", function (datum) {
    return datum.y + datum.fontsize / 2;
  }).text(function (datum, index) {
    return datum.title;
  }), rectSelection.exit().remove();
  var ellipseSelection = mysvg.selectAll("ellipse.Gs").data(ellipseNodes);
  ellipseGs = ellipseSelection.enter().append("svg:g").attr("class", "ellipse.Gs"), ellipseGs.style("stroke", function (datum) {
    return datum.color;
  }).attr("id", function (datum) {
    return "node" + datum.id;
  }).on("mouseover", function (datum, index) {
    OnNodeMouseOver(this, datum, index);
  }).on("mouseout", function (datum, index) {
    OnNodeMouseOut(this, datum, index);
  }).on("mousedown", function (datum, index) {
    OnNodeMouseDown(this, datum, index);
  }).on("mouseup", function (datum, index) {
    OnNodeMouseUp(this, datum, index);
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    OnNodeOnDragStart(this, datum, index);
  }).on("drag", function (datum, index) {
    OnNodeOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum, index) {
    OnNodeOnDragEnd(this, datum, index);
  })), ellipseGs.append("svg:ellipse").attr("class", "ellipses.node").attr("id", function (datum) {
    return "ellipse" + datum.id;
  }).attr("cx", function (datum) {
    return datum.x;
  }).attr("cy", function (datum) {
    return datum.y;
  }).attr("rx", function (datum) {
    return datum.rx;
  }).attr("ry", function (datum) {
    return datum.ry;
  }).attr("fill", "WHITE").attr("stroke", function (datum) {
    return datum.color;
  }).attr("stroke-dasharray", function (datum, index) {
    return Attr_Stroke_dasharray(datum, index);
  }).attr("stroke-width", function (datum, index) {
    return datum.selected ? 2 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }), ellipseGs.append("svg:text").attr("class", "text.node").attr("text-anchor", "middle").attr("font-size", function (datum) {
    return datum.fontsize ? datum.fontsize + "pt" : "10pt";
  }).attr("stroke", "none").attr("fill", defaultCOLOR).attr("x", function (datum) {
    return datum.x;
  }).attr("y", function (datum) {
    return datum.y + datum.fontsize / 2;
  }).text(function (datum, index) {
    return datum.title;
  }), ellipseSelection.exit().remove();
  var triangleSelection = mysvg.selectAll("triangle.Gs").data(triangleNodes);
  triangleGs = triangleSelection.enter().append("svg:g").attr("class", "triangle.Gs"), triangleGs.attr("id", function (datum) {
    return "G" + datum.id;
  }).style("stroke", function (datum) {
    return datum.color;
  }).on("mouseover", function (datum, index) {
    OnNodeMouseOver(this, datum, index);
  }).on("mouseout", function (datum, index) {
    OnNodeMouseOut(this, datum, index);
  }).on("mousedown", function (datum, index) {
    OnNodeMouseDown(this, datum, index);
  }).on("mouseup", function (datum, index) {
    OnNodeMouseUp(this, datum, index);
  }).call(d3.behavior.drag().on("dragstart", function (datum, index) {
    OnNodeOnDragStart(this, datum, index);
  }).on("drag", function (datum, index) {
    OnNodeOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum, index) {
    OnNodeOnDragEnd(this, datum, index);
  })), triangleGs.append("svg:polygon").attr("id", function (datum) {
    return "triangle" + datum.id;
  }).attr("points", function (datum) {
    var bottomLeft = {
        x: datum.x - datum.rx * Math.sqrt(3) / 2,
        y: datum.y + datum.rx / 2
      },
      bottomRight = {
        x: datum.x + datum.rx * Math.sqrt(3) / 2,
        y: datum.y + datum.rx / 2
      },
      apex = {
        x: datum.x,
        y: datum.y - datum.ry
      };
    return temp = bottomLeft.x + "," + bottomLeft.y + " " + bottomRight.x + "," + bottomRight.y + " " + apex.x + "," + apex.y + " " + bottomLeft.x + "," + bottomLeft.y, temp;
  }).attr("class", "polygon.triangle").attr("fill", "WHITE").attr("stroke", function (datum) {
    return datum.color;
  }).attr("stroke-dasharray", function (datum, index) {
    return Attr_Stroke_dasharray(datum, index);
  }).attr("stroke-width", function (datum) {
    return datum.selected ? 2 * Math.log(10 * datum.strokewidth) + "px" : datum.strokewidth + "px";
  }), triangleGs.append("svg:text").attr("class", "text.node").attr("text-anchor", "middle").attr("font-size", function (datum) {
    return datum.fontsize ? datum.fontsize + "pt" : "10pt";
  }).attr("stroke", "none").attr("fill", defaultCOLOR).attr("x", function (datum) {
    return datum.x;
  }).attr("y", function (datum) {
    return datum.y + datum.fontsize / 2;
  }).text(function (datum, index) {
    return datum.title;
  }), triangleSelection.exit().remove();
  var resizeSelection = mysvg.selectAll("circle.resizecP").data(resizeControlPoints);
  resizeSelection.enter().append("svg:circle").attr("class", "circle.resizecPe").attr("id", function (datum, index) {
    return "rcP" + index;
  }).attr("cx", function (datum) {
    return datum.pos.x;
  }).attr("cy", function (datum) {
    return datum.pos.y;
  }).attr("r", String(cPr)).attr("stroke", defaultCOLOR).attr("fill", backgroundCOLOR).on("mouseover", function (datum, index) {
    OnResizedCPMouseOver(datum, index);
  }).on("mouseout", function (datum, index) {
    OnResizedCPMouseOut(datum, index);
  }).on("mousedown", function (datum, index) {
    OnResizedCPMouseDown(this, datum, index);
  }).on("mouseup", function (datum, index) {
    OnResizedCPMouseUp(this, datum, index);
  }).call(d3.behavior.drag().on("dragstart", function (datum) {}).on("drag", function (datum, index) {
    OnResizedCPOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum) {})), resizeSelection.exit().remove();
  var noteSelection = mysvg.selectAll("note.Gs").data(notes);
  noteGs = noteSelection.enter().append("svg:g").attr("class", "note.Gs"), noteGs.style("stroke", function (datum) {
    return datum.color;
  }).attr("id", function (datum) {
    return "G" + datum.id;
  }).on("mouseover", function (datum, index) {
    d3.select("#note" + index).attr("stroke", "#888888");
  }).on("mouseout", function (datum, index) {
    d3.select("#note" + index).attr("stroke", "none");
  }).on("mousedown", function (datum, index) {
    OnNoteMouseDown(this, datum, index);
  }).on("mouseup", function (datum, index) {
    OnNoteMouseUp(this, datum, index);
  }).call(d3.behavior.drag().on("dragstart", function (datum) {
    this.__origin__ = {
      x: datum.x,
      y: datum.y
    };
  }).on("drag", function (datum, index) {
    OnNoteOnDrag(this, datum, index, d3.event.dx, d3.event.dy);
  }).on("dragend", function (datum) {
    delete this.__origin__;
  })), noteGs.append("svg:rect").attr("class", "note.node").attr("id", function (datum) {
    return "rectnote" + datum.id;
  }).attr("x", function (datum) {
    return datum.x - datum.text.length * datum.fontsize * 0.5;
  }).attr("y", function (datum) {
    return datum.y - 1 * datum.fontsize;
  }).attr("width", function (datum) {
    var halfWidth = datum.text.length * datum.fontsize * 0.5;
    return String(2 * halfWidth);
  }).attr("height", function (datum) {
    return String(1.5 * datum.fontsize);
  }).attr("fill", "none").attr("stroke", function (datum, index) {
    return "none";
  }).attr("stroke-dasharray", "none").attr("stroke-width", "1px"), noteGs.append("svg:text").attr("class", "text.note").attr("id", function (datum, index) {
    return "note" + index;
  }).attr("text-anchor", "middle").attr("font-size", function (datum, index) {
    if (datum.selected === !0) {
      var selectedFontSize = datum.fontsize + 5;
      return selectedFontSize + "pt";
    }
    return datum.fontsize + "pt";
  }).attr("stroke", function (datum, index) {
    return "none";
  }).attr("fill", function (datum, index) {
    return datum.color;
  }).attr("x", function (datum) {
    return datum.x;
  }).attr("y", function (datum) {
    return datum.y;
  }).text(function (datum, index) {
    return datum.text;
  }), noteSelection.exit().remove(), 1 === svgstatus.multipleselecting && mysvg.append("svg:rect").attr("class", "selecting").attr("x", multipleselectframe.x).attr("y", multipleselectframe.y).attr("width", multipleselectframe.width).attr("height", multipleselectframe.height).attr("fill", "transparent").attr("stroke", "#8888BB").attr("stroke-dasharray", "5,5").attr("stroke-width", "1.5 px"), mysvg.on("mousedown", function (datum) {
    OnmysvgMouseDown(this, datum);
  }).on("mouseup", function (datum) {
    OnmysvgMouseUp(this, datum);
  }).on("mouseout", function (datum) {
    OnmysvgMouseOut(this, datum);
  }), 0 === svgstatus.linkingto && 0 === svgstatus.texting && 1 === svgstatus.multipleselecting && mysvg.on("mousemove", function (datum) {
    OnmysvgMouseMove(this, datum);
  }), document.getElementById("submatrix").innerHTML = GraphToText1(), document.getElementById("submatrix").height = 16 * (edges.length + 1);
  typeof svgmathqueue !== "undefined" && (svgmathfast(), function (latexTextSelection) {
    latexTextSelection.empty() || (latexTextSelection.attr("visibility", "hidden"), typesetsvgmath());
  }(d3.selectAll("text").filter(function () {
    return /^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/.test(this.textContent);
  })));
}
var svgmathbusy = !1,
  svgmathwanted = !1;
function svgmathfast() {
  var cache = window.svgmathcache || {};
  d3.selectAll("text").each(function () {
    var match = this.textContent.match(/^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/),
      cacheEntry = match && cache[match[2] + "|" + (this.getAttribute("font-size") || "").split("pt")[0] + "|" + match[1]];
    if (cacheEntry) {
      var clone = cacheEntry.inner.cloneNode(!0);
      clone.setAttribute("transform", "translate(" + +this.getAttribute("x") + " " + +this.getAttribute("y") + ") scale(" + cacheEntry.scale + ") translate(" + cacheEntry.alignX + " " + cacheEntry.alignY + ") matrix(1 0 0 -1 0 0)"), this.parentNode.replaceChild(clone, this);
    }
  });
}
function typesetsvgmath() {
  if (svgmathbusy) return void (svgmathwanted = !0);
  svgmathbusy = !0, svgmathwanted = !1, MathJax.Hub.Config({
    messageStyle: "none"
  });
  var queue = new Svg_MathJax_queue(d3.select("#svgcontainer")[0][0]);
  queue.onDone = function () {
    svgmathbusy = !1, svgmathwanted && typesetsvgmath();
  }, svgmathqueue.Push([function () {
    queue.install();
  }]);
}
function updatesvgmath() {
  svgmathqueue.Push([updatesvg]), typesetsvgmath();
}
