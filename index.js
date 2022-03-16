const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// TODO: Sprites are too large if canvas is set to original resolution. Try to find a way to scale sprites to fit the canvas.

// Creates a canvas that is 100vh and 100vw
canvas.width = innerWidth;
canvas.height = innerHeight;

// Creates a canvas at original screen dimensions * integer scale
// ? Set a global scale variable to scale the canvas and all objects
// const screenScale = 2;
// canvas.width = 224;
// canvas.height = 256;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./sprites/Player.png";
    image.onload = () => {
      const playerScale = 1;
      this.image = image;
      this.width = image.width * playerScale;
      this.height = image.height * playerScale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.image)
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// This projectile class uses the Laser.png sprite
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    const image = new Image();
    image.src = "./sprites/Laser.png";
    image.onload = () => {
      const projectileScale = 1;
      this.image = image;
      this.width = image.width * projectileScale;
      this.height = image.height * projectileScale;
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

// Projectile class from tutorial
// Draws a circular projectile on to the canvas rather than use a sprite
// class Projectile {
//   constructor({ position, velocity }) {
//     this.position = position;
//     this.velocity = velocity;

//     this.radius = 3;
//   }

//   draw() {
//     c.beginPath();
//     c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
//     c.fillStyle = "red";
//     c.fill();
//     c.closePath();
//   }

//   update() {
//     this.draw();
//     this.position.x += this.velocity.x;
//     this.position.y += this.velocity.y;
//   }
// }

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./sprites/Invader_01-1.png";
    image.onload = () => {
      const invaderScale = 1;
      this.image = image;
      this.width = image.width * invaderScale;
      this.height = image.height * invaderScale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    if (this.image)
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 0.25,
      y: 0,
    };

    this.invaders = [];

    const columns = 11;
    const rows = 5;

    this.width = columns * 32;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(new Invader({ position: { x: x * 32, y: y * 32 } }));
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [new Grid()];

const keys = {
  a: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.height <= 0) {
      // prevents projectiles from flashing on screen
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.height / 2 <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.width / 2 >= invader.position.x &&
          projectile.position.x - projectile.width / 2 <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.height / 2 >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find((invader2) => {
              return invader2 === invader;
            });

            const projectileFound = projectiles.find((projectile2) => {
              return projectile2 === projectile;
            });

            if (invaderFound && projectileFound) {
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);
            }
          }, 0);
        }
      });
    });
  });

  const playerSpeed = 7;

  // ! playerSpeed must be included in the calculations to keep the player from moving off screen
  if (
    (keys.a.pressed || keys.ArrowLeft.pressed) &&
    player.position.x > playerSpeed
  ) {
    player.velocity.x = -playerSpeed;
  } else if (
    (keys.d.pressed || keys.ArrowRight.pressed) &&
    player.position.x < canvas.width - player.width - playerSpeed
  ) {
    player.velocity.x = playerSpeed;
  } else {
    player.velocity.x = 0;
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      keys.ArrowLeft = true;
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      keys.ArrowRight = true;
      break;
    case " ":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: { x: 0, y: -10 },
        })
      );
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      keys.ArrowLeft = false;
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      keys.ArrowRight = false;
      break;
    case " ":
      break;
  }
});

addEventListener("mousedown", ({ button }) => {
  if (button === 0) {
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y,
        },
        velocity: { x: 0, y: -10 },
      })
    );
  }
});
