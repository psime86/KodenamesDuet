(function init() {
// var socket = io.connect('http://name-of-heroku-app.herokuapp.com'),
var socket = io.connect('http://localhost:3000');

var type = function() {

  let n = Math.floor(Math.random())

  if (n === 0 && guessers.length < 2 ) {

    let role = guesser
    guessers.push(role)
    return role

  } else {

    let role = spymaster
    spymasters.push(role)
    return role
  }

}

class Player {
    constructor(name, type) {
      this.name = name;
      this.type = type;
      this.currentTurn = true;
      this.playsArr = 0;
    }



  }
  
  $('#player-start').on('click', function() {
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    socket.emit('createGame', { name });
    player = new Player(name, role());
  });


$("#player-join").on('click', function() {
    console.log('clicked')
    $("#game-id").css('display', 'inline')
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    socket.emit('joinGame', { name, room: roomID });
    player = new Player(name, role());
  });

    // New Game created by current client. Update the UI and create new Game var.
    socket.on('newGame', function(data) {
      console.log('new game created');
      var message =
        `Hello, ${data.name}. Please ask your friends to enter Game ID: 
        ${data.room}. Waiting for players...`;

        $("#user-message").text(message);

      // Create game for player 1
      game = new Game(data.room);
      
    });

  }());





