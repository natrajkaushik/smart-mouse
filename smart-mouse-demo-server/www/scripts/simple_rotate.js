var socket;
var canvas1, canvas2, canvas3, canvas4;
var ctx1, ctx2, ctx3, ctx4;
var container1, container2, container3, container4;

var OBJECT_SELECTED = false;
var MICRO_TO_NORMAL = 1000000;
var NANO_TO_NORMAL = 1000000000;
var STANDARD_TIMEOUT = 0.2;

var timeout = 0;
var last_timestamp;
var SERVER_PORT = 7596;

var rotationTimeout = 0;
var last_rotation_timestamp;

var scaleTimeout = 0;
var lastScaleTimestamp;

var demo_containers = [];
var current_demo_index = 0;

var current_canvas;
var current_context;
var current_container;

(function() {

	var connect = function() {
		var server_options = {
			port : SERVER_PORT,
			rememberTransport : false,
			transports : [ "websocket", "xhr-polling", "xhr-multipart",
					"flashsocket" ]
		};

		socket = io.connect(document.URL);

		socket.on("message", function(data) {
			if (data && data.action) {
				if (data.action === "ROTATION") {
					handleRotation(data);
				}
				if (data.action === "SCALE") {
					handleZoom(data);
				}
				if (data.action === "ACCELEROMETER") {
					handleSwitchTabs(data);
				}
				if(data.action === "ROTATION_MODE"){
					handleChangeRotationMode(data);
				}
			}
		});

		socket.on("disconnect", function() {
			console.log("The connection was terminated");
		});
	};

	var initCanvas = function() {
		initDemo();

		rotate(0, 0, 0, cubeWrapper1, ctx1, demo_containers[current_demo_index].rotationMode);
		rotate(0, 0, 0, cubeWrapper2, ctx2, demo_containers[current_demo_index].rotationMode);
		rotate(0, 0, 0, cubeWrapper3, ctx3, demo_containers[current_demo_index].rotationMode);
		rotate(0, 0, 0, cubeWrapper4, ctx4, demo_containers[current_demo_index].rotationMode);
		
		registerEventListeners();
	};

	var initDemo = function() {
		container1 = document.getElementById("demo1");
		container2 = document.getElementById("demo2");
		container3 = document.getElementById("demo3");
		container4 = document.getElementById("demo4");

		canvas1 = document.getElementById("myBox1");
		canvas2 = document.getElementById("myBox2");
		canvas3 = document.getElementById("myBox3");
		canvas4 = document.getElementById("myBox4");

		ctx1 = canvas1.getContext('2d');
		ctx2 = canvas2.getContext('2d');
		ctx3 = canvas3.getContext('2d');
		ctx4 = canvas4.getContext('2d');

		demo_containers.push({
			container : container1,
			context : ctx1,
			canvas : canvas1,
			cubeWrapper : cubeWrapper1,
			rotationMode : "ROLL"
		});
		demo_containers.push({
			container : container2,
			context : ctx2,
			canvas : canvas2,
			cubeWrapper : cubeWrapper2,
			rotationMode : "PITCH"
		});
		demo_containers.push({
			container : container3,
			context : ctx3,
			canvas : canvas3,
			cubeWrapper : cubeWrapper3,
			rotationMode : "YAW"
		});
		demo_containers.push({
			container : container4,
			context : ctx4,
			canvas : canvas4,
			cubeWrapper : cubeWrapper4,
			rotationMode : "ROLL"
		});

		current_canvas = canvas1;
		current_context = ctx1;
		current_container = container1;
		currentCubeWrapper = cubeWrapper1;

		generateCube(currentCubeWrapper.sideLength);
		highlightDemo();
	};

	var highlightDemo = function(index) {
		current_container.style.border = "5px red solid";
	};

	var registerEventListeners = function() {
		addEvent(document, "click", click_handler);
		addEvent(document, "mousemove", mouse_move_handler);
	};

	var click_handler = function(event) {
		OBJECT_SELECTED = !OBJECT_SELECTED ? true : false;

		current_canvas.style.left = (event.pageX - current_container.offsetLeft) + "px";
		current_canvas.style.top = (event.pageY - current_container.offsetTop) + "px";
	};

	var mouse_move_handler = function(event) {
		if (OBJECT_SELECTED) {
			current_canvas.style.left = (event.pageX - current_container.offsetLeft) + "px";
			current_canvas.style.top = (event.pageY - current_container.offsetTop) + "px";
		}
	};

	var handleSwitchTabs = function(data) {
		current_container.style.border = "2px solid green";
		current_demo_index++;
		if(current_demo_index == 4){
			current_demo_index = 0;
		}
		current_canvas = demo_containers[current_demo_index].canvas;
		current_context = demo_containers[current_demo_index].context;
		current_container = demo_containers[current_demo_index].container;
		currentCubeWrapper = demo_containers[current_demo_index].cubeWrapper;
		highlightDemo(current_demo_index);
	};

	var handleChangeRotationMode = function(data){
		var mode = data.value;
		demo_containers[current_demo_index].rotationMode = mode;
	};

	var handleRotation = function(data) {
		var deltaThetas = data.value;
		deltaThetas.sort(function(o1, o2){
			return o1.timestamp - o2.timestamp;
		});
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
				var dT = (deltaThetas[i].timestamp - last_rotation_timestamp) / NANO_TO_NORMAL;
				//console.log(dT);
				if (dT > STANDARD_TIMEOUT) {
					rotationTimeout = 0;
				}
			}

			rotationTimeout += 5;
			last_rotation_timestamp = deltaThetas[i].timestamp;
			setTimeout(function() {
				rotate(deltaThetaRoll, deltaThetaPitch, deltaThetaYaw, currentCubeWrapper, current_context, demo_containers[current_demo_index].rotationMode);
			}, rotationTimeout);
		}
	};

	var handleZoom = function(data) {
		var scalePositions = data.value;

		for ( var i = 0; i < scalePositions.length; i++) {
			if (!lastScaleTimestamp) {
				lastScaleTimestamp = scalePositions[i].timestamp;
			} else {
				var dT = (scalePositions[i].timestamp - lastScaleTimestamp) / (NANO_TO_NORMAL);
				if (dT > STANDARD_TIMEOUT) {
					scaleTimeout = 0;
				}
			}

			scaleTimeout += 5;
			lastScaleTimestamp = scalePositions[i].timestamp;
			
			var zoomFactor = 1 + Number(scalePositions[i].deltaScale);
			setTimeout(function() {
				zoom(zoomFactor);
			}, scaleTimeout);
		}
	};

	var handler = function() {
		initCanvas();
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
