/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Game {
  constructor() {
    this.x = 25;
  }
  step(timeDelta) {
  }
  drawPausedScreen(ctx) {
    ctx.globalAlpha = .4;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.font = "100px Arial";
    ctx.fillText("PAUSED", (Game.DIM_X / 2) - 200, (Game.DIM_Y / 2) + 20);
    ctx.globalAlpha = 1;
  }
}
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.COLORS = {
  1: 'white',
  2: 'yellow',
  3: 'teal',
  4: 'pink',
  5: 'orange',
  6: 'purple',
  7: 'pink',
  8: 'lightgreen',
  9: 'aqua',
  10: 'grey',
  11: 'lightbrown',
  12: 'darkbrown',
  13: 'black'
};

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);
const GameView = __webpack_require__(2);
const Util = __webpack_require__(7);

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('StartButton').addEventListener('click', function() {
    const canvasEl = document.getElementById("canvas");
    canvasEl.width = Game.DIM_X;
    canvasEl.height = Game.DIM_Y;

    const ctx = canvasEl.getContext("2d");
    const game = new Game();
    const gameView = new GameView(game, ctx).start();
  });
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);
const Index = __webpack_require__(1);
const SourceNode = __webpack_require__(3);
const SubNode = __webpack_require__(4);
const DragLine = __webpack_require__(5);
const PowerBall = __webpack_require__(6);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

class SourceNode {
  constructor(stored) {
    this.x = this.generateRandomX();
    this.y = this.generateRandomY();
    this.assureNonOverlapPosition(stored);
    this.uniqId = Math.floor(Math.random() * (10000000000000000)) + 1;
    this.xRange = [this.x - 40, this.x + 40];
    this.yRange = [this.y - 40, this.y + 40];
    this.lines = [];
    this.currentLine = 0;
    this.val = Math.floor(Math.random() * (5)) + 1;
    this.factor = 0.2;
    this.color = SourceNode.ASSOC_COLOR[this.val];
    this.timeAlive = 2500;
    this.associated = [];
  }

  updateTimeAlive() {
    this.timeAlive -= 1;
  }

  addLines(line) {
    this.lines.push(line);
  }


  assureNonOverlapPosition(stored) {
    for (let i = 0; i < stored.length; i++) {
      if (this.x >= stored[i].xRange[0] - 50 &&
          this.x <= stored[i].xRange[1] + 50 &&
          this.y >= stored[i].yRange[0] - 50 &&
          this.y <= stored[i].yRange[1] + 50)
          {
            this.x = this.generateRandomX();
            this.y = this.generateRandomY();
            i = 0;
          }
    }
  }

  generateRandomX() {
    return Math.floor(Math.random() * (Game.DIM_X - 60) + 10);
  }

  generateRandomY() {
    return Math.floor(Math.random() * (Game.DIM_Y - 110) + 10);
  }

  drawSourceNode(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x + 75 * this.factor, this.y + 0 * this.factor);
    ctx.lineTo(this.x + 150 * this.factor,this.y + 100 * this.factor);
    ctx.lineTo(this.x + 75 * this.factor, this.y + 200 * this.factor);
    ctx.lineTo(this.x + 0 * this.factor,this.y + 100 * this.factor);

    //Define the style of the shape
    ctx.lineWidth = 6;

    ctx.strokeStyle = "#000000";
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#000000";
    ctx.fillText(this.val, this.x + 58 * this.factor, this.y + 275 * this.factor);
    ctx.fillStyle = this.color;

    //Close the path
    ctx.closePath();

    //Fill the path with ourline and color
    ctx.fill();
    ctx.stroke();

  }
}

SourceNode.ASSOC_COLOR = {
  1: "#F5F5DC",
  2: "#FFFF00",
  3: "#0000FF",
  4: "#FFA500",
  5: "#28C928"
};

module.exports = SourceNode;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

class SubNode {
  constructor(x, y, ctx, initialVal, sourceId) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.addedValues = {};
    this.uniqId = Math.floor(Math.random() * (10000000000000000)) + 1;
    // this.addValues[String(this.uniqId)] = 0;
    this.lines = [];
    this.xRange = [this.x - 40, this.x + 40];
    this.yRange = [this.y - 40, this.y + 40];
    this.val = initialVal;
    this.associated = [];
    this.lines = [];
    this.count = 0;

  }

  addLines(line) {
    this.lines.push(line);
  }

  isFullyPowered() {
    if (Object.keys(this.addedValues).length === 0) {
      return false;
    }
    let fullyPowered = true;
    Object.keys(this.addedValues).forEach((key) => {
      if (this.addedValues[key] === 0) {
        fullyPowered = false;
      }
    });
    // console.log(this.addedValues);
    // console.log("FULLY POWERED", fullyPowered);
    return fullyPowered;
  }

  decreaseValuesByOne() {
    Object.keys(this.addedValues).forEach((key) => {
      this.addedValues[key] -= 1;
    });
  }

  setAddedValues(id) {
    if (!(String(id) in this.addedValues)) {
      this.addedValues[String(id)] = 0;
      console.log("SETTTTT", this.count,  this.addedValues);
    }

  }

  updateAddedValues(id) {
    this.count += 1;
    let stringId = String(id);
    if (stringId in this.addedValues) {
      this.addedValues[stringId] += 1;
    } else {
      this.addedValues[stringId] = 1;
    }
    // console.log("ADDDEEEEEDDDDDD", this.count,  this.addedValues);
  }


  drawSubNode() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = Game.COLORS[this.val];
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#003300';

    this.ctx.font = "20px Georgia";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(this.val, this.x - 5, this.y + 30);
    this.ctx.fillStyle = this.color;
    this.ctx.stroke();
  }
}

module.exports = SubNode;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

class DragLine {
  constructor(x, y, x2, y2) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.pos = [];
    this.balls = [];
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.strokStyle = "black";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }

  addBall(ball) {
    this.balls.push(ball);
  }
}

module.exports = DragLine;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

class PowerBall {
  constructor(line, node) {
    this.x = line.x;
    this.y = line.y;
    this.x2 = line.x2;
    this.y2 = line.y2;
    this.percent = 1 / Math.sqrt(Math.pow((this.x2-this.x),2) + Math.pow((this.y2-this.y),2));
    this.percentUpdate = this.percent;
    this.associatedNode = node;
    this.destinationNode = null;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
  }

  reachedDestination() {
    return Math.round(this.x2) === Math.round(this.x) &&
    Math.round(this.y2) === Math.round(this.y);
  }

  updatePosition() {
    this.x += (this.x2 - this.x) * this.percent;
    this.y += (this.y2 - this.y) * this.percent;
    this.percent +=   (this.percentUpdate / 100);
  }
}

module.exports = PowerBall;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class Util {
  x() {
    return 1000;
  }
  y() {
    return 400;
  }
}


/***/ })
/******/ ]);