var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

people = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
	let id;
	socket.on('register', function(){
		id = new Person().online(people);
		io.emit('register', {
			"id": id
		});
	});
	socket.on('morse', function(letter){
		io.emit('morse', {
			"id": id,
			"letter": letter["letter"],
		});
	});
	 socket.on('disconnect', function() {
		console.log('user: ' + id + ' disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

class Person {

	constructor() {
	}
	online(people) {
		const initppl = people.length;
		let id = "";
		while(initppl == people.length) {
			id = Math.random().toString(36).substring(6);
			if (!people.includes(id)) {
				people.push(id);
			}
		}
		return id;
	}
}