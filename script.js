const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
// KEYS STATES

let keys = {
  left: { active: false },
  right: { active: false },
  up: { active: false },
  down: { active: false },
  space: { active: false },
};

//============= DRAWING THE PLAYER =============//
const player = new Player(canvas);
const lasers = [new Laser(canvas,{position:{x:300, y:300}},"red","up")]

function animate() {
  //   CLEAR THE CANVA
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  for (const direction in keys) {
    if (keys[direction].active) {
      player.move(direction);
    }
  }
  player.draw();
  lasers.forEach(laser => {
    laser.draw()
  });
}

animate();

//============= MOVING THE PLAYER =============//
// PRESSING THE KEY
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      keys.left.active = true;
      break;
    case "ArrowRight":
      keys.right.active = true;
      break;
    case "ArrowUp":
      keys.up.active = true;
      break;
    case "ArrowDown":
      keys.down.active = true;
      break;
    case "Space":
      keys.space.active = true;
      break;

    default:
      break;
  }
});

// RELEASING THE KEY
document.addEventListener("keyup", (event) => {
  //   console.log(event.code);
  switch (event.code) {
    case "ArrowLeft":
      keys.left.active = false;
      break;
    case "ArrowRight":
      keys.right.active = false;
      break;
    case "ArrowUp":
      keys.up.active = false;
      break;
    case "ArrowDown":
      keys.down.active = false;
      break;
    case "Space":
      keys.space.active = false;
      break;

    default:
      break;
  }
});
