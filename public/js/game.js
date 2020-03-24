$("#player-join").on('click', function() {
    console.log('clicked')
    $("#game-id").css('display', 'inline')
});


var wordArray = [];


$.get("/api/words", function(data) {
    for (var i = 0; i < data.length; i++) {
        wordArray.push(data[i].word);
    }
});

console.log(wordArray);

for (i = 0; i < wordArray.length; i++) {
    $(".card-title").text(wordArray[i]);
}
console.log(wordArray[i]);
