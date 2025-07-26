// --- VARIABLE SETUP ---
const drums = document.querySelectorAll(".drum");
const body = document.querySelector("body");

// Game Mode Variables
let gameSequence = [];
let playerSequence = [];
let level = 0;
let isGameActive = false;
const availableKeys = ["w", "a", "s", "d", "j", "k", "l"];

// UI Elements
const startGameBtn = document.getElementById("startGameBtn");
const title = document.getElementById("title");


// --- EVENT LISTENERS ---

// Start Game Button
startGameBtn.addEventListener("click", startGame);

// Drum Clicks
drums.forEach(drum => {
  drum.addEventListener("click", function() {
    const key = this.innerHTML;
    handleInteraction(key);
  });
});

// Keyboard Presses
document.addEventListener("keypress", function(event) {
  // Check if the pressed key is one of our drum keys
  if (availableKeys.includes(event.key)) {
    handleInteraction(event.key);
  }
});


// --- CORE LOGIC ---

function handleInteraction(key) {
  // Play sound and show animation regardless of game mode
  playSound(key);
  buttonAnimation(key);

  // If a game is active, handle game logic
  if (isGameActive) {
    playerSequence.push(key);
    checkAnswer(playerSequence.length - 1);
  }
}

function checkAnswer(currentLevelIndex) {
  if (playerSequence[currentLevelIndex] === gameSequence[currentLevelIndex]) {
    // If the entire sequence is correct so far
    if (playerSequence.length === gameSequence.length) {
      title.textContent = "Correct! Get Ready...";
      setTimeout(nextLevel, 1000);
    }
  } else {
    // If the player makes a mistake
    title.innerHTML = `Game Over! Your Score: ${level-1} <br> Press Start to Play Again.`;
    body.classList.add("game-over");
    setTimeout(() => body.classList.remove("game-over"), 200);
    resetGame();
  }
}


// --- GAME MODE FUNCTIONS ---

function startGame() {
  resetGame();
  isGameActive = true;
  startGameBtn.style.display = "none"; // Hide button during game
  nextLevel();
}

function nextLevel() {
  playerSequence = [];
  level++;
  title.textContent = "Level " + level;

  // Add a new random key to the sequence
  const randomNumber = Math.floor(Math.random() * availableKeys.length);
  const randomKey = availableKeys[randomNumber];
  gameSequence.push(randomKey);

  // Show the sequence to the player
  playSequence();
}

function playSequence() {
  let i = 0;
  title.textContent = "Watch carefully...";
  const interval = setInterval(() => {
    buttonAnimation(gameSequence[i]);
    playSound(gameSequence[i]);
    i++;
    if (i >= gameSequence.length) {
      clearInterval(interval);
      title.textContent = "Your turn!";
    }
  }, 700); // 700ms between each flash
}

function resetGame() {
  isGameActive = false;
  gameSequence = [];
  playerSequence = [];
  level = 0;
  startGameBtn.style.display = "inline-block"; // Show button again
}


// --- UTILITY FUNCTIONS (SOUND & ANIMATION) ---

function playSound(key) {
  let audioSrc;
  switch (key) {
    case "w": audioSrc = "sounds/tom-1.mp3"; break;
    case "a": audioSrc = "sounds/tom-2.mp3"; break;
    case "s": audioSrc = "sounds/tom-3.mp3"; break;
    case "d": audioSrc = "sounds/tom-4.mp3"; break;
    case "j": audioSrc = "sounds/crash.mp3"; break;
    case "k": audioSrc = "sounds/kick-bass.mp3"; break;
    case "l": audioSrc = "sounds/snare.mp3"; break;
    default: return; // Do nothing if key is not valid
  }
  const audio = new Audio(audioSrc);
  audio.play();
}

function buttonAnimation(key) {
  const activeButton = document.querySelector("." + key);
  if (activeButton) {
    activeButton.classList.add("pressed");
    setTimeout(() => {
      activeButton.classList.remove("pressed");
    }, 150);
  }
}
