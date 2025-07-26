//define constants --------------------------------------------------------------------
const submitButtonElement = document.querySelector("#submit");
const refreshButtonElement = document.querySelector("#refresh");

const timerCountdownElement = document.querySelector("#timer");
const timeisupElement = document.querySelector("#timeisup");
const resultElement = document.querySelector("#result");

const guessInputElement = document.querySelector("#guessinput");

const wordDisplayElement = document.querySelector("#word-display");

// functions
let guessedWord;
//rearrange the letters in the word & display it to the frontend
function changeNewWord() {
  const randomWordsIndex = Math.floor(Math.random() * words.length);
  guessedWord = words[randomWordsIndex].Word;
  const hint = words[randomWordsIndex].hint;

  guessedWordArray = guessedWord.split(""); // split the word into individual letters

  const randomizedWordArray = randomize(guessedWordArray);
  console.log(randomizedWordArray);

  //the random letters in an array combine into a string
  const randomizedJoinWord = randomizedWordArray.join("");

  //display the text on screen
  wordDisplayElement.innerText = randomizedJoinWord + "\n\nWord Hint: " + hint;
}

changeNewWord();

// Randomize the letters of the guessed word and display it -------------------------------------

//fisher yates algo to randomize the letters in the array
function randomize(guessedWordArray) {
  //go from back to front of the letters in the arrayww
  for (let i = guessedWordArray.length - 1; i > 0; i--) {
    // generate a random index
    const j = Math.floor(Math.random() * (i + 1));

    //swap i and j in the array order
    [guessedWordArray[i], guessedWordArray[j]] = [
      guessedWordArray[j],
      guessedWordArray[i],
    ];
  }
  return guessedWordArray;
}

// countdown for for the timer ---------------------------------------------------------------------------------------------------

let timer = 30;
function timercountdown() {
  setInterval(() => {
    timerCountdownElement.innerText = `Time Left To Guess: ${timer}s`;
    timer -= 1;

    if (timer < 0) {
      clearInterval(timer);
      timerCountdownElement.innerText = "Time left To Guess: 0s";
      timeisupElement.style.visibility = "visible";
    }
  }, 1000);
}

//call the function so timer starts counting down
timercountdown();

// when user types into text input to guess word submit button is pressed  -----------------------------------------------------
submitButtonElement.addEventListener("click", () => {
  const formInput = guessInputElement.value;
  if (formInput.toLowerCase() === guessedWord.toLowerCase()) {
    resultElement.innerText = "You guessed it correctly! ✅";
    timer = 0;
  } else {
    resultElement.innerText = "You guessed it wrong ❌";
    timer = 0;
  }
});

// when refresh new word button is pressed
refreshButtonElement.addEventListener("click", () => {
  guessInputElement.value = ""; //clear the input field first
  timeisupElement.style.visibility = "hidden";
  timer = 30;

  changeNewWord();
});
