var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(request, response)
{
    //response.sendfile(__dirname + '/index.html');
    response.sendfile(__dirname + '/socketTest.html');    
});

io.sockets.on('connection', function(socket)
{
   //socket.emit('news', {hello: 'world'});
   socket.on('Dat Event', function(data)
    {
        console.log(data);
        socket.emit('news', {hello: data.my});
    }); 
});

/*var http = require('http'),
	url  = require('url'),
	io 	 = require('socket.io');

server = http.createServer(function (request, response) 
{
	response.writeHead(200, {'Content-Type':'text/html'});
	response.end('<h1>HERROWERLD</h1>')
});

server.listen(8080);

var socket = io.listen(server);
socket.on('connection', function(client)
{
	client.on('message', function(){ 
        console.log('message arrive');
        client.send('some message');
    });

    client.on('disconnect', function(){
        console.log('connection closed');
    });
});*/