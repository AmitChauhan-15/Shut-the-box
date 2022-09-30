// ELEMENT SELECTOR

const homeNavigation = document.querySelector(".home-page");
const gameNavigation = document.querySelector(".game-page");
const ruleNavigation = document.querySelector(".rule-page");
const aboutNavigation = document.querySelector(".about-page");

const homePage = document.querySelector(".home");
const gamePage = document.querySelector(".game");
const rulePage = document.querySelector(".rule");
const aboutPage = document.querySelector(".about");
const winner = document.querySelector(".winner");
const playerWin = document.querySelector(".player-win");
const startGameBtn = document.querySelector(".play");
const closeRuleBtn = document.querySelector(".close");
const rollDiceBtn = document.querySelector(".roll-dice");
const dice1 = document.querySelector(".dice-1");
const dice2 = document.querySelector(".dice-2");
const tiles = document.querySelectorAll(".tiles");
const scoreOfPlayer1 = document.querySelector(".score-1");
const scoreOfPlayer2 = document.querySelector(".score-2");
const player1 = document.querySelector(".player-1");
const player2 = document.querySelector(".player-2");
const backgroundMusic = document.querySelector(".background-music");
const diceAudio = document.querySelector(".dice-rolled-audio");
const restartBtn = document.querySelector(".restart");

///////////////////////////////////
// GOBAL VARIABLE
///////////////////////////////////

let numberTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let sumOfDice;
let possibility = [];
let userInput = [];
let userSum;
let score1 = 0;
let score2 = 0;

////////////////////////////////////
// FUCTION
////////////////////////////////////

// 1.

const navigation = function (navElement) {
  homeNavigation.classList.remove("underline");
  gameNavigation.classList.remove("underline");
  ruleNavigation.classList.remove("underline");
  aboutNavigation.classList.remove("underline");

  aboutPage.classList.add("hidden");
  navElement.classList.add("underline");
};

// 2.
const playGame = function () {
  homePage.classList.add("hidden");
  gamePage.classList.remove("hidden");
  rulePage.classList.remove("hidden");
  gamePage.classList.add("overlay");
  navigation(gameNavigation);
};

const goHome = function () {
  homePage.classList.remove("hidden");
  gamePage.classList.add("hidden");
};

// 3.
const close = function () {
  gamePage.classList.remove("overlay");
  rulePage.classList.add("hidden");
};

// 4.
const diceRoll = function () {
  dice1.classList.add("hide");
  dice2.classList.add("hide");
  let firstDice = Math.trunc(Math.random() * 6 + 1);
  let secondDice = Math.trunc(Math.random() * 6 + 1);

  setTimeout(function () {
    dice1.classList.remove("hide");
    dice2.classList.remove("hide");
    dice1.setAttribute("src", `img/dice-${firstDice}.png`);
    dice2.setAttribute("src", `img/dice-${secondDice}.png`);
  }, 700);
  sumOfDice = firstDice + secondDice;

  diceAudio.play();

  // drop animation
  dice1.style.animation = "drop 0.5s ease-in-out";
  dice2.style.animation = "drop 0.5s ease-in-out";

  // hide roll button
  rollDiceBtn.classList.add("hide");

  // possibility
  possibleOutcome();

  // switching player
  setTimeout(switchPlayer, 2000);
};

// 5.
const possibleOutcome = function () {
  possibility = [];

  for (let i = 0; i < numberTiles.length; i++) {
    for (let j = i + 1; j < numberTiles.length; j++) {
      for (let k = j + 1; k < numberTiles.length; k++)
        if (numberTiles[i] + numberTiles[j] + numberTiles[k] === sumOfDice) {
          possibility.push([numberTiles[i], numberTiles[j], numberTiles[k]]);
        }
      if (numberTiles[i] + numberTiles[j] === sumOfDice)
        possibility.push([numberTiles[i], numberTiles[j]]);
    }
    if (numberTiles[i] === sumOfDice) possibility.push([numberTiles[i]]);
  }

  console.log(possibility);
};

// 6.
const switchPlayer = function () {
  if (possibility.length === 0 || numberTiles.length === 0) {
    if (player1.className.includes("active-player")) {
      score1 += numberTiles.reduce((a, tiles) => a + tiles, 0);
      scoreOfPlayer1.textContent = score1;
      intialPhase(player1);
      player2.classList.add("active-player");
      sumOfDice = 0;
      userInput = [];
    } else {
      score2 += numberTiles.reduce((a, tiles) => a + tiles, 0);
      scoreOfPlayer2.textContent = score2;
      intialPhase(player2);
      player1.classList.add("active-player");
      sumOfDice = 0;
      userInput = [];
    }
    if (player1.className.includes("active-player")) winnerDeclare();
  }
};

// 7.
const intialPhase = function (player) {
  numberTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  tiles.forEach((tile) => tile.classList.remove("tilt"));
  tiles.forEach((tile) => tile.classList.remove("in-active"));
  tiles.forEach((tile, i) => (tile.textContent = `${i + 1}`));
  player.classList.remove("active-player");
  rollDiceBtn.classList.remove("hide");
};

// 8.
const removeTiles = function () {
  if (userSum === sumOfDice) {
    for (let i = 0; i < userInput.length; i++) {
      tiles[userInput[i] - 1].classList.add("in-active");
      tiles[userInput[i] - 1].textContent = "";
      const index = numberTiles.indexOf(userInput[i]);
      if (index > -1) {
        numberTiles.splice(index, 1);
      }
    }
    userInput = [];
    userSum = 0;
    sumOfDice = 0;
    rollDiceBtn.classList.remove("hide");
  }

  if (numberTiles.length === 0) setTimeout(switchPlayer, 1000);
};

// 9.

const renderWinner = function (player) {
  winner.classList.remove("hidden");
  gamePage.classList.add("overlay");
  winnerDeclare.textContent = player;
};

// 10.
const winnerDeclare = function () {
  if (score1 > 45 && score1 > score2) {
    renderWinner("PLAYER-2");
  }
  if (score2 > 45 && score2 > score1) {
    renderWinner("PLAYER-1");
  }
};

///////////////////////////////////////
// ALL EVENTS
//////////////////////////////////////

backgroundMusic.autoplay = true;
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

// 1. play game
startGameBtn.addEventListener("click", playGame);

// 2. close rule
closeRuleBtn.addEventListener("click", close);

// 3. dice roll
rollDiceBtn.addEventListener("click", diceRoll);

// 4. titling numbered tiles and userinput
tiles.forEach((tile, i) =>
  tile.addEventListener("click", function () {
    tile.classList.toggle("tilt");

    // adding or removing tiles value in user input
    if (
      !(tile.className.lastIndexOf("tilt") == -1) &&
      tile.className.lastIndexOf("in-active") == -1
    ) {
      userInput.push(i + 1);
    } else {
      const index = userInput.indexOf(i + 1);
      userInput.splice(index, 1);
    }

    // sum of user-input
    userSum = userInput.reduce((a, v) => a + v, 0);

    removeTiles();
  })
);

// 5. navigation

homeNavigation.addEventListener("click", () => {
  navigation(homeNavigation);
  goHome();
});

gameNavigation.addEventListener("click", () => {
  navigation(gameNavigation);
  playGame();
  close();
});

ruleNavigation.addEventListener("click", () => {
  rulePage.classList.remove("hidden");
});

aboutNavigation.addEventListener("click", () => {
  navigation(aboutNavigation);
  aboutPage.classList.remove("hidden");
  gamePage.classList.add("hidden");
  homePage.classList.add("hidden");
});

// 6. restart game

restartBtn.addEventListener("click", () => {
  intialPhase(player2);
  score1 = 0;
  score2 = 0;
  scoreOfPlayer1.textContent = score1;
  scoreOfPlayer2.textContent = score2;
  gamePage.classList.remove("overlay");
  winner.classList.add("hidden");
});

// PREVENT SCROLL

window.addEventListener("scroll", function () {
  console.log("scroll");
});

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();
