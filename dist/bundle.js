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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const GameView = __webpack_require__(2);
const Util = __webpack_require__(4);

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("canvas");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});


/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const Index = __webpack_require__(0);
const SourceNode = __webpack_require__(3);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);

class SourceNode {
  constructor(val) {
    this.x = Math.floor(Math.random() * (Game.DIM_X - 150)); //fix so that it takes up right amount of space in canvas
    this.y = Math.floor(Math.random() * (Game.DIM_Y - 200));
    this.val = Math.floor(Math.random() * (5)) + 1;
    this.factor = 0.5;
    this.color = SourceNode.ASSOC_COLOR[this.val];
  }

  drawSourceNode(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x + 75 * this.factor, this.y + 0* this.factor);
    ctx.lineTo(this.x + 150* this.factor,this.y + 100* this.factor);
    ctx.lineTo(this.x + 75* this.factor, this.y + 200* this.factor);
    ctx.lineTo(this.x + 0* this.factor,this.y + 100* this.factor);

    //Define the style of the shape
    ctx.lineWidth = 10;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    ctx.fillText(this.val,this.x + 150* this.factor, this.y+100* this.factor);
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

}

module.exports = SourceNode;


/***/ }),
/* 4 */
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