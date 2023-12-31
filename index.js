const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
const FACING_DOWN = 2;
const FACING_UP = 0;
const FACING_LEFT = 3;
const FACING_RIGHT = 1;
const FRAME_LIMIT = 12;
const MOVEMENT_SPEED = 1;

let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

let bombImage = new Image();
let stones = [new Image(), new Image()];
let bombPlanted = false;
let bombPositionX = 0;
let bombPositionY = 0;

let bombPlantedMultiple = [];
let bombPositionMultiple = [];

let canvas = document.querySelector('canvas');

let ctx = canvas.getContext('2d');
let keyPresses = {};
let currentDirection = FACING_DOWN;
let bombDirection = FACING_DOWN;
let stopMovingBomb = false;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 0;
let positionY = 0;
let wallMade = false;
let img = new Image();

let powers = ['DROP', 'THROW'];
currentPower = powers[0];

canvas.height  = CANVAS_HEIGHT;
canvas.width  = CANVAS_WIDTH;

let obstacles = [];

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function loadImage() {
    obstacles = mapMetaArray;
    
    img.src = 'assets/bustling/bustling.png';
    img.onload = function() {
        window.requestAnimationFrame(gameLoop);
    };
    // d3.json("maps/map_0.json").then(function(obstaclesMeta) {
    // });

    bombImage.src = 'assets/bomb/bomb_1.png';

    stones.forEach(
        (stone, index) => stone.src = `assets/stone/rock_${index}.png`
    );

    loadCharacter();

    // let canInterval = setInterval(() => {
    //     CANVAS_HEIGHT = CANVAS_HEIGHT - 50;
    //     CANVAS_WIDTH = CANVAS_WIDTH - 50;

    //     if(CANVAS_HEIGHT < 50) {
    //         clearInterval(canInterval);
    //     }

    //     canvas.height  = CANVAS_HEIGHT;
    //     canvas.width  = CANVAS_WIDTH;
    // }, 1000 * 60 * 1)

}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadCharacter() {
    let posX = randomInteger(0,600);
    let posY = randomInteger(0,600);
    if(obstacles.every(
        obstacle => 
        (
            Math.abs(posX - obstacle.stoneX) > 40
            ||
            Math.abs(posY - obstacle.stoneY) > 40
        )
    )){
        positionX = posX;
        positionY = posY;
    }else{
        loadCharacter();
    }
}

function drawFrame(frameX, frameY, canvasX, canvasY) {

    ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);

    if(bombPlanted){
        if(currentPower === 'DROP'){
            ctx.drawImage(bombImage,
                0, 0, WIDTH, HEIGHT,
                bombPositionX, bombPositionY, SCALED_WIDTH, SCALED_HEIGHT);
        }else if(currentPower === 'THROW'){
            switch(bombDirection){
                case FACING_DOWN:
                    bombPositionY += stopMovingBomb ? 0 : 2;
                    break;
                case FACING_UP:
                    bombPositionY -= stopMovingBomb ? 0 : 2;
                    break;
                case FACING_LEFT:
                    bombPositionX -= stopMovingBomb ? 0 : 2;
                    break;
                case FACING_RIGHT:
                    bombPositionX += stopMovingBomb ? 0 : 2;
                    break;
                default:
                    break;
            }
            ctx.drawImage(bombImage,
                0, 0, WIDTH, HEIGHT,
                bombPositionX, bombPositionY, SCALED_WIDTH, SCALED_HEIGHT);
            
        }else {
            ctx.drawImage(bombImage,
                0, 0, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
        }
    }

    obstacles.forEach(
        (obstacle) => {
            ctx.drawImage(stones[0],
            0, 0, 32, 36,
            obstacle.stoneX, obstacle.stoneY, SCALED_WIDTH, SCALED_HEIGHT);
        }
    )

}

loadImage();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
    hasMoved = true;
  }

  if(keyPresses.q && !bombPlanted) {
    currentPower = powers[
        (powers.indexOf(currentPower) + 1) % 2
    ];
  }

  if(keyPresses.e && !wallMade){
    switch(currentDirection){
        case FACING_DOWN:
            obstacles.push({
                stoneX: positionX,
                stoneY: positionY + 35
            });
            break;
        case FACING_UP:
            obstacles.push({
                stoneX: positionX,
                stoneY: positionY - 35
            });
            break;
        case FACING_LEFT:
            obstacles.push({
                stoneX: positionX - 35,
                stoneY: positionY
            });
            break;
        case FACING_RIGHT:
            obstacles.push({
                stoneX: positionX + 35,
                stoneY: positionY
            });
            break;
        default:
            break;
    }
    wallMade = true;
    setTimeout(()=>{
        wallMade = false;
    }, 3000)
  }

  if(keyPresses[' '] && !bombPlanted){
    bombPlanted = true;
    bombPositionX = positionX;
    bombPositionY = positionY;
    bombDirection = currentDirection;
    stopMovingBomb = false;

    bombImage.src = 'assets/bomb/bomb_1.png';
    
    let time = 1;

    const interval = setInterval(()=>{
        bombImage.src = `assets/bomb/bomb_${++time}.png`;
        stopMovingBomb = time > 3;
    }, currentPower === 'THROW' ? 400 : 800)
    

    setTimeout(()=>{
        console.log('boom');
        obstacles = obstacles.filter(
            obstacle => 
            (
                Math.abs(bombPositionX - obstacle.stoneX) > 40
                ||
                Math.abs(bombPositionY - obstacle.stoneY) > 40
            )
        )

        bombPlanted = false;
        clearInterval(interval);
    }, currentPower === 'THROW' ? 1400 : 3000)
  }

 
  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0;
      }
    }
  }
  
  if (!hasMoved) {
    currentLoopIndex = 0;
  }

  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
  if (
    positionX + deltaX > 0
    &&
    positionX + SCALED_WIDTH + deltaX < canvas.width
    &&
    obstacles.every(obstacle => (
        positionX + SCALED_WIDTH + deltaX < obstacle.stoneX
        ||
        positionX + SCALED_WIDTH + deltaX > obstacle.stoneX + 64
        ||
        positionY + SCALED_HEIGHT + deltaY < obstacle.stoneY
        ||
        positionY + SCALED_HEIGHT + deltaY > obstacle.stoneY + 64
    ))) {
    positionX += deltaX;
  }
  if (
    positionY + deltaY > 0
    &&
    positionY + SCALED_HEIGHT + deltaY < canvas.height
    &&
    obstacles.every(obstacle => (
        positionY + SCALED_HEIGHT + deltaY < obstacle.stoneY
        ||
        positionY + SCALED_HEIGHT + deltaY > obstacle.stoneY + 64
        ||
        positionX + SCALED_WIDTH + deltaX < obstacle.stoneX
        ||
        positionX + SCALED_WIDTH + deltaX > obstacle.stoneX + 64
    ))) {
    positionY += deltaY;
  }
  currentDirection = direction;
}