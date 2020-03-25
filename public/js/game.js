
$(document).ready(function() {

  var cards = $(".card-title");

  console.log(cards);


  $.get("/api/words", function(data) {
      for (var i = 0; i < data.length; i++) {
         
          $(cards[i]).html(data[i].word);
      
          
      }
      console.log(data);


  });


(function init() {
  // var socket = io.connect('http://name-of-heroku-app.herokuapp.com'),

  var socket = io.connect('http://localhost:3000')

  // var red = []
  // var blue = []
  var players = []

  var team;

  assignTeam = function () {
    if (Math.floor(Math.random() * 2)) {
      team = 'red'
    } else {
      team = 'blue'
    }
  }

  assignRole = function () {

    var checkRole = players.filter(function (role) {
      return this.role == "spymaster"
    })

    if (Math.floor(Math.random() * 2) === 0 && checkRole.length === 0) {
      return 'spymaster'

    } else {
      return 'guesser'
    }
  }

  function Player(id, name) {
    this.id = id
    this.name = name;
    this.team = team;
    this.role = assignRole();
  }

  //   var checkTeam = players.filter(function (team) {
  //     return this.team == "red"
  //   })
  //   if (Math.floor(Math.random() * 2) === 0 && checkTeam.length <= 1) {
  //     return "red"

  //   } else {
  //     return "blue"
  //   }
  // }
  //   this.role = function () {

  //     if (this.team === 'red') {

  //       red.push(player)

  //       var checkRedRole = red.filter(function (team) {
  //         return this.role == "spymaster"
  //       })

  //       if (Math.floor(Math.random() * 2) === 0 && checkRedRole.length === 0) {
  //         console.log(red)
  //         console.log(blue)
  //         return 'spymaster'

  //       }
  //       else {
  //         console.log(red)
  //         console.log(blue)
  //         return 'guesser'
  //       }
  //     } else {

  //       blue.push(player)

  //       var checkBlueRole = blue.filter(function (team) {
  //         return this.role == 'spymaster'
  //       })

  //       if (Math.floor(Math.random() * 2) === 0 && checkBlueRole.length === 0) {
  //         console.log(red)
  //         console.log(blue)
  //         return 'spymaster'
  //       }
  //       else {
  //         console.log(red)
  //         console.log(blue)
  //         return 'guesser'
  //       }
  //     }

  //   }
  // }

  createGame = function () {

    var cards = $(".card-title");
    $.get("/api/words", function (data) {
      for (var i = 0; i < data.length; i++) {

        $(cards[i]).html(data[i].word);
      }
    })
  }

  $('#player-start').on('click', function () {
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    assignTeam();
    console.log(team)
    player = new Player(socket.id, name),
      players.push(player),
      console.log(players)
    socket.emit('createGame', { players })
  })

  socket.on('newGame', function (data) {

    console.log(data)

    var message = `Hello, ${data.name}. Your team is ${data.team}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for players to join...`;

    $('#user-message').text(message)

    team = data.team

    return team

  })

  $("#player-join").on('click', function () {
    console.log('clicked')
    $("#join").css('display', 'inline')
  })

  $("#join-game").on('click', function (data) {
    name = $('#name').val();
    roomId = $('#game-id').val();
    console.log(players)
    team = team
    if (!name || !roomId) {
      $('#user-message').text('Please enter your name and roomID to continue.')
      return;
    }
    player = new Player(socket.id, name);
    players.push(player)
    console.log(players)
    socket.emit('joinGame', { name, room: roomId });
    // } else if (players.length = 3) {
    //   // socket.emit('joinGame', { name, rooom: roomId });
    //   // createGame();
    //   // socket.emit('startGame', { players });
  });

  socket.on('redirect', function (destination) {
    $("#exampleModalScrollable").modal("show");
    var cards = $(".card-title");
    console.log(cards);
    $.get("/api/words", function (data) {
      for (var i = 0; i < data.length; i++) {

        $(cards[i]).html(data[i].word);


      }
      console.log(data);


    });

    console.log('received redirect')
    window.location.href = destination

    $("#exampleModalScrollable").modal("show");
    var cards = $(".card-title");
    console.log(cards);
    $.get("/api/words", function (data) {
      for (var i = 0; i < data.length; i++) {

        $(cards[i]).html(data[i].word);


      }
      console.log(data);


    });

  });


// New Game created by current client. Update the UI and create new Game var.
socket.on('newGame', function (data) {
  console.log('new game created');
  var message =
    `Hello, ${data.name}. Please ask your friend to enter Game ID: 
        ${data.room}. Waiting for other player...`;

  $("#user-message").text(message);

  // Create game for player 1
  // game = new Game(data.room);

});

socket.on('joinGame', function (data) {

})

// socket.on('disconnect', function(data) {
//   var message = `Hello. One of your friends has left the game. Please have a player log in using game ID: 
//   ${data.room}`

//   $('somewhere').text(message)
// })

$("#player-join").on('click', function () {
  console.log('clicked')
  $("#game-id").css('display', 'inline')
});


  // console.log(wordArray);



  // // var wordDisplay = document.getElementsByClassName("card-title");

  // var wordDisplay  = $("#test9");

  // $.each(wordArray, function() {
  //     $(wordDisplay).append(this);
  //     console.log(this);
  // })

}())

})


