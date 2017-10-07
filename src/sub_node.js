class SubNode {
  constructor(x, y, ctx) {
    this.sumVal = 0;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
  }
  drawSubNode() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 70, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }
}

module.exports = SubNode;
