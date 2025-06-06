// main.js

const sdk = window.FrameSDK; // Farcaster Frame SDK

// ---------- Global Değişkenler ----------
let wordLength = 5;
let maxGuesses = 5;
let currentGuess = '';
let attempts = [];
let dailyWord = '';
let attemptCount = 0;

// DOM Elemanları
const chooseScreen = document.getElementById('choose-game-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const wordLengthButtons = document.getElementById('word-length-buttons');
const guessCountButtons = document.getElementById('guess-count-buttons');
const startGameButton = document.getElementById('start-game-button');

const gameInfo = document.getElementById('game-info');
const guessGrid = document.getElementById('guess-grid');
const keyboardDiv = document.getElementById('keyboard');
const submitGuessButton = document.getElementById('submit-guess-button');

const resultMessage = document.getElementById('result-message');
const secretWordDisplay = document.getElementById('secret-word-display');
const revealWordDiv = document.getElementById('reveal-word');
const shareResultButton = document.getElementById('share-result-button');
const playAgainButton = document.getElementById('play-again-button');

// ---------- 1. Ekran: Oyun Seçimi ----------

// 1.1. “Word Length” Butonları
[3, 4, 5, 6].forEach(len => {
  const btn = document.createElement('button');
  btn.textContent = `${len} letters`;
  btn.onclick = () => {
    wordLength = len;
    Array.from(wordLengthButtons.children).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    checkStartEnabled();
  };
  wordLengthButtons.appendChild(btn);
});

// 1.2. “Guess Count” Butonları
[3, 4, 5].forEach(cnt => {
  const btn = document.createElement('button');
  btn.textContent = `${cnt} guesses`;
  btn.onclick = () => {
    maxGuesses = cnt;
    Array.from(guessCountButtons.children).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    checkStartEnabled();
  };
  guessCountButtons.appendChild(btn);
});

// 1.3.Write the rest of the main.js code (same as previously described)...
