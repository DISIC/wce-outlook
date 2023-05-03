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

// Generate random roomName
function generateRoomName(){
    var charArray= ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var digitArray= ["0","1","2","3","4","5","6","7","8","9"];
    var roomName = shuffle(digitArray).join("").substring(0,randomIntFromInterval(3,6)) + shuffle(charArray).join("").substring(0,randomIntFromInterval(7,10));
    return shuffle(roomName.split("")).join("");
}


const INVITE_TEMPLATE_FILE = 'https://localhost:3000/template.html';
const ENABLE_PHONE_ACCESS = true;
const PHONE_NUMBERS_API_URL = 'https://voxapi.joona.fr/api/v1/conn/jitsi/phoneNumbers';
const PHONE_PIN_CODE_API_URL = 'https://voxapi.joona.fr/api/v1/conn/jitsi/conference/code';
const ROOT_JITSI_DOMAIN = 'webconf.numerique.gouv.fr';
const JITSI_ROOM_NAME_FORMAT = generateRoomName();
//const PHONE_NUMBER_FORMAT = `%phone_country% : %phone_number%<br/>`;
const PHONE_NUMBER_FORMAT = `%phone_number%`;
