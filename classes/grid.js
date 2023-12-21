class Grid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 3, y: 0 };
    this.enemies = [];

    const rows = Math.ceil(Math.random() * 2)+1;
    const columns = Math.ceil(Math.random() * 5 + 2);
    this.width = (columns * 60)
    // console.log(this.width,);
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        this.enemies.push(
          new Enemy(this.canvas, { position: { x: (i*60), y: j*60 } })
        );
      }
    }
  }
  drawBorder() {
    const borderThickness = 2;
    this.ctx.strokeStyle = "green"; // Set border color
    this.ctx.lineWidth = borderThickness;
    this.ctx.strokeRect(
      this.position.x - borderThickness,
      this.position.y - borderThickness,
      this.width + borderThickness * 2,
      this.canvas.height - this.position.y + borderThickness
    );
  }
  move() {
  //  this.drawBorder()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0
    if (this.position.x + this.width - 7 >= this.canvas.width ||this.position.x <= 0 ) {
this.velocity.x *= -1 // change direction 
this.velocity.y = 60 // move down the grid

    }
  }
}
