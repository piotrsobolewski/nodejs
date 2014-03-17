// This is required to run the server
var io = require('socket.io').listen(app);
// here we define the port the messages are sended though.
// in this case, it is port 8080, you can define it to every port you want.
//but take note, some ports are already in use, then it will throw in an error message.
app.listen(8080);
//a variable for our "automatch maing"
TmpRoom="wait";
//if a client connects to this, it performs this whole, big function.
io.sockets.on("connection", function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on("joint", function(data){
		// checks, if no other waiting player exists,
		if(TmpRoom=="wait")
		{
			//if yes, then it perform this
			// it sais TmpRoom = data, that is the username that is data
			/*That means, TmpRoom is not anymore = wait! so the next one that
			wants to join here, go into the next loop, the "else" loop */
			TmpRoom = data;
			//then it creates, and joins a room, that is called after the users username
			socket.join(TmpRoom);
			//Now it sends the message, you,playersname
			socket.send("you," + TmpRoom);
			// and now, it ends the loops.
		}
		
		else
		{
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
});