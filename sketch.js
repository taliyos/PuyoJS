new p5();
var tempPuyos = [];
var collisionMap = []; // List of numbers, 1 or 0
var grid;
var gridSize;
var possibleColors = [];
var analyzer = new ChainAnalyzer();

var temp = false;

// CONSTANT PUYO PROPERTIES
var speed = 2;
var chainLength = 4;

var activePuyo; // Currently falling PuyoContainer
var falling = false;

var waitFrames = 15;
var frames = 0;

var done = false;

function setup() {
    createCanvas(192, 384);
    rectMode(CENTER);
    frameRate(60);

    // Puyo Colors
    possibleColors.push(color(255, 0, 0));
    possibleColors.push(color(0, 255, 0));
    possibleColors.push(color(0, 0, 255));
    possibleColors.push(color(255, 255, 0));
    possibleColors.push(color(196, 64, 219));

    // GRID
    grid = {
        x: 6,
        y: 12
    };
    gridSize = 32;

    // Intialize collision map
    initalizeCollisions(grid.x + 2, grid.y + 1);

    // Initialize full puyomap
    for (var y = 0; y < grid.y; y++) {
        for (var x = 0; x < grid.x; x++) {
            puyos.push(new PuyoMap(x, y, null, true));
        }
    }

    // Create the first puyos
    activePuyo = new PuyoContainer();
}

function draw() {
    // Grid
    drawGrid();
    // Update Falling Puyo
    activePuyo.Update();

    // Check if the falling puyo has collided and is not at ending condition
    if (activePuyo.status == 2 && puyos[2].default && !falling) {
        //inactivePuyos.push(activePuyo); // Move falling puyo to list of fallen puyos
        if (!done) {
            analyzer.AnalyzeChains(); // Check for a chain of 4
            done = true;
        }
        if (frames >= waitFrames && !temp) {
            activePuyo = new PuyoContainer(); // Create a new falling puyo
            frames = 0;
            done = false;
        } else frames++;
        if (frames > waitFrames) frames = waitFrames; // Stops overflow if temp is checked


    }
    for (var i = 0; i < puyos.length; i++) {
        if (puyos[i].default) continue;
        puyos[i].puyo.Update(); // Update each puyo that has already fallen
    }

    falling = false;
    UpdateTemp();
}


function UpdateTemp() {
    for (var i = 0; i < tempPuyos.length; i++) {
        tempPuyos[i].Update();
    }
    UpdateTempCollision();
    while (!UpdateTempCollision());
}

function UpdateTempCollision() {
    for (var i = 0; i < tempPuyos.length; i++) {
        tempPuyos[i].Collision();
        if (tempPuyos[i].collision) {
            console.log("SPLICER");
            tempPuyos.splice(i);
            i--;
            //return false;
        } else {
            falling = true;
        }
    }
    return true;
}

function drawGrid() {
    var col = 0;
    for (var x = 0; x < grid.x; x++) {
        if (col == 0) {
            fill(100);
            col = 1;
        } else {
            fill(200);
            col = 0;
        }
        for (var y = 0; y < grid.y; y++) {
            if (col == 0) {
                fill(100);
                col = 1;
            } else {
                fill(200);
                col = 0;
            }
            noStroke();
            rect(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize, gridSize);
        }
    }
}


function keyPressed() {
    var rotation = 0;
    var movement = 0;
    if (keyCode == LEFT_ARROW) {
        rotation -= 1;
    }
    if (keyCode == RIGHT_ARROW) {
        rotation += 1;
    }

    if (keyCode == 65) {
        movement -= 1;
    }
    if (keyCode == 68) {
        movement += 1;
    }

    if (rotation != 0) {
        activePuyo.AddRotation(rotation, false);
    }
    if (movement != 0) {
        activePuyo.Move(movement);
    }
}