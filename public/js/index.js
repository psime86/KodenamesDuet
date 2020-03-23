$(document).ready(function(){
  
  $(function() {
    var parent = $("#Test");
    var divs = parent.children();
    while (divs.length) {
      parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    };
});

  // var cards = $(".back");

  // var redTeam = "<img src='images/red-spy.jpg' style='width: 100%; height: 100%;'>";

  // var bystander = "<img src='images/bystander.jpg' style='width: 100%; height: 100%;'>";

  // var blueTeam = "<img src='images/blue-spy.jpg' style='width: 100%; height: 100%;'>";

  // var assassin = "<img src= 'images/black-spy.jpeg' style='width: 100%; height: 100%;'>";

  // //create teams
  // for (var i = 0; i < 8; i++) {
  //   $(cards).append(redTeam);
  // };

  // for (var i = 0; i < 8; i++) {
  //   $(cards).append(blueTeam);
  // };

  // // one extra for one of the teams
  // if (Math.floor(Math.random() * data.length) % 2 === 0) {
  //   cards.append(redTeam);
  //   $("#FirstTeam").html("Red Team Starts");
  // } else {
  //   cards.append(blueTeam);
  //   $("#FirstTeam").html("Blue Team Starts");
  // }

  // add neturals
  // for (var i = 0; i < 7; i++) {
  //   cards.append(bystander);
  // };

  // // push the assasin
  // cards.append(assassin);

  // var cards = "<div class='back'><img src='images/blue-spy.jpg' style='width: 100%; height: 100%;'></div>"
  // for (var i = 0; i < 8; i++){
  //   $(".card m-3").push(cards);
  // }
});