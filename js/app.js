//define constants --------------------------------------------------------------------
const submitButtonElement = document.querySelector("#submit");
const refreshButtonElement = document.querySelector("#refresh");

const timerCountdownElement = document.querySelector("#timer");
const timeisupElement = document.querySelector("#timeisup");
const resultElement = document.querySelector("#result");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#highscore");
const resetButtonElement = document.querySelector("#reset");

const addMusicButtonElement = document.querySelector("#music");

const guessInputElement = document.querySelector("#guessinput");

const wordDisplayElement = document.querySelector("#word-display");

//defining stuff
let guessedWord;
let highScore = 0;

// functions

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

    //UPDATE THE SCORE: let the score be zero or get the updated score
    let score = parseInt(localStorage.getItem("score")) || 0;
    //add score by 1 everytime user guessed correctly
    score += 1;
    //update the score element text with updated score value
    scoreElement.innerText = `Score: ${score}`;
    //update the local storage with the new score value
    localStorage.setItem("score", score);

    // UPDATE THE HIGHSCORE: if the score is more than the current highscore value, replace the highscore
    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = `Highscore: ${highScore} correct guesses`;
    }

    confetti({
      particleCount: 100, // Number of confetti particles
      spread: 70, // How wide the confetti spreads
      origin: { y: 0.6 }, // Where the confetti originates from (e.g., center-bottom)
      ticks: 50, //shorter duration
    });
    timer = 0;
  } else {
    resultElement.innerText = "You guessed it wrong ❌";
    timer = 0;
  }
});

// when reset button is pressed
resetButtonElement.addEventListener("click", () => {
  score = 0;
});

//when add music button is pressed
addMusicButtonElement.addEventListener("click", () => {
  rickroll.play();
});

// when refresh new word button is pressed
refreshButtonElement.addEventListener("click", () => {
  guessInputElement.value = ""; //clear the input field first
  timeisupElement.style.visibility = "hidden";
  resultElement.innerText = "";
  timer = 30;

  changeNewWord();
});
