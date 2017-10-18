const Game = require("./game");
const Index = require("./index");
const SourceNode = require("./source_node");
const SubNode = require("./sub_node");
const DragLine = require("./drag_line");
const PowerBall = require("./power_ball");

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.interval = 0;
    this.interval2 = 0;
    this.stored = [];
    this.subNodes = [];
    this.lines = [];
    this.balls = [];
    this.subNodeBalls = [];
    this.paused = false;
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
        self.stored.forEach(function(sourcenode) {
          self.userInput(xCord, yCord, sourcenode);
        });
        self.subNodes.forEach(function(subnode) {
          self.userInput(xCord, yCord, subnode);
        });
    });

    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 80 && self.paused === false) {
        self.paused = true;
      } else {
        self.paused = false;
        requestAnimationFrame(self.animate.bind(self));
      }
    });
  }

  userInput(xCord, yCord, node) {
    let self = this;
    if (xCord >= node.xRange[0] && xCord <= node.xRange[1] &&
      yCord >= node.yRange[0] && yCord <= node.yRange[1]) {
        let addVal = node.val;
        // console.log(node.addedValues);
        self.canvas.addEventListener('mousemove', function handler(e) {
          const xCordMove = event.offsetX;
          const yCordMove = event.offsetY;
          self.dragLine = new DragLine(xCord, yCord, xCordMove, yCordMove);
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
          if (node instanceof SourceNode) {
            // node.addLines(self.dragLine);
            const powerBall = new PowerBall(self.dragLine, node);
            self.dragLine.balls.push(powerBall);
            // self.balls.push(powerBall);
          } else {
            // node.addLines(self.dragLine);
            const powerBall = new PowerBall(self.dragLine, node);
            console.log("THIS is a node", node);
            self.dragLine.balls.push(powerBall);
          }
          // node.addLines(self.dragLine);
          while (subNodeIdx < self.subNodes.length) {
            if (xCordUp >= self.subNodes[subNodeIdx].xRange[0] &&
                xCordUp <= self.subNodes[subNodeIdx].xRange[1] &&
                yCordUp >= self.subNodes[subNodeIdx].yRange[0] &&
                yCordUp <= self.subNodes[subNodeIdx].yRange[1]) {
                self.subNodes[subNodeIdx].val += addVal;
                self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.subNodes[subNodeIdx];
                // destNode.addedValues[String(self.subNodes[subNodeIdx].uniqId)] = 0;
                // self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.subNodes[subNodeIdx];
                // self.subNodes[subNodeIdx].updateAddedValues(node.id); // took this out for now
                node.associated.push(self.subNodes[subNodeIdx]);
                node.addLines(self.dragLine);
                // if (node instanceof SubNode) {
                //     node.updateAddedValues(node.uniqId);
                // }
                addUp = true;
                break;
              }
              subNodeIdx += 1;
          }
          if (addUp === false) {
            self.subNodes.push(new SubNode(xCordUp, yCordUp, self.ctx, addVal));
            self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.subNodes[subNodeIdx];
            node.associated.push(self.subNodes[subNodeIdx]);
            // self.subNodes[subNodeIdx].updateAddedValues(node.id);
            if (node instanceof SourceNode) {
              node.addLines(self.dragLine);
            } else {
              node.addLines(self.dragLine);
              // self.lines.push(self.dragLine);
            }
          } else {
            addUp = false;
          }
        });
      }

  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  drawBallsFromLine(line, node) {
    let self = this;
    let ballIdx = 0;
    const newBallStore = [];
    while (ballIdx < line.balls.length) {
      let ball = line.balls[ballIdx];
      ball.draw(self.ctx);
      ball.updatePosition();
      if (ball.reachedDestination()) {
        ball.destinationNode.updateAddedValues(ball.associatedNode.uniqId);
      } else {
        ball.destinationNode.setAddedValues(ball.associatedNode.uniqId);
        newBallStore.push(ball);
      }
      ballIdx += 1;
    }
    line.balls = newBallStore;
  }

  animate(time) {
    if (this.paused === false) {
      let self = this;
      let newStore = [];
      const timeDelta = time - this.lastTime;
      this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      if (this.dragLine !== null) {
        this.dragLine.draw(self.ctx);
      }
      this.stored.forEach(function(sourcenode) {
        sourcenode.updateTimeAlive();
        if (sourcenode.timeAlive > 0) {
          newStore.push(sourcenode);
        } else if (sourcenode.associated.length > 0){
          sourcenode.associated.forEach(function(subnode){
            let updateQueue = [subnode];
            let currentSubNode;
            while (updateQueue.length > 0) {
              currentSubNode = updateQueue.shift();
              currentSubNode.val -= sourcenode.val;
              currentSubNode.associated.forEach(function(subnode2){
                updateQueue.push(subnode2);
              });
            }
          });
        }
        self.stored = newStore;
        sourcenode.lines.forEach(function(line) {
          self.drawBallsFromLine(line);
          line.draw(self.ctx);
        });
        sourcenode.drawSourceNode(self.ctx);
      });

      if (this.interval === 400) {
        this.stored.push(new SourceNode(this.stored));
        this.lastTime = time;
        this.interval = 0;
      } else {
        this.interval += 1;
        this.interval2 += 1;
      }
      const subNodeStore = [];
      this.subNodes.forEach(function(subnode) {

        if (subnode.val > 0) {
          subnode.lines.forEach(function(line) {
            if (subnode.isFullyPowered()) {
              console.log(subnode.isFullyPowered());
              self.drawBallsFromLine(line, subnode);
            }

            line.draw(self.ctx);
          });
          subNodeStore.push(subnode);
          subnode.drawSubNode(self.ctx);
        }

      });
      self.subNodes = subNodeStore;
      // this.balls.forEach(function(ball) {
      //   ball.updatePosition();
      //   ball.draw(self.ctx);
      // });
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.game.drawPausedScreen(this.ctx);
      this.ctx.globalAlpha = 1;
    }
  }
}

module.exports = GameView;
