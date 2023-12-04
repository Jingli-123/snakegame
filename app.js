const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() methord will return a canvas' drawing context
// drawing context is for drawing within canvas
// google canvasRenderingContext2D
const unit = 20;
const row = canvas.height / unit; // 320/ 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = []; //the element is an object in this array
// the each object in this array is for store the x y position
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}
//init game
createSnake();
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);
    this.x = new_x;
    this.y = new_y;
  }
}

let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);

let d = "Right";
function changeDirection(event) {
  //console.log(event);
  if (event.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (event.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (event.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (event.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }
  //bug, when you press the arrow key too fast, it will cause the death of snake
  //to fix this bug, use remove listener to avoid this bug
  //the meanning is between press the two keys, dont allow any event of press keyboard.
  window.removeEventListener("keydown", changeDirection);
}

//score settings
let score = 0;
document.getElementById("myScore").innerHTML = "Score: " + score;
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML =
  "HightestScore: " + highestScore;

function draw() {
  //check if the head of snake is touch snake's body or not.
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game over");
      return;
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();
  console.log("Drawing...");
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //use d to decide the next moving step of snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //eats or not eats
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //refresh the fruit and update the score
    myFruit.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "Score: " + score;
  } else {
    snake.pop();
  }
  //snake.pop();
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 150);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
    document.getElementById("myScore2").innerHTML =
      "HightestScore: " + highestScore;
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
