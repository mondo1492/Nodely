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