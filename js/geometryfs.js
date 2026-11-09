/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         * 
 ***************************************************/
function interP_2lines(coefA1, coefB1, constC1, coefA2, coefB2, constC2) {
    var determinant = coefA1 * coefB2 - coefA2 * coefB1;
    if (0 === determinant) return {
        numsolution: 0,
        interP: {}
    };
    var intersectX = (coefB1 * constC2 - constC1 * coefB2) / determinant;
    var intersectY = (coefA2 * constC1 - coefA1 * constC2) / determinant;
    return {
        numsolution: 1,
        interP: {
            x: intersectX,
            y: intersectY
        }
    };
}

function calculate_theta(startPoint, endPoint) {
    var deltaX = endPoint.x - startPoint.x;
    var deltaY = endPoint.y - startPoint.y;
    var referenceAngle = Math.atan(Math.abs(deltaY) / Math.abs(deltaX));
    if (deltaX >= 0 && deltaY >= 0) return referenceAngle;
    if (deltaX < 0 && deltaY >= 0) return Math.PI - referenceAngle;
    if (deltaX < 0 && deltaY < 0) return Math.PI + referenceAngle;
    return 2 * Math.PI - referenceAngle;
}

// Sets the global `temp` to the SVG points string of the shape, then returns the vertices.
function generatePointsForTriangle(centerX, centerY, halfSide, apexHeight) {
    var leftVertex = {
        x: centerX - halfSide * Math.sqrt(3) / 2,
        y: centerY + halfSide / 2
    };
    var rightVertex = {
        x: centerX + halfSide * Math.sqrt(3) / 2,
        y: centerY + halfSide / 2
    };
    var apexVertex = {
        x: centerX,
        y: centerY - apexHeight
    };
    temp = leftVertex.x + "," + leftVertex.y + " " + rightVertex.x + "," + rightVertex.y + " " + apexVertex.x + "," + apexVertex.y + " " + leftVertex.x + "," + leftVertex.y;
    return {
        p1: leftVertex,
        p2: rightVertex,
        p3: apexVertex
    };
}

// Sets the global `temp` to the SVG points string of the shape, then returns the vertices.
function generatePointsForDiamond(centerX, centerY, halfWidth, halfHeight) {
    var leftVertex = {
        x: centerX - halfWidth,
        y: centerY
    };
    var topVertex = {
        x: centerX,
        y: centerY - halfHeight
    };
    var rightVertex = {
        x: centerX + halfWidth,
        y: centerY
    };
    var bottomVertex = {
        x: centerX,
        y: centerY + halfHeight
    };
    temp = leftVertex.x + "," + leftVertex.y + " " + topVertex.x + "," + topVertex.y + " " + rightVertex.x + "," + rightVertex.y + " " + bottomVertex.x + "," + bottomVertex.y + " " + leftVertex.x + "," + leftVertex.y;
    return {
        p1: leftVertex,
        p2: topVertex,
        p3: rightVertex,
        p4: bottomVertex
    };
}

// Sets the global `temp` to the SVG points string of the shape, then returns the vertices.
function generatePointsForHexagon(centerX, centerY, halfWidth, halfHeight) {
    var verticalOffset = halfHeight * Math.sqrt(3) / 2;
    var leftVertex = {
        x: centerX - halfWidth,
        y: centerY
    };
    var upperLeftVertex = {
        x: centerX - halfWidth / 2,
        y: centerY - verticalOffset
    };
    var upperRightVertex = {
        x: centerX + halfWidth / 2,
        y: centerY - verticalOffset
    };
    var rightVertex = {
        x: centerX + halfWidth,
        y: centerY
    };
    var lowerRightVertex = {
        x: centerX + halfWidth / 2,
        y: centerY + verticalOffset
    };
    var lowerLeftVertex = {
        x: centerX - halfWidth / 2,
        y: centerY + verticalOffset
    };
    temp = leftVertex.x + "," + leftVertex.y + " " + upperLeftVertex.x + "," + upperLeftVertex.y + " " + upperRightVertex.x + "," + upperRightVertex.y + " " + rightVertex.x + "," + rightVertex.y + " " + lowerRightVertex.x + "," + lowerRightVertex.y + " " + lowerLeftVertex.x + "," + lowerLeftVertex.y + " " + leftVertex.x + "," + leftVertex.y;
    return {
        p1: leftVertex,
        p2: upperLeftVertex,
        p3: upperRightVertex,
        p4: rightVertex,
        p5: lowerRightVertex,
        p6: lowerLeftVertex
    };
}

// Angles at the two end points of the segment and at the apex, plus the apex side.
// Angle_P1 keeps its default (pi/2) when the foot of the altitude cannot be found.
function calculate_angles_of_triangle(firstPoint, apexPoint, secondPoint) {
    var angleAtFirstPoint = .25 * Math.PI;
    var angleAtSecondPoint = .25 * Math.PI;
    var angleAtApex = .5 * Math.PI;
    var isSuccess = false;
    var isAnticlockwise = true;
    var segment = {
        P1: firstPoint,
        P2: secondPoint
    };
    var baseLine = {};
    var altitudeLine = {};
    var footPoint = {};
    if (segment.P2.x === segment.P1.x) {
        baseLine = {
            A: 1,
            B: 0,
            C: -segment.P1.x
        };
        altitudeLine = {
            A: 0,
            B: 1,
            C: -apexPoint.y
        };
    } else {
        var baseSlope = (segment.P2.y - segment.P1.y) / (segment.P2.x - segment.P1.x);
        baseLine = {
            A: baseSlope,
            B: -1,
            C: segment.P1.y - baseSlope * segment.P1.x
        };
        var altitudeAngle = Math.atan(baseSlope) - 1 * Math.PI / 2;
        var altitudeSlope = Math.tan(altitudeAngle);
        altitudeLine = {
            A: altitudeSlope,
            B: -1,
            C: apexPoint.y - altitudeSlope * apexPoint.x
        };
    }
    var intersection = interP_2lines(baseLine.A, baseLine.B, baseLine.C, altitudeLine.A, altitudeLine.B, altitudeLine.C);
    if (1 === intersection.numsolution) {
        isSuccess = true;
        footPoint = intersection.interP;
        var distApexToFoot = Math.sqrt((footPoint.x - apexPoint.x) * (footPoint.x - apexPoint.x) + (footPoint.y - apexPoint.y) * (footPoint.y - apexPoint.y));
        var distFirstToFoot = Math.sqrt((footPoint.x - firstPoint.x) * (footPoint.x - firstPoint.x) + (footPoint.y - firstPoint.y) * (footPoint.y - firstPoint.y));
        var distSecondToFoot = Math.sqrt((footPoint.x - secondPoint.x) * (footPoint.x - secondPoint.x) + (footPoint.y - secondPoint.y) * (footPoint.y - secondPoint.y));
        if (firstPoint.x === secondPoint.x) {
            // Vertical segment: compare along y.
            if (footPoint.y === firstPoint.y) {
                angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                angleAtSecondPoint = Math.PI / 2;
            } else if (footPoint.y === secondPoint.y) {
                angleAtFirstPoint = Math.PI / 2;
                angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
            } else if (footPoint.y > firstPoint.y && footPoint.y < secondPoint.y || footPoint.y > secondPoint.y && footPoint.y < firstPoint.y) {
                angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
            } else if (secondPoint.y >= firstPoint.y) {
                if (footPoint.y < firstPoint.y) {
                    angleAtFirstPoint = Math.PI - Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
                } else {
                    angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.PI - Math.atan(distApexToFoot / distSecondToFoot);
                }
            } else {
                if (footPoint.y > firstPoint.y) {
                    angleAtFirstPoint = Math.PI - Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
                } else {
                    angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.PI - Math.atan(distApexToFoot / distSecondToFoot);
                }
            }
            isAnticlockwise = secondPoint.y <= firstPoint.y ? apexPoint.x >= footPoint.x : apexPoint.x <= footPoint.x;
        } else {
            // Non-vertical segment: compare along x.
            if (footPoint.x === firstPoint.x) {
                angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                angleAtSecondPoint = Math.PI / 2;
            } else if (footPoint.x === secondPoint.x) {
                angleAtFirstPoint = Math.PI / 2;
                angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
            } else if (footPoint.x > firstPoint.x && footPoint.x < secondPoint.x || footPoint.x > secondPoint.x && footPoint.x < firstPoint.x) {
                angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
            } else if (secondPoint.x >= firstPoint.x) {
                if (footPoint.x < firstPoint.x) {
                    angleAtFirstPoint = Math.PI - Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
                } else {
                    angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.PI - Math.atan(distApexToFoot / distSecondToFoot);
                }
            } else {
                if (footPoint.x > firstPoint.x) {
                    angleAtFirstPoint = Math.PI - Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.atan(distApexToFoot / distSecondToFoot);
                } else {
                    angleAtFirstPoint = Math.atan(distApexToFoot / distFirstToFoot);
                    angleAtSecondPoint = Math.PI - Math.atan(distApexToFoot / distSecondToFoot);
                }
            }
            isAnticlockwise = secondPoint.x >= firstPoint.x ? apexPoint.y >= footPoint.y : apexPoint.y <= footPoint.y;
        }
        angleAtApex = Math.PI - angleAtFirstPoint - angleAtSecondPoint;
    }
    return {
        Is_success: isSuccess,
        angle_P0: angleAtFirstPoint,
        angle_P2: angleAtSecondPoint,
        angle_P1: angleAtApex,
        angle_anticlockwise: isAnticlockwise
    };
}
