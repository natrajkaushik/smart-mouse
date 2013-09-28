var SIDE_LENGTH = 50;
var WIDTH = 300;
var HEIGHT = 300;
var XSHIFT = WIDTH / 2;
var YSHIFT = HEIGHT / 2;
var PERSPECTIVE = SIDE_LENGTH * 8;

var XZ_ROTATION = 0;
var XY_ROTATION = 0;
var YZ_ROTATION = 0;

var cubeWrapper1 = {};
var cubeWrapper2 = {};
var cubeWrapper3 = {};
var cubeWrapper4 = {};

var currentCubeWrapper;

var IS_COLORED = false;

var generateCube = function(sideLength) {
	return {
		sides : [

		{ // FRONT
			corners : [ {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			}, {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			} ],
			light : {
				x : 0,
				y : 0,
				z : 255
			},
			color : "0,b,0"
		},

		{ // BACK
			corners : [ {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			}, {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			}, {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			} ],
			light : {
				x : 0,
				y : 0,
				z : -255
			},
			color : "0,0,b"
		},

		{ // RIGHT
			corners : [ {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			} ],
			light : {
				x : 255,
				y : 0,
				z : 0
			},
			color : "b,0,0"
		},

		{ // LEFT
			corners : [ {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			}, {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			}, {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			} ],
			light : {
				x : -255,
				y : 0,
				z : 0
			},
			color : "0,b,b"
		},

		{ // top
			corners : [ {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			}, {
				x : -1 * sideLength,
				y : -1 * sideLength,
				z : -1 * sideLength
			} ],
			light : {
				x : 0,
				y : -255,
				z : 0
			},
			color : "b,b,0"
		},

		{ // bottom
			corners : [ {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : 1 * sideLength
			}, {
				x : 1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			}, {
				x : -1 * sideLength,
				y : 1 * sideLength,
				z : -1 * sideLength
			} ],
			light : {
				x : 0,
				y : 255,
				z : 0
			},
			color : "b,0,b"
		} ]

	};
};

var calcCube1 = {
	sides : [ {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	} ]
};

var calcCube2 = {
	sides : [ {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	} ]
};

var calcCube3 = {
	sides : [ {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	} ]
};

var calcCube4 = {
	sides : [ {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	}, {
		corners : [ {}, {}, {}, {} ],
		light : 0
	} ]
};

var cube1 = generateCube(SIDE_LENGTH);
var cube2 = generateCube(SIDE_LENGTH);
var cube3 = generateCube(SIDE_LENGTH);
var cube4 = generateCube(SIDE_LENGTH);

cubeWrapper1.cube = cube1;
cubeWrapper1.sideLength = SIDE_LENGTH;
cubeWrapper1.width = WIDTH;
cubeWrapper1.height = HEIGHT;
cubeWrapper1.xShift = XSHIFT;
cubeWrapper1.yShift = YSHIFT;
cubeWrapper1.perspective = PERSPECTIVE;
cubeWrapper1.calcCube = calcCube1;

cubeWrapper1.xzRotation = XZ_ROTATION;
cubeWrapper1.xyRotation = XY_ROTATION;
cubeWrapper1.yzRotation = YZ_ROTATION;

cubeWrapper1.isColored = IS_COLORED;

cubeWrapper2.cube = cube2;
cubeWrapper2.sideLength = SIDE_LENGTH;
cubeWrapper2.width = WIDTH;
cubeWrapper2.height = HEIGHT;
cubeWrapper2.xShift = XSHIFT;
cubeWrapper2.yShift = YSHIFT;
cubeWrapper2.perspective = PERSPECTIVE;
cubeWrapper2.calcCube = calcCube2;

cubeWrapper2.xzRotation = XZ_ROTATION;
cubeWrapper2.xyRotation = XY_ROTATION;
cubeWrapper2.yzRotation = YZ_ROTATION;

cubeWrapper2.isColored = IS_COLORED;

cubeWrapper3.cube = cube3;
cubeWrapper3.sideLength = SIDE_LENGTH;
cubeWrapper3.width = WIDTH;
cubeWrapper3.height = HEIGHT;
cubeWrapper3.xShift = XSHIFT;
cubeWrapper3.yShift = YSHIFT;
cubeWrapper3.perspective = PERSPECTIVE;
cubeWrapper3.calcCube = calcCube3;

cubeWrapper3.xzRotation = XZ_ROTATION;
cubeWrapper3.xyRotation = XY_ROTATION;
cubeWrapper3.yzRotation = YZ_ROTATION;

cubeWrapper3.isColored = IS_COLORED;

cubeWrapper4.cube = cube1;
cubeWrapper4.sideLength = SIDE_LENGTH;
cubeWrapper4.width = WIDTH;
cubeWrapper4.height = HEIGHT;
cubeWrapper4.xShift = XSHIFT;
cubeWrapper4.yShift = YSHIFT;
cubeWrapper4.perspective = PERSPECTIVE;
cubeWrapper4.calcCube = calcCube4;

cubeWrapper4.xzRotation = XZ_ROTATION;
cubeWrapper4.xyRotation = XY_ROTATION;
cubeWrapper4.yzRotation = YZ_ROTATION;

cubeWrapper4.isColored = IS_COLORED;

currentCubeWrapper = cubeWrapper1;

var zoom = function(zoomFactor){
	console.log(zoomFactor);
	currentCubeWrapper.sideLength = zoomFactor * currentCubeWrapper.sideLength;
	currentCubeWrapper.cube = generateCube(currentCubeWrapper.sideLength);
	currentCubeWrapper.perspective = 8 * currentCubeWrapper.sideLength;
	rotate(0, 0, 0);
}

function rotate(roll, pitch, yaw, currentCubeWrapper, current_context, rotationMode) {
	var numSides = currentCubeWrapper.cube.sides.length;

	if(rotationMode === "ROLL"){
		currentCubeWrapper.xzRotation = 0;
		currentCubeWrapper.xyRotation += roll;
		currentCubeWrapper.yzRotation = 0;	
	}

	if(rotationMode === "PITCH"){
		currentCubeWrapper.xzRotation = 0;
		currentCubeWrapper.yzRotation += pitch;
		currentCubeWrapper.xyRotation = 0;	
	}

	if(rotationMode === "YAW"){
		currentCubeWrapper.xyRotation = 0;
		currentCubeWrapper.xzRotation += yaw;
		currentCubeWrapper.yzRotation = 0;	
	}
	

	for ( var i = 0; i < numSides; i++) {

		var side = currentCubeWrapper.cube.sides[i];
		var calcSide = currentCubeWrapper.calcCube.sides[i];

		for ( var j = 0; j < 4; j++) {

			var corner = side.corners[j];

			var calc1 = calc(corner.x, corner.y, currentCubeWrapper.xyRotation, 1);
			var calc2 = calc(calc1.p1, corner.z, currentCubeWrapper.xzRotation, 1);
			var calc3 = calc(calc1.p2, calc2.p2, currentCubeWrapper.yzRotation, -1);
			calcSide.corners[j].x = (calc2.p1 * currentCubeWrapper.perspective)/(currentCubeWrapper.perspective - calc3.p2) + currentCubeWrapper.xShift;
			calcSide.corners[j].y = (calc3.p1 * currentCubeWrapper.perspective)/(currentCubeWrapper.perspective - calc3.p2) + currentCubeWrapper.yShift;
		}

		var light = side.light;

		var calc1 = calc(light.x, light.y, currentCubeWrapper.xyRotation, 1);
		var calc2 = calc(calc1.p1, light.z, currentCubeWrapper.xzRotation, 1);
		var calc3 = calc(calc1.p2, calc2.p2, currentCubeWrapper.yzRotation, -1);
		calcSide.light = calc3.p2;
	}

	current_context.clearRect(0, 0, currentCubeWrapper.width, currentCubeWrapper.height);

	for ( var i = 0; i < numSides; i++) {

		var calcSide = currentCubeWrapper.calcCube.sides[i];

		var brightness = Math.floor(calcSide.light);
		if (brightness > 255)
			brightness = 255;
		if (brightness < 30)
			continue;

		var fillRGBA = "";
		if (currentCubeWrapper.isColored) {
			var colorCode = currentCubeWrapper.cube.sides[i].color;
			fillRGBA = "rgba(" + colorCode.replace(/b/g, brightness) + ",1)";
		} else
			fillRGBA = "rgba(" + 0 + ", " + brightness + "," + brightness
					+ ",1)";

		current_context.fillStyle = fillRGBA;

		var curCorner = calcSide.corners;

		current_context.beginPath();
		current_context.moveTo(curCorner[0].x, curCorner[0].y);
		current_context.lineTo(curCorner[1].x, curCorner[1].y);
		current_context.lineTo(curCorner[2].x, curCorner[2].y);
		current_context.lineTo(curCorner[3].x, curCorner[3].y);
		current_context.lineTo(curCorner[0].x, curCorner[0].y);
		current_context.fill();

	}
}

function calc(p1, p2, ang, pn) {

	var cosAng = Math.cos(ang);
	var sinAng = Math.sin(ang);

	var r1 = cosAng * p1 - pn * Math.sin(ang) * p2;
	var r2 = cosAng * p2 + pn * Math.sin(ang) * p1;

	return {
		"p1" : r1,
		"p2" : r2
	};

}