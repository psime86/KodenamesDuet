$("#player-join").on('click', function() {
    console.log('clicked')
    $("#game-id").css('display', 'inline')
});

$(document).ready(function() {

    var cards = $(".card-title");

    console.log(cards);


    $.get("/api/words", function(data) {
        for (var i = 0; i < data.length; i++) {
           
            $(cards[i]).html(data[i].word);
        
            
        }
        console.log(data);


    });
    
    // console.log(wordArray);



    // // var wordDisplay = document.getElementsByClassName("card-title");

    // var wordDisplay  = $("#test9");

    // $.each(wordArray, function() {
    //     $(wordDisplay).append(this);
    //     console.log(this);
    // })

})




