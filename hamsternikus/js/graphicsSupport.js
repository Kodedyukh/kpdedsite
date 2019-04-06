movableLabGenerator = {

	bitmapDataArray: [],
	bitmapDataArrayNames: [],

	prepareObstacleSprite: function(game, vertices, fillColor) {

		//console.log(vertices);

		var verticesCopy = [];

		vertices.forEach(function(vertex){
			verticesCopy.push(vertex.clone());
		}, this);


		var alignedResults = this.alignVertices(verticesCopy);

		switch (fillColor) {		
			case 'metalPipe':
				var basicTexture = 'metalPipeBasic';
				var middleTexture = 'metalPipeJoint';
				var endTexture = game.rnd.pick(['metalPipeEnd1', 'metalPipeEnd2']);
				break;
			case 'glassTube':
				var basicTexture = 'glassTubeBasic';
				var middleTexture = 'glassTubeMiddle';
				var endTexture = 'glassTubeEnd';
				break;
			case 'electricStrings':
				var basicTexture = 'electricStringsBasic';
				var middleTexture = 'electricStringsMiddle';
				var endTexture = 'electricStringsEnd';
				break;
			case 'plasticTube':
				var basicTexture = 'plasticTubeBasic';
				var middleTexture = 'plasticTubeMiddle';
				var endTexture = game.rnd.pick(['plasticTubeEnd1', 'plasticTubeEnd2']);
				break;
			case 'wire':
				var basicTexture = 'wireBasic';
				var middleTexture = null;
				var endTexture = game.rnd.pick(['wireEnd1', 'wireEnd2']);
				break;
		}
		var bmdNumber = this.bitmapDataArrayNames.length;

		var bmd = this.generateBitmapData(game, alignedResults.vertices, alignedResults.width, Math.abs(alignedResults.height), bmdNumber);

		var bmdKey = 'movableLabBMD' + bmdNumber;

		this.bitmapDataArrayNames.push(bmdKey);

		this.fillWithBasicTexture(game, bmd, basicTexture);		

		//bmd.update();

		var endPoints = this.defineEndPoints(alignedResults.vertices);
		var middlePoint = this.defineMiddlePoints(alignedResults.width);

		this.addEndTexture(game, bmd, endPoints, endTexture);

		this.addMiddleTexture(game, bmd, middlePoint, middleTexture);

		return {bitmapData: bmd, x: -alignedResults.x, y: -alignedResults.y, rot: -alignedResults.rot, bottomStick: alignedResults.bottomStick};

	},

	generateBitmapData: function(game, vertices, width, height, bmdNumber) {
		

		if (bmdNumber<this.bitmapDataArray.length) {

			var bmd = this.bitmapDataArray[bmdNumber];
			bmd = bmd.clear();
			bmd.width = width;
			bmd.height = height;
			bmd.frameData._frames[0].resize(width, height);
			bmd.canvas.width = width;

			bmd.baseTexture.forceLoaded(width, height);

			var alignedVer = vertices.slice();
			bmd.ctx.webkitImageSmoothingEnabled = false;
			//bmd.ctx.mozImageSmoothingEnabled = false;
			bmd.ctx.imageSmoothingEnabled = false;

			bmd.ctx.beginPath();
			bmd.ctx.moveTo(alignedVer[0].x, alignedVer[0].y);

			for (var v =1; v<alignedVer.length; v++) {

				bmd.ctx.lineTo(alignedVer[v].x, alignedVer[v].y);
			}			

			bmd.ctx.closePath();
			bmd.update();

		} else {

			var bmd = game.add.bitmapData(width, height);
			//bmd.dirty = true;

			var alignedVer = vertices.slice();
			bmd.ctx.webkitImageSmoothingEnabled = false;
			//bmd.ctx.mozImageSmoothingEnabled = false;
			bmd.ctx.imageSmoothingEnabled = false;

			bmd.ctx.beginPath();
			bmd.ctx.moveTo(alignedVer[0].x, alignedVer[0].y);

			for (var v =1; v<alignedVer.length; v++) {

				bmd.ctx.lineTo(alignedVer[v].x, alignedVer[v].y);
			}

			bmd.ctx.closePath();

			this.bitmapDataArray.push(bmd);
		}
		

		return bmd;
	},

	generateMask: function(game, vertices, width, height) {

		var bmd = game.make.bitmapData(width, height);

		var alignedVer = vertices.slice();
		var newAlingedVer = this.insetVertices(alignedVer, 0, height);
		//console.log(newAlingedVer);
		bmd.ctx.webkitImageSmoothingEnabled = false;
		bmd.ctx.mozImageSmoothingEnabled = false;
		bmd.ctx.imageSmoothingEnabled = false;

		bmd.ctx.beginPath();
		bmd.ctx.moveTo(newAlingedVer[0].x, newAlingedVer[0].y);

		for (var v =1; v<newAlingedVer.length; v++) {

			bmd.ctx.lineTo(newAlingedVer[v].x, newAlingedVer[v].y);
		}

		bmd.ctx.fillStyle = '#00ff00';
		bmd.ctx.fill();

		bmd.ctx.closePath();

		return bmd;
	},

	insetVertices: function(vertices, insetMag, height) {
		var segments = generateSegments(vertices);

		var verticalSegments = segments.filter(function(segment){
			return Math.abs(segment[1].y) > 0.1;
		});

		//console.log(verticalSegments);

		var horizontalBorders = [[new Phaser.Point(0, insetMag), new Phaser.Point(1 ,0)], [new Phaser.Point(0, height - insetMag), new Phaser.Point(1 ,0)]];

		var newVertices = [];

		for (var v in verticalSegments) {
			for (var h in horizontalBorders) {
				var newVertex = intersectVecVec(verticalSegments[v][0], verticalSegments[v][1], horizontalBorders[h][0], horizontalBorders[h][1]).intPoint;
				newVertices.push(newVertex);
			}
		}

		var tempVertex = newVertices[2];
		newVertices[2] = newVertices[3];
		newVertices[3] = tempVertex;

		return newVertices;
	},

	fillWithBasicTexture: function(game, bmd, basicTexture) {

		var patternCanvas = textureStorage.getPatternCanvas(basicTexture);

		var pattern = bmd.ctx.createPattern(patternCanvas, "repeat");
		bmd.ctx.fillStyle = pattern;
		bmd.ctx.fill();


	},

	defineEndPoints: function(vertices) {
		var endPoints = [];
		var segments = generateSegments(vertices);

		for (var s in segments) {
			if (segments[s][1].x === 0) {
				endPoints.push(segments[s][0].x);
			}
		}

		return endPoints;
	},

	defineMiddlePoints: function(width) {
		if (width > 100) {
			return width/2;
		}
		return null;
	},

	addEndTexture: function(game, bmd, endPoints, endTexture) {
		var endSprite = game.make.sprite(0, 0, endTexture);
		endSprite.anchor.setTo(0, 0.5);
		endSprite.scale.setTo(configuration.scaleRatio/2, configuration.scaleRatio/2);
		endSprite.smoothed = false;

		for (var p in endPoints) {
			if (endPoints[p]===0) {
				bmd.draw(endSprite, 0, bmd.height/2);
			} else {
				endSprite.rotation = Math.PI;
				bmd.draw(endSprite, endPoints[p], bmd.height/2);
			}
		}
	},

	addMiddleTexture: function(game, bmd, middlePoint, middleTexture) {
		if (middleTexture) {
			var middleSprite = game.make.sprite(0, 0, middleTexture);
			middleSprite.anchor.setTo(0.5, 0.5);
			middleSprite.scale.setTo(configuration.scaleRatio/2, configuration.scaleRatio/2);
			middleSprite.smoothed = false;

			if (middlePoint) {
				bmd.draw(middleSprite, middlePoint, bmd.height/2);
			}	
		}	
	},


	alignVertices: function(cVertices) {

		//console.log(cVertices);

		//generate segments function comes from support lib
		var segments = generateSegments(cVertices.slice());

		var longestSegment = segments.reduce(function(prev, curr){
			var prevDistance = prev[1].getMagnitude();
			var currDistance = curr[1].getMagnitude();

			return (prevDistance<currDistance)? curr: prev;
		});

		var xShift = -longestSegment[0].x;
		var yShift = -longestSegment[0].y;
		var rot = - Phaser.Point.angle(longestSegment[1], new Phaser.Point());

		var verticesCopy = [];

		cVertices.forEach(function(vertex){
			verticesCopy.push(vertex.clone());
		}, this);

		//get head of the longest segment to 0, 0

		verticesCopy.forEach(function(vertex){

			vertex.rotate(longestSegment[0].x, longestSegment[0].y, rot);
			vertex.add(xShift, yShift);

		}, this);

		var maxHeight = verticesCopy.reduce(function(prev, curr, index){
			//console.log(prev);
			//console.log(curr);

			if (index == 1) {
				var prevValue = prev.y;
			} else {
				var prevValue = prev;
			}		
			if (Math.round(curr.y)>0) {

				return Math.max(prevValue, curr.y);

			} else if (Math.round(curr.y)<0){

				return Math.min(prevValue, curr.y);

			} else {

				return prevValue;
			}
		});

		//move all vetrtices to positive y domain

		var stickToBottom = false;

		if (maxHeight<0) {
			//yShift -= maxHeight;
			stickToBottom = true;
			verticesCopy.forEach(function(vertex){
				vertex.y -= maxHeight;
			}, this);
		}

		return {vertices: verticesCopy, x: xShift, y: yShift, rot: rot, width: longestSegment[1].getMagnitude(), height: Math.abs(maxHeight), bottomStick: stickToBottom};
	},

	clearBitmapDataArray: function(game) {
		
		/*var bitmapDataArrayCopy = this.bitmapDataArray.slice();

		for (var bmd in bitmapDataArrayCopy) {
			this.bitmapDataArray[bmd].destroy();
		}*/
		/*this.bitmapDataArrayNames.forEach(function(bmdKey){
			game.cache.removeImage(bmdKey);
		}, this);*/
		this.bitmapDataArrayNames = [];

		
	}
};

movableLabGeneratorRT = {

	renderTextures: [],
	renderTexturesKeys: [],

	prepareObstacleSprite: function(game, vertices, fillColor) {

		//console.log(vertices);

		var verticesCopy = [];

		vertices.forEach(function(vertex){
			//console.log(vertex);
			verticesCopy.push(vertex.clone());
		}, this);


		var alignedResults = this.alignVertices(verticesCopy);

		switch (fillColor) {		
			case 'metalPipe':
				var basicTexture = 'metalPipeBasic';
				var middleTexture = 'metalPipeJoint';
				var endTexture = game.rnd.pick(['metalPipeEnd1', 'metalPipeEnd2']);
				break;
			case 'glassTube':
				var basicTexture = 'glassTubeBasic';
				var middleTexture = 'glassTubeMiddle';
				var endTexture = 'glassTubeEnd';
				break;
			case 'electricStrings':
				var basicTexture = 'electricStringsBasic';
				var middleTexture = 'electricStringsMiddle';
				var endTexture = 'electricStringsEnd';
				break;
			case 'plasticTube':
				var basicTexture = 'plasticTubeBasic';
				var middleTexture = 'plasticTubeMiddle';
				var endTexture = game.rnd.pick(['plasticTubeEnd1', 'plasticTubeEnd2']);
				break;
			case 'wire':
				var basicTexture = 'wireBasic';
				var middleTexture = null;
				var endTexture = game.rnd.pick(['wireEnd1', 'wireEnd2']);
				break;
		}

		var renderTextureKey = 'movableLabRenderTexture' + this.renderTextures.length;

		this.renderTexturesKeys.push(renderTextureKey);

		var renderTexture = game.make.renderTexture(alignedResults.width, Math.abs(alignedResults.height), renderTextureKey);

		this.fillWithBasicTexture(game, renderTexture, basicTexture);

		/*bmd.update();

		var endPoints = this.defineEndPoints(alignedResults.vertices);
		var middlePoint = this.defineMiddlePoints(alignedResults.width);

		this.addEndTexture(game, bmd, endPoints, endTexture);

		this.addMiddleTexture(game, bmd, middlePoint, middleTexture);

		this.bitmapDataArray.push(bmd);*/

		this.renderTextures.push(renderTexture);

		return {renderTexture: renderTexture, x: -alignedResults.x, y: -alignedResults.y, rot: -alignedResults.rot, bottomStick: alignedResults.bottomStick};
	},

	alignVertices: function(cVertices) {

		//console.log(cVertices);

		//generate segments function comes from support lib
		var segments = generateSegments(cVertices.slice());

		var longestSegment = segments.reduce(function(prev, curr){
			var prevDistance = prev[1].getMagnitude();
			var currDistance = curr[1].getMagnitude();

			return (prevDistance<currDistance)? curr: prev;
		});

		var xShift = -longestSegment[0].x;
		var yShift = -longestSegment[0].y;
		var rot = - Phaser.Point.angle(longestSegment[1], new Phaser.Point());

		var verticesCopy = [];

		cVertices.forEach(function(vertex){
			verticesCopy.push(vertex.clone());
		}, this);

		//get head of the longest segment to 0, 0

		verticesCopy.forEach(function(vertex){

			vertex.rotate(longestSegment[0].x, longestSegment[0].y, rot);
			vertex.add(xShift, yShift);

		}, this);

		var maxHeight = verticesCopy.reduce(function(prev, curr, index){
			//console.log(prev);
			//console.log(curr);

			if (index == 1) {
				var prevValue = prev.y;
			} else {
				var prevValue = prev;
			}		
			if (Math.round(curr.y)>0) {

				return Math.max(prevValue, curr.y);

			} else if (Math.round(curr.y)<0){

				return Math.min(prevValue, curr.y);

			} else {

				return prevValue;
			}
		});

		//move all vetrtices to positive y domain

		var stickToBottom = false;

		if (maxHeight<0) {
			//yShift -= maxHeight;
			stickToBottom = true;
			verticesCopy.forEach(function(vertex){
				vertex.y -= maxHeight;
			}, this);
		}

		return {vertices: verticesCopy, x: xShift, y: yShift, rot: rot, width: longestSegment[1].getMagnitude(), height: Math.abs(maxHeight), bottomStick: stickToBottom};
	},

	fillWithBasicTexture: function(game, renderTexture, basicTexture) {
		var basicTextureImage = new Phaser.Image(game, 0, 0, basicTexture),
			basicTextureWidth = game.cache.getImage(basicTexture).width,
			basicTextureHeight = game.cache.getImage(basicTexture).height;

		var currentXPos = 0,
			yPos = (renderTexture.height - basicTextureHeight)/2;

		while (currentXPos<renderTexture.width) {
			renderTexture.renderRawXY(basicTextureImage, currentXPos, yPos);
			currentXPos += basicTextureWidth;
		}
	},

	clearTextures: function() {
		
		/*this.renderTexturesKeys.forEach(function(rtKey){
			var rt = game.cache.getRenderTexture(rtKey);
			rt.destroy();
			game.cache.removeRenderTexture(rtKey);
		}, this);*/
		//console.log(this.renderTextures);
		this.renderTextures.forEach(function(rt){
			rt.destroy();
		}, this);
		//console.log(this.renderTextures);

		this.renderTextures = [];
		this.renderTexturesKeys = [];
	}

};

textureStorage = {

	textures: {},

	prepareObstacleTextureCanvas: function(game) {

		//var colors = ['black', 'blue', 'green', 'orange', 'red', 'yellow'];

		this.game = game;

		var colors = ['metalPipeBasic', 'glassTubeBasic', 'electricStringsBasic', 'plasticTubeBasic', 'wireBasic'];

		colors.forEach(function(color){

			var patCanvas = document.createElement('canvas');		

			patCanvas.width = 16 * configuration.scaleRatio;
			patCanvas.height = 16 * configuration.scaleRatio;

			//var imageName = color+'Obstacle';
			var imageName = color;

			patCanvas.getContext('2d').webkitImageSmoothingEnabled = false;
			//patCanvas.getContext('2d').mozImageSmoothingEnabled = false;
			patCanvas.getContext('2d').imageSmoothingEnabled = false;

			patCanvas.getContext('2d').drawImage(game.cache.getImage(imageName), 0, 0, patCanvas.width, patCanvas.height);
			
			this.textures[color] = patCanvas;

		}, this);

		/*var patPaperCanvas = document.createElement('canvas');		

		patPaperCanvas.width = 16 * configuration.scaleRatio;
		patPaperCanvas.height = 16 * configuration.scaleRatio;

		patPaperCanvas.getContext('2d').webkitImageSmoothingEnabled = false;
		patPaperCanvas.getContext('2d').imageSmoothingEnabled = false;

		paper.setup(patPaperCanvas);

		var rectangle = new paper.Rectangle(0, 0, patPaperCanvas.width, patPaperCanvas.height);		

		var path = new paper.Path.Rectangle(rectangle);
		path.fillColor = '#ff00e1';

		var voronoi = new Voronoi();

		var bbox = {xl: 0, xr: patPaperCanvas.width, yt: 0, yb: patPaperCanvas.height};
		var sites = [new paper.Point(patPaperCanvas.width*0.2, patPaperCanvas.height*0.5), new paper.Point(patPaperCanvas.width*0.6, patPaperCanvas.height*0.25), 
			new paper.Point(patPaperCanvas.width*0.7, patPaperCanvas.height*0.45), new paper.Point(patPaperCanvas.width*0.54, patPaperCanvas.height*0.8)];

		var diagram = voronoi.compute(sites, bbox);

		if (diagram) {
			for (var i =0, l=sites.length; i<l; i++) {
				var cell = diagram.cells[sites[i].voronoiId];
				if (cell) {
					var halfedges = cell.halfedges,
						length = halfedges.length;

					if (length > 2) {
						var points = [];

						for (var j = 0; j<length; j++) {
							var v = halfedges[j].getEndpoint();
							points.push(new paper.Point(v));

						}

						this.createPath(points, sites[i]);
					}
				}
			}
		}

		paper.view.draw();
			
		this.textures['interdimBasic'] = patPaperCanvas;*/

		
	},

	getPatternCanvas: function(fillColor) {

		//console.log(document.getElementById('obstacle'));

		return this.textures[fillColor];
	},

	/*createPath: function(points, center) {
		var path = new paper.Path();

		path.fillColor = '#530037';

		path.closed = true;

		for (var i = 0, l=points.length; i<l; i++) {
			var point = points[i];
			var next = points[(i+1)== points.length? 0: i+1];

			var vector = next.subtract(point).divide(10);

			path.add({point: point.add(vector), handleIn: vector.multiply(-1), handleOut: vector});
			
		}

		return path;		
	}*/
};

lightningAnimation = {

	animationArray: [],
	animationNames: [],

	generateAnimation: function(game, width, height) {

		this.game = game;

		var lightCanvas = document.createElement('canvas');

		paper.setup(lightCanvas);

		var localWidth = 1.7*width;

		lightCanvas.width = 20 * Math.ceil(localWidth);
		lightCanvas.height = Math.ceil(height);

		var start = new paper.Point(localWidth/2, 0),
    		end = new paper.Point(localWidth/2, height);
    
		var lightPoints = generateLightPoints(start, end, 10, 30);
		var lightPath = createHairPath(lightPoints, 2, 2);
		assignPhase(lightPath);

		for (var j=0; j<19; j++) {
		        
		        var lightPathClone = lightPath.clone();
		        var hairPathsArray = lightPathClone.curves.map(hairyCurve, this);
		        createGlowEffect(lightPathClone, 2);
		        movePath(lightPath, localWidth);
		        shakePath(lightPath, j+1);
		}

		var hairPathsArray = lightPath.curves.map(hairyCurve, this);
		createGlowEffect(lightPath, 2);

		paper.view.draw();

		var spriteSheetName = 'lightAnimation'+this.animationArray.length;

		this.animationArray.push(lightCanvas);
		this.animationNames.push(spriteSheetName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addSpriteSheet(spriteSheetName, null, lightCanvas, localWidth, height, 20, 0, 0);

		paper.project.remove();

		return spriteSheetName;		

		function generateLightPoints(point1, point2, segLength, disp) {
		    var cPoint = point1.clone(),
		        pointsArray = [];
		        
		    pointsArray.push(cPoint);
		    
		    while (cPoint.getDistance(point2)>segLength) {
		        var dirVec = new paper.Point({
		            length: segLength,
		            angle: point2.subtract(cPoint).angle + getAppNormal()*disp
		        })
		        cPoint = cPoint.add(dirVec);
		        pointsArray.push(cPoint);
		    }
		    pointsArray.push(point2);
		    
		    return pointsArray;
		}

		function createHairPath(pointsArray, startWidth, finishWidth) {
		    finishWidth = finishWidth || 0;
		    var widthStep = (startWidth - finishWidth)/pointsArray.length,
		        cWidth = startWidth,
		        pathPoints = [];
		    
		    for (var i = 0; i<pointsArray.length-1; i++) {
		        var normVec = pointsArray[i+1].subtract(pointsArray[i]),
		            tangVec = normVec.rotate(90, new paper.Point());
		            
		        tangVec = tangVec.normalize(cWidth/2);
		        
		        var hairPoint = pointsArray[i].add(tangVec);
		        pathPoints.push(hairPoint);
		        cWidth -= widthStep;
		    }
		    
		    var normVec = pointsArray[pointsArray.length - 1].subtract(pointsArray[0]),
		        tangVec = normVec.rotate(90, new paper.Point());
		            
		    tangVec = tangVec.normalize(finishWidth/2);
		        
		    var hairPoint = pointsArray[i].add(tangVec);
		    pathPoints.push(hairPoint);
		    pathPoints.push(pointsArray[i].add(tangVec.multiply(-1)));
		    
		    
		    for (var i = pointsArray.length-2; i>=0; i--) {
		        var normVec = pointsArray[i].subtract(pointsArray[i+1]),
		            tangVec = normVec.rotate(90, new paper.Point());
		            
		        tangVec = tangVec.normalize(cWidth/2);
		        
		        var hairPoint = pointsArray[i].add(tangVec);
		        pathPoints.push(hairPoint);
		        cWidth += widthStep;
		    }
		    
		    var hairPath = new paper.Path(pathPoints);
		    
		    hairPath.closed = true;
		    hairPath.fillColor = '#ddfff6';
		    
		    return hairPath;
		}

		function hairyCurve(curve) {
		    var number = 5,
		        hairLength = 5,
		        hairPaths = [];
		        
		        
		    for (i = 1; i<number+1; i++) {
		        var offset = 0.1 + Math.random()*0.8,
		            pointAtCurve = curve.getPointAtTime(offset),
		            normal = curve.getNormalAtTime(offset);
		            
		        normal = normal.normalize(hairLength*(0.5 + 0.5*Math.random()));
		            
		        var endPoint = pointAtCurve.add(normal);
		        
		        var hairLightPoints = generateLightPoints(pointAtCurve, endPoint, 5, 90);
		        var hairPath = createHairPath(hairLightPoints, 4, 0);
		        hairPaths.push(hairPath);
		    }
		    
		    return hairPaths;
		}

		function getAppNormal() {
		    return (Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random() - 3)/3;
		}

		function createGlowEffect(path, depth) {
		    var currentPath = path;
		    
		    for (var i=0; i<depth; i++) {
		        var pathClone = currentPath.clone();
		        
		        
		        
		        //pathClone.fillColor.brightness *= (0.8);
		        //pathClone.fillColor.alpha *= (0.7);
		        if (i===0) {
		        	extrude(pathClone, 5);
		        	pathClone.fillColor = new paper.Color(85/255, 238/255, 248/255, 137/255);
		        } else if (i===1) {
		        	extrude(pathClone, 2);
		        	pathClone.fillColor = new paper.Color(4/255, 85/255, 90/255, 65/255);
		        }
		        pathClone.insertBelow(currentPath);
		        currentPath = pathClone;
		    }
		}

		function extrude(path, mag) {
		    var bisecs = [];
		    path.segments.forEach(function(segment){
		        var fromNextVec = segment.point.subtract(segment.next.point).normalize(mag),
		            fromPrevVec = segment.point.subtract(segment.previous.point).normalize(mag),
		            
		            bisec = fromNextVec.add(fromPrevVec),
		            outVector = segment.next.point.subtract(segment.previous.point).normalize();
		            outVector = outVector.rotate(-90, new paper.Point());
		            
		            bisec = bisec.normalize(mag);
		            if (bisec.dot(outVector)<0) {
		                bisec = bisec.multiply(-1);
		                //console.log('negative');
		            }
		            
		        bisecs.push(bisec);
		    }, this);
		    
		    for (var s in path.segments) {
		        path.segments[s].point = path.segments[s].point.add(bisecs[s])
		    }
		}

		function assignPhase(path) {
		    for (var i=1; i<path.segments.length/2; i++) {
		        var phase = Math.PI*Math.random();
		        path.segments[i].data = {phase: phase};
		        path.segments[path.segments.length-1-i].data = {phase: phase};
		    }
		}

		function shakePath(path, tRaw) {
		    var t=tRaw/20*2*Math.PI;
		    for (var i=1; i<path.segments.length/2-1; i++) {
		        var rI = path.segments.length-1-i;
		        path.segments[i].point.x += 0.4*(Math.sin(t+path.segments[i].data.phase));
		        path.segments[rI].point.x += 0.4*(Math.sin(t+path.segments[rI].data.phase));
		    }
		}

		function movePath(path, distance) {
		    path.segments.forEach(function(segment){
		        segment.point.x += distance;
		    }, this);
		}
	},

	clearCanvasArray: function() {
		this.animationNames.forEach(function(animName){
			//console.log(animName);
			//console.log(this.game.cache.checkImageKey(animName));
			this.game.cache.removeImage(animName);
		}, this);
		this.animationArray = [];
		this.animationNames = [];
	}
};

shadowGenerator = {

	shadowCanvasArray: [],
	shadowNamesArray: [],

	generatePolygonShadow: function(game, vertices, lightSourceGlobal, needCurve) {

		this.game = game;

		var maxOffset = 20;

		var shadowCanvas = document.createElement('canvas');

		paper.setup(shadowCanvas);

		var centerResults = this.centerPolygon(vertices, lightSourceGlobal);

		shadowCanvas.width = centerResults.width + 2*maxOffset;
		shadowCanvas.height = centerResults.height + 2*maxOffset;

		var lightSource = centerResults.lightSourceC;
		lightSource.x += maxOffset;
		lightSource.y += maxOffset;

		var leftShift = centerResults.leftShift,
			topShift = centerResults.topShift;

		var objectPointsArray = [];

		vertices.forEach(function(vertex){
			var paperPoint = new paper.Point(vertex.x - leftShift + maxOffset, 
				vertex.y - topShift + maxOffset);
			objectPointsArray.push(paperPoint);
		}, this);
    
		shadowOfPolygon(objectPointsArray, lightSource, needCurve);		

		paper.view.draw();

		var spriteName = 'shadowImage'+this.shadowNamesArray.length;

		this.shadowCanvasArray.push(shadowCanvas);
		this.shadowNamesArray.push(spriteName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addImage(spriteName, null, shadowCanvas);

		paper.project.remove();

		return spriteName;
		    
		function shadowOfPolygon(pointsArray, lightPos, needCurve) {
		    var objectPath = new paper.Path(pointsArray);
		    objectPath.closed = true;
		    objectPath.fillColor = 'red';
		    
		    var shadowPointsArray = [];
		    var projectionPointsArray = [];
		    
		    pointsArray.forEach(function(point){
		        var shadowPoint = projectPoint(point, lightPos, 20);
		        projectionPointsArray.push(shadowPoint);
		    }, this);
		    
		    
		    for (var i = 0; i<pointsArray.length; i++) {
		        var objectPoint = pointsArray[i];
		        var projectionPoint = projectionPointsArray[i];
		        //console.log(objectPoint);
		        //console.log(projectionPoint);
		        
		        if (pointSeen(objectPoint, objectPath, lightPos)) {
		            shadowPointsArray.push(objectPoint);
		            if (!objectPath.contains(projectionPoint)) {
		                shadowPointsArray.push(projectionPoint);
		            }
		        } else {
		            shadowPointsArray.push(projectionPoint);
		            
		        }
		    }
		    
		    var objectInner = objectPath.position.clone();
		    
		    sortByInnerPoint(shadowPointsArray, objectInner);
		    
		    var preShadow = new paper.Path(shadowPointsArray);
		    preShadow.closed = true;
		    preShadow.fillColor = 'black';
		    preShadow.opacity = 0.4;

		    if (needCurve) {
		    	var curvesCopy = preShadow.curves.slice();
			    curvesCopy.forEach(fractionCurve, this);

			    preShadow.segments.forEach(assignHandles, this);
				preShadow.segments.forEach(initialShake, this);
		    }	    

		    paper.project.activeLayer.removeChildren(0, 1);

		    return preShadow;
		};

		function pointSeen(point, path, lightPos) {
		    var toLightPath = new paper.Path(lightPos, point);
		    var crossings = path.getCrossings(toLightPath);
		    if (crossings.length > 0) {
		        return false;
		    }
		    return true;
		};

		function sortByInnerPoint(array, innerPoint) {
		    array.sort(function(a, b){
		        var aAngle = a.subtract(innerPoint).angle;
		        var bAngle = b.subtract(innerPoint).angle;
		        if (aAngle > bAngle) {
		            return 1;
		        } else {
		            return -1;
		        }
		    })
		};	

		function projectPoint(point, lightPos, height) {
			var fromSourceVec = point.subtract(lightPos).normalize();		    
			var projectionPoint = point.add(fromSourceVec.multiply(height));
			return projectionPoint;
		};

		function initialShake(segment) {
		    if (segment.point.data.shake && segment.curve.length > 10) {
		        segment.point.data.initialHandleInAngle = segment.handleIn.angle;
		        var segmentAngle = -30 + Math.random()*60;
		        
		        segment.handleIn = segment.handleIn.rotate(segmentAngle, new paper.Point());
		        segment.handleOut = segment.handleOut.rotate(segmentAngle, new paper.Point());
		        
		        segment.point.data.phase = 0;
		        segment.point.data.angleDelta = 3;
		    }
		    
		};

		function assignHandles(segment) {
		    segment.handleIn = segment.previous.point.subtract(segment.point).normalize(10);
		    segment.handleOut = segment.next.point.subtract(segment.point).normalize(10);
		    if (!segment.point.data) {
		        segment.point.data = {};
		    }
		};

		function fractionCurve(curve) {
		    if (curve && curve.length>40) {
		        var newCurve = curve.divideAt(30);
		        fractionCurve(newCurve);
		        newCurve.segment1.point.data = {shake: true};
		    } else if (curve) {
		        curve.segment1.point.date = {shake: false};
		    }
		};

	},

	generateSphereShadow: function(game, sphereCenterGlobal, sphereRadius, lightSourceGlobal) {
		this.game = game;

		var maxOffset = sphereRadius;

		var shadowCanvas = document.createElement('canvas');

		shadowCanvas.width = 2*(sphereRadius + maxOffset)/window.devicePixelRatio;
		shadowCanvas.height = 2*(sphereRadius + maxOffset)/window.devicePixelRatio;

		paper.setup(shadowCanvas);

		/*console.log('sphereCenterGlobal '+sphereCenterGlobal);
		console.log('lightSourceGlobal '+lightSourceGlobal);
		console.log('shadow canvas width '+shadowCanvas.width);
		console.log('shadow canvas height '+shadowCanvas.height);*/

		var leftShift = sphereCenterGlobal.x - shadowCanvas.width/2;
		var topShift = sphereCenterGlobal.y - shadowCanvas.height/2;

		var lightSource = new paper.Point(lightSourceGlobal.x - leftShift, lightSourceGlobal.y - topShift);

		var sphereCenter = new paper.Point(sphereCenterGlobal.x - leftShift, sphereCenterGlobal.y - topShift);

		/*console.log('top shift '+topShift);
		console.log('left shift '+leftShift);*/

		shadowOfSphere(game, sphereCenter, sphereRadius, lightSource);

		/*var rectangleCanvas = new paper.Path.Rectangle( new paper.Point(0, 0), new paper.Size(shadowCanvas.width, shadowCanvas.height));
		rectangleCanvas.fillColor = 'yellow';
		rectangleCanvas.strokeColor = 'green';
		rectangleCanvas.strokeWidth = 3;*/		

		paper.view.draw();

		var spriteName = 'shadowImage'+this.shadowNamesArray.length;

		this.shadowCanvasArray.push(shadowCanvas);
		this.shadowNamesArray.push(spriteName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addImage(spriteName, null, shadowCanvas);

		paper.project.remove();

		//this.game.add.sprite(0, 0, spriteName);

		/*console.log(sphereCenterGlobal);
		console.log(sphereRadius);
		console.log(lightSourceGlobal);*/

		return spriteName;

		function shadowOfSphere(game, sphereCenter, sphereRadius, lightPos) {

			/*console.log('sphereRadius '+sphereRadius);
			console.log('sphereCenter '+sphereCenter);
			console.log('lightPos '+lightPos);*/

		    var spherePath = new paper.Path.Circle(sphereCenter, sphereRadius);
		    spherePath.fillColor = 'red';
		    spherePath.opacity = 0.8;
		    
		    var extremePoints = lastSeenPointsSphere(sphereCenter, sphereRadius, lightPos);
		    var extremePointsProjection = [];
		    extremePoints.forEach(function(point){
		        extremePointsProjection.push(projectPoint(point, lightPos, sphereRadius*0.7));
		    }, this);

		    var topProjection = projectPoint(sphereCenter, lightPos, sphereRadius*1.8);
		    var centerProjection = projectPoint(sphereCenter, lightPos, sphereRadius* (- 0.5));
		    
		    var shadowPointsArray = [centerProjection, extremePointsProjection[0],
		        topProjection, extremePointsProjection[1]];
		        
		    var shadowPath = new paper.Path(shadowPointsArray);
		    shadowPath.closed = true;
		    shadowPath.fillColor = 'black';
		    shadowPath.opacity = 0.4;
		    shadowPath.smooth();

		    //console.log(shadowPath);

		    var longitudalVec = topProjection.subtract(centerProjection).normalize(sphereRadius*0.8);
		    var rightDirection = longitudalVec.rotate(90, new paper.Point());
		    var leftDirection = longitudalVec.rotate(-90, new paper.Point());

		    shadowPath.segments[0].handleOut = rightDirection;
		    shadowPath.segments[0].handleIn = leftDirection;

		    /*shadowPath.segments.forEach(function(segment){
		    	console.log(segment.point.x);
		    	console.log(segment.point.y);
		    }, this);*/
		    if (!game.device.desktop) {
				//shadowPath.scale(window.innerHeight/game.height, new paper.Point(0, 0));	
				shadowPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));	
			}		

		    paper.project.activeLayer.removeChildren(0, 1);
		};

		function lastSeenPointsSphere(center, radius, lightPos) {
		    var tangVec = center.subtract(lightPos);
		    var norm1 = tangVec.rotate(90, new paper.Point()).normalize(radius);
		    var norm2 = tangVec.rotate(-90, new paper.Point()).normalize(radius);
		    var point1 = center.add(norm1);
		    var point2 = center.add(norm2);
		    return [point1, point2];
		};

		function projectPoint(point, lightPos, height) {
			var fromSourceVec = point.subtract(lightPos).normalize();		    
			var projectionPoint = point.add(fromSourceVec.multiply(height));
			return projectionPoint;
		}

	},

	generateCylinderShadow: function(game, cylinderCenterGlobal, radius, lightSourceGlobal) {
		this.game = game;

		var maxOffset = radius;

		var shadowCanvas = document.createElement('canvas');

		shadowCanvas.width = 2*(radius + maxOffset)/window.devicePixelRatio;
		shadowCanvas.height = 2*(radius + maxOffset)/window.devicePixelRatio;

		paper.setup(shadowCanvas);

		var leftShift = cylinderCenterGlobal.x - shadowCanvas.width/2;
		var topShift = cylinderCenterGlobal.y - shadowCanvas.height/2;

		var lightSource = new paper.Point(lightSourceGlobal.x - leftShift, lightSourceGlobal.y - topShift);

		var cylinderCenter = new paper.Point(cylinderCenterGlobal.x - leftShift, cylinderCenterGlobal.y - topShift);

		shadowOfCylinder(cylinderCenter, radius, lightSource);

		paper.view.draw();

		var spriteName = 'shadowImage'+this.shadowNamesArray.length;

		this.shadowCanvasArray.push(shadowCanvas);
		this.shadowNamesArray.push(spriteName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addImage(spriteName, null, shadowCanvas);

		//this.game.add.sprite(0, 0, spriteName);

		paper.project.remove();

		return spriteName;

		function shadowOfCylinder(cylinderCenter, radius, lightPos) {

			var cylinderPath = new paper.Path.Circle(cylinderCenter, radius);
			cylinderPath.fillColor = 'black';
			cylinderPath.opacity = 0.4;
				    
			var extremePoints = lastSeenPointsSphere(cylinderCenter, radius, lightPos);
			//console.log(extremePoints);
			//console.log(radius);
			var curveTimeArray = [];

			extremePoints.forEach(function(angle){
				cylinderPath.curves.forEach(function(curve) {
					var angle1 = curve.segment1.point.subtract(cylinderCenter).angle,
						angle2 = curve.segment1.point.subtract(cylinderCenter).angle,
						totalAngle = angle1 - angle2;

					if (angle>angle1 && angle<angle2) {
						var curveTime = {index: curve.index, time: (angle - angle2)/totalAngle};
						curveTimeArray.push(curveTime);
					}
				}, this);
			}, this);
			
			
			/*var curveLocations = extremePoints.map(function(point){
				console.log(point.getDistance(cylinderCenter));
			    return cylinderPath.getLocationOf(point);
			}, this);
			console.log(curveLocations);*/
			var marginDistance = Math.sqrt(Math.pow(cylinderCenter.getDistance(lightPos), 2) + Math.pow(radius, 2));
			
			var curvesCopy = cylinderPath.curves.slice();
			curveTimeArray.forEach(function(location){
			    var newCurve = curvesCopy[location.index].divideAtTime(location.time);
			}, this);
			
			cylinderPath.segments.forEach(function(segment){
			    if (segment.point.getDistance(lightPos)>= marginDistance-0.1) {
			        segment.point = projectPoint(segment.point, lightPos, radius*0.2);
			    }
			}, this);

			if (!game.device.desktop) {
				cylinderPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			}
		};

		function lastSeenPointsSphere(center, radius, lightPos) {
		    var tangVec = center.subtract(lightPos);
		    var norm1 = tangVec.rotate(90, new paper.Point()).normalize(radius);
		    var norm2 = tangVec.rotate(-90, new paper.Point()).normalize(radius);
		    //var point1 = center.add(norm1);
		    //var point2 = center.add(norm2);
		    return [norm1.angle, norm2.angle];
		};

		function projectPoint(point, lightPos, height) {
			var fromSourceVec = point.subtract(lightPos).normalize();		    
			var projectionPoint = point.add(fromSourceVec.multiply(height));
			return projectionPoint;
		}
	},

	generateSpotBottomShadow: function(game, spotCenterGlobal, radius, lightSourceGlobal) {
		this.game = game;

		var maxOffset = radius;

		var shadowCanvas = document.createElement('canvas');

		shadowCanvas.width = 2*(radius + maxOffset)/window.devicePixelRatio;
		shadowCanvas.height = 2*(radius + maxOffset)/window.devicePixelRatio;

		paper.setup(shadowCanvas);

		var leftShift = spotCenterGlobal.x - shadowCanvas.width/2;
		var topShift = spotCenterGlobal.y - shadowCanvas.height/2;

		var lightSource = new paper.Point(lightSourceGlobal.x - leftShift, lightSourceGlobal.y - topShift);

		var spotCenter = new paper.Point(spotCenterGlobal.x - leftShift, spotCenterGlobal.y - topShift);

		shadowOfSpotBottom(spotCenter, radius, lightSource);

		paper.view.draw();

		var spriteName = 'shadowImage'+this.shadowNamesArray.length;

		this.shadowCanvasArray.push(shadowCanvas);
		this.shadowNamesArray.push(spriteName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addImage(spriteName, null, shadowCanvas);

		paper.project.remove();

		//this.game.add.sprite(0, 0, spriteName);

		return spriteName;

		function shadowOfSpotBottom(spotCenter, radius, lightPos) {

			var shadowPath = new paper.Path.Circle(spotCenter, radius);			

			shadowPath.scale(1.1);

			var blinkSpot = spotCenter.subtract(lightPos).normalize(radius*0.8);
			shadowPath.fillColor = {
			    gradient: {
			        stops: [[new paper.Color(0, 0, 0, 0.05), 0], [new paper.Color(0, 0, 0, 0.3), 1]],
			        radial: true
			    },
			    origin: spotCenter.add(blinkSpot),
			    destination: shadowPath.bounds.topLeft
			}

			if (!game.device.desktop) {
				shadowPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			}
		};
	},

	generateSpotTopShadow: function(game, spotCenterGlobal, radius, lightSourceGlobal) {
		this.game = game;

		var maxOffset = radius;

		var shadowCanvas = document.createElement('canvas');

		shadowCanvas.width = 2*(radius + maxOffset)/window.devicePixelRatio;
		shadowCanvas.height = 2*(radius + maxOffset)/window.devicePixelRatio;

		paper.setup(shadowCanvas);

		var leftShift = spotCenterGlobal.x - shadowCanvas.width/2;
		var topShift = spotCenterGlobal.y - shadowCanvas.height/2;

		var lightSource = new paper.Point(lightSourceGlobal.x - leftShift, lightSourceGlobal.y - topShift);

		var spotCenter = new paper.Point(spotCenterGlobal.x - leftShift, spotCenterGlobal.y - topShift);

		shadowOfSpotTop(spotCenter, radius, lightSource);

		paper.view.draw();

		var spriteName = 'shadowImage'+this.shadowNamesArray.length;

		this.shadowCanvasArray.push(shadowCanvas);
		this.shadowNamesArray.push(spriteName);

		//var bmd = game.add.bitmapData(lightCanvas.width, lightCanvas.height);

		//bmd.ctx.drawImage(lightCanvas, 0, 0, lightCanvas.width, lightCanvas.height);

		game.cache.addImage(spriteName, null, shadowCanvas);

		paper.project.remove();

		//this.game.add.sprite(0, 0, spriteName);

		return spriteName;

		function shadowOfSpotTop(spotCenter, radius, lightPos) {

			var spotPath = new paper.Path.Circle(spotCenter, radius);			
			spotPath.fillColor = 'red';

			var preAboveShadow = spotPath.clone();
			preAboveShadow.scale(1.2);
			preAboveShadow.position = spotCenter.add(spotCenter.subtract(lightPos).normalize(radius*0.7));
			
			var aboveShadow = spotPath.subtract(preAboveShadow);
			preAboveShadow.opacity = 0;
			spotPath.opacity = 0;
			aboveShadow.fillColor = 'black';
			aboveShadow.opacity = 0.4;

			if (!game.device.desktop) {
				aboveShadow.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			}
		};
	},

	centerPolygon: function(vertices, lightPos) {

		var verticesCopy = vertices.slice();

		verticesCopy.sort(function(a,b){
			if (a.x < b.x) {
				return -1
			} else {
				return 1;
			}
		}, this);

		var leftBorder = verticesCopy[0].x ,
			rightBorder = verticesCopy[vertices.length - 1].x;

		verticesCopy.sort(function(a, b){
			if (a.y < b.y) {
				return -1;
			} else {
				return 1;
			}
		}, this);

		var topBorder = verticesCopy[0].y,
			bottomBorder = verticesCopy[vertices.length - 1].y;

		var width = rightBorder - leftBorder,
			height = bottomBorder - topBorder,
			centerLightPos = new paper.Point(lightPos.x - leftBorder, lightPos.y - topBorder);

		return {width: width, height: height, leftShift: leftBorder, topShift: topBorder, lightSourceC: centerLightPos};
	},

	clearShadows: function() {
		this.shadowNamesArray.forEach(function(shadowName){
			this.game.cache.removeImage(shadowName);
		}, this);

		this.shadowNamesArray = [];
		this.shadowCanvasArray = [];
	}

};

wallMoveGenerator = {
	animationNameArray: [],
	animationCanvasArray: [],

	generateAnimation: function(game, edges) {

		//console.log(edges);
		this.game = game;

		var maxOffset = 10;

		var merged = [].concat.apply([], edges);
		//console.log(merged);

		var centerResults = this.centerPolygon(merged);

		var strokeCanvas = document.createElement('canvas');

		strokeCanvas.width = (Math.ceil(centerResults.width) + 2*maxOffset)/window.devicePixelRatio;
		strokeCanvas.height = (Math.ceil(centerResults.height) + 2*maxOffset)/window.devicePixelRatio;

		var leftShift = centerResults.leftShift - maxOffset,
			topShift = centerResults.topShift - maxOffset;

		//create a deep copy of edges array
		var edgesCopy = [];

		edges.forEach(function(edge){
			var edgeCopy = [];
			edge.forEach(function(vertex){
				var vertexCopy = vertex.slice();
				edgeCopy.push(vertexCopy);
			}, this)
			edgesCopy.push(edgeCopy);
		}, this);

		//console.log(edgesCopy);

		edgesCopy.forEach(function(edge) {
			edge.forEach(function(vertex) {
				//console.log(vertex);
				vertex[0] -= leftShift;
				vertex[1] -= topShift;
				//console.log(leftShift);
			}, this);
		}, this);

		paper.setup(strokeCanvas);

		var paths = [];

		var unitedCompPath = new paper.CompoundPath();
		/*console.log(unitedCompPath);
		console.log(edges);
		console.log(edgesCopy);*/

		edgesCopy.forEach(function(edge){
		    var edgePath = new paper.Path(edge);
		    edgePath.closed = true;
		    extrude(edgePath);
		    //console.log(edgePath);
		    paths.push(edgePath);
		    //var uPath = new paper.Path(unitedCompPath.unite(edgePath));
		    //console.log(uPath);
		    unitedCompPath = unitedCompPath.unite(edgePath);
		}, this);

		unitedCompPath.strokeColor = '#f3fdab';
		unitedCompPath.strokeWidth = 4;
		if (!this.game.device.desktop) {
			unitedCompPath.strokeWidth /= window.devicePixelRatio;
		}
		
		unitedCompPath.reduce();
		clearShortCurves(unitedCompPath);		

		var curvesCopy = unitedCompPath.curves.slice();
		curvesCopy.forEach(fractionCurve, this);

		if (unitedCompPath.__proto__.constructor===paper.Path) {
			unitedCompPath.segments.forEach(assignHandles, this);	
			unitedCompPath.segments.forEach(initialShake, this);
		} else {
			unitedCompPath.children.forEach(function(path){
				path.segments.forEach(assignHandles, this);
			}, this);
			unitedCompPath.children.forEach(function(path){
				path.segments.forEach(initialShake, this);
			}, this);
		}		

		var frameWidth = strokeCanvas.width,
			frameHeight = strokeCanvas.height;

		/*var frameWidth = Math.ceil(centerResults.width) + 2*maxOffset,
			frameHeight = Math.ceil(centerResults.height) + 2*maxOffset;*/

		/*for (var i = 0; i<9; i++) {
		    var pathClone = unitedCompPath.clone();
		    // for mobile screens
			if (!this.game.device.desktop) {
				pathClone.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			}

			if (unitedCompPath.__proto__.constructor===paper.Path) {
				unitedCompPath.segments.forEach(shake, this);	
			} else {
				unitedCompPath.children.forEach(function(path){
			    	path.segments.forEach(shake, this);	
			    }, this);		    	
			}		    
		    unitedCompPath.position.x += frameWidth;		    
		};*/

		if (!this.game.device.desktop) {
			unitedCompPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
		}

		paper.view.draw();

		var spriteName = 'wallPushAnimation'+this.animationNameArray.length;

		this.animationCanvasArray.push(strokeCanvas);
		this.animationNameArray.push(spriteName);

		game.cache.addImage(spriteName, null, strokeCanvas);		

		paper.project.remove();

		//console.log(leftShift);
		//console.log(topShift);

		return {name: spriteName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};	

		function extrude(path) {
		    var bisecs = [];
		    path.segments.forEach(function(segment){
		        var fromNextVec = segment.point.subtract(segment.next.point).normalize(5),
		            fromPrevVec = segment.point.subtract(segment.previous.point).normalize(5),
		            
		            bisec = fromNextVec.add(fromPrevVec);
		            
		        bisecs.push(bisec);
		    }, this);
		    
		    for (var s in path.segments) {
		        path.segments[s].point = path.segments[s].point.add(bisecs[s])
		    }
		};

		function fractionCurve(curve) {
		    if (curve && curve.length>40) {
		        var newCurve = curve.divideAt(30);
		        fractionCurve(newCurve);
		        newCurve.segment1.point.data = {shake: true};
		    } else if (curve) {
		        curve.segment1.point.date = {shake: false};
		    }
		};

		function assignHandles(segment) {
		    segment.handleIn = segment.previous.point.subtract(segment.point).normalize(10);
		    segment.handleOut = segment.next.point.subtract(segment.point).normalize(10);
		    if (!segment.point.data) {
		        segment.point.data = {};
		    }
		};

		function initialShake(segment) {
		    if (segment.point.data.shake && segment.curve.length > 10) {
		        segment.point.data.initialHandleInAngle = segment.handleIn.angle;
		        var segmentAngle = -30 + Math.random()*60;
		        
		        segment.handleIn = segment.handleIn.rotate(segmentAngle, new paper.Point());
		        segment.handleOut = segment.handleOut.rotate(segmentAngle, new paper.Point());
		        
		        segment.point.data.phase = 0;
		        segment.point.data.angleDelta = 3;
		    }
		    
		};

		function shake(segment) {
		    if (segment.point.data.shake && segment.curve.length > 10) {
		        //var segmentAngle = 30 * Math.sin(segment.point.data.phase);
		        //var segmentAngle = -5;
		        if (Math.abs(segment.handleIn.angle - 
		            segment.point.data.initialHandleInAngle)> 30){
		                segment.point.data.angleDelta *= -1;    
		            } 
		    
		        segment.handleIn = segment.handleIn.rotate(segment.point.data.angleDelta,
		            new paper.Point());
		        segment.handleOut = segment.handleOut.rotate(segment.point.data.angleDelta,
		            new paper.Point());
		        
		        //segment.point.data.phase += 1/180*Math.PI;
		    }
		};

		function clearShortCurves(compPath) {
			if (compPath.__proto__.constructor===paper.Path) {
				var segmentsCopy = compPath.segments.slice();
			    segmentsCopy.forEach(function(segment){
			        if (segment.curve.length< 20) {
			            segment.remove();
			        }
			    }, this);
			} else {
				compPath.children.forEach(function(path){
					var segmentsCopy = path.segments.slice();
				    segmentsCopy.forEach(function(segment){
				        if (segment.curve.length< 20) {
				            segment.remove();
				        }
				    }, this);
				}, this);	
			}			
		    
		};
	},

	centerPolygon: function(vertices) {

		var verticesCopy = vertices.slice();

		//console.log(vertices);

		verticesCopy.sort(function(a,b){
			if (a[0] < b[0]) {
				return -1
			} else {
				return 1;
			}
		}, this);

		var leftBorder = verticesCopy[0][0] ,
			rightBorder = verticesCopy[vertices.length - 1][0];

		verticesCopy.sort(function(a, b){
			if (a[1] < b[1]) {
				return -1;
			} else {
				return 1;
			}
		}, this);

		var topBorder = verticesCopy[0][1],
			bottomBorder = verticesCopy[vertices.length - 1][1];

		/*console.log(leftBorder);
		console.log(rightBorder);
		console.log(topBorder);
		console.log(bottomBorder);*/

		var width = rightBorder - leftBorder,
			height = bottomBorder - topBorder;

		return {width: width, height: height, leftShift: leftBorder, topShift: topBorder};
	},

	clearAnimations: function() {
		this.animationNameArray.forEach(function(animName){
			this.game.cache.removeImage(animName);
		}, this);

		this.animationNameArray = [];
		this.animationCanvasArray = [];
	}
};

wallTextures = {
	textureNameArray: [],
	textureCanvasArray: [],

	generateMovableMaze: function(game, vertices, fillColor) {
		this.game = game;

		var maxOffset = 5;

		var centerResults = this.centerPolygon(vertices);

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (Math.ceil(centerResults.width) + 2*maxOffset)/window.devicePixelRatio;
		textureCanvas.height = (Math.ceil(centerResults.height) + 2*maxOffset)/window.devicePixelRatio;

		var leftShift = centerResults.leftShift - maxOffset,
			topShift = centerResults.topShift - maxOffset;

		//create a deep copy of edges array
		var verticesCopy = vertices.map(function(vertex){
			return vertex.clone();
		}, this);

		verticesCopy.forEach(function(vertex) {
			vertex.add(-leftShift, -topShift);
		}, this);

		paper.setup(textureCanvas);

		//turn phaser points array to array of paper points
		var pointsArray = verticesCopy.map(function(vertex){
			return new paper.Point(vertex.x, vertex.y);
		}, this);	

		var splitPoints = [];

		pointsArray.forEach(function(point, index, array){
			var nextPoint = (index<array.length-1) ? array[index+1] : array[0],
				newPoints = splitSeg(point, nextPoint);

			if (newPoints.length>0) {
				splitPoints = splitPoints.concat(newPoints);	
			}
			
		}, this);

		pointsArray = pointsArray.concat(splitPoints);

		//console.log(pointsArray);

		//turn points to nested array for delaunay processor

		var splitedEdge = pointsArray.map(function(point){
			return [point.x, point.y];
		}, this);

		var delaunay = new Delaunator(splitedEdge);

		var trianglesPaths = [];

		switch (fillColor) {
			case 'paperBlue':
				var colorArray = ['#7bd9ff', '#25bfff', '#20a5dc', '#1b8ab8', '#0c6c94'];
				var strokeColor = '#08445d';
				break;
			case 'paperGreen':
				var colorArray = ['#7bffa7', '#25ff6d', '#20dc5e', '#1bb84f', '#0c9439'];
				var strokeColor = '#085d24';
				break;
			case 'paperPink':
				var colorArray = ['#940c3c', '#b81b52', '#dc2062', '#ff2572', '#ff7ba9'];
				var strokeColor = '#5d0826';	
				break;
			case 'paperPurple':
				var colorArray = ['#d07bff', '#af25ff', '#9720dc', '#7f1bb8', '#620c94'];
				var strokeColor = '#3e085d';	
				break;
			case 'paperYellow':
				var colorArray = ['#feff7b', '#fcff25', '#dadc20', '#b6b81b', '#92940c'];
				var strokeColor = '#5c5d08';
				break;
		}		

		var colorIndex = 0;	

		//console.log(delaunay.triangles);
		for (var i = 0; i<delaunay.triangles.length; i+=3) {

			var trianglePath = new paper.Path([splitedEdge[delaunay.triangles[i]], splitedEdge[delaunay.triangles[i+1]], splitedEdge[delaunay.triangles[i+2]]]);
			trianglePath.strokeColor = strokeColor;	
			colorIndex = (colorIndex < 4) ? colorIndex + 1 : 0;
			trianglePath.fillColor = colorArray[colorIndex];
			trianglePath.closed = true;
			trianglesPaths.push(trianglePath);
			// scale for mobile screens
			if (!this.game.device.desktop) {
				trianglePath.strokeWidth /= window.devicePixelRatio;
				trianglePath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			}
			//change the color array to increase probabillity of getting old colors
			var colorArrayCopy = colorArray.slice();
			colorArrayCopy.splice(colorIndex, 1);
			colorArray.concat(colorArrayCopy);		

		}

		paper.view.draw();

		var frameWidth = Math.ceil(centerResults.width) + 2*maxOffset,
			frameHeight = Math.ceil(centerResults.height) + 2*maxOffset;

		var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addSpriteSheet(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		function splitSeg(point1, point2) {

			var newPoints = [];

			var currentPoint = point1;

			while (currentPoint.getDistance(point2)>60)  {
				var toNextVec = point2.subtract(currentPoint);

				toNextVec = toNextVec.normalize(Math.floor(30 + Math.random()*30));
				currentPoint = currentPoint.add(toNextVec);
				newPoints.push(currentPoint);
				//console.log(currentPoint);

			}

			return newPoints;
		};
	},

	generateImmovableMaze: function(game, vertices) {
		this.game = game;

		var maxOffset = 5;

		var centerResults = this.centerPolygon(vertices);

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (Math.ceil(centerResults.width) + 2*maxOffset)/window.devicePixelRatio;
		textureCanvas.height = (Math.ceil(centerResults.height) + 2*maxOffset)/window.devicePixelRatio;

		var leftShift = centerResults.leftShift - maxOffset,
			topShift = centerResults.topShift - maxOffset;

		//create a deep copy of edges array
		var verticesCopy = vertices.map(function(vertex){
			return vertex.clone();
		}, this);

		verticesCopy.forEach(function(vertex) {
			vertex.add(-leftShift, -topShift);
		}, this);

		paper.setup(textureCanvas);

		// turn phaser points array to array of paper points
		// also shrink for mobile version
		var pointsArray = verticesCopy.map(function(vertex){
			return new paper.Point(vertex.x, vertex.y);
			
		}, this);	

		var edgePath = new paper.Path(pointsArray);
		edgePath.fillColor = '#4d525c';
		edgePath.closed = true;		

		var clonePath1 = edgePath.clone();
		inset(edgePath);
		edgePath.fillColor = '#848b98';
		var clonePath2 = edgePath.clone();
		inset(edgePath);
		edgePath.fillColor = '#cfd2d7';

		// account for mobile screens
		if (!this.game.device.desktop) {
			edgePath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));			
			clonePath1.scale(1/window.devicePixelRatio, new paper.Point(0, 0));			
			clonePath2.scale(1/window.devicePixelRatio, new paper.Point(0, 0));			
		}

		clonePath2.insertAbove(clonePath1);
		edgePath.insertAbove(clonePath2);		

		paper.view.draw();

		var frameWidth = Math.ceil(centerResults.width) + 2*maxOffset,
			frameHeight = Math.ceil(centerResults.height) + 2*maxOffset;

		var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addSpriteSheet(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		function inset(path) {
		    var bisecs = [];
		    path.segments.forEach(function(segment){
		        var fromNextVec = segment.next.point.subtract(segment.point).normalize(3),
		            fromPrevVec = segment.previous.point.subtract(segment.point).normalize(3),
		            
		            bisec = fromNextVec.add(fromPrevVec);
		            
		        bisecs.push(bisec);
		    }, this);
		    
		    for (var s in path.segments) {
		        path.segments[s].point = path.segments[s].point.add(bisecs[s])
		    }
		}
	},

	generateInterdim: function(game, vertices) {
		this.game = game;

		var centerResults = this.centerPolygon(vertices);

		var textureCanvas = document.createElement('canvas');

		var maxOffsetX = Math.ceil(centerResults.width)*2/window.devicePixelRatio,
			maxOffsetY = 5/window.devicePixelRatio;

		textureCanvas.width = (Math.ceil(centerResults.width/window.devicePixelRatio) + maxOffsetX)*5;
		textureCanvas.height = Math.ceil(centerResults.height/window.devicePixelRatio) + 2*maxOffsetY;

		var leftShift = centerResults.leftShift - maxOffsetX/2,
			topShift = centerResults.topShift - maxOffsetY;

		//create a deep copy of edges array
		var verticesCopy = vertices.map(function(vertex){
			return vertex.clone();
		}, this);

		verticesCopy.forEach(function(vertex) {
			vertex.add(-leftShift, -topShift);
		}, this);

		paper.setup(textureCanvas);

		//turn phaser points array to array of paper points
		var pointsArray = verticesCopy.map(function(vertex){
			return new paper.Point(vertex.x, vertex.y);
		}, this);

		var edgePath = new paper.Path(pointsArray);
		edgePath.strokeColor = '#ff0000';
		edgePath.closed = true;

		if(!this.game.device.desktop) {
			edgePath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
		}

		var stripesRect = edgePath.bounds.clone();

		stripesRect = stripesRect.expand(maxOffsetX);

		var stripes = generateStripes(game, stripesRect);

		var redCompPath = new paper.CompoundPath();

		stripes.forEach(function(stripe){
		    var subStripe = edgePath.intersect(stripe);
		    subStripe.data = {initialPos: new paper.Point(subStripe.position)};
		    redCompPath.addChild(subStripe);
		    stripe.opacity = 0;
		}, this);

		edgePath.opacity = 0;

		redCompPath.fillColor = '#f52400';

		var greenCompPath = redCompPath.clone();
		greenCompPath.fillColor = '#b3ec1a';
		greenCompPath.blendMode = 'add';

		greenCompPath.children.forEach(function(subStripe){
		    subStripe.data.initialPos = new paper.Point(subStripe.position);
		}, this);

		var blueCompPath = redCompPath.clone();
		blueCompPath.fillColor = '#007df5';
		blueCompPath.blendMode = 'add';

		blueCompPath.children.forEach(function(subStripe){
		    subStripe.data.initialPos = new paper.Point(subStripe.position);
		}, this);

		// for mobile screen
		/*if (!this.game.device.desktop) {
			redCompPath.children.forEach(function(subStripe){
				subStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));
			}, this);				
			greenCompPath.children.forEach(function(subStripe){
				subStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));
			}, this);
			blueCompPath.children.forEach(function(subStripe){
				subStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));
			}, this);
		}*/

		for (var j=0; j<4; j++) {
		    
		    var redClone = redCompPath.clone(),
		        greenClone = greenCompPath.clone(),
		        blueClone = blueCompPath.clone();
		    
		    var discrepencyMagnitude = Math.min(Math.exp(-Math.pow(j - 6, 2)/100))/window.devicePixelRatio;
		    for (var i=0; i<redCompPath.children.length; i++) {
		        var randomVel = getAppNormal(),
		            redSubStripe = redCompPath.children[i],
		            greenSubStripe = greenCompPath.children[i],
		            blueSubStripe = blueCompPath.children[i];
		                
		        moveStripe(redSubStripe, randomVel, 12*discrepencyMagnitude);
		        moveStripe(greenSubStripe, randomVel, 20*discrepencyMagnitude);
		        moveStripe(blueSubStripe, randomVel, 15*discrepencyMagnitude);
		    };
		    
		    redCompPath.translate(new paper.Point(maxOffsetX/2*3, 0));
		    redCompPath.children.forEach(function(redSubStripe){
		        redSubStripe.data.initialPos.x += maxOffsetX/2*3;
		        /*if (!this.game.device.desktop) {
		        	redSubStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));	
		        }*/		        
		    }, this);
		    
		    greenCompPath.translate(new paper.Point(maxOffsetX/2*3, 0));
		    greenCompPath.children.forEach(function(greenSubStripe){
		        greenSubStripe.data.initialPos.x += maxOffsetX/2*3;
		        /*if (!this.game.device.desktop) {
		        	greenSubStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));	
		        }*/
		    }, this);
		    
		    blueCompPath.translate(new paper.Point(maxOffsetX/2*3, 0));
		    blueCompPath.children.forEach(function(blueSubStripe){
		        blueSubStripe.data.initialPos.x += maxOffsetX/2*3;
		        /*if (!this.game.device.desktop) {
		        	blueSubStripe.scale(window.innerHeight/this.game.height, new paper.Point(0, 0));	
		        }*/
		    }, this);
		};

		paper.view.draw();

		var frameWidth = textureCanvas.width/5,
			frameHeight = textureCanvas.height;

		var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addSpriteSheet(spriteSheetName, null, textureCanvas, frameWidth, frameHeight, 5, 0, 0);
		//game.cache.addImage(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		function generateStripes(game, rectangle) {
		    var stripes = [],
		        currentY = rectangle.top,
		        stripeHeight = 10;
		        if (!game.device.desktop) {
		        	stripeHeight /= window.devicePixelRatio;
		        }
		        
		    while (currentY<rectangle.bottom - stripeHeight) {
		        var stripe = new paper.Path.Rectangle(new paper.Point(rectangle.left, currentY), 
		            new paper.Size(rectangle.width, stripeHeight));
		            
		        stripe.strokeColor = '#ff0000';
		        stripes.push(stripe);
		        currentY += stripeHeight;
		        stripeHeight = (10 + Math.random()*20);
		        if (!game.device.desktop) {
		        	stripeHeight /= window.devicePixelRatio;
		        }
		    }
		    
		    var lastStripe = new paper.Path.Rectangle(new paper.Point(rectangle.left, currentY), 
		        new paper.Point(rectangle.right, rectangle.bottom));
		            
		    lastStripe.strokeColor = '#ff0000';
		    stripes.push(lastStripe);
		    
		    return stripes;
		}

		function moveStripe(stripe, randomBias, constBias) {
		    stripe.position.x += stripe.data.initialPos.x - 
		                stripe.position.x + constBias*randomBias;
		}

		function getAppNormal() {
		    return (Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random() - 3)/3;
		}
	},

	generateMovableBrain: function(game, vertices, fillColor) {
		this.game = game;

		//console.log(colorSet);

		switch (fillColor) {
			case 'green':
				var colorSet = {high: '#a5f500', middle: '#9500c9', back: '#47d552'};
				break;
			case 'orange':
				var colorSet = {high: '#ffde0c', middle: '#0061c9', back: '#d0c654'};
				break;
			case 'purple':
				var colorSet = {high: '#bf8dfe', middle: '#7d2400', back: '#8859c3'};
				break;
			case 'lightGreen':
				var colorSet = {high: '#68fbbe', middle: '#c93a00', back: '#59c398'};
				break;
		}

		var maxOffset = 5;

		var centerResults = this.centerPolygon(vertices);

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (Math.ceil(centerResults.width) + 2*maxOffset)/window.devicePixelRatio;
		textureCanvas.height = (Math.ceil(centerResults.height) + 2*maxOffset)/window.devicePixelRatio;

		var leftShift = centerResults.leftShift - maxOffset,
			topShift = centerResults.topShift - maxOffset;

		//create a deep copy of edges array
		var verticesCopy = vertices.map(function(vertex){
			return vertex.clone();
		}, this);

		verticesCopy.forEach(function(vertex) {
			vertex.add(-leftShift, -topShift);
		}, this);

		paper.setup(textureCanvas);

		//turn nested array to array of points
		var pointsArray = verticesCopy.map(function(vertex){
			return new paper.Point(vertex.x, vertex.y);
		}, this);

		// find anchor point and vector to align points along longest edge
		// to decrese the bounding box
		var lengthsArray = pointsArray.map(function(point, index, arr){
			if (index<arr.length-1) {
				var nextPoint = arr[index+1];			
			} else {
				var nextPoint = arr[0];
			}
			var length = nextPoint.subtract(point).length;			
			return [point, length, nextPoint];
		}, this);

		lengthsArray.sort(function(a, b){
			if (a[1]>b[1]) {
				return -1;
			} else {
				return 1;
			}
		});

		var anchorPoint = lengthsArray[0][0].clone(),
			anchorVec = lengthsArray[0][2].subtract(lengthsArray[0][0]),
			anchorAngle = anchorVec.angle;

		var rotatedPoints = pointsArray.map(function(point){
			return point.rotate(-anchorAngle, anchorPoint);
		}, this);
		//console.log(lengthsArray[3][1]);

		var sharpEdgesPath = new paper.Path(rotatedPoints);
		sharpEdgesPath.closed = true;

		var smoothRadius = 10;

		if (!this.game.device.desktop) {
			smoothRadius /= window.devicePixelRatio;
		}

		var edgePath = new paper.Path(smoothAngles(sharpEdgesPath, 10));
		edgePath.closed = true;
		edgePath.fillColor = 'yellow';

		var voronoi = new Voronoi();

		var bbox = {xl: Math.round(edgePath.bounds.left), xr: Math.round(edgePath.bounds.right), yt: Math.round(edgePath.bounds.top), yb: Math.round(edgePath.bounds.bottom)};

		var numberOfCells = new paper.Size(Math.round((bbox.xr-bbox.xl)/(edgePath.bounds.height*0.8)), Math.round((bbox.yb-bbox.yt)/(edgePath.bounds.height*0.8)));

		var sites = generateSites(edgePath, numberOfCells);	

		var diagram = voronoi.compute(sites, bbox);

		var subtractedPathHigh = new paper.CompoundPath();
		var subtractedPathMiddle = new paper.CompoundPath();
		var subtractedPathBottom = new paper.CompoundPath();	
		
		if (diagram) {
			for (var i =0, l=sites.length; i<l; i++) {
				var cell = diagram.cells[sites[i].voronoiId];
				if (cell) {
					var halfedges = cell.halfedges,
						length = halfedges.length;

					if (length > 2) {
						var points = [];

						for (var j = 0; j<length; j++) {
							var v = halfedges[j].getEndpoint();
							points.push(new paper.Point(v));

						}

						var holePath = createPath(points, sites[i]);
						
						/*var holePathBottom = holePath.clone();
						holePathBottom.scale(0.4);
						holePath.scale(1.05);*/

						//var crossings = holePath.getCrossings(edgePath);

						if (edgePath.contains(holePath.position) && Math.abs(holePath.area)>edgePath.area/sites.length) {
							//console.log(holePath.area);
							var holePathMiddle = holePath.clone();
							holePathMiddle.scale(0.2);
							if (holePath.intersects(edgePath)) {
								var interHolePath = edgePath.intersect(holePath);
								subtractedPathHigh.addChild(interHolePath);
								interHolePath.scale(0.9);
								holePath.opacity = 0;
							} else {
								subtractedPathHigh.addChild(holePath);
							}
							
							subtractedPathMiddle.addChild(holePathMiddle);	
						} else {
							holePath.opacity = 0;
						}

						
						//subtractedPathBottom.addChild(holePathBottom);
					}
				}
			}
		}

		/*var highFinalPath = edgePath.subtract(subtractedPathHigh);
		highFinalPath.fillColor = colorSet.high;
		subtractedPathHigh.opacity = 0;

		var middleFinalPath = edgePath.subtract(subtractedPathMiddle);
		middleFinalPath.fillColor = colorSet.middle;
		subtractedPathMiddle.opacity = 0;

		var bottomFinalPath = edgePath.subtract(subtractedPathBottom);
		bottomFinalPath.fillColor = colorSet.bottom;
		subtractedPathBottom.opacity = 0;

		middleFinalPath.insertAbove(bottomFinalPath);
		highFinalPath.insertAbove(middleFinalPath);*/

		subtractedPathHigh.fillColor = colorSet.high;
		subtractedPathHigh.strokeColor = colorSet.back;

		subtractedPathMiddle.fillColor = colorSet.middle;
			
		edgePath.fillColor = colorSet.back;
		//edgePath.opacity = 0;

		subtractedPathHigh.rotate(anchorAngle, anchorPoint);
		subtractedPathMiddle.rotate(anchorAngle, anchorPoint);
		edgePath.rotate(anchorAngle, anchorPoint);

		if (!this.game.device.desktop) {
			edgePath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			subtractedPathHigh.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			subtractedPathMiddle.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
		}

		paper.view.draw();

		var frameWidth = Math.ceil(centerResults.width) + 2*maxOffset,
			frameHeight = Math.ceil(centerResults.height) + 2*maxOffset;

		var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addImage(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		function generateSites(path, sizeNumbers) {

			var sites = [],
				sectorWidth = path.bounds.width/sizeNumbers.width,
				sectorHeight = path.bounds.height/sizeNumbers.height;

			for (var i=-1; i<sizeNumbers.width+1; i++) {
				for (var j = -1; j<sizeNumbers.height+1; j++) {
					var point = new paper.Point(path.bounds.left + (i + 0.5 + (Math.random()-0.5)/2)*sectorWidth, 
						path.bounds.top + (j+0.5 + (Math.random()-0.5)/2)*sectorHeight);
					if (j % 2) 
						point.x += sectorWidth/2;
					sites.push(point);
				}
			}

			return sites;
		};

		function createPath(points, center) {
			var path = new paper.Path();

			path.fillColor = '#530037';
			//path.opacity = 0;

			path.closed = true;

			for (var i = 0, l=points.length; i<l; i++) {
				var point = points[i];
				var next = points[(i+1)== points.length? 0: i+1];

				var vector = next.subtract(point).divide(4);

				path.add({point: point.add(vector), handleIn: vector.multiply(-1), handleOut: vector});
				
			}

			return path;		
		};

		function smoothAngles(path, radius) {
			var newSegments = [];
			    
			path.segments.forEach(function(segment){
			        
			    var toPreviousDirection = segment.previous.point.subtract(segment.point),
			        toNextDirection = segment.next.point.subtract(segment.point),
			        localPreviousRadius = Math.min(radius, toPreviousDirection.length*0.3),
			        localNextRadius = Math.min(radius, toNextDirection.length*0.3);
			            
			    toPreviousDirection = toPreviousDirection.normalize(localPreviousRadius);
			    toNextDirection = toNextDirection.normalize(localNextRadius);
			        
			    var newToPreviousPoint = segment.point.add(toPreviousDirection),
			        newToNextPoint= segment.point.add(toNextDirection),
			            
			        newToPreviousHandleIn = toPreviousDirection.clone(),
			        newToPreviousHandleOut = segment.point.subtract(newToPreviousPoint).normalize(localPreviousRadius*0.5),
			            
			        newToNextHandleIn = segment.point.subtract(newToNextPoint).normalize(localNextRadius*0.5),
			        newToNextHandleOut = toNextDirection.clone(),
			            
			        toPreviousSegment = new paper.Segment(newToPreviousPoint, 
			            newToPreviousHandleIn, newToPreviousHandleOut),
			                
			        toNextSegment = new paper.Segment(newToNextPoint, newToNextHandleIn, 
			            newToNextHandleOut);
			            
			            
			    newSegments.push(toPreviousSegment);
			    newSegments.push(toNextSegment);
			        
			}, this);
			return newSegments;
		};
	},

	generateImmovableBrain: function(game, vertices) {
		this.game = game;

		var maxOffset = 5;

		var centerResults = this.centerPolygon(vertices);

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (Math.ceil(centerResults.width) + 2*maxOffset)/window.devicePixelRatio;
		textureCanvas.height = (Math.ceil(centerResults.height) + 2*maxOffset)/window.devicePixelRatio;

		var leftShift = centerResults.leftShift - maxOffset,
			topShift = centerResults.topShift - maxOffset;

		//create a deep copy of edges array
		var verticesCopy = vertices.map(function(vertex){
			return vertex.clone();
		}, this);

		verticesCopy.forEach(function(vertex) {
			vertex.add(-leftShift, -topShift);
		}, this);

		paper.setup(textureCanvas);

		//turn nested array to array of points
		var pointsArray = verticesCopy.map(function(vertex){
			return new paper.Point(vertex.x, vertex.y);
		}, this);

		/*var edgePath = new paper.Path(pointsArray);
		edgePath.closed = true;
		edgePath.fillColor = 'red';

		var numberOfCells = new paper.Size(Math.round((edgePath.bounds.width)/20), Math.round((edgePath.bounds.height)/20));

		var sites = generateSites(edgePath, numberOfCells);	

		//filter sites that doesn't go edge path
		sites = sites.filter(function(site){
			if (edgePath.hitTest(site)) return true;
			return false;
		}, this);
		sites = sites.concat(pointsArray);

		//turn paper points to regulat 2 dimensional array
		var sitesArray = sites.map(function(site){
			return [site.x, site.y];
		}, this);		

		var delaunay = new Delaunator(sitesArray);

		var trianglesPaths = [];
		var colorArray = ['#fbf8dc', '#606016', '#313100', '#201f00', '#1b1b00'];
		var colorIndex = 0;

		for (var i = 0; i<delaunay.triangles.length; i+=3) {

			var trianglePath = new paper.Path([sitesArray[delaunay.triangles[i]], sitesArray[delaunay.triangles[i+1]], sitesArray[delaunay.triangles[i+2]]]);
			//trianglePath.strokeColor = '#000000';	
			trianglePath.fillColor = colorArray[colorIndex];
			colorIndex = (colorIndex < 4) ? colorIndex + 1 : 0;
			trianglePath.closed = true;
			trianglesPaths.push(trianglePath);
			//change the color array to increase probabillity of getting old colors
			var colorArrayCopy = colorArray.slice();
			colorArrayCopy.splice(colorIndex, 1);
			colorArray.concat(colorArrayCopy);		

		}

		edgePath.opacity = 0;*/

		var initialPath = new paper.Path(pointsArray);
		initialPath.closed = true;
		initialPath.strokeWidth = 1;

		if (!this.game.device.desktop) {
			initialPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
		}		

		serialInsetAndSmooth(game, initialPath, initialPath.position, 2);

		paper.view.draw();

		var frameWidth = (Math.ceil(centerResults.width) + 2*maxOffset),
			frameHeight = (Math.ceil(centerResults.height) + 2*maxOffset);

		var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addImage(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		/*function splitSeg(point1, point2) {

			var newPoints = [];

			var currentPoint = point1;

			while (currentPoint.getDistance(point2)>40)  {
				var toNextVec = point2.subtract(currentPoint);

				toNextVec = toNextVec.normalize(Math.floor(5 + Math.random()*35));
				currentPoint = currentPoint.add(toNextVec);
				newPoints.push(currentPoint);
				//console.log(currentPoint);

			}

			return newPoints;
		}

		function generateSites(path, sizeNumbers) {

			var sites = [],
				sectorWidth = path.bounds.width/sizeNumbers.width,
				sectorHeight = path.bounds.height/sizeNumbers.height;

			for (var i=-1; i<sizeNumbers.width+1; i++) {
				for (var j = -1; j<sizeNumbers.height+1; j++) {
					var point = new paper.Point(path.bounds.left + (i + 0.5 + (Math.random()-0.5)/2)*sectorWidth, 
						path.bounds.top + (j+0.5 + (Math.random()-0.5)/2)*sectorHeight);
					if (j % 2) 
						point.x += sectorWidth/2;
					sites.push(point);
				}
			}

			return sites;
		};*/

		function smoothAngles(path, radius) {
		    var newSegments = [];
		    
		    path.segments.forEach(function(segment){
		        
		        var toPreviousDirection = segment.previous.point.subtract(segment.point),
		            toNextDirection = segment.next.point.subtract(segment.point),
		            localPreviousRadius = Math.min(radius, toPreviousDirection.length*0.3),
		            localNextRadius = Math.min(radius, toNextDirection.length*0.3);
		            
		        toPreviousDirection = toPreviousDirection.normalize(localPreviousRadius);
		        toNextDirection = toNextDirection.normalize(localNextRadius);
		        
		        var newToPreviousPoint = segment.point.add(toPreviousDirection),
		            newToNextPoint= segment.point.add(toNextDirection),
		            
		            newToPreviousHandleIn = toPreviousDirection.clone(),
		            newToPreviousHandleOut = segment.point.subtract(newToPreviousPoint).normalize(localPreviousRadius*0.5),
		            
		            newToNextHandleIn = segment.point.subtract(newToNextPoint).normalize(localNextRadius*0.5),
		            newToNextHandleOut = toNextDirection.clone(),
		            
		            toPreviousSegment = new paper.Segment(newToPreviousPoint, 
		                newToPreviousHandleIn, newToPreviousHandleOut),
		                
		            toNextSegment = new paper.Segment(newToNextPoint, newToNextHandleIn, 
		                newToNextHandleOut);
		            
		            
		        newSegments.push(toPreviousSegment);
		        newSegments.push(toNextSegment);
		        
		    }, this);
		    return newSegments;
		};

		function serialInsetAndSmooth(game, path, point, number) {
		    var currentPath = path;
		    var smoothRadius = 10;
		    if (!game.device.desktop) {
		    	smoothRadius /= window.devicePixelRatio;
		    }

		    var smoothedPath = new paper.Path(smoothAngles(currentPath, smoothRadius));
		    smoothedPath.closed = true;
		    smoothedPath.fillColor = '#2d1a23';
		    
		    for (var i = 0; i<number; i++) {
		        var insetPoints = inset(currentPath, point, 0.2),
		            insetPath = new paper.Path(insetPoints);
		        
		        insetPath.closed = true;
		        //insetPath.strokeColor = 'red';
		        
		        currentPath = insetPath;
		        
		        var insetSmoothedPath = new paper.Path(smoothAngles(insetPath, smoothRadius));
		        insetSmoothedPath.closed = true;
		        if (i==0) {
		            insetSmoothedPath.fillColor = '#4e2d3b';
		        } else if (i==1) {
		            insetSmoothedPath.fillColor = '#736068'
		        }
		    }
		};

		function inset(path, point, magnitude) {
		    var newPathPoints = [];
		    
		    path.segments.forEach(function(segment){
		        var toPointVec = point.subtract(segment.point),
		            toPointDistance = toPointVec.length,
		            insetMagnitude = toPointDistance*magnitude;
		            
		        toPointVec = toPointVec.normalize(insetMagnitude);
		        
		        var insetPoint = segment.point.add(toPointVec);
		        newPathPoints.push(insetPoint);
		            
		    }, this);
		    
		    return newPathPoints;
		};
	},

	centerPolygon: function(vertices) {

		var verticesCopy = vertices.slice();

		//console.log(vertices);

		verticesCopy.sort(function(a,b){
			if (a.x < b.x) {
				return -1
			} else {
				return 1;
			}
		}, this);

		var leftBorder = verticesCopy[0].x ,
			rightBorder = verticesCopy[vertices.length - 1].x;

		verticesCopy.sort(function(a, b){
			if (a.y < b.y) {
				return -1;
			} else {
				return 1;
			}
		}, this);

		var topBorder = verticesCopy[0].y,
			bottomBorder = verticesCopy[vertices.length - 1].y;			

		var width = rightBorder - leftBorder,
			height = bottomBorder - topBorder;

		return {width: width, height: height, leftShift: leftBorder, topShift: topBorder};
	},

	clearTextures: function() {
		this.textureNameArray.forEach(function(animName){
			this.game.cache.removeImage(animName);
		}, this);

		this.textureNameArray = [];
		this.textureCanvasArray = [];
	}
};

tipArrowGenerator = {
	textureNameArray: [],
	textureCanvasArray: [],

	generateArrow: function(game, pointsArray, dashed) {

		this.game = game;

		//find height and width of the target canvas

		var pointsArrayCopy = pointsArray.slice();

		pointsArrayCopy.sort(function(a,b){
			if (a.x < b.x) {
				return -1
			} else {
				return 1;
			}
		}, this);

		var leftBorder = pointsArrayCopy[0].x ,
			rightBorder = pointsArrayCopy[pointsArray.length - 1].x;

		pointsArrayCopy.sort(function(a, b){
			if (a.y < b.y) {
				return -1;
			} else {
				return 1;
			}
		}, this);

		var topBorder = pointsArrayCopy[0].y,
			bottomBorder = pointsArrayCopy[pointsArray.length - 1].y;

		var width = rightBorder - leftBorder,
			height = bottomBorder - topBorder;

		//set canvas for paperJS
		var maxOffset = 20;

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (width + 2*maxOffset)/window.devicePixelRatio;
		textureCanvas.height = height + 2*maxOffset/window.devicePixelRatio;

		var leftShift = leftBorder - maxOffset,
			topShift = topBorder - maxOffset;

		paper.setup(textureCanvas);

		var paperPoints = pointsArray.map(function(phPoint){
			return new paper.Point(phPoint.x - leftShift, phPoint.y - topShift);
		}, this);

		var arrowPath = new paper.Path(paperPoints);
		//arrowPath.strokeColor = '#063968';
		arrowPath.strokeColor = '#ff2c8d';
		arrowPath.strokeWidth = 5;

		/*var curvesCopy = arrowPath.curves.slice();
		curvesCopy.forEach(fractionCurve, this);*/

		arrowPath.smooth({ type: 'catmull-rom'});
		if (dashed) {
			arrowPath.dashArray = [10, 4];
		}

		addArrow(arrowPath);		

		if (!this.game.device.desktop) {
			arrowPath.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
			arrowPath.strokeWidth /= window.devicePixelRatio;
		}

		//arrowPath.segments.forEach(assignHandles, this);
		//arrowPath.segments.forEach(initialShake, this);

		

		paper.view.draw();

		var frameWidth = width + 2*maxOffset,
			frameHeight = height + 2*maxOffset;

		var spriteSheetName = 'arrowTexture'+this.textureNameArray.length;

		this.textureCanvasArray.push(textureCanvas);
		this.textureNameArray.push(spriteSheetName);

		game.cache.addImage(spriteSheetName, null, textureCanvas);

		paper.project.remove();

		return {name: spriteSheetName, left: leftShift, top: topShift, width: frameWidth, height: frameHeight};

		function addArrow(path) {
		    var lastBackVec = path.lastSegment.previous.point.subtract(path.lastSegment.point),
		        leftPoint = path.lastSegment.point.add(lastBackVec.normalize(20).rotate(20, new paper.Point())),
		        frontPoint = path.lastSegment.point.add(lastBackVec.normalize(-10)),
		        rightPoint = path.lastSegment.point.add(lastBackVec.normalize(20).rotate(-20, new paper.Point()));
		        
		    path.addSegments([leftPoint, frontPoint, rightPoint]);
		}

		function fractionCurve(curve) {
		    if (curve && curve.length>110) {
		        var newCurve = curve.divideAt(100);
		        fractionCurve(newCurve);
		        newCurve.segment1.point.data = {shake: true};
		    } else if (curve) {
		        curve.segment1.point.date = {shake: false};
		    }
		}

		function assignHandles(segment) {
		    if (segment.previous && segment.next) {
		        segment.handleIn = segment.previous.point.subtract(segment.point).normalize(10);
		        segment.handleOut = segment.next.point.subtract(segment.point).normalize(10);
		          
		    }
		    if (!segment.point.data) {
		        segment.point.data = {};
		    }  
		    
		}

		function initialShake(segment) {
		    if (segment.point.data.shake && segment.curve.length > 10) {
		        segment.point.data.initialHandleInAngle = segment.handleIn.angle;
		        var segmentAngle = -30 + Math.random()*60;
		        
		        segment.handleIn = segment.handleIn.rotate(segmentAngle, new paper.Point());
		        segment.handleOut = segment.handleOut.rotate(segmentAngle, new paper.Point());
		        
		        segment.point.data.phase = 0;
		        segment.point.data.angleDelta = 3;
		    }
		    
		}

	},

	clearTextures: function() {
		this.textureNameArray.forEach(function(animName){
			this.game.cache.removeImage(animName);
		}, this);

		this.textureNameArray = [];
		this.textureCanvasArray = [];
	}
};

teleportScreenGenerator = {
	create: function(game) {
		var teleportScreenCanvas = document.createElement('canvas');

		teleportScreenCanvas.width = 960*4/window.devicePixelRatio;
		teleportScreenCanvas.height = 640*6/window.devicePixelRatio;

		/*var jsonFile = document.getElementById('JSONFile');

		console.log(jsonFile);*/

		paper.setup(teleportScreenCanvas);

		paper.project.clear();

		$.getJSON('assets/images/teleportScreen.json', function (data) {
			paper.project.importJSON(data);
			
	  	});

	  	if (!game.device.desktop) {
	  		paper.project.view.scale(1/window.devicePixelRatio, new paper.Point(0, 0));
	  	}

		paper.view.draw();

		game.cache.addSpriteSheet('teleportScreen', null, teleportScreenCanvas, 960, 640, 24, 0, 0);
	},

	clearProject: function() {
		paper.project.remove();
	}
}

function tweenTint(game, object, startColor, endColor, time) {
	var colorBlend = {step: 0};
	var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
	colorTween.onUpdateCallback(function(){
		object.tint = Phaser.Color.interpolateColor(endColor, startColor, 100, colorBlend.step);
	}, this);
	object.tint = startColor;
	colorTween.start();

	return colorTween;
}

