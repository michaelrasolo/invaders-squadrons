const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
const scoreContainer = document.querySelector("#score");
const highScoreContainer = document.querySelector("#high");
const startBtn = document.querySelector("#start");
const startScreen = document.querySelector(".startScreen");

// GAME STATE
let game = { over: false, active: true };
let score = 0;
let highScore = localStorage.getItem("invader-highscore") || 0;
highScoreContainer.textContent = highScore;
let lastFrameTime = 0;
const targetFrameDuration = 1000 / 60; // 60 FPS
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
let randomGridInterval = Math.floor(Math.random() * 300 + 300);
let gridCreationExecuted = false;
const enemyLasers = [];
const particles = [];

// CREATE STAR BACKGROUND

for (let index = 0; index < 50; index++) {
  particles.push(
    new Particle(
      canvas,
      {
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
      },
      {
        velocity: {
          x: 0,
          y: 1,
        },
      },
      Math.random() * 2,
      "white"
    )
  );
}

// ================ ANIMATION FUNCTION ================ //
function animate() {
  const now = performance.now();
  const elapsedTime = now - lastFrameTime;
  // Only proceed if enough time has elapsed since the last frame
  if (elapsedTime >= targetFrameDuration){
    lastFrameTime = now;
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
  // Explosion animation
  function createExplosion(target, color, fade) {
    for (let index = 0; index < 15; index++) {
      particles.push(
        new Particle(
          canvas,
          {
            position: {
              x: target.position.x + target.width / 2,
              y: target.position.y + target.height / 2,
            },
          },
          {
            velocity: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
            },
          },
          Math.random() * 3,
          color,
          fade
        )
      );
    }
  }
  // Background animation
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      // console.log("background");
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else particle.update();
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
            // Create the explotion
            createExplosion(enemy, "#d66000", true);
            // console.log(particles);
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
                score += 100;
                scoreContainer.textContent = score;
                if (score > highScore) {
                  highScore = score;
                  highScoreContainer.textContent = highScore;
                  localStorage.setItem("invader-highscore", highScore);
                }
                // console.log(score);
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
      // console.log("Request new grid at", frames);

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
      createExplosion(player, "white", true);
      enemyLasers.splice(index, 1);
      player.opacity = 0;

      game.over = true;
      setTimeout(() => {
        game.active = false;
      }, 1200);
    }
  });
  if (!game.active) {
    return;
  }}
  requestAnimationFrame(animate);
  frames++;
  gridCreationExecuted = false;
}

// START THE GAME
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  animate();
});

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
  if (!game.over) {
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
  }
});
