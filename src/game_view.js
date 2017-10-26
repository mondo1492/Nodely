const Game = require("./game");
const Index = require("./index");
const SourceNode = require("./source_node");
const SubNode = require("./sub_node");
const DragLine = require("./drag_line");
const PowerBall = require("./power_ball");
const SinkNode = require("./sink_node");

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.interval = 0;
    this.interval2 = 0;
    this.newGame = true;
    this.stored = [];
    this.subNodes = [];
    this.lines = [];
    this.lineQueue = [];
    this.subNodeBalls = [];
    this.gameOver = false;
    this.sinkNodes = [];
    this.paused = false;
    this.dragLine = null;
    this.count = 0;
    this.skipMouseMove = false;
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
      } else if (e.keyCode === 80 && self.paused === true) {
        self.paused = false;
        requestAnimationFrame(self.animate.bind(self));
      }
    });
  }


  deleteNode(xCord, yCord) {

    ///fix this
    let subNodeIdx = 0;
    let sourceNodeIdx = 0;
    let newNodes = [];
    // let newLines = [];
    let self = this;
    console.log('Delete');
    while (subNodeIdx < this.subNodes.length) {
      if (!(xCord >= this.subNodes[subNodeIdx].xRange[0] &&
          xCord <= this.subNodes[subNodeIdx].xRange[1] &&
          yCord >= this.subNodes[subNodeIdx].yRange[0] &&
          yCord <= this.subNodes[subNodeIdx].yRange[1])) {
            newNodes.push(this.subNodes[subNodeIdx]);
            for (let i = 0; i < this.subNodes[subNodeIdx].lines.length; i++) {
              if (xCord >= this.subNodes[subNodeIdx].lines[i].destinationNode.xRange[0] &&
                  xCord <= this.subNodes[subNodeIdx].lines[i].destinationNode.xRange[1] &&
                  yCord >= this.subNodes[subNodeIdx].lines[i].destinationNode.yRange[0] &&
                  yCord <= this.subNodes[subNodeIdx].lines[i].destinationNode.yRange[1]) {
                this.subNodes[subNodeIdx].deleteLine(i);
              }
            }
          }
          subNodeIdx += 1;
        }

      // while (sourceNodeIdx < this.stored.length) {
      //   if (!(xCord >= this.stored[sourceNodeIdx].xRange[0] &&
      //       xCord <= this.stored[sourceNodeIdx].xRange[1] &&
      //       yCord >= this.stored[sourceNodeIdx].yRange[0] &&
      //       yCord <= this.stored[sourceNodeIdx].yRange[1])) {
      //         for (let i = 0; i < this.stored[sourceNodeIdx].lines.length; i++) {
      //           if (xCord >= this.stored[sourceNodeIdx].lines[i].destinationNode.xRange[0] &&
      //               xCord <= this.stored[sourceNodeIdx].lines[i].destinationNode.xRange[1] &&
      //               yCord >= this.stored[sourceNodeIdx].lines[i].destinationNode.yRange[0] &&
      //               yCord <= this.stored[sourceNodeIdx].lines[i].destinationNode.yRange[1]) {
      //             this.stored[sourceNodeIdx].deleteLine(i);
      //           }
      //         }
      //       }
      //       sourceNodeIdx += 1;
      //     }
      self.skipMouseMove = false;
      this.subNodes = newNodes;
  }

  onSameChain(src, end) {
    let queue = [src];
    while (queue.length > 0) {
      let currentNode = queue.shift();
      if (currentNode === end) {
        return true;
      }
      currentNode.lines.forEach(function(line){
        queue.push(line.destinationNode);
      });
    }
    return false;
  }

  userInput(xCord, yCord, node) {
    let self = this;
    if (xCord >= node.xRange[0] && xCord <= node.xRange[1] &&
      yCord >= node.yRange[0] && yCord <= node.yRange[1]) {
        let addVal = node.val;


        self.canvas.addEventListener('mousemove', function handler(e) {
          console.log('mousemoving');
          const xCordMove = event.offsetX;
          const yCordMove = event.offsetY;
          if (self.skipMouseMove) {
            self.skipMouseMove = false;
            e.currentTarget.removeEventListener(e.type, handler);
          }
          self.dragLine = new DragLine(xCord, yCord, xCordMove, yCordMove);

          self.canvas.addEventListener('mouseup', function handler2(e2) {

            e2.currentTarget.removeEventListener(e2.type, handler2);
            e2.currentTarget.removeEventListener(e.type, handler);
            // self.dragLine = null;
          });
        });
        self.canvas.addEventListener('mouseup', function handler(e) {
          e.currentTarget.removeEventListener(e.type, handler);

          const xCordUp = event.offsetX;
          const yCordUp = event.offsetY;
          if (xCord === xCordUp && yCord === yCordUp) {
            console.log("SAMESIES");
            self.deleteNode(xCord, yCord);
            self.skipMouseMove = true;
            e.currentTarget.removeEventListener(e.type, handler);
            // self.dragLine = null;
            return;
          }
          let addUp = false;
          let sameChain = false;
          let subNodeIdx = 0;
          console.log(self.dragLine);
          const powerBall = new PowerBall(self.dragLine, node);
          self.dragLine.balls.push(powerBall);
          self.dragLine.defaultBall = new PowerBall(self.dragLine, node);
          self.dragLine.associatedNode = node;

          while (subNodeIdx < self.subNodes.length) {
            if (xCordUp >= self.subNodes[subNodeIdx].xRange[0] &&
                xCordUp <= self.subNodes[subNodeIdx].xRange[1] &&
                yCordUp >= self.subNodes[subNodeIdx].yRange[0] &&
                yCordUp <= self.subNodes[subNodeIdx].yRange[1]) {
                if (self.onSameChain(self.subNodes[subNodeIdx], node)) {
                  sameChain = true;
                  break;
                }
                self.subNodes[subNodeIdx].val += addVal;
                self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.subNodes[subNodeIdx];
                self.dragLine.defaultBall.destinationNode = self.subNodes[subNodeIdx];
                self.dragLine.destinationNode = self.subNodes[subNodeIdx];
                self.subNodes[subNodeIdx].updateAddedValues(node.uniqId);
                node.associated.push(self.subNodes[subNodeIdx]);
                node.addLines(self.dragLine);


                let currentCheckNode = [self.subNodes[subNodeIdx]];
                let currentSum = self.subNodes[subNodeIdx].val;
                while (currentCheckNode.length > 0) {
                  let currentNode = currentCheckNode.shift();
                  currentNode.lines.forEach(function(line) {
                      if (line.destinationNode instanceof SubNode) {
                        line.destinationNode.val += addVal;
                        currentCheckNode.push(line.destinationNode);
                      }
                  });
                }
                addUp = true;
                break;
              }
              subNodeIdx += 1;
          }
          let sinkNodeIdx = 0;
          let toSinkNode = false;
          while (sinkNodeIdx < self.sinkNodes.length) {
            if (xCordUp >= self.sinkNodes[sinkNodeIdx].xRange[0] &&
                xCordUp <= self.sinkNodes[sinkNodeIdx].xRange[1] &&
                yCordUp >= self.sinkNodes[sinkNodeIdx].yRange[0] &&
                yCordUp <= self.sinkNodes[sinkNodeIdx].yRange[1]) {

                if (self.sinkNodes[sinkNodeIdx].val === addVal) {
                  //trying to add to subnode instead of sinknode
                  self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.sinkNodes[sinkNodeIdx];
                  self.dragLine.defaultBall.destinationNode = self.sinkNodes[sinkNodeIdx];
                  self.dragLine.destinationNode = self.sinkNodes[sinkNodeIdx];
                  node.associated.push(self.sinkNodes[sinkNodeIdx]);
                  node.addLines(self.dragLine);
                  //taking out for now
                  // self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.sinkNodes[sinkNodeIdx];
                  // self.dragLine.defaultBall.destinationNode = self.sinkNodes[sinkNodeIdx];
                  // self.dragLine.destinationNode = self.sinkNodes[sinkNodeIdx];
                  // node.associated.push(self.sinkNodes[sinkNodeIdx]);
                  // self.sinkNodes[sinkNodeIdx].addLines(self.dragLine);
                }
                toSinkNode = true;
                break;
              }
              sinkNodeIdx += 1;
          }


          if (!addUp && !toSinkNode && !sameChain) {
            let newNode = new SubNode(xCordUp, yCordUp, self.ctx, addVal, node.uniqId);
            self.subNodes.push(newNode);
            self.dragLine.balls[self.dragLine.balls.length - 1].destinationNode = self.subNodes[subNodeIdx];
            self.dragLine.defaultBall.destinationNode = self.subNodes[subNodeIdx];
            self.dragLine.destinationNode = self.subNodes[subNodeIdx];
            node.associated.push(self.subNodes[subNodeIdx]);
            // self.subNodes[subNodeIdx].updateAddedValues(node.id);
            node.addLines(self.dragLine);
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
      // let ball = line.balls[ballIdx];
      let ball = line.balls[0];
      ball.draw(self.ctx);
      ball.updatePosition();
      if (ball.reachedDestination() && ball.destinationNode instanceof SinkNode) {
        ball.destinationNode.currentTally += 1;
        ball.destinationNode.degrees = 360;
      } else if (ball.reachedDestination()) {
        ball.destinationNode.updateAddedValues(ball.associatedNode.uniqId);
      } else {
        if (!ball.destinationNode instanceof SinkNode) {
          ball.destinationNode.setAddedValues(ball.associatedNode.uniqId);
        }
        newBallStore.push(ball);
      }
      ballIdx += 1;
    }
    // console.log(newBallStore.length);
    // console.log();
    line.balls = newBallStore;
  }


  animate(time) {
    if (this.paused === false && this.gameOver === false) {
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
              //did this here so that sinknodes doesn't lose its value
              if (currentSubNode instanceof SubNode) {
                currentSubNode.val -= sourcenode.val;
              }

              currentSubNode.associated.forEach(function(subnode2){
                updateQueue.push(subnode2);
              });
            }
          });
        }
        self.stored = newStore;
        sourcenode.lines.forEach(function(line) {
          line.draw(self.ctx);
        });

        if (sourcenode.countDown === 0) {
          sourcenode.countDown = 200;
          if (sourcenode.lines[sourcenode.lineIdx]) {
            let tester = new DragLine();
            tester.balls.push(new PowerBall(sourcenode.lines[sourcenode.lineIdx],
              sourcenode.lines[sourcenode.lineIdx].associatedNode,
              sourcenode.lines[sourcenode.lineIdx].destinationNode));

            self.lineQueue.push(tester);
            // sourcenode.lines[sourcenode.lineIdx].addBall(sourcenode.lines[sourcenode.lineIdx].defaultBall);
          }
          sourcenode.lineIdx += 1;



          if (sourcenode.lineIdx >= sourcenode.lines.length) {
            sourcenode.lineIdx = 0;
          }


        } else {
          sourcenode.countDown -= 1;
        }


        sourcenode.drawSourceNode(self.ctx);
      });

      if (this.newGame) {
        this.stored.push(new SourceNode(this.stored));
        this.stored.push(new SourceNode(this.stored));
        this.sinkNodes.push(new SinkNode(this.sinkNodes, 5));
        this.newGame = false;
      }

      if (this.interval === 1000) {
        this.stored.push(new SourceNode(this.stored));
        this.sinkNodes.push(new SinkNode(this.sinkNodes));
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
                if (subnode.lines[subnode.lineIdx]) {
                  let tester2 = new DragLine();
                  tester2.balls.push(new PowerBall(
                    subnode.lines[subnode.lineIdx],
                    subnode.lines[subnode.lineIdx].associatedNode,
                    subnode.lines[subnode.lineIdx].destinationNode));
                  self.lineQueue.push(tester2);
                }
                subnode.lineIdx += 1;
                if (subnode.lineIdx >= subnode.lines.length) {
                  subnode.lineIdx = 0;
                }
                subnode.decreaseValuesByOne();
            }

            line.draw(self.ctx);
          });
          subNodeStore.push(subnode);
          subnode.drawSubNode(self.ctx);
        }

      });
      self.subNodes = subNodeStore;


      const sinkNodeStore = [];
      this.sinkNodes.forEach(function(sinknode) {
        sinknode.updateTimeAlive();
        if (sinknode.outOfTime === true) {
          self.gameOver = true;
        }
        if (sinknode.currentTally < sinknode.finalTally) {
          sinknode.lines.forEach(function(line) {
            self.drawBallsFromLine(line);
            line.draw(self.ctx);
          });
          sinkNodeStore.push(sinknode);
          sinknode.drawSinkNode(self.ctx);
        } else {

          self.subNodes.forEach(function(subnode) {
            let newLines = [];
            subnode.lines.forEach(function(line) {
              if (line.destinationNode !== sinknode) {
                newLines.push(line);
              }
            });
            subnode.lines = newLines;
          });

          self.stored.forEach(function(sourcenode) {
            let newLines = [];
            sourcenode.lines.forEach(function(line) {
              if (line.destinationNode !== sinknode) {
                newLines.push(line);
              }
            });
            sourcenode.lines = newLines;
          });
        }

      });
      self.sinkNodes = sinkNodeStore;


      self.lineQueue.forEach(function(line) {
        self.drawBallsFromLine(line);
      });
      // console.log(timeDelta);
      this.lastTime = time;
      // console.log(timeDelta);
      requestAnimationFrame(this.animate.bind(this));
    } else if (this.paused === true) {
      this.game.drawPausedScreen(this.ctx);
      this.ctx.globalAlpha = 1;
    } else {
      this.game.drawGameOverScreen(this.ctx);
    }
  }
}

module.exports = GameView;
