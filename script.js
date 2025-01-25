/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gameFrame = 0;
var score = 0;
var Bubbles = [];

const poppingSFX = [
  new Audio("resources/sfxs/pop.mp3"),
  new Audio("resources/sfxs/happy-pop-2-185287.mp3"),
  new Audio("resources/sfxs/bubble-sound-432072.mp3")
];

const mouse = { x: 0, y: 0 };

Object.freeze(poppingSFX, mouse);

function checkPop() {
  var x = mouse.x;
  var y = mouse.y;

  for (let i = 0; i < Bubbles.length; i++) {
    var distance = Math.sqrt(Math.pow((x - Bubbles[i].x), 2) + Math.pow((y - Bubbles[i].y), 2));
    if (!Bubbles[i].isPopped && Bubbles[i].radius >= distance) {
      canvas.style.cursor = "auto";
      score++;
      Bubbles[i].sound.play();
      Bubbles[i].isPopped = true;
      break;
    }
  }
}

function trackMousePos(e) {
  if (canvas.hasAttribute("style")) {
    canvas.removeAttribute("style");
  }
  mouse.x = e.x;
  mouse.y = e.y;
}

class Bubble {
  constructor() {
    this.bubbleSprite = new Image();
    this.bubbleSprite.src = "resources/images/bubbleSprite.png";
    this.spriteFrames = 7;
    this.maxCols = 3;
    this.row = 0;
    this.col = 0;
    this.frame = 0;
    this.sourceWidth = 156;
    this.sourceHeight = 157.5;
    this.radius = rndInt(20, 40);
    this.x = rndInt(this.radius, canvas.width - this.radius);
    this.y = rndInt(this.radius, canvas.height - this.radius);
    this.isPopped = false;
    this.isDeleted = false;
    this.sound = poppingSFX[Math.floor(Math.random() * poppingSFX.length)].cloneNode();
  }
  update() {
    if (gameFrame % 3 == 0 && !this.isPopped) {
      this.x += Math.random() * 2 - 1;
      this.y += Math.random() * 2 - 1;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.drawImage(this.bubbleSprite, this.col * this.sourceWidth, this.row * this.sourceHeight, this.sourceWidth, this.sourceHeight, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    if (this.isPopped && gameFrame % 4 == 0) {
      if (this.frame < this.spriteFrames) {
        if (this.col < this.maxCols) {
          this.col++;
        } else {
          this.col = 0;
          this.row++;
        }
        this.frame++;
      } else {
        this.isDeleted = true;
      }
    }
  }
}

function handleBubbles() {
  if (!Bubbles.length) {
    createBubbles(rndInt(12, 20));
  }

  Bubbles.forEach((bubble) => {
    bubble.draw();
    bubble.update();

    var distance = Math.sqrt(Math.pow((mouse.x - bubble.x), 2) + Math.pow((mouse.y - bubble.y), 2));
    if (bubble.radius >= distance && !bubble.isPopped) {
      canvas.style.cursor = "pointer";

    }
  });

  Bubbles = Bubbles.filter((b) => !b.isDeleted);
}

function createBubbles(num) {
  for (let i = 0; i < num; i++) {
    Bubbles.push(new Bubble());
  }
}

function drawScore() {
  ctx.beginPath();
  ctx.font = "50px cursive";
  ctx.textBaseline = "top";
  ctx.fillStyle = "lightblue";
  ctx.fillText(`Score: ${score}`, 10, 10);
}

function Render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  drawScore();
  gameFrame++;
  requestAnimationFrame(Render);
}

function init() {
  canvas.addEventListener("mousemove", trackMousePos);
  canvas.addEventListener("click", checkPop);
  requestAnimationFrame(Render)
}

document.onreadystatechange = function () {
  ctx.font = "40px Arial";
  ctx.fillText("hello world", canvas.width / 2, canvas.height / 2);
}

window.addEventListener("load", init);

function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}