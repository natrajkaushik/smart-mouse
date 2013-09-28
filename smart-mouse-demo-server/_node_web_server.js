/* HTTP, Filesystem and Websocket imports */
var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
websocket = require("socket.io"),
dgram = require("dgram");

var DEMO_PAGE_URL = "./www/simple_rotate.html";

/* HTTP server process */
var server = http.createServer(function(req, res) {
	serve_files(req, res);
});

function serve_files(req, res){
	var filePath = "." + req.url;
	if (filePath == "./"){
		filePath = DEMO_PAGE_URL;
	}
	var extname = path.extname(filePath);
	var contentType = "text/html";
	
	switch(extname){
		case ".js":
		contentType = "text/javascript";
		break;

		case ".css":
		contentType = "text/css";
		break;
		
		case ".jpg":
		case ".gif":
		contentType = "img";
		break;
	}
	
	fs.exists(filePath, function(exists){
		if(exists){
			fs.readFile(filePath, function(err, data){
				res.writeHead(200, {'Content-Type' : contentType});
				res.write(data);
				res.end();
			});
		}
	});
}

server.listen(7596);
var io = websocket.listen(server); /* Creating the websocket */

io.sockets.on("connection", function(socket){
	console.log("Client has connected");
	io.sockets.emit("message", socket.id + " has connected");

	socket.on("message", function(data) {
		if(data){
			onMessage(socket, data);
		}	
	});
	
	socket.on("disconnect", function() {
		onLogout(socket.id);
	});
});

var onMessage = function(socket, data){
};

var onLogout = function(socket){
	/* Handle Logout */
};

var sendPeriodicMessages = function(socket){
	socket.emit("message", Math.random());
};

/* ---------------- UDP Socket Code ---------------- */

var udp_socket = dgram.createSocket("udp4");

var uiBuffer = [];
var rotationData;
var scaleData;
var switchData;
var rotationModeData;

var lastThetaRoll;
var lastThetaPitch;
var lastThetaYaw;
var FILTER_VALUE = 0.1; /* Minimum value of deltaTheta that we accept as a valid rotation to remove hand shaking */

udp_socket.on("message", function(content, rinfo){
	var _content = JSON.parse(content.toString());
	if(_content.action === "SCALE"){
		scaleData = _content.value;
		sendScaleDataToClient();
	}
	if(_content.action === "ROTATION"){
		rotationData = _content.value;
		sendUIDataToClient();	
	}
	if(_content.action === "ACCELEROMETER"){
		switchData = _content.value;
		sendDataToClient();
	}
	if(_content.action === "ROTATION_MODE"){
		rotationModeData = _content.value;
		sendRotationModeDataToClient();
	}
	
});

var sendDataToClient = function(){
	io.sockets.emit("message", {action: "ACCELEROMETER", value : switchData});
};

var sendRotationModeDataToClient = function(){
	io.sockets.emit("message", {action: "ROTATION_MODE", value : rotationModeData});
};

var sendUIDataToClient = function(){
	var deltaThetas = generateFilteredDeltaThetas(rotationData);
	if(deltaThetas.length > 0){
		var deltaThetaJSON = {action : "ROTATION", value : deltaThetas};
		io.sockets.emit("message", deltaThetaJSON);
	}
};

var sendScaleDataToClient = function(){
	var deltaScales = [];
	for(var i = 0; i < scaleData.length - 1; i++){
		var scale1 = Number(scaleData[i].scale);
		var scale2 = Number(scaleData[i + 1].scale);
		var deltaScale = (scale2 - scale1);
		deltaScales.push({deltaScale : deltaScale, timestamp : scaleData[i].timestamp});
	}

	if(deltaScales.length > 0){
		var toSend = {action : "SCALE", value : deltaScales};
		io.sockets.emit("message", toSend);
	}

};

udp_socket.bind(7330);

/* ---------------- Handling Rotation Data from Android Device ---------------- */

var generateFilteredDeltaThetas = function(rotationValues){
	var result = [];
	for(var i = 0; i < rotationValues.length; i++){
		if(!lastThetaRoll || !lastThetaPitch || !lastThetaYaw){
			lastThetaRoll = rotationValues[i].roll;
			lastThetaPitch = rotationValues[i].pitch;
			lastThetaYaw = rotationValues[i].yaw;
			continue;
		}

		var deltaThetaRoll = rotationValues[i].roll - lastThetaRoll;
		var deltaThetaPitch = rotationValues[i].pitch - lastThetaPitch;
		var deltaThetaYaw = rotationValues[i].yaw - lastThetaYaw;

		var rotationObject = {toSend : false};
		rotationObject.timestamp = rotationValues[i].timestamp;
		if(Math.abs(deltaThetaRoll) > FILTER_VALUE){
			rotationObject.toSend = true;
			rotationObject.deltaThetaRoll = deltaThetaRoll;
			rotationObject.roll = rotationValues[i].roll;
		}
		if(Math.abs(deltaThetaPitch) > FILTER_VALUE){
			rotationObject.toSend = true;
			rotationObject.deltaThetaPitch = deltaThetaPitch;
			rotationObject.pitch = rotationValues[i].pitch;
		}
		if(Math.abs(deltaThetaYaw) > FILTER_VALUE){
			rotationObject.toSend = true;
			rotationObject.deltaThetaYaw = deltaThetaYaw;
			rotationObject.yaw = rotationValues[i].yaw;
		}

		if(rotationObject.toSend){
			result.push(rotationObject);
		}

		lastThetaRoll = rotationValues[i].roll;
		lastThetaPitch = rotationValues[i].pitch;
		lastThetaYaw = rotationValues[i].yaw;
	}
	return result;
};