(function init() {
  // var socket = io.connect('http://kodenames-duet-007.herokuapp.com')

  var socket = io.connect('http://localhost:3000')

  var players = []
  var words = []
  var pattern = []

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

  $('#player-start').on('click', function () {
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }
    assignTeam();
    player = new Player(socket.id, name),
      players.push(player),
      socket.emit('createGame', { players })
  })

  socket.on('newGame', function (data) {

    var message = `Hello, ${data.name}. Your team is ${data.team}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for players to join...`;

    $('#user-message').text(message)

    team = data.team

    return team

  })

  $("#player-join").on('click', function () {
    $("#join, #game-id").css('display', 'inline')
  })

  $("#join-game").on('click', function (data) {
    name = $('#name').val();
    roomId = $('#game-id').val();
    team = team
    if (!name || !roomId) {
      $('#user-message').text('Please enter your name and roomID to continue.')
      return;
    }
    player = new Player(socket.id, name);
    players.push(player)
    $.get("/api/words", function (data) {
      for (i = 0; i < data.length; i++) {
        words.push(data[i].word)
      }
    }).then(function () {
      var parent = $("#Test");
      var divs = parent.children();
      while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
      };
      var cards = $(".back");
      for (i = 0; i < cards.length; i++) {
        var color = $(cards[i]).data('color')
        pattern.push(color)
      }





      socket.emit('joinGame', { name, room: roomId, words, pattern });
      // } else if (players.length = 3) {
      //   // socket.emit('joinGame', { name, rooom: roomId });
      //   // createGame();
      //   // socket.emit('startGame', { players });
    })

  })

  socket.on('redirect', function (data) {
    console.log(data.pattern)
    console.log(data.words)
    var cards = $(".clue");
    for (var i = 0; i < data.words.length; i++) {
      $(cards[i]).html(data.words[i]);
    }
    var back = $('.back img')
    for (var i = 0; i < data.pattern.length; i++) {

      if (data.pattern[i] == "blue") {
        color = "images/blue-spy.jpg"
      } else if (data.pattern[i] == 'red') {
        color = 'images/red-spy.jpg'
      } else if (data.pattern[i] == 'black') {
        color = "images/black-spy.jpeg"
      } else {
        color = "images/bystander.jpg"
      }

      $(back[i]).attr('src', color)
    }

    $('#phase-1').css('display', 'none')
    $('#phase-2').css('display', 'inline');
    $("#exampleModalScrollable").modal("show");
  })

  $(document).on('click', 'div.game-board', function () {

    console.log($(this).html())

   
    socket.emit('clickEvent')
  })

  socket.on('clickEvent', function (data) {
    $(data.id).trigger('click')
  })

  //   $("#exampleModalScrollable").modal("show");
  //   var cards = $(".card-title");
  //   console.log(cards);
  //   $.get("/api/words", function (data) {
  //     for (var i = 0; i < data.length; i++) {

  //       $(cards[i]).html(data[i].word);


  //     }
  //     console.log(data);


  //   });

  // });


  socket.on('err', function (data) {
    $("#user-message").text(data.message);
  })

  // socket.on('disconnect', function(data) {
  //   var message = `Hello. One of your friends has left the game. Please have a player log in using game ID: 
  //   ${data.room}`

  //   $('somewhere').text(message)
  // })


  // console.log(wordArray);



  // // var wordDisplay = document.getElementsByClassName("card-title");

  // var wordDisplay  = $("#test9");

  // $.each(wordArray, function() {
  //     $(wordDisplay).append(this);
  //     console.log(this);
  // })

}())

