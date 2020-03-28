(function init() {
  // var socket = io.connect('http://kodenames-duet-007.herokuapp.com')

  var socket = io.connect('http://localhost:3000')

  var turns = 8
  var isPlaying = false;
  var players = []
  var words = []
  var pattern = []
  var divPattern = []
  var room;
  var role1
  var role2
  var redCards = $(".redCard");
  var blueCards = $(".blueCard");
  var blackCard = $(".blackCard");
  var neutralCard = $(".neutralCard");
  var redArray = [];
  var blueArray = [];
  var blackArray = [];

  var team = 'blue'

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

  $('#player-start').on('click', function () {
    var name = $('#name').val();
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }

    player = new Player(socket.id, name),
      players.push(player),
      role1 = player.role
    socket.emit('createGame', { players })
  })

  socket.on('newGame', function (data) {

    room = data.room

    var message = `Hello, ${data.name}. Your team is ${data.team}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player to join...`;

    $('#user-message').text(message)

    if (role1 == 'guesser') {
      $('#spymaster').css('display', 'none')
    } else {
      $('#guesser').css('display', 'none')
    }
    console.log(role1)

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
    role2 = player.role

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
      var cardId = $(".game-card");

      for (i = 0; i < cards.length; i++) {
        var color = $(cards[i]).data('color')
        var divId = $(cardId[i]).attr('id')
        pattern.push(color)
        divPattern.push(divId)
      }
      socket.emit('joinGame', { name, players, room: roomId, words, pattern, divPattern });

    })

  })

  socket.on('setupFunction', function (data) {
    console.log('setupFunctionReceived')
    console.log(role2)
    if (role2 == 'guesser') {
      $('#spymaster').css('display', 'none')
    } else {
      $('#guesser').css('display', 'none')
    }
  })

  socket.on('redirect', function (data) {
    room = data.room
    console.log(data.room)
    console.log(data.pattern)
    console.log(data.words)
    var clues = $(".clue")
    var cardDiv = $(".game-card")
    for (var i = 0; i < data.words.length; i++) {
      $(clues[i]).html(data.words[i]);
      $(cardDiv[i]).attr("id", data.divPattern[i])

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

    //   var playerArray = data.players 

    //   if (playerArray[0].role === 'spymaster') {
    //     $()
    //   }



    //   return data
  })

  $('.game-card').on('click', function (data) {
    console.log(data.room)
    console.log('I DEF CLICKED THIS ')
    var cardFlipped = $(this).attr('id');

    socket.emit('clickEvent', { cardFlipped, room })
  })

  socket.on('cardFlip', function (data) {
    console.log(data)
    cardToFlip = $('#' + data.cardFlipped)
    console.log(cardToFlip)

    cardToFlip.flip(true);

  })

  function reset() {
    $("#spymaster").hide()
    $("#guesser").hide()
    $("#end-turn").hide();
    $("#clue-div").hide();
    $("#clue-word").val("");
    $("#clue-number").val("0");
  };

  reset();
  var flip = $(".game-card").data("flip-model");
  for (i = 0; i < $(".game-card").length; i++) {
    var isFlipped = false;
  }
  $(".game-card").on("click", function () {

    $(".game-card").on("flip:done", function () {
      $(this).off(".flip");
      isFlipped = true;
      console.log(isFlipped);
    });



  });

  $("#clue-submit").on("click", function (event) {
    event.preventDefault();
    $("#clue-div").show();
    var clueWord = $("#clue-word").val().trim();
    var clueNumber = $("#clue-number").val().trim();

    if (clueWord === "") {
      $("#clue-div").text("PLEASE ENTER A VALID CLUE");
    }
    else {
      $("#clue-div").text("Guesser's Turn");

      socket.emit('clueSubmit', { clueWord, clueNumber, room })

    }

  });

  socket.on('clueReceive', function (data) {
    console.log('clueReceive happened')
    $("#clue-div").show();
    $("#clue-div").text("CLUE: " + data.clueWord + " || " + "NUMBER OF CARDS: " + data.clueNumber);
    $("#end-turn").show();
  })

  socket.on('cpuRedFlip', function (data) {
   
    $('#' + data.flipId).flip(true);
  })

  for (i = 0; i < blackCard.length; i++) {
    blackArray.push(blackCard[i]);
  }
  for (i = 0; i < blueCards.length; i++) {
    blueArray.push(blueCards[i]);
  }
  for (i = 0; i < redCards.length; i++) {
    redArray.push(redCards[i]);
  }
  function randomFlip() {
    console.log(redCards);
    console.log(redArray);
    var computerCard = redArray.splice(0, 1);
    console.log(computerCard)
    $(computerCard).flip(true);
    flipId = $(computerCard).attr('id')
    console.log(flipId)

    socket.emit('computerFlip', { flipId, room })

  }
  function blueTurn() {
    console.log(blueArray);
    var blueSplice = blueArray.splice(0, 1);

  }
  $(blueCards).click(function (event) {
    event.preventDefault();
    blueTurn();
    winOrLose();
  })

  $(redCards).click(function (event) {
    event.preventDefault();
    console.log(redArray);
    var computerCard = redArray.splice(0, 1);
    winOrLose();
  })

  $(blackCard).click(function (event) {
    event.preventDefault();
    console.log(blackArray);
    var evilCard = blackArray.splice(0, 1);
    winOrLose();
  })



  $("#end-turn").click(function (event) {
    event.preventDefault();
    randomFlip();
    winOrLose();
    reset();





  });
  function winOrLose() {
    if (redArray.length === 0) {
      alert("YOU LOSE");
    }
    else if (blueArray.length === 0) {
      alert("YOU WIN");
    }
    else if (blackArray.length === 0) {
      alert("YOU LOSE");
    }
  }

  socket.on('err', function (data) {
    $("#user-message").text(data.message);
  })

}())



