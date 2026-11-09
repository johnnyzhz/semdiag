/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         *
 ***************************************************/

// update 2021-June 20 - fix save diagram/html/svg to html

function ResetButtonStatus() {
  (svgstatus.linkingto >= 1 &&
    ((svgstatus.linkingto = 0),
    (linkinginitialindex = -1),
    (linkingtargetindex = -1),
    (linkingtoArrowTYPE = "uni"),
    (svgdragline = {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
    })),
    1 === svgstatus.texting && (svgstatus.texting = 0),
    1 === svgstatus.drawingline &&
      ((svgstatus.drawingline = 0),
      (svgdragline2 = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
      })),
    1 === svgstatus.multipleselecting &&
      ((svgstatus.multipleselecting = 0),
      (multipleselectframe = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      })));
}
function BTNrect() {
  ResetButtonStatus();
  node_add(newnodeInitialPos_rect, default_RADIUSH, default_RADIUSV, "rect");
  (newnodeInitialPos_rect.x - nodeInitialPos_rect.x >=
  loopTagger_newnode * default_RADIUSH
    ? (newnodeInitialPos_rect.x = nodeInitialPos_rect.x)
    : (newnodeInitialPos_rect.x = newnodeInitialPos_rect.x + default_RADIUSH),
    newnodeInitialPos_rect.y - nodeInitialPos_rect.y >=
    loopTagger_newnode * default_RADIUSV
      ? (newnodeInitialPos_rect.y = nodeInitialPos_rect.y)
      : (newnodeInitialPos_rect.y = newnodeInitialPos_rect.y + default_RADIUSV),
    updatesvg());
}
function BTNellipse() {
  ResetButtonStatus();
  var newNode = node_add(
    newnodeInitialPos_ellipse,
    default_RADIUSH,
    default_RADIUSV,
    "ellipse",
  );
  (newnodeInitialPos_ellipse.x - nodeInitialPos_ellipse.x >=
  loopTagger_newnode * default_RADIUSH
    ? (newnodeInitialPos_ellipse.x = nodeInitialPos_ellipse.x)
    : (newnodeInitialPos_ellipse.x =
        newnodeInitialPos_ellipse.x + default_RADIUSH),
    newnodeInitialPos_ellipse.y - nodeInitialPos_ellipse.y >=
    loopTagger_newnode * default_RADIUSV
      ? (newnodeInitialPos_ellipse.y = nodeInitialPos_ellipse.y)
      : (newnodeInitialPos_ellipse.y =
          newnodeInitialPos_ellipse.y + default_RADIUSV),
    (newnodeindex = matchnodeindex(nodes, newNode.id)),
    edge_add(newnodeindex, newnodeindex, "bi"),
    updatesvg());
}
function BTNtriangle() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      tselectednodeindex = selectednodeindexes[loopIndex];
      var selectedNode = nodes[tselectednodeindex];
      if ("rect" === selectedNode.type || "ellipse" === selectedNode.type) {
        0 === numTri &&
          ((tnodeInitialPos = {
            x: nodeInitialPos.x - 2 * default_RADIUSH,
            y: nodeInitialPos.y - default_RADIUSV,
          }),
          (theTriangle = node_add(
            tnodeInitialPos,
            default_RADIUSH,
            default_RADIUSV,
            "triangle",
          )));
        var newEdge = generate_edge(
            nodes,
            theTriangle.id,
            selectedNode.id,
            "uni",
          ),
          duplicateEdgeIndex = lookfor_duplicatedbcurve(
            nodes,
            edges,
            newEdge.startid,
            newEdge.endid,
            "uni",
          );
        if (duplicateEdgeIndex >= 0);
        else {
          var newTangent = generate_tangent(nodes, newEdge);
          (edges.push(newEdge), numEdge++, edges_tangents.push(newTangent));
        }
      }
    }
    updatesvg();
  }
}
function BTNlinkingto() {
  (ResetButtonStatus(), (linkingtoArrowTYPE = "uni"));
  var selectedEdgeIds = [];
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex],
        edgeId = edges[edgeIndex].id;
      selectedEdgeIds.push(edgeId);
    }
  if (1 === svgstatus.edgeselected) {
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = matchedgeindex(edges, selectedEdgeIds[loopIndex]);
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edge = edges[edgeIndex];
        if (edge.type != linkingtoArrowTYPE)
          if (2 === edge.power) {
            edges[edgeIndex].type = linkingtoArrowTYPE;
            var startNodeIndex = matchnodeindex(nodes, edge.startid),
              endNodeIndex = matchnodeindex(nodes, edge.endid);
            if (edge.labelInitial) {
              var labelText = generate_label(
                nodes[startNodeIndex],
                nodes[endNodeIndex],
                "uni",
                2,
              );
              edges[edgeIndex].label = labelText;
            }
            if ("triangle" === nodes[startNodeIndex].type);
            else {
              var newEdgeIndex = edge_add(endNodeIndex, endNodeIndex, "bi");
              (newEdgeIndex >= 0) & (newEdgeIndex < edges.length) &&
                (edges[newEdgeIndex].IsAutoGenerated = !0);
            }
          } else 3 == edge.power;
      }
    }
    (EdgesUnselected(), updatesvg());
  } else if (1 === svgstatus.nodeselected) {
    if (1 == selectednodeindexes.length) {
      var selectedNodeIndex = selectednodeindexes[0];
      (selectedNodeIndex >= 0) & (selectedNodeIndex < nodes.length) &&
        ((svgstatus.linkingto = 2), (linkinginitialindex = selectedNodeIndex));
    }
  } else ((svgstatus.linkingto = 1), updatesvg());
}
function BTNlinkingto2() {
  (ResetButtonStatus(), (linkingtoArrowTYPE = "bi"));
  var selectedEdgeIds = [];
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex],
        edgeId = edges[edgeIndex].id;
      selectedEdgeIds.push(edgeId);
    }
  if (1 === svgstatus.edgeselected) {
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = matchedgeindex(edges, selectedEdgeIds[loopIndex]);
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edge = edges[edgeIndex];
        if (edge.type != linkingtoArrowTYPE)
          if (2 === edge.power) {
            var startNode = nodes[matchnodeindex(nodes, edge.startid)],
              endNode = nodes[matchnodeindex(nodes, edge.endid)];
            if ("triangle" === startNode.type);
            else {
              if (
                ((edges[edgeIndex].type = linkingtoArrowTYPE),
                edge.labelInitial)
              ) {
                var labelText = generate_label(startNode, endNode, "bi", 2);
                edges[edgeIndex].label = labelText;
              }
              delete_nonuseedges(
                edges[edgeIndex].startid,
                edges[edgeIndex].endid,
                linkingtoArrowTYPE,
              );
            }
          } else 3 === edge.power;
      }
    }
    (EdgesUnselected(), updatesvg());
  } else
    1 === svgstatus.nodeselected
      ? 1 == selectednodeindexes.length &&
        (selectednodeindex >= 0) & (selectednodeindex < nodes.length) &&
        ((svgstatus.linkingto = 2), (linkinginitialindex = selectednodeindex))
      : (svgstatus.linkingto = 1);
}
function BTNtexting() {
  if (
    (ResetButtonStatus(),
    1 === svgstatus.nodeselected ||
      1 === svgstatus.edgeselected ||
      1 === svgstatus.noteselected)
  ) {
    if (1 === svgstatus.nodeselected) {
      var selectedIndex = selectednodeindex,
        selectedItem = nodes[selectedIndex];
      node_text_editing(selectedItem);
    } else if (1 === svgstatus.edgeselected) {
      var selectedIndex = selectededgeindex,
        selectedItem = edges[selectedIndex];
      bcurve_text_editing(selectedItem, selectedIndex);
    } else if (1 === svgstatus.noteselected) {
      var selectedIndex = selectednoteindex,
        selectedItem = notes[selectedIndex];
      note_text_editing(selectedItem, selectedIndex);
    }
    updatesvg();
  } else svgstatus.texting = 1;
}
function BTNdel() {
  ResetButtonStatus();
  var selectedEdgeIds = [],
    selectedNodeIds = [];
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex],
        itemId = edges[edgeIndex].id;
      selectedEdgeIds.push(itemId);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        itemId = nodes[nodeIndex].id;
      selectedNodeIds.push(itemId);
    }
  if (1 === svgstatus.edgeselected) {
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = matchedgeindex(edges, selectedEdgeIds[loopIndex]);
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexToDelete = edgeIndex;
        edge_delete(edgeIndexToDelete);
      }
    }
    EdgesUnselected();
  }
  if (1 === svgstatus.nodeselected) {
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = -1;
      if (
        ((nodeIndex = matchnodeindex(nodes, selectedNodeIds[loopIndex])),
        (nodeIndex >= 0) & (nodeIndex < nodes.length))
      ) {
        var nodeIndexToDelete = nodeIndex;
        node_delete(nodeIndexToDelete);
      }
    }
    NodesUnselected();
  }
  if (1 === svgstatus.noteselected) {
    selectednoteindexes.sort(function (first, second) {
      return second - first;
    });
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      if ((noteIndex >= 0) & (noteIndex < notes.length)) {
        var noteIndexToDelete = noteIndex;
        note_delete(noteIndexToDelete);
      }
    }
    NotesUnselected();
  }
  updatesvg();
}
function BTNclone() {
  ResetButtonStatus();
  var offsetX = default_RADIUSV,
    offsetY = default_RADIUSH,
    originalNodes = [],
    clonedNodes = [];
  if (1 === svgstatus.nodeselected) {
    selectednodeindexes.sort(function (first, second) {
      return first - second;
    });
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
        var node = nodes[nodeIndex];
        if ("triangle" === node.type)
          (clonedNodes.push(node), originalNodes.push(node));
        else {
          var copiedNode = node_copy(node);
          null == copiedNode ||
            ((copiedNode.x = node.x + offsetX),
            (copiedNode.y = node.y + offsetY),
            clonedNodes.push(copiedNode),
            (nodes[matchnodeindex(nodes, copiedNode.id)] = copiedNode),
            originalNodes.push(node));
        }
      }
    }
  }
  var originalEdges = [],
    clonedEdges = [];
  if (1 === svgstatus.edgeselected) {
    selectededgeindexes.sort(function (first, second) {
      return first - second;
    });
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edge = edges[edgeIndex],
          startIndex = matchnodeindex(originalNodes, edge.startid),
          endIndex = matchnodeindex(originalNodes, edge.endid);
        if ((startIndex != -1) & (endIndex != -1)) {
          var newEdge = generate_edge(
            clonedNodes,
            clonedNodes[startIndex].id,
            clonedNodes[endIndex].id,
            edge.type,
          );
          if (
            ("triangle" === clonedNodes[startIndex].type ||
              ((newEdge.handleP = {
                x: edge.handleP.x + offsetX,
                y: edge.handleP.y + offsetY,
              }),
              (newEdge.labelP = {
                x: edge.labelP.x + offsetX,
                y: edge.labelP.y + offsetY,
              })),
            (newEdge.dotted = edge.dotted),
            (newEdge.color = edge.color),
            (newEdge.strokewidth = edge.strokewidth),
            (newEdge.label = edge.label),
            (newEdge.labelFsize = edge.labelFsize),
            (newEdge.labelshow = edge.labelshow),
            (newEdge.handleshow = !1),
            (newEdge.handleInitial = edge.handleInitial),
            (newEdge.IsAutoGenerated = edge.IsAutoGenerated),
            (newEdge.curve_LR = edge.curve_LR),
            (newEdge.selected = !0),
            (newEdge = update_bcurve(clonedNodes, newEdge)),
            null == newEdge)
          );
          else {
            edge_add_newbcurve(newEdge);
            (clonedEdges.push(newEdge), originalEdges.push(edge));
          }
        }
      }
    }
  }
  var chartSize = AdjustChartSize(nodes, edges, edges_tangents, notes);
  (chartSize.w > w && (w = chartSize.w),
    chartSize.h > h && (h = chartSize.h),
    1 === svgstatus.nodeselected && NodesUnselected(),
    1 === svgstatus.edgeselected && EdgesUnselected(),
    1 === svgstatus.noteselected && NotesUnselected());
  for (var loopIndex = 0; loopIndex < clonedNodes.length; loopIndex++)
    ((tindex = matchnodeindex(nodes, clonedNodes[loopIndex].id)),
      selectednodeindexes.push(tindex),
      (selectednodeindex = tindex));
  selectednodeindexes.length >= 1 && (svgstatus.nodeselected = 1);
  for (var loopIndex = 0; loopIndex < clonedEdges.length; loopIndex++)
    ((tindex = matchedgeindex(edges, clonedEdges[loopIndex].id)),
      selectededgeindexes.push(tindex),
      (selectededgeindex = tindex));
  (selectededgeindexes.length >= 1 && (svgstatus.edgeselected = 1),
    updatesvg());
}
function BTNred() {
  ResetButtonStatus();
  var color = "RED";
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].color = color);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].color = color);
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].color = color);
    }
  updatesvg();
}
function BTNblue() {
  ResetButtonStatus();
  var color = "BLUE";
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].color = color);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].color = color);
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].color = color);
    }
  updatesvg();
}
function BTNgreen() {
  ResetButtonStatus();
  var color = "GREEN";
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].color = color);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].color = color);
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].color = color);
    }
  updatesvg();
}
function BTNblack() {
  ResetButtonStatus();
  var color = "BLACK";
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].color = color);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].color = color);
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].color = color);
    }
  updatesvg();
}
function BTNsolid() {
  if ((ResetButtonStatus(), 1 === svgstatus.edgeselected))
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].dotted = 0);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].dotted = 0);
    }
  updatesvg();
}
function BTNdotted() {
  if ((ResetButtonStatus(), 1 === svgstatus.edgeselected))
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].dotted = 1);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].dotted = 1);
    }
  updatesvg();
}
function BTNla() {
  (ResetButtonStatus(),
    (svgstatus.IsShowLabels = !svgstatus.IsShowLabels),
    (oBTN = document.getElementById("BTNLaimage")),
    svgstatus.IsShowLabels
      ? (oBTN.src = "./img/La.png")
      : (oBTN.src = "./img/La1.png"),
    updatesvg());
}
function BTNgrid() {
  (ResetButtonStatus(),
    (svgstatus.IsShowGrid = !svgstatus.IsShowGrid),
    updatesvg());
}
function BTNalignleft() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var alignTarget =
          nodes[selectednodeindexes[0]].x - nodes[selectednodeindexes[0]].rx,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      savedPositions.push(position);
      var nodeEdgeValue = nodes[nodeIndex].x - nodes[nodeIndex].rx;
      alignTarget > nodeEdgeValue && (alignTarget = nodeEdgeValue);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].x = alignTarget + nodes[nodeIndex].rx;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNalignright() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var alignTarget =
          nodes[selectednodeindexes[0]].x + nodes[selectednodeindexes[0]].rx,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      savedPositions.push(position);
      var nodeEdgeValue = nodes[nodeIndex].x + nodes[nodeIndex].rx;
      alignTarget < nodeEdgeValue && (alignTarget = nodeEdgeValue);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].x = alignTarget - nodes[nodeIndex].rx;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNaligntop() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var alignTarget =
          nodes[selectednodeindexes[0]].y - nodes[selectednodeindexes[0]].ry,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      savedPositions.push(position);
      var nodeEdgeValue = nodes[nodeIndex].y - nodes[nodeIndex].ry;
      alignTarget > nodeEdgeValue && (alignTarget = nodeEdgeValue);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].y = alignTarget + nodes[nodeIndex].ry;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNalignbottom() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var alignTarget =
          nodes[selectednodeindexes[0]].y + nodes[selectednodeindexes[0]].ry,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      savedPositions.push(position);
      var nodeEdgeValue = nodes[nodeIndex].y + nodes[nodeIndex].ry;
      alignTarget < nodeEdgeValue && (alignTarget = nodeEdgeValue);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].y = alignTarget - nodes[nodeIndex].ry;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNmoveup() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var savedPositions = [], loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[itemIndex].x,
          y: nodes[itemIndex].y,
        };
      savedPositions.push(position);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      nodes[itemIndex].y - nodes[itemIndex].ry >= 1 &&
        (nodes[itemIndex].y = nodes[itemIndex].y - 1);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[itemIndex], savedPositions[loopIndex]);
    }
  }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednoteindexes[loopIndex];
      notes[itemIndex].y >= 1 && (notes[itemIndex].y = notes[itemIndex].y - 1);
    }
  updatesvg();
}
function BTNmovedown() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var savedPositions = [], loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[itemIndex].x,
          y: nodes[itemIndex].y,
        };
      savedPositions.push(position);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      nodes[itemIndex].y + nodes[itemIndex].ry <= h - 1 &&
        (nodes[itemIndex].y = nodes[itemIndex].y + 1);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[itemIndex], savedPositions[loopIndex]);
    }
  }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednoteindexes[loopIndex];
      notes[itemIndex].y <= h - 1 &&
        (notes[itemIndex].y = notes[itemIndex].y + 1);
    }
  updatesvg();
}
function BTNmoveleft() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var savedPositions = [], loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[itemIndex].x,
          y: nodes[itemIndex].y,
        };
      savedPositions.push(position);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      nodes[itemIndex].x - nodes[itemIndex].rx >= 1 &&
        (nodes[itemIndex].x = nodes[itemIndex].x - 1);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[itemIndex], savedPositions[loopIndex]);
    }
  }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednoteindexes[loopIndex];
      notes[itemIndex].x >= 1 && (notes[itemIndex].x = notes[itemIndex].x - 1);
    }
  updatesvg();
}
function BTNmoveright() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var savedPositions = [], loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[itemIndex].x,
          y: nodes[itemIndex].y,
        };
      savedPositions.push(position);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      nodes[itemIndex].x + nodes[itemIndex].rx <= w - 1 &&
        (nodes[itemIndex].x = nodes[itemIndex].x + 1);
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[itemIndex], savedPositions[loopIndex]);
    }
  }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var itemIndex = selectednoteindexes[loopIndex];
      notes[itemIndex].x <= w - 1 &&
        (notes[itemIndex].x = notes[itemIndex].x + 1);
    }
  updatesvg();
}
function BTNwidth() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var extremeValue = nodes[selectednodeindexes[0]].rx,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      (savedPositions.push(position),
        nodes[nodeIndex].rx > extremeValue &&
          (extremeValue = nodes[nodeIndex].rx));
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].rx = extremeValue;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNheight() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var extremeValue = nodes[selectednodeindexes[0]].ry,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      (savedPositions.push(position),
        nodes[nodeIndex].ry > extremeValue &&
          (extremeValue = nodes[nodeIndex].ry));
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].ry = extremeValue;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNwidthnarrow() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var extremeValue = nodes[selectednodeindexes[0]].rx,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      (savedPositions.push(position),
        nodes[nodeIndex].rx < extremeValue &&
          (extremeValue = nodes[nodeIndex].rx));
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].rx = extremeValue;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNheightshort() {
  if ((ResetButtonStatus(), 1 === svgstatus.nodeselected)) {
    for (
      var extremeValue = nodes[selectednodeindexes[0]].ry,
        savedPositions = [],
        loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex],
        position = {
          x: nodes[nodeIndex].x,
          y: nodes[nodeIndex].y,
        };
      (savedPositions.push(position),
        nodes[nodeIndex].ry < extremeValue &&
          (extremeValue = nodes[nodeIndex].ry));
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      nodes[nodeIndex].ry = extremeValue;
    }
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      update_edge_with_moved_node(nodes[nodeIndex], savedPositions[loopIndex]);
    }
  }
  updatesvg();
}
function BTNecurvetopleft() {
  (ResetButtonStatus(), (current_selfpathTHETA = (5 / 4) * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurvetop() {
  (ResetButtonStatus(), (current_selfpathTHETA = 1.5 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurvetopright() {
  (ResetButtonStatus(), (current_selfpathTHETA = (7 / 4) * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurveleft() {
  (ResetButtonStatus(), (current_selfpathTHETA = 1 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurveright() {
  (ResetButtonStatus(), (current_selfpathTHETA = 2 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurvebottomleft() {
  (ResetButtonStatus(), (current_selfpathTHETA = 0.75 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurvebottom() {
  (ResetButtonStatus(), (current_selfpathTHETA = 0.5 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNecurvebottomright() {
  (ResetButtonStatus(), (current_selfpathTHETA = 0.25 * Math.PI));
  var changed = !1;
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edgeIndexCopy = edgeIndex;
        if (3 == edges[edgeIndexCopy].power) {
          var labelOffsetX =
              edges[edgeIndexCopy].labelP.x - edges[edgeIndexCopy].handleP.x,
            labelOffsetY =
              edges[edgeIndexCopy].labelP.y - edges[edgeIndexCopy].handleP.y,
            updatedEdge = update_bcurve3p(
              nodes,
              edges[edgeIndexCopy],
              current_selfpathTHETA,
              selfpathANGLE_default,
            );
          ((edges[edgeIndexCopy] = updatedEdge),
            (edges_tangents[edgeIndexCopy] = generate_tangent(
              nodes,
              edges[edgeIndexCopy],
            )));
          var startNodeIndex = matchnodeindex(
              nodes,
              edges[edgeIndexCopy].startid,
            ),
            endNodeIndex = matchnodeindex(nodes, edges[edgeIndexCopy].endid),
            startNodePoint = {
              x: nodes[startNodeIndex].x,
              y: nodes[startNodeIndex].y,
            },
            endNodePoint = {
              x: nodes[endNodeIndex].x,
              y: nodes[endNodeIndex].y,
            },
            handlePoint = edges[edgeIndexCopy].handleP;
          ((edges[edgeIndexCopy].labelP = cal_labelP(
            handlePoint,
            startNodePoint,
            endNodePoint,
            edges[edgeIndexCopy].power,
            labelOffsetX,
            labelOffsetY,
          )),
            (changed = !0));
        }
      }
    }
  changed && updatesvg();
}
function BTNplusdiameterlong() {
  if ((ResetButtonStatus(), current_RADIUSH >= 200));
  else {
    if (((current_RADIUSH += 1), 1 === svgstatus.nodeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
          nodes[nodeIndex].rx = current_RADIUSH;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var edgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[edgeIndex].power
              ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
              : 3 === edges[edgeIndex].power &&
                (edges[edgeIndex] = update_bcurve3p(
                  nodes,
                  edges[edgeIndex],
                  edges[edgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[edgeIndex] = generate_tangent(
                nodes,
                edges[edgeIndex],
              )));
          }
        }
      }
    var diameterInput = document.getElementById("textdiameterlong");
    ((diameterInput.value = 2 * current_RADIUSH), updatesvg());
  }
}
function BTNminusdiameterlong() {
  if ((ResetButtonStatus(), current_RADIUSH <= 10));
  else {
    if (((current_RADIUSH -= 1), 1 === svgstatus.nodeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
          nodes[nodeIndex].rx = current_RADIUSH;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var edgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[edgeIndex].power
              ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
              : 3 === edges[edgeIndex].power &&
                (edges[edgeIndex] = update_bcurve3p(
                  nodes,
                  edges[edgeIndex],
                  edges[edgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[edgeIndex] = generate_tangent(
                nodes,
                edges[edgeIndex],
              )));
          }
        }
      }
    var diameterInput = document.getElementById("textdiameterlong");
    ((diameterInput.value = 2 * current_RADIUSH), updatesvg());
  }
}
function BTNplusdiametershort() {
  if ((ResetButtonStatus(), current_RADIUSV >= 200));
  else {
    if (((current_RADIUSV += 1), 1 === svgstatus.nodeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
          nodes[nodeIndex].ry = current_RADIUSV;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var edgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[edgeIndex].power
              ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
              : 3 === edges[edgeIndex].power &&
                (edges[edgeIndex] = update_bcurve3p(
                  nodes,
                  edges[edgeIndex],
                  edges[edgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[edgeIndex] = generate_tangent(
                nodes,
                edges[edgeIndex],
              )));
          }
        }
      }
    var diameterInput = document.getElementById("textdiametershort");
    ((diameterInput.value = 2 * current_RADIUSV), updatesvg());
  }
}
function BTNminusdiametershort() {
  if ((ResetButtonStatus(), current_RADIUSV <= 10));
  else {
    if (((current_RADIUSV -= 1), 1 === svgstatus.nodeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
          nodes[nodeIndex].ry = current_RADIUSV;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var edgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[edgeIndex].power
              ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
              : 3 === edges[edgeIndex].power &&
                (edges[edgeIndex] = update_bcurve3p(
                  nodes,
                  edges[edgeIndex],
                  edges[edgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[edgeIndex] = generate_tangent(
                nodes,
                edges[edgeIndex],
              )));
          }
        }
      }
    var diameterInput = document.getElementById("textdiametershort");
    ((diameterInput.value = 2 * current_RADIUSV), updatesvg());
  }
}
function BTNplusfont() {
  if ((ResetButtonStatus(), current_FONTSIZE >= 72));
  else {
    if (((current_FONTSIZE += 1), 1 === svgstatus.edgeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        (edgeIndex >= 0) & (edgeIndex < edges.length) &&
          (edges[edgeIndex].labelFsize = current_FONTSIZE);
      }
    if (1 === svgstatus.nodeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if (
          (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
          ((nodes[nodeIndex].fontsize = current_FONTSIZE),
          nodes[nodeIndex].rx <=
            nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5)
        ) {
          nodes[nodeIndex].rx =
            nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var relatedEdgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[relatedEdgeIndex].power
              ? (edges[relatedEdgeIndex] = update_bcurve2p(
                  nodes,
                  edges[relatedEdgeIndex],
                ))
              : 3 === edges[relatedEdgeIndex].power &&
                (edges[relatedEdgeIndex] = update_bcurve3p(
                  nodes,
                  edges[relatedEdgeIndex],
                  edges[relatedEdgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[relatedEdgeIndex] = generate_tangent(
                nodes,
                edges[relatedEdgeIndex],
              )));
          }
        }
      }
    if (1 === svgstatus.noteselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednoteindexes.length;
        loopIndex++
      ) {
        var noteIndex = selectednoteindexes[loopIndex];
        (noteIndex >= 0) & (noteIndex < notes.length) &&
          (notes[noteIndex].fontsize = current_FONTSIZE);
      }
    ((tobject = document.getElementById("textfontsize")),
      (tobject.textContent = current_FONTSIZE),
      updatesvg());
  }
}
function BTNminusfont() {
  if ((ResetButtonStatus(), current_FONTSIZE <= 6));
  else {
    if (((current_FONTSIZE -= 1), 1 === svgstatus.edgeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        (edgeIndex >= 0) & (edgeIndex < edges.length) &&
          (edges[edgeIndex].labelFsize = current_FONTSIZE);
      }
    if (1 === svgstatus.nodeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        if (
          (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
          ((nodes[nodeIndex].fontsize = current_FONTSIZE),
          nodes[nodeIndex].rx <=
            nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5)
        ) {
          nodes[nodeIndex].rx =
            nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5;
          for (
            var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
              relatedLoopIndex = 0;
            relatedLoopIndex < relatedEdgeIds.length;
            relatedLoopIndex++
          ) {
            var relatedEdgeIndex = relatedEdgeIds[relatedLoopIndex];
            (2 === edges[relatedEdgeIndex].power
              ? (edges[relatedEdgeIndex] = update_bcurve2p(
                  nodes,
                  edges[relatedEdgeIndex],
                ))
              : 3 === edges[relatedEdgeIndex].power &&
                (edges[relatedEdgeIndex] = update_bcurve3p(
                  nodes,
                  edges[relatedEdgeIndex],
                  edges[relatedEdgeIndex].theta,
                  selfpathANGLE_default,
                )),
              (edges_tangents[relatedEdgeIndex] = generate_tangent(
                nodes,
                edges[relatedEdgeIndex],
              )));
          }
        }
      }
    if (1 === svgstatus.noteselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednoteindexes.length;
        loopIndex++
      ) {
        var noteIndex = selectednoteindexes[loopIndex];
        (noteIndex >= 0) & (noteIndex < notes.length) &&
          (notes[noteIndex].fontsize = current_FONTSIZE);
      }
    ((tobject = document.getElementById("textfontsize")),
      (tobject.textContent = current_FONTSIZE),
      updatesvg());
  }
}
function BTNplusstroke() {
  if ((ResetButtonStatus(), current_strokeWIDTH >= 5));
  else {
    if (((current_strokeWIDTH += 0.5), 1 === svgstatus.edgeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        (edgeIndex >= 0) & (edgeIndex < edges.length) &&
          (edges[edgeIndex].strokewidth = current_strokeWIDTH);
      }
    if (1 === svgstatus.nodeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
          (nodes[nodeIndex].strokewidth = current_strokeWIDTH);
      }
    var strokeInput = document.getElementById("textstrokewidth");
    ((strokeInput.value = current_strokeWIDTH), updatesvg());
  }
}
function BTNminusstroke() {
  if ((ResetButtonStatus(), current_strokeWIDTH <= 0.5));
  else {
    if (((current_strokeWIDTH -= 0.5), 1 === svgstatus.edgeselected))
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        (edgeIndex >= 0) & (edgeIndex < edges.length) &&
          (edges[edgeIndex].strokewidth = current_strokeWIDTH);
      }
    if (1 === svgstatus.nodeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectednodeindexes.length;
        loopIndex++
      ) {
        var nodeIndex = selectednodeindexes[loopIndex];
        (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
          (nodes[nodeIndex].strokewidth = current_strokeWIDTH);
      }
    var strokeInput = document.getElementById("textstrokewidth");
    ((strokeInput.value = current_strokeWIDTH), updatesvg());
  }
}
function BTNplusecurve() {
  if ((ResetButtonStatus(), current_selfcurve_LR >= 81));
  else {
    current_selfcurve_LR += 1;
    default_selfcurve_LR;
    if (1 === svgstatus.edgeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
          var edge = edges[edgeIndex];
          3 === edge.power &&
            ((edge.curve_LR = current_selfcurve_LR),
            (edges[edgeIndex] = update_bcurve(nodes, edge)),
            (edges[edgeIndex].selected = !0));
        }
      }
    var curveSizeInput = document.getElementById("textecurvesize");
    ((curveSizeInput.value = current_selfcurve_LR), updatesvg());
  }
}
function BTNminusecurve() {
  if ((ResetButtonStatus(), current_selfcurve_LR <= 27));
  else {
    current_selfcurve_LR -= 1;
    default_selfcurve_LR;
    if (1 === svgstatus.edgeselected)
      for (
        var loopIndex = 0;
        loopIndex < selectededgeindexes.length;
        loopIndex++
      ) {
        var edgeIndex = selectededgeindexes[loopIndex];
        if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
          var edge = edges[edgeIndex];
          3 === edge.power &&
            ((edge.curve_LR = current_selfcurve_LR),
            (edges[edgeIndex] = update_bcurve(nodes, edge)),
            (edges[edgeIndex].selected = !0));
        }
      }
    var curveSizeInput = document.getElementById("textecurvesize");
    ((curveSizeInput.value = current_selfcurve_LR), updatesvg());
  }
}
function BTNfontsize() {
  if ((ResetButtonStatus(), 1 === svgstatus.edgeselected))
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].labelFsize = current_FONTSIZE);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      if (
        (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        ((nodes[nodeIndex].fontsize = current_FONTSIZE),
        nodes[nodeIndex].rx <=
          nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5)
      ) {
        nodes[nodeIndex].rx =
          nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5;
        for (
          var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
            relatedLoopIndex = 0;
          relatedLoopIndex < relatedEdgeIds.length;
          relatedLoopIndex++
        ) {
          var relatedEdgeIndex = relatedEdgeIds[relatedLoopIndex];
          (2 === edges[relatedEdgeIndex].power
            ? (edges[relatedEdgeIndex] = update_bcurve2p(
                nodes,
                edges[relatedEdgeIndex],
              ))
            : 3 === edges[relatedEdgeIndex].power &&
              (edges[relatedEdgeIndex] = update_bcurve3p(
                nodes,
                edges[relatedEdgeIndex],
                edges[relatedEdgeIndex].theta,
                selfpathANGLE_default,
              )),
            (edges_tangents[relatedEdgeIndex] = generate_tangent(
              nodes,
              edges[relatedEdgeIndex],
            )));
        }
      }
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].fontsize = current_FONTSIZE);
    }
  updatesvg();
}
function BTNstrokewidth() {
  ResetButtonStatus();
  var strokeInput = document.getElementById("textstrokewidth");
  if (
    ((current_strokeWIDTH = Number(strokeInput.value)),
    1 === svgstatus.edgeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].strokewidth = current_strokeWIDTH);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].strokewidth = current_strokeWIDTH);
    }
  updatesvg();
}
function BTNecurvesize() {
  ResetButtonStatus();
  var curveSizeInput = document.getElementById("textecurvesize");
  if (
    ((current_selfcurve_LR = Number(curveSizeInput.value)),
    1 === svgstatus.edgeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edge = edges[edgeIndex];
        3 === edge.power &&
          ((edge.curve_LR = current_selfcurve_LR),
          (edges[edgeIndex] = update_bcurve(nodes, edge)),
          (edges[edgeIndex].selected = !0));
      }
    }
  updatesvg();
}
function BTNdiameterlong() {
  ResetButtonStatus();
  var diameterInput = document.getElementById("textdiameterlong");
  if (
    ((current_RADIUSH = Number(diameterInput.value) / 2),
    1 === svgstatus.nodeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
        nodes[nodeIndex].rx = current_RADIUSH;
        for (
          var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
            relatedLoopIndex = 0;
          relatedLoopIndex < relatedEdgeIds.length;
          relatedLoopIndex++
        ) {
          var edgeIndex = relatedEdgeIds[relatedLoopIndex];
          (2 === edges[edgeIndex].power
            ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
            : 3 === edges[edgeIndex].power &&
              (edges[edgeIndex] = update_bcurve3p(
                nodes,
                edges[edgeIndex],
                edges[edgeIndex].theta,
                selfpathANGLE_default,
              )),
            (edges_tangents[edgeIndex] = generate_tangent(
              nodes,
              edges[edgeIndex],
            )));
        }
      }
    }
  var diameterInput = document.getElementById("textdiameterlong");
  ((diameterInput.value = 2 * current_RADIUSH), updatesvg());
}
function BTNdiametershort() {
  ResetButtonStatus();
  var diameterInput = document.getElementById("textdiametershort");
  if (
    ((current_RADIUSV = Number(diameterInput.value) / 2),
    1 === svgstatus.nodeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      if ((nodeIndex >= 0) & (nodeIndex < nodes.length)) {
        nodes[nodeIndex].ry = current_RADIUSV;
        for (
          var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
            relatedLoopIndex = 0;
          relatedLoopIndex < relatedEdgeIds.length;
          relatedLoopIndex++
        ) {
          var edgeIndex = relatedEdgeIds[relatedLoopIndex];
          (2 === edges[edgeIndex].power
            ? (edges[edgeIndex] = update_bcurve2p(nodes, edges[edgeIndex]))
            : 3 === edges[edgeIndex].power &&
              (edges[edgeIndex] = update_bcurve3p(
                nodes,
                edges[edgeIndex],
                edges[edgeIndex].theta,
                selfpathANGLE_default,
              )),
            (edges_tangents[edgeIndex] = generate_tangent(
              nodes,
              edges[edgeIndex],
            )));
        }
      }
    }
  var diameterInput = document.getElementById("textdiametershort");
  ((diameterInput.value = 2 * current_RADIUSV), updatesvg());
}
function textfontsize() {
  ((oTextarea = document.getElementById("textfontsize")),
    Number(oTextarea.value) <= 72 && Number(oTextarea.value) >= 6
      ? ((current_FONTSIZE = Number(oTextarea.value)), BTNfontsize())
      : (oTextarea.value = 12));
}
function textstrokewidth() {
  ((oTextarea = document.getElementById("textstrokewidth")),
    Number(oTextarea.value) <= 5 && Number(oTextarea.value) >= 0.5
      ? ((current_strokeWIDTH = Number(oTextarea.value)), BTNstrokewidth())
      : (oTextarea.value = 1));
}
function textecurvesize() {
  ((oTextarea = document.getElementById("textecurvesize")),
    Number(oTextarea.value) <= 81 && Number(oTextarea.value) >= 27
      ? ((current_selfcurve_LR = Number(oTextarea.value)), BTNecurvesize())
      : (oTextarea.value = default_selfcurve_LR));
}
function textdiameterlong() {
  ((oTextarea = document.getElementById("textdiameterlong")),
    Number(oTextarea.value) <= 400 && Number(oTextarea.value) >= 2
      ? ((current_RADIUSH = Number(oTextarea.value)), BTNdiameterlong())
      : (oTextarea.value = 2 * default_RADIUSH));
}
function textdiametershort() {
  ((oTextarea = document.getElementById("textdiametershort")),
    Number(oTextarea.value) <= 400 && Number(oTextarea.value) >= 2
      ? ((current_RADIUSV = Number(oTextarea.value)), BTNdiametershort())
      : (oTextarea.value = 2 * default_RADIUSV));
}
function getSelectValue_FontSize() {
  ResetButtonStatus();
  var fontSizeSelect = document.getElementById("selectfontsize"),
    selectedFontSize = Number(
      fontSizeSelect.options[fontSizeSelect.selectedIndex].value,
    );
  if (1 === svgstatus.edgeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].labelFsize = selectedFontSize);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      if (
        (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        ((nodes[nodeIndex].fontsize = selectedFontSize),
        nodes[nodeIndex].rx <=
          nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5)
      ) {
        nodes[nodeIndex].rx =
          nodes[nodeIndex].title.length * nodes[nodeIndex].fontsize * 0.5;
        for (
          var relatedEdgeIds = lookfor_relatededges(nodes[nodeIndex].id),
            loopIndex = 0;
          loopIndex < relatedEdgeIds.length;
          loopIndex++
        ) {
          var relatedEdgeIndex = relatedEdgeIds[loopIndex];
          (2 === edges[relatedEdgeIndex].power
            ? (edges[relatedEdgeIndex] = update_bcurve2p(
                nodes,
                edges[relatedEdgeIndex],
              ))
            : 3 === edges[relatedEdgeIndex].power &&
              (edges[relatedEdgeIndex] = update_bcurve3p(
                nodes,
                edges[relatedEdgeIndex],
                edges[relatedEdgeIndex].theta,
                selfpathANGLE_default,
              )),
            (edges_tangents[relatedEdgeIndex] = generate_tangent(
              nodes,
              edges[relatedEdgeIndex],
            )));
        }
      }
    }
  if (1 === svgstatus.noteselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednoteindexes.length;
      loopIndex++
    ) {
      var noteIndex = selectednoteindexes[loopIndex];
      (noteIndex >= 0) & (noteIndex < notes.length) &&
        (notes[noteIndex].fontsize = selectedFontSize);
    }
  ((fontSizeSelect.selectedIndex = 0),
    (fontSizeSelect.value = Number(
      fontSizeSelect.options[fontSizeSelect.selectedIndex].value,
    )),
    updatesvg());
}
function getSelectValue_ErrorCurveSize() {
  ResetButtonStatus();
  var curveSizeSelect = document.getElementById("selectErrorCurveSize"),
    curveSize = default_selfcurve_LR;
  if (
    (curveSizeSelect && (curveSize = curveSizeSelect.value),
    1 === svgstatus.edgeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      if ((edgeIndex >= 0) & (edgeIndex < edges.length)) {
        var edge = edges[edgeIndex];
        3 === edge.power &&
          ((edge.curve_LR = curveSize),
          (edges[edgeIndex] = update_bcurve(nodes, edge)),
          (edges[edgeIndex].selected = !0));
      }
    }
  ((curveSizeSelect.selectedIndex = 0),
    (curveSizeSelect.value = Number(
      curveSizeSelect.options[curveSizeSelect.selectedIndex].value,
    )),
    updatesvg());
}
function getSelectValue_LineWidth() {
  ResetButtonStatus();
  var lineWidthSelect = document.getElementById("selectLineWidth"),
    lineWidth = default_strokeWIDTH;
  if (
    (lineWidthSelect.value && (lineWidth = lineWidthSelect.value),
    1 === svgstatus.edgeselected)
  )
    for (
      var loopIndex = 0;
      loopIndex < selectededgeindexes.length;
      loopIndex++
    ) {
      var edgeIndex = selectededgeindexes[loopIndex];
      (edgeIndex >= 0) & (edgeIndex < edges.length) &&
        (edges[edgeIndex].strokewidth = lineWidth);
    }
  if (1 === svgstatus.nodeselected)
    for (
      var loopIndex = 0;
      loopIndex < selectednodeindexes.length;
      loopIndex++
    ) {
      var nodeIndex = selectednodeindexes[loopIndex];
      (nodeIndex >= 0) & (nodeIndex < nodes.length) &&
        (nodes[nodeIndex].strokewidth = lineWidth);
    }
  ((lineWidthSelect.selectedIndex = 0),
    (lineWidthSelect.value = Number(
      lineWidthSelect.options[lineWidthSelect.selectedIndex].value,
    )),
    updatesvg());
}
function getSelectValue_ChartSize() {
  ResetButtonStatus();
  var chartSizeSelect = document.getElementById("selectChartSize");
  switch (chartSizeSelect.value) {
    case "small":
      ((w = 2e3), (h = 2e3), mysvg.attr("width", w).attr("height", h));
      break;
    case "medium":
      ((w = 3e3), (h = 3e3), mysvg.attr("width", w).attr("height", h));
      break;
    case "large":
      ((w = 5e3), (h = 5e3), mysvg.attr("width", w).attr("height", h));
      break;
    default:
      ((w = 1e3), (h = 1200), mysvg.attr("width", w).attr("height", h));
  }
  ((chartSizeSelect.selectedIndex = 0),
    (chartSizeSelect.value = Number(
      chartSizeSelect.options[chartSizeSelect.selectedIndex].value,
    )),
    updatesvg());
}
function BTNSAVE() {
  // try {
  //     var a = diagName,
  //         b = GraphToText2();
  //     $("#inputnamedialog") && $("#inputnamedialog").remove();
  //     var c = document.createElement("div");
  //     c.id = "inputnamedialog", c.style.color = "black";
  //     var d = document.createElement("div");
  //     d.style = "width=230px; height=100px";
  //     var e = document.createElement("form");
  //     e.id = "inputnameform";
  //     var f = document.createElement("input");
  //     f.id = "nameinput", f.type = "text", f.name = "text", f.style = "width=200px; height=50px", f.contentEditable = !0, f.value = a, f.focus(), $(f).keydown(function (b) {
  //         if (a = f.value, 13 == b.keyCode || 13 == b.witch) return b.preventDefault(), $(g).click(), !1
  //     }), e.appendChild(f), d.appendChild(e);
  //     var g = document.createElement("button");
  //     g.innerHTML = "OK", g.id = "dialogbuton1", $(g).click(function () {
  //         a = f.value, diagName = a, $.download("http://semdiag.psychstat.org/download.php", "filename===" + a + "&filecontent===" + b + "&filetype===diag"), $(c).dialog("close"), $("#inputnamedialog").remove()
  //     }), d.appendChild(g);
  //     var h = document.createElement("button");
  //     h.innerHTML = "Cancel", h.id = "dialogbuton2", h.styles = "margin-left:2px", $(h).click(function () {
  //         $(c).dialog("close"), $("#inputnamedialog").remove()
  //     }), d.appendChild(h), c.appendChild(d), $(c).dialog({
  //         modal: !0,
  //         title: "Save Diagram",
  //         width: "230",
  //         height: "130",
  //         bgiframe: !0,
  //         closeOnEscape: !0,
  //         draggable: !0,
  //         resizable: !0
  //     })
  // } catch (a) {
  //     alert("SAVE:" + a)
  // }
  var fileName = prompt("Enter file name", "diagram");
  var diagramText = GraphToText2();
  var blob = (blob = new Blob([diagramText.toString()]));
  var element = document.createElement("a");
  element.download = fileName + ".diag";
  element.href = window.URL.createObjectURL(blob);
  element.click();
  element.remove();
}
function svgRender(loadedDiagram) {
  var loadedNodes = loadedDiagram.nodes,
    loadedEdges = loadedDiagram.edges,
    loadedNotes = loadedDiagram.notes,
    loadedMarks = loadedDiagram.marks;
  ((Nodecurrent_IdNUM = loadedMarks.Nodecurrent_IdNUM),
    (Edgecurrent_IdNUM = loadedMarks.Edgecurrent_IdNUM),
    (Elli_current_TitleNUM = loadedMarks.Elli_current_TitleNUM),
    (Rec_current_TitleNUM = loadedMarks.Rec_current_TitleNUM),
    (h = loadedMarks.h),
    (w = loadedMarks.w),
    (nodes = loadedNodes),
    (edges = loadedEdges),
    (edges_tangents = []),
    (edges_tangents = generate_tangents(nodes, edges)),
    (notes = loadedNotes),
    (ellipsenodes = nodes.filter(function (node) {
      return "ellipse" == node.type;
    })),
    (rectnodes = nodes.filter(function (node) {
      return "rect" == node.type;
    })),
    (trianglenodes = nodes.filter(function (node) {
      return "triangle" == node.type;
    })),
    (numRec = rectnodes.length),
    (numElli = ellipsenodes.length),
    (numTri = trianglenodes.length),
    (numNode = nodes.length),
    (numEdge = edges.length),
    (numNote = notes.length),
    numTri > 0 && (theTriangle = trianglenodes[0]),
    updatesvg());
}
function BTNLOAD() {
  var diagFileName = "",
    diagramText = "";
  $("#uploadfiledialog") && $("#uploadfiledialog").remove();
  var dialogDiv = document.createElement("div");
  dialogDiv.id = "uploadfiledialog";
  var inputDiv = document.createElement("div");
  ((inputDiv.id = "inputdiv"), (inputDiv.style = "width:280px"));
  var fileInput = document.createElement("input");
  ((fileInput.id = "inputfile"),
    (fileInput.type = "file"),
    (fileInput.style = "width:280px"),
    inputDiv.appendChild(fileInput),
    dialogDiv.appendChild(inputDiv),
    $(dialogDiv).dialog({
      modal: !0,
      title: "Select diagram",
      width: "400",
      height: "100",
      bgiframe: !0,
      closeOnEscape: !0,
      draggable: !0,
      resizable: !1,
    }),
    d3.select("#inputfile").on("change", function () {
      var selectedFiles = this.files,
        selectedFile = selectedFiles[0],
        fileName = selectedFile.name;
      fileName.substr(0, fileName.length);
      var fileExtension = fileName.substr(fileName.length - 5, fileName.length);
      if (selectedFile) {
        if (".diag" != fileExtension)
          alert(selectedFile.name + " is not a diagram file.");
        else {
          diagFileName = fileName.replace(".diag", "");
          var reader = new FileReader();
          ((reader.onload = (function (file) {
            return function (loadEvent) {
              var fileContent = "";
              if (
                ((fileContent = loadEvent.target.result),
                (diagramText = fileContent),
                $(dialogDiv).dialog("close"),
                $("#uploadfiledialog").remove(),
                "" == diagFileName)
              );
              else
                try {
                  console.log(diagramText);
                  var graphData = GraphFromText2(diagramText);
                  console.log(graphData);
                  0 == graphData.nodes.length ||
                    (svgRender(graphData), (diagName = diagFileName));
                } catch (error) {
                  alert("LOAD: rendering" + error);
                }
            };
          })(selectedFile)),
            reader.readAsText(selectedFile, "UTF-8"));
        }
      } else
        (alert("Failed to load the file."),
          $(dialogDiv).dialog("close"),
          $("#uploadfiledialog").remove());
    }));
}
function BTNNEW() {
  var shouldReset = !0;
  shouldReset &&
    ((diagName = ""),
    (nodes = []),
    (edges = []),
    (edges_tangents = []),
    (notes = []),
    (numRec = 0),
    (numElli = 0),
    (numTri = 0),
    (numNode = 0),
    (numEdge = 0),
    (numnote = 0),
    (Nodecurrent_IdNUM = 0),
    (Elli_current_TitleNUM = 0),
    (Rec_current_TitleNUM = 0),
    (Edgecurrent_IdNUM = 0),
    (newnodeInitialPos_rect = {
      x: nodeInitialPos_rect.x,
      y: nodeInitialPos_rect.y,
    }),
    (newnodeInitialPos_ellipse = {
      x: nodeInitialPos_ellipse.x,
      y: nodeInitialPos_ellipse.y,
    }),
    (theTriangle = null),
    (ellipsenodes = null),
    (rectnodes = null),
    (trianglenodes = null),
    (h = 2e3),
    (w = 2e3),
    (svgstatus = {
      svgondragged: 0,
      nodeondragged: 0,
      nodeselected: 0,
      pathselected: 0,
      labelselected: 0,
      noteselected: 0,
      linkingto: 0,
      texting: 0,
      IsShowLabels: !0,
      IsShowGrid: !0,
    }),
    (svgdragline = {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
    }),
    (justmousedownnodeindex = -1),
    (justmousedownedgeindex = -1),
    (justmousedownnoteindex = -1),
    (predraggedindex = -1),
    (selectednodeindex = -1),
    (selectededgeindex = -1),
    (selectednoteindex = -1),
    (linkinginitialindex = -1),
    (linkingtargetindex = -1),
    (selcetedBTNID = ""),
    mouseLastclickOBJETid,
    mouseCurrentclickOBJETid,
    (mouseLastclicktime = null),
    (mouseCurrentclicktime = null),
    (mysvgG = null),
    (mysvgG_foreignObject = null),
    (pathGs = null),
    (handleGs = null),
    (nodeGs = null),
    (ellipseGs = null),
    (rectGs = null),
    (triangleGs = null),
    (paths = null),
    (handlePs = null),
    (labelTs = null),
    (ellipses = null),
    (rects = null),
    (triangles = null),
    (nodetexts = null),
    (noteTs = null),
    updatesvg());
}
function BTNGraphToSVG() {
  var fileName = prompt("Enter file name", "diagram");
  var svgMarkup = GraphToSVG(nodes, edges, edges_tangents, notes);
  var blob = (blob = new Blob([svgMarkup.toString()]));
  var element = document.createElement("a");
  element.download = fileName + ".svg";
  element.href = window.URL.createObjectURL(blob);
  element.click();
  element.remove();
  // $.download("http://semdiag.psychstat.org/download.php", "filename===" + a + "&filecontent===" + b + "&filetype===svg")
}
function BTNGraphToPDF() {
  var fileName = prompt("Enter file name", "diagram");
  var svgContent = GraphToSVGforPDF(nodes, edges, edges_tangents, notes);
  // var b =document.getElementById('svgmain');
  var wrapper = document.createElement("div");
  wrapper.innerHTML = svgContent;
  var svgContent = wrapper.firstChild;

  // window.jsPDF = window.jspdf.jsPDF;

  // arch=document.getElementById('svgmain');
  // updatesvg();
  // arch2=document.getElementById('svgmain');

  var chartSize = AdjustChartSize(nodes, edges, edges_tangents, notes);
  var chartWidth = chartSize.w;
  var chartHeight = chartSize.h;
  console.log(chartWidth, chartHeight);

  // Document
  var pdfDoc;
  if (chartWidth > chartHeight) {
    pdfDoc = new jsPDF("l", "pt", [chartWidth, chartHeight]);
  } else {
    pdfDoc = new jsPDF("p", "pt", [chartHeight, chartWidth]);
  }

  // tmpPdf = new jsPDF('p', 'mm', [1500, 1500]);

  // var tmpPdf = new jsPDF('l', 'pt','letter',[1000, 1000]);

  //console.log(document.getElementsByTagName('svg')[0]);

  //document.getElementById('svgcontainer').getElementsByTagName('svg')[0]
  // b=document.getElementById('svgmain');
  svg2pdf(svgContent, pdfDoc, {
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  });
  pdfDoc.save(fileName + ".pdf");

  // if(arch!=arch2){
  //     updatesvgmath();
  // }

  //svgToPdfExample(b);

  // var a = prompt("Enter file name","diagram");
  // var b = GraphToSVG(nodes, edges, edges_tangents, notes);
  // svgToPng(b,(imgData)=>{
  //         var pngImage = document.createElement('img');
  //         //document.body.appendChild(pngImage);
  //         pngImage.src=imgData;
  //         var element = document.createElement("a");
  //         element.download = a+".png";
  //        //element.href = window.URL.createObjectURL(imgData);
  //        window.jsPDF = window.jspdf.jsPDF;
  //        var pdf = new jsPDF();
  //        pdf.addImage(imgData, 'PNG', 0, 0);
  //        pdf.save(a+".pdf");
  //        document.getElementById("unique1").remove();

  // });
  // $.download("http://semdiag.psychstat.org/download.php", "filename===" + a + "&filecontent===" + b + "&filetype===svg")
}
function svgToPng(svgMarkup, onPngReady) {
  const svgObjectUrl = getSvgUrl(svgMarkup);
  svgUrlToPng(svgObjectUrl, (pngDataUrl) => {
    onPngReady(pngDataUrl);
    URL.revokeObjectURL(svgObjectUrl);
  });
}
function getSvgUrl(svgMarkup) {
  return URL.createObjectURL(
    new Blob([svgMarkup], {
      type: "image/svg+xml",
    }),
  );
}
function svgUrlToPng(svgUrl, onPngReady) {
  var svgImage = document.createElement("img");
  svgImage.setAttribute("id", "unique1");
  // imgPreview.style.position = 'absolute';
  // imgPreview.style.top = '-9999px';
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(svgImage, 0, 0);
    const pngDataUrl = canvas.toDataURL("image/png");
    onPngReady(pngDataUrl);
    // document.body.removeChild(imgPreview);
  };
  svgImage.src = svgUrl;
}
function BTNGraphToPNG() {
  var fileName = prompt("Enter file name", "diagram");
  var svgMarkup = GraphToSVG(nodes, edges, edges_tangents, notes);
  svgToPng(svgMarkup, (pngDataUrl) => {
    var pngImage = document.createElement("img");
    //document.body.appendChild(pngImage);
    pngImage.src = pngDataUrl;
    var element = document.createElement("a");
    element.download = fileName + ".png";
    //element.href = window.URL.createObjectURL(imgData);
    element.href = pngDataUrl;
    element.click();
    element.remove();
    document.getElementById("unique1").remove();
  });

  // $.download("http://semdiag.psychstat.org/download.php", "filename===" + a + "&filecontent===" + b + "&filetype===svg")
}
function BTNrenderMATH() {
  updatesvgmath();
}
function BTNtoMATH() {
  var mathText = GraphToMATH(nodes, edges, edges_tangents, notes),
    fileName = prompt("Enter file name", "diagram");
  var blob = (blob = new Blob([mathText.toString()]));
  var element = document.createElement("a");
  element.download = fileName + ".html";
  element.href = window.URL.createObjectURL(blob);
  element.click();
  element.remove();
  // $.download("http://semdiag.psychstat.org/download.php", "filename===" + b + "&filecontent===" + a + "&filetype===html")
}
((jQuery.download = function (url, data, method) {
  if (url && data) {
    data = "string" == typeof data ? data : jQuery.param(data);
    var hiddenInputsHtml = "";
    (jQuery.each(data.split("&"), function () {
      var keyValuePair = this.split("===");
      hiddenInputsHtml +=
        '<input type="hidden" name="' +
        keyValuePair[0] +
        '" value="' +
        keyValuePair[1] +
        '" />';
    }),
      jQuery(
        '<form action="' +
          url +
          '" method="' +
          (method || "post") +
          '">' +
          hiddenInputsHtml +
          "</form>",
      )
        .appendTo("body")
        .submit()
        .remove());
  }
}),
  d3.select("#BTNrect").on("click", function () {
    ((selcetedBTNID = "BTNrect"), d3.event.stopPropagation(), BTNrect());
  }),
  d3.select("#BTNellipse").on("click", function () {
    ((selcetedBTNID = "BTNellipse"), d3.event.stopPropagation(), BTNellipse());
  }),
  d3.select("#BTNtriangle").on("click", function () {
    ((selcetedBTNID = "BTNtriangle"),
      d3.event.stopPropagation(),
      BTNtriangle());
  }),
  d3.select("#BTNlinkto").on("click", function () {
    ((selcetedBTNID = "BTNlinkto"), d3.event.stopPropagation(), BTNlinkingto());
  }),
  d3.select("#BTNlinktobi").on("click", function () {
    ((selcetedBTNID = "BTNlinktobi"),
      d3.event.stopPropagation(),
      BTNlinkingto2());
  }),
  d3.select("#BTNtexting").on("click", function () {
    ((selcetedBTNID = "BTNtexting"), d3.event.stopPropagation(), BTNtexting());
  }),
  d3.select("#BTNDEL").on("click", function () {
    ((selcetedBTNID = "BTNDEL"), d3.event.stopPropagation(), BTNdel());
  }),
  d3.select("#BTNclone").on("click", function () {
    ((selcetedBTNID = "BTNclone"), d3.event.stopPropagation(), BTNclone());
  }),
  d3.select("#BTNBLACK").on("click", function () {
    ((selcetedBTNID = "BTNBLACK"), d3.event.stopPropagation(), BTNblack());
  }),
  d3.select("#BTNRED").on("click", function () {
    ((selcetedBTNID = "BTNRED"), d3.event.stopPropagation(), BTNred());
  }),
  d3.select("#BTNGREEN").on("click", function () {
    ((selcetedBTNID = "BTNGREEN"), d3.event.stopPropagation(), BTNgreen());
  }),
  d3.select("#BTNBLUE").on("click", function () {
    ((selcetedBTNID = "BTNBLUE"), d3.event.stopPropagation(), BTNblue());
  }),
  d3.select("#BTNSOLID").on("click", function () {
    ((selcetedBTNID = "BTNSOLID"), d3.event.stopPropagation(), BTNsolid());
  }),
  d3.select("#BTNDOTTED").on("click", function () {
    ((selcetedBTNID = "BTNDOTTED"), d3.event.stopPropagation(), BTNdotted());
  }),
  d3.select("#BTNalignleft").on("click", function () {
    ((selcetedBTNID = "BTNalignleft"),
      d3.event.stopPropagation(),
      BTNalignleft());
  }),
  d3.select("#BTNalignright").on("click", function () {
    ((selcetedBTNID = "BTNalignright"),
      d3.event.stopPropagation(),
      BTNalignright());
  }),
  d3.select("#BTNaligntop").on("click", function () {
    ((selcetedBTNID = "BTNaligntop"),
      d3.event.stopPropagation(),
      BTNaligntop());
  }),
  d3.select("#BTNalignbottom").on("click", function () {
    ((selcetedBTNID = "BTNalignbottom"),
      d3.event.stopPropagation(),
      BTNalignbottom());
  }),
  d3.select("#BTNwidth").on("click", function () {
    ((selcetedBTNID = "BTNwidth"), d3.event.stopPropagation(), BTNwidth());
  }),
  d3.select("#BTNheight").on("click", function () {
    ((selcetedBTNID = "BTNheight"), d3.event.stopPropagation(), BTNheight());
  }),
  d3.select("#BTNwidthnarrow").on("click", function () {
    ((selcetedBTNID = "BTNwidthnarrow"),
      d3.event.stopPropagation(),
      BTNwidthnarrow());
  }),
  d3.select("#BTNheightshort").on("click", function () {
    ((selcetedBTNID = "BTNheightshort"),
      d3.event.stopPropagation(),
      BTNheightshort());
  }),
  d3.select("#BTNecurvetopleft").on("click", function () {
    ((selcetedBTNID = "BTNecurvetopleft"),
      d3.event.stopPropagation(),
      BTNecurvetopleft());
  }),
  d3.select("#BTNecurvetop").on("click", function () {
    ((selcetedBTNID = "BTNecurvetop"),
      d3.event.stopPropagation(),
      BTNecurvetop());
  }),
  d3.select("#BTNecurvetopright").on("click", function () {
    ((selcetedBTNID = "BTNecurvetopright"),
      d3.event.stopPropagation(),
      BTNecurvetopright());
  }),
  d3.select("#BTNecurveleft").on("click", function () {
    ((selcetedBTNID = "BTNecurveleft"),
      d3.event.stopPropagation(),
      BTNecurveleft());
  }),
  d3.select("#BTNecurveright").on("click", function () {
    ((selcetedBTNID = "BTNecurveright"),
      d3.event.stopPropagation(),
      BTNecurveright());
  }),
  d3.select("#BTNecurvebottomleft").on("click", function () {
    ((selcetedBTNID = "BTNecurvebottomleft"),
      d3.event.stopPropagation(),
      BTNecurvebottomleft());
  }),
  d3.select("#BTNecurvebottom").on("click", function () {
    ((selcetedBTNID = "BTNecurvebottom"),
      d3.event.stopPropagation(),
      BTNecurvebottom());
  }),
  d3.select("#BTNecurvebottomright").on("click", function () {
    ((selcetedBTNID = "BTNecurvebottomright"),
      d3.event.stopPropagation(),
      BTNecurvebottomright());
  }),
  d3.select("#BTNmoveup").on("click", function () {
    ((selcetedBTNID = "BTNmoveup"), d3.event.stopPropagation(), BTNmoveup());
  }),
  d3.select("#BTNmovedown").on("click", function () {
    ((selcetedBTNID = "BTNmovedown"),
      d3.event.stopPropagation(),
      BTNmovedown());
  }),
  d3.select("#BTNmoveleft").on("click", function () {
    ((selcetedBTNID = "BTNmoveleft"),
      d3.event.stopPropagation(),
      BTNmoveleft());
  }),
  d3.select("#BTNmoveright").on("click", function () {
    ((selcetedBTNID = "BTNmoveright"),
      d3.event.stopPropagation(),
      BTNmoveright());
  }),
  d3.select("#BTNplusfont").on("click", function () {
    ((selcetedBTNID = "BTNplusfont"),
      d3.event.stopPropagation(),
      BTNplusfont());
  }),
  d3.select("#BTNminusfont").on("click", function () {
    ((selcetedBTNID = "BTNminusfont"),
      d3.event.stopPropagation(),
      BTNminusfont());
  }),
  d3.select("#BTNplusstroke").on("click", function () {
    ((selcetedBTNID = "BTNplusstroke"),
      d3.event.stopPropagation(),
      BTNplusstroke());
  }),
  d3.select("#BTNminusstroke").on("click", function () {
    ((selcetedBTNID = "BTNminusstroke"),
      d3.event.stopPropagation(),
      BTNminusstroke());
  }),
  d3.select("#BTNplusecurve").on("click", function () {
    ((selcetedBTNID = "BTNplusecurve"),
      d3.event.stopPropagation(),
      BTNplusecurve());
  }),
  d3.select("#BTNminusecurve").on("click", function () {
    ((selcetedBTNID = "BTNminusecurve"),
      d3.event.stopPropagation(),
      BTNminusecurve());
  }),
  d3.select("#BTNplusdiameterlong").on("click", function () {
    ((selcetedBTNID = "BTNplusdiameterlong"),
      d3.event.stopPropagation(),
      BTNplusdiameterlong());
  }),
  d3.select("#BTNminusdiameterlong").on("click", function () {
    ((selcetedBTNID = "BTNminusdiameterlong"),
      d3.event.stopPropagation(),
      BTNminusdiameterlong());
  }),
  d3.select("#BTNplusdiametershort").on("click", function () {
    ((selcetedBTNID = "BTNplusdiametershort"),
      d3.event.stopPropagation(),
      BTNplusdiametershort());
  }),
  d3.select("#BTNminusdiametershort").on("click", function () {
    ((selcetedBTNID = "BTNminusdiametershort"),
      d3.event.stopPropagation(),
      BTNminusdiametershort());
  }),
  d3.select("#BTNfontsize").on("click", function () {
    ((selcetedBTNID = "BTNfontsize"),
      d3.event.stopPropagation(),
      BTNfontsize());
  }),
  d3.select("#BTNstrokewidth").on("click", function () {
    ((selcetedBTNID = "BTNstrokewidth"),
      d3.event.stopPropagation(),
      BTNstrokewidth());
  }),
  d3.select("#BTNecurvesize").on("click", function () {
    ((selcetedBTNID = "BTNecurvesize"),
      d3.event.stopPropagation(),
      BTNecurvesize());
  }),
  d3.select("#BTNdiameterlong").on("click", function () {
    ((selcetedBTNID = "BTNdiameterlong"),
      d3.event.stopPropagation(),
      BTNdiameterlong());
  }),
  d3.select("#BTNdiametershort").on("click", function () {
    ((selcetedBTNID = "BTNdiametershort"),
      d3.event.stopPropagation(),
      BTNdiametershort());
  }),
  d3.select("#textfontsize").on("blur", function () {
    (d3.event.stopPropagation(), textfontsize());
  }),
  d3.select("#textstrokewidth").on("blur", function () {
    (d3.event.stopPropagation(), BTNstrokewidth());
  }),
  d3.select("#textecurvesize").on("blur", function () {
    (d3.event.stopPropagation(), textecurvesize());
  }),
  d3.select("#textdiameterlong").on("blur", function () {
    (d3.event.stopPropagation(), textdiameterlong());
  }),
  d3.select("#textdiametershort").on("blur", function () {
    (d3.event.stopPropagation(), textdiametershort());
  }),
  d3.select("#BTNLa").on("click", function () {
    ((selcetedBTNID = "BTNLa"), d3.event.stopPropagation(), BTNla());
  }),
  d3.select("#BTNGrid").on("click", function () {
    ((selcetedBTNID = "BTNGrid"), d3.event.stopPropagation(), BTNgrid());
  }),
  d3.select("#BTNload").on("click", function () {
    ((selcetedBTNID = "BTNload"), d3.event.stopPropagation(), BTNLOAD());
  }),
  d3.select("#BTNnew").on("click", function () {
    ((selcetedBTNID = "BTNnew"), d3.event.stopPropagation(), BTNNEW());
  }),
  d3.select("#BTNsave").on("click", function () {
    ((selcetedBTNID = "BTNSave"), d3.event.stopPropagation(), BTNSAVE());
  }),
  d3.select("#BTNtoSVG").on("click", function () {
    ((selcetedBTNID = "BTNtoSVG"), d3.event.stopPropagation(), BTNGraphToSVG());
  }),
  d3.select("#BTNtoPDF").on("click", function () {
    ((selcetedBTNID = "BTNtoPDF"), d3.event.stopPropagation(), BTNGraphToPDF());
  }),
  d3.select("#BTNtoPNG").on("click", function () {
    ((selcetedBTNID = "BTNtoPNG"), d3.event.stopPropagation(), BTNGraphToPNG());
  }),
  d3.select("#BTNrenderMATH").on("click", function () {
    ((selcetedBTNID = "BTNrenderMATH"),
      d3.event.stopPropagation(),
      BTNrenderMATH());
  }),
  d3.select("#BTNtoMATH").on("click", function () {
    ((selcetedBTNID = "BTNtoMATH"), d3.event.stopPropagation(), BTNtoMATH());
  }));
