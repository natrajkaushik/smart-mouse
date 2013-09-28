var dgram = require("dgram");
var udp_socket = dgram.createSocket("udp4");

var uiBuffer = [];

udp_socket.on("message", function(content, rinfo){
	var _content = content.toString();
	console.log(_content);
	uiBuffer.push(content.toString());
	//send_ui_data_to_client();
});

var sendDataToClient = function(){
	io.sockets.emit("message", uiBuffer);
};

udp_socket.bind(7330);