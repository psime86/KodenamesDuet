(function init() {
  var socket = io.connect('http://kodenames-duet-007.herokuapp.com')

//   var socket = io.connect('http://localhost:3000')

  var players = []
  var words = []
  var pattern = []
  var divPattern = []
  var room;

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
      var cardId = $(".game-card");
     
      for (i = 0; i < cards.length; i++) {
        var color = $(cards[i]).data('color')
        var divId = $(cardId[i]).attr('id')
        pattern.push(color)
        divPattern.push(divId)
      }
      socket.emit('joinGame', { name, room: roomId, words, pattern, divPattern });
      // } else if (players.length = 3) {
      //   // socket.emit('joinGame', { name, rooom: roomId });
      //   // createGame();
      //   // socket.emit('startGame', { players });
    })

  })

  socket.on('redirect', function (data) {
    room = data.room
    console.log(data.room)
    console.log(data.pattern)
    console.log(data.words)
    var cards = $(".clue")
    var cardDiv = $(".game-card")
    for (var i = 0; i < data.words.length; i++) {
      $(cards[i]).html(data.words[i]);
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
    return data
  })

  $('.game-card').on('click', function (data) {
    console.log(data.room)
    console.log('I DEF CLICKED THIS ')
     var cardFlipped = $(this).attr('id');

    socket.emit('clickEvent', {cardFlipped, room})
  })

  socket.on('cardFlip', function (data) {
    console.log(data)
    cardToFlip = $('#' + data.cardFlipped)
    console.log(cardToFlip)
    
    cardToFlip.flip(true);

  })

  function reset() {
    $("#end-turn").hide();
    $("#clue-div").hide();
    $("#clue-word").val("");
    $("#clue-number").val("0");
};

reset();
var flip = $(".game-card").data("flip-model");
for (i=0; i < $(".game-card").length; i++) {
    var isFlipped = false;
}
$(".game-card").on("click", function() {
    
   $(".game-card").on("flip:done", function() {
       $(this).off(".flip");
       isFlipped = true;
       console.log(isFlipped);
   });
    
    
    
});


$("#clue-submit").on("click", function(event) {
    event.preventDefault();
    $("#clue-div").show();
    var clueWord = $("#clue-word").val().trim();
    var clueNumber = $("#clue-number").val().trim();
    
    if (clueWord === "") {
        $("#clue-div").text("PLEASE ENTER A VALID CLUE");
    }
    else {
       $("#clue-div").text("CLUE: " + clueWord + " || " + "NUMBER OF CARDS: " + clueNumber); 
       $("#end-turn").show();
       
    }


    
});

        var redCards = $(".redCard");
        var blueCards = $(".blueCard");
        var blackCard = $(".blackCard");
        var neutralCard = $(".neutralCard");
        var redArray = [];
        var blueArray = [];
        var blackArray = [];
        console.log(redArray);
        console.log(blueArray);
        console.log(blackArray);
        for (i=0; i < blackCard.length; i++) {
            blackArray.push(blackCard[i]);
        }
        for (i=0; i < blueCards.length; i++) {
            blueArray.push(blueCards[i]);
        }
        for (i=0; i < redCards.length; i++) {
            redArray.push(redCards[i]);

        }
        function randomFlip() {
            console.log(redCards);
            console.log(redArray);
            var computerCard = redArray.splice(0,1);
            $(computerCard).flip(true);
            
        }
        function blueTurn() {
            console.log(blueArray);
            var blueSplice = blueArray.splice(0,1);
           
        }
        $(blueCards).click(function(event) {
            event.preventDefault();
            blueTurn();
            turnOver();
            winOrLose();
        })

        $(redCards).click(function(event) {
            event.preventDefault();
            console.log(redArray);
            var clickedCard = $(this).attr("id");
            var clickIndex = redArray.indexOf(clickedCard);
            console.log(clickIndex);
            console.log(clickedCard);
            redArray.splice(clickIndex,1);
            winOrLose();
        })

        $(blackCard).click(function(event) {
            event.preventDefault();
            console.log(blackArray);
            var evilCard = blackArray.splice(0,1);
            winOrLose();
        })

        

        $("#end-turn").click(function(event) {
            event.preventDefault();
            randomFlip();
            winOrLose();
            reset();
            
            
            
            
            
        });

        function turnOver() {
            var clueNumber = $("#clue-number").val().trim();
            
            // if (blueArray.length )
        }

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



