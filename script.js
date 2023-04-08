const startBtn = document.getElementById('start');
const gameBoard = document.querySelector('.game-board');
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const roundDisplay = document.getElementById('round');
const missedStrikesDisplay = document.getElementById("missed-strikes");
const startSound = document.getElementById('start-sound');
const highScoreDisplay = document.getElementById("high-score");
let highScore = 0;
let score = 0;
let timeLeft = 30;
let lastHole;
let gameTime;
let missedStrikes = 0;
let round = 1;
let moleSpeed = 1;
let gameActive = false;
let moleActive = false;


startBtn.addEventListener("click", startGame);

function stopAudio() {
  const audio = document.getElementById('start-sound');
  audio.pause();
  audio.currentTime = 0;
}
function playMissedMoleAudio() {
  missedMoleSound.play();
}

// Load the high score from localStorage if it exists
function loadHighScore() {
  const storedHighScore = localStorage.getItem("highScore");
  if (storedHighScore) {
    highScore = parseInt(storedHighScore, 10);
    highScoreDisplay.textContent = highScore;
  }
}

loadHighScore();

function startGame() {
  if (gameActive) return;
  gameActive = true;
  startBtn.disabled = true;
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  missedStrikes = 0;

  scoreDisplay.textContent = score;
  moleSpeed = 1;
  roundDisplay.innerText = round;
  missedStrikesDisplay.textContent = missedStrikes;

  startSound.play();

  gameTime = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameTime);
      startNextRound();
    }
  }, 1000);

  // Add the following function
  function startNextRound() {
    startBtn.disabled = false;
    round++;
    moleSpeed *= 0.95;
    roundDisplay.innerText = round;
    gameActive = false;
    if (round <= 9) {
      startGame();
    }
  }

  function showMole() {
    let numberOfMoles;
    if (round <= 5) {
      numberOfMoles = 1;
    } else if (round <= 9) {
      numberOfMoles = 2;
    } else {
      numberOfMoles = 3;
    }

    for (let i = 0; i < numberOfMoles; i++) {
      const moleTime = Math.floor(Math.random() * (2000 - moleSpeed * 100) + 1000);
      const hole = randomHole(holes);

      // Determine if this iteration should show a bomb instead of a mole
      const showBomb = i === 0 && round > 1; // Only show a bomb in the first iteration and if the round is greater than 1

      const creature = document.createElement("div");
      if (showBomb) {
        creature.classList.add("bomb");
        creature.id = "bomb-" + Date.now() + "-" + i; // Add a unique identifier to each bomb
        creature.addEventListener("click", hitBomb); // Add event listener to each bomb individually
      } else {
        creature.classList.add("mole");
        creature.id = "mole-" + Date.now() + "-" + i; // Add a unique identifier to each mole
        creature.addEventListener("click", hitMole); // Add event listener to each mole individually
      }

      hole.appendChild(creature);

      setTimeout(() => {
        if (creature.parentElement) {
          hole.removeChild(creature);
          if (!showBomb) {
            missedStrikes++;
            missedStrikesDisplay.textContent = missedStrikes;
            playMissedMoleAudio();
            if (missedStrikes >= 3) {
              gameOver();
            }
          }
        }
        hole.removeEventListener("click", showBomb ? hitBomb : hitMole);
      }, moleTime);
    }
  }

  function hitBomb(e) {
    if (!e.isTrusted) return;
    clearInterval(gameTime);
    startBtn.disabled = false;
    gameActive = false;

    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      localStorage.setItem("highScore", highScore);
    }

    clearInterval(gameInterval); // Add this line
    alert("Game Over! You hit a bomb. Your score: " + score);
    location.reload();
  }


function gameOver() {
  clearInterval(gameTime);
  startBtn.disabled = false;
  gameActive = false;

  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;

    // Save the high score to localStorage
    localStorage.setItem("highScore", highScore);
  }

  // Game over alert and refresh the page
  alert("Game Over! Your score: " + score);
  location.reload();
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function hitMole(e) {
  if (!e.isTrusted) return;
  score += 10;
  scoreDisplay.textContent = score;
  const mole = e.target.closest(".mole");
  if (mole) {
    mole.parentElement.removeChild(mole);
    mole.removeEventListener("click", hitMole); // Remove event listener from the hit mole
  }
}
// Get the audio elements and the volume control input
const missedMoleSound = document.getElementById("missed-mole-sound");
const volumeControl = document.getElementById("volume");

// Function to set the volume of the audio elements
function setVolume(volume) {
  startSound.volume = volume;
  missedMoleSound.volume = volume;
}

// Set the initial volume
setVolume(volumeControl.value);

// Add event listener for the volume control input
volumeControl.addEventListener("input", (event) => {
  setVolume(event.target.value);
});
}


