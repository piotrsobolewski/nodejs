var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require("socket.io").listen(server);

app.configure(function() {
	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
  	app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
	app.set("transports", ["websocket"]);
});

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
/*
io.sockets.on("connection", function (socket) {

	socket.on("joint", function(data){
			//Joins the Temporary Room, to the enemy player
			socket.join(TmpRoom);
			//Then it sends, the name of the room.
			socket.send("Room," + TmpRoom);
			//now, the interesting part. It not just sends a data to ONE client,
			//but to all clients in the room. To all clients in the TmpRoom.
			// the data that it sends, are the currently room name.
			io.sockets.in(TmpRoom).send("enemy," + TmpRoom);
			//and the username from the other player.
			io.sockets.in(TmpRoom).send("enemy," + data);
			//now it again sets the TmpRoom = wait, so the next that tries to join,
			//again, is going to the upper loop, and creating its own room.
			//Rooms are automatically "destroyed" when the Host, leaves the room.
			TmpRoom = "wait";
		}
			
	});
	//if the socket, gets a custom function from C2, called Message with some data(the room name),
	//then it performs this:
	socket.on("message", function(data){
		//now it is in the loop, and if the server gets a event called Chatmessage,
		//probably with a string message, then it performs this:
		socket.on("chatmessage", function(data2){
			//Sends a chat message in the room.
			//it sends data to all clients in the room. that
			//the sending client defined in his "message" function.
			io.sockets.in(data).send("chatmessage," + data2);
		});
		//that is pretty much the same and don´t require any explanation
		// i hope.
		socket.on("GameSettings", function(data2){
			//Sends the Game settings, x,y coordinate, String, everything!
			io.sockets.in(data).send("GameSettings," + data2);
		});
	});
	// when the user disconnects. perform this:
	socket.on("disconnect", function(data){
		//on disconnecting, it leaves the room.
		socket.leave(data);
	});
});*/