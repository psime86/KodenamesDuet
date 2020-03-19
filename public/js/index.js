$(document).ready(function(){

var cards = $(".back");

var redTeam = document.createElement("img");
redTeam.src = "'images/red-spy.jpg' style='width: 100%; height: 100%;'>";

var bystander = document.createElement("img");
bystander.src = "'images/bystander.jpg' style='width: 100%; height: 100%;'>";

var blueTeam = document.createElement("img");
blueTeam.src = "'images/blue-spy.jpg' style='width: 100%; height: 100%;'>";

var assassin = document.createElement("img");
assassin.src = "'images/black-spy.jpg' style='width: 100%; height: 100%;'>";

  
  //create teams
	for (var i = 0; i < 8; i++) {
		cards.append(redTeam);
		cards.append(blueTeam);
	}

	// // one extra for one of the teams
	// if (Math.floor(Math.random() * data.length) % 2 === 0) {
	// 	cards.append(redTeam);
	// 	$('#board').addClass('redStarts').removeClass('blueStarts');

	// } else {
	// 	cards.append(blueTeam);
	// 	$('#board').addClass('blueStarts').removeClass('redStarts');
	// }

	// add neturals 
	for (var i = 0; i < 7; i++) {
		cards.append(bystander);
	}

	// push the assasin
	cards.append(assasin);

// var cards = "<div class='back'><img src='images/blue-spy.jpg' style='width: 100%; height: 100%;'></div>"
// for (var i = 0; i < 8; i++){
//   $(".card m-3").push(cards);
// }
})