// var socket = io.connect('http://name-of-heroku-app.herokuapp.com'),
this.socket = io()

var players =[]
var spymasters = []
var guessers = []
function Player(id, name) {
  this.id = id
  this.name = name;
  this.team = team();
}

var team = function () {

  var checkTeam = players.filter(function (team) {
    return this.team == "red"
  })
  if (Math.floor(Math.random() * 2) === 0 && checkTeam.length <= 1) {

    return "red"

  } else {

    return "blue"

  }

}

$('#player-start').on('click', function () {
  var name = $('#name').val();
  if (!name) {
    $('#user-message').text('Please enter your name!')
    return;
  }
  socket.emit('createGame', { name })
  player = new Player(socket.id, name)

  if (Math.floor(Math.random() * 2) === 0) {
    spymasters.push(player)
   }
    else {
      guessers.push(player)
    }
    players.push(player)
    console.log(spymasters)
    console.log(guessers)

  })

  socket.on('newGame', function(data) {

    var message = `Hello, ${data.name}. Please ask your friends to enter Game ID: 
      ${data.room}. Waiting for players to join...`;

    $('#user-message').text(message)
    // create new 'game' for user. 
  })

$("#player-join").on('click', function () {
  console.log('clicked')
  $("#game-id").css('display', 'inline')
  var name = $('#name').val();
  if (!name) {
    $('#user-message').text('Please enter your name!')
    return;
  }

  if (players.length < 4) {
  socket.emit('joinGame', { name, room: roomID });
  player = new Player(socket.id, name);
  } else {
    $('#user-message').text('This room is full')
  }
});

// New Game created by current client. Update the UI and create new Game var.
socket.on('newGame', function (data) {
  console.log('new game created');
  var message =
    `Hello, ${data.name}. Please ask your friends to enter Game ID: 
        ${data.room}. Waiting for players...`;

  $("#user-message").text(message);

  // Create game for player 1
  game = new Game(data.room);

});

socket.on('joinGame', function (data) {
  
})

// socket.on('disconnect', function(data) {
//   var message = `Hello. One of your friends has left the game. Please have a player log in using game ID: 
//   ${data.room}`

//   $('somewhere').text(message)
// })





