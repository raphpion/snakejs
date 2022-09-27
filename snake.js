// DOM elements
const screen = document.getElementById('snake-js');
const ctx = screen.getContext('2d');

const gameOverMenu = document.getElementById('snake-game-over');
const gameOverNewHiscore = document.getElementById('snake-game-over-new-hiscore');
const gameOverScore = document.getElementById('snake-game-over-score');
const gameOverHiscore = document.getElementById('snake-game-over-hiscore');
const gameOverBtn = document.getElementById('snake-game-over-reset');
const pauseMenu = document.getElementById('snake-pause');

window.addEventListener('keydown', onKeyDown);
gameOverBtn.addEventListener('click', resetGame);

// Game variables
const GAME_WIDTH = 525;
const GAME_HEIGHT = 525;
const CELL_SIZE = 25;
const MOVE_SPEED = 166;

let deltaT = 0;
let startT = 0;

let gamePaused = false;
let gameOver = false;

const snake = {
  intervalId: null,
  parts: [{ x: 10, y: 10 }],
  direction: {
    x: 0,
    y: 0,
  },
  draw() {
    ctx.fillStyle = '#4573e8';
    for (const part of snake.parts) ctx.fillRect(part.x * CELL_SIZE, part.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  },
  move() {
    if (gamePaused || gameOver) return;

    const currentPart = snake.parts[snake.parts.length - 1];
    snake.parts.push({ x: currentPart.x + snake.direction.x, y: currentPart.y + snake.direction.y });

    let newPart = false;

    for (const part of snake.parts) {
      if (part.x === apple.position.x && part.y === apple.position.y) {
        newPart = true;
        apple.spawn();
      }
    }

    if (!newPart) snake.parts.shift();

    const head = snake.parts[snake.parts.length - 1];

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x > GAME_WIDTH / CELL_SIZE ||
      head.y > GAME_HEIGHT / CELL_SIZE ||
      (snake.parts.length > 1 && snake.parts.slice(0, snake.parts.length - 2).find(part => part.x === head.x && part.y === head.y))
    ) {
      gameOver = true;

      const score = snake.parts.length;
      let hiscore = localStorage.getItem('hiscore');
      if (hiscore === null) hiscore = 0;

      if (snake.parts.length > hiscore) {
        gameOverNewHiscore.style.display = 'block';
        hiscore = score;
        localStorage.setItem('hiscore', score);
      } else gameOverNewHiscore.style.display = 'none';

      gameOverScore.innerHTML = score;
      gameOverHiscore.innerHTML = hiscore;

      pauseMenu.style.display = 'none';
      gameOverMenu.style.display = 'flex';
    }
  },
};

const apple = {
  position: { x: -1, y: -1 },
  draw() {
    ctx.fillStyle = '#f8312f';
    ctx.fillRect(apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  },
  spawn() {
    let newPos;
    let positionIsValid = false;
    while (!positionIsValid) {
      newPos = { x: Math.floor(Math.random() * 15), y: Math.floor(Math.random() * 15) };
      positionIsValid = snake.parts.find(part => part.x === newPos.x && part.y === newPos.y) === undefined;
    }
    apple.position = newPos;
  },
};

// Handlers
function drawGame(timestamp) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  deltaT = timestamp - startT;
  startT = timestamp;

  for (let i = 0; i < GAME_WIDTH / CELL_SIZE; i++)
    for (let j = 0; j < GAME_HEIGHT / CELL_SIZE; j++) {
      if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) ctx.fillStyle = '#aad751';
      else ctx.fillStyle = '#a2d149';
      ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

  apple.draw();
  snake.draw();

  requestAnimationFrame(drawGame);
}

function onKeyDown(e) {
  switch (e.key.toLowerCase()) {
    case 'w':
      if (gamePaused || gameOver) break;
      snake.direction = { x: 0, y: -1 };
      break;
    case 's':
      if (gamePaused || gameOver) break;
      snake.direction = { x: 0, y: 1 };
      break;
    case 'a':
      if (gamePaused || gameOver) break;
      snake.direction = { x: -1, y: 0 };
      break;
    case 'd':
      if (gamePaused || gameOver) break;
      snake.direction = { x: 1, y: 0 };
      break;
    case 'escape':
      if (gameOver) break;
      gamePaused = !gamePaused;
      pauseMenu.style.display = gamePaused ? 'flex' : 'none';
    default:
      break;
  }
}

function resetGame() {
  snake.parts = [{ x: 10, y: 10 }];
  snake.direction = { x: 0, y: 0 };

  apple.spawn();

  gameOverMenu.style.display = 'none';

  gameOver = false;
  gamePaused = false;
}

// Init game
requestAnimationFrame(drawGame);
snake.intervalId = setInterval(snake.move, MOVE_SPEED);
apple.spawn();
