const Game = require("./game");
const Index = require("./index");
const SourceNode = require("./source_node");
const SubNode = require("./sub_node");

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.interval = 0;
    this.stored = [];
    this.subNodes = [];
    this.canvas = document.getElementById("canvas");
    this.registerEventListener = this.registerEventListener.bind(this);
    this.registerEventListener();
  }

  registerEventListener() {
    let self = this;
    this.canvas.addEventListener('mousedown', function() {
        let xCord = event.offsetX;
        let yCord = event.offsetY;
        self.stored.forEach((sourcenode) => {
          if (xCord >= sourcenode.xRange[0] && xCord <= sourcenode.xRange[1] &&
            yCord >= sourcenode.yRange[0] && yCord <= sourcenode.yRange[1]) {
              self.canvas.addEventListener('mouseup', function handler(e) {
                e.currentTarget.removeEventListener(e.type, handler);
                const xCordUp = event.offsetX;
                const yCordUp = event.offsetY;
                const subNode = new SubNode(xCordUp, yCordUp, self.ctx);
                subNode.drawSubNode();
              });
            }
        });
    });
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    let self = this;
    let newStore = [];
    const timeDelta = time - this.lastTime;
    if (this.interval === 250) {
      this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      this.stored.push(new SourceNode(this.stored));
      this.stored.forEach(function(sourcenode) {
        sourcenode.updateTimeAlive();
        if (sourcenode.timeAlive !== 0) {
          newStore.push(sourcenode);
        }
        self.stored = newStore;
        sourcenode.drawSourceNode(self.ctx);
      });
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
      this.lastTime = time;
      this.interval = 0;
    } else {
      this.interval += 1;
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = GameView;
