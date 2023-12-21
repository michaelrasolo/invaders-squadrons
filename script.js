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

// CREATE PLAYER
const player = new Player(canvas);
const playerLasers = [];

// CREATE GRID OF ENEMIES
const grids = [new Grid(canvas)];
let frames = 0;
let randomGridInterval = 300;
// Math.floor(Math.random() * 500 + 500);
let gridCreationExecuted = false;
const enemyLasers = [];

// ================ ANIMATION FUNCTION ================ //
function animate() {
  // console.log(frames);
  //   CLEAR THE CANVAS
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //====   PLAYER ANIMATION ====//
  //   Draw and move Player
  for (const direction in keys) {
    if (keys[direction].active) {
      player.move(direction);
    }
  }
  player.draw();

  //   Player shooting
  playerLasers.forEach((laser, i) => {
    if (laser.position.y <= 0) {
      playerLasers.splice(i, 1);
    } else {
      laser.shoot();
    }
  });

  //====   GRID ANIMATION ====//
  // Draw and move enemies grid
  grids.forEach((grid, gridIndex) => {
    const allEnemiesLoaded = grid.enemies.every((enemy) => enemy.loaded);
    if (allEnemiesLoaded) {
      grid.enemies.forEach((enemy, i) => {
        enemy.draw();
        enemy.move(grid.velocity);
        // Remove hit enemies
        playerLasers.forEach((playerLaser, j) => {
          if (
            // Y axis
            playerLaser.position.y - 10 <= enemy.position.y + enemy.width && // Front of laser vs bottom enemy
            playerLaser.position.y >= enemy.position.y && // Back of laser vs front of enemy
            // X axis
            playerLaser.position.x + 1 >= enemy.position.x && // Right of laser vs left of enemy
            playerLaser.position.x - 1 <= enemy.position.x + enemy.width // Left of laser vs right of enemy
          ) {
            setTimeout(() => {
              // Check if enemy & laser to splice are the same
              const enemyFound = grid.enemies.find((enemy2) => {
                return enemy2 === enemy;
              });
              const playerLaserFound = playerLasers.find((laser2) => {
                return laser2 === playerLaser;
              });
              // Removing laser and enemy from arrays
              if (playerLaserFound && enemyFound) {
                grid.enemies.splice(i, 1);
                playerLasers.splice(j, 1);

                if (grid.enemies.length > 0) {
                  const firstEnemy = grid.enemies[0];
                  const lastEnemy = grid.enemies[grid.enemies.length - 1];

                  grid.width =
                    lastEnemy.position.x -
                    firstEnemy.position.x +
                    lastEnemy.width;

                  grid.position.x = firstEnemy.position.x;
                }
                // else {
                //   grids.splice(gridIndex, 1);
                // }
              }
            }, 0);
          }
        });
      });

      grid.move();
      // Enemy shooting
      if (frames % 100 === 0 && grid.enemies.length > 0) {
        grid.enemies[Math.floor(Math.random() * grid.enemies.length)].shoot(
          enemyLasers
        );
      }
    }
    if (
      frames % randomGridInterval === 0 &&
      frames != 0 &&
      !gridCreationExecuted
    ) {
      console.log("Request new grid at", frames);

      grids.push(new Grid(canvas));
      gridCreationExecuted = true;
    }
  });

  // Enemy shooting animation
  enemyLasers.forEach((enemyLaser, index) => {
    if (enemyLaser.position.y > canvas.height) {
      enemyLasers.splice(index, 1);
    } else enemyLaser.shoot();
    // Enemy laser touching player
    if (
      // Y axis
      enemyLaser.position.y >= player.position.y && // Bottom laser vs front player
      // X axis
      enemyLaser.position.x + 1 >= player.position.x && // Right of laser vs left of enemy
      enemyLaser.position.x - 1 <= player.position.x + player.width // Left of laser vs right of enemy
    ) {
      console.log("YOU LOSE");
      return
    }
  });

  requestAnimationFrame(animate);
  frames++;
  gridCreationExecuted = false;
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
      // console.log(playerLasers);
      playerLasers.push(
        new Laser(
          canvas,
          { position: { x: player.position.x + 4, y: player.position.y } },
          "red",
          "up"
        )
      );
      playerLasers.push(
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
