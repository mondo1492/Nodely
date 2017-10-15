class PowerBall {
  constructor(line, node) {
    this.x = line.x;
    this.y = line.y;
    this.x2 = line.x2;
    this.y2 = line.y2;
    this.percent = 1 / Math.sqrt(Math.pow((this.x2-this.x),2) + Math.pow((this.y2-this.y),2));
    this.associatedNode = node;
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

  collideWith() {

  }

  updatePosition() {
    this.x += (this.x2 - this.x) * this.percent;
    this.y += (this.y2 - this.y) * this.percent;
    this.percent += .00001;
  }
}

module.exports = PowerBall;
