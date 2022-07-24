var INPUT_LEN;
var NUMBER_OF_GUESSES;

let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;

const correctColor = 'darkseagreen'
const semiCorrectColor = 'lightcoral'
const incorrectColor = 'lightgrey'

// string characters together for answer
let rightGuessString = (Math.floor(Math.random() * 2)).toString();
if (INPUT_LEN != 1) {
    for (let i = 0; i < INPUT_LEN-1; i++) {
        rightGuessString += (Math.floor(Math.random() * 2)).toString();
    }
}

console.log(rightGuessString)

initBoard()

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey == "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey == "Enter") {
        checkGuess()
        return
    }

    if (pressedKey.toString() == 0 || pressedKey.toString() == 1) {
        insertLetter(pressedKey)
    } else {
        toastr.error("Not an accepted input. Please enter 0 or 1")
        return
    }
    //todo: consider  if (pressedKey.toString() == " ")

})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

//FUNCTIONS//

function initBoard() {

    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < INPUT_LEN; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

function insertLetter (pressedKey) {
    if (nextLetter == INPUT_LEN) {
        toastr.error("already full with " + INPUT_LEN + " digits")
        return
    }
    pressedKey = pressedKey.toString() 

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != INPUT_LEN) {
        toastr.error("Not enough letters!")
        return
    }

    for (let i = 0; i < INPUT_LEN; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])

        // todo: edit the logic
        if (currentGuess[i] == rightGuess[i]) {
            letterColor = correctColor
            rightGuess[letterPosition] = "#"
        } else if (letterPosition == -1) {
            letterColor = incorrectColor
        } else {
            letterColor = semiCorrectColor
            rightGuess[letterPosition] = "#"
        }

        // // is letter in the correct guess
        // if (letterPosition === -1) {
        //     letterColor = incorrectColor
        // } else {
        //     // now, letter is definitely in word
        //     // if letter index and right guess index are the same
        //     // letter is in the right position 
        //     if (currentGuess[i] == rightGuess[i]) {
        //         letterColor = correctColor
        //     } else {
        //         letterColor = semiCorrectColor
        //     }
        //     rightGuess[letterPosition] = "#"
        // }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        if (guessesRemaining == 4) {
            toastr.success("Insane!")
        } else if (guessesRemaining == 3) {
            toastr.success("Impressive!")
        } else if (guessesRemaining == 2) {
            toastr.success("Great Job!")
        } else if (guessesRemaining == 1) {
            toastr.success("Phew!")
        }
        
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.info(
                "You've run out of guesses!" + 
                `The correct byte was: "${rightGuessString}"`
            )
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === correctColor) {
                return
            } 

            if (oldColor === semiCorrectColor && color !== correctColor) {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

var MYLIBRARY = MYLIBRARY || (function(){

    return {
        init : function(il, ng) {
            INPUT_LEN = il;
            NUMBER_OF_GUESSES = ng; 
        }
    };
}());