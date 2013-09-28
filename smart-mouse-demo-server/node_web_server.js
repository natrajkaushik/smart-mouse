/* HTTP, Filesystem and Websocket imports */
var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
websocket = require("socket.io"),
dgram = require("dgram");

var DEMO_PAGE_URL = "./www/canvas_geometry_cube.html";

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
	/* Handle message */
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

var lastTheta;
var FILTER_VALUE = 1; /* Minimum value of deltaTheta that we accept as a valid rotation to remove hand shaking */

udp_socket.on("message", function(content, rinfo){
	var _content = JSON.parse(content.toString());
	rotationData = _content.value;
	//uiBuffer.push(_content.value);
	//console.log(rotationData);
	sendUIDataToClient();
});

var sendUIDataToClient = function(){
	var deltaThetas = generateFilteredDeltaThetas(rotationData);
	//console.log(deltaThetas);
	if(deltaThetas.length > 0){
		var deltaThetaJSON = {value : deltaThetas};
		io.sockets.emit("message", deltaThetaJSON);
	}
};

udp_socket.bind(7330);

/* ---------------- Handling Rotation Data from Android Device ---------------- */

var generateFilteredDeltaThetas = function(rotationValues){
	var result = [];
	for(var i = 0; i < rotationValues.length; i++){
		if(!lastTheta){
			lastTheta = rotationValues[i].pitch;
			continue;
		}

		var deltaTheta = rotationValues[i].pitch - lastTheta;
		if(Math.abs(deltaTheta) > FILTER_VALUE){
			result.push({deltaTheta : deltaTheta, theta: rotationValues[i].pitch, timestamp : rotationValues[i].timestamp});
		}
		lastTheta = rotationValues[i].pitch;
	}
	return result;
};