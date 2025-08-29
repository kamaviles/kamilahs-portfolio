//board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;
let context;

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let packmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [ //if you update this, make sure to update rowCount and columnCount
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O", //row 9
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];


const walls = new Set(); //Set can only have unique values
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; //up, down, left, right
let score = 0;
let lives = 3;
let gameOver = false;//true when pacman collides with a ghost

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    loadImages();
    loadMap();
    //console.log(walls.size);
    //console.log(foods.size);
    //console.log(ghosts.size);

    for (let ghost of ghosts.values()) { //sets random direction for each ghost at the start of the game
        const newDirection = directions[Math.floor(Math.random()* 4)]// random # 0-3
        ghost.updateDirection(newDirection);//sets ghost velocity based on random direction
    }
    update(); 

    document.addEventListener("keyup", movePacman); //calls movePacman function when a key is released
}
function loadImages() {
    wallImage = new Image();
    wallImage.src = "images/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "images/blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "images/orangeGhost.png";
    pinkGhostImage = new Image();
    pinkGhostImage.src = "images/pinkGhost.png";   
    redGhostImage = new Image();
    redGhostImage.src = "images/redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "images/pacmanUp.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "images/pacmanDown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "images/pacmanLeft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "images/pacmanRight.png";

}

function loadMap() {
    walls.clear(); //iterates through tileMap and adds walls, foods, pacman, and ghosts to their respective sets
    foods.clear();
    ghosts.clear();

    for(let r = 0; r < rowCount; r++) {
        for (let c = 0; c< columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];//current character in the tile map

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') { //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'b') { //blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { //orange ghost
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { //pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { //red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') { //pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { //empty is food
                const food = new Block(null, x + tileSize/2 - 2 , y + tileSize/2 - 2 , 4, 4); //food is a small square in the center of the tile
                foods.add(food);
            }
        }
    }

}
function update() {//game loop
    if (gameOver) {
        return; //stop the game loop if game is over
    }
    move();
    draw();
    setTimeout(update, 50); //calls update every 50 milliseconds
    //setInterval(update, 50), setTimeout, requestAnimationFrame
    //want to have 20 frames per second (FPS)


}
function draw() {
    context.clearRect(0,0, boardWidth, boardHeight); //clears the board so frames don't overlap
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);// draw pacman first so that he is on top of the walls and food
    for(let ghost of ghosts.values()) {//.values() iterates through the set
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    for(let wall of walls.values()) {//displays walls
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    context.fillStyle = "white"; //draw food as little white squares
    for(let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    //score
    context.fillStyle = "white"; //draw score and lives
    context.font = "14px sans-serif";
    if (gameOver) {
        context.fillText("GAME OVER: " + String(score), tileSize/2, tileSize/2);
    }
    else {
        context.fillText("Lives: " + String(lives) + " Pts: " + String(score), tileSize/2, tileSize/2); 
    }
}
function move() {//handles all movement
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    //check for wall collisions
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            //move pacman back
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break; //no need to check other walls
        }
    }

    for (let ghost of ghosts.values()) {
        if(collision(ghost, pacman)) {
            lives -= 1;
            if (lives == 0) {
                gameOver = true;
               return;
            }
            resetPositions();
        }
        
        if (ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D'){//if ghost is at 9th row and not moving vertically, force it to move up or down
            ghost.updateDirection('U');
        }
       
        ghost.x += ghost.velocityX
        ghost.y += ghost.velocityY;

        //check for wall collisions
        for(let wall of walls.values()) {
            if (collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth) {
                //if ghost collides with wall or goes out of bounds, it will turn around
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                
                //pick a new random direction so that they don't get stuck
                const newDirection = directions[Math.floor(Math.random()* 4)]// random # 0-3
                ghost.updateDirection(newDirection);//sets ghost velocity based on random direction
            }
        }
    }

    //check for food collisions
    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;//store the food that was eaten
            score += 10; 
            break; //no need to check other food
        }
    }
    foods.delete(foodEaten); //remove the eaten food from the set

    //next level
    if (foods.size == 0) {
        loadMap(); //can create a new tilemap here
        resetPositions();
    }
}

function movePacman(e){ //event is the key that was pressed
    if(gameOver) {
        loadMap();
        resetPositions();
        score = 0;
        lives = 3;
        gameOver = false;
        update();
        return;
    }
    
    if (e.code == "ArrowUp" || e.code == "KeyW") { //up arrow or W key
    pacman.updateDirection('U');//updates pacman's direction and velocity
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") { //down arrow or S key
    pacman.updateDirection('D');
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //left arrow or A key
    pacman.updateDirection('L');
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") { //right arrow or D key
    pacman.updateDirection('R');
    }

    //update pacman's image based on direction
    if(pacman.direction == 'U') {
        pacman.image = pacmanUpImage;
    }
    else if(pacman.direction == 'D') {
        pacman.image = pacmanDownImage;
    }
    else if(pacman.direction == 'L') {
        pacman.image = pacmanLeftImage;
    }
    else if(pacman.direction == 'R') {
        pacman.image = pacmanRightImage;
    }
}

function collision(a, b) {//checks if two blocks are colliding
    return (a.x < b.x + b.width) &&
           (a.x + a.width > b.x) &&
           (a.y < b.y + b.height) &&
           (a.y + a.height > b.y);

}

function resetPositions() {//resets pacman and ghosts to their starting positions whenever it collides with a ghost
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;

    for(let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random()* 4)];// random # 0-3
        ghost.updateDirection(newDirection);
    } 
}
class Block { // represents walls, food, pacman, and ghosts
    constructor(image, x, y , width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x; //starting position
        this.startY = y; //starting position
       
        this.direction = 'R'; //starting direction
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {//updates pacman's direction and velocity based on input
        const prevDirection = this.direction;//store previous direction
        this.direction = direction; 
        this.updateVelocity();
        
        this.x += this.velocityX; //move pacman in the new direction
        this.y += this.velocityY; 

        //iterate through walls to see if pacman collides with one
        for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX; //move pacman back
                this.y -= this.velocityY;
                this.direction = prevDirection; //if pacman collides with a wall, revert to previous direction
                this.updateVelocity();
                return; //no need to check other walls
            }
        }
    }
    updateVelocity() {
        if (this.direction == 'U') { //-y direction
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D') { //+y direction
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        }
        else if (this.direction == 'L') { //-x direction
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') { //+x direction
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }
    reset() { //resets pacman to starting position and direction
        this.x = this.startX;
        this.y = this.startY;
    }
}