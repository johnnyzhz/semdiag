/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *     
 ***************************************************/
 
function NodesUnselected(){
	for (var i=0;i<selectednodeindexes.length;i++){
		if(selectednodeindexes[i]>=0 && selectednodeindexes[i]<nodes.length){
			nodes[selectednodeindexes[i]].selected = false;	//cancel the former selected node	
		}
	}
	selectednodeindex=-1;
	selectednodeindexes=[];
	svgstatus.nodeselected=0;
}
function EdgesUnselected(){
	for (var i=0;i<selectededgeindexes.length;i++){
		if(selectededgeindexes[i]>=0 && selectededgeindexes[i]<edges.length){
			edges[selectededgeindexes[i]].selected = false;	//cancel the former selected node	
		}
	}
	selectededgeindex=-1;
	selectededgeindexes=[];
	svgstatus.edgeselected=0;
}
function NotesUnselected(){
	for (var i=0;i<selectednoteindexes.length;i++){
		if(selectednoteindexes[i]>=0 && selectednoteindexes[i]<notes.length){
			notes[selectednoteindexes[i]].selected = false;	//cancel the former selected node	
		}
	}
	selectednoteindex=-1;
	selectednoteindexes=[];
	svgstatus.noteselected=0;
}

function findIndexes(array,value){
	var tempindexes=[];
	for(var i=0; i<array.length; i++){
		if (array[i]===value) tempindexes.push(i);
	}
	return tempindexes;
}

//
function OnNodeMouseDown(thisnode, d, i){//console.log("OnNodeMouseDown");
	var currentindex = matchnodeindex(nodes, d.id); //console.log("NodeOnMouseDown"+d.title);
	justmousedownnodeindex = currentindex; //	mark the just mouse down node
	if (svgstatus.linkingto >= 1) { 
		if (svgstatus.linkingto === 1){ 
			linkinginitialindex =currentindex; //during linkingto , the initial node was selected by mousedown event
			//console.log("svgstatus.linkingto=1, linkinginitialindex "+linkinginitialindex +" nodetitle "+nodes[currentindex].title);
		} else if (svgstatus.linkingto === 2){
			//do nothing;
			//console.log("svgstatus.linkingto=2, linkinginitialindex "+linkinginitialindex +" nodetitle "+nodes[linkinginitialindex].title);
		}
	} else if (svgstatus.nodeselected === 1) { // handle the selecting task
		
	}										
}

//函数：OnNodeMouseUp
function OnNodeMouseUp(thisnode,d,i){//console.log("OnNodeMouseUp");
	//d3.event.stopPropagation();		  
	var currentindex = matchnodeindex(nodes, d.id); //console.log("OnNodeMouseUp"+d.title);  
	if (svgstatus.linkingto >= 1) { //handle the linkingto task //console.log("svgstatus.linkingto"+svgstatus.linkingto+" linkinginitialindex "+linkinginitialindex +" nodetitle "+nodes[linkinginitialindex].title);
		if (linkinginitialindex != -1){ //when the initial node was moused down 
			linkingtargetindex = currentindex; //then the current is the target node //console.log("linkingtargetindex "+linkingtargetindex + "targetnode"+nodes[linkingtargetindex].title);			
			edge_add(linkinginitialindex, linkingtargetindex, linkingtoArrowTYPE);
			linkinginitialindex = -1;
			linkingtargetindex = -1;
			svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		}  //when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event  //the buttonlink clicked will have no effects 									
		svgstatus.linkingto = 0;//when mouseup status.linkingto should be set from 1 to 0;	
	}  else {// if not linkingto status
		if (svgstatus.texting === 1){//handle the text editing task
			node_text_editing(d,i);
			svgstatus.texting =0;
		} 
		if ( justmousedownnodeindex === currentindex) {// if ONclick, handle the selecting task	and the DBclick text editing task
			if (svgstatus.nodeselected === 1) {
				if (selectednodeindex === currentindex){//if the former clicked (selected) node is the same as the current node 
					mouseCurrentclicktime= new Date();	//console.log("time"+(mouseCurrentclicktime - mouseLastclicktime ));
					if (mouseCurrentclicktime - mouseLastclicktime <= 300){//console.log("dblclick"+(mouseCurrentclicktime - mouseLastclicktime ));//时间足够短，即看做双击dblclick									
						node_text_editing(d,i);
					}					
				}				
			}
			if(svgstatus.nodeselected===1){		if(!d3.event.ctrlKey){	NodesUnselected();	}	}
			if(svgstatus.edgeselected===1){		if(!d3.event.ctrlKey){	EdgesUnselected();	}	}
			if(svgstatus.noteselected===1){		if(!d3.event.ctrlKey){	NotesUnselected();	}	}
			var foundindexes=findIndexes(selectednodeindexes,currentindex);
			if (foundindexes.length==0) {	//if the former clicked (selected) node is not the same as the current node // or not in the selectednodeindexes array
				selectednodeindex = currentindex; //select this node whenever onclick or dbclick, whenever the svgstatus.texting===1 or not; 
				selectednodeindexes.push(selectednodeindex);//to record multiple selected nodes' indexes					
				nodes[selectednodeindex].selected =true; //console.log('push selected node '+nodes[selectednodeindex].title);	console.log('push selected node index '+selectednodeindex);	console.log(selectednodeindexes);			
				svgstatus.nodeselected = 1;	
			}												
			mouseLastclicktime= new Date();
		}// end of if (justmousedownnodeindex === currentindex)
	}// else if (linkingto)
	if (svgstatus.nodeondragged ===1) {// dragged, not clicked		
		svgstatus.nodeondragged = 0;	
	} 												
	justmousedownnodeindex=-1;	//when used, reset the Jusmousedownnodeindex//alert("selectednodeindex is "+selectednodeindex);	
	updatesvg();
}

//
function OnNodeOnDragStart(thisnode,d,i){	//console.log("OnNodeDragstart");
	svgstatus.nodeondragged = 1;
	var currentindex = matchnodeindex(nodes, d.id);									
	predraggedindex = currentindex;//mark the draggednode
	//note: can note listen/catch the d3.event.ctrlKey in the OnNodeDragStart or OnNodeDrag 
	/*if (svgstatus.linkingto==0 & svgstatus.texting==0 & svgstatus.multipleselecting==0){
		var numofselected = selectednodeindexes.length+selectededgeindexes.length+selectednoteindexes.length; console.log("numofselected:" + numofselected);
		if(d3.event.ctrlKey) console.log('d3.event.ctrlKey true'); if(d.selected ) console.log('thisnode.selected');
		if(d3.event.ctrlKey & thisnode.selected & numofselected>=2 ){
			svgstatus.multidraging=1; console.log("svgstatus.multidraging=1");
		}
	}*/
}

function update_edge_with_moved_node(_node,_originP){			
			var relatedindexes = lookfor_relatededges(_node.id);
			for (var i =0; i< relatedindexes.length; i++){
				var tindex = relatedindexes[i];
				var currentedge=edges[tindex];
				if (currentedge.power ===2) {
					var startnode=nodes[matchnodeindex(nodes,currentedge.startid)];
					var endnode=nodes[matchnodeindex(nodes,currentedge.endid)];
					var witchnode = "startP";
					var originmiddlex=-1;
					var originmiddley=-1;
					if (currentedge.startid === _node.id){
							witchnode = "startP";							
							
						} else {
							witchnode = "endP";		
							
						}
					switch(witchnode){
						case 'startP':
							originmiddlex=(_originP.x+endnode.x)/2;
							originmiddley=(_originP.y+endnode.y)/2;
						break;
						case 'endP':
							originmiddlex=_originP.x+startnode.x;
							originmiddley=_originP.y+startnode.y;
						break;
					}
					if (currentedge.handleInitial===true){//if initial handleP, set the middle between the two nodes as the handleP:
						var tx= (startnode.x+endnode.x)/2;
						var ty=(startnode.y+endnode.y)/2;
						edges[tindex].handleP={x:tx,y:ty};						
					} else {				
						if (currentedge.handleP.x==originmiddlex && currentedge.handleP.y==originmiddley){//if handleP was before at the middle of the two nodes, set the middle between the two nodes as the handleP:
							var tx= (startnode.x+endnode.x)/2;
							var ty=(startnode.y+endnode.y)/2;
							edges[tindex].handleP={x:tx,y:ty};	
						} else {// else keep the triangle pos of the startnode, endnode, and the handleP:							
							edges[tindex].handleP = generate_new_handleP_for_movednode(nodes,edges[tindex], witchnode, _originP);//adjust the handleP to the moved node 
						}					
					}
					edges[tindex]= update_bcurve2p(nodes,edges[tindex]);
				}else if (edges[tindex].power ===3){
					edges[tindex]= update_bcurve3p(nodes,edges[tindex], edges[tindex].theta, selfpathANGLE_default);
				}
				edges_tangents[tindex]=generate_tangent(nodes,edges[tindex]);
			}
}
function multidrag(_dx,_dy){
	
	if(svgstatus.nodeselected==1){
		for(var i=0; i<selectednodeindexes.length;i++){
			var tselectednodeindex=selectednodeindexes[i];
			if(tselectednodeindex >=0 & tselectednodeindex<nodes.length){
				var originP={x:nodes[tselectednodeindex].x, y:nodes[tselectednodeindex].y };
				nodes[tselectednodeindex].x += _dx;
				nodes[tselectednodeindex].y += _dy;
				update_edge_with_moved_node(nodes[tselectednodeindex],originP);
			}
		}		
	}

	if(svgstatus.noteselected==1){
		for(var i=0; i<selectednoteindexes.length;i++){
			var tselectednoteindex=selectednoteindexes[i];
			if(tselectednoteindex >=0 & tselectednoteindex<notes.length){
				notes[tselectednoteindex].x += _dx;
				notes[tselectednoteindex].y += _dy;
			}
		}		
	}
}
//函数：OnNodeOnDrag()
function OnNodeOnDrag(thisnode,d,i){//console.log("OnNodeDrag"); //if(d3.event.ctrlKey)console.log('d3.event.ctrlKey');
	var currentindex = matchnodeindex(nodes, d.id);//console.log("OnNodeOnDrag"+nodes[currentindex].title);
	if (svgstatus.linkingto >= 1){	//handle the linkingto effects										
		 if( linkinginitialindex != -1){
			svgdragline.x0 = nodes[linkinginitialindex].x;
			svgdragline.y0 = nodes[linkinginitialindex].y;
			svgdragline.x1 = d3.mouse(mysvgG.node())[0];
			svgdragline.y1 = d3.mouse(mysvgG.node())[1];
			//Dragmove_for_linking(thisnode,d);
			//console.log("linkinginitialindex !=1 in OnNodeOnDrags()");
		} 						
	}else {
		var originx= thisnode.__origin__.x;
		var originy =thisnode.__origin__.y;
		var originP = {x: originx, y: originy};
		newx = thisnode.__origin__.x += d3.event.dx;  
		newy = thisnode.__origin__.y += d3.event.dy; 
		
		if (newx===originx && newy ===originy){
		} else if( d.selected & selectednodeindexes.length>=2){
			multidrag(d3.event.dx,d3.event.dy);
		} else {
			if ( currentindex >=0 && currentindex < nodes.length) {
				nodes[currentindex].x = newx;  //update the x of currentnode
				nodes[currentindex].y = newy;	//update the y of currentnode				
			} 
			update_edge_with_moved_node(nodes[currentindex],originP);
		}									
	}
	updatesvg(); 
}

//
function OnNodeOnDragEnd(thisnode,d,i){//console.log("OnNodeDragend");
	
	var currentindex = matchnodeindex(nodes, d.id); //console.log("OnNodeOnDragEnd"+nodes[currentindex].title);   
	/*
	if (svgstatus.linkingto >= 1) { //handle the linkingto task
		if (linkinginitialindex != -1){ //when the initial node was moused down 
			linkingtargetindex = currentindex; //then the current is the target node
			edge_add(linkinginitialindex, linkingtargetindex, linkingtoArrowTYPE);
			linkinginitialindex = -1;
			linkingtargetindex = -1;
			svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		}  //when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event  //the buttonlink clicked will have no effects 									
		svgstatus.linkingto = 0;//when mouseup status.linkingto should be set from 1 to 0;	
	} 
	*/
	if(svgstatus.multidraging==1)svgstatus.multidraging=0;
	svgstatus.nodeondragged =0;
}

//函数： OnResizedCPOnDrag()
function OnResizedCPOnDrag(thiscP,d,i){
	d.pos.x =  thiscP.__origin__.x += d3.event.dx;   //update the handleP's x and y
	d.pos.y = thiscP.__origin__.y += d3.event.dy;  									
	var newcP = {x: d.pos.x, y: d.pos.y};

	var currentnodeindex = matchnodeindex(nodes, d.nodeid);
	var tnode = nodes [currentnodeindex];
	var newr = {rx: tnode.rx, ry: tnode.ry};
	var newrx = tnode.rx;
	var newry = tnode.ry;
	switch (tnode.type){
		case "ellipse":
			{
				switch (d.type){
					case "left":
						{
							var distance = tnode.x - newcP.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
						}
						break;
					case "right": 
						{
							var distance = newcP.x - tnode.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
						}
						break;
					case "top":
						{
							var distance = tnode.y -newcP.y;
							var newry = Math.abs(distance)-2*cPr;
							if (newry < default_RADIUSV/2) newry = default_RADIUSV/2;
						}
						break;
					case "bottom": 
						{
							var distance =  newcP.y - tnode.y;
							var newry = Math.abs(distance)-2*cPr;
							if (newry < default_RADIUSV/2) newry = default_RADIUSV/2;
						}													
						break;
					default:;
				
				}
				newr = {rx: newrx, ry: newry};
			}
			break;
		case "rect":
			{
				switch (d.type){
					case "left":
						{
							var distance = tnode.x - newcP.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
						}
						break;
					case "right": 
						{
							var distance = newcP.x - tnode.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
						}
						break;
					case "top":
						{
							var distance = tnode.y -newcP.y;
							var newry = Math.abs(distance)-2*cPr;
							if (newry < default_RADIUSV/2) newry = default_RADIUSV/2;
						}
						break;
					case "bottom": 
						{
							var distance =  newcP.y - tnode.y;
							var newry = Math.abs(distance)-2*cPr;
							if (newry < default_RADIUSV/2) newry = default_RADIUSV/2;
						}													
						break;
					default:;
				
				}
				newr = {rx: newrx, ry: newry};
			}
			break;										
		case "triangle":
			{
				switch (d.type){
					case "top":
						{
							var distance = tnode.y - newcP.y;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH) newrx = default_RADIUSH;
							newry = newrx;
						}
						break;
					case "right_bottom": 
						{
							var distance = Math.sqrt( (tnode.x - newcP.x)*(tnode.x - newcP.x) + (tnode.y - newcP.y)*(tnode.y - newcP.y));
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH) newrx = default_RADIUSH;
							newry = newrx;
						}
						break;
					case "left_bottom":
						{
							var distance = Math.sqrt( (tnode.x - newcP.x)*(tnode.x - newcP.x) + (tnode.y - newcP.y)*(tnode.y - newcP.y));
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH) newrx = default_RADIUSH;
							newry = newrx;
						}
						break;
					default:;
				
				}
				newr = {rx: newrx, ry: newry};
			}
			break;										
		case "diamond":
			{
				switch (d.type){
					case "left":
						{
							var distance = tnode.x - newcP.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH) newrx = default_RADIUSH;
							newry = newrx;
						}
						break;
					case "right": 
						{
							var distance = newcP.x - tnode.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH) newrx = default_RADIUSH;
							newry = newrx;
						}
						break;												
					default:;
				
				}
				newr = {rx: newrx, ry: newry};
			}
			break;								
		case "hexagon":
			{
				switch (d.type){
					case "left":
						{
							var distance = tnode.x - newcP.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
							newry = newrx;
						}
						break;
					case "right": 
						{
							var distance = newcP.x - tnode.x;
							var newrx = Math.abs(distance)-2*cPr;
							if (newrx < default_RADIUSH/2) newrx = default_RADIUSH/2;
							newry = newrx;
						}
						break;												
					default:;
				
				}
				newr = {rx: newrx, ry: newry};
			}
			break;
		default: ;
	}	
	nodes [currentnodeindex].rx = newr.rx;
	nodes [currentnodeindex].ry = newr.ry;
	var relatedindexes = lookfor_relatededges(nodes[currentnodeindex].id);//alert("relatedindexes:"+relatedindexes.length);
		//console.log(relatedindexes);
		for (var i =0; i< relatedindexes.length; i++){
			var tindex = relatedindexes[i];
			if (edges[tindex].power ===2) {
				edges[tindex]= update_bcurve2p(nodes,edges[tindex]);
			}else if (edges[tindex].power ===3){
				edges[tindex]= update_bcurve3p(nodes,edges[tindex], edges[tindex].theta, selfpathANGLE_default);
			}
			edges_tangents[tindex]=generate_tangent(nodes,edges[tindex]); //alert("generate_tangent!");
		}
	updatesvg();  
}

//function:
function OnPathMouseDown(thisPath, d, i){
	var currentindex = i;
	justmousedownedgeindex = currentindex; //	mark the just mouse down path
	if (svgstatus.linkingto==1) { //during linkingto , the initial node was selected by mousedown event
	}
}

//函数：OnPathMouseup(){
function OnPathMouseUp(thisPath, d, i){
	var currentindex = i;
	if (svgstatus.linkingto >= 1) { //handle the linkingto task
		if (linkinginitialindex != -1 ) { //when the initial node was mousedowned 	
			linkinginitialindex = -1;
			linkingtargetindex = -1;
			svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		} 								
		//when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event, then the buttonlink clicked will have no effects 														
		svgstatus.linkingto = 0;//when mouseup status.linkingto should be set from 1 to 0;	
	}  else { // if not linkingto status
		if (svgstatus.texting === 1){//handle the text editing task
			becurve_text_editing(d,i);
			svgstatus.texting =0;
		}	
		//handle the selecting task
		if ( justmousedownedgeindex === currentindex) { //if ONclick, handle the selecting task	and the DBclick text editing task //console.log("justmousedownedgeindex === currentindex"); 
	
			if (svgstatus.edgeselected === 1) {	//listen to the double click event
				if (selectededgeindex === currentindex) {//if the just clicked (selected) edge is the same as the current edge
					mouseCurrentclicktime= new Date();	//console.log("time"+(mouseCurrentclicktime - mouseLastclicktime ));
					if (mouseCurrentclicktime - mouseLastclicktime <= 300){//console.log("dblclick"+(mouseCurrentclicktime - mouseLastclicktime ));//时间足够短，即看做双击dblclick
						if (selectededgeindex >=0 && selectededgeindex < edges.length){
							bcurve_text_editing(d,i);
						}
					}
				}						
			} 
			if(svgstatus.nodeselected===1){		if(!d3.event.ctrlKey){	NodesUnselected();	}	}
			if(svgstatus.edgeselected===1){		if(!d3.event.ctrlKey){	EdgesUnselected();	}	}
			if(svgstatus.noteselected===1){		if(!d3.event.ctrlKey){	NotesUnselected();	}	}				
			var foundindexes=findIndexes(selectededgeindexes,currentindex);
			if (foundindexes.length===0) {//if the current edge is not selected 
				selectededgeindex = currentindex;
				selectededgeindexes.push(selectededgeindex);//to record multiple selected edges' indexes	
				edges[selectededgeindex].selected =true; //alert("path selected!");
				svgstatus.edgeselected = 1;				
			}
			mouseLastclicktime= new Date();			
		} else { 
			//if (selectednodeindex != -1) { nodes[selectednodeindex].selected = false; slectednodeindex = -1; }
			//if (svgstatus.nodeselected === 1) {svgstatus.nodeselected = 0;}
		}
	}
	//if(svgstatus.texting ===1)svgstatus.texting =0;;
	justmousedownedgeindex=-1;	
	updatesvg();
}

//函数： OnHandlePMouseUp()
function OnHandlePMouseUp(thishandle, d, i){
	if (svgstatus.texting === 1){//handle the text editing task
		bcurve_text_editing(d,i);
		svgstatus.texting =0;
	}
	var currentindex = i;
	if (svgstatus.linkingto >= 1) { //handle the linkingto task
		if (linkinginitialindex != -1 ) { //when the initial node was mousedowned 	
				linkinginitialindex = -1;
				linkingtargetindex = -1;
				svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		} 								
		//when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event
			  //the buttonlink clicked will have no effects 												
		//when mouseup status.linkingto should be set from 1 to 0;	
		svgstatus.linkingto = 0;
	}  else { //handle the selecting task or the double click task
		if ( justmousedownedgeindex === currentindex) { // if ONclick, handle the selecting task or the double click task

			if (svgstatus.edgeselected === 1) {//cancel the former selected node
				if(selectededgeindex === currentindex){
					mouseCurrentclicktime= new Date();	//console.log("time"+(mouseCurrentclicktime - mouseLastclicktime ));
					if (mouseCurrentclicktime - mouseLastclicktime <= 300){//console.log("dblclick"+(mouseCurrentclicktime - mouseLastclicktime ));//时间足够短，即看做双击dblclick			
						if (selectededgeindex >=0 && selectededgeindex < edges.length){
							bcurve_text_editing(d,i);
						}
					}
				}
			}
			if(svgstatus.nodeselected===1){		if(!d3.event.ctrlKey){	NodesUnselected();	}	}
			if(svgstatus.edgeselected===1){		if(!d3.event.ctrlKey){	EdgesUnselected();	}	}
			if(svgstatus.noteselected===1){		if(!d3.event.ctrlKey){	NotesUnselected();	}	}	
			var foundindexes=findIndexes(selectededgeindexes,currentindex);
			if (foundindexes.length===0) {//if the former clicked (selected) edge is not the same as the current edge
				selectededgeindex = currentindex;
				selectededgeindexes.push(selectededgeindex);//to record multiple selected edges' indexes	
				edges[selectededgeindex].selected =true; //alert("path selected!");
				svgstatus.edgeselected = 1;
			} 
			mouseLastclicktime= new Date();
		} else { //					
		}		
	}
	//if (svgstatus.texting===1) svgstatus.texting=0;	
	justmousedownedgeindex=-1;	
	updatesvg();	
}

//函数：
function OnLabelMouseDown(thislable,d,i){console.log("OnLabelMouseDown");
	var currentindex = i;
	justmousedownedgeindex = currentindex; //	mark the just mouse down path's label
}
//函数： OnLabelMouseUp()
function OnLabelMouseUp(thislabel, d, i){console.log("OnLabelMouseUp");
	if (svgstatus.texting === 1){//handle the text editing task
		bcurve_text_editing(d,i);
		svgstatus.texting =0;
	}
	var currentindex = i;
	if (svgstatus.linkingto >= 1) { //handle the linkingto task
		if (linkinginitialindex != -1 ) { //when the initial node was mousedowned 	
			linkinginitialindex = -1;
			linkingtargetindex = -1;
			svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		} 
		//when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event 	  //the buttonlink clicked will have no effects 												
		//when mouseup status.linkingto should be set from 1 to 0;	
		svgstatus.linkingto = 0;
	}  else { //handle the selecting task or double click task
		if ( justmousedownedgeindex === currentindex) {

			if (svgstatus.edgeselected === 1) {//cancel the former selected node
				if (selectededgeindex === currentindex){//前后选中同一路径label index
					mouseCurrentclicktime= new Date();//console.log("time"+(mouseCurrentclicktime - mouseLastclicktime ));						
					if (mouseCurrentclicktime - mouseLastclicktime <= 300){//console.log("dblclick"+(mouseCurrentclicktime - mouseLastclicktime ));//时间足够短，即看做双击dblclick
						if (selectededgeindex >=0 && selectededgeindex < edges.length){
							bcurve_text_editing(d,i);
						}
					}
				}
			}
			if(svgstatus.nodeselected===1){		if(!d3.event.ctrlKey){	NodesUnselected();	}	}
			if(svgstatus.edgeselected===1){		if(!d3.event.ctrlKey){	EdgesUnselected();	}	}
			if(svgstatus.noteselected===1){		if(!d3.event.ctrlKey){	NotesUnselected();	}	}	
			var foundindexes=findIndexes(selectededgeindexes,currentindex);
			if (foundindexes.length===0) {//if the former clicked (selected) edge is not the same as the current edge
				selectededgeindex = currentindex;
				selectededgeindexes.push(selectededgeindex);//to record multiple selected edges' indexes	
				edges[selectededgeindex].selected =true; //alert("path selected!");
				svgstatus.edgeselected = 1;
			} 
			mouseLastclicktime= new Date();			
		} 
	}					
	justmousedownedgeindex=-1;
	updatesvg();	
}

//函数：
function OnNoteMouseDown(thisnote,d,i){console.log("OnNoteMouseDown");
	var currentindex = i;
	justmousedownnoteindex = currentindex; //	mark the just mouse down path's label
}
function OnNoteMouseUp(thisnote, d, i){console.log("OnNoteMouseUp");
	if (svgstatus.texting === 1){//handle the text editing task
		note_text_editing(d,i);
		svgstatus.texting =0;
	}
	var currentindex = i;
	if (svgstatus.linkingto >= 1) { //handle the linkingto task
		if (linkinginitialindex != -1 ) { //when the initial node was mousedowned 	
					linkinginitialindex = -1;
					linkingtargetindex = -1;
					svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;
		} 
		//when no node was selected by mousedown event after buttonlink clicked and there was a mouseup event   //the buttonlink clicked will have no effects 												
		//when mouseup status.linkingto should be set from 1 to 0;	
		svgstatus.linkingto = 0;
	}  else { //handle the selecting task
		if ( justmousedownnoteindex === currentindex) {

			if (svgstatus.noteselected === 1) {//cancel the former selected node
				if (selectednoteindex ===currentindex){//前后选中同一路径label index					
					mouseCurrentclicktime= new Date();//console.log("time"+(mouseCurrentclicktime - mouseLastclicktime ));						
					if (mouseCurrentclicktime - mouseLastclicktime <= 300){//console.log("dblclick"+(mouseCurrentclicktime - mouseLastclicktime ));//时间足够短，即看做双击dblclick							
						if (selectednoteindex >=0 && selectednoteindex < notes.length){
							note_text_editing(d,i);
						}
					}
				}
			}
			if(svgstatus.nodeselected===1){		if(!d3.event.ctrlKey){	NodesUnselected();	}	}
			if(svgstatus.edgeselected===1){		if(!d3.event.ctrlKey){	EdgesUnselected();	}	}
			if(svgstatus.noteselected===1){		if(!d3.event.ctrlKey){	NotesUnselected();	}	}
			var foundindexes=findIndexes(selectednoteindexes,currentindex);
			if (foundindexes.length===0) {//if the former clicked (selected) edge is not the same as the current edge
				selectednoteindex = currentindex;
				notes[selectednoteindex].selected =true;
				selectednoteindexes.push(selectednoteindex);	
				svgstatus.noteselected = 1;				
			} 
			mouseLastclicktime= new Date();			
		} 
	}					
	justmousedownnoteindex=-1;		
	updatesvg();
}

//函数：
function Dragmove_for_linking(args){console.log("Dragmove().call");	
	if (svgstatus.linkingto >= 1){
		if (linkinginitialindex !=-1){		 
			 var cordination = d3.mouse(mysvg);
			 svgdragline.x0=nodes[linkinginitialindex].x;
			 svgdragline.y0=nodes[linkinginitialindex].y;
			 svgdragline.x1=cordination[0];
			 svgdragline.y1=cordination[1];
			 updatesvg();
		}
	}

}

function OnmysvgMouseDown(thissvg,d){console.log("OnmysvgMouseDown");
		//this =thissvg;
	if(justmousedownnodeindex ===-1 && justmousedownedgeindex ===-1 && justmousedownnoteindex===-1){//this is to differential mouseUPevent of nodes/paths elements from  that of the SVG chart
		//cancel the selected 
		//console.log("OnmysvgMouseDown cancel the selected");
		if (svgstatus.nodeselected ===1) {
			//if (selectednodeindex >=0 && selectednodeindex < nodes.length) nodes[selectednodeindex].selected = false;
			NodesUnselected();
		}//取消选择的路径或节点
		if (svgstatus.edgeselected ===1) {
			EdgesUnselected();
		}//取消选择的路径或节点	
		if (svgstatus.noteselected===1) {
			NotesUnselected();
		}		
		//to add the free text note
		if(svgstatus.texting===1){
			var tx=d3.mouse(thissvg)[0];
			var ty=d3.mouse(thissvg)[1];
			var currentpos={x:tx, y: ty}; //console.log(tx);
			var newnote = note_add(currentpos,"New Note");							
		}
		sethandlePhidden();
		if(d3.event.ctrlKey){
			svgstatus.multipleselecting=1; //console.log('svgstatus.multipleselecting=1');
			var tx=d3.mouse(thissvg)[0];
			var ty=d3.mouse(thissvg)[1];
			multipleselectframe.x = tx;
			multipleselectframe.y = ty;				
		}		
	}//end of if(justmousedownnodeindex ===-1 && justmousedownedgeindex ===-1 && justmousedownnoteindex===-1){}
	//create the multiple selecting frame:
	updatesvg();
}

function OnmysvgMouseMove(thissvg,d){//console.log("OnmysvgMouseMove");
		if(d3.event.ctrlKey && svgstatus.multipleselecting===1){//console.log(d3.event.ctrlKey);console.log(svgstatus.multipleselecting);
			var justselectingframe=multipleselectframe;			
			var p = d3.mouse(thissvg);				
			var move = {
					x : p[0] - multipleselectframe.x,
					y : p[1] - multipleselectframe.y
				};			
			if( move.x < 0 || (move.x*2<multipleselectframe.width)) {	
				multipleselectframe.x = p[0];
					multipleselectframe.width -= move.x;  
			} else {
				multipleselectframe.width = move.x;       
			}
			if( move.y < 0 || move.y*2<multipleselectframe.height) {
				multipleselectframe.y = p[1];
					multipleselectframe.height -= move.y;
			} else {
				multipleselectframe.height = move.y;       
			}
			//console.log('multipleselectframe x: '+multipleselectframe.x +' y: '+multipleselectframe.y +' width: '+ multipleselectframe.width + ' height: '+ multipleselectframe.heigth);			
			var tselectboundary={
				x1:multipleselectframe.x,
				y1:multipleselectframe.y,
				x2:multipleselectframe.x+multipleselectframe.width,
				y2:multipleselectframe.y+multipleselectframe.height
			}; //console.log('x1: '+tselectboundary.x1 +' y1: '+tselectboundary.y1 +' x2: '+ tselectboundary.x2 + ' y2: '+ tselectboundary.y2);
			if (tselectboundary.x1 >=0 & tselectboundary.x2<=w & tselectboundary.y1>=0 & tselectboundary.y2<=h){				
			} else {
				multipleselectframe=justselectingframe;
				tselectboundary={
				x1:multipleselectframe.x,
				y1:multipleselectframe.y,
				x2:multipleselectframe.x+multipleselectframe.width,
				y2:multipleselectframe.y+multipleselectframe.height
				};
			}
			
			if(svgstatus.nodeselected===1){NodesUnselected();}
			if(svgstatus.edgeselected===1){EdgesUnselected();}
			if(svgstatus.noteselected===1){NotesUnselected();}
			
			//set the nodes in the rect area selected:			
		//select the nodes
			for (var i=0; i<nodes.length;i++){
				var tnodeboundary={
					x1:nodes[i].x-nodes[i].rx,
					y1:nodes[i].y-nodes[i].ry,
					x2:nodes[i].x+nodes[i].rx,
					y2:nodes[i].y+nodes[i].ry
				}			
				if (tnodeboundary.x1>=tselectboundary.x1 && tnodeboundary.x2<=tselectboundary.x2 && tnodeboundary.y1 >= tselectboundary.y1 && tnodeboundary.y2 <= tselectboundary.y2 )	{
					nodes[i].selected=true;
					selectednodeindexes.push(i);
					selectednodeindex=i;
					svgstatus.nodeselected=1;
				}				
			}	
			//select the edges
			for (var i=0; i<edges.length;i++){
				var startnodeid='';
				var endnodeid='';
				switch(edges[i].power){
					case 2: startnodeid=edges[i].startid; endnodeid=edges[i].endid;
					break;
					case 3:startnodeid=edges[i].nodeid; endnodeid=edges[i].nodeid;
					break;
				}
				var startnode=nodes[matchnodeindex(nodes,startnodeid)];
				var endnode=nodes[matchnodeindex(nodes,endnodeid)];
				var tedgeboundary={
					x1:startnode.x,
					y1:startnode.y,
					x2:endnode.x,
					y2:endnode.y,
					x3:edges[i].handleP.x,
					y3:edges[i].handleP.y
				}			
				if (tedgeboundary.x1>=tselectboundary.x1 && tedgeboundary.x1<=tselectboundary.x2
							&& tedgeboundary.y1 >= tselectboundary.y1 && tedgeboundary.y1 <= tselectboundary.y2 
							&& tedgeboundary.x2 >= tselectboundary.x1 && tedgeboundary.x2 <= tselectboundary.x2
							&& tedgeboundary.y2 >= tselectboundary.y1 && tedgeboundary.y2 <= tselectboundary.y2 
							&& tedgeboundary.x3 >= tselectboundary.x1 && tedgeboundary.x3 <= tselectboundary.x2
							&& tedgeboundary.y3 >= tselectboundary.y1 && tedgeboundary.y3 <= tselectboundary.y2)	{
					edges[i].selected=true;
					selectededgeindexes.push(i);
					selectededgeindex=i;
					svgstatus.edgeselected=1;
				}				
			}
			//select the notes
			for (var i=0; i<notes.length;i++){
				var tnoteboundary={
					x1:notes[i].x-notes[i].rx,
					y1:notes[i].y-notes[i].ry,
					x2:notes[i].x+notes[i].rx,
					y2:notes[i].y+notes[i].ry
				}			
				if (tnoteboundary.x1>=tselectboundary.x1 && tnoteboundary.x2<=tselectboundary.x2 && tnoteboundary.y1 >= tselectboundary.y1 && tnoteboundary.y2 <= tselectboundary.y2 )	{
					notes[i].selected=true;
					selectednoteindexes.push(i);
					selectednoteindex=i;
					svgstatus.noteselected=1;
				}				
			}
			updatesvg();
		} else {			
		}	
}

function OnmysvgMouseUp(thissvg,d){//console.log("OnmysvgMouseUp");
	if (svgstatus.linkingto >= 1) { 								
		linkinginitialindex = -1;
		linkingtargetindex = -1;
		svgdragline.x0=0;svgdragline.y0=0;svgdragline.x1=0;svgdragline.y1=0;																				
		//when mouseup status.linkingto should be set from 1 to 0;	
		svgstatus.linkingto = 0;
	} else if (svgstatus.texting ===1){
		svgstatus.texting =0;				
	} else if (justmousedownedgeindex >= 0){
		justmousedownedgeindex = -1;						
	} else if (justmousedownnodeindex >= 0){
		justmousedownnodeindex = -1;
	} else if (justmousedownnoteindex>=0){
		justmousedownnoteindex=-1;
	} 
	if (svgstatus.multipleselecting===1){
		multipleselectframe.x = 0;
		multipleselectframe.y = 0;
		multipleselectframe.width= 0;
		multipleselectframe.height= 0;
		svgstatus.multipleselecting = 0;			
	}			
	svgstatus.nodeondragged = 0;
	svgstatus.svgondragged = 0;
	//justmousedownnodeindex=-1;	
	updatesvg();								
}

function OnmysvgMouseOut(thissvg,d){//console.log("OnmysvgMouseOut");	

}

function OnmysvgOnDrag(thissvg,d){
	if (svgstatus.linkingto >= 1){	//handle the linkingto effects										
		 if( linkinginitialindex != -1) {
			svgdragline.x0 = nodes[linkinginitialindex].x;
			svgdragline.y0 = nodes[linkinginitialindex].y;
			svgdragline.x1 = d3.mouse(mysvgG)[0];
			svgdragline.y1 = d3.mouse(mysvgG)[1];
			//Dragmove_for_linking(thissvg,d);
			//linkingtempxy = {x:d.x +d3.event.dx, y:d.y+d3.event.dy};	
			updatesvg();
		} 						
	}
}


//函数：svg画布元素绘制及刷新，并设置svg元素的交互动作
function updatesvg(){
	//擦除画面中需要刷新的元素类型
	mysvg.selectAll("line").remove();
	mysvg.selectAll("ellipse").remove();
	mysvg.selectAll("rect").remove();
	mysvg.selectAll("polygon").remove();
	mysvg.selectAll("circle").remove();
	mysvg.selectAll("path").remove();
	mysvg.selectAll("text").remove();
	//根据updated的数据数组绘制元素
	ellipsenodes = nodes.filter(function(d){    return d.type == "ellipse";		});
	rectnodes = nodes.filter(function(d){      return d.type == "rect";		});
	trianglenodes = nodes.filter(function(d){      return d.type == "triangle";		});
	diamondnodes = nodes.filter(function(d){      return d.type == "diamond";		});
	hexagonnodes = nodes.filter(function(d){      return d.type == "hexagon";		});
	//用于显示选中节点的 size调节点
	var selectednodes = nodes.filter(function(d){	return d.selected == true;		});
	var resize_cPs = generate_resize_cPs(selectednodes);									
	numRec=rectnodes.length;
	numElli=ellipsenodes.length;
	numTri=trianglenodes.length;
	numDiamond=diamondnodes.length;
	numHexagon=hexagonnodes.length;
	numNode=nodes.length;
	numEdge=edges.length;

	//draw the background grid
	if(svgstatus.IsShowGrid){
		var grids= generate_grids();
		var grids_row = grids.grids_row;
		var grids_col = grids.grids_col;
		var grids_row_lines = mysvg.selectAll("line.gridrow")
									.data(grids_row);		
			grids_row_lines.enter().append("svg:line")
									.attr("class","line.gridrow")
									.attr("x1",function(d){return d.P1.x})
									.attr("y1",function(d){return d.P1.y})
									.attr("x2",function(d){return d.P2.x})
									.attr("y2",function(d){return d.P2.y})
									.attr("stroke-width","0.5px")
									.attr("stroke","GREY")
									.attr("stroke-dasharray","5,5");		
			grids_row_lines.exit().remove(); 
		var grids_col_lines = mysvg.selectAll("line.gridcol")
									.data(grids_col);
			grids_col_lines.enter().append("svg:line")
									.attr("class","line.gridcol")
									.attr("x1",function(d){return d.P1.x})
									.attr("y1",function(d){return d.P1.y})
									.attr("x2",function(d){return d.P2.x})
									.attr("y2",function(d){return d.P2.y})
									.attr("stroke-width","0.5px")
									.attr("stroke","GREY")
									.attr("stroke-dasharray","5,5");		
			grids_col_lines.exit().remove(); 									
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	//the layer1 on mysvg
	mysvgG = mysvg.append("svg:g")
					.attr("id","mysvgG");
					
	//////////////////////////////////////////////////////////////////////////////////////////////
	//begin drawing the paths
	paths = mysvgG.selectAll("path.Gs")
			.data(edges);
	pathGs= paths.enter().append("svg:g")
						.attr("class","path.Gs");						
	pathGs.on("mouseover", function(d,i){ //console.log("pathGs.onmouseover ");						
						d.handlePshow = true;								
						//updatesvg(); //!!!!这个update会导致path的onmousedown事件不响应
						//if( d.selected)  {	d3.select("#handle"+i).attr("fill", defaultCOLOR).attr("stroke",defaultCOLOR);}
						//if( ! d.selected)  {	d3.select("#handle"+i).attr("fill", backgroundCOLOR).attr("stroke",defaultCOLOR);}
						d3.select("#handle"+i).attr("fill", backgroundCOLOR).attr("stroke",defaultCOLOR);
					})
		.on("mouseout", function(d,i){ //console.log("pathGs.onmouseout ");	
						//d.handlePshow  = false;
						if (! d.selected) {
							d.handlePshow =false;
						}
						//updatesvg();//!!!!这个update会导致path的onmousedown事件不响应
						if(! d.selected){	d3.select("#handle"+i).attr("fill", "none").attr("stroke","none");	}						
					})
		.on("mousedown", function(d,i){//console.log("onmousedownpath "+ i);
						//d3.event.stopPropagation();						
						OnPathMouseDown(this, d, i);				
					})       
		.on("mouseup", function(d,i){	//console.log("onmouseuppath "+ i);
						//d3.event.stopPropagation();					
						OnPathMouseUp(this, d, i); 
					});
		
		//the arrow at interPoint1
	pathGs.append("svg:path")
		.attr("d",function(d,i){  return edges_tangents[i].tangentline1;})
		.attr("class","path.Arrow1")
		.attr("id", function(d,i){ return "patharrow1"+i;})
		.attr("fill","none")
		.attr("stroke","WHITE")
		.attr("stroke-width",function(d,i){ if (edges[i].selected) {return (d.strokewidth *4/3)+"px";}else {return d.strokewidth+"px";} })
		.style("opactic", "100%")
		.style("marker-end", function(d){ 
						var temp="url(#endarrow)";
						var arrowurl="url(#endarrow"+d.color+")";
						switch (d.type)	{						
							case "bi": temp=arrowurl; break;
							case "uni": temp = "url(#arrowfake)"; break;
							default: ;
						}
						return temp;						
					});
	//the arrow at interPoint2
	pathGs.append("svg:path")
		.attr("d",function(d,i){return edges_tangents[i].tangentline2;})
		.attr("class","path.Arrow2")
		.attr("id", function(d,i){ return "patharrow2"+i;})
		.attr("fill","none")
		.attr("stroke","WHITE")
		.attr("stroke-width",function(d,i){ if (edges[i].selected) {return (d.strokewidth * 4/3)+"px";}else {return d.strokewidth+"px";} })
		.style("opactic", "100%")
		.style("marker-end", function(d){var arrowurl="url(#endarrow"+d.color+")"; return arrowurl;});
	//the path itself
	 pathGs.append("svg:path")
		.attr("d",function(d){return d.line;})
		.attr("class","path.link")
		.attr("fill","none")
		.attr("stroke",function(d,i){
				return d.color;
			})
		.attr("stroke-width",function(d,i){
				if (edges[i].selected) {return (d.strokewidth*5/2)+"px";}else {return d.strokewidth+"px";}
			})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.dotted){
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.style("opactic", "1")
		//.style("marker-end", "url(#arrowfake)")
		//.style("marker-start","url(#arrowfake)")
		;

	paths.exit().remove(); 	
	//end drawing the paths
	
	//////////////////////////////////////////////////////////////////////////////////
	// handleP
	handlePs = mysvgG.selectAll("circle.handle")
			.data(edges);
	handlePs.enter().append("svg:circle")
		.attr("class", "circle.handle")
		.attr("id", function(d,i){return "handle"+i;})
		.attr("cx",function(d){return d.handleP.x;})
		.attr("cy",function(d){return d.handleP.y;})
		.attr("r", function(d,i) {
						if (selectededgeindex === i) return String((cPr*1.5));
						return String(cPr);
					})
		.attr("stroke", function(d,i) {
						if(d.handlePshow | d.selected) { 
							return defaultCOLOR;
						} else { 
								return "none";
						}
					})
		.attr("fill", function (d) {
						if (d.handlePshow | d.selected) {
							return backgroundCOLOR;
						} else {return "none";} 
					})		
		.on("mouseover", function(d,i){
						d3.select("#handle"+i).attr("stroke",defaultCOLOR)
											.attr("fill",defaultCOLOR);
						d.handlePshow = true;
					})
		.on("mouseout",function(d,i){
						if (selectededgeindex===i){
							d3.select("#handle"+i).attr("stroke",defaultCOLOR)
											.attr("fill",backgroundCOLOR);
						} else {
							d3.select("#handle"+i).attr("stroke","none")
												.attr("fill","none");
							d.handlePshow = false;
						}
					})
		.on("mousedown", function(d,i){//console.log("handlePs.onmousedown");
						//d3.event.stopPropagation();		
						var currentindex = i;
						justmousedownedgeindex = currentindex; //	mark the just mouse down path's handleP
					})
		.on("mouseup", function(d,i){//console.log("handlePs.onmouseup");
						//d3.event.stopPropagation();			
						OnHandlePMouseUp(this, d, i);
					})
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){   
								this.__origin__ = {x:d.handleP.x, y:d.handleP.y};
							})
				.on("drag", function(d,i){      
								var originx = this.__origin__.x;
								var originy = this.__origin__.y;
								d.handleP.x =  this.__origin__.x += d3.event.dx;   //update the handleP's x and y
								d.handleP.y = this.__origin__.y += d3.event.dy;  
								if(d.handleP.x === originx && d.handleP.y === originy){
								}else {
									d.handleInitial = false;				//console.log("d.handleP"); console.log(d.handleP);
									var newhandleP = d.handleP;
									edges[i].handleP= newhandleP;			//console.log("newhandleP"); console.log(newhandleP);
									edges[i] = update_bcurve(nodes,edges[i]);//update the bcurve's line value with the new handleP
									edges_tangents[i] = generate_tangent(nodes,edges[i]);
									updatesvg();  
								}
							})
      			 .on("dragend", function(d){
      						 delete this.__origin__; 
      						})
			);
			
	handlePs.exit().remove();

	////////////////////////////////////////////////////////////////////////////////////
	//labels for paths
	labelTs = mysvgG.selectAll("text.label")
				.data(edges);
	labelTs.enter().append("svg:text")
		.attr("class","text.label")
		.attr("id",function(d,i){return "label"+i;})
		.attr("text-anchor","middle")
		.attr("font-size", function(d,i){ 
							if( selectededgeindex === i) {var highlightFsize = d.labelFsize + 5; return highlightFsize+"pt";}
							return d.labelFsize+"pt";
						})
		.attr("stroke", function(d,i) {
						if(svgstatus.IsShowLabels){
							return "none";
						} else {
							return "none";
						}
					})
		.attr("fill", function(d,i) {
						if(svgstatus.IsShowLabels){
							return defaultCOLOR;
						} else {
							return "none";
						}
					})
		.attr("dx", function(d){return d.labelP.x;})
		.attr("dy", function(d){return d.labelP.y;})
		.text(function(d,i) {return d.label;})
		.on("mouseover", function(d,i){
						d3.select("#label"+i).attr("stroke","#888888");
					})
		.on("mouseout", function(d,i){
						d3.select("#label"+i).attr("stroke","none");
					})
						
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnLabelMouseDown(this,d,i);
					})
		.on("mouseup", function(d,i){
						OnLabelMouseUp(this, d, i);
					})
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d){   
								this.__origin__ = {x:d.labelP.x, y:d.labelP.y};
							})
				.on("drag", function(d,i){      
								d.labelP.x =  this.__origin__.x += d3.event.dx;  
								d.labelP.y = this.__origin__.y += d3.event.dy;  
								updatesvg();  
							})
      			 .on("dragend", function(d){
								delete this.__origin__; 
      						})
			);
	
	labelTs.exit().remove();	

		
	//////////////////////////////////////////////////////////////////////////////////////////
	//nodes ellipses	
	ellipses = mysvg.selectAll("ellipse.Gs")
			.data(ellipsenodes);
	ellipseGs= ellipses.enter().append("svg:g")
									.attr("class","ellipse.Gs");
	ellipseGs.style("stroke",function(d){return d.color})
		.attr("id", function(d){return "node"+d.id})
		.on("mouseover", function(d){ 
			      		d3.select("#ellipse"+d.id).attr("fill","#FFEEEE");
					})
		.on("mouseout", function(d){
						 d3.select("#ellipse"+d.id).attr("fill",backgroundCOLOR);
					})
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						//console.log("ellipseGs.onmousedown");
						OnNodeMouseDown(this, d,i);
						})
		.on("mouseup", function(d,i){
						//console.log("ellipseGs.onMouseUp "+ i);
						OnNodeMouseUp(this,d,i);
					})			
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){
								svgstatus.nodeondragged=1;
								this.__origin__ = {x:d.x, y:d.y};
								OnNodeOnDragStart(this,d,i);
							})
				.on("drag", function(d,i){
								OnNodeOnDrag(this,d,i);
							})
      			.on("dragend", function(d,i){
								//d3.event.stopPropagation();								
								delete this.__origin__; 
								OnNodeOnDragEnd(this,d,i);
								if (svgstatus.nodeondragged===1) svgstatus.nodeondragged=0;
								//if (svgstatus.linkingto==1) svgstatus.linkingto=0;
							})
			);
		
	ellipseGs.append("svg:ellipse")
		.attr("class", "ellipses.node")
		.attr("id",function(d){return "ellipse"+d.id;})
		.attr("cx",function(d){return d.x;})
		.attr("cy",function(d){return d.y;})
		.attr("rx",function(d){return d.rx;})
		.attr("ry",function(d){return d.ry;})
		.attr("fill","WHITE")
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.strokedotted)	{
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.attr("stroke-width",function(d,i) {
						if (d.selected) {return (d.strokewidth+3)+"px"; }else{return d.strokewidth+"px";}
					});

	ellipseGs.append("svg:text")
		.attr("class", "text.node")
		.attr("text-anchor","middle")
		.attr("font-size", function(d){if (d.fontsize) {return d.fontsize+"pt";} else {return (10 +"pt");} })
		.attr("stroke","none")
		.attr("fill",defaultCOLOR)
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y + d.fontsize/2;})
		.text(function(d,i) {return d.title;});
		
	ellipses.exit().remove();
	
	/////////////////////////////////////////////////////////////////////////////////////////
	//nodes rects			
	rects = mysvg.selectAll("rect.Gs")
			.data(rectnodes);
	rectGs= rects.enter().append("svg:g")
					.attr("class","rect.Gs");
	rectGs.style("stroke",function(d){return d.color})
		.attr("id", function(d){return "node"+d.id})
		.on("mouseover", function(d){ 
			      		d3.select("#rect"+d.id).attr("fill","#FFEEEE");
					})
		.on("mouseout", function(d){
						d3.select("#rect"+d.id).attr("fill",backgroundCOLOR);
					})
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnNodeMouseDown(this, d, i);
					})
		.on("mouseup",  function(d,i){ OnNodeMouseUp(this,d,i);})			
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){
								svgstatus.nodeondragged=1;					
								this.__origin__ = {x:d.x, y:d.y};
								OnNodeOnDragStart(this,d,i);			
							})
				.on("drag", function(d,i){
								OnNodeOnDrag(this,d,i);
							})
      			.on("dragend", function(d,i){
								//d3.event.stopPropagation();								
								delete this.__origin__; 
								OnNodeOnDragEnd(this,d,i);
								if (svgstatus.nodeondragged===1) svgstatus.nodeondragged=0;
							})
			);

	rectGs.append("svg:rect")
		.attr("class", "rect.node")
		.attr("id",function(d){return "rect"+d.id;})
		.attr("x",function(d){return String(d.x-d.rx);})
		.attr("y",function(d){return String(d.y-d.ry);})
		.attr("width",function(d){return String(d.rx*2);})
		.attr("height",function(d){return String(d.ry*2);})
		.attr("fill","WHITE")
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.strokedotted)	{
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.attr("stroke-width",function(d){
						if (d.selected) {return (d.strokewidth+3)+"px"; }else{return d.strokewidth+"px";}
					});
		
	rectGs.append("svg:text")
		.attr("class", "text.node")
		.attr("text-anchor","middle")
		.attr("font-size", function(d){if (d.fontsize) {return d.fontsize+"pt";} else {return (10 +"pt");} })
		.attr("stroke","none")
		.attr("fill",defaultCOLOR)
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y + d.fontsize/2;})
		.text(function(d,i) {return d.title;});	
	rects.exit().remove();		
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	//nodes hexagon
	hexagons = mysvg.selectAll("hexagon.Gs")
			.data(hexagonnodes);
	hexagonGs= hexagons.enter().append("svg:g")
					.attr("class","hexagon.Gs");
	hexagonGs//.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
		.style("stroke",function(d){return d.color})
		.attr("id", function(d){return "node"+d.id})
		.on("mouseover", function(d){ 
						d3.select("#hexagon"+d.id).attr("fill","#FFEEEE");
					})
		.on("mouseout", function(d){
					  d3.select("#hexagon"+d.id).attr("fill",backgroundCOLOR);
					})
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnNodeMouseDown(this, d, i);								
					})
		.on("mouseup",  function(d,i){ OnNodeMouseUp(this,d,i);})			
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){
								svgstatus.nodeondragged=1;
								this.__origin__ = {x:d.x, y:d.y};
								OnNodeOnDragStart(this,d,i);
							})
				.on("drag", function(d,i){
								OnNodeOnDrag(this,d,i);
							})
      			.on("dragend", function(d,i){
								//d3.event.stopPropagation();								
								delete this.__origin__;
								OnNodeOnDragEnd(this,d,i);								
								if (svgstatus.nodeondragged===1) svgstatus.nodeondragged=0;
								//if (svgstatus.linkingto==1) svgstatus.linkingto=0;
							})
			);					
			
	hexagons.append("svg:polygon")
		.attr("id",function(d){return "hexagon"+d.id;})
		.attr("points", function (d) {
						var p1 = { x: d.x - d.rx,		y: d.y };
						var p2 = { x: d.x - d.rx /2,	y: d.y - d.ry * Math.sqrt(3)/2};
						var p3 = { x: d.x + d.rx /2,	y: d.y - d.ry * Math.sqrt(3)/2};
						var p4 = { x: d.x + d.rx,       y: d.y };
						var p5 = { x: d.x + d.rx /2,	y: d.y + d.ry * Math.sqrt(3)/2};
						var p6 = { x: d.x - d.rx /2,	y: d.y + d.ry * Math.sqrt(3)/2};
						temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p4.x+","+p4.y +" "+p5.x+","+p5.y +" "+p6.x+","+p6.y +" "+p1.x+","+p1.y;
						return temp;
					})
		.attr("class", "polygon.hexagon")
		.attr("fill","WHITE")
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.strokedotted){
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.attr("stroke-width",function(d){
						if (d.selected) {return (d.strokewidth+3)+"px"; }else{return d.strokewidth+"px";}
					});

	hexagonGs.append("svg:text")
		.attr("class", "text.node")
		.attr("text-anchor","middle")
		.attr("font-size", function(d){if (d.fontsize) {return d.fontsize+"pt";} else {return (10 +"pt");} })
		.attr("stroke","none")
		.attr("fill",defaultCOLOR)
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y + d.fontsize/2;})
		.text(function(d,i) {return d.title;});
			
	hexagons.exit().remove();

	/////////////////////////////////////////////////////////////////////////////////////////
	//nodes triangles
	triangles = mysvg.selectAll("triangle.Gs")
			.data(trianglenodes);
	triangleGs= triangles.enter().append("svg:g")
					.attr("class","triangle.Gs");
	triangleGs//.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
		.style("stroke",function(d){return d.color})
		.attr("id", function(d){return "node"+d.id})
		.on("mouseover", function(d){ 
			      		d3.select("#triangle"+d.id).attr("fill","#FFEEEE");									
					})
		.on("mouseout", function(d){
						d3.select("#triangle").attr("fill",backgroundCOLOR);
					})
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnNodeMouseDown(this, d, i);
					})
		.on("mouseup",  function(d,i){ OnNodeMouseUp(this,d,i);})			
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){ 
								svgstatus.nodeondragged=1;
								this.__origin__ = {x:d.x, y:d.y};
								OnNodeOnDragStart(this,d,i);
							})
				.on("drag", function(d,i){
								OnNodeOnDrag(this,d,i);				
							})
      			.on("dragend", function(d,i){
								//d3.event.stopPropagation();								
								delete this.__origin__; 
								OnNodeOnDragEnd(this,d,i);
								if (svgstatus.nodeondragged===1) svgstatus.nodeondragged=0;
								//if (svgstatus.linkingto==1) svgstatus.linkingto=0;
							})
			);		
			
	triangleGs.append("svg:polygon")
		.attr("id",function(d){return "triangle"+d.id;})
		.attr("points", function (d) {
						var p1 = { x: d.x - d.rx*Math.sqrt(3)/2, y: d.y+d.rx/2 };
						var p2 = { x: d.x + d.rx*Math.sqrt(3)/2, y: d.y+d.rx/2 };
						var p3 = { x: d.x, y: d.y - d.ry};
						temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p1.x+","+p1.y;
						return temp;
					})
		.attr("class", "polygon.triangle")
		.attr("fill","WHITE")
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.strokedotted)	{
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.attr("stroke-width",function(d){
						if (d.selected) {return (d.strokewidth+3)+"px"; }else{return d.strokewidth+"px";}
					});
		
	triangleGs.append("svg:text")
		.attr("class", "text.node")
		.attr("text-anchor","middle")
		.attr("font-size", function(d){if (d.fontsize) {return d.fontsize+"pt";} else {return (10 +"pt");} })
		.attr("stroke","none")
		.attr("fill",defaultCOLOR)
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y  + d.fontsize/2;})
		.text(function(d,i) {return d.title;});	
					
	triangles.exit().remove();

	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//nodes diamonds
	diamonds = mysvg.selectAll("diamond.Gs")
			.data(diamondnodes);			
	diamondGs= diamonds.enter().append("svg:g")
					.attr("class","diamond.Gs");
	diamondGs//.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
		.style("stroke",function(d){return d.color})
		.attr("id", function(d){return "node"+d.id})
		.on("mouseover", function(d){ 
			      		d3.select("#diamond"+d.id).attr("fill","#FFEEEE");
					})
		.on("mouseout", function(d){
					   d3.select("#diamond"+d.id).attr("fill",backgroundCOLOR);
					})
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnNodeMouseDown(this, d, i);									
					})
		.on("mouseup", function(d,i){ OnNodeMouseUp(this,d,i);})			
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d,i){ 
								svgstatus.nodeondragged=1;				
								this.__origin__ = {x:d.x, y:d.y};
								OnNodeOnDragStart(this,d,i);
							})
				.on("drag", function(d,i){	
								OnNodeOnDrag(this,d,i);	
							})
      			.on("dragend", function(d,i){
								//d3.event.stopPropagation();								
								delete this.__origin__; 
								OnNodeOnDragEnd(this,d,i);
								if (svgstatus.nodeondragged===1) svgstatus.nodeondragged=0;
							})
			);						
			
	diamondGs.append("svg:polygon")
		.attr("id",function(d){return "diamond"+d.id})
		.attr("points", function (d) {
						var p1 = { x: d.x - d.rx, y: d.y };
						var p2 = { x: d.x,        y: d.y - d.ry };
						var p3 = { x: d.x + d.rx, y: d.y };
						var p4 = { x: d.x,        y: d.y + d.ry};
						temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p4.x+","+p4.y +" "+p1.x+","+p1.y;
						return temp;
					})
		.attr("class", "polygon.diamond")
		.attr("fill","WHITE")
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-dasharray", function(d){
						var temp;
						switch (d.strokedotted)
						{
							case 0: temp = "none";break;
							case 1: temp ="5,5"; break;
							default: temp="none";
						}
						return temp;
					})
		.attr("stroke-width",function(d){
				if (d.selected) {return (d.strokewidth+3)+"px"; }else{return d.strokewidth+"px";}
			});

	diamondGs.append("svg:text")
		.attr("class", "text.node")
		.attr("text-anchor","middle")
		.attr("font-size", function(d){if (d.fontsize) {return d.fontsize+"pt";} else {return (10 +"pt");} })
		.attr("stroke","none")
		.attr("fill",defaultCOLOR)
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y  + d.fontsize/2;})
		.text(function(d,i) {return d.title;});	
		
	diamonds.exit().remove();	

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//begin of resizecPs
	// resizePs for nodes
	var resizecPs = mysvg.selectAll("circle.resizecP")
			.data(resize_cPs);
	resizecPs.enter().append("svg:circle")
		.attr("class", "circle.resizecPe")
		.attr("id", function(d,i){return "rcP"+i;})
		.attr("cx",function(d){return d.pos.x})
		.attr("cy",function(d){return d.pos.y;})
		.attr("r",String(cPr))
		.attr("stroke", defaultCOLOR)
		.attr("fill", backgroundCOLOR)
		.on("mouseover", function(d,i){
						d3.select("#rcP"+i).attr("fill", defaultCOLOR);
					})
		.on("mouseout", function(d,i){	
						d3.select("#rcP"+i).attr("fill", backgroundCOLOR);		
					})
		.on("mousedown", function(d,i){
						var currentnodeindex = matchnodeindex(nodes, d.nodeid);
						justmousedownnodeindex = currentnodeindex;
					})
		.on("mouseup", function(d,i){
						var currentnodeindex = matchnodeindex(nodes, d.nodeid);
						if (justmousedownnodeindex == currentnodeindex){
							justmousedownnodeindex=-1;
							svgstatus.nodeselected=1;
							selectednodeindex =currentnodeindex;// select node action
							nodes[selectednodeindex].selected=true;
							updatesvg();
						}
					})
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d){   
								this.__origin__ = {x:d.pos.x, y:d.pos.y};
							})
				.on("drag", function(d,i){      
								OnResizedCPOnDrag(this,d,i);
							})
      			 .on("dragend", function(d){
								delete this.__origin__; 
      						})
			);
		
	resizecPs.exit().remove();		
	// end of resize controlPs/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//begin the free texts:
	noteTs = mysvgG.selectAll("text.note")
				.data(notes);
	noteTs.enter().append("svg:text")
		.attr("class","text.note")
		.attr("id",function(d,i){return "note"+i;})
		.attr("text-anchor","middle")
		.attr("font-size", function(d,i){ 
						if( selectednoteindex === i) {var highlightFsize = d.fontsize + 5; return highlightFsize+"pt";}
						return d.fontsize+"pt";
					})
		.attr("stroke", function(d,i) {	return "none";	})
		.attr("fill", function(d,i) {	return d.color;})
		.attr("dx", function(d){return d.x;})
		.attr("dy", function(d){return d.y;})
		.text(function(d,i) {return d.text;})
		.on("mouseover", function(d,i){
						d3.select("#note"+i).attr("stroke","#888888");
					})
		.on("mouseout", function(d,i){
						d3.select("#note"+i).attr("stroke","none");
					})						
		.on("mousedown", function(d,i){
						//d3.event.stopPropagation();
						OnNoteMouseDown(this,d,i);
					})
		.on("mouseup", function(d,i){
						OnNoteMouseUp(this, d, i);
					})
		.call(
			d3.behavior.drag()
				.on("dragstart",function(d){   
								this.__origin__ = {x:d.x, y:d.y};
							})
				.on("drag", function(d,i){      
								d.x =  this.__origin__.x += d3.event.dx;  
								d.y = this.__origin__.y += d3.event.dy;  
								updatesvg();  
							})
      			 .on("dragend", function(d){
								delete this.__origin__; 
      						})
			);
	
	noteTs.exit().remove();		
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var tempG= mysvgG.append("svg:g");
	mysvgG_foreignObject = tempG.append("svg:g")
					.attr("id","mysvgG_foreignObject");	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//linking path
	if (svgstatus.linkingto==1){
		tline = "M"+ svgdragline.x0 + " " + svgdragline.y0 + " " + "L" + svgdragline.x1+" " + svgdragline.y1 ;
		linkingpath = mysvgG.append("svg:path")
			.attr("class","path.linking")
			.attr("d",tline)
			.attr("fill","none")
			.attr("stroke","BLACK")
			.attr("stroke-width","2px")
			.attr("stroke-dasharray", "none")
			.style("opactic", "1")
			.style("marker-end", "url(#endarrow)")
			.style("marker-start", function(d){if (linkingtoArrowTYPE==="bi") {return "url(#beginarrow)";} else {return "url(#arrowfake)";}});
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//multiple selecting:
	if(svgstatus.multipleselecting===1){
		mysvg.append('svg:rect')
			.attr("class",'selecting')
			.attr( "x",multipleselectframe.x)
			.attr("y",multipleselectframe.y)
			.attr("width", multipleselectframe.width)
			.attr("height", multipleselectframe.height)
			.attr("fill", 'transparent')
			.attr("stroke","#8888BB")
			.attr("stroke-dasharray",'5,5')
			.attr("stroke-width","1.5 px");
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	mysvg.on("mousedown", function(d){//console.log("mysvg.onmousedown");					
					OnmysvgMouseDown(this,d);	
				})
		.on("mouseup", function(d){//console.log("mysvg.onmouseup");					
					OnmysvgMouseUp(this,d);
				})
		.on("mouseout", function(d){//console.log("mysvg.onmouseout");	
					OnmysvgMouseOut(this,d);
				});
	if (svgstatus.linkingto === 0){
		mysvg.on("mousemove", function(d){//console.log("mysvg.onmousemove");
					OnmysvgMouseMove(this,d);
				})
	}
} // end of function updatesvg(){}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//this following function is not used now.
//函数： 区分click 和dblclick event from https://gist.github.com/tmcw/4067674
function clickcancel() {
    var event = d3.dispatch('click', 'dblclick');

	function cc(selection) {
        var down,
            tolerance = 5,
            last,
            wait = null;
        // euclidean distance
		function dist(a, b) {
					return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
		}
        selection.on('mousedown', function() {
            down = d3.mouse(document.body);
            last = +new Date();
        });
        selection.on('mouseup', function() {
            if (dist(down, d3.mouse(document.body)) > tolerance) {
                return;
            } else {
                if (wait) {
                    window.clearTimeout(wait);
                    wait = null;
                    event.dblclick(d3.event);
                } else {
                    wait = window.setTimeout((function(e) {
                        return function() {
                            event.click(e);
                            wait = null;
                        };
                    })(d3.event), 300);
                }
            }
        });
	};
    return d3.rebind(cc, event, 'on');
}

function initialSVG()	{
	
	var cc=clickcancel();

}


