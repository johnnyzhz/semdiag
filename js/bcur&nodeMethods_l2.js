/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *     
 ***************************************************/
//函数：添加节点
function node_add(_pos, _rx, _ry, _fontsize,_type){
	var newnode=null;
	var title_pre = "V";
	switch(_type){
		case "ellipse": title_pre ="F";
			break;
		case "rect": title_pre ="X";
			break;
		case "hexagon": title_pre = "N";
			break;
		case "triangle": title_pre = "u";
			break;
		case "diamond": title_pre ="d";
			break;
		default:;
	}// end of switch (_type) title_pre
	switch (_type){
		case "ellipse": 
			Nodecurrent_IdNUM++;
			Elli_current_TitleNUM++;			
			newnode = { id: "node"+String(Nodecurrent_IdNUM), type: _type, x:_pos.x, y:_pos.y, rx: default_RADIUSH,ry:default_RADIUSV, strokedotted:0, color: defaultCOLOR, title: title_pre+ Elli_current_TitleNUM, fontsize:defaultFONTSIZE,strokewidth:default_strokeWIDTH, selected: false};
			nodes.push(newnode);
			numElli++;
			numNode++;				
			break;
		case "rect":
			Nodecurrent_IdNUM++;
			Rec_current_TitleNUM++;
			newnode = { id: "node"+String(Nodecurrent_IdNUM), type: _type, x:_pos.x, y:_pos.y, rx: default_RADIUSH,ry:default_RADIUSV, strokedotted:0, color: defaultCOLOR, title: title_pre+ Rec_current_TitleNUM, fontsize:defaultFONTSIZE,strokewidth:default_strokeWIDTH,selected: false};
			nodes.push(newnode);
			numRec++;
			numNode++;				
			break;
		case "hexagon":
			Nodecurrent_IdNUM++;
			Hexagon_current_TitleNUM++;
			newnode = { id: "node"+String(Nodecurrent_IdNUM), type: _type, x:_pos.x, y:_pos.y, rx: default_RADIUSH,ry:default_RADIUSV, strokedotted:0, color: defaultCOLOR, title: title_pre+ Hexagon_current_TitleNUM, fontsize:defaultFONTSIZE,strokewidth:default_strokeWIDTH, selected: false};
			nodes.push(newnode);
			numHexagon++;
			numNode++;				
			break;
		case "triangle":{
			Nodecurrent_IdNUM++;
			newnode = { id: "node"+String(Nodecurrent_IdNUM), type: _type, x:_pos.x, y:_pos.y, rx: default_RADIUSH,ry:default_RADIUSV,  strokedotted:0, color: defaultCOLOR, title: title_pre, fontsize:defaultFONTSIZE,strokewidth:default_strokeWIDTH,selected: false};
			nodes.push(newnode);
			numTri++;
			numNode++;				
			break;
		}
			break;
		case "diamond":{
			Nodecurrent_IdNUM++;
			newnode = { id: "node"+String(Nodecurrent_IdNUM), type: _type, x:_pos.x, y:_pos.y, rx: default_RADIUSH,ry:default_RADIUSV, title: title_pre, fontsize:defaultFONTSIZE, strokedotted:0, color: defaultCOLOR,strokewidth:default_strokeWIDTH, selected: false};
			nodes.push(newnode);
			numDiamond++;
			numNode++;	
		} 
			break;
		default:;
	}//end of switch (_type) 
		//console.log("node_add:numTri"+numTri);
	return newnode;
}

function node_delete(_nodeindex){
	var currentnode = nodes[_nodeindex];
	var temp = delete_relatededges(currentnode, edges, edges_tangents);//删除给定节点有关的路径并返回清理后的 edges 和 edges_tangents 数组
	edges = temp.edges;
	edges_tangents = temp.edges_tangents;
	if(matchnodeindex(nodes,currentnode.id)>= 0 & matchnodeindex(nodes,currentnode.id)< nodes.length){// when the currentnode has not been deleted during the related edges deleting 
		switch (currentnode.type){
			case "ellipse": 
				//nodes.splice(_nodeindex,1);
				numElli--;
				numNode--;			
				break;
			case "rect":
				//nodes.splice(_nodeindex,1);
				numRec--;
				numNode--;				
				break;
			case "hexagon":
				//nodes.splice(_nodeindex,1);
				numHexagon--;
				numNode--;				
				break;
			case "triangle":{
				//nodes.splice(_nodeindex,1);
				numTri--;
				numNode--;
			}
				break;
			case "diamond":{
				//nodes.splice(_nodeindex,1);
				numDiamond--;
				numNode--;
			} 
				break;
			default:;
		}//end of switch (_type) 
		nodes.splice(_nodeindex,1);
	}
	//console.log("node_delete:numTri"+numTri);
}

function node_copy(_node){
	var newnode=null;
	if (_node===null){		
	} else {
		newnode=node_add(nodeInitialPos, default_RADIUSH,default_RADIUSV, defaultFONTSIZE, _node.type);
		newnode = { id: newnode.id
					, type: _node.type
					, x:_node.x
					, y:_node.y
					, rx: _node.rx
					,ry:_node.ry
					, strokedotted:_node.strokedotted
					, color: _node.color
					, title: _node.title
					, fontsize:_node.fontsize
					,strokewidth:_node.strokewidth
					, selected: _node.selected
			};
	}
	return newnode;			
}


//函数：删除给定节点间的路径  power 2 and power 3
function delete_nonuseedges(_startid,_endid, _newtype){ // decide if the curve exists with given startid and endid
	var numDel = 0;
	switch (_newtype){
		case "uni": 
			{	
				var Isfound =false;
				for(var i =0; i < edges.length; i++){
					if (edges[i].power===2){
						if (edges[i].startid===_startid & edges[i].endid===_endid & edges[i].type ==="bi") {
							/*
							edges.splice(i,1); 
							edges_tangents.splice(i,1);
							numEdge--;
							*/
							edge_delete(i);
							Isfound = true;
						}						
					}
				}
				if (! Isfound) {
					for(var i =0; i < edges.length; i++){
						if (edges[i].power===2){
							if (edges[i].startid===_endid & edges[i].endid===_startid & edges[i].type ==="bi") {								
								/*
								edges.splice(i,1);
								edges_tangents.splice(i,1);
								numEdge--;						
								numDel++;
								*/
								edge_delete(i);
								Isfound = true;
							}						
						}
					}

				}
			}			
			break;
		case "bi": 
			{	
				for(var i =0; i < edges.length; i++){
					if (edges[i].power===2){
						if (edges[i].startid===_startid & edges[i].endid===_endid & edges[i].type ==="uni") {
							/*
							edges.splice(i,1);
							edges_tangents.splice(i,1);
							numEdge--;
							*/
							edge_delete(i);
							numDel++;
						}						
					}
				}
				
				for(var i =0; i < edges.length; i++){
					if (edges[i].power===2){
						if (edges[i].startid===_endid & edges[i].endid===_startid & edges[i].type ==="uni") {
							/*
							edges.splice(i,1);
							edges_tangents.splice(i,1);
							numEdge--;
							*/
							edge_delete(i);
							numDel++;
						
						}						
					}
				}
				//after delete a single-headed link		
				// to handle the self-link of the endnode:
				if(Is_dependentnode(nodes[matchnodeindex(_endid)],nodes,edges)){//***if there still other nodes link to this node, there is no need to delete the self-curve/link
						
				} else {//if there is no other nodes link to this node,this should not have a self-link any more
					var tempindex = lookfor_duplicatedbcurve(nodes,edges,_endid,_endid,"bi");
					if (tempindex>=0 & tempindex<edges.length) { //and if there is a self-link of the node,  and it was generated by the system instead of the users
						if(edges[tempindex].IsAutoGenerated){
							edge_delete(tempindex); //delete it.
						}
					}
				}					
				
			}
			break;
		default: ;
	}

	
	return numDel;
}

//函数：查找与给定节点有关的路径  power 2 and power 3
function lookfor_relatededges(_nodeid){ // decide if the curve exists with given one related nodeid
	var foundindexes = [];
	
	for (var i =0; i< edges.length; i++) {
		if (edges[i].power ===2){
			if (_nodeid === edges[i].startid) foundindexes.push(i);
			if (_nodeid === edges[i].endid)foundindexes.push(i);
		} else if (edges[i].power ===3){
			if (_nodeid === edges[i].nodeid) foundindexes.push(i);
		}
	}
	
	return foundindexes;
}

//函数：删除一条路径
function edge_delete(_bcurveindex){
	var Is_sucess=false;
	var _bcurve = edges[_bcurveindex];
	switch (_bcurve.power){
		case 2:{
			switch(_bcurve.type){
				case "uni":{
					var initialnode = nodes[matchnodeindex(nodes,_bcurve.startid)];
					var targetnode = nodes[matchnodeindex(nodes,_bcurve.endid)];
					edges.splice(_bcurveindex,1);
					edges_tangents.splice(_bcurveindex,1);
					//to handle the residual self-curve/link, 
					var Is_still_dependentnode = Is_dependentnode(targetnode, nodes,edges);
					if (Is_still_dependentnode) {
					} else { // if not a dependent node any more and the self-curve/link generated automatically
						var tempbcurveindex = lookfor_duplicatedbcurve(nodes,edges,targetnode.id, targetnode.id, "bi");
						if (tempbcurveindex >=0 & tempbcurveindex < edges.length)
						{	//console.log("tempcurveindex"+ edges[tempbcurveindex].label);
							if (edges[tempbcurveindex].IsAutoGenerated === true){ //if the self-curve/link was generated by the system instead of the users, delete it:
								edges.splice(tempbcurveindex,1);
								edges_tangents.splice(tempbcurveindex,1);
							} else {//else if the self-curve/link was generated by the users, keep it.								
							}							
						}
					}
					//to handle the One triangle and the One diamond
					if (initialnode.type === "triangle" || initialnode.type ==="diamond"){
						var Is_still_initialnode=false;
						for(var i=0; i< edges.length;i++){
							if (edges[i].power === 2 & edges[i].startid === initialnode.id) Is_still_initialnode=true;
						}//when there still at least one path from them
						//if not , delete the One triangle or diamond node:
						if (! Is_still_initialnode) node_delete(matchnodeindex(nodes,initialnode.id));
					}
					Is_sucess=true;
				}
					break;
				case "bi":{
					edges.splice(_bcurveindex,1);
					edges_tangents.splice(_bcurveindex,1);
					Is_sucess=true;
				} 
					break;
				default:{					
					edges.splice(_bcurveindex,1);
					edges_tangents.splice(_bcurveindex,1);
					Is_sucess=true;
				}
			}// end of switch(_bcurve.type)			
		} 
			break;
		case 3: {
			edges.splice(_bcurveindex,1);
			edges_tangents.splice(_bcurveindex,1);
			Is_sucess=true;
		}
			break;
		default:{
			edges.splice(_bcurveindex,1);
			edges_tangents.splice(_bcurveindex,1);
			Is_sucess=true;
		}
	}// end of switch (_bcurve.power)
	return Is_sucess;
}

//函数：删除与给定节点有关的路径
function delete_relatededges(_node, _edges, _edges_tangents){
	var currentid = _node.id;
	for (var i=0; i<_edges.length; i++){
		var tempedge=edges[i];
		if (_edges[i].power === 2){
			if (_edges[i].startid === currentid || _edges[i].endid === currentid ) {
				if ( edge_delete(i) ) i--;
			}
		} else if (_edges[i].power === 3){								
			if (_edges[i].nodeid === currentid) {
				if ( edge_delete(i) ) i--;
			}
		}
	}
	return {edges: _edges, edges_tangents: _edges_tangents};
}

//函数：添加一条bcurve前排重
function edge_add_newbcurve(_newbcurve){
	//console.log("edge_add_newbcurve()");
	var newedgeindex = -1;
	var arrowType = _newbcurve.type;
	switch(_newbcurve.power){
		case 2:{
			var found_index=lookfor_duplicatedbcurve(nodes,edges,_newbcurve.startid,_newbcurve.endid, _newbcurve.type);
			if ( found_index >=0 & found_index < edges.length) {
				//alert("duplicate");//edges[found_index].type = _arrowtype;
				//edges_tangents[found_index]= generate_tangent(nodes,edges[found_index]);
			} else {  //search if there exists a duplicated bcurve								
				switch( arrowType){
					case "uni":{
						var numofDel = delete_nonuseedges(_newbcurve.startid,_newbcurve.endid, _newbcurve.type);
						edges.push(_newbcurve); numEdge++; Edgecurrent_IdNUM++;
						var newtangent = generate_tangent(nodes,_newbcurve);
						edges_tangents.push(newtangent);	
						newedgeindex = numEdge-1;
					} 
						break;
					case "bi":{
						var numofDel = delete_nonuseedges(_newbcurve.startid,_newbcurve.endid, _newbcurve.type);
						edges.push(_newbcurve); numEdge++; Edgecurrent_IdNUM++;
						var newtangent = generate_tangent(nodes,_newbcurve);
						edges_tangents.push(newtangent);
						newedgeindex = numEdge-1;
					}
						break;
					default:;
				} //end of switch(){}		
			}// end of if ( found_index >=0){}else {}
		}// end of case 2:
			break;
		case 3:{
			var found_index=lookfor_duplicatedbcurve(nodes,edges,_newbcurve.nodeid,_newbcurve.nodeid, _newbcurve.type);
			if ( found_index >=0 & found_index < edges.length) {//search if there exists a duplicated bcurve	
				//alert("duplicate");//edges[found_index].type = _arrowtype;
				//edges_tangents[found_index]= generate_tangent(nodes,edges[found_index]);
			} else {  //if there is not a duplicated bcurve:							
				edges.push(_newbcurve); numEdge++; Edgecurrent_IdNUM++;
				var newtangent = generate_tangent(nodes,_newbcurve);
				edges_tangents.push(newtangent);	
				newedgeindex = numEdge-1;
			}// end of if ( found_index >=0){}else {}
		}
			break;
		default:;
	} //end of switch(_newbcurve.power)

	//return _newbcurve;
	return newedgeindex;
}

//函数：添加路径: use the rules, (1)判断是否允许添加(2)判断是否自动添加error self-curve，即residual variance
function edge_add(_initialnodeindex, _targetnodeindex, _arrowType){
	//console.log("edge_add()");
	var newedgeindex = -1;
	if (_arrowType === "uni") {// if the _arrowtype is one way Arrow
		//console.log("if (_arrowType ==='uni')");
		if (_initialnodeindex != _targetnodeindex) { //when initial linking node was not the same node as the mouseup node
				//console.log("edge_add()"+" _arrowType === 'uni'" + "& _initialnodeindex != _targetnodeindex");
				if (nodes[_targetnodeindex].type === "triangle" || nodes[_targetnodeindex].type === "diamond") {//triangle or diamond is not allowed to be target 
					//do nothing
				} else if (nodes[_initialnodeindex].type==="diamond" & nodes[_targetnodeindex].type==="hexagon"){//not allow path between diamond and hexagon
					//do nothing
				}else {
					var newbcurve= generate_edge(nodes,nodes[_initialnodeindex].id, nodes[_targetnodeindex].id, _arrowType); //then a new bcurve is generated by startindex and endindex						
					newedgeindex = edge_add_newbcurve(newbcurve);
					
					//to handle the rule for residual variance self-curve/link/path
					if (nodes[_initialnodeindex].type === "triangle" || nodes[_initialnodeindex].type === "diamond") {//if the initial node is triangle or diamond , the target node need not to be add a error term 	
						//do nothing
					} else if(nodes[_targetnodeindex].type === "hexagon"){// if the targetnode is hexagon, a self-curve/link will not added automatically
						
					} else {//auto add a self curve for the target node as its error (residual) 
						var newbcurve3p = generate_bcurve3p(nodes, nodes[_targetnodeindex].id,"bi");
						newbcurve3p.IsAutoGenerated=true;						
						edge_add_newbcurve(newbcurve3p);
					}
					
				} //end of if (nodes[_tartgetnodeindex].type === "triangle" || nodes[_tartgetnodeindex].type === "diamond") {} else {}
			}// end of if (_initialnodeindex != currentindex) when initial linking node was not the same node as the mouseup node
	} else if (_arrowType ==="bi"){ // if the _arrowtype is bi Arrow
		
		if (nodes[_targetnodeindex].type === "diamond" || nodes[_initialnodeindex].type === "diamond") {//diamond is not allowed to have two way arrows path (error term)
			//do nothing
		} else if ( (nodes[_targetnodeindex].type === "triangle" & _targetnodeindex !=_initialnodeindex ) || ( nodes[_initialnodeindex].type === "triangle" & _targetnodeindex !=_initialnodeindex ) ){//triangle is not allowed to be correlated node but could have its own error/ bi-arrow curve
			//do nothing
		} else {//if it is between two different nodes OR for the same node 
				var newbcurve= generate_edge(nodes,nodes[_initialnodeindex].id, nodes[_targetnodeindex].id, _arrowType); //then a new bcurve is generated by startindex and endindex						
				newedgeindex = edge_add_newbcurve(newbcurve); 

		}// end of if (_tartgetnodeindex !=_initialnodeindex){//if it is between two different nodes {} else {}								
	}// end of if (_arrowtype ==="bi")
		
	return newedgeindex;
}

//
function note_add(_Poc,_text){
	Notecurrent_IdNUM++;
	var newnote ={
		id:'note'+Notecurrent_IdNUM
		,x: _Poc.x
		,y: _Poc.y
		,text:_text
		,color:defaultCOLOR
		,fontsize:defaultFONTSIZE
		,selected:false
	};
	notes.push(newnote);
	numnote++;
	return newnote;
}

function note_delete(_noteindex){
	if(_noteindex>=0 & _noteindex<notes.length) {
		notes.splice(_noteindex,1);
		numnote--;
	}
}

function note_copy(_note){
	var newnote=null;
	if (_note===null){		
	} else {
		var tPoc={x:_note.x,y:_note.y};
		newnote=note_add(tPoc,_note.text);
		newnote ={
			id:newnote.id
			,x: _note.x
			,y: _note.y
			,text:_note.text
			,color:_note.color
			,fontsize:_note.fontsize
			,selected:_note.selected
		};
	}
	return newnote;			
}


//函数： to set the handleP hidden
function sethandlePhidden(){
	for (var i=0; i < edges.length; i++){
		edges[i].handlePshow = false;
	}
}

//函数：edit text for node
function node_text_editing0(d,i){
	//var thisnodeG = d3.select("#node"+d.id);
	//thisnodeG.selectAll("text.node").remove();
	//var thisnodeG_Parents = thisnodeG.parentElement;
	var svgGtemp = d3.select("#mysvgG_foreignObject");
	var d3txt = svgGtemp.selectAll("foreignObject")
					.data([d])
					.enter().append("foreignObject")
					.attr("x", d.x + d.rx/2)
					.attr("y", d.y + d.ry)
					.attr("height", "20px")
					.attr("width", "200px")
					.append("xhtml:form")
						.append("xhtml:input")																	
						.attr("id", "txt"+ d.id)
						.attr("style", "width: 190px;")
						.attr("contentEditable", "true")																
						.attr("value", function(d){ this.focus();return d.title;})
						.on("mousedown", function(d){d3.event.stopPropagation(); })
						.on("keydown", function(d){
								d3.event.stopPropagation();
								//console.log("keydown", this, arguments);
								// IE fix
								if (!d3.event)
									d3.event = window.event;												
								switch (d3.event.keyCode){
									// 1. 回车键，除了shift+Enter执行默认换行，其他Enter都是提交
									case 13: 
											// todo: 提交处理	
											if (typeof(d3.event.cancelBubble) !== 'undefined') // IE
											d3.event.cancelBubble = true;
											if (d3.event.stopPropagation) { d3.event.stopPropagation();}
											d3.event.preventDefault(); // 防止换行																						
											var txt = this.value;
											//txt = txt + "\n";
											d.title = txt;
											this.blur(); 																					
										break;
									// 3. 输入键，在原内容基础上加1 (这时文本框的值还未改变)
									default:{}																	
								}
							})
						.on("blur", function(d){
									d.title = d3txt.node().value;
									svgstatus.texting = 0;
									updatesvg();
									d3.select(this.parentElement).remove(); 
									
							});
	return d.title;
}
//函数：edit text for bcurve
function bcurve_text_editing0(d,i){
	var currentindex =i;
	//var thislabel = d3.select("#path"+currentindex);	
	//thislabel.selectAll("text.node").remove();
	//var thisnodeG_Parents = thisnodeG.parentElement;
	var tempG =d3.select("#mysvgG_foreignObject");
	var d3txt = tempG.selectAll("foreignObject")
					.data([d])
					.enter().append("foreignObject")
					.attr("x", d.labelP.x + 20)
					.attr("y", d.labelP.y - 40)
					.attr("height", "20px")
					.attr("width", "200px")
					.append("xhtml:form")
						.append("xhtml:input")																	
						.attr("id", "txt"+d.id)
						.attr("style", "width: 190 px;")
						.attr("contentEditable", "true")																
						.attr("value", function(d){ this.focus();return d.label;})
						.on("mousedown", function(d){d3.event.stopPropagation(); })
						.on("keydown", function(d){
								d3.event.stopPropagation();
								//console.log("keydown", this, arguments);
								// IE fix
								if (!d3.event)
									d3.event = window.event;												
								switch (d3.event.keyCode){
									// 1. 回车键，除了shift+Enter执行默认换行，其他Enter都是提交
									case 13: 
											// todo: 提交处理	
											if (typeof(d3.event.cancelBubble) !== 'undefined') // IE
											d3.event.cancelBubble = true;
											if (d3.event.stopPropagation) { d3.event.stopPropagation();}
											d3.event.preventDefault(); // 防止换行																						
											var txt = this.value;
											//txt = txt + "\n";
											d.label = txt;
											this.blur(); 																					
										break;
									// 3. 输入键，在原内容基础上加1 (这时文本框的值还未改变)
									default:{}																	
								}

							})
						.on("blur", function(d){
									d.label = d3txt.node().value;
									svgstatus.texting = 0;
									updatesvg();
									d3.select(this.parentElement).remove(); 
									
							});			
	return d.label;
}
//函数：edit text for bcurve
function note_text_editing0(d,i){ //console.log("note_text_editing():bedin");
	var currentindex =i; //console.log(notes[i]);
	//var thislabel = d3.select("#path"+currentindex);	
	//thislabel.selectAll("text.node").remove();
	//var thisnodeG_Parents = thisnodeG.parentElement;
	var tempG =d3.select("#mysvgG_foreignObject");
	var d3txt = tempG.selectAll("foreignObject") 
					.data([d])
					.enter().append("foreignObject")
					.attr("x", d.x + 20)
					.attr("y", d.y - 40)
					.attr("height", "20px")
					.attr("width", "200px")
					.append("xhtml:form")
						.append("xhtml:input")																	
						.attr("id", "txt"+d.id)
						.attr("style", "width: 190 px;")
						.attr("contentEditable", "true")																
						.attr("value", function(d){ this.focus();return d.text;})
						.on("mousedown", function(d){d3.event.stopPropagation(); })
						.on("keydown", function(d){ //console.log("on(\'keydown\')");
								d3.event.stopPropagation();
								//console.log("keydown", this, arguments);
								// IE fix
								if (!d3.event)
									d3.event = window.event;												
								switch (d3.event.keyCode){
									// 1. 回车键，除了shift+Enter执行默认换行，其他Enter都是提交
									case 13: 
											// todo: 提交处理	
											if (typeof(d3.event.cancelBubble) !== 'undefined') // IE
											d3.event.cancelBubble = true;
											if (d3.event.stopPropagation) { d3.event.stopPropagation();}
											d3.event.preventDefault(); // 防止换行																						
											var txt = this.value;
											//txt = txt + "\n";
											d.text = txt;
											this.blur(); 																					
										break;
									// 3. 输入键，在原内容基础上加1 (这时文本框的值还未改变)
									default:{}																	
								}

							})
						.on("blur", function(d){//console.log("on(\'blur\')");
									d.text = d3txt.node().value;
									svgstatus.texting = 0;
									updatesvg();
									d3.select(this.parentElement).remove(); 
									
							});			
	return d.text;
}

function node_text_editing(d,i){
	texteditdiaglog('node',d,i);
	updatesvg();
}

function bcurve_text_editing(d,i){
	texteditdiaglog('edge',d,i);
	updatesvg();
}

function note_text_editing(d,i){
	texteditdiaglog('note',d,i);

	updatesvg();
}

// slight update to account for browsers not supporting e.which
//function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };


function texteditdiaglog(_objecttype,d,i){
	var _text;
	switch(_objecttype){
		case 'node': 
			_text=[d][0].title;
		break;
		case 'edge':
			_text=[d][0].label;
		break;
		case 'note':
			_text=[d][0].text;
		break;
	}
	var inputstr=_text;
    var dialog = document.createElement('div'); //*****by yujiao create the DIV this is the dialog for data showing
	dialog.id='edittext';	
	dialog.style.color = 'black';
	
	var content = document.createElement('div');
	content.style="width=230px; height=100px";	
	
    var form = document.createElement('form');//****by yujiao create the Table to show data
	form.id = 'texteditform';
	var input = document.createElement('input');
	input.id='edittextinput';
	input.type = 'text';
    input.name = 'text';															
    input.style="width=200px; height=50px";
	input.contentEditable=true;																
	input.value = _text;
	input.focus();
	var tempvalue=input.value;
	$(input).keydown(function (event){
			//alert("enter key!"+event.keyCode);
			//console.log("input.value:");console.log(input.value);
			//alert(input.value);
			// event = event || window.event;
		//when there is only one input in the form, whether the input type is text or button, presskey ENTER will lead to refreshing the page.
			//		To avoid this thing, we can in the input keydown function , use "return false" if the keyCode is 13 (ENTER)
		if (event.keyCode == 13 || event.witch==13) {	
			//alert("key == ENTER");
			// Do something			
			tempvalue=input.value;
			event.preventDefault();	
			$(button1).click();
			//console.log(event);
			//console.log(window.event);
			return false;
		}	
	} );
	form.appendChild(input);
	/*
	//when there is only one input type=text in the form, to avoid refreshing the page when press ENTER, we can also add another hidden input element in this form:
	var input2= document.createElement('input');
	input2.type= 'text';
	input2.style='display:none';
	form.appendChild(input2);
	*/
	content.appendChild(form);////****by yujiao: append the table actually to the new dialog	
	

	//****by yujiao: begin the buttons creating:
    var button1 = document.createElement('button');
    button1.innerHTML = 'OK';
	//button1.class='';
	button1.id="dialogbuton1";
	$(button1).click(function () { //alert("button1.click()");
		if (_text != input.value){
			switch(_objecttype){
				case 'node': 
					[d][0].title= input.value;
				break;
				case 'edge':
					[d][0].label= input.value; [d][0].labelInitial=false;
				break;
				case 'note':
					[d][0].text= input.value;
				break;
			}			
		}
		$(dialog).dialog('close');
		updatesvg();
    });
	content.appendChild(button1);
	
	
	var button2 = document.createElement('button');
    button2.innerHTML = 'Cancel';
	button2.id="dialogbuton2";
	button2.styles="margin-left:2px";
    $(button2).click(function () {
        $(dialog).dialog('close');
    });
	content.appendChild(button2);
	
    dialog.appendChild(content); //************by yujiao: actually append the content to the new dialog	
	

	//******by yujiao: end the buttons creating and appending	
	//******by yujiao: show the data dialog:
    //show dialog
    $(dialog).dialog({
        modal: true,
        title: 'Edit Text',
        width: "230",
        height: '130',
	    bgiframe: true,
        closeOnEscape: true,
        draggable: true,
        resizable: true
    });

}