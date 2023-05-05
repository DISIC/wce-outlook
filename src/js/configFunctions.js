
//Shuffle array elements
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

export default {
    generateRoomName: function(){
        var charArray= ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var digitArray= ["0","1","2","3","4","5","6","7","8","9"];
        var roomName = shuffle(digitArray).join("").substring(0,randomIntFromInterval(3,6)) + shuffle(charArray).join("").substring(0,randomIntFromInterval(7,10));
        return shuffle(roomName.split("")).join("");
    }
}