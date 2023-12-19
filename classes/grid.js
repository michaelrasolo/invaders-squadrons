class Grid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 6, y: 0 };
    this.enemies = [];

    const rows = Math.ceil(Math.random() * 4);
    const columns = Math.ceil(Math.random() * 6 + 2);
    this.width = columns * 60
    console.log(this.width,);
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        this.enemies.push(
          new Enemy(this.canvas, { position: { x: 60 * i, y: 53 * j } })
        );
      }
    }
  }
  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    console.log(this.width + this.position.x, this.canvas.width);
    if (this.position.x + this.width - 7 >= this.canvas.width ||this.position.x <= 0 ) {
this.velocity.x *= -1
    }
  }
}
