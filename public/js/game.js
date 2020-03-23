// var socket = io.connect('http://name-of-heroku-app.herokuapp.com'),
this.socket = io()

red = []
blue = []
var player = {
  team: teamColor,
  role: rolePlayed,
}

function Player(name, team, role, id) {
  this.name = name;
  this.team = team();
  this.role = function() {
    if (this.team === 'red') {
      redRole()
    }else {
      blueRole()
    }
  }
  this.id = socket.id
  }

var team = function () {
  if (Math.floor(Math.random() * 2) === 0 && red.length <= 1) {

    teamColor = "red";
    return teamColor


  } else {

    teamColor = "blue"
    return teamColor
  }

  var redRole = function () {

    var checkRedRole = red.filter(function (role) {
      return role.role == "spymaster"
    });

    if (Math.floor(Math.random() * 2) === 0 && checkRedRole.length <= 1) {

      rolePlayed = "spymaster"

    } else {

      rolePlayed = "guesser"

    }
  }

  var blueRole = function () {

    var checkBlueRole = blue.filter(function (role) {
      return role.role == "spymaster"
    });

    if (Math.floor(Math.random() * 2) === 0 && checkBlueRole.length <= 1) {

      rolePlayed = "spymaster"

    } else {

      rolePlayed = "guesser"

    }
  }

  function Player(name, team, role, id) {
      this.name = name;
      this.team = team();
      this.role = function() {
        if (this.team === 'red') {
          redRole()
        }else {
          blueRole()
        }
      }
      this.id = socket.id
      }
    }

  $('#player-start').on('click', function () {
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    socket.emit('newGame', { name } )
    player = new Player(name, )

  });


  $("#player-join").on('click', function () {
    console.log('clicked')
    $("#game-id").css('display', 'inline')
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    socket.emit('joinGame', { name, room: roomID });
    player = new Player(name, type());
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





