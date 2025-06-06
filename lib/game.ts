// lib/game.ts
export function getRandomWord() {
  const words = ["apple", "train", "plane", "world", "monad"];
  return words[Math.floor(Math.random() * words.length)];
}
