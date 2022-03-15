const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

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
      // console.log({ x: this.position.x });
    }
  }
}

const player = new Player();
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

  const playerSpeed = 7;

  // ! playerSpeed must be included in the calculations to keep the player from moving off screen
  if (
    (keys.a.pressed || keys.ArrowLeft.pressed) &&
    player.position.x > playerSpeed
  ) {
    player.velocity.x = -playerSpeed;
    console.log({ x: player.position.x });
  } else if (
    (keys.d.pressed || keys.ArrowRight.pressed) &&
    player.position.x < canvas.width - player.width - playerSpeed
  ) {
    player.velocity.x = playerSpeed;
    console.log({ x: player.position.x });
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
      console.log("shoot");
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
      console.log("shoot");
      break;
  }
});

addEventListener("mousedown", ({ button }) => {
  if (button === 0) {
    console.log("left click");
  }
});
