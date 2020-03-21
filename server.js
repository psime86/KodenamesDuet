var express = require("express");
<<<<<<< HEAD
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
=======
// var exphbs = require("express-handlebars");
>>>>>>> 5ce3b1a5d285853d17a6147a0e67d65d285e1383

var rooms = 0

// var db = require("./models");

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

<<<<<<< HEAD
=======
// Handlebars
// app.engine(
//   "handlebars",
//   exphbs({
//     defaultLayout: "main"
//   })
// );
// app.set("view engine", "handlebars");

>>>>>>> 5ce3b1a5d285853d17a6147a0e67d65d285e1383
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

io.on('connection', function(socket) {
  console.log('A user connected')
})

app.listen(PORT, function(){
  console.log('listening on ' + PORT);
})



module.exports = app;

