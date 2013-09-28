(function(){
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
	
	var connect = function(){
		var server_options = {
			port: SERVER_PORT,
			rememberTransport: false,
			transports: ["websocket", "xhr-polling", "xhr-multipart", "flashsocket"]
		};

		socket = io.connect(document.URL);

		socket.on("message", function(data){
			console.log(data);
			if(data && data.value){
				handleRotation(data);
			}
			// if(data){
			// 	if(OBJECT_SELECTED){
			// 		moveCircle(data);
			// 	}
			// }
		});
		
		socket.on("disconnect", function(){
			console.log("The connection was terminated");
			//socket.close();
		});
	};

	/* returns a cube wrapper */
	var createCube = function(){
		var angularSpeed = 0.2; // revolutions per second
		var lastTime = 0;

		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

    	// camera
    	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    	camera.position.z = 700;

    	// scene
    	var scene = new THREE.Scene();

    	// cube
    	var colors = [0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00];
    	var materials = [];

    	for (var n = 0; n < 6; n++) {
    		materials.push([new THREE.MeshBasicMaterial({
    			color: colors[n]
    		})]);
    	}

    	var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1, materials), new THREE.MeshFaceMaterial());
    	cube.overdraw = true;
    	scene.add(cube);

    	renderer.render(scene, camera);

    	// create wrapper object that contains three.js objects
    	three = {
    		renderer: renderer,
    		camera: camera,
    		scene: scene,
    		cube: cube
    	};
                
    	return three;
	};

	/* animation for translation */
	var moveCircle = function(data){
		if(data[0].action === "CLICK"){
			return;
		}
		var touchPositions = data[0].value;

		var length = touchPositions.length;
		var count = 0;
		
		while(count < length - 1){
			var touch_point_1 = touchPositions[count];
			var touch_point_2 = touchPositions[count + 1];

			var delta_x = 2 * (touch_point_2.x - touch_point_1.x);
			var delta_y= 2 * (touch_point_2.y - touch_point_1.y);

			var timestamp_1 = touch_point_1.timestamp;
			if(timestamp_1 - last_timestamp > 200){
				timeout = 0;
			}
			var timestamp_2 = touch_point_2.timestamp;
			
			timeout += 10;
			var _move_and_draw = function(){
				return function(){
					move_and_draw(delta_x, delta_y);	
				};
			};
			last_timestamp = timestamp_2;
			setTimeout(_move_and_draw(), timeout);
			count++;
		}
	};

	var move_and_draw = function(delta_x, delta_y){
		var new_mouse_position = {};
		new_mouse_position.x = current_mouse_position.x + delta_x;
		new_mouse_position.y = current_mouse_position.y + delta_y;
		current_mouse_position = new_mouse_position;
		draw_circle(new_mouse_position, 50, {refresh:true, fill:true});
	};

	var init_canvas = function(){
		canvas = document.getElementById("demo");
		context = canvas.getContext("2d");

		//draw();
		cubeWrapper = createCube();
		register_event_listeners();
	};

	var register_event_listeners = function(){
		addEvent(canvas, "click", click_handler);
	};

	var click_handler = function(event){
		OBJECT_SELECTED = !OBJECT_SELECTED ? true : false;
		if(!OBJECT_SELECTED){
			draw_circle({x: event.pageX, y: event.pageY}, 50, {refresh: true, fill:false});
			return;
		}
		var x = event.pageX;
		var y = event.pageY;
		current_mouse_position = {x: event.pageX, y: event.pageY};
		draw_circle({x: event.pageX, y: event.pageY}, 50, {refresh: true, fill:true});
	};

	var draw = function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw_circle({x : 400, y: 400}, 50, {refresh:true, fill:false});
	};

	var draw_circle = function(origin, radius, options){
		if(options.refresh){
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		context.beginPath();
		context.strokeStyle = "red";
		context.lineWidth = 5;
		context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI, false);
		context.stroke();	
		if(options.fill){
			context.fillStyle = "yellow";
			context.fill();
		}
	};

	var handleRotation = function(data){
		if(!cubeWrapper){
			return;
		}

		var deltaThetas = data.value;
		deltaThetas.sort(function(o1, o2){
			return (o1.timestamp - o2.timestamp);
		});
		
		for(var i = 0; i < deltaThetas.length; i++){
			var deltaThetaRoll = deltaThetas[i].deltaThetaRoll * (Math.PI/180);
			var deltaThetaPitch = deltaThetas[i].deltaThetaPitch * (Math.PI/180);
			var deltaThetaYaw = deltaThetas[i].deltaThetaYaw * (Math.PI/180);

			if(!last_rotation_timestamp){
				last_rotation_timestamp = deltaThetas[i].timestamp;
			}else{
				console.log(deltaThetas[i].timestamp - last_rotation_timestamp);
				var dT = (deltaThetas[i].timestamp - last_rotation_timestamp)/(1000000000);
				if(dT > 0.2){
					rotationTimeout = 0;
				}
			}

			rotationTimeout += 20;
			last_rotation_timestamp = deltaThetas[i].timestamp;
			setTimeout(function(){
				rotateCube(-1 * deltaThetaRoll, -1 * deltaThetaPitch, -1 * deltaThetaYaw);
			}, rotationTimeout);
		}
	};

	var rotateCube = function(roll, pitch, yaw){
		three.cube.rotation.z += roll;
		//three.cube.rotation.x += pitch;
		//three.cube.rotation.y += yaw;
 		three.renderer.render(three.scene, three.camera);
	};

	var handler = function(){
		init_canvas();
		connect();
	};

	var addEvent = function(obj, eventName, callback)
	{
		if(obj.attachEvent){
			obj.attachEvent("on" + eventName, callback);
		}
		else{
			obj.addEventListener(eventName, callback, false);
		}
	};

	addEvent(window, "load", handler);
})();
