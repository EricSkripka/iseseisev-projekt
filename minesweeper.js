var count;
var first;
var size;
var board = [];
var revealed;
var scoreData = "";

$(document).ready(function(){
    $("#play").click(function(){
        $('#game').html('');
        size = getSize();
        first = true;
        count = getCount();
        revealed = 0;
        $("#score").html("");
        scoreData = "";
        registerSW();
        if(count != false && count < size*size){
            generate(size, count);
        } else {
            alert("invalid parameters!");
        }    
    });
});

async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (e) {
        console.log(`SW registration failed`);
      }
    }
}

function getSize(){
    var size;
    $('.size').each(function(index, element){
        if(element.checked){
            console.log($(element).val());
            size = $(element).val();
        }
    });
    return size;
}

function getCount(){
    if($('#count').val() != ''){
        return $('#count').val();
    }
    return false;
}

function generate(size, count){
    var $container = $("<div></div>").css("float","left");
    for(var i = 0; i < parseInt(size); i++) {
        for (var j = 0; j < parseInt(size); j++){
           box = $("<div i=" + i + " j=" + j + "><button>&nbsp;</button></div>").addClass("box").on("click", function(){
               reveal(parseInt($(this).attr("i")), parseInt($(this).attr("j")), $(this));
           }).appendTo($container);
        }
        $("<div></div>").css("clear", "both").appendTo($container);
    }
    $container.appendTo($("#game"));
}

function reveal(i, j, element){
    if(first == true){
        generateArray(i, j);
        first = false;
        console.log(board);
    }
    if(board[i][j] == "*"){
        alert("You Lost!");
        scoreData += "You lost. You made "+revealed+" move/moves."+"<br>"+"";
        $("#score").html(scoreData);
        element.find('button').text("*").addClass("bomb");
        return;
    }

    var bombCount = 0;
    $.each(neighbours(size, i,j), function(key, value){
        if(board[parseInt(value[0])][parseInt(value[1])] == "*"){
            bombCount++;
        }
    });
    element.find('button').text(bombCount).addClass("checked");
    revealed++;
    console.log(revealed);
    console.log(size*size);
    console.log(count);
    console.log(size*size - count);
    if(revealed == size*size - count){
        alert("You Win");
        scoreData += "You won. You made "+revealed+" move/moves."+"<br>"+"";
        $("#score").html(scoreData);
    }
}

function generateArray(initial_i, initial_j){
    counter = 0;
    max = size*size;
    bombCount = count;
    for(var i = 0; i < parseInt(size); i++) {
        board[i] = [];
        for (var j = 0; j < parseInt(size); j++){
            //max-counter-1, garanteerib, et taidab probleemideta ara valja oige pommi arvudega
            chance = ((bombCount) * 100) / (max- counter-1);
            if(i == initial_i && j == initial_j){
                chance = 0;
            }
            console.log(chance);
            if(Math.random() * 100 < chance){
                board[i][j] = "*";
                bombCount--;
            } else {
                board[i][j] = "";
            }
            counter++;
        }
    }
}
    
function neighbours(size,x,y) {
  var list=[];
  for (var i=-1; i<=1; i++) {    
    for (var j=-1; j<=1; j++) {
      // square is not a neighbour of itself
      if (i==0 && j==0) continue;
      // check whether the the neighbour is inside board bounds
      if ((x+i)>=0 && (x+i)<size && (y+j)>=0 && (y+j)<size) {
        list.push([x+i,y+j]);  
      }
    }
  }
  return list;
}  
