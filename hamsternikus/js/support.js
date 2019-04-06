intersectRectCircle = function(rectX, rectY, rectW, rectH, cirX, cirY, cirR) {
	/*var report = false;
	var RReport = false;
	var LReport = false;
	var TReport = false;
	var BReport = false;

	if ((rectX+rectW)>(cirX-cirR)) RReport = true;
	if (rectX<(cirX+cirR)) LReport = true;
	if (rectY<(cirY+cirR)) TReport = true;
	if ((rectY+rectH)>(cirY-cirR)) BReport=true;*/
	//return true;

	var borders= [];
	//construc rect vectors
	var leftBorder = [new Phaser.Point(rectX, rectY), new Phaser.Point(0, rectH)];
	borders.push(leftBorder);
	var bottomBorder = [new Phaser.Point(rectX, rectY+rectH), new Phaser.Point(rectW, 0)];
	borders.push(bottomBorder);
	var rightBorder = [new Phaser.Point(rectX+rectW, rectY+rectH), new Phaser.Point(0, -rectH)];
	borders.push(rightBorder);
	var topBorder = [new Phaser.Point(rectX+rectW, rectY), new Phaser.Point(-rectW, 0)];
	borders.push(topBorder);
	for (var b in borders) {
		var bStart = borders[b][0];
		var bEnd = borders[b][1];
		var circleC = new Phaser.Point(cirX, cirY);
		/*if (bEnd.y === 0) {
			if (bEnd.x>0) {
				report = BReport;
			} else {
				report = TReport;
			}
		} else {
			if (bEnd.y > 0){
				report = LReport;
			} else {
				report = RReport;
			}
		}
		console.log(report);*/
		if (intersectSegCircle(bStart, bEnd, circleC, cirR)[0]) {
			//console.log('true in intersection');
			return [true, bEnd];
		}
	}	
	return [false, null];
};

intersectCircleCircle = function(cir1X, cir1Y, cir1R, cir2X, cir2Y, cir2R) {
	var center1 = new Phaser.Point(cir1X, cir1Y);
	var center2 = new Phaser.Point(cir2X, cir2Y);
	var connection = Phaser.Point.subtract(center2, center1);
	if (connection.getMagnitude() >= cir1R + cir2R) {
		return {result: false, intPoint: null};
	}
	var intersection = Phaser.Point.add(center1, connection.setMagnitude(cir1R));
	return {result: true, intPoint: intersection};
}

intersectRectCircleSk = function(vertices, cirX, cirY, cirR, report) {
	if (!report) {
		report = 0;
	}
	var borders= generateSegments(vertices);
	for (var b in borders) {
		var bStart = borders[b][0];
		var bEnd = borders[b][1];
		var circleC = new Phaser.Point(cirX, cirY);
		var interResult = intersectSegCircle(bStart, bEnd, circleC, cirR, report);
		if (interResult.result) {
			if (report) {
				console.log(interResult);
			}
			return interResult;
		}
	}	
	return {result: false, intPoint: null};
};

intersectRectRect = function(rect1X, rect1Y, rect1W, rect1H, rect2X, rect2Y, rect2W, rect2H) {
	if (rect1X+rect1W<=rect2X) return false;
	if (rect1X>=rect2X+rect2W) return false;
	if (rect1Y>=rect2Y+rect2H) return false;
	if (rect1Y+rect1H<=rect2Y) return false;
	return true;
};

intersectRectRectSk = function(vertices1, vertices2) {
	var segments1 = generateSegments(vertices1);
	var segments2 = generateSegments(vertices2);
	for (var s1 in segments1) {
		for (var s2 in segments2) {
			//console.log('check seg seg');
			var segSegIntersection = intersectSegSeg(segments1[s1][0], segments1[s1][1], segments2[s2][0], segments2[s2][1]);
			if (segSegIntersection.result) return {result: true, intPoint: segSegIntersection.intPoint};
		}
	}
	//console.log(segments1);
	//console.log(segments2);
	return {result: false, intPoint: null};
};

intersectSegRectSk = function(segment, vertices) {
	var vSegments = generateSegments(vertices);
	for (s in vSegments) {
		if (intersectSegSeg(segment[0], segment[1], vSegments[s][0], vSegments[s][1]).result) return {result: true, intPoint: vSegments[s][1]};
	}
	return {result: false, intPoint: null};
};

intersectSegRectSkwp = function(segment, vertices) {
	var vSegments = generateSegments(vertices);
	for (s in vSegments) {
		var intersectionResult = intersectSegSeg(segment[0], segment[1], vSegments[s][0], vSegments[s][1]);
		if (intersectionResult.result) return {result: true, intPoint: intersectionResult.intPoint};
	}
	return {result: false, intPoint: null};
};

generateSegments = function(vertices) {
	var segments = [];
	for (var v in vertices) {
		if (Number(v)<vertices.length-1) {
			var segment = [vertices[v], Phaser.Point.subtract(vertices[Number(v)+1], vertices[v])]	
		} else {
			var segment = [vertices[v], Phaser.Point.subtract(vertices[0], vertices[v])]
		}
		segments.push(segment);
	}
	//console.log(segments);
	return segments;
};

intersectSegCircle = function(start, end, circleCenter, radius, report) {
	if (!report) {
		report = false;
	}
	var vecNormal = Phaser.Point.normalRightHand(end).normalize();
	//get vector with length of radius and normal to segment
	//take two variants depending on where to vector points
	var circleEndRight = Phaser.Point.multiply(vecNormal, new Phaser.Point(radius, radius));
	var circleEndLeft = Phaser.Point.multiply(vecNormal, new Phaser.Point(-radius, -radius));	
	//check by distance to corners
	var startCorner = Phaser.Point.subtract(start, circleCenter);
	var endCorner = Phaser.Point.subtract(Phaser.Point.add(start, end), circleCenter);
	if (startCorner.getMagnitude()<=radius) {
		if (report) {
			console.log('distance to start corner');
		}
		return {result: true, intPoint: start};
	}
	if (endCorner.getMagnitude()<=radius) {
		if (report) {
			console.log('distance to end corner');
		}
		return {result: true, intPoint: Phaser.Point.add(start, end)};
	}
	//check by intersection
	//var res = intersectSegSeg(start, end, circleCenter, circleEndRight)[0] || 
	//	intersectSegSeg(start, end, circleCenter, circleEndLeft)[0];
	//if (res) {
	//	console.log(start);
	//	console.log(end);
	//}
	if (intersectSegSeg(start, end, circleCenter, circleEndRight, report).result) {
		if (report) {
			console.log('segments intersection rigth');
		}
		return intersectSegSeg(start, end, circleCenter, circleEndRight);
	}

	if (intersectSegSeg(start, end, circleCenter, circleEndLeft, report).result) {
		if (report) {
			console.log('segments intersection left');
		}
		return intersectSegSeg(start, end, circleCenter, circleEndLeft);
	}

	if (report) {
		var centerVec = Phaser.Point.subtract(circleCenter, start);
		var projection = Phaser.Point.project(centerVec, end);
		var normalVec = Phaser.Point.subtract(centerVec, projection);
		console.log('circle center '+circleCenter);
		console.log('center vec '+centerVec);
		console.log('projection '+projection);
		console.log('normal vec '+normalVec);
		console.log('from center to segment '+normalVec.getMagnitude());
	}

	return {result: false, intPoint: null};
};

calculateBounceVel = function(vel, surface, bounceCoeff) {
	var velSurfProj = Phaser.Point.project(vel, surface);
	var velSurfNorm = Phaser.Point.subtract(vel, velSurfProj);
	velSurfNorm = velSurfNorm.multiply(-bounceCoeff, -bounceCoeff);
	return Phaser.Point.add(velSurfProj, velSurfNorm);
};

intersectSegSeg = function(start1, end1, start2, end2, report) {
	if (!report) {
		report = false;
	}
	/*var noBoundsRes = intersectVecVec(start1, end1, start2, end2);
	if (noBoundsRes.result) {
		var intPoint = noBoundsRes.intPoint;
		if (checkInBounds(start1, Phaser.Point.add(start1, end1), intPoint) && 
			checkInBounds(start2, Phaser.Point.add(start2, end2), intPoint)){
			if (report) {
				console.log('from seg seg');
				console.log(start1);
				console.log(end1);
				console.log(start2);
				console.log(end2);
				console.log(noBoundsRes);	
			}			
			return noBoundsRes;
		}
	}
	return {result: false, intPoint: null};*/
	var intPoint = Phaser.Line.intersectsPoints(start1, Phaser.Point.add(start1, end1), start2, Phaser.Point.add(start2, end2));
	if (intPoint) {
		return {result: true, intPoint: intPoint};
	}

	return {result: false, intPoint: null};
};

checkInBounds = function(b1, b2, point) {
	var rb1 = new Phaser.Point(Math.round(b1.x), Math.round(b1.y));
	var rb2 = new Phaser.Point(Math.round(b2.x), Math.round(b2.y));
	var rPoint = new Phaser.Point(Math.round(point.x), Math.round(point.y));
	var tl = new Phaser.Point(Math.min(rb1.x, rb2.x), Math.min(rb1.y, rb2.y));
	var br = new Phaser.Point(Math.max(rb1.x, rb2.x), Math.max(rb1.y, rb2.y));
	if (rPoint.x>=tl.x-1 && rPoint.x<=br.x+1 && rPoint.y>=tl.y-1 && rPoint.y<=br.y+1) {
	//if (rPoint.x>=tl.x && rPoint.x<=br.x && rPoint.y>=tl.y && rPoint.y<=br.y) {
		return true;
	}
	return false; 
};

intersectVecVec = function(start1, end1, start2, end2){
	var v1Norm = Phaser.Point.normalRightHand(end1);
	var v2Norm = Phaser.Point.normalRightHand(end2);
	var aMatrix = [v1Norm.x, v1Norm.y, v2Norm.x, v2Norm.y];
	var bCol = [v1Norm.dot(start1), v2Norm.dot(start2)];
	if (deter(aMatrix)!= 0) {
		var invMatrix = inverseMatrix(aMatrix);	
	} else {
		return {result: false, intPoint: null};
	}
	var interPoint = multiplyMatCol(invMatrix, bCol);
	return {result: true, intPoint: interPoint};
};

deter = function(matrix){
	return matrix[0]*matrix[3] - matrix[1]*matrix[2];
};

inverseMatrix = function(matrix) {
	var determinant = deter(matrix);
	var iMatrix = [matrix[3]/determinant, -matrix[1]/determinant, -matrix[2]/determinant, matrix[0]/determinant];
	return iMatrix;
};

multiplyMatCol = function(matrix, column){
	var a1 = matrix[0]*column[0] + matrix[1]*column[1];
	var a2 = matrix[2]*column[0] + matrix[3]*column[1];
	return new Phaser.Point(a1, a2);
};

distanceSegPoint = function(start, end, point) {
	//console.log(start);
	//console.log(end);
	//console.log(point);

	var centeredPoint = Phaser.Point.subtract(point, start);
	var centeredEnd = Phaser.Point.subtract(end, start);

	var segProjection = Phaser.Point.project(centeredPoint, centeredEnd);
	var normalPoint = Phaser.Point.subtract(centeredPoint, segProjection);

	return normalPoint.getMagnitude();
};

intersectVecRect = function(startVec, endVec, rectX, rectY, rectWidth, rectHeight) {
	//console.log('intersect called');
	var intersectionPoint = null;
	var borders = [];
	var moveVec = [startVec, endVec];
	//construc rect vectors
	var leftBorder = [new Phaser.Point(rectX, rectY), new Phaser.Point(0, rectHeight)];
	borders.push(leftBorder);
	var bottomBorder = [new Phaser.Point(rectX, rectY+rectHeight), new Phaser.Point(rectWidth, 0)];
	borders.push(bottomBorder);
	var rightBorder = [new Phaser.Point(rectX+rectWidth, rectY+rectHeight), new Phaser.Point(0, -rectHeight)];
	borders.push(rightBorder);
	var topBorder = [new Phaser.Point(rectX+rectWidth, rectY), new Phaser.Point(-rectWidth, 0)];
	borders.push(topBorder);

	var dirNorm = Phaser.Point.normalRightHand(endVec);
	var distance = 1000;
	//for each find intersection
	for (i in borders) {
		var cBorder = borders[i];
		//calculate normal
		var cBNorm = Phaser.Point.normalRightHand(cBorder[1]);
		var cBStart = cBorder[0];
		//console.log('current border direction '+cBorder[1]);
		//calculate intersection
		if (cBorder[1].x===0) {
			//case of vertical border
			var interX = cBStart.x;
			if (dirNorm[0]!=0) {
				var interY = (dirNorm.dot(startVec) - dirNorm.x*interX)/dirNorm.y;	
			}
			//check intersection point in boundaries
			if (interY<=rectY+rectHeight && interY>=rectY &&
				((startVec.y + endVec.y>=interY && startVec.y<=interY) ||
					(startVec.y + endVec.y<=interY && startVec.y>=interY))) {
				var intCandidate = new Phaser.Point(interX, interY);
				//console.log('int candidate '+intCandidate);

				if (distance>intCandidate.distance(startVec)) {
					distance = intCandidate.distance(startVec);
					intersectionPoint = new Phaser.Point();
					intCandidate.copyTo(intersectionPoint);
				}
			}			
		} else {
			//case of horizontal border
			var interY = cBStart.y;
			if (dirNorm[0]!=0) {
				var interX = (dirNorm.dot(startVec) - dirNorm.y*interY)/dirNorm.x;	
			}
			if (interX<=rectX+rectWidth && interX>=rectX &&
				((startVec.x+endVec.x>=interX && startVec.x<=interX) ||
					(startVec.x+endVec.x<=interX && startVec.x>=interX))) {
				var intCandidate = new Phaser.Point(interX, interY);
				console.log('int candidate '+intCandidate);
				
				if (distance>intCandidate.distance(startVec)) {
					distance = intCandidate.distance(startVec);
					intersectionPoint = new Phaser.Point();
					intCandidate.copyTo(intersectionPoint);

				}
			}
		}
	}
	return intersectionPoint;
};