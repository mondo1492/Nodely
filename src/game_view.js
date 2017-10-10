const Game = require("./game");
const Index = require("./index");
const SourceNode = require("./source_node");
const SubNode = require("./sub_node");
const DragLine = require("./drag_line");

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.interval = 0;
    this.interval2 = 0;
    this.stored = [];
    this.subNodes = [];
    this.dragLine = null;
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
              self.canvas.addEventListener('mousemove', function handler(e) {

                const xCordMove = event.offsetX;
                const yCordMove = event.offsetY;

                const dragLine = new DragLine(xCord, yCord, xCordMove, yCordMove);
                self.dragLine = dragLine;
                self.canvas.addEventListener('mouseup', function handler2(e2) {
                  e2.currentTarget.removeEventListener(e2.type, handler2);
                  e2.currentTarget.removeEventListener(e.type, handler);
                  self.dragLine = null;
                });
              });
              self.canvas.addEventListener('mouseup', function handler(e) {
                e.currentTarget.removeEventListener(e.type, handler);
                const xCordUp = event.offsetX;
                const yCordUp = event.offsetY;
                const subNode = new SubNode(xCordUp, yCordUp, self.ctx, sourcenode.val);
                self.subNodes.push(subNode);
              });
            }
        });
        self.subNodes.forEach(function(subnode) {

          if (xCord >= subnode.xRange[0] && xCord <= subnode.xRange[1] &&
            yCord >= subnode.yRange[0] && yCord <= subnode.yRange[1]) {
              let addVal = subnode.val;
              self.canvas.addEventListener('mousemove', function handler(e) {

                const xCordMove = event.offsetX;
                const yCordMove = event.offsetY;

                const dragLine = new DragLine(xCord, yCord, xCordMove, yCordMove);
                self.dragLine = dragLine;
                self.canvas.addEventListener('mouseup', function handler2(e2) {
                  e2.currentTarget.removeEventListener(e2.type, handler2);
                  e2.currentTarget.removeEventListener(e.type, handler);
                  self.dragLine = null;
                });
              });
              self.canvas.addEventListener('mouseup', function handler(e) {
                e.currentTarget.removeEventListener(e.type, handler);
                const xCordUp = event.offsetX;
                const yCordUp = event.offsetY;
                let addUp = false;
                let subNodeIdx = 0;
                while (subNodeIdx < self.subNodes.length) {
                  if (xCordUp >= self.subNodes[subNodeIdx].xRange[0] && xCordUp <= self.subNodes[subNodeIdx].xRange[1] &&
                    yCordUp >= self.subNodes[subNodeIdx].yRange[0] && yCordUp <= self.subNodes[subNodeIdx].yRange[1]) {
                      self.subNodes[subNodeIdx].val += addVal;
                      addUp = true;
                      break;
                    }
                    subNodeIdx += 1;
                }
                if (addUp === false) {
                  const subNode2 = new SubNode(xCordUp, yCordUp, self.ctx, addVal);
                  self.subNodes.push(subNode2);
                } else {
                  addUp = false;
                }

                // self.subNodes.forEach(function(subnode2) {
                //   if (xCordUp >= subnode2.xRange[0] && xCordUp <= subnode2.xRange[1] &&
                //     yCordUp >= subnode2.yRange[0] && yCordUp <= subnode2.yRange[1]) {
                //       subnode2.val += addVal;
                //     } else {
                //       const subNode2 = new SubNode(xCordUp, yCordUp, self.ctx, addVal);
                //       self.subNodes.push(subNode2);
                //     }
                // });
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
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.stored.forEach(function(sourcenode) {
      sourcenode.updateTimeAlive();
      if (sourcenode.timeAlive !== 0) {
        newStore.push(sourcenode);
      }
      self.stored = newStore;
      sourcenode.drawSourceNode(self.ctx);
    });



    if (this.interval === 250) {
      this.stored.push(new SourceNode(this.stored));


      this.game.step(timeDelta);
      this.game.draw(this.ctx);
      this.lastTime = time;
      this.interval = 0;
    } else {
      this.interval += 1;
      this.interval2 += 1;
    }

    if (this.dragLine !== null) {
      this.dragLine.draw(self.ctx);
    }

    this.subNodes.forEach(function(subnode) {
      subnode.drawSubNode(self.ctx);
    });

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = GameView;
