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
};

//============= DRAWING THE PLAYER =============//
const player = new Player(canvas);
const lasers = [];

function animate() {
  //   CLEAR THE CANVA
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  //====   PLAYER ANIMATION ====//
  //   Player direction
  for (const direction in keys) {
    if (keys[direction].active) {
      player.move(direction);
    }
  }
  player.draw();
  //   Player shooting
  lasers.forEach((laser, i) => {
    if (laser.position.y <= 0) {
      lasers.splice(i, 1);
    } else {
      laser.shoot();
    }
  });
}

animate();

//============= KEY CONTROLLERS =============//
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    // DIRECTION
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
    //   SHOOTING
    case "Space":
        console.log(lasers);
      lasers.push(
        new Laser(
          canvas,
          { position: { x: player.position.x + 4, y: player.position.y } },
          "red",
          "up"
        )
      );
      lasers.push(
        new Laser(
          canvas,
          {
            position: {
              x: player.position.x + player.width - 4,
              y: player.position.y,
            },
          },
          "red",
          "up"
        )
      );
      break;

    default:
      break;
  }
});

// RELEASING THE KEY
document.addEventListener("keyup", (event) => {
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
    default:
      break;
  }
});
