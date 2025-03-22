import { Game } from "./Game";

// Initialize and start the game
window.addEventListener("DOMContentLoaded", () => {
  // Get canvas element
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  // Create game instance
  const game = new Game(canvas);

  // Handle window resize
  window.addEventListener("resize", () => {
    game.resize();
  });

  // Start the game
  game.start();
});
