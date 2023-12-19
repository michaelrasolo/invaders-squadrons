// const redGradient = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
//     redGradient.addColorStop(0, "fb8429");
//     redGradient.addColorStop(1, "d3181b");

class Laser {
  constructor(canvas, { position }, color, direction) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.position = position;
    this.speed = 10;
    this.color = color;
    this.direction = direction;
  }

  //
  draw() {
    // Drawing
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(this.position.x, this.position.y - 20);
    this.ctx.lineWidth = 3;
    // Color condition
    this.ctx.strokeStyle = "red";

    this.ctx.stroke();
    this.ctx.closePath();
  }

  move(direction){
    if (direction === "up") {
        
    }
  }
}
