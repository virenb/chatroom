var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var count = 0;
var clients = [];

io.on('connection', function(socket) {
    count++;

    io.sockets.on('connect', function(client) {
    clients.push(client); 
    console.log(clients.id);

    client.on('disconnect', function() {
        clients.splice(clients.indexOf(client), 1);
   		 });
    	 console.log(clients.id);
	});

    console.log('Client #' + count + ' connected');
    socket.broadcast.emit('message', 'Client #' + count + ' connected');
    console.log(`There are now ${count} user(s).`);

    socket.on('message', function(message) {
        console.log(`Received message from user ${count}: ${message}`);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function(data) {
        console.log('User disconnected');
        socket.broadcast.emit('User disconnected');
        count--;
        console.log(`There are now ${count} user(s) still here.`);
    });
});

server.listen(8080);