class Game {
  constructor() {
    this.x = 25;
  }
  step(timeDelta) {
  }
  draw(ctx) {
    // this.x += 1;
    // ctx.fillRect(this.x, 25, 100, 100);
    // ctx.clearRect(45, 45, 60, 60);
    // ctx.strokeRect(50, this.x, 50, 50);
  }
}
Game.DIM_X = 1000;
Game.DIM_Y = 600;

module.exports = Game;
