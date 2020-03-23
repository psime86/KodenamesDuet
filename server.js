var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// var exphbs = require("express-handlebars");

var rooms = 0
var players = {}


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

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object. 
  socket.on('disconnect', function() {
    console.log('user disconneted')
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  })
  socket.on('createGame', function (data) {

    socket.join(`room-${++rooms}`);
    socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
  });

  socket.on('joinGame', function (data) {
    console.log('this room joined')
    var room = io.nsps['/'].adapter.rooms[data.room]
    if (room && room.length === 1) {
      socket.join(data.room);

      // if (room.length === 4) {
      // }
      socket.broadcast.to(data.room).emit('player1', {});
      socket.emit('player2', { name: data.name, room: data.room })
    } else {
      socket.emit('err', { message: 'Sorry this room is full!' })
    }
  });

  socket.on('playTurn', function(data) {
    socket.broadcast.to(data.room).emit('turnPlayed', {
      tile: data.tile,
      room: data.room
    });
  });

  socket.on('gameEnded', function(data) {
    socket.broadcast.to(data.room).emit('gameEnded', data);
  });

});

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
