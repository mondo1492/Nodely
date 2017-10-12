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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);
const GameView = __webpack_require__(2);
const Util = __webpack_require__(6);

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("canvas");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
  
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);
const Index = __webpack_require__(1);
const SourceNode = __webpack_require__(3);
const SubNode = __webpack_require__(4);
const DragLine = __webpack_require__(5);

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
              let addVal = sourcenode.val;
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
                sourcenode.addLines(self.dragLine);
                while (subNodeIdx < self.subNodes.length) {
                  if (xCordUp >= self.subNodes[subNodeIdx].xRange[0] && xCordUp <= self.subNodes[subNodeIdx].xRange[1] &&
                    yCordUp >= self.subNodes[subNodeIdx].yRange[0] && yCordUp <= self.subNodes[subNodeIdx].yRange[1]) {
                      self.subNodes[subNodeIdx].val += addVal;
                      self.lines.push(self.dragLine);
                      sourcenode.addLines(self.dragLine);
                      addUp = true;
                      break;
                    }
                    subNodeIdx += 1;
                }
                if (addUp === false) {
                  const subNode2 = new SubNode(xCordUp, yCordUp, self.ctx, addVal);
                  self.subNodes.push(subNode2);
                  sourcenode.addLines(self.dragLine);
                } else {
                  addUp = false;
                }
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
                      self.lines.push(self.dragLine);
                      break;
                    }
                    subNodeIdx += 1;
                }
                if (addUp === false) {
                  const subNode2 = new SubNode(xCordUp, yCordUp, self.ctx, addVal);
                  self.subNodes.push(subNode2);
                  self.lines.push(self.dragLine);
                } else {
                  addUp = false;
                }
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
      console.log("LINES", sourcenode.lines);
      sourcenode.lines.forEach(function(line) {
        line.draw(self.ctx);
      });
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


    console.log(this.stored);
    console.log(this.subNodes);
    requestAnimationFrame(this.animate.bind(this));
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
    this.xRange = [this.x - 40, this.x + 40];
    this.yRange = [this.y - 40, this.y + 40];
    this.lines = [];
    this.val = Math.floor(Math.random() * (5)) + 1;
    this.factor = 0.2;
    this.color = SourceNode.ASSOC_COLOR[this.val];
    this.timeAlive = 1000;
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
/***/ (function(module, exports) {

class SubNode {
  constructor(x, y, ctx, initialVal) {
    this.sumVal = 0;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.xRange = [this.x - 40, this.x + 40];
    this.yRange = [this.y - 40, this.y + 40];
    this.val = initialVal;
  }
  drawSubNode() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'green';
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
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.strokStyle = "black";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}

module.exports = DragLine;


/***/ }),
/* 6 */
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