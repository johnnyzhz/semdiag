/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *     
 ***************************************************/

var default_RADIUSH=30;//the default radium for the nodes 
var default_RADIUSV=30;//the default radium for the nodes
var nodeInitialPos = {x: default_RADIUSH*3, y:default_RADIUSV*3};
var default_selfcurve_LR = default_RADIUSH * 2.7/2;//the size for self linking path
var newr_DISCOUNT =  20/100 ; //the track for the self linking path
var cPr = 3;//the size of control Points
var selfpathANGLE_default = 0.9/4 * Math.PI;//the shape for self linking bcurve3p /path
var selfpathTHETA_default = 7/4 * Math.PI;//the initial position for self linking bcurve3p/path
var defaultFONTSIZE = 12;//pt
var default_strokeWIDTH=1;//px
var defaultFillCOLOR ="WHITE";
var activatedCOLOR = "#FF1493"; // active
var backgroundCOLOR = "WHITE";
var defaultCOLOR = "BLACK";
var COLORlist=["BLACK","RED","BLUE","GREEN"];
var linkingtoArrowTYPE = "uni";//or "bi"
var linkingtoLineType = "straight";//or "bending"
var Nt = 1000;//bcurve t for loop, sample size, also indicate the density 
var sc_rp = 1000;//in general, expect this is the max length of the bcurve;


var diagName='';//current file name
var PDfileName = '';//current diagram file name
var PDOUTfileName ='';//current out put diagram name
//initial / define the global vars /data of the chart
var nodes=[	];  //节点数据
var edges = [ ];		//B曲线数据,即节点间的关系数据
var edges_tangents = [ ]; //B曲线与其两端节点周边交点切线数据
var notes=[ ];//文本框数据
var numRec=0;
var numElli=0;
var numHexagon=0;//六边形
var numTri=0;
var numDiamond=0;//棱形
var	numNode=0;//the number of nodes
var numEdge=0;//the number of edges
var numnote=0;
var Nodecurrent_IdNUM=0;//mark the unique id num for each new node 
var Elli_current_TitleNUM=0;//mark the title num for generate title of ellipses
var Rec_current_TitleNUM=0;//mark the title num for generate title of rectangles
var Hexagon_current_TitleNUM=0;//mark the title num for generate title of hexagons
var Edgecurrent_IdNUM=0;//mark the unique id num for each new edge
var Notecurrent_IdNUM=0;//mark the unique id num for each new edge
var theTriangle = null;//node id/index of the only one triangle in this chart
var theDiamond = null;//node id/index ofthe only one diamond in this chart
var ellipsenodes;//the template data of elli kind of nodes 
var rectnodes;//the template data of rect kind of nodes 
var trianglenodes;
var diamondnodes;
var hexagonnodes;
var w =1500;//The width of the chart
var h =1500;//the height of the chart

//to mark down the status in order to choose appropriate action
var svgstatus ={
		svgondragged:0,
		nodeondragged:0,
		nodeselected:0,
		edgeselected:0,
		labelselected:0,
		noteselected:0,
		linkingto:0,
		texting:0,
		multipleselecting:0,
		multidraging:0,
		IsShowLabels:true,
		IsShowGrid:true
	}
//mark the selected object
var svgdragline = {x0:0, y0:0, x1:0, y1:0};
var multipleselectframe = {x:0,y:0,width:0,height:0};
var predraggedindex = -1;
var justmousedownnodeindex = -1;
var justmousedownedgeindex = -1;
var justmousedownnoteindex=-1;
var linkinginitialindex = -1;
var linkingtargetindex = -1;
var mouseLastclickOBJETid;
var mouseCurrentclickOBJETid
var mouseLastclicktime;//mark down the time in order to decide if it is double click
var mouseCurrentclicktime;//mark down the time in order to decide if it is double click
var selectednodeindex = -1; 
var selectededgeindex = -1;
var selectednoteindex = -1;
var selectednodeindexes = [];//multiple selected
var selectededgeindexes = [];//multiple selected
var selectednoteindexes = [];//multiple selected 
var selcetedBTNID="";

//append svg:g  as container for the SEM graph	
var mysvgG;
var mysvgG_foreignObject;
var pathGs;
var handleGs;
var nodeGs;
var ellipseGs;
var rectGs;
var triangleGs;
var diamondGs;
var hexagonGs;	
var paths; //svg路径对象
var handlePs; //svg圆形调节点对象
var labelTs; //svg 标签文本对象
var ellipses;//svg 椭圆对象
var rects; //svg矩形对象
var triangles;
var diamonds;
var hexagons;
var nodetexts;
var noteTs;//svg free文本对象