(function init() {
  var socket = io.connect('http://kodenames-duet-007.herokuapp.com')

  // var socket = io.connect('http://localhost:3000')

  var players = []
  var words = []
  var pattern = []
  var divPattern = []
  var room;

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
    var name = $('#name').val()
    if (!name) {
      $('#user-message').text('Please enter your name!')
      return;
    }

    player = new Player(socket.id, name),
      players.push(player),
      $("#player-start").hide();
      $("#player-join").hide();
      $("#game-id").hide();
      $("#join-game").hide();
      socket.emit('createGame', { players })
      
  })

  socket.on('newGame', function (data) {

    room = data.room

    var message = `Hello, ${data.name}. Your team is ${data.team}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player to join...`;

    $('#user-message').text(message)

    $(".game-card").unbind("click")

  })

  $("#player-join").on('click', function () {
    $("#join, #game-id").css('display', 'inline')
  })

  $("#join-game").on('click', function (data) {
    $('#spymaster').hide();
    $('#clue-div').show()
    $('#clue-div').text('Welcome Guesser, Please wait for your clue... ')
    name = $('#name').val();
    roomId = $('#game-id').val().toLowerCase();
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
      socket.emit('spySetup', { pattern, room: roomId })
    })

  })

  socket.on('spyColors', function (data) {
    var spyPattern = $(".game-card")
    for (var i = 0; i < data.pattern.length; i++) {
      $(spyPattern[i]).css({ "border": "solid 3px", "border-color": data.pattern[i] })
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

  })

  $('.game-card').on('click', function (data) {
    var cardFlipped = $(this).attr('id');

    socket.emit('clickEvent', { cardFlipped, room, words })
  })

  socket.on('cardFlip', function (data) {
    console.log(data)
    cardToFlip = $('#' + data.cardFlipped)
    console.log(cardToFlip)

    cardToFlip.flip(true);

  })

  function reset() {
    $("#end-turn").hide();
    $("#clue-div").text();
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
    var clueWord = $("#clue-word").val().trim().toLowerCase();
    var clueNumber = $("#clue-number").val().trim();
    $("#clue-word").val("");
    $("#clue-number").val(0);

    var word = $('.clue')
    for(i=0; i < 26; i++) {
      words.push($(word[i]).text().toLowerCase())
    }

    for(i=0; i < words.length; i++) {
    if (clueWord !== "" && words[i].toLowerCase() !== clueWord) {
      console.log(clueWord)
      console.log(words[i])
      $("#clue-div").text("GUESSER'S TURN");
      $("#spymaster").hide();
      socket.emit('clueSubmit', { clueWord, clueNumber, room })
      return
    } else if (words[i].toLowerCase() == clueWord) {
      $("#clue-div").text("PLEASE USE A WORD NOT ON THE BOARD")
      return
    } else {
      $("#clue-div").text("PLEASE ENTER A CLUE")
    }

  }
    
  });

  socket.on('clueReceive', function (data) {
    console.log('clueReceive happened');
    $("#clue-div").show();
    $("#clue-div").text("CLUE: " + data.clueWord + " || " + "NUMBER OF CARDS: " + data.clueNumber);
    $("#end-turn").show();
  })

  socket.on('cpuRedFlip', function (data) {
    $('#' + data.flipId).flip(true);
    $("#spymaster").show()
    $("#clue-div").text("Please enter your next clue.")
  })

  socket.on('youLost', function(data) {
    console.log('YOU LOST')
    $("#gameover-modal").modal("show");

  })

  socket.on('youWon', function(data) {
    console.log('YOU WON')
    $("#endgame-modal").modal("show");
  })

  // these need to be here, not at the top.
  var redCards = $(".redCard");
  var blueCards = $(".blueCard");
  var blackCard = $(".blackCard");
  var neutralCards = $(".neutralCard");
  redArray = [];
  blueArray = [];
  blackArray = [];

  for (i = 0; i < blackCard.length; i++) {
    blackArray.push(blackCard[i]);
  }
  for (i = 0; i < blueCards.length; i++) {
    blueArray.push(blueCards[i]);
  }
  for (i = 0; i < redCards.length; i++) {
    redArray.push(redCards[i]);
  }
  //function that handles the computer turn "AI"
  function randomFlip() {
    console.log(redCards);
    console.log(redArray);
    var computerCard = redArray.splice(0, 1);
    console.log(computerCard)
    $(computerCard).flip(true);
    flipId = $(computerCard).attr('id')

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
  //making sure that when a red card is clicked instead of chosen by the computer its taken out of the array.
  $(redCards).click(function (event) {
    event.preventDefault();
    console.log(redArray);
    var clickedCard = this;
    var clickIndex = redArray.indexOf(clickedCard);
    console.log($(clickedCard).attr("id"));
    console.log(clickIndex);
    console.log(clickedCard);
    redArray.splice(clickIndex, 1);
    turnOver();

  })

  $(neutralCards).click(function (event) {
    event.preventDefault();
    turnOver();
  })

  $(blackCard).click(function (event) {
    event.preventDefault();
    console.log(blackArray);
    var evilCard = blackArray.splice(0, 1);
    winOrLose();
  })


  //what happens when you click the 'end turn' button.
  $("#end-turn").click(function (event) {
    event.preventDefault();
    randomFlip();
    winOrLose();
    reset();
    $("#clue-div").show()
    $("#clue-div").text("Please wait for your next clue.")
  });
  //what happens when your turn is over.
  function turnOver() {
    event.preventDefault();
    randomFlip();
    winOrLose();
    reset();
    $("#clue-div").show()
    $("#clue-div").text("Please wait for your next clue.");
  }
  //win or loss variables
  function winOrLose() {
    if (redArray.length === 0) {
      $("#gameover-modal").modal("show");

      lose = true;

      socket.emit('gameLose', { lose, room })
    }
    else if (blueArray.length === 0) {
      $("#endgame-modal").modal("show");

      lose = false

      socket.emit('gameEnd', { lose, room })
    }
    else if (blackArray.length === 0) {
      $("#gameover-modal").modal("show");

      lose = true;

      socket.emit('gameLose', { lose, room })
    }
  }

  // Adding new data to our table.
  function insertWord(event) {
    event.preventDefault();
    var newWord = {
      word: $(".new-word").val().trim()
    };

    $.post("/api/newwords", newWord);
    $(".validate-add").text("Word Successfully Added!");
  }

  $(document).on("click", ".db-submit", insertWord);

  socket.on('err', function (data) {
    $("#user-message").text(data.message);
  })

}())



