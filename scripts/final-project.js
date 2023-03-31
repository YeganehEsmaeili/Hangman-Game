const popup = document.querySelector('.popup-about');
const overlay = document.querySelector('.overlay');
const btnCloseAbout = document.querySelector('.close-about');
const btnsOpenAbout = document.querySelectorAll('#show-about');

const openPopup = function () {
  popup.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeAbout = function () {
  popup.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenAbout[0].addEventListener('click', openPopup);

btnCloseAbout.addEventListener('click', closeAbout);
overlay.addEventListener('click', closeAbout);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
    closeAbout();
  }
});

const imagesPath    = 'images/';
const hangmanPath  = imagesPath + 'hangman/';

const $alphabetButtons  = $('#alphabet-buttons');
const $hangmanWord      = $('#hangman-word');
const $hangmanHint      = $('#hangman-hint');
const $hangmanGuess     = $('#hangman-guesses');
const $hangmanImage     = $('#hangman-img');

const wordHintDic = { "apple" : "FRUIT",
                      "orange": "FRUIT",
                       "grape": "FRUIT",
                       "pear": "FRUIT",
                       "grapefruit": "FRUIT",
                       "pineapple": "FRUIT",
                       "watermelon": "FRUIT",
                       "dragon fruit": "FRUIT",
                       "durian" : "FRUIT",
                       "cherry" : "FRUIT",
                     };

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

class HangmanGame {
  constructor(wordHintDictionary){
    this.foundTheWord = false;
    this.wordHintDictionary = wordHintDictionary;
    this.alphabetLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    this.guessedLetters = [];
    this.guessesLeft = 6;
    this.resetGame();
    this.updateImage();
    this.insertAlphabetLetters();
    this.updateHiddenWord();
  };

  resetGame(){
    this.foundTheWord = false;
    this.word = Object.keys(this.wordHintDictionary)[Math.floor(Math.random() * Object.keys(this.wordHintDictionary).length)]
    this.hint = this.wordHintDictionary[this.word];
    this.guessedLetters = [];
    this.guessesLeft = 6;
    $alphabetButtons.empty();
    this.insertAlphabetLetters();
    this.updateHiddenWord();
    this.updateImage();
    $hangmanHint.text(`Word hint: ${this.hint}`);
    this.updateGuessesLeft();
  };

  winGame(){
    
    $hangmanHint.text(`You Win! Congratulations!`);
    this.insertResetButton();
    
  };

  loseGame(){
    $hangmanHint.text(`You Lose! The word was: ${this.word}`);
    this.insertResetButton();
  };

  updateGuessesLeft(){
    $hangmanGuess.html(`You have <b>${this.guessesLeft}</b> guesses left.`);
  };

  updateImage(isWin){
    if (isWin){
      $hangmanImage.attr('src', hangmanPath + "hangman-win.png");
    } else {
      $hangmanImage.attr('src', hangmanPath + "hangman-0" + String(this.guessesLeft) + ".png");
    };
  };
  

  disableLetterButtons(){
    this.alphabetLetters.forEach((letter)=>{
      if (this.guessedLetters.includes(letter) != true){
        $('#btn_' + letter).addClass('btn-disabled-override-colored'); 
      };
    });
  };

  updateHiddenWord(){
    let hiddenWord = '';
    Array.from(this.word).forEach((letter)=>{
      if (this.guessedLetters.includes(letter) == true){
        hiddenWord += letter;
      } else {
        hiddenWord += '_';
      };
      hiddenWord += ' ';
    });
    $hangmanWord.text(hiddenWord);
    if (hiddenWord.replace(/ /g, "") == this.word){
      this.foundTheWord = true;
    } 
  };

  guessLetter(letter){ 
    $('#btn_' + letter).addClass('btn-disabled-override'); 
    this.guessedLetters.push(letter);

    if (this.word.includes(letter) == false){
      this.guessesLeft--;
    }
    this.updateCurrentWordStatus()
  };

  updateCurrentWordStatus(){
    this.updateGuessesLeft();
    this.updateHiddenWord();
    this.updateImage(false);

    if (this.foundTheWord) {
      this.disableLetterButtons()
      this.winGame();
      this.updateImage(true);
      return true;
    }

    if(this.guessesLeft === 0){
      this.disableLetterButtons()
      this.loseGame();
      return false
    };
  };

  insertAlphabetLetters(){
    $alphabetButtons.empty();
    this.alphabetLetters.forEach((letter)=>{
        $alphabetButtons.append(`<button class="btn-alphabet-letter" id="btn_${letter}" onClick="guess('${letter}')">${letter.toUpperCase()}</button>`);
    });
  };

  insertResetButton(){
    $hangmanGuess.html(`<button class="btn-reset action-button" onClick="resetGame()">Play Again!</button>`);
  };
};

const hangmanGame = new HangmanGame(wordHintDic);

function guess(string){
  hangmanGame.guessLetter(string);
};

function resetGame(){
  hangmanGame.resetGame();
};


