var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// var exphbs = require("express-handlebars");

var rooms = 0
// var guessers = [];
// var spymasters = [];

// var roomPush = function() {

//   let player = 1
//   let n = Math.floor(Math.random())

//   if (n === 0 && guessers.length < 2 ) {

//     guessers.push(player)
//     player++;

//   } else {
//     spymasters.push(player)
//     player++;
//   }

// }

// var db = require("./models");

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
// app.engine(
//   "handlebars",
//   exphbs({
//     defaultLayout: "main"
//   })
// );
// app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
// if (process.env.NODE_ENV === "test") {
//   syncOptions.force = true;
// }

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

// var nsp = io.of('/codenames');
  io.on('connection', function (socket) {
  // create new game room, notify creator of room. 
  socket.on('createGame', function (data) {
    socket.join(`room-${++rooms}`);
    socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
  });

  socket.on('joinGame', function (data) {
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

server.listen(process.env.PORT || 3000, function() {
    console.log(`listening on ${PORT}`)});