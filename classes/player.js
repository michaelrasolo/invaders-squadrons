class Player {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.speed = 5;
    this.loaded = false;
    const image = new Image();
    image.src = "./assets/X Wing.png";
    image.onload = () => {
      const scale = 1;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.loaded = true;
      this.image = image;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height,
      };
    };
    this.rotation = 0;
  }

  draw() {
    this.loaded && this.ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  move(direction) {
    if (!this.position) return;
    // console.log(direction);
    switch (direction) {
      case "left":
        if (this.position.x >= this.speed) {
          this.position.x -= this.speed;
        }
        break;
      case "right":
        if (this.position.x + this.width <= canvas.width) {
          this.position.x += this.speed;
        }
        break
      case "up":
        if (this.position.y >= this.speed) {
          this.position.y -= this.speed;
        }
        break
      case "down":
        if (this.position.y + this.height +1<= canvas.height) {
          this.position.y += this.speed;
        }
        break
    }
  }
}
