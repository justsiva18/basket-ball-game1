const basket = document.getElementById("basket");
const scoreboard = document.getElementById("scoreboard");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const gameContainer = document.getElementById("gameContainer");

let score = 0;
let isPaused = true;
let isGameOver = false;
let ballSpeed = 4;
let spawner;

const updateScore = () => {
  scoreboard.textContent = `Score: ${score}`;
  if (score % 10 === 0 && score !== 0) {
    scoreboard.classList.add('highlight');
    setTimeout(() => scoreboard.classList.remove('highlight'), 500);
  }
};

const updateBackground = () => {
  if (score >= 500) document.body.style.background = "#000 radial-gradient(circle, #fff, #000)";
  else if (score >= 400) document.body.style.background = "#34495e";
  else if (score >= 300) document.body.style.background = "#fd79a8";
  else if (score >= 200) document.body.style.background = "#00b894";
  else if (score >= 100) document.body.style.background = "#e67e22";
  else if (score >= 50)  document.body.style.background = "#9b59b6";
  else document.body.style.background = "#ecf0f1";
};

const spawnBall = () => {
  if (isPaused || isGameOver) return;

  const ball = document.createElement("div");
  ball.classList.add("ball");

  const rand = Math.random();
  if (rand < 0.2) ball.classList.add("fake-ball");
  else if (rand < 0.3) ball.classList.add("bonus-ball");
  else ball.classList.add("real-ball");

  ball.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
  ball.style.top = "-30px";
  gameContainer.appendChild(ball);

  let ballTop = -30;
  const interval = setInterval(() => {
    if (isPaused || isGameOver) {
      clearInterval(interval);
      return;
    }

    ballTop += ballSpeed;
    ball.style.top = `${ballTop}px`;

    if (checkCollision(basket, ball)) {
      clearInterval(interval);

      if (ball.classList.contains("fake-ball")) {
        score = Math.max(0, score - 2);
      } else if (ball.classList.contains("bonus-ball")) {
        score += 3;
        spawnStars(ball.offsetLeft, ball.offsetTop, 10);
      } else {
        score += 1;
      }

      // Speed increases
      if (score >= 10 && score < 15) ballSpeed = 5;
      else if (score >= 15 && score < 20) ballSpeed = 6;
      else if (score >= 20 && score < 25) ballSpeed = 7;
      else if (score >= 25 && score < 35) ballSpeed = 8;
      else if (score >= 35 && score < 40) ballSpeed = 9;
      else if (score >= 40 && score < 50) ballSpeed = 10;
      else if (score >= 50 && score < 100) ballSpeed = 11;
      else if (score >= 100 && score < 200) ballSpeed = 12;
      else if (score >= 200 && score < 300) ballSpeed = 13;
      else if (score >= 300 && score < 400) ballSpeed = 14;
      else if (score >= 400 && score < 500) ballSpeed = 15;
      else if (score >= 500) ballSpeed = 16;

      updateScore();
      updateBackground();
      ball.remove();
    } else if (ballTop >= window.innerHeight) {
      if (ball.classList.contains("real-ball") || ball.classList.contains("bonus-ball")) {
        clearInterval(interval);
        endGame();
      } else {
        ball.remove();
        clearInterval(interval);
      }
    }
  }, 16);
};

const spawnStars = (x, y, count) => {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${x + Math.random() * 20 - 10}px`;
    star.style.top = `${y + Math.random() * 20 - 10}px`;
    gameContainer.appendChild(star);
    setTimeout(() => star.remove(), 1000);
  }
};

const checkCollision = (a, b) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
};

const endGame = () => {
  isGameOver = true;
  isPaused = true;
  finalScore.textContent = `Final Score: ${score}`;
  gameOver.style.display = "block";
  clearInterval(spawner);
};

const restartGame = () => {
  isGameOver = false;
  isPaused = false;
  score = 0;
  ballSpeed = 4;
  updateScore();
  updateBackground();
  document.querySelectorAll(".ball, .star").forEach(el => el.remove());
  gameOver.style.display = "none";
  clearInterval(spawner);
  spawner = setInterval(spawnBall, 1000);
};

startButton.addEventListener("click", () => isPaused = false);
pauseButton.addEventListener("click", () => isPaused = true);
restartButton.addEventListener("click", restartGame);

document.addEventListener("mousemove", (e) => {
  let newLeft = e.clientX - 40;
  newLeft = Math.max(0, Math.min(window.innerWidth - 80, newLeft));
  basket.style.left = `${newLeft}px`;
});

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  let newLeft = touch.pageX - 40;
  newLeft = Math.max(0, Math.min(window.innerWidth - 80, newLeft));
  basket.style.left = `${newLeft}px`;
});

spawner = setInterval(spawnBall, 1000);