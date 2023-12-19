class Enemy {
  constructor(canvas,{position}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.loaded = false;
    const image = new Image();
    image.src = "./assets/TIE Fighter.png";
    image.onload = () => {
      const scale = 1;
      this.width = image.width * scale;
      this.height = image.width * scale;
      this.loaded = true;
      this.image = image;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    this.loaded && ctx.drawImage(this.image, this.position.x, this.position.y);
  }
  move(velocity) {
    if (!this.image || !this.position) return;
this.position.x += velocity.x
this.position.y += velocity.y
  }
}
