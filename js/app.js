//define constants --------------------------------------------------------------------
const submitButtonElement = document.querySelector("#submit");
const refreshButtonElement = document.querySelector("#refresh");

const timerCountdownElement = document.querySelector("#timer");
const timeisupElement = document.querySelector("#timeisup");
const resultElement = document.querySelector("#result");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#highscore");
const resetButtonElement = document.querySelector("#reset");

const selectCategoryElement = document.querySelector("#select-difficulty");

const addMusicButtonElement = document.querySelector("#music");

const guessInputElement = document.querySelector("#guessinput");

const wordDisplayElement = document.querySelector("#word-display");

const closeButtonElement = document.querySelector("#close-button");
const popup = document.querySelector("#win-popup");
const popupBackgroundElement = document.querySelector("#popup-background");

//homepage sections
const homeSectionElement = document.querySelector("#homeSection");
const gameSectionElement = document.querySelector("#gameSection");
const welcomeMessageElement = document.querySelector("#welcomeMessage");
const userNameElement = document.querySelector("#playerName");
const startGameElement = document.querySelector("#startGameButton");

//defining stuff
let guessedWord;
let highScore = 0;

let guessedWordSet = new Set(); //all the words that people have guessed already will come into this set

// functions ----------------------------------

//CHANGE THE WORD ON DISPLAY FUNCTION: rearrange the letters in the word & display it to the frontend
function changeNewWord() {
  //Which category did user select: user selects from animals, countries categories
  const selectedCategory = selectCategoryElement.value;

  //which word list from words.js file is selected
  let selectedWordList;
  if (selectedCategory === "fruits") {
    selectedWordList = fruits;
  } else if (selectedCategory === "animals") {
    selectedWordList = animals;
  } else if (selectedCategory === "countries") {
    selectedWordList = countries;
  } else {
    selectedWordList = words;
  }

  // filters out the words already guessed in, filter callback function = false, wordObj is removed from array
  const availableWords = selectedWordList.filter(
    (wordObj) => !guessedWordSet.has(wordObj.Word)
  );

  // if there are no more remaining words in the category tell the user
  if (availableWords.length === 0) {
    wordDisplayElement.innerText =
      "All the words in this category have been guessed. Please select another category to continue playing. Congrats you won!";
    return;
  }

  //Generate a random number using floor/random, then select that word from the words.js array
  const randomWordsIndex = Math.floor(Math.random() * availableWords.length);
  guessedWord = availableWords[randomWordsIndex].Word;
  const hint = availableWords[randomWordsIndex].hint;

  guessedWordArray = guessedWord.split(""); // split the word into individual letters

  const randomizedWordArray = randomize(guessedWordArray); //randomize the individual letters
  console.log(randomizedWordArray);

  //the random letters in an array combine into a string
  const randomizedJoinWord = randomizedWordArray.join("");

  //display the text on screen
  wordDisplayElement.innerText = randomizedJoinWord + "\n\nWord Hint: " + hint;
}

changeNewWord();

// RANDOMIZE LETTERS FUNCTION: Randomize the letters of the guessed word and display it -------------------------------------

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

// COUNTDOWN FUNCTION: countdown for for the timer ---------------------------------------------------------------------------------------------------

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

//EVENT LISTENERS ---------------------------------------------------

// SUBMIT BUTTON PRESSED: when user types into text input to guess word  -----------------------------------------------------
submitButtonElement.addEventListener("click", () => {
  //remove whitespace from user input in the form
  const formInput = guessInputElement.value.trim();

  // if user tries to guess a word that is already guessed previously, give an error
  if (guessedWordSet.has(guessedWord)) {
    resultElement.innerText =
      "You already guessed this word. Press reset new word to generate a new word.";
    return;
  }

  if (formInput.toLowerCase() === guessedWord.toLowerCase()) {
    resultElement.innerText = "You guessed it correctly! ✅";

    //the word that was guessed add it into the set to prevent repeating of same word
    guessedWordSet.add(guessedWord);

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
      popup.style.display = "block"; //display the popup to win the game
      popupBackgroundElement.style.display = "block"; //display black background

      confetti({
        particleCount: 100, // Number of confetti particles
        spread: 70, // How wide the confetti spreads
        origin: { y: 0.6 }, // Where the confetti originates from (e.g., center-bottom)
        ticks: 30, //shorter duration
      });
    }

    confetti({
      particleCount: 100, // Number of confetti particles
      spread: 70, // How wide the confetti spreads
      origin: { y: 0.6 }, // Where the confetti originates from (e.g., center-bottom)
      ticks: 30, //shorter duration
    });
    timer = 0;
  } else {
    resultElement.innerText = "You guessed it wrong ❌";
    timer = 0;
  }
});

// ENTER Button is pressed after people guess the word
guessInputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitButtonElement.click(); //call the submit clicked event listener
  }
});

// RESET BUTTON PRESSED: Scores go to zero
resetButtonElement.addEventListener("click", () => {
  localStorage.setItem("score", 0);
  guessInputElement.value = "";
  scoreElement.innerText = `Score: 0`;
});

// MUSIC BUTTON PRESSED: Play music
addMusicButtonElement.addEventListener("click", () => {
  rickroll.play();
});

// REFRESH BUTTON PRESSED: Change a new word
refreshButtonElement.addEventListener("click", () => {
  guessInputElement.value = ""; //clear the input field first
  timeisupElement.style.visibility = "hidden";
  resultElement.innerText = "";
  timer = 30;

  changeNewWord();
});

// USER CHANGES WORD CATEGORY: Different word shows up
selectCategoryElement.addEventListener("change", () => {
  guessInputElement.value = "";
  timeisupElement.style.visibility = "hidden";
  resultElement.innerText = "";
  timer = 30;
  changeNewWord();
});

//Close Button On popup is pressed
closeButtonElement.addEventListener("click", () => {
  popup.style.display = "none";
  popupBackgroundElement.style.display = "none";
});

// HOME PAGE SECTION: User submits Name after pressing submit button
startGameElement.addEventListener("click", (event) => {
  event.preventDefault(); //this stops the form from reloading, welcome message remains
  const name = userNameElement.value.trim(); //remove whitespace

  //if user does not input any name prevent it from continuing
  if (name === "") {
    alert("Please enter your name in the field to proceed");
    return;
  }

  welcomeMessageElement.textContent = `Welcome, ${name}!`;

  // homeSectionElement.style.display = "none";
  // gameSectionElement.style.display = "block";
  homeSectionElement.classList.add("hidden");
  gameSectionElement.classList.remove("hidden");
});
