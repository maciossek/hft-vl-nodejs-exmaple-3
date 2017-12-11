const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const shortid = require('shortid');
const port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  let room = shortid.generate();
  socket.emit('room', room);
  socket.join(room);
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('message', function(msg){
    console.log(`Message: ${msg} in Room: ${room}`);
    io.sockets.in(room).emit('message', msg);
  });

  socket.on('room', function(r){
    console.log('user joined room ' + r);
    socket.join(r);
    room = r;
  });
});

http.listen(port, function(){
  console.log('listening on *:3000');
});
