var express = require("express");
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var db = require("./models");

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

var nsp = io.of('/game');
nsp.on('connection', function(socket){
  console.log('someone connected');
  socket.on('chat message', function(msg) {
      nsp.emit('chat message', msg)
      console.log('message: ' + msg);
  })
})


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
// db.sequelize.sync(syncOptions).then(function() {
//   app.listen(PORT, function() {
//     console.log(
//       "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
//       PORT,
//       PORT
//     );
//   });
// });

app.listen(PORT, function(){
  console.log('listening on ' + PORT);
})


module.exports = app;
