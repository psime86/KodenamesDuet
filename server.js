var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// var exphbs = require("express-handlebars");

var rooms = 0

var db = require("./models");

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// var nsp = io.of('/codenames');
  io.on('connection', function (socket) {
  console.log('a user connected') 

  socket.on('createGame', function (data) {
    console.log(data)
    socket.join(`room-${++rooms}`);
    socket.emit('newGame', { name: data.players[0].name, team: data.players[0].team, role: data.players[0].role, room: `room-${rooms}`, words: data.words, players: data.players });
    console.log({ name: data.players[0].name, team: data.players[0].team, role: data.players[0].role, room: `room-${rooms}` })
  });

  // when a player disconnects, remove them from our players object. 
  socket.on('disconnect', function() {
    console.log('user disconneted')
    io.emit('disconnect', socket.id);
  });

  socket.on('joinGame', function (data) {
    console.log('this room joined')
    var room = io.nsps['/'].adapter.rooms[data.room]
    if (room && room.length === 1) {
      socket.join(data.room);
      // socket.emit('player', { name: data.name, room: data.room })
      // console.log(data)
      io.in(data.room).emit('redirect', {words: data.words, pattern: data.pattern, divPattern: data.divPattern, room: data.room, players: data.players})
      socket.broadcast.emit('spyColors', {pattern: data.pattern})

    } else {
      socket.emit('err', { message: 'Sorry this room is full or does not exist!' })
    }
  });

  socket.on('spySetup', function(data) {
    pattern = data.pattern

    socket.to(data.room).emit('spyColors', {pattern})
  })

  socket.on('clickEvent', function (data) {
    console.log('event received')

    socket.to(data.room).emit('cardFlip', {cardFlipped: data.cardFlipped, room: data.room})
  })

  socket.on('clueSubmit', function(data) {
    console.log(data)
    socket.to(data.room).emit('clueReceive', {clueWord: data.clueWord, clueNumber: data.clueNumber, room: data.room})
  })

  socket.on('computerFlip', function(data) {
    console.log(data)
    flipId = data.flipId
    socket.to(data.room).emit('cpuRedFlip', {flipId})
  })

  socket.on('gameLose', function(data) {
        socket.to(data.room).emit('youLost', {lose: data.lose})
  });

  socket.on('gameEnd', function(data) {
    socket.to(data.room).emit('youWon', {lose: data.lose})
  })

})


var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  server.listen(PORT, function() {
    console.log(`Listening on ${server.address().port}`);
  })
  });
