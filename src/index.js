const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("canvas");
  // canvasEl.width = 1000;
  // canvasEl.height = 600;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});
