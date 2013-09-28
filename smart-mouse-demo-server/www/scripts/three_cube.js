var stats, scene, renderer, ray;
var camera, cameraControls, t;
t = 5;
//ray = new THREE.Ray( camera.position, null );
var theta = 45;
var SERVER_PORT = 7596;


// init the scene
function init() {

	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer({
			antialias : true, // to get smoother output
			preserveDrawingBuffer : true
		// to allow screenshot
		});
		renderer.setClearColorHex(0xBBBBBB, 1);
		// uncomment if webgl is required
		//}else{
		//	Detector.addGetWebGLMessage();
		//	return true;
	} else {
		renderer = new THREE.CanvasRenderer();
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('container').appendChild(renderer.domElement);

	// add Stats.js - https://github.com/mrdoob/stats.js
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	document.body.appendChild(stats.domElement);

	// create a scene
	scene = new THREE.Scene();

	// put a camera in the scene
	camera = new THREE.PerspectiveCamera(35, window.innerWidth
			/ window.innerHeight, 1, 10000);

	if (t == 5) {
		camera.position.set(0, 0, 5);
		console.log("I get here");
	}
	scene.add(camera);
	// create a camera contol
	cameraControls = new THREEx.DragPanControls(camera)

	// transparently support window resize
	THREEx.WindowResize.bind(renderer, camera);
	// allow 'p' to make screenshot
	//THREEx.Screenshot.bindKey(renderer);
	// allow 'f' to go fullscreen where this feature is supported
	if (THREEx.FullScreen.available()) {
		THREEx.FullScreen.bindKey();
		document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
	}

	// here you add your objects
	// - you will most likely replace this part by your own
	var geometry = new THREE.CubeGeometry(1, 1, 1);

	var material = new THREE.MeshNormalMaterial();
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 20, 20),
			new THREE.MeshBasicMaterial({
				color : 0x555555,
				wireframe : true
			}));
	plane.rotation.x = -Math.PI / 2;
	scene.add(plane);

	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	document.addEventListener('keydown', function(event) {
		if (event.keyCode == 37) {
			t += 20;

			console
					.log(camera.position.x, camera.position.y,
							camera.position.z);
			camera.lookAt(camera.position.x, camera.position.y,
					camera.position.z);

		}

	});
}

// animation loop
function animate() {

	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	camera.position.x = (Math.sin(t / 1000) * 5);
	camera.position.y = 5;
	camera.position.z = (Math.cos(t / 1000) * 5);

	requestAnimationFrame(animate);

	// do the render
	render();

	// update stats
	stats.update();
}

// render the scene
function render() {

	// update camera controls
	cameraControls.update();

	// actually render the scene
	renderer.render(scene, camera);
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
			if (data && data.action) {
				if (data.action === "ROTATION") {
					handleRotation(data);
				}
			}
		});

		socket.on("disconnect", function() {
			console.log("The connection was terminated");
		});
};

var handleRotation = function(data){
	console.log(data);
	if(Math.abs(data.value[0].deltaThetaRoll) > 5){
		if(data.value[0].deltaThetaRoll > 0){
			t += 100;	
		}else{
			t -= 100;
		}
		
	console.log(camera.position.x, camera.position.y, camera.position.z);
	camera.lookAt(camera.position.x, camera.position.y, camera.position.z);		
	}
};

window.onload = function(){
	if (!init()){
		animate();
	}

	connect();
};