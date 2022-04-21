/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *     
 ***************************************************/

//函数： 求两直线交点
function interP_2lines(A1,B1,C1,A2,B2,C2){//A B C can not be all zero
	var delta = A1*B2 - A2*B1;
	if(delta ===0 ) {
		return {numsolution:0, interP:{}};
	} else { 
		var x0 = (B1*C2 - C1*B2)/(A1*B2 - A2*B1);
		var y0 = (A2*C1 - A1*C2)/(A1*B2 - A2*B1);
		return {numsolution:1, interP:{x:x0, y:y0}};
	}
}

//函数：计算某点与中心点的单位圆夹角（主轴与x轴平行）[0, 2*PI]
function calculate_theta(_centerP, _targetP){
	var newtheta = 0;
	var deltax = _targetP.x - _centerP.x;
	var deltay = _targetP.y - _centerP.y;
	var absdeltax = Math.abs(deltax);
	var absdeltay = Math.abs(deltay);
	var ttheta = Math.atan(absdeltay / absdeltax);//用绝对值
	if (deltax >=0 & deltay >=0){
		newtheta = ttheta;
	} else if (deltax < 0 & deltay >= 0){
		newtheta = Math.PI - ttheta;					
	} else if (deltax < 0 & deltay < 0) {
		newtheta = Math.PI + ttheta;
	} else {
		newtheta = 2 * Math.PI - ttheta;
	}
	//console.log("centerP");console.log(_centerP);
	//	console.log("targetP");console.log(_targetP);
			//console.log("newtheta");console.log(newtheta);
	
	
	return newtheta;
}

//函数：
function generatePointsForTriangle(_x,_y,_rx,_ry){
	var p1 = { x: _x - _rx*Math.sqrt(3)/2, y: _y+_rx/2 };
	var p2 = { x: _x + _rx*Math.sqrt(3)/2, y: _y+_rx/2 };
	var p3 = { x: _x, y: _y - _ry};
	temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p1.x+","+p1.y;
	return {p1:p1,p2:p2,p3:p3};
}
function generatePointsForDiamond(_x,_y,_rx,_ry){
	var p1 = { x: _x - _rx, y: _y };
	var p2 = { x: _x,        y: _y - _ry };
	var p3 = { x: _x + _rx, y: _y };
	var p4 = { x: _x,        y: _y + _ry};
	temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p4.x+","+p4.y +" "+p1.x+","+p1.y;
	return {p1:p1,p2:p2,p3:p3,p4:p4};
}
function generatePointsForHexagon(_x,_y,_rx,_ry){
	var p1 = { x: _x - _rx,		y: _y };
	var p2 = { x: _x - _rx /2,	y: _y - _ry * Math.sqrt(3)/2};
	var p3 = { x: _x + _rx /2,	y: _y - _ry * Math.sqrt(3)/2};
	var p4 = { x: _x + _rx,       y: _y };
	var p5 = { x: _x + _rx /2,	y: _y + _ry * Math.sqrt(3)/2};
	var p6 = { x: _x - _rx /2,	y: _y + _ry * Math.sqrt(3)/2};
	temp = p1.x+","+p1.y+" "+p2.x+","+p2.y+" "+p3.x+","+p3.y +" "+p4.x+","+p4.y +" "+p5.x+","+p5.y +" "+p6.x+","+p6.y +" "+p1.x+","+p1.y;
	return {p1:p1,p2:p2,p3:p3,p4:p4,p5:p5,p6:p6};
}

//函数：根据三角形三顶点求三角形的三个内角 (0,PI)
function calculate_angles_of_triangle(P0, P1, P2){
	var angle_P0 = 1/4*Math.PI;//set default  angle for P0
	var angle_P2 = 1/4* Math.PI;//set default  angle for P2
	var angle_P1 = 1/2*Math.PI;
	var angle_anticlockwise = true;// P1 locate up-right to the line_P0_P2, anticlockwise for P0 but clockwise for P2 
	var Is_success = false; 
	var line1 = {P1: P0, P2: P2}; //these are the startP and endP of one power2 bcurve, that is the line1 of the triangle
	var line2 = {P1: P0, P2: P1}; //
	var line3 = {P1: P1, P2: P2};
	var EQ_line1 = {};
	var EQ_v_line ={};
	var interP = {};
	if(line1.P2.x === line1.P1.x){//parallel to x axis , then no slope
		EQ_line1 ={A: 1, B: 0, C: - line1.P1.x};
		EQ_v_line = {A: 0, B: 1, C: - P1.y};		
	} else {
		var slope1 = (line1.P2.y - line1.P1.y )/(line1.P2.x - line1.P1.x);
		EQ_line1 ={A: slope1, B: -1, C: line1.P1.y - slope1 * line1.P1.x};
		var v_theta = Math.atan(slope1) - Math.PI*1/2;//vertical_to_line1_theta
		var v_slope = Math.tan(v_theta);//vertical_to_line1_line_slope , this line goes through the P1 point
		EQ_v_line = {A: v_slope, B: -1, C: P1.y - v_slope * P1.x};//vertical_to_line1_P1_line  y=y0 + v_slope * (x-x0)
	}
	var temp = interP_2lines(EQ_line1.A, EQ_line1.B, EQ_line1.C, EQ_v_line.A, EQ_v_line.B, EQ_v_line.C);//to find the interP in order to calculate the height of the triangle
	if(temp.numsolution ===1) {
		Is_success=true;
		interP =  temp.interP; //console.log("interP");console.log(interP);
	
		//console.log("angle_anticlockwise");console.log(angle_anticlockwise);	
		var dis_P1_interP = Math.sqrt((interP.x-P1.x)*(interP.x-P1.x)+(interP.y - P1.y)*(interP.y - P1.y));  //console.log("dis_P1_interP " +dis_P1_interP);
		var dis_P0_interP = Math.sqrt((interP.x-P0.x)*(interP.x-P0.x)+(interP.y - P0.y)*(interP.y - P0.y)); // console.log("dis_P0_interP " +dis_P0_interP);
		var dis_P2_interP = Math.sqrt((interP.x-P2.x)*(interP.x-P2.x)+(interP.y - P2.y)*(interP.y - P2.y));  //console.log("dis_P2_interP " +dis_P2_interP);
		if (P0.x === P2.x){//handle the vertical condition,that is when the line1 of the triangle is parallel to the y-axis
			if ( interP.y === P0.y ){// Math.PI/2 angle for P0
				// Math.PI/2 for P2
					angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
					angle_P2 = Math.PI/2;
			} else if (interP.y === P2.y ) {// Math.PI/2 for P2
					angle_P0 = Math.PI/2;
					angle_P2 =  Math.atan(dis_P1_interP/dis_P2_interP);
			} else if ((interP.y > P0.y & interP.y < P2.y) || (interP.y > P2.y & interP.y < P0.y) ){//acute angles for the P0 and P2
					angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
					angle_P2 =  Math.atan(dis_P1_interP/dis_P2_interP);		
			} else {//obtuse angle for the P0 or P2 , that is line1
				//console.log("obtsuse angle");
				if (P2.y >= P0.y){//P2 located on the positive side of P0
					if (interP.y < P0.y){//obtuse angle for the P0
						angle_P0 = Math.PI - Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.atan(dis_P1_interP/dis_P2_interP);
					} else {//(interP.x > P2.x) obtuse angle for the P2 
						angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.PI -  Math.atan(dis_P1_interP/dis_P2_interP);
					}
				} else {//if (P2.x < P0.x) , P2 located on the negative side of P0
					if (interP.y > P0.y){//obtuse angle for the P0
						angle_P0 = Math.PI - Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.atan(dis_P1_interP/dis_P2_interP);
					} else {//(interP.x < P2.x) obtuse angle for the P2 
						angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.PI -  Math.atan(dis_P1_interP/dis_P2_interP);
					}			
				}	
			}//end of if else group		1	
			if(P2.y <= P0.y){
				if (P1.x >= interP.x){ 
					angle_anticlockwise = true;
				} else {
					angle_anticlockwise = false;
				}
				
			} else {//(P2.y > P0.y)
				if(P1.x <= interP.x){ 
					angle_anticlockwise = true;
				} else {
					angle_anticlockwise = false;
				}				
			}
			
		} else {//handle the none horizon condition,that is when the line1 of the triangle is not parallel to the x-axis
			if ( interP.x === P0.x ){// Math.PI/2 angle for P0
				// Math.PI/2 for P2
					angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
					angle_P2 = Math.PI/2;
			} else if (interP.x === P2.x ) {// Math.PI/2 for P2
					angle_P0 = Math.PI/2;
					angle_P2 =  Math.atan(dis_P1_interP/dis_P2_interP);
			} else if ((interP.x > P0.x & interP.x < P2.x) || (interP.x > P2.x & interP.x < P0.x) ){//acute angles for the P0 and P2
					angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
					angle_P2 =  Math.atan(dis_P1_interP/dis_P2_interP);		
			} else {//obtuse angle for the P0 or P2 , that is line1
				//console.log("obtsuse angle");
				if (P2.x >= P0.x){//P2 located on the positive side of P0
					if (interP.x < P0.x){//obtuse angle for the P0
						angle_P0 = Math.PI - Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.atan(dis_P1_interP/dis_P2_interP);
					} else {//(interP.x > P2.x) obtuse angle for the P2 
						angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.PI -  Math.atan(dis_P1_interP/dis_P2_interP);
					}
				} else {//if (P2.x < P0.x) , P2 located on the negative side of P0
					if (interP.x > P0.x){//obtuse angle for the P0
						angle_P0 = Math.PI - Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.atan(dis_P1_interP/dis_P2_interP);
					} else {//(interP.x < P2.x) obtuse angle for the P2 
						angle_P0 = Math.atan(dis_P1_interP/dis_P0_interP);
						angle_P2 = Math.PI -  Math.atan(dis_P1_interP/dis_P2_interP);
					}			
				}			
			}//end of if else group
			
			if(P2.x >= P0.x){
				if (P1.y >= interP.y){ 
					angle_anticlockwise = true;
				} else {
					angle_anticlockwise = false;
				}
				
			} else {//(P2.x > P0.x)
				if (P1.y <= interP.y){ 
					angle_anticlockwise = true;
				} else {
					angle_anticlockwise = false;
				}				
			}
		}
		angle_P1 = Math.PI -angle_P0-angle_P2;
		
	}
	return {Is_success:Is_success, angle_P0:angle_P0, angle_P2:angle_P2, angle_P1: angle_P1, angle_anticlockwise:angle_anticlockwise};
}