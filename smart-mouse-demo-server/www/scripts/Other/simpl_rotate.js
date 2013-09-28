(function() {
	var socket;
	var canvas;
	var context;
	var cubeWrapper;

	var OBJECT_SELECTED = false;
	var current_mouse_position;
	var timeout = 0;
	var last_timestamp;
	var SERVER_PORT = 7596;

	var rotationTimeout = 0;
	var last_rotation_timestamp;

	var sideLength = 50;
	var width = 300;
	var height = 300;
	var xShift = width / 2;
	var yShift = height / 2;
	var perspective = sideLength * 8;

	var xzRotation = 0;
	var yzRotation = 0;
	var xyRotation = 0;

	var isColored = false;

	var cube = {
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

	var calcCube = {
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

	var lgth = cube.sides.length;

	function rotate(roll, pitch, yaw) {

		xzRotation += yaw;
		xyRotation += roll;
		yzRotation += pitch;

		for ( var i = 0; i < lgth; i++) {

			var side = cube.sides[i];
			var calcSide = calcCube.sides[i];

			for ( var j = 0; j < 4; j++) {

				var corner = side.corners[j];

				var calc1 = calc(corner.x, corner.y, xyRotation, 1);
				var calc2 = calc(calc1.p1, corner.z, xzRotation, 1);
				var calc3 = calc(calc1.p2, calc2.p2, yzRotation, -1);
				calcSide.corners[j].x = (calc2.p1 * perspective)
						/ (perspective - calc3.p2) + xShift;
				calcSide.corners[j].y = (calc3.p1 * perspective)
						/ (perspective - calc3.p2) + yShift;
			}

			var light = side.light;

			var calc1 = calc(light.x, light.y, xyRotation, 1);
			var calc2 = calc(calc1.p1, light.z, xzRotation, 1);
			var calc3 = calc(calc1.p2, calc2.p2, yzRotation, -1);
			calcSide.light = calc3.p2;
		}

		ctx.clearRect(0, 0, width, height);

		for ( var i = 0; i < lgth; i++) {

			var calcSide = calcCube.sides[i];

			var brightness = Math.floor(calcSide.light);
			if (brightness > 255)
				brightness = 255;
			if (brightness < 30)
				continue;

			var fillRGBA = "";
			if (isColored) {
				var colorCode = cube.sides[i].color;
				fillRGBA = "rgba(" + colorCode.replace(/b/g, brightness)
						+ ",1)";
			} else
				fillRGBA = "rgba(" + 0 + ", " + brightness + "," + brightness
						+ ",1)";

			ctx.fillStyle = fillRGBA;

			var curCorner = calcSide.corners;

			ctx.beginPath();
			ctx.moveTo(curCorner[0].x, curCorner[0].y);
			ctx.lineTo(curCorner[1].x, curCorner[1].y);
			ctx.lineTo(curCorner[2].x, curCorner[2].y);
			ctx.lineTo(curCorner[3].x, curCorner[3].y);
			ctx.lineTo(curCorner[0].x, curCorner[0].y);
			ctx.fill();

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

	var connect = function() {
		var server_options = {
			port : SERVER_PORT,
			rememberTransport : false,
			transports : [ "websocket", "xhr-polling", "xhr-multipart",
					"flashsocket" ]
		};

		socket = io.connect(document.URL);

		socket.on("message", function(data) {
			console.log(data);
			if (data && data.value) {
				handleRotation(data);
			}
			// if(data){
			// if(OBJECT_SELECTED){
			// moveCircle(data);
			// }
			// }
		});

		socket.on("disconnect", function() {
			console.log("The connection was terminated");
			// socket.close();
		});
	};

	var init_canvas = function() {
		canvas = document.getElementById('myBox');
		ctx = canvas.getContext('2d');
		// annimation = window.setInterval(rotate, 100);
		// updateStats();

		rotate(0, 0, 0);
		register_event_listeners();
	};

	var register_event_listeners = function() {
		addEvent(document, "click", click_handler);
	};

	var click_handler = function(event) {
		OBJECT_SELECTED = !OBJECT_SELECTED ? true : false;
		if (!OBJECT_SELECTED) {
			draw_circle({
				x : event.pageX,
				y : event.pageY
			}, 50, {
				refresh : true,
				fill : false
			});
			return;
		}
		var x = event.pageX;
		var y = event.pageY;
		current_mouse_position = {
			x : event.pageX,
			y : event.pageY
		};
		draw_circle({
			x : event.pageX,
			y : event.pageY
		}, 50, {
			refresh : true,
			fill : true
		});
	};

	var handleRotation = function(data) {
		if (!cubeWrapper) {
			return;
		}

		var deltaThetas = data.value;
		// deltaThetas.sort(function(o1, o2){
		// return (o1.timestamp - o2.timestamp);
		// });

		for ( var i = 0; i < deltaThetas.length; i++) {
			var deltaThetaRoll = deltaThetas[i].deltaThetaRoll ? deltaThetas[i].deltaThetaRoll
					* (Math.PI / 180)
					: 0;
			var deltaThetaPitch = deltaThetas[i].deltaThetaPitch ? deltaThetas[i].deltaThetaPitch
					* (Math.PI / 180)
					: 0;
			var deltaThetaYaw = deltaThetas[i].deltaThetaYaw ? deltaThetas[i].deltaThetaYaw
					* (Math.PI / 180)
					: 0;

			if (!last_rotation_timestamp) {
				last_rotation_timestamp = deltaThetas[i].timestamp;
			} else {
				// console.log(deltaThetas[i].timestamp -
				// last_rotation_timestamp);
				var dT = (deltaThetas[i].timestamp - last_rotation_timestamp) / (1000000000);
				console.log(dT);
				if (dT > 0.2) {
					rotationTimeout = 0;
				}
			}

			rotationTimeout += 5;
			last_rotation_timestamp = deltaThetas[i].timestamp;
			setTimeout(function() {
				rotate(deltaThetaRoll, deltaThetaPitch, deltaThetaYaw);
			}, rotationTimeout);
		}
	};

	var handler = function() {
		init_canvas();
		connect();
	};

	var addEvent = function(obj, eventName, callback) {
		if (obj.attachEvent) {
			obj.attachEvent("on" + eventName, callback);
		} else {
			obj.addEventListener(eventName, callback, false);
		}
	};

	addEvent(window, "load", handler);
})();
