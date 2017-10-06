const Game = require("./game");
const Index = require("./index");
const SourceNode = require("./source_node");

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.interval = 0;
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    if (this.interval === 10) {
      const sourceNode = new SourceNode(5);
      sourceNode.drawSourceNode(this.ctx);
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
      this.lastTime = time;
      console.log(this.interval);
      this.interval = 0;
    } else {
      this.interval += 1;
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = GameView;
