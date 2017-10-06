const Game = require("./game");

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
